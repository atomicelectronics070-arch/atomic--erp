"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Briefcase,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Share2,
  Users,
  Phone,
  Video,
  Send,
  Smartphone,
  Calendar,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  Copy,
  Check,
  Layers,
  HelpCircle,
  Building2,
  Cpu,
  Home,
  Code2,
  Wrench,
  MessageCircle,
  Eye,
  Info,
  MapPin,
  CalendarCheck,
  ShieldAlert,
  Zap,
  Rocket,
  Scale,
  CheckSquare,
  Target,
  FileSpreadsheet
} from "lucide-react"

// ── 1. LAS 7 ACTIVIDADES ORDINARIAS (MODALIDAD SUELDO FIJO) ──
const ACTIVIDADES = [
  {
    numero: 1,
    titulo: "Publicaciones Diarias en Marketplace",
    meta: "5 publicaciones diarias",
    icono: Share2,
    color: "from-blue-500 to-cyan-500",
    canal: "Facebook Marketplace",
    evidencia: "Captura de pantalla de cada una de las 5 publicaciones activas",
    descripcion:
      "Cada mañana el grupo comercial de ATOMIC te proporcionará 5 productos específicos de tu categoría asignada con fotografías optimizadas, títulos sugeridos y descripciones comerciales. Tu responsabilidad es publicarlos en Facebook Marketplace y tomar captura legible como comprobante.",
    reglas: [
      "5 publicaciones exactas al día.",
      "Utilizar fotos y precios oficiales proporcionados por coordinación.",
      "Captura donde se aprecie la fecha y el estado activo del producto."
    ]
  },
  {
    numero: 2,
    titulo: "Difusión en Grupos de Redes Sociales",
    meta: "3 grupos diarios mínimo",
    icono: Users,
    color: "from-cyan-500 to-teal-500",
    canal: "Grupos de Facebook / Comunidades",
    evidencia: "Captura de pantalla de la publicación compartida en cada grupo",
    descripcion:
      "Compartir las publicaciones generadas en al menos 3 grupos comunitarios o comerciales locales (compra-venta, ferreterías, tecnología, constructoras o tu ciudad). Esto amplifica el alcance orgánico sin costo y capta compradores con intención inmediata.",
    reglas: [
      "Compartir en 3 grupos diferentes cada día.",
      "Tomar captura del post publicado dentro del grupo.",
      "Evitar spam reiterativo en un solo grupo el mismo día."
    ]
  },
  {
    numero: 3,
    titulo: "Búsqueda y Prospección de 10 Números Telefónicos",
    meta: "10 contactos calificados al día",
    icono: Phone,
    color: "from-indigo-500 to-blue-500",
    canal: "Google Maps / Directorios / Redes",
    evidencia: "Registro de 10 números con nombre de contacto o negocio en la plataforma",
    descripcion:
      "Investigar y recopilar exactamente 10 números de teléfono de clientes potenciales afines a la categoría asignada. Por ejemplo, si tu categoría es Computación, buscar colegios, cibercafés, academias o empresas para ofrecerles renovación de equipos. Si es Cercos, administraciones de condominios y constructoras.",
    reglas: [
      "10 números telefónicos reales por día.",
      "Anotar nombre del negocio, contacto y ciudad.",
      "Ingresar los datos en el módulo de Asistencia en la plataforma web."
    ]
  },
  {
    numero: 4,
    titulo: "7 Llamadas Telefónicas Diarias (Zoom Grabado)",
    meta: "7 llamadas efectivas al día",
    icono: Video,
    color: "from-purple-500 to-indigo-500",
    canal: "Zoom con Supervisión / Teléfono",
    evidencia: "Sesión de Zoom con la coordinadora donde se graban las 7 llamadas",
    descripcion:
      "Contactar vía llamada directa a prospectos para presentación breve de servicios o seguimiento de cotizaciones. Para garantizar tu respaldo, transparencia y apoyo en el cierre, estas 7 llamadas se realizan enlazado con la coordinadora de ATOMIC vía Zoom, quien las graba y te orienta.",
    reglas: [
      "7 llamadas en las que el cliente responda.",
      "Coordinación y supervisión en tiempo real por Zoom.",
      "La coordinadora valida y registra la asistencia de la llamada."
    ]
  },
  {
    numero: 5,
    titulo: "Seguimiento y Cotizaciones Formales",
    meta: "Atención inmediata a prospectos",
    icono: FileText,
    color: "from-amber-500 to-orange-500",
    canal: "WhatsApp / Generador de Cotizaciones",
    evidencia: "Captura de cotización formal emitida o conversación de seguimiento",
    descripcion:
      "Dar respuesta y asesoría técnica a las personas que pregunten por Marketplace, llamadas o prospección. Emitir la cotización oficial utilizando las herramientas y catálogo de ATOMIC y mantener el seguimiento activo.",
    reglas: [
      "Utilizar los precios oficiales de venta y márgenes asignados.",
      "Enviar cotización con formato formal de la empresa.",
      "Subir captura de confirmación al grupo y plataforma."
    ]
  },
  {
    numero: 6,
    titulo: "Difusión de Promociones (Lunes y Miércoles)",
    meta: "2 veces por semana (Lunes y Miércoles)",
    icono: Send,
    color: "from-emerald-500 to-teal-500",
    canal: "WhatsApp Masivo a Contactos Propios",
    evidencia: "Captura de pantalla de los mensajes enviados en lunes y miércoles",
    descripcion:
      "Los días lunes y miércoles se envía una promoción semanal, oferta flash o material de reconocimiento de marca a todos los contactos recopilados tanto por Marketplace como por Google Maps. Esta recurrencia genera confianza y madura las ventas.",
    reglas: [
      "Ejecución obligatoria los días Lunes y Miércoles.",
      "Material gráfico y texto provisto por el equipo de Marketing.",
      "Captura de entrega subida al grupo y a la plataforma."
    ]
  },
  {
    numero: 7,
    titulo: "Estados Personales en Redes Sociales",
    meta: "2 veces por semana mínimo",
    icono: Smartphone,
    color: "from-pink-500 to-rose-500",
    canal: "WhatsApp Status / Facebook Stories / Instagram",
    evidencia: "Captura de pantalla de tus historias o estados con visualizaciones",
    descripcion:
      "Al menos 2 veces por semana publicar los productos de tu categoría en tus estados personales de WhatsApp, Facebook o Instagram. Tu red cercana de contactos (amigos, familiares, conocidos) suele ser la primera en comprar o recomendarte clientes directos.",
    reglas: [
      "Mínimo 2 publicaciones de estados por semana.",
      "Tomar captura del estado publicado.",
      "Subir evidencia al grupo y a la plataforma web."
    ]
  }
]

// ── 2. MATRIZ COMPARATIVA DE EVIDENCIAS (ESTILO EXCEL) ──
const MATRIZ_EXCEL = [
  {
    responsabilidad: "1. Cinco Publicaciones Diarias en Marketplace",
    grupo: true,
    plataforma: true,
    zoom: false,
    frecuencia: "Diaria"
  },
  {
    responsabilidad: "2. Compartir en 3 Grupos de Redes Sociales",
    grupo: true,
    plataforma: false,
    zoom: false,
    frecuencia: "Diaria"
  },
  {
    responsabilidad: "3. Prospección de 10 Números Telefónicos",
    grupo: false,
    plataforma: true,
    zoom: false,
    frecuencia: "Diaria"
  },
  {
    responsabilidad: "4. Siete Llamadas Diarias (Grabadas)",
    grupo: false,
    plataforma: false,
    zoom: true,
    frecuencia: "Diaria"
  },
  {
    responsabilidad: "5. Seguimiento Comercial y Cotizaciones",
    grupo: true,
    plataforma: true,
    zoom: false,
    frecuencia: "Diaria / A demanda"
  },
  {
    responsabilidad: "6. Difusión Promocional Lunes y Miércoles",
    grupo: true,
    plataforma: true,
    zoom: false,
    frecuencia: "Lunes y Miércoles"
  },
  {
    responsabilidad: "7. Estados Personales en Redes",
    grupo: true,
    plataforma: true,
    zoom: false,
    frecuencia: "2 veces por semana"
  }
]

// ── 3. ESCALA SALARIAL PROGRESIVA (MODALIDAD FIJA) ──
const ESCALA_SALARIAL = [
  {
    mes: "Mes 1",
    etapa: "Capacitación & Prueba Laboral",
    sueldoFijo: "$100 Fijos",
    condicion: "Cumplimiento del 80% en asistencia y las 7 actividades ordinarias",
    comision: "15% de comisión en ventas generadas",
    bono: "$50 bono por cumplimiento y constancia completa",
    totalPotencial: "$150+ USD",
    destacado: false,
    color: "border-slate-300",
    descripcion:
      "Mes de inducción técnica intensiva, familiarización con el catálogo, manejo del cotizador y creación guiada de tu primera base de clientes."
  },
  {
    mes: "Mes 2",
    etapa: "Refuerzo & Manejo Autónomo",
    sueldoFijo: "$200 Fijos",
    condicion: "Superación del mes de prueba y dominio de la dinámica ordinaria",
    comision: "20% de comisión en ventas generadas (sube un 5%)",
    bono: "$65 bono por cumplimiento y constancia mensual",
    totalPotencial: "$265+ USD",
    destacado: true,
    color: "border-blue-500",
    descripcion:
      "Duplicación de sueldo fijo. Consolidación de hábitos comerciales, maduración de prospectos acumulados y acompañamiento en cierres corporativos."
  },
  {
    mes: "Mes 3",
    etapa: "Puesto Laboral Fijo Definitivo",
    sueldoFijo: "$450 Fijos Mensuales",
    condicion: "Contrato de trabajo fijo firmado con base en rendimiento comprobado",
    comision: "Comisiones y bonificaciones corporativas permanentes",
    bono: "Bonos por metas trimestrales y cartera propia",
    totalPotencial: "$450 - $750+ USD",
    destacado: false,
    color: "border-emerald-500",
    descripcion:
      "Establecimiento oficial en la nómina de ATOMIC con contrato firmado, cartera de clientes activa y estabilidad laboral a largo plazo."
  }
]

// ── 4. LAS 3 ÚNICAS TAREAS CONDICIONANTES (MODALIDAD BAJO COMISIÓN / FREELANCE) ──
const CONDICIONES_FREELANCE = [
  {
    numero: 1,
    titulo: "5 Publicaciones Diarias en Marketplace",
    frecuencia: "De Lunes a Viernes",
    icono: Share2,
    badge: "5 Posts Diarios",
    color: "border-amber-400 bg-amber-50/50 text-amber-900",
    iconBg: "bg-amber-500 text-white",
    descripcion:
      "Publicar diariamente al menos 5 productos de nuestro catálogo oficial en Facebook Marketplace y grupos comerciales de tu zona o ciudad, utilizando las fotos de alta calidad, títulos optimizados y precios asignados que te proveemos en la plataforma."
  },
  {
    numero: 2,
    titulo: "Recolectar y Contactar 15 Números de Google Maps",
    frecuencia: "15 Contactos a la Semana",
    icono: MapPin,
    badge: "15 Números Semanales",
    color: "border-cyan-400 bg-cyan-50/50 text-cyan-900",
    iconBg: "bg-cyan-600 text-white",
    descripcion:
      "Buscar en Google Maps comercios o clientes potenciales (gimnasios, clínicas, ferreterías, colegios, oficinas, talleres, condominios), registrar sus 15 números telefónicos en la plataforma web cada semana y escribirles a todos una oferta referente de nuestros productos o servicios de seguridad y tecnología."
  },
  {
    numero: 3,
    titulo: "Marcar Asistencia Diaria (Timbrado Rápido)",
    frecuencia: "1 Clic Diario en Plataforma",
    icono: CalendarCheck,
    badge: "Timbrado Activo",
    color: "border-emerald-400 bg-emerald-50/50 text-emerald-900",
    iconBg: "bg-emerald-600 text-white",
    descripcion:
      "Ingresar a la plataforma todos los días y marcar tu presencia comercial usando el botón de 'Asistencia Rápida' o en tu panel. Esto certifica que estás activo comercializando en el sistema y mantiene tu membresía en el grupo comercial bajo comisión."
  }
]

// ── 5. BENEFICIOS & HERRAMIENTAS DEL VENDEDOR FREELANCE ──
const BENEFICIOS_FREELANCE = [
  {
    titulo: "Comisiones por Cierre Sin Techo",
    desc: "Gana comisiones directas por cada venta concretada (hasta 25% de margen). Tú defines cuánto ganar según tu esfuerzo y velocidad.",
    icono: DollarSign,
    color: "text-amber-600 bg-amber-50 border-amber-200"
  },
  {
    titulo: "Cotizador PROP Inteligente",
    desc: "Genera cotizaciones profesionales en PDF de alta resolución y hojas de cálculo Excel oficiales con tu nombre y teléfono en segundos.",
    icono: FileSpreadsheet,
    color: "text-blue-600 bg-blue-50 border-blue-200"
  },
  {
    titulo: "Catálogo de 11 Categorías",
    desc: "Acceso inmediato al inventario de tecnología: CCTV, Domótica, Alarma, Redes, Fibra Óptica, Cercos Eléctricos, Computación y Software.",
    icono: Layers,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200"
  },
  {
    titulo: "Puente Directo a Sueldo Fijo",
    desc: "Si demuestras constancia y resultados como vendedor bajo comisión, tienes la puerta abierta para postularte a Sueldo Fijo en cualquier momento.",
    icono: TrendingUp,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200"
  }
]

// ── 6. TABLA COMPARATIVA DIRECTA ENTRE AMBAS MODALIDADES ──
const TABLA_COMPARATIVA = [
  {
    criterio: "Remuneración Base",
    fijo: "$100 (M1) ➔ $200 (M2) ➔ $450 (M3) Fijos Garantizados",
    comision: "100% Variable por Comisión Directa (Sin Techo de Ganancias)",
    icono: DollarSign
  },
  {
    criterio: "Salto con Experiencia (Fast-Track)",
    fijo: "✓ Sí: Postulantes con experiencia pueden saltar directo al Mes 3 ($450 Fijos)",
    comision: "Ingreso inmediato sin filtro de experiencia comercial previa",
    icono: Rocket
  },
  {
    criterio: "Dedicación y Horario",
    fijo: "2 Horas diarias dedicadas con timbrado de cumplimiento",
    comision: "100% Flexible y autónomo. Administras tus propios horarios",
    icono: Clock
  },
  {
    criterio: "Tareas Requeridas",
    fijo: "7 Actividades Diarias Verificables (Marketplace, Maps, Zoom, etc.)",
    comision: "Las 3 Únicas Tareas Obligatorias (5 posts/día, 15 Maps/semana, Timbrado)",
    icono: CheckSquare
  },
  {
    criterio: "Supervisión y Llamadas",
    fijo: "7 Llamadas diarias grabadas en Zoom con Coordinadora",
    comision: "Sin llamadas obligatorias por Zoom. Atención libre por WhatsApp",
    icono: Video
  },
  {
    criterio: "Comisiones Adicionales",
    fijo: "15% a 20% adicional de comisiones sobre ventas + Bonos",
    comision: "Comisión total por margen de producto comercializado (hasta 25%)",
    icono: TrendingUp
  },
  {
    criterio: "Estabilidad y Contrato",
    fijo: "Firma de contrato laboral formal en el Mes 3 ($450 fijos)",
    comision: "Membresía comercial continua como asesor freelance independiente",
    icono: ShieldCheck
  },
  {
    criterio: "¿Para quién es ideal?",
    fijo: "Personas que buscan sueldo fijo estable, disciplina y carrera laboral",
    comision: "Personas que desean ingresos extras, flexibilidad total o emprender",
    icono: Users
  }
]

export default function ContratacionesClient() {
  const [selectedDayDemo, setSelectedDayDemo] = useState<number | null>(4)
  const [copiedTemplate, setCopiedTemplate] = useState(false)
  const [modalidadTab, setModalidadTab] = useState<"todos" | "fijo" | "freelance">("todos")

  const whatsappNumber = "593969043453"

  // Enlaces de WhatsApp segmentados por intención
  const whatsappPreMsgFijo = encodeURIComponent(
    "Hola, deseo postular a la vacante de Carrera Laboral con Sueldo Fijo ($100 a $450/mes). Plan de capacitación de 30 días."
  )
  const whatsappLinkFijo = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsgFijo}`

  const whatsappPreMsgFastTrack = encodeURIComponent(
    "Hola, tengo experiencia previa comprobable en ventas comerciales / tecnología y deseo solicitar la evaluación Fast-Track para saltar directamente al Mes 3 con Sueldo Fijo de $450 USD mensuales + contrato laboral."
  )
  const whatsappLinkFastTrack = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsgFastTrack}`

  const whatsappPreMsgFreelance = encodeURIComponent(
    "Hola, deseo unirme como Vendedor Bajo Comisión (Freelance 100% Remoto y Flexible) y cumplir con las 3 condiciones obligatorias."
  )
  const whatsappLinkFreelance = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsgFreelance}`

  const whatsappPreMsgGeneral = encodeURIComponent(
    "Hola, quiero empezar mi mes laboral en ATOMIC. Solicito información del plan de contratación."
  )
  const whatsappLinkGeneral = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsgGeneral}`

  // Plantilla oficial que el reclutador copia para enviar a postulantes
  const plantillaReclutador = `¡Hola [Nombre]! Bienvenido al equipo comercial de ATOMIC.

Aquí tienes los enlaces e información oficial de nuestras dos modalidades comerciales:

1. Manual e Instructivo Completo Oficial:
https://atomiccotizador.shop/contrataciones#manual

2. Selecciona la modalidad que mejor se adapte a tu perfil:
   • MODALIDAD A (Sueldo Fijo & Carrera Laboral): 2 horas al día, 7 actividades ordinarias ($100 Mes 1 ➔ $200 Mes 2 ➔ $450 Mes 3 con contrato laboral).
   *NOTA:* Si ya tienes experiencia previa comprobable en ventas o tecnología, ¡puedes postular al Fast-Track para saltar directamente al Mes 3 ($450 Fijos Mensuales)!
   • MODALIDAD B (Bajo Comisión & Freelance): 100% Remoto y flexible sin horarios fijos. Cumples únicamente con las 3 tareas condicionantes: 5 posts diarios en Marketplace, 15 números de Maps a la semana y timbrado diario de asistencia.

3. Enlace de Registro Exclusivo para Vendedores:
https://atomiccotizador.shop/register/vendedor

4. Grupo de WhatsApp de tu cuadrilla:
[Ingresa al enlace del grupo que te pasamos aquí]

*Una vez registrado, ingresa al grupo de WhatsApp y notifícanos tu modalidad elegida para habilitar tus accesos y productos asignados.*

¡Muchos éxitos en tu incorporación!`

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(plantillaReclutador)
    setCopiedTemplate(true)
    setTimeout(() => setCopiedTemplate(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── HEADER CORPORATIVO OFICIAL ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-sm">
              AT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 uppercase">
                  ATOMIC
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  Talento & Contrataciones
                </span>
              </div>
              <p className="text-[11px] text-slate-700 hidden sm:block">
                Ecosistema Comercial de Empleo: Sueldo Fijo, Comisiones y Fast-Track
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/portafolio"
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Ver Portafolio</span>
              <ArrowRight size={13} />
            </Link>
            <a
              href={whatsappLinkGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>Postular por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Barra de Navegación Rápida */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none">
          <div className="max-w-6xl mx-auto flex items-center gap-4 text-xs font-bold text-slate-600">
            <a href="#modalidades" className="hover:text-blue-600 transition-colors whitespace-nowrap">
              Modalidades
            </a>
            <span className="text-slate-300">•</span>
            <a href="#sueldo-fijo" className="hover:text-blue-600 transition-colors whitespace-nowrap">
              Sueldo Fijo ($100-$450)
            </a>
            <span className="text-slate-300">•</span>
            <a href="#fast-track" className="text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap flex items-center gap-1">
              <Rocket size={13} /> Fast-Track Mes 3 ($450)
            </a>
            <span className="text-slate-300">•</span>
            <a href="#bajo-comision" className="hover:text-amber-600 transition-colors whitespace-nowrap flex items-center gap-1">
              <Zap size={13} className="text-amber-500" /> Bajo Comisión (Freelance)
            </a>
            <span className="text-slate-300">•</span>
            <a href="#comparativa" className="hover:text-blue-600 transition-colors whitespace-nowrap">
              Tabla Comparativa
            </a>
            <span className="text-slate-300">•</span>
            <a href="#manual" className="text-slate-900 font-black hover:text-blue-600 transition-colors whitespace-nowrap flex items-center gap-1">
              <FileText size={13} /> Manual Plataforma
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER: CONVOCATORIA UNIFICADA ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <Briefcase size={14} />
            <span>Convocatoria Oficial de Contratación Comercial 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            Dos Formas de Trabajar en el Equipo Comercial de <span className="text-blue-600">ATOMIC</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed mb-6">
            En ATOMIC ofrecemos dos rutas de contratación adaptadas a tu disponibilidad y perfil: <strong className="text-slate-950">Carrera Laboral con Sueldo Fijo Progresivo ($100 a $450/mes)</strong> con 2 horas diarias de trabajo y opción a <strong className="text-blue-700 font-bold">Fast-Track directo al Mes 3 ($450) por experiencia previa</strong>, o la <strong className="text-amber-700 font-bold">Modalidad Bajo Comisión & Freelance 100% Remota</strong> cumpliendo únicamente 3 tareas condicionantes.
          </p>

          {/* Selector de pestañas para filtrar la vista según preferencia */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-300 max-w-xl mx-auto mb-10 shadow-xs">
            <button
              type="button"
              onClick={() => setModalidadTab("todos")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                modalidadTab === "todos"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✦ Vista Completa (Ambas)
            </button>
            <button
              type="button"
              onClick={() => setModalidadTab("fijo")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                modalidadTab === "fijo"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <Briefcase size={13} />
              <span>Sueldo Fijo ($100-$450)</span>
            </button>
            <button
              type="button"
              onClick={() => setModalidadTab("freelance")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                modalidadTab === "freelance"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-amber-600"
              }`}
            >
              <Zap size={13} />
              <span>Bajo Comisión (Freelance)</span>
            </button>
          </div>

          {/* Tarjetas de Beneficios Rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto mb-10 text-left">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 mb-1.5">
                <Clock size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Dedicación Fija</span>
              </div>
              <p className="text-xl font-black text-slate-900">2 Horas / Día</p>
              <p className="text-[11px] text-slate-700">O 100% autónomo freelance</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
                <DollarSign size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Mes 1 Fijo</span>
              </div>
              <p className="text-xl font-black text-slate-900">$100 USD</p>
              <p className="text-[11px] text-slate-700">+ 15% Comisión + Bonos</p>
            </div>

            <div className="p-4 rounded-xl border border-blue-300 bg-blue-50/50 shadow-xs ring-2 ring-blue-400/20">
              <div className="flex items-center gap-2 text-blue-700 mb-1.5">
                <Rocket size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Salto Experiencia</span>
              </div>
              <p className="text-xl font-black text-blue-900">$450 Mes 3</p>
              <p className="text-[11px] text-blue-700 font-medium">Fast-Track directo</p>
            </div>

            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 mb-1.5">
                <Zap size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Bajo Comisión</span>
              </div>
              <p className="text-xl font-black text-slate-900">Sin Techo</p>
              <p className="text-[11px] text-amber-800 font-medium">3 Tareas Condicionantes</p>
            </div>
          </div>

          {/* Botones de acción principales */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto">
            <a
              href={whatsappLinkFijo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group"
            >
              <Briefcase size={16} />
              <span>Postular a Sueldo Fijo ($100-$450)</span>
            </a>

            <a
              href={whatsappLinkFreelance}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-2 border-amber-500 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-sm transition-all flex items-center justify-center gap-2"
            >
              <Zap size={16} className="text-amber-600" />
              <span>Postular Bajo Comisión (Freelance)</span>
            </a>

            <a
              href="#manual"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <FileText size={15} />
              <span>Ver Manual</span>
            </a>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 2: PRESENTACIÓN RESUMIDA DE LAS 2 MODALIDADES ── */}
      <section id="modalidades" className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
              Rutas de Incorporación
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
              Elige el Modelo de Trabajo que Mejor se Ajuste a Ti
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm">
              Tanto si buscas la estabilidad y progresión de un sueldo fijo como si prefieres la flexibilidad horaria absoluta y ganar comisiones directas sin límite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Tarjeta Modalidad A: Sueldo Fijo */}
            <div className="bg-white rounded-3xl border-2 border-blue-500/80 p-7 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                Carrera Laboral
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 uppercase">Modalidad A</span>
                    <h3 className="text-xl font-black text-slate-900">Sueldo Fijo & Oficina Virtual</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-5">
                  Diseñado para quienes buscan estabilidad económica, aprendizaje guiado y crecimiento dentro de la estructura corporativa de ATOMIC.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-800 mb-6 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Sueldo progresivo:</strong> $100 (Mes 1) ➔ $200 (Mes 2) ➔ $450 (Mes 3 con contrato laboral firmado).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Dedicación:</strong> 2 horas al día para cumplir las 7 actividades ordinarias diarias.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Acompañamiento:</strong> 7 llamadas diarias grabadas en Zoom con tu coordinadora para apoyo en cierres.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Rocket size={15} className="text-blue-600 shrink-0 mt-0.5" />
                    <span><strong className="text-blue-700">Opción Fast-Track:</strong> Si tienes experiencia comercial comprobable, ¡salta directo al Mes 3 ($450 Fijos)!</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Meta Mensual</span>
                  <span className="text-lg font-black text-blue-700">$100 a $450 Fijo</span>
                </div>
                <a
                  href="#sueldo-fijo"
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Ver Actividades y Escala</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* Tarjeta Modalidad B: Bajo Comisión */}
            <div className="bg-white rounded-3xl border-2 border-amber-400 p-7 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-mono text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                100% Remoto & Flexible
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                    <Zap size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-700 uppercase">Modalidad B</span>
                    <h3 className="text-xl font-black text-slate-900">Vendedor Bajo Comisión & Freelance</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-5">
                  Ideal para personas que desean generar ingresos extras sin horarios fijos, desde cualquier lugar de Ecuador y administrando su propio tiempo.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-800 mb-6 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Sin techo de ingresos:</strong> Comisiones directas por cada producto o proyecto cerrado (hasta 25% de margen).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Las 3 Únicas Tareas Obligatorias:</strong> 5 publicaciones diarias en Marketplace, 15 números de Maps a la semana y timbrado diario.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Autonomía absoluta:</strong> Sin reuniones obligatorias continuas ni supervisión de horario fijo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Puente a Sueldo Fijo:</strong> Si demuestras constancia y resultados, puedes solicitar tu paso a Sueldo Fijo.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Potencial de Ganancia</span>
                  <span className="text-lg font-black text-amber-700">Sin Límite Mensual</span>
                </div>
                <a
                  href="#bajo-comision"
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Ver 3 Condiciones</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MODALIDAD A DETALLE: 7 ACTIVIDADES Y ESCALA SALARIAL ── */}
      {(modalidadTab === "todos" || modalidadTab === "fijo") && (
        <>
          {/* ── SECCIÓN 3: LAS 7 ACTIVIDADES ORDINARIAS (SUELDO FIJO) ── */}
          <section id="sueldo-fijo" className="py-16 bg-white border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
                    Modalidad Sueldo Fijo • Plan 30 Días
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    Las 7 Actividades Diarias Ordinarias
                  </h2>
                  <p className="text-slate-700 text-xs sm:text-sm mt-1 max-w-2xl">
                    Dedicación de solo 2 horas al día. Cumplir con el 80% de estas actividades garantiza tu sueldo fijo de $100 el primer mes, $200 el segundo y $450 el tercero.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-xs font-mono bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200">
                  <Clock size={14} />
                  <span>Dedicación: 2 Horas Diarias</span>
                </div>
              </div>

              {/* Lista de las 7 actividades */}
              <div className="space-y-4">
                {ACTIVIDADES.map((act) => {
                  return (
                    <div
                      key={act.numero}
                      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-mono font-black text-base shadow-xs">
                            {act.numero}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-base font-black text-slate-900">
                                {act.titulo}
                              </h3>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                {act.meta}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed max-w-2xl mb-3">
                              {act.descripcion}
                            </p>

                            <div className="flex items-center gap-4 text-[11px] text-slate-700">
                              <div>
                                <strong className="text-slate-900">Canal:</strong> {act.canal}
                              </div>
                              <div>
                                <strong className="text-slate-900">Evidencia:</strong> {act.evidencia}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>Verificable Diario</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Cláusula de subida de evidencias */}
              <div className="mt-8 p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <p className="leading-relaxed">
                  <strong className="font-bold">Cláusula de Constancia Obligatoria:</strong> Cada una de las evidencias solicitadas en estas 7 actividades debe ser enviada tanto al <strong className="font-bold">Grupo de WhatsApp asignado</strong> como subida a la <strong className="font-bold">Plataforma Web Oficial de ATOMIC</strong> en tu panel de asistencia para el registro y auditoría del porcentaje mensual de cumplimiento.
                </p>
              </div>

            </div>
          </section>

          {/* ── CUADRO COMPARATIVO / MATRIZ ESTILO EXCEL (CON 'X') ── */}
          <section className="py-16 bg-white border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
                  Matriz de Entrega de Constancias
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
                  Esquema de Canales de Evidencia (Estilo Hoja de Control)
                </h2>
                <p className="text-slate-700 text-xs sm:text-sm">
                  Cuadro comparativo exacto de dónde debes consignar cada constancia para que sea validada por coordinación.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-300 rounded-2xl shadow-xs bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono uppercase text-[11px] tracking-wider">
                      <th className="py-3.5 px-4 border-r border-slate-800 font-bold">
                        Responsabilidad / Actividad
                      </th>
                      <th className="py-3.5 px-3 border-r border-slate-800 text-center font-bold">
                        Frecuencia
                      </th>
                      <th className="py-3.5 px-3 border-r border-slate-800 text-center font-bold bg-slate-800">
                        Grupo WhatsApp
                      </th>
                      <th className="py-3.5 px-3 border-r border-slate-800 text-center font-bold bg-slate-800/80">
                        Plataforma Web
                      </th>
                      <th className="py-3.5 px-3 text-center font-bold bg-slate-800/60">
                        Zoom (Grabado)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {MATRIZ_EXCEL.map((row, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                      >
                        <td className="py-3 px-4 border-r border-slate-200 font-bold text-slate-900">
                          {row.responsabilidad}
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200 text-center text-slate-700 text-[11px] font-mono">
                          {row.frecuencia}
                        </td>
                        {/* Columna Grupo WhatsApp */}
                        <td className="py-3 px-3 border-r border-slate-200 text-center font-black">
                          {row.grupo ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-100 text-blue-700 text-xs font-mono font-black">
                              X
                            </span>
                          ) : (
                            <span className="text-slate-300 font-mono">—</span>
                          )}
                        </td>
                        {/* Columna Plataforma Web */}
                        <td className="py-3 px-3 border-r border-slate-200 text-center font-black">
                          {row.plataforma ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-emerald-100 text-emerald-700 text-xs font-mono font-black">
                              X
                            </span>
                          ) : (
                            <span className="text-slate-300 font-mono">—</span>
                          )}
                        </td>
                        {/* Columna Zoom Grabado */}
                        <td className="py-3 px-3 text-center font-black">
                          {row.zoom ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-purple-100 text-purple-700 text-xs font-mono font-black">
                              X
                            </span>
                          ) : (
                            <span className="text-slate-300 font-mono">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-700 font-mono">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">X</span>
                    <span>Obligatorio en Grupo</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">X</span>
                    <span>Obligatorio en Plataforma Web</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">X</span>
                    <span>Grabado en Zoom con Coordinadora</span>
                  </span>
                </div>
                <div>
                  <span>* Base mínima aprobatoria: 80% de aciertos mensuales.</span>
                </div>
              </div>

            </div>
          </section>

          {/* ── PLAN DE CARRERA Y ESCALA SALARIAL (3 MESES) ── */}
          <section className="py-16 bg-slate-50 border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
                  Crecimiento Laboral y Económico
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
                  Plan de Proyección Salarial de 3 Meses
                </h2>
                <p className="text-slate-700 text-sm">
                  Desde tu primer mes de capacitación hasta la firma de tu contrato laboral fijo con cartera propia de clientes.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {ESCALA_SALARIAL.map((etapa, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border-2 p-6 flex flex-col justify-between shadow-xs transition-all relative ${
                      etapa.destacado ? "border-blue-600 shadow-md ring-4 ring-blue-50" : etapa.color
                    }`}
                  >
                    {etapa.destacado && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs">
                        Paso Clave al 2do Mes
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-slate-700 uppercase">
                          {etapa.mes}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {etapa.etapa}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-3xl font-black text-slate-950">{etapa.sueldoFijo}</p>
                        <p className="text-xs text-slate-700 mt-1">{etapa.condicion}</p>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed mb-6">
                        {etapa.descripcion}
                      </p>

                      <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700">Comisión por Ventas:</span>
                          <strong className="text-slate-900">{etapa.comision}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700">Bono por Constancia:</span>
                          <strong className="text-slate-900">{etapa.bono}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl text-center">
                      <span className="text-[11px] font-mono text-slate-700 uppercase block mb-0.5">
                        Ingreso Proyectado
                      </span>
                      <span className="text-xl font-black text-blue-700">{etapa.totalPotencial}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── ⭐ BANNER DE FAST-TRACK: SALTO DIRECTO AL 3ER MES POR EXPERIENCIA PREVIA ── */}
              <div id="fast-track" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white shadow-xl border-2 border-blue-400/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400 text-blue-200 text-xs font-mono font-bold uppercase tracking-wider">
                      <Rocket size={14} className="text-blue-300" />
                      <span>Acceso Directo por Experiencia Comprobada</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                      ¿Tienes Experiencia en Ventas? <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-white">
                        Salta Directamente al 3er Mes ($450 Fijos Mensuales).
                      </span>
                    </h3>

                    <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                      Si ya cuentas con trayectoria comprobable en ventas comerciales, telemarketing, atención a clientes o aportas cartera comercial afín a nuestras categorías (cámaras de seguridad, redes, domótica, cercos, etc.), <strong>no requieres empezar desde el Mes 1 ($100)</strong>. Puedes solicitar la <strong>Evaluación Fast-Track</strong>: tras una entrevista técnica y validación con Coordinación y Gerencia, ingresarás directamente al <strong>Mes 3 con Sueldo Fijo de $450 USD Mensuales + Comisiones Corporativas y Contrato de Trabajo Firmado</strong>.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                        <span className="text-blue-300 font-bold block mb-1">1. Experiencia Previa</span>
                        <p className="text-[11px] text-blue-100">Trayectoria en ventas comerciales o tecnología.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                        <span className="text-blue-300 font-bold block mb-1">2. Validación Rápida</span>
                        <p className="text-[11px] text-blue-100">Entrevista técnica con coordinación por Zoom/llamada.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                        <span className="text-blue-300 font-bold block mb-1">3. Puesto Inmediato</span>
                        <p className="text-[11px] text-blue-100">$450 Fijo mensual + contrato de trabajo.</p>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto">
                    <a
                      href={whatsappLinkFastTrack}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 group"
                    >
                      <Rocket size={18} />
                      <span>Postular al Fast-Track ($450 Fijo)</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <span className="block text-center text-[10px] text-blue-300 font-mono mt-2">
                      Previa validación en entrevista de coordinación
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

      {/* ── MODALIDAD B DETALLE: FREELANCE & 3 CONDICIONES OBLIGATORIAS ── */}
      {(modalidadTab === "todos" || modalidadTab === "freelance") && (
        <section id="bajo-comision" className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-slate-50 border-2 border-amber-400 shadow-sm space-y-8 mb-12">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-200 pb-6">
                <div>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-900 font-mono text-xs font-bold uppercase tracking-widest mb-3">
                    <ShieldAlert size={14} className="text-amber-600" /> Modalidad Bajo Comisión • 100% Remoto
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    Las 3 Tareas Obligatorias y Condicionantes
                  </h2>
                  <p className="text-slate-700 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                    Para pertenecer y permanecer activo en el grupo comercial bajo comisión sin horario fijo, debes cumplir estrictamente con estas 3 actividades de lunes a viernes:
                  </p>
                </div>

                <span className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 shadow-xs">
                  Sin Excepciones
                </span>
              </div>

              {/* Los 3 Pilares Freelance */}
              <div className="grid md:grid-cols-3 gap-6">
                {CONDICIONES_FREELANCE.map((cond) => {
                  const Icon = cond.icono
                  return (
                    <div
                      key={cond.numero}
                      className="p-6 rounded-2xl bg-white border-2 border-slate-200 space-y-3.5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-xl ${cond.iconBg} flex items-center justify-center font-black text-xl shadow-xs`}>
                            {cond.numero}
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {cond.frecuencia}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                            <Icon size={16} className="text-amber-600 shrink-0" />
                            <span>{cond.titulo}</span>
                          </h3>
                        </div>

                        <p className="text-slate-700 text-xs leading-relaxed">
                          {cond.descripcion}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800">
                          <CheckCircle2 size={13} className="text-amber-600" />
                          <span>Condición de membresía activa</span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Cláusula Condicionante Destacada (Cita Oficial) */}
              <div className="p-5 rounded-2xl bg-amber-100/80 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p>
                  <strong>Regla de Permanencia Oficial:</strong> <em>"¿Sabías que para pertenecer al grupo bajo comisión debes marcar tu asistencia todos los días aquí en la plataforma, hacer 5 publicaciones cada día, además de recolectar 15 números de teléfono a la semana de clientes potenciales de Google Maps que registrarás en la plataforma y les escribirás ofertando nuestros servicios? Son las únicas tres tareas condicionantes y obligatorias para pertenecer al grupo bajo comisión."</em>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-200">
                <div className="text-xs text-slate-700">
                  ¿Listo para comenzar a comisionar sin horarios fijos?
                </div>
                <a
                  href={whatsappLinkFreelance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
                >
                  <Zap size={15} />
                  <span>Unirme como Vendedor Bajo Comisión</span>
                </a>
              </div>
            </div>

            {/* Herramientas Comerciales del Freelance */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-950 mb-2">
                Herramientas y Ventajas Comerciales del Asesor Freelance
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm mb-6">
                Aunque trabajes de forma independiente, cuentas con todo el respaldo tecnológico e inventario de ATOMIC.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {BENEFICIOS_FREELANCE.map((ben, idx) => {
                  const Icon = ben.icono
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2.5 shadow-xs"
                    >
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${ben.color}`}>
                        <Icon size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{ben.titulo}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{ben.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── SECCIÓN 4: TABLA COMPARATIVA DIRECTA (SUELDO FIJO VS. BAJO COMISIÓN) ── */}
      <section id="comparativa" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
              Análisis Comparativo
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
              Tabla Comparativa: Sueldo Fijo vs. Bajo Comisión
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm">
              Compara directamente ambas modalidades para tomar la mejor decisión según tu tiempo, metas económicas y experiencia previa.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-300 rounded-2xl shadow-xs bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-mono uppercase text-[11px] tracking-wider">
                  <th className="py-4 px-4 border-r border-slate-800 font-bold w-1/4">
                    Criterio de Evaluación
                  </th>
                  <th className="py-4 px-4 border-r border-slate-800 font-bold w-[38%] bg-blue-950 text-blue-200">
                    Modalidad Sueldo Fijo ($100 a $450)
                  </th>
                  <th className="py-4 px-4 font-bold w-[37%] bg-amber-950 text-amber-200">
                    Modalidad Bajo Comisión (Freelance)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {TABLA_COMPARATIVA.map((row, idx) => {
                  const Icon = row.icono
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                      <td className="py-3.5 px-4 border-r border-slate-200 font-bold text-slate-900 flex items-center gap-2">
                        <Icon size={14} className="text-blue-600 shrink-0" />
                        <span>{row.criterio}</span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-800 font-medium">
                        {row.fijo}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {row.comision}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappLinkFijo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
            >
              <Briefcase size={15} />
              <span>Postular a Sueldo Fijo / Fast-Track</span>
            </a>
            <a
              href={whatsappLinkFreelance}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center gap-2"
            >
              <Zap size={15} />
              <span>Postular Bajo Comisión</span>
            </a>
          </div>

        </div>
      </section>

      {/* ── INTRODUCCIÓN A LA EMPRESA & ESPECIALIZACIÓN POR CATEGORÍA ── */}
      <section className="py-14 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
                Estructura Organizacional
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                ¿Qué es ATOMIC y cómo te especializamos?
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-700 font-medium">Conoce nuestro catálogo completo:</span>
              <Link
                href="/portafolio"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Ver Portafolio de Servicios</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-slate-700 text-sm leading-relaxed">
            <div>
              <p className="mb-4">
                En <strong className="text-slate-950">ATOMIC</strong> desarrollamos y comercializamos soluciones de alta tecnología y equipamiento para constructoras, industrias, comercios y hogares en todo el Ecuador. No te dejamos solo: a cada vendedor seleccionado se le asigna una <strong className="text-slate-950">categoría específica de productos</strong> para que se vuelva un especialista conocedor de la materia y domine las características técnicas de venta.
              </p>
              <p>
                Nos encargamos de orientarte y acompañarte para que generes una <strong className="text-slate-950">cartera de clientes sólida</strong> que te pertenezca y siga produciendo comisiones mes a mes.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2">
                Grandes Categorías de Asignación Comercial:
              </h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span><strong>Seguridad Electrónica:</strong> Cámaras CCTV, alarmas inalámbricas, videoporteros y citofonía.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span><strong>Control de Acceso:</strong> Torniquetes, barreras vehiculares, cerraduras digitales y biométricos.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span><strong>Telecomunicaciones & Redes:</strong> Fibra óptica, cableado estructurado, racks y switches PoE.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span><strong>Cómputo & Domótica:</strong> Laptops corporativas, estaciones de trabajo, domótica smart y energía solar.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span><strong>Software ERP & IA 2027:</strong> Sistemas de gestión de inventarios, facturación electrónica y automatización.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── LLAMADO A LA ACCIÓN INMEDIATO (DUAL CTA WHATSAPP) ── */}
      <section className="py-14 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-blue-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest block mb-2">
            Comienza Hoy Mismo
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 text-white">
            ¿Listo para Empezar a Generar Ingresos en ATOMIC?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Elige la modalidad que prefieras, escríbenos directamente por WhatsApp para coordinar tu incorporación y crea tu cuenta de vendedor en el sistema.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappLinkFijo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Briefcase size={16} />
              <span>Postular a Sueldo Fijo ($100 - $450)</span>
            </a>

            <a
              href={whatsappLinkFastTrack}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-100 text-blue-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Rocket size={16} className="text-blue-600" />
              <span>Fast-Track al Mes 3 ($450)</span>
            </a>

            <a
              href={whatsappLinkFreelance}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              <span>Postular Bajo Comisión</span>
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-blue-200">
            <span>¿Ya tienes claro tu plan?</span>
            <Link href="/register/vendedor" className="underline font-bold text-white hover:text-blue-300">
              Registra tu cuenta de vendedor aquí →
            </Link>
          </div>

          <p className="text-xs text-blue-300/80 mt-4 font-mono">
            WhatsApp Oficial de Coordinación: +593 96 904 3453
          </p>
        </div>
      </section>

      {/* ── INSTRUCTIVO Y MANUAL PASO A PASO DE LA PLATAFORMA (#manual) ── */}
      <section id="manual" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
              Guía Oficial de Plataforma
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
              Instructivo Paso a Paso para Vendedores
            </h2>
            <p className="text-slate-700 text-sm">
              Aprende cómo registrarte, ingresar a tu panel de control, marcar tu asistencia rápida y subir tus evidencias día a día para que tu porcentaje de efectividad se compute de forma automática.
            </p>
          </div>

          {/* Pasos ordenados */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-mono font-black text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Registro Oficial de Vendedor
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Ingresa al enlace exclusivo de registro para vendedores. Completa tus nombres, cédula, teléfono de WhatsApp y contraseña.
              </p>
              <Link
                href="/register/vendedor"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
              >
                <span>Ir al Registro de Vendedor</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-mono font-black text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Iniciar Sesión y Acceder
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Accede desde la pantalla de login con tu email y contraseña. Nuestro sistema inteligente detectará automáticamente tu rol de vendedor y te conducirá a tu panel.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
              >
                <span>Acceder al Login</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-mono font-black text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Asistencia y Carga de Evidencias
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                En el módulo <strong className="text-slate-900">Asistencia</strong>, marca tu asistencia diaria y sube tus capturas de Marketplace, números de Maps y comprobantes de llamada.
              </p>
              <span className="text-[11px] text-slate-700 font-mono">
                Ruta: /dashboard/asistencia
              </span>
            </div>
          </div>

          {/* ── VISOR DEMOSTRATIVO DE LA CUADRÍCULA DE 30 DÍAS ── */}
          <div className="border-2 border-slate-300 rounded-3xl p-6 sm:p-8 bg-white shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                  Simulador de Cuadrícula en Vivo
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Cuadrícula de Seguimiento Diario (Mes de 30 Días)
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  Listo (80%+ cumplido)
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <div className="w-2.5 h-2.5 rounded bg-blue-500" />
                  En Curso / Hoy
                </span>
              </div>
            </div>

            {/* Cuadrícula de 30 casillas */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 mb-6">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                const isPast = dayNum < 4
                const isSelected = selectedDayDemo === dayNum
                const isToday = dayNum === 4

                let styleBg = "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                if (isPast) {
                  styleBg = "bg-emerald-50 border-emerald-300 text-emerald-800"
                } else if (isToday) {
                  styleBg = "bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-500"
                }

                if (isSelected) {
                  styleBg += " ring-2 ring-slate-900"
                }

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setSelectedDayDemo(dayNum)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[58px] ${styleBg}`}
                  >
                    <span className="text-xs font-mono font-bold">{dayNum}</span>
                    <span className="text-[9px] font-mono font-semibold uppercase">
                      {isPast ? "Listo" : isToday ? "Hoy" : "Pend."}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Detalle interactivo del día seleccionado */}
            {selectedDayDemo && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Revisión de Avance: Día {selectedDayDemo} de 30
                  </h4>
                  <span className="font-mono text-slate-700">
                    {selectedDayDemo < 4
                      ? "Estado: Aprobado (100% de actividades completadas)"
                      : selectedDayDemo === 4
                      ? "Estado: En curso (Jornada de hoy activa)"
                      : "Estado: Programado en calendario"}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-700 block text-[10px]">1. Marketplace (5 posts)</span>
                    <strong className="text-slate-900">{selectedDayDemo < 4 ? "5 / 5 subidas" : selectedDayDemo === 4 ? "3 / 5 subidas" : "0 / 5"}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-700 block text-[10px]">2. Grupos de Redes (3 mín.)</span>
                    <strong className="text-slate-900">{selectedDayDemo < 4 ? "3 / 3 compartidas" : selectedDayDemo === 4 ? "2 / 3 compartidas" : "0 / 3"}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-700 block text-[10px]">3. Números Prospección (10)</span>
                    <strong className="text-slate-900">{selectedDayDemo < 4 ? "10 registrados" : selectedDayDemo === 4 ? "6 registrados" : "0 / 10"}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-700 block text-[10px]">4. Llamadas Zoom (7)</span>
                    <strong className="text-slate-900">{selectedDayDemo < 4 ? "7 grabadas" : selectedDayDemo === 4 ? "4 grabadas" : "0 / 7"}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-700 block text-[10px]">5. Cotizaciones Formales</span>
                    <strong className="text-slate-900">{selectedDayDemo < 4 ? "Completado" : selectedDayDemo === 4 ? "En proceso" : "Pendiente"}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-700 block text-[10px]">6 y 7. Difusiones y Estados</span>
                    <strong className="text-slate-900">{selectedDayDemo < 4 ? "Comprobante OK" : selectedDayDemo === 4 ? "Comprobante OK" : "Programado"}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── PLANTILLA PARA EL MENSAJE DE WHATSAPP DEL RECLUTADOR ── */}
          <div className="mt-12 p-6 rounded-2xl border border-slate-300 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-700 block">
                  Herramienta de Coordinación
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Plantilla de Mensaje de WhatsApp para Enviar al Postulante (Ambas Modalidades)
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                {copiedTemplate ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span>¡Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copiar Plantilla</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {plantillaReclutador}
            </pre>
          </div>

        </div>
      </section>

      {/* ── FOOTER CORPORATIVO SOBRIO ── */}
      <footer className="py-10 bg-white border-t border-slate-200 text-slate-700 text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="font-bold text-slate-900">ATOMIC SOLUTIONS S.A.</span>
            <span>• Convocatorias y Empleo Comercial 2026</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <Link href="/portafolio" className="hover:text-slate-950 transition-colors">
              Portafolio
            </Link>
            <Link href="/web" className="hover:text-slate-950 transition-colors">
              Tienda
            </Link>
            <Link href="/login" className="hover:text-slate-950 transition-colors">
              Acceso Sistema
            </Link>
            <a
              href="https://wa.me/593969043453"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline"
            >
              WhatsApp Soporte
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
