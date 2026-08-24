"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Shield,
  Zap,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowRight,
  HelpCircle,
  Car,
  Layers,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Gauge,
  Activity,
  Cpu,
  RefreshCw,
  Eye,
  Camera,
  Flame,
  Check
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════
// PROVINCIAL DATA & INSTALLATION TARIFFS
// ═══════════════════════════════════════════════════════════════════════════
interface ProvinceTariff {
  id: string
  name: string
  region: "Pichincha / DMQ" | "Sierra" | "Costa" | "Oriente" | "Galápagos"
  installCost: number
  warrantyMonths: number
  badgeText: string
  flag: string
}

const PROVINCES_DATA: ProvinceTariff[] = [
  { id: "quito", name: "Pichincha (Quito / Valles)", region: "Pichincha / DMQ", installCost: 75.00, warrantyMonths: 24, badgeText: "⚡ Mando Inmediato 24h", flag: "🟡🔴" },
  { id: "guayas", name: "Guayas (Guayaquil / Samborondón / Daule)", region: "Costa", installCost: 115.00, warrantyMonths: 24, badgeText: "🛡️ Técnicos en Sitio", flag: "🔵⚪" },
  { id: "azuay", name: "Azuay (Cuenca / Gualaceo)", region: "Sierra", installCost: 95.00, warrantyMonths: 24, badgeText: "🚗 Cobertura Austro", flag: "🟡🔴" },
  { id: "manabi", name: "Manabí (Manta / Portoviejo)", region: "Costa", installCost: 115.00, warrantyMonths: 24, badgeText: "🌊 Cobertura Costa", flag: "🟢🔴" },
  { id: "tungurahua", name: "Tungurahua (Ambato)", region: "Sierra", installCost: 95.00, warrantyMonths: 24, badgeText: "⛰️ Centro Sierra", flag: "🔴🟢" },
  { id: "el-oro", name: "El Oro (Machala / Pasaje)", region: "Costa", installCost: 115.00, warrantyMonths: 24, badgeText: "🍌 Frontera Sur", flag: "🟡🟢" },
  { id: "imbabura", name: "Imbabura (Ibarra / Otavalo)", region: "Sierra", installCost: 95.00, warrantyMonths: 24, badgeText: "🏔️ Sierra Norte", flag: "🔴🟡" },
  { id: "chimborazo", name: "Chimborazo (Riobamba)", region: "Sierra", installCost: 95.00, warrantyMonths: 24, badgeText: "🌋 Sierra Central", flag: "🔴🔵" },
  { id: "loja", name: "Loja (Loja / Catamayo)", region: "Sierra", installCost: 115.00, warrantyMonths: 24, badgeText: "🏰 Región Sur", flag: "🟡🔴" },
  { id: "santo-domingo", name: "Santo Domingo de los Tsáchilas", region: "Costa", installCost: 105.00, warrantyMonths: 24, badgeText: "🌴 Eje Vial Principal", flag: "🔴🟢" },
  { id: "santa-elena", name: "Santa Elena (Salinas / La Libertad)", region: "Costa", installCost: 115.00, warrantyMonths: 24, badgeText: "🏖️ Península", flag: "🔵🟡" },
  { id: "los-rios", name: "Los Ríos (Babahoyo / Quevedo)", region: "Costa", installCost: 115.00, warrantyMonths: 24, badgeText: "🚜 Zona Agrícola", flag: "🟢⚪" },
  { id: "cotopaxi", name: "Cotopaxi (Latacunga)", region: "Sierra", installCost: 95.00, warrantyMonths: 24, badgeText: "🗻 Sierra Centro", flag: "🔴🔵" },
  { id: "esmeraldas", name: "Esmeraldas", region: "Costa", installCost: 125.00, warrantyMonths: 24, badgeText: "🥥 Costa Norte", flag: "⚪🟢" },
  { id: "carchi", name: "Carchi (Tulcán)", region: "Sierra", installCost: 105.00, warrantyMonths: 24, badgeText: "⛰️ Frontera Norte", flag: "🟡🔴" },
  { id: "bolivar", name: "Bolívar (Guaranda)", region: "Sierra", installCost: 105.00, warrantyMonths: 24, badgeText: "🌲 Sierra Occidental", flag: "🔴🟢" },
  { id: "canar", name: "Cañar (Azogues)", region: "Sierra", installCost: 105.00, warrantyMonths: 24, badgeText: "🏰 Zona Austral", flag: "🟡🔵" },
  { id: "pastaza", name: "Pastaza (Puyo)", region: "Oriente", installCost: 135.00, warrantyMonths: 24, badgeText: "🌳 Amazonía", flag: "🟢🟡" },
  { id: "napo", name: "Napo (Tena)", region: "Oriente", installCost: 135.00, warrantyMonths: 24, badgeText: "🌿 Amazonía Norte", flag: "🟡🔵" },
  { id: "sucumbios", name: "Sucumbíos (Lago Agrio)", region: "Oriente", installCost: 145.00, warrantyMonths: 24, badgeText: "🛢️ Oriente Norte", flag: "🟢⚪" },
  { id: "orellana", name: "Orellana (Coca)", region: "Oriente", installCost: 145.00, warrantyMonths: 24, badgeText: "🌴 Amazonía Central", flag: "🟢🟡" },
  { id: "morona-santiago", name: "Morona Santiago (Macas)", region: "Oriente", installCost: 145.00, warrantyMonths: 24, badgeText: "🎋 Amazonía Sur", flag: "🔴🟡" },
  { id: "zamora-chinchipe", name: "Zamora Chinchipe (Zamora)", region: "Oriente", installCost: 145.00, warrantyMonths: 24, badgeText: "⛏️ Región Amazónica", flag: "🟢🔴" },
  { id: "galapagos", name: "Galápagos (Santa Cruz / San Cristóbal)", region: "Galápagos", installCost: 185.00, warrantyMonths: 24, badgeText: "🐢 Logística Aérea", flag: "🟢⚪" }
]

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT DATA INTERFACE
// ═══════════════════════════════════════════════════════════════════════════
export interface BarreraProduct {
  id: string
  name: string
  brand: "ZKTeco" | "Hikvision" | "Dahua" | "Ditec" | "Garen" | "Highteck"
  brandName: string
  armLength: string
  armType: "retractil" | "fijo" | "led"
  armTypeLabel: string
  traffic: "continuo" | "alto" | "estandar"
  speed: string
  cycles: string
  motor: string
  direction: string
  voltage: string
  priceBaseWithoutVat: number
  priceWithVat: number
  compareAtPrice: number
  image: string
  badge: string
  highlights: string[]
  specs: { [key: string]: string }
  differentiator: string
  description: string
  popular?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// THE 15 HOMOLOGATED VEHICULAR BARRIER PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════
export const BARRERAS_PRODUCTS: BarreraProduct[] = [
  // ─── PAR 1A: ZKTECO BG1030 ───
  {
    id: "bar-zk-bg1030",
    name: "Barrera Vehicular ZKTeco BG1030 (Brazo 3m, 1.5s Ajustable, 24V DC)",
    brand: "ZKTeco",
    brandName: "ZKTeco Global",
    armLength: "3 Metros",
    armType: "fijo",
    armTypeLabel: "Brazo Fijo de Aluminio 3m",
    traffic: "continuo",
    speed: "1.5 seg (Ajustable)",
    cycles: "3.000.000 Ciclos",
    motor: "DC Brushless 24V",
    direction: "Reversible",
    voltage: "110V / 220V AC (Motor 24V)",
    priceBaseWithoutVat: 679.00,
    priceWithVat: 780.85,
    compareAtPrice: 1115.50,
    image: "/images/barreras/zkteco-bg1030-bg1045.jpg",
    badge: "⚡ APERTURA ULTRA RÁPIDA 1.5s",
    highlights: [
      "Velocidad ultra rápida regulable desde 1.5 segundos ideal para alto flujo",
      "Motor DC Brushless 24V sin escobillas de mínimo calentamiento",
      "Soporta batería de respaldo 24V para funcionamiento sin energía eléctrica",
      "Dirección de brazo fácilmente reversible en sitio (Izquierda / Derecha)",
      "Monitoreo digital con display de control integrado en la placa madre",
      "Estructura sellada IP54 con panel frontal iluminado LED con señalización 'P'"
    ],
    specs: {
      "Longitud de Brazo": "3.0 Metros (Aluminio Octagonal)",
      "Tiempo de Apertura": "1.5s a 3.0s (Programable)",
      "Motor": "DC Brushless 24V de Alta Eficiencia",
      "Ciclos de Vida (MCBF)": "3.000.000 de Maniobras",
      "Batería de Respaldo": "Compatible con kit de baterías 24V",
      "Dirección": "Reversible (Montaje Izq o Der)",
      "Grado de Protección": "IP54 Intemperie",
      "Consumo Máximo": "120W"
    },
    differentiator: "Velocidad de 1.5s y motor brushless de 3 millones de ciclos para garitas de máxima demanda.",
    description: "Barrera vehicular inteligente ZKTeco BG1030 diseñada para parqueaderos comerciales y peajes que requieren rapidez y durabilidad sin fallas.",
    popular: true
  },

  // ─── PAR 1B: ZKTECO BG1045 ───
  {
    id: "bar-zk-bg1045",
    name: "Barrera Vehicular ZKTeco BG1045 (Brazo 4.5m, 2.5s Ajustable, 24V DC)",
    brand: "ZKTeco",
    brandName: "ZKTeco Global",
    armLength: "4.5 Metros",
    armType: "fijo",
    armTypeLabel: "Brazo Fijo de Aluminio 4.5m",
    traffic: "continuo",
    speed: "2.5 seg (Ajustable)",
    cycles: "3.000.000 Ciclos",
    motor: "DC Brushless 24V",
    direction: "Reversible",
    voltage: "110V / 220V AC (Motor 24V)",
    priceBaseWithoutVat: 689.00,
    priceWithVat: 792.35,
    compareAtPrice: 1131.93,
    image: "/images/barreras/zkteco-bg1030-bg1045.jpg",
    badge: "🚗 COBERTURA AMPLIA 4.5m",
    highlights: [
      "Brazo extendido de 4.5 metros para carriles anchos residenciales y mixtos",
      "Velocidad ágil de 2.5 segundos con aceleración y desaceleración suave",
      "Motor DC Brushless 24V para operación 100% continua 24/7",
      "Entradas para radar anti-aplastamiento, lazo magnético (Loop) y fotocélulas",
      "Compatible con sistemas de peaje y software de control ZKBiosecurity / ZKBioAccess"
    ],
    specs: {
      "Longitud de Brazo": "4.5 Metros",
      "Tiempo de Apertura": "2.5s a 3.5s",
      "Motor": "DC Brushless 24V",
      "Ciclos de Vida": "3.000.000 Maniobras",
      "Dirección": "Reversible en Sitio",
      "Protección": "IP54 para Exteriores",
      "Respaldo Energético": "Soporta Batería 24V"
    },
    differentiator: "Ideal para carriles vehiculares anchos con tecnología Brushless de máxima suavidad.",
    description: "Barrera automática de control de acceso vehicular ZKTeco BG1045 con brazo de 4.5m y motor inteligente 24V."
  },

  // ─── PAR 2A: DITEC QIK 3.7M ───
  {
    id: "bar-ditec-qik-37",
    name: "Barrera Vehicular Ditec QIK 3.7M Alto Tráfico (Fabricación Italiana)",
    brand: "Ditec",
    brandName: "Ditec Entrematic Italia",
    armLength: "3.7 Metros",
    armType: "fijo",
    armTypeLabel: "Brazo de Aluminio Elíptico 3.7m",
    traffic: "continuo",
    speed: "2.0 seg (Ajustable)",
    cycles: "+1.500.000 Maniobras",
    motor: "24V DC Heavy Duty",
    direction: "Izquierda / Derecha",
    voltage: "110V AC (Motor 24V DC)",
    priceBaseWithoutVat: 1263.00,
    priceWithVat: 1452.45,
    compareAtPrice: 2074.93,
    image: "/images/barreras/ditec-qik-37-60.jpg",
    badge: "🇮🇹 INGENIERÍA ITALIANA PREMIUM",
    highlights: [
      "Calidad y fiabilidad superior de ingeniería europea Ditec Entrematic Italia",
      "Probada para más de 1.500.000 maniobras de servicio ininterrumpido",
      "Carcasa de acero galvanizado con recubrimiento epóxico resistente a salinidad",
      "Apertura perfecta a 90 grados con desaceleración electrónica milimétrica",
      "Central de control digital avanzada con entradas para todos los sistemas de seguridad"
    ],
    specs: {
      "Origen": "Italia (Ditec Entrematic)",
      "Longitud de Brazo": "3.7 Metros Elíptico Antiviento",
      "Velocidad": "2.0 Segundos",
      "Maniobras Certificadas": "+1.500.000 Ciclos",
      "Uso": "Intensivo / Centros Comerciales / Hospitales",
      "Alimentación": "110V AC / Motor 24V DC",
      "Desbloqueo": "Manual con Llave Personalizada"
    },
    differentiator: "Lujo, elegancia y robustez europea con más de 1.5 millones de maniobras certificadas.",
    description: "Barrera automática de alta gama Ditec QIK 3.7M para urbanizaciones exclusivas y centros comerciales de alta exigencia.",
    popular: true
  },

  // ─── PAR 2B: DITEC QIK 6.0M ───
  {
    id: "bar-ditec-qik-60",
    name: "Barrera Vehicular Ditec QIK 6.0M Alto Tráfico (Fabricación Italiana)",
    brand: "Ditec",
    brandName: "Ditec Entrematic Italia",
    armLength: "6.0 Metros",
    armType: "fijo",
    armTypeLabel: "Brazo Reforzado de 6.0m",
    traffic: "continuo",
    speed: "6.0 seg",
    cycles: "+1.500.000 Maniobras",
    motor: "24V DC Heavy Duty",
    direction: "Izquierda / Derecha",
    voltage: "110V AC (Motor 24V DC)",
    priceBaseWithoutVat: 1458.00,
    priceWithVat: 1676.70,
    compareAtPrice: 2395.29,
    image: "/images/barreras/ditec-qik-37-60.jpg",
    badge: "🏗️ GRAN LONGITUD 6 METROS",
    highlights: [
      "Brazo masivo de 6 metros para entrada de camiones, buses y doble carril",
      "Sistema de doble resorte balanceado para esfuerzo cero del motor",
      "Motor 24V DC de servicio continuo para más de 1.5 millones de ciclos",
      "Carcasa de diseño aerodinámico con baliza circular roja integrada",
      "Desbloqueo manual seguro con llave en caso de emergencia"
    ],
    specs: {
      "Origen": "Italia",
      "Longitud de Brazo": "6.0 Metros con Refuerzo",
      "Velocidad de Maniobra": "6.0 Segundos",
      "Ciclos de Vida": "+1.500.000 Maniobras",
      "Gabinete": "Acero Tratado Anti-Corrosión",
      "Grado IP": "IP54 Resistente a Lluvia y Polvo"
    },
    differentiator: "La barrera italiana de 6 metros más confiable para plantas industriales y puertos.",
    description: "Barrera automática vehicular Ditec QIK 6.0M para accesos de transporte pesado, fábricas y grandes estacionamientos."
  },

  // ─── PAR 3: GAREN BRASIL 300W DC ───
  {
    id: "bar-garen-prime-300w",
    name: "Barrera Vehicular Garen Brasil Prime DC 300W 24V (Brazo 3.3m a 4.3m)",
    brand: "Garen",
    brandName: "Garen Brasil",
    armLength: "3.3m a 4.3m",
    armType: "led",
    armTypeLabel: "Brazo con Tira LED (3.3m / 4.3m)",
    traffic: "continuo",
    speed: "2.5s (3.3m) / 5.0s (4.3m)",
    cycles: "Ciclos Continuos",
    motor: "300W 24V DC (4200 RPM)",
    direction: "Direccionable Izq/Der",
    voltage: "220V - 60Hz",
    priceBaseWithoutVat: 874.00,
    priceWithVat: 1005.10,
    compareAtPrice: 1435.86,
    image: "/images/barreras/garen-prime-dc-300w.jpg",
    badge: "🇧🇷 FUERZA GAREN BRASIL 300W",
    highlights: [
      "Motor potente de 300W a 24V DC con rotación de hasta 4200 RPM",
      "Central electrónica Prime DC con Display digital para configuración instantánea",
      "Mecanismo 100% direccionable: configure el brazo a izquierda o derecha en minutos",
      "Tira de luces LED integrada a lo largo de todo el brazo para visibilidad nocturna",
      "Construcción reforzada brasileña apta para ciclos continuos sin sobrecalentamiento"
    ],
    specs: {
      "Origen": "Brasil (Garen Pode Confiar)",
      "Potencia": "300W - 24V DC",
      "Rotación del Motor": "Hasta 4200 RPM",
      "Tiempo de Apertura": "2.5 seg (3.3m) / 5.0 seg (4.3m)",
      "Central Electrónica": "Prime DC con Display Digital",
      "Voltaje": "220V - 60Hz",
      "Ciclos": "Continuos de Alto Rendimiento",
      "Iluminación": "Tira LED en Brazo Incluida"
    },
    differentiator: "Motor brasileño de 300W a 4200 RPM con central Prime Display y tira LED completa.",
    description: "Barrera vehicular automática Garen Brasil Prime DC 300W para condominios e industrias que requieren fuerza y versatilidad direccionable."
  },

  // ─── PAR 4: DAHUA 3-4M BRUSHLESS ───
  {
    id: "bar-dahua-ipmecd-3040",
    name: "Barrera Vehicular Dahua 3 - 4 Metros IPMECD-1052 Brushless (3M Ciclos)",
    brand: "Dahua",
    brandName: "Dahua Technology",
    armLength: "3 a 4 Metros",
    armType: "fijo",
    armTypeLabel: "Brazo Telescópico 3-4m",
    traffic: "continuo",
    speed: "2.0 a 3.0 seg",
    cycles: "3.000.000 Ciclos Motor",
    motor: "DC Brushless Bajo Consumo",
    direction: "Izquierda (LM) / Derecha (RM)",
    voltage: "110V o 220V AC",
    priceBaseWithoutVat: 571.55,
    priceWithVat: 657.28,
    compareAtPrice: 938.97,
    image: "/images/barreras/dahua-ipmecd-1052-3m-4m.jpg",
    badge: "📹 ECOSISTEMA DAHUA LPR",
    highlights: [
      "Motor DC Brushless de última generación con vida útil superior a 3.000.000 de maniobras",
      "Mecanismo de resorte reforzado probado para más de 800.000 ciclos continuos",
      "Estructura metálica tratada con pintura anti-óxido para climas extremos (IP54)",
      "Soporta conexión directa de Radar microondas, lazo inductivo Loop y red IP",
      "Tecnología de radiocontrol Rolling Code anti-interferencia y anti-clonación"
    ],
    specs: {
      "Modelos": "IPMECD-1052-LM3040-T28 (Izq) / RM3040-T28 (Der)",
      "Longitud": "Ajustable de 3 a 4 Metros",
      "Ciclos Motor": "3.000.000 Maniobras (MCBF)",
      "Ciclos Resorte": "800.000 Maniobras",
      "Compatibilidad": "Radar, Loop Magnético, Cámaras LPR Dahua",
      "Norma": "IP54 Resistente a Intemperie",
      "Alimentación": "110V / 220V AC"
    },
    differentiator: "Integración nativa con cámaras LPR de lectura de placas y radares Dahua.",
    description: "Barrera vehicular inteligente Dahua IPMECD-1052 con motor DC Brushless de bajo consumo y 3 millones de ciclos.",
    popular: true
  },

  // ─── PAR 5: HIKVISION DS-TMG300-DL RETRÁCTIL IZQUIERDA ───
  {
    id: "bar-hik-ds-tmg300-dl",
    name: "Barrera Vehicular Retráctil Hikvision DS-TMG300-DL 2 - 4m Izquierda (CÓD: 14122)",
    brand: "Hikvision",
    brandName: "Hikvision",
    armLength: "2 a 4 Metros",
    armType: "retractil",
    armTypeLabel: "Brazo Retráctil Regulable 2-4m",
    traffic: "alto",
    speed: "3 a 6 seg",
    cycles: "2.500.000 Ciclos (MCBF)",
    motor: "DC Brushless 100W",
    direction: "Izquierda",
    voltage: "110V AC",
    priceBaseWithoutVat: 490.00,
    priceWithVat: 563.50,
    compareAtPrice: 805.00,
    image: "/images/barreras/hikvision-ds-tmg300-dl-retractil.jpg",
    badge: "📏 BRAZO RETRÁCTIL 2-4m",
    highlights: [
      "Brazo telescópico retráctil regulable in situ entre 2 y 4 metros sin cortes",
      "Motor DC Brushless de 100W con 2.5 millones de ciclos de vida útil garantizados",
      "Gabinete de aleación de aluminio y acero galvanizado de solo 26 Kg",
      "Apertura suave y controlada en 3 a 6 segundos según calibración",
      "Compatibilidad plug & play con el ecosistema de radares y terminales Hikvision"
    ],
    specs: {
      "Código de Producto": "CÓD: 14122 (DS-TMG300-DL)",
      "Longitud Regulable": "2.0 a 4.0 Metros (Telescópico)",
      "Orientación": "Izquierda",
      "Motor": "DC Brushless 100W",
      "Ciclos MCBF": "2.500.000 de Ciclos",
      "Consumo": "100W Ultra Eficiente",
      "Peso": "26 Kg",
      "Voltaje": "110 VAC"
    },
    differentiator: "Brazo retráctil que se ajusta a la medida exacta de tu carril sin necesidad de cortar tubos.",
    description: "Barrera vehicular automática retráctil Hikvision DS-TMG300-DL con orientación izquierda y motor Brushless."
  },

  // ─── PAR 6: HIKVISION DS-TMG300-DR/A/B ILUMINADA LED DERECHA ───
  {
    id: "bar-hik-ds-tmg300-dr-led",
    name: "Barrera Vehicular Iluminada LED Hikvision DS-TMG300-DR Derecha (CÓD: 14124)",
    brand: "Hikvision",
    brandName: "Hikvision",
    armLength: "3 a 4 Metros",
    armType: "led",
    armTypeLabel: "Brazo con Luces LED de Alta Visibilidad",
    traffic: "alto",
    speed: "3 a 6 seg",
    cycles: "2.500.000 Ciclos (MCBF)",
    motor: "DC Brushless 100W",
    direction: "Derecha",
    voltage: "110V AC",
    priceBaseWithoutVat: 520.00,
    priceWithVat: 598.00,
    compareAtPrice: 854.29,
    image: "/images/barreras/hikvision-ds-tmg300-dr-led.jpg",
    badge: "💡 ILUMINACIÓN LED INTEGRADA",
    highlights: [
      "Iluminación LED dinámica a lo largo del mástil y señal luminosa frontal en el gabinete",
      "Máxima seguridad nocturna para evitar choques accidentales de conductores distraídos",
      "Motor DC Brushless de 2.500.000 ciclos de vida útil",
      "Estructura orientada a la derecha con acabado negro satinado de alta durabilidad",
      "Bajo consumo energético de 100W con alimentación a 110 VAC"
    ],
    specs: {
      "Código": "CÓD: 14124 (DS-TMG300-DR/A/B)",
      "Orientación": "Derecha",
      "Iluminación": "Luces LED en Brazo y Gabinete",
      "Motor": "DC Brushless 100W",
      "Ciclos MCBF": "2.5 Millones de Maniobras",
      "Tiempo Maniobra": "3 a 6 Segundos",
      "Peso": "26 Kg"
    },
    differentiator: "Mástil y gabinete iluminados con LED para advertencia visual preventiva y elegancia nocturna.",
    description: "Barrera vehicular iluminada LED Hikvision DS-TMG300-DR con orientación derecha para accesos residenciales y comerciales.",
    popular: true
  },

  // ─── PAR 7: HIKVISION DS-TMG300-DL/A/B ILUMINADA LED IZQUIERDA ───
  {
    id: "bar-hik-ds-tmg300-dl-led",
    name: "Barrera Vehicular Iluminada LED Hikvision DS-TMG300-DL Izquierda (CÓD: 14120)",
    brand: "Hikvision",
    brandName: "Hikvision",
    armLength: "3 a 4 Metros",
    armType: "led",
    armTypeLabel: "Brazo con Luces LED de Alta Visibilidad",
    traffic: "alto",
    speed: "3 a 6 seg",
    cycles: "2.500.000 Ciclos (MCBF)",
    motor: "DC Brushless 100W",
    direction: "Izquierda",
    voltage: "110V AC",
    priceBaseWithoutVat: 520.00,
    priceWithVat: 598.00,
    compareAtPrice: 854.29,
    image: "/images/barreras/hikvision-ds-tmg300-dl-led.jpg",
    badge: "💡 ILUMINACIÓN LED INTEGRADA",
    highlights: [
      "Iluminación LED integrada en el brazo y baliza de estado en el panel frontal",
      "Orientación de montaje izquierda para garitas con ingreso por carril izquierdo",
      "Motor DC Brushless de 2.5 millones de ciclos sin desgaste de carbones",
      "Gabinete de alta resistencia anticorrosiva de 26 Kg de peso",
      "Compatible con lectoras de TAG UHF y cámaras Hikvision ANPR"
    ],
    specs: {
      "Código": "CÓD: 14120 (DS-TMG300-DL/A/B)",
      "Orientación": "Izquierda",
      "Iluminación": "LED Bicolor de Alto Brillo",
      "Motor": "DC Brushless 100W",
      "Ciclos MCBF": "2.5 Millones",
      "Alimentación": "110 VAC",
      "Peso": "26 Kg"
    },
    differentiator: "La mejor visibilidad nocturna con orientación izquierda para ingresos vehiculares seguros.",
    description: "Barrera vehicular con mástil iluminado LED Hikvision DS-TMG300-DL con orientación izquierda."
  },

  // ─── PAR 8: HIGHTECK RETRÁCTIL 3-6M DERECHA S4A-BG005D ───
  {
    id: "bar-s4a-bg005d-ret-der",
    name: "Barrera Automática Highteck Retráctil 3 - 6 Metros Derecha S4A-BG005D con LED",
    brand: "Highteck",
    brandName: "Highteck / S4A",
    armLength: "3 a 6 Metros",
    armType: "retractil",
    armTypeLabel: "Brazo Retráctil Telescópico 3-6m",
    traffic: "alto",
    speed: "3 a 6 seg",
    cycles: ">1.000.000 Ciclos",
    motor: "DC Brushless 100-200W",
    direction: "Derecha",
    voltage: "110V AC",
    priceBaseWithoutVat: 510.00,
    priceWithVat: 586.50,
    compareAtPrice: 837.86,
    image: "/images/barreras/highteck-s4a-bg005d-retractil-der.jpg",
    badge: "🎁 INCLUYE 2 CONTROLES + 4 PERNOS",
    highlights: [
      "Brazo telescópico retráctil regulable de 3 a 6 metros para cualquier ancho de vía",
      "Luz LED indicadora en la parte superior del gabinete de señalización activa",
      "Incluye kit de instalación: 2 controles remotos adicionales + 4 tornillos expansores de anclaje",
      "Motor DC Brushless de 100 a 200W con más de 1.000.000 de ciclos útiles",
      "Estructura ligera de 22 Kg de alta resistencia mecánica"
    ],
    specs: {
      "Modelo": "S4A-BG005D Derecha Retráctil",
      "Rango de Brazo": "3.0 a 6.0 Metros Telescópico",
      "Orientación": "Derecha",
      "Accesorios Incluidos": "2 Controles Remotos + 4 Pernos Expansores",
      "Motor": "DC Brushless 100-200W",
      "Ciclos de Vida": "> 1.000.000 Maniobras",
      "Peso": "22 Kg"
    },
    differentiator: "Brazo telescópico de hasta 6 metros con kit completo de 2 controles y pernos incluido.",
    description: "Barrera vehicular automática Highteck S4A-BG005D con brazo retráctil de 3 a 6 metros y orientación derecha."
  },

  // ─── PAR 9: HIGHTECK RETRÁCTIL 3-6M IZQUIERDA S4A-BG005D (CÓD: 14171) ───
  {
    id: "bar-s4a-bg005d-ret-izq",
    name: "Barrera Automática Highteck Retráctil 3 - 6 Metros Izquierda S4A-BG005D (CÓD: 14171) con LED",
    brand: "Highteck",
    brandName: "Highteck / S4A",
    armLength: "3 a 6 Metros",
    armType: "retractil",
    armTypeLabel: "Brazo Retráctil Telescópico 3-6m",
    traffic: "alto",
    speed: "3 a 6 seg",
    cycles: ">1.000.000 Ciclos",
    motor: "DC Brushless 100-200W",
    direction: "Izquierda",
    voltage: "110V AC",
    priceBaseWithoutVat: 510.00,
    priceWithVat: 586.50,
    compareAtPrice: 837.86,
    image: "/images/barreras/highteck-s4a-bg005d-retractil-izq.jpg",
    badge: "🎁 INCLUYE 2 CONTROLES + 4 PERNOS",
    highlights: [
      "Brazo telescópico ajustable de 3 a 6 metros con montaje orientado a la izquierda",
      "Señal luminosa LED superior en la tapa del gabinete",
      "Kit todo incluido: 2 controles remotos de fábrica + 4 pernos expansores de acero",
      "Motor DC Brushless de 110 VAC para más de un millón de aperturas",
      "Excelente relación calidad-precio para condominios medianos y residenciales"
    ],
    specs: {
      "Código / Modelo": "CÓD: 14171 / S4A-BG005D Izquierda",
      "Brazo": "3.0 a 6.0 Metros Retráctil",
      "Orientación": "Izquierda",
      "Accesorios": "2 Controles Remotos + 4 Expansores",
      "Motor": "DC Brushless 100-200W",
      "Vida Útil": "> 1 Millón de Ciclos",
      "Peso": "22 Kg"
    },
    differentiator: "Máxima adaptabilidad vial de hasta 6 metros orientada a la izquierda con kit completo.",
    description: "Barrera vehicular automática Highteck S4A-BG005D retráctil con orientación izquierda."
  },

  // ─── PAR 10: HIGHTECK BRAZO FIJO 3M IZQUIERDA S4A-BG005D (CÓD: 14174) ───
  {
    id: "bar-s4a-bg005d-fij-izq",
    name: "Barrera Automática Highteck Brazo Fijo 3 Metros Izquierda S4A-BG005D (CÓD: 14174) con LED",
    brand: "Highteck",
    brandName: "Highteck / S4A",
    armLength: "3 Metros",
    armType: "fijo",
    armTypeLabel: "Brazo Fijo de Aluminio 3m",
    traffic: "estandar",
    speed: "3 a 6 seg",
    cycles: ">1.000.000 Ciclos",
    motor: "DC Brushless 100-200W",
    direction: "Izquierda",
    voltage: "110V AC",
    priceBaseWithoutVat: 420.00,
    priceWithVat: 483.00,
    compareAtPrice: 690.00,
    image: "/images/barreras/highteck-s4a-bg005d-fijo-izq.jpg",
    badge: "💲 LA OPCIÓN MÁS ECONÓMICA",
    highlights: [
      "La barrera automática con motor Brushless más accesible y rentable del mercado",
      "Brazo fijo tubular de aluminio de 3 metros de gran rigidez y balance",
      "Luz LED indicadora en la cabecera del gabinete",
      "Incluye 2 controles remotos y 4 tornillos expansores para anclaje directo a loza",
      "Motor DC Brushless de bajo mantenimiento y alta eficiencia"
    ],
    specs: {
      "Código": "CÓD: 14174 (S4A-BG005D)",
      "Brazo": "3.0 Metros Fijo de Aluminio",
      "Orientación": "Izquierda",
      "Kit Incluye": "2 Controles Remotos + 4 Pernos",
      "Motor": "DC Brushless 110V AC",
      "Ciclos": "> 1.000.000 Maniobras",
      "Consumo": "100 - 200W"
    },
    differentiator: "La solución más económica y confiable para condominios residenciales de carril estándar.",
    description: "Barrera vehicular automática Highteck con brazo fijo de 3 metros y orientación izquierda.",
    popular: true
  },

  // ─── PAR 11: HIKVISION DS-TMG300-DR RETRÁCTIL DERECHA (CÓD: 14121) ───
  {
    id: "bar-hik-ds-tmg300-dr",
    name: "Barrera Vehicular Retráctil Hikvision DS-TMG300-DR 2 - 4m Derecha (CÓD: 14121)",
    brand: "Hikvision",
    brandName: "Hikvision",
    armLength: "2 a 4 Metros",
    armType: "retractil",
    armTypeLabel: "Brazo Retráctil Regulable 2-4m",
    traffic: "alto",
    speed: "3 a 6 seg",
    cycles: "2.500.000 Ciclos (MCBF)",
    motor: "DC Brushless 100W",
    direction: "Derecha",
    voltage: "110V AC",
    priceBaseWithoutVat: 490.00,
    priceWithVat: 563.50,
    compareAtPrice: 805.00,
    image: "/images/barreras/hikvision-ds-tmg300-dr-retractil.jpg",
    badge: "📏 BRAZO RETRÁCTIL 2-4m",
    highlights: [
      "Brazo retráctil regulable entre 2 y 4 metros con orientación derecha",
      "Motor DC Brushless de 2.5 millones de ciclos con tecnología de amortiguación",
      "Carcasa compacta y ligera de 26 Kg de alta resistencia intemperie",
      "Conexión simple con radares de microondas anti-aplastamiento Hikvision",
      "Alimentación directa a 110 VAC con consumo de tan solo 100W"
    ],
    specs: {
      "Código": "CÓD: 14121 (DS-TMG300-DR)",
      "Brazo": "2.0 a 4.0 Metros Telescópico",
      "Orientación": "Derecha",
      "Motor": "DC Brushless 100W",
      "Ciclos MCBF": "2.500.000 de Ciclos",
      "Peso": "26 Kg",
      "Voltaje": "110 VAC"
    },
    differentiator: "Facilidad de ajuste de 2 a 4m con la confiabilidad de 2.5 millones de ciclos Hikvision.",
    description: "Barrera vehicular retráctil telescópica Hikvision DS-TMG300-DR orientada a la derecha."
  },

  // ─── PAR 12: HIGHTECK BRAZO FIJO 3M DERECHA S4A-BG005D (CÓD: 14164) ───
  {
    id: "bar-s4a-bg005d-fij-der",
    name: "Barrera Automática Highteck Brazo Fijo 3 Metros Derecha S4A-BG005D (CÓD: 14164) con LED",
    brand: "Highteck",
    brandName: "Highteck / S4A",
    armLength: "3 Metros",
    armType: "fijo",
    armTypeLabel: "Brazo Fijo de Aluminio 3m",
    traffic: "estandar",
    speed: "3 a 6 seg",
    cycles: ">1.000.000 Ciclos",
    motor: "DC Brushless 100-200W",
    direction: "Derecha",
    voltage: "110V AC",
    priceBaseWithoutVat: 420.00,
    priceWithVat: 483.00,
    compareAtPrice: 690.00,
    image: "/images/barreras/highteck-s4a-bg005d-fijo-der.jpg",
    badge: "💲 LA OPCIÓN MÁS ECONÓMICA",
    highlights: [
      "Precio súper competitivo con tecnología de motor DC Brushless de 110V",
      "Brazo fijo de aluminio de 3 metros con bandas reflectivas de alta visibilidad",
      "Luz LED en la cubierta superior del gabinete para señalización de estado",
      "Incluye 2 controles remotos inalámbricos y 4 pernos expansores de anclaje",
      "Gabinete de acero tratado contra la corrosión de 22 Kg"
    ],
    specs: {
      "Código": "CÓD: 14164 (S4A-BG005D)",
      "Brazo": "3.0 Metros Fijo",
      "Orientación": "Derecha",
      "Accesorios": "2 Controles Remotos + 4 Pernos",
      "Motor": "DC Brushless 100-200W",
      "Ciclos": "> 1.000.000 Maniobras",
      "Peso": "22 Kg"
    },
    differentiator: "Excelente opción económica para accesos residenciales con montaje derecho.",
    description: "Barrera automática vehicular Highteck con brazo fijo de 3m y orientación derecha."
  },

  // ─── PAR 13: DAHUA 4-5M BRUSHLESS ───
  {
    id: "bar-dahua-ipmecd-4050",
    name: "Barrera Vehicular Dahua 4 - 5 Metros IPMECD-1052 Brushless (3M Ciclos)",
    brand: "Dahua",
    brandName: "Dahua Technology",
    armLength: "4 a 5 Metros",
    armType: "fijo",
    armTypeLabel: "Brazo Telescópico 4-5m",
    traffic: "continuo",
    speed: "3.0 a 4.5 seg",
    cycles: "3.000.000 Ciclos Motor",
    motor: "DC Brushless Bajo Consumo",
    direction: "Izquierda (LM) / Derecha (RM)",
    voltage: "110V o 220V AC",
    priceBaseWithoutVat: 586.50,
    priceWithVat: 674.48,
    compareAtPrice: 963.54,
    image: "/images/barreras/dahua-ipmecd-1052-4m-5m.jpg",
    badge: "🚛 CARRILES AMPLIOS 4-5m",
    highlights: [
      "Brazo largo regulable de 4 a 5 metros ideal para accesos industriales y transporte pesado",
      "Motor DC Brushless de 3 millones de ciclos de vida útil ininterrumpida",
      "800.000 ciclos en cambio de resorte y estructura metálica anti-óxido IP54",
      "Compatible con radar Dahua, loop detector magnético y cámaras LPR",
      "Control de aceleración y freno suave para evitar balanceos en brazos largos"
    ],
    specs: {
      "Modelos": "IPMECD-1052-LM4050-T48 (Izq) / RM4050-T48 (Der)",
      "Longitud": "Ajustable de 4 a 5 Metros",
      "Motor": "DC Brushless 110V / 220V",
      "Ciclos Motor": "3.000.000 Maniobras (MCBF)",
      "Ciclos Resorte": "800.000 Maniobras",
      "Soporte": "Radar, Loop, IP, Rolling Code",
      "Protección": "IP54 Intemperie"
    },
    differentiator: "Potencia y balance perfecto para brazos largos de 4 a 5 metros en industrias y urbanizaciones.",
    description: "Barrera vehicular automática Dahua IPMECD-1052 para carriles amplios de 4 a 5 metros con motor Brushless de 3M ciclos."
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// MAIN INTERACTIVE CLIENT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function BarrerasVehicularesClient() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("quito")
  const [activeBrand, setActiveBrand] = useState<string>("todos")
  const [activeArmType, setActiveArmType] = useState<string>("todos")
  const [activeTraffic, setActiveTraffic] = useState<string>("todos")
  const [modalProduct, setModalProduct] = useState<BarreraProduct | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Current selected province
  const selectedProvince = useMemo(() => {
    return PROVINCES_DATA.find((p) => p.id === selectedProvinceId) || PROVINCES_DATA[0]
  }, [selectedProvinceId])

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return BARRERAS_PRODUCTS.filter((prod) => {
      // Brand filter
      if (activeBrand !== "todos" && prod.brand !== activeBrand) return false
      // Arm type filter
      if (activeArmType !== "todos" && prod.armType !== activeArmType) return false
      // Traffic filter
      if (activeTraffic !== "todos" && prod.traffic !== activeTraffic) return false
      return true
    })
  }, [activeBrand, activeArmType, activeTraffic])

  // WhatsApp checkout message generator
  const getWhatsAppUrl = (product: BarreraProduct, withInstall: boolean) => {
    const finalPrice = withInstall
      ? (product.priceWithVat + selectedProvince.installCost).toFixed(2)
      : product.priceWithVat.toFixed(2)

    const text = encodeURIComponent(
      `Hola ATOMIC, deseo cotizar la siguiente Barrera Vehicular:\n\n` +
      `📌 *Modelo:* ${product.name}\n` +
      `🏷️ *Marca:* ${product.brandName}\n` +
      `📏 *Brazo:* ${product.armLength} (${product.armTypeLabel})\n` +
      `⚡ *Velocidad:* ${product.speed} | *Motor:* ${product.motor}\n` +
      `💵 *Precio Equipo (+IVA):* $${product.priceWithVat.toFixed(2)} USD\n` +
      (withInstall
        ? `🛠️ *Instalación en:* ${selectedProvince.name} (+$${selectedProvince.installCost.toFixed(2)} USD)\n` +
          `💰 *TOTAL INSTALADO:* $${finalPrice} USD\n\n`
        : `🚚 *Modalidad:* Envío sin instalación\n\n`) +
      `¿Me pueden brindar asesoría técnica y fecha disponible de instalación/entrega?`
    )
    return `https://wa.me/593999008080?text=${text}`
  }

  return (
    <div className="min-h-screen bg-[#09080e] text-neutral-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ══════════════════════════════════════════════════════════════════════
          TOP NOTIFICATION BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-black text-xs font-black uppercase tracking-widest py-2 px-4 text-center font-heading flex items-center justify-center gap-2 shadow-lg">
        <span className="animate-pulse">🚧</span>
        <span>PROMOCIÓN CONTROL DE ACCESO VEHICULAR 2026: 30% DE DESCUENTO EN TODAS LAS BARRERAS + 2 AÑOS DE GARANTÍA</span>
        <span className="hidden md:inline font-mono bg-black text-amber-400 px-2 py-0.5 rounded ml-2">RED NACIONAL ECUADOR</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#0c0a14]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/web" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black font-heading text-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="text-lg font-black tracking-tight font-heading text-white flex items-center gap-1.5">
                  ATOMIC <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">VEHICULAR</span>
                </span>
                <p className="text-[9px] text-neutral-400 font-mono leading-none">Seguridad & Automatización</p>
              </div>
            </Link>
          </div>

          {/* Quick Links & WhatsApp CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/web/cerraduras-smart"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white font-mono px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
            >
              <span>🔒 Cerraduras Smart</span>
            </Link>
            <Link
              href="/web/camaras-hogar"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white font-mono px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
            >
              <span>📹 Cámaras 4K</span>
            </Link>
            <a
              href="https://wa.me/593999008080?text=Hola%20ATOMIC,%20deseo%20asesoria%20tecnica%20para%20instalacion%20de%20barreras%20vehiculares."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold text-xs uppercase tracking-wider font-heading hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Asesoría Directa</span>
            </a>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/10">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-transparent blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Control de Acceso Vehicular Inteligente 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading uppercase text-white tracking-tight leading-tight">
              Barreras Vehiculares Automáticas para{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Urbanizaciones, Condominios e Industrias
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-3xl mx-auto">
              Sistemas de alta velocidad de <strong className="text-white">1.5s a 6s</strong> con motores <strong className="text-white">DC Brushless</strong> para más de <strong className="text-white">3.000.000 de ciclos continuos</strong>. Compatibles con <strong className="text-amber-300">Radares anti-aplastamiento</strong>, <strong className="text-amber-300">Lectoras TAG UHF</strong>, <strong className="text-amber-300">Cámaras LPR de lectura de placas</strong> y controles remotos Rolling Code.
            </p>

            {/* Highlights Grid Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto text-left font-mono text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">2 AÑOS GARANTÍA</div>
                  <div className="text-neutral-400 text-[10px]">Respaldo oficial de fábrica</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">1.5s APERTURA</div>
                  <div className="text-neutral-400 text-[10px]">Alta velocidad regulable</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">ALTO TRÁFICO</div>
                  <div className="text-neutral-400 text-[10px]">Hasta 3M de maniobras</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">24 PROVINCIAS</div>
                  <div className="text-neutral-400 text-[10px]">Técnicos certificados</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#catalogo-barreras"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-black text-sm uppercase tracking-widest font-heading hover:brightness-110 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>Ver los 15 Modelos Homologados</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/593999008080?text=Hola%20ATOMIC,%20deseo%20una%20cotizacion%20tecnica%20de%20barreras%20vehiculares%20para%20mi%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/20 font-bold text-sm uppercase tracking-widest font-heading transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Hablar con un Ingeniero</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          EDUCATIONAL SECTION: ¿POR QUÉ SON INDISPENSABLES?
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#0e0c16]/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Solución Integral de Seguridad Perimetral
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading uppercase text-white tracking-tight">
              ¿Por qué instalar una Barrera Vehicular Automática?
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              El acceso vehicular es el primer filtro de seguridad de cualquier propiedad. Una barrera automatizada no solo previene intrusiones no autorizadas, sino que optimiza los tiempos de espera y dignifica el acceso de residentes y clientes.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1: Urbanizaciones */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                🏡
              </div>
              <h3 className="text-lg font-black font-heading uppercase text-white">Urbanizaciones & Condominios</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Elimina las colas en la garita en horas pico. Los residentes ingresan fluidamente sin bajar el vidrio mediante <strong className="text-white">TAGs UHF de parabrisas</strong> o reconocimiento de matrículas.
              </p>
            </div>

            {/* Pillar 2: Centros Comerciales */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                🏢
              </div>
              <h3 className="text-lg font-black font-heading uppercase text-white">Centros Comerciales & Parking</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Control estricto de aforo y tiempos de permanencia. Integración total con <strong className="text-white">tótems dispensadores de tickets</strong>, cajas de pago automático y cámaras LPR de auditoría.
              </p>
            </div>

            {/* Pillar 3: Industrias & Logística */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                🏭
              </div>
              <h3 className="text-lg font-black font-heading uppercase text-white">Industrias & Transporte Pesado</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Brazos robustos de hasta <strong className="text-white">6 metros de longitud</strong> para camiones y tráileres. Mecanismos con protección intemperie IP54 para fábricas, bodegas y puertos.
              </p>
            </div>

            {/* Pillar 4: Seguridad & Anti-Accidentes */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="text-lg font-black font-heading uppercase text-white">Seguridad & Anti-Aplastamiento</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Protección 100% garantizada para vehículos y peatones mediante <strong className="text-white">Radares de microondas 77GHz</strong> y lazos inductivos (Loop) que impiden que el brazo descienda si hay un obstáculo.
              </p>
            </div>

          </div>

          {/* Ecosistema de Accesorios Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171424] to-[#12101e] border border-white/10">
            <div className="text-center sm:text-left sm:flex items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Cpu className="w-4 h-4" />
                  Ecosistema de Automatización Modular
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading uppercase text-white">
                  ¿Necesitas integrar TAGs UHF, Cámaras LPR o Semáforos?
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Todas nuestras barreras son 100% compatibles con antenas de largo alcance (6 a 12m), cámaras de lectura de placas vehiculares, radares anti-impacto y semáforos LED bicolor. Diseñamos el proyecto llave en mano para tu garita.
                </p>
              </div>
              <div className="mt-6 sm:mt-0 shrink-0">
                <a
                  href="https://wa.me/593999008080?text=Hola%20ATOMIC,%20deseo%20informacion%20sobre%20accesorios%20y%20automatizacion%20de%20barreras%20(TAGs%20UHF,%20LPR,%20Radares)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-black text-xs uppercase tracking-widest font-heading hover:brightness-110 shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
                >
                  <span>Consultar Accesorios</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROVINCE SELECTOR BAR (INTERACTIVE)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-16 z-40 bg-[#12101b]/95 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
                  Cotizar Instalación en Tu Provincia:
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {selectedProvince.name} • {selectedProvince.badgeText}
                </span>
              </div>
            </div>

            {/* Dropdown Selector */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="w-full md:w-80 px-3.5 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-xs font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {PROVINCES_DATA.map((prov) => (
                  <option key={prov.id} value={prov.id} className="bg-[#12101b] text-white">
                    {prov.flag} {prov.name} (+${prov.installCost.toFixed(2)} USD Inst.)
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CATALOG SECTION: 15 PRODUCTS WITH DYNAMIC FILTERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="catalogo-barreras" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-bold">
                <Sliders className="w-4 h-4" />
                Catálogo Homologado ({filteredProducts.length} de {BARRERAS_PRODUCTS.length} Modelos Disponibles)
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white tracking-tight">
                Modelos de Barreras Vehiculares
              </h2>
            </div>
            
            {/* Active Quick Filters Info */}
            <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
              <span className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10">30% OFF APLICADO</span>
              <span className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10">15% IVA INCLUIDO</span>
            </div>
          </div>

          {/* ─── FILTRO 1: POR MARCA / PROVEEDOR ─── */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
              1. Filtrar por Marca / Fabricante:
            </span>
            <div className="flex flex-wrap items-center gap-2 bg-[#12101b] p-1.5 rounded-2xl border border-white/10 shadow-inner">
              {[
                { id: "todos", label: "TODAS LAS MARCAS", count: BARRERAS_PRODUCTS.length },
                { id: "Hikvision", label: "📹 HIKVISION", count: BARRERAS_PRODUCTS.filter(p => p.brand === 'Hikvision').length },
                { id: "Dahua", label: "🎥 DAHUA TECHNOLOGY", count: BARRERAS_PRODUCTS.filter(p => p.brand === 'Dahua').length },
                { id: "ZKTeco", label: "🛡️ ZKTECO", count: BARRERAS_PRODUCTS.filter(p => p.brand === 'ZKTeco').length },
                { id: "Ditec", label: "🇮🇹 DITEC ITALIA", count: BARRERAS_PRODUCTS.filter(p => p.brand === 'Ditec').length },
                { id: "Garen", label: "🇧🇷 GAREN BRASIL", count: BARRERAS_PRODUCTS.filter(p => p.brand === 'Garen').length },
                { id: "Highteck", label: "⚡ HIGHTECK / S4A", count: BARRERAS_PRODUCTS.filter(p => p.brand === 'Highteck').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBrand(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    activeBrand === tab.id
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25 font-black scale-105"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeBrand === tab.id ? 'bg-black/30 text-black' : 'bg-white/10 text-neutral-400'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ─── FILTRO 2: POR TIPO DE BRAZO ─── */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
              2. Filtrar por Tipo de Brazo:
            </span>
            <div className="flex flex-wrap items-center gap-2 bg-[#12101b] p-1.5 rounded-2xl border border-white/10 shadow-inner">
              {[
                { id: "todos", label: "TODOS LOS TIPOS" },
                { id: "retractil", label: "📏 RETRÁCTIL TELESCÓPICO (2-4m / 3-6m)" },
                { id: "fijo", label: "🔩 BRAZO FIJO (3m / 3.7m / 4.5m / 6m)" },
                { id: "led", label: "💡 ILUMINACIÓN LED NOCTURNA" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveArmType(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeArmType === tab.id
                      ? "bg-orange-500 text-black shadow-lg shadow-orange-500/25 font-black scale-105"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── PRODUCT GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredProducts.map((product) => {
              const totalInstalledPrice = (product.priceWithVat + selectedProvince.installCost).toFixed(2)
              
              return (
                <div
                  key={product.id}
                  className="bg-[#12101c] rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl hover:shadow-amber-500/5 relative"
                >
                  {/* Top Image Container */}
                  <div>
                    <div className="relative h-64 sm:h-72 w-full bg-gradient-to-b from-[#191626] to-[#12101c] p-6 flex items-center justify-center overflow-hidden border-b border-white/[0.06]">
                      
                      {/* Badge Top Left */}
                      <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5">
                        {product.popular && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest font-heading shadow-md">
                            ⭐ MÁS VENDIDO
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-extrabold uppercase tracking-widest font-heading">
                          {product.badge}
                        </span>
                      </div>

                      {/* Brand Tag Top Right */}
                      <div className="absolute top-3.5 right-3.5 z-20">
                        <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                          {product.brandName}
                        </span>
                      </div>

                      {/* Product Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain max-h-[260px] group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Quick Info Ribbon Bottom */}
                      <div className="absolute bottom-2 left-2 right-2 z-20 bg-[#0d0b14]/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-neutral-300 font-mono flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-amber-400" />
                          {product.speed}
                        </span>
                        <span className="text-amber-400 font-bold">
                          {product.armLength}
                        </span>
                        <span>{product.direction}</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 sm:p-6 space-y-4">
                      
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-white font-heading uppercase leading-snug group-hover:text-amber-300 transition-colors">
                        {product.name}
                      </h3>

                      {/* Differentiator Callout */}
                      <p className="text-xs text-neutral-300 italic bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06] leading-relaxed">
                        "{product.differentiator}"
                      </p>

                      {/* Highlights bullets */}
                      <ul className="space-y-1.5 text-xs text-neutral-300 font-sans">
                        {product.highlights.slice(0, 3).map((hl, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Pricing & Action Section */}
                  <div className="p-5 sm:p-6 pt-0 space-y-3 border-t border-white/[0.06] bg-black/20">
                    
                    {/* Price box */}
                    <div className="pt-4 flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500 line-through font-mono">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-mono text-[9px] font-bold border border-red-500/30">
                            -30% PROMOCIÓN
                          </span>
                        </div>
                        <div className="text-2xl font-black font-heading text-amber-400 tracking-tight">
                          ${product.priceWithVat.toFixed(2)}{" "}
                          <span className="text-[10px] text-neutral-400 font-mono font-normal">IVA inc.</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          (Base: ${product.priceBaseWithoutVat.toFixed(2)} + IVA)
                        </div>
                      </div>

                      {/* With Installation Callout */}
                      <div className="text-right">
                        <div className="text-[10px] text-neutral-400 font-mono">Instalado en {selectedProvince.name.split(' ')[0]}:</div>
                        <div className="text-sm font-black font-mono text-emerald-400">
                          ${totalInstalledPrice} USD
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setModalProduct(product)}
                        className="w-full py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs uppercase tracking-wider font-heading border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Ficha</span>
                      </button>

                      <a
                        href={getWhatsAppUrl(product, true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black text-xs uppercase tracking-wider font-heading hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Cotizar</span>
                      </a>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>

          {/* No results placeholder */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <h3 className="text-lg font-black font-heading text-white">No se encontraron modelos con los filtros seleccionados</h3>
              <button
                onClick={() => { setActiveBrand("todos"); setActiveArmType("todos"); setActiveTraffic("todos"); }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase font-heading"
              >
                Restablecer Filtros
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          INSTALLATION TARIFFS DETAIL TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#0c0a14] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Transparencia Total en Costos de Mano de Obra
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading uppercase text-white tracking-tight">
              Tarifario de Instalación Certificada por Provincia
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Nuestros técnicos realizan la fijación con pernos expansores de grado estructural, calibración de balance de resortes, conexión eléctrica, sincronización de controles y pruebas de seguridad anti-aplastamiento.
            </p>
          </div>

          {/* Regional Table Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {PROVINCES_DATA.map((prov) => (
              <div
                key={prov.id}
                onClick={() => setSelectedProvinceId(prov.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedProvinceId === prov.id
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-[1.02]"
                    : "bg-white/[0.02] border-white/10 text-neutral-300 hover:border-white/25 hover:bg-white/[0.04]"
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <span>{prov.flag}</span>
                    <span>{prov.name}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">{prov.region} • {prov.badgeText}</div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 font-bold text-sm">+${prov.installCost.toFixed(2)}</div>
                  <div className="text-[9px] text-emerald-400 font-bold">Garantía {prov.warrantyMonths}m</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ ACCORDION SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#09080e] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Preguntas Frecuentes de Clientes & Administradores
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white">
              Todo lo que necesitas saber antes de instalar tu barrera
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "¿Qué sucede durante un corte de energía eléctrica?",
                a: "Todas nuestras barreras cuentan con un mecanismo de desbloqueo manual mediante llave de seguridad para levantar el brazo sin esfuerzo. Además, los modelos ZKTeco y Ditec incorporan o admiten conexión a kit de baterías de respaldo de 24V para seguir operando automáticamente."
              },
              {
                q: "¿Cómo evita la barrera golpear a un automóvil o a un peatón?",
                a: "Se instalan sensores anti-aplastamiento de doble protección: Radar de microondas de 77GHz (que detecta masa metálica y peatones sin romper el piso) y Lazo Magnético Inductivo (Loop enterrado en el asfalto). Si hay algún objeto en la trayectoria, el brazo se detiene o se reabre inmediatamente."
              },
              {
                q: "¿Cuál es la ventaja de un motor DC Brushless frente a un motor convencional?",
                a: "Los motores DC Brushless (sin escobillas) no generan fricción interna ni desgaste por carbones. Esto permite una vida útil de más de 3.000.000 de ciclos continuos, velocidad regulable precisa de 1.5s y cero riesgo de sobrecalentamiento en urbanizaciones de alto flujo."
              },
              {
                q: "¿Cómo funciona el sistema de apertura manos libres con TAG UHF?",
                a: "Se coloca un sticker TAG pasivo en el parabrisas de cada vehículo de los residentes. Al aproximarse a la garita (a una distancia regulable de 6 a 12 metros), la antena lectora identifica el vehículo y abre la barrera al instante sin necesidad de que el conductor se detenga o baje el vidrio."
              },
              {
                q: "¿Pueden emitir factura con desglose de IVA y cotización formal para asambleas de copropietarios?",
                a: "Sí, emitimos facturas electrónicas oficiales con 15% de IVA y entregamos proformas técnicas detalladas con cronograma de obra civil y fichas técnicas completas para aprobación en asambleas de condominios y comités de compras."
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-heading uppercase flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-300 leading-relaxed border-t border-white/[0.06] pt-3 font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER CTA SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#06050a] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black font-heading text-xl mx-auto shadow-lg shadow-amber-500/20">
            A
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl font-black font-heading uppercase text-white">
              ATOMIC — Infraestructura y Automatización Vehicular Ecuador
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Quito • Guayaquil • Cuenca • Manta • Ambato • Machala • Santo Domingo • Red Nacional
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400 pt-2">
            <Link href="/web" className="hover:text-white transition-colors">Tienda Pública</Link>
            <span>•</span>
            <Link href="/web/cerraduras-smart" className="hover:text-white transition-colors">Cerraduras Smart</Link>
            <span>•</span>
            <Link href="/web/camaras-hogar" className="hover:text-white transition-colors">Cámaras 4K</Link>
            <span>•</span>
            <a href="https://wa.me/593999008080" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
              WhatsApp: +593 99 900 8080
            </a>
          </div>
          <p className="text-[10px] text-neutral-600 font-mono">
            © 2026 ATOMIC Electronics. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════
          DETAIL MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141120] border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
            
            {/* Close button */}
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 p-2 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={modalProduct.image}
                  alt={modalProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold uppercase border border-amber-500/30">
                  {modalProduct.brandName} • {modalProduct.armLength}
                </span>
                <h3 className="text-lg sm:text-xl font-black font-heading text-white uppercase leading-snug">
                  {modalProduct.name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-300 leading-relaxed">
              {modalProduct.description}
            </p>

            {/* Technical Specifications Table */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-amber-400 block">
                📋 Ficha Técnica Oficial:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(modalProduct.specs).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                    <span className="text-neutral-400">{key}:</span>
                    <span className="text-white font-bold text-right ml-2 truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown in Modal */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-neutral-400 font-mono">Precio Equipo con 15% IVA:</div>
                <div className="text-2xl font-black font-heading text-amber-400">
                  ${modalProduct.priceWithVat.toFixed(2)} USD
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-neutral-400 font-mono">Instalado en {selectedProvince.name.split(' ')[0]}:</div>
                <div className="text-lg font-black font-mono text-emerald-400">
                  ${(modalProduct.priceWithVat + selectedProvince.installCost).toFixed(2)} USD
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href={getWhatsAppUrl(modalProduct, true)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black text-xs uppercase tracking-widest font-heading hover:brightness-110 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Solicitar Cotización Oficial por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
