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
  FileSpreadsheet,
  AlertTriangle,
  Monitor,
  Laptop
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

// ── 3. ESCALA SALARIAL Y NIVELES DE RENDIMIENTO COMPLETO ──
const ESCALA_SALARIAL = [
  {
    mes: "Nivel Rendimiento",
    etapa: "Rendimiento Base (Esfuerzo Inicial)",
    sueldoFijo: "$25 USD",
    condicion: "Asistencia >80%, Publicaciones >80%, 3 números de Maps diarios contactados y al menos 3 llamadas a la semana",
    comision: "20% de comisión en ventas generadas",
    bono: "Acceso a bonos comerciales y herramientas oficiales",
    totalPotencial: "$25 - $80+ USD",
    destacado: false,
    color: "border-amber-300 bg-amber-50/30",
    badge: "Rendimiento Base $25",
    badgeColor: "bg-amber-100 text-amber-900 border border-amber-300",
    descripcion:
      "Para quien no alcanza a cubrir las 7 actividades completas, pero demuestra disciplina cumpliendo asistencia, publicaciones, prospección de 3 contactos diarios por Maps y 3 llamadas por semana (pese a un bajo rendimiento siguen perteneciendo al grupo y accediendo a bonos, herramientas y comisiones del 20%)."
  },
  {
    mes: "Mes 1",
    etapa: "Capacitación & Prueba Laboral",
    sueldoFijo: "$100 Fijos",
    condicion: "Cumplimiento del 80% en asistencia y las 7 actividades ordinarias completas (2h/día)",
    comision: "20% de comisión en ventas generadas",
    bono: "$50 bono por cumplimiento y constancia completa",
    totalPotencial: "$150 - $250+ USD",
    destacado: false,
    color: "border-slate-300",
    badge: "Plan Laboral Oficial",
    badgeColor: "bg-blue-100 text-blue-900 border border-blue-200",
    descripcion:
      "Mes de inducción técnica intensiva, familiarización con el catálogo, manejo del cotizador y creación guiada de tu primera base de clientes."
  },
  {
    mes: "Mes 2",
    etapa: "Refuerzo & Manejo Autónomo",
    sueldoFijo: "$200 Fijos",
    condicion: "Superación del mes de prueba y dominio de las 7 actividades diarias",
    comision: "20% de comisión en ventas generadas",
    bono: "$65 bono por cumplimiento y constancia mensual",
    totalPotencial: "$265 - $400+ USD",
    destacado: true,
    color: "border-blue-500",
    badge: "Paso Clave al 2do Mes",
    badgeColor: "bg-blue-600 text-white",
    descripcion:
      "Duplicación de sueldo fijo. Consolidación de hábitos comerciales, maduración de prospectos acumulados y acompañamiento en cierres corporativos."
  },
  {
    mes: "Mes 3",
    etapa: "Puesto Laboral Fijo Definitivo",
    sueldoFijo: "$450 Fijos Mensuales",
    condicion: "Disponibilidad de 8 horas (9am-5pm), computadora + celular y contrato formal firmado",
    comision: "20% comisiones corporativas permanentes",
    bono: "Bonos por metas trimestrales y cartera propia",
    totalPotencial: "$450 - $800+ USD",
    destacado: false,
    color: "border-emerald-500",
    badge: "Contrato Laboral Fijo",
    badgeColor: "bg-emerald-600 text-white",
    descripcion:
      "Establecimiento oficial en la nómina de ATOMIC con contrato laboral firmado, 8 horas disponibles (9am a 5pm), equipo informático y cartera activa."
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
    titulo: "20% de Comisión Directa por Cierre",
    desc: "Gana el 20% de comisión directa por cada venta concretada. Sin límites ni techos mensuales de ganancia.",
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
    fijo: "$25 (Rendimiento Base) ➔ $100 (M1) ➔ $200 (M2) ➔ $450 (M3) Fijos Garantizados (pese a un bajo rendimiento siguen en el grupo accediendo a bonos)",
    comision: "100% Variable por Comisión Directa del 20% (Sin Techo de Ganancias)",
    icono: DollarSign
  },
  {
    criterio: "Salto con Experiencia (Fast-Track)",
    fijo: "✓ Sí: Puedes pugnar directo por los $450 Fijos si tienes experiencia, PC, celular y 8h disponibles",
    comision: "Ingreso inmediato sin filtro de experiencia comercial previa",
    icono: Rocket
  },
  {
    criterio: "Dedicación y Horario",
    fijo: "2 Horas diarias dedicadas ($100-$200) u 8 Horas (9am a 5pm para puesto de $450)",
    comision: "100% Flexible y autónomo. Administras tus propios horarios",
    icono: Clock
  },
  {
    criterio: "Equipamiento Obligatorio",
    fijo: "Obligatorio Computadora (Laptop o PC) y Teléfono Celular operativo",
    comision: "Teléfono celular con WhatsApp y acceso a la plataforma web",
    icono: Monitor
  },
  {
    criterio: "Tareas Requeridas",
    fijo: "7 Actividades Diarias Verificables (o 4 tareas para el bono de rendimiento de $25)",
    comision: "Asistencia y publicaciones (mínimo de permanencia en grupo sin sueldo fijo)",
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
    fijo: "20% de comisión adicional sobre ventas concretadas + Bonos",
    comision: "20% de comisión directa por cada producto o proyecto cerrado",
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
    fijo: "Personas que buscan sueldo fijo estable, disciplina y carrera laboral formal",
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

  const whatsappPreMsgRendimiento25 = encodeURIComponent(
    "Hola, deseo postularme a la opción de Rendimiento Base ($25 USD al mes + 20% comisión) cumpliendo asistencia >80%, publicaciones >80%, 3 números de Maps diarios contactados y 3 llamadas semanales (pese a un bajo rendimiento sigo perteneciendo al grupo y accediendo a bonos)."
  )
  const whatsappLinkRendimiento25 = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsgRendimiento25}`

  const whatsappPreMsgFastTrack = encodeURIComponent(
    "Hola, cuento con experiencia previa en ventas, dispongo de computadora, celular y disponibilidad completa de 8 horas (de 9:00 AM a 5:00 PM) para realizar las 7 actividades de golpe. Deseo pugnar por el puesto fijo de $450 fijos mensuales de una vez."
  )
  const whatsappLinkFastTrack = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsgFastTrack}`

  const whatsappPreMsgFreelance = encodeURIComponent(
    "Hola, deseo unirme como Vendedor Bajo Comisión (Freelance 100% Remoto y Flexible, 20% de comisión) y cumplir con las condiciones para pertenecer al grupo."
  )
  const whatsappLinkFreelance = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsgFreelance}`

  const whatsappPreMsgGeneral = encodeURIComponent(
    "Hola, quiero empezar mi mes laboral en ATOMIC. Solicito información del plan de contratación."
  )
  const whatsappLinkGeneral = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsgGeneral}`

  // Plantilla oficial que el reclutador copia para enviar a postulantes
  const plantillaReclutador = `¡Hola [Nombre]! Bienvenido al equipo comercial de ATOMIC.

Aquí tienes el instructivo oficial y los enlaces para incorporarte a nuestro equipo:

1. Manual e Instructivo Completo Oficial:
https://atomiccotizador.shop/contrataciones#manual

2. Esquema de Ingresos y Niveles de Desempeño:
   • PERMANENCIA EN EL GRUPO (Sin Sueldo Fijo): Si cumples tu asistencia diaria y tus publicaciones en Marketplace, te mantienes activo en el grupo comercial y ganas el 20% DE COMISIÓN DIRECTA por cada venta que cierres, pero NO genera remuneración fija (pese a un bajo rendimiento sigues perteneciendo al grupo y accediendo a bonos y beneficios).
   • RENDIMIENTO BÁSICO ($25 USD FIJOS): Para cobrar al menos $25 al mes, debes cumplir asistencia >80%, publicaciones >80%, registrar y escribir a 3 números diarios de Google Maps y hacer al menos 3 llamadas en la semana (+ 20% comisión). (Nota: pese a un bajo rendimiento sigues perteneciendo al grupo y accediendo a bonos y comisiones).
   • PLAN LABORAL 30 DÍAS ($100 Mes 1 ➔ $200 Mes 2 ➔ $450 Mes 3): 2 horas diarias cumpliendo las 7 actividades ordinarias completas con más del 80% de efectividad (+ 20% comisión + bonos).
   • PUGNA DIRECTA POR $450 (FAST-TRACK): "Si tú tienes todas las habilidades, cuentas con experiencia y crees que puedes realizar estas siete actividades de golpe, avísanos y pugna por los $450 de una vez". Requiere computadora, celular y disponibilidad de 8 horas de 9:00 AM a 5:00 PM.

3. Enlace de Registro Exclusivo para Vendedores:
https://atomiccotizador.shop/register/vendedor

4. Grupo de WhatsApp de tu cuadrilla:
[Ingresa al enlace del grupo que te pasamos aquí]

*Una vez registrado, ingresa al grupo y confírmanos tu nivel elegido para habilitar tus accesos y productos.*

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
                Ecosistema Comercial de Empleo: Rendimiento $25, Sueldo Fijo $100-$450 y Comisiones al 20%
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
            <a href="#permanencia" className="text-amber-800 hover:text-amber-950 transition-colors whitespace-nowrap flex items-center gap-1">
              <AlertTriangle size={13} className="text-amber-600" /> Permanencia vs. Sueldo
            </a>
            <span className="text-slate-300">•</span>
            <a href="#escala-rendimiento" className="hover:text-blue-600 transition-colors whitespace-nowrap">
              Escala ($25 - $450)
            </a>
            <span className="text-slate-300">•</span>
            <a href="#sueldo-fijo" className="hover:text-blue-600 transition-colors whitespace-nowrap">
              7 Actividades Diarias
            </a>
            <span className="text-slate-300">•</span>
            <a href="#fast-track" className="text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap flex items-center gap-1">
              <Rocket size={13} /> Pugna por los $450 (8h)
            </a>
            <span className="text-slate-300">•</span>
            <a href="#bajo-comision" className="hover:text-amber-600 transition-colors whitespace-nowrap flex items-center gap-1">
              <Zap size={13} className="text-amber-500" /> Bajo Comisión (20%)
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

      {/* ── HERO BANNER: CONVOCATORIA UNIFICADA CON ESCALAFÓN CLARO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <Briefcase size={14} />
            <span>Convocatoria Oficial de Contratación Comercial 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            Estructura de Contratación Comercial de <span className="text-blue-600">ATOMIC</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed mb-6">
            Un esquema progresivo diseñado para premiar el esfuerzo real: desde el <strong className="text-amber-800 font-bold">Rendimiento Base de $25 USD</strong> para quienes inician con pequeñas actividades activas <span className="text-slate-600 font-normal">(pese a un bajo rendimiento siguen perteneciendo al grupo y accediendo a bonos)</span>, el <strong className="text-blue-700 font-bold">Plan Laboral de $100 a $450 USD mensuales</strong> con dedicación diaria, hasta la opción de <strong className="text-slate-950 font-bold">Pugnar Directamente por los $450 Fijos</strong> si cuentas con experiencia, computadora, celular y disponibilidad completa de 8 horas. Todos con el <strong className="text-emerald-700 font-bold">20% de comisión directa</strong>.
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
              ✦ Vista Completa (Todos los Niveles)
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
              <span>Sueldo Fijo ($25 - $450)</span>
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
              <span>Bajo Comisión (20%)</span>
            </button>
          </div>

          {/* Tarjetas de Beneficios Rápidos (Los 4 Niveles Clave) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto mb-10 text-left">
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 mb-1.5">
                <Target size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Rendimiento Base</span>
              </div>
              <p className="text-xl font-black text-slate-900">$25 USD</p>
              <p className="text-[11px] text-amber-900 font-medium leading-tight mt-1">
                Asist. + Posts + 3 Maps + 3 Llamadas <br />
                <span className="text-slate-600 text-[10px] font-normal">(pese a bajo rendimiento sigues en el grupo accediendo a bonos)</span>
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 mb-1.5">
                <DollarSign size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Plan Laboral M1</span>
              </div>
              <p className="text-xl font-black text-slate-900">$100 USD</p>
              <p className="text-[11px] text-slate-700">7 Actividades completas + 20% com.</p>
            </div>

            <div className="p-4 rounded-xl border border-blue-400 bg-blue-50/50 shadow-xs ring-2 ring-blue-400/20">
              <div className="flex items-center gap-2 text-blue-700 mb-1.5">
                <Rocket size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Pugna por los $450</span>
              </div>
              <p className="text-xl font-black text-blue-900">$450 Fijo</p>
              <p className="text-[11px] text-blue-700 font-medium">8h de 9 a 5 + PC y Celular</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 mb-1.5">
                <TrendingUp size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Comisiones</span>
              </div>
              <p className="text-xl font-black text-slate-900">20% Directo</p>
              <p className="text-[11px] text-emerald-800 font-medium">En todos los productos y ventas</p>
            </div>
          </div>

          {/* Botones de acción principales */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto">
            <a
              href={whatsappLinkFastTrack}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group"
            >
              <Rocket size={16} />
              <span>Pugnar por los $450 (Fast-Track 8 Horas)</span>
            </a>

            <a
              href={whatsappLinkRendimiento25}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-2 border-amber-500 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-sm transition-all flex items-center justify-center gap-2"
            >
              <Target size={16} className="text-amber-600" />
              <span>Aplicar a Rendimiento $25</span>
            </a>

            <a
              href="#manual"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <FileText size={15} />
              <span>Manual</span>
            </a>
          </div>

        </div>
      </section>

      {/* ── ⭐ APARTADO MUY EVIDENTE: PERMANENCIA EN EL GRUPO VS. REMUNERACIÓN ── */}
      <section id="permanencia" className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-500 shadow-sm relative overflow-hidden space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-300 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-black uppercase tracking-wider text-amber-900 block">
                    Regla Fundamental de Contratación
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                    Permanencia en el Grupo vs. Remuneración Económica
                  </h2>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shrink-0 shadow-xs">
                Lectura Obligatoria
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              
              {/* Cláusula 1: Lo Mínimo para Permanecer */}
              <div className="p-4 rounded-2xl bg-white/90 border border-amber-300 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <CheckCircle2 size={16} className="text-amber-600" />
                  <span>1. ¿Qué cumples si solo haces asistencia y publicaciones?</span>
                </div>
                <p className="text-slate-700">
                  Si una persona simplemente cumple con marcar su asistencia diaria en la plataforma y realizar sus publicaciones en Facebook Marketplace, <strong className="text-slate-950">cumple con lo estrictamente mínimo para pertenecer y permanecer dentro del grupo comercial</strong>, nada más <span className="text-amber-900 font-semibold">(pese a un bajo rendimiento siguen perteneciendo al grupo, accediendo a bonos comerciales y ganando el 20% de comisión directa por cada venta)</span>. <strong className="text-rose-700 underline">NO es acreedora a ningún tipo de sueldo ni remuneración fija</strong>. Mientras tanto, goza de todos los beneficios de la empresa: acceso al catálogo completo de 11 categorías, herramientas del cotizador PROP (PDF y Excel) y gana el <strong className="text-emerald-700 font-black">20% de comisión directa</strong> por cada venta que concrete.
                </p>
              </div>

              {/* Cláusula 2: El Requisito para los $25 de Rendimiento */}
              <div className="p-4 rounded-2xl bg-white/90 border border-emerald-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                  <Award size={16} className="text-emerald-600" />
                  <span>2. ¿Cómo acceder a la Remuneración de al menos $25 USD al mes? (pese a un bajo rendimiento siguen perteneciendo al grupo y accediendo a bonos)</span>
                </div>
                <p className="text-slate-700">
                  Para ser acreedor a una remuneración económica mensual de <strong className="text-emerald-800 font-bold">al menos $25 USD fijos</strong> como rendimiento por esfuerzo comercial activo <span className="text-slate-600 font-normal">(pese a un bajo rendimiento siguen perteneciendo al grupo y accediendo a bonos)</span>, debes cumplir con este rendimiento comprobado en el mes:
                </p>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Requisito 1</span>
                    <strong className="text-slate-950 text-xs">Asistencias &gt; 80%</strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">Correctamente timbradas en el mes.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Requisito 2</span>
                    <strong className="text-slate-950 text-xs">Publicaciones &gt; 80%</strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">Porcentaje de acierto en Marketplace.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Requisito 3</span>
                    <strong className="text-slate-950 text-xs">3 Números Diarios Maps</strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">Obtenidos por Google Maps y escribirles.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Requisito 4</span>
                    <strong className="text-slate-950 text-xs">3 Llamadas Semanales</strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">Al menos 3 llamadas efectivas por semana.</p>
                  </div>
                </div>

                <p className="text-xs text-emerald-900 pt-1 font-medium">
                  ✓ Al cumplir estos 4 puntos, cobras tus <strong>$25 USD fijos</strong> al final del mes, más el <strong>20% de comisión directa</strong> de todas las cotizaciones que cierres <span className="font-semibold text-slate-700">(pese a un bajo rendimiento sigues perteneciendo al grupo y accediendo a bonos comerciales y herramientas oficiales)</span>.
                </p>
              </div>

              {/* Cláusula 3: Escalón al Plan Laboral de $100 */}
              <div className="p-4 rounded-2xl bg-white/90 border border-blue-200 text-xs sm:text-sm text-slate-700">
                <strong className="text-blue-900 font-bold block mb-1">
                  3. Puente hacia el Plan Laboral Oficial ($100 a $450/mes):
                </strong>
                Si deseas dar el siguiente salto y cobrar <strong>$100 fijos el Mes 1</strong>, solo debes cumplir con las <strong>7 actividades ordinarias completas</strong> (2 horas al día), lo cual te posiciona para subir a <strong>$200 el Mes 2</strong> y a <strong>$450 el Mes 3</strong> con contrato de trabajo firmado.
              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-amber-900 font-medium">
                ¿Prefieres el esquema de rendimiento base de $25? (sigues en el grupo y con acceso a bonos)
              </span>
              <a
                href={whatsappLinkRendimiento25}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
              >
                <Target size={14} />
                <span>Postular a Rendimiento $25</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECCIÓN 2: ESCALA SALARIAL Y NIVELES DE PROYECCIÓN ── */}
      <section id="escala-rendimiento" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
              Escalafón Económico Transparente
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
              Los 4 Niveles de Remuneración y Crecimiento
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm">
              Desde el rendimiento base de $25 USD <span className="font-semibold text-slate-900">(pese a bajo rendimiento siguen perteneciendo al grupo y accediendo a bonos)</span> hasta el puesto laboral fijo definitivo de $450 USD mensuales con contrato.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {ESCALA_SALARIAL.map((etapa, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl border-2 p-5 flex flex-col justify-between shadow-xs transition-all relative ${
                  etapa.destacado ? "border-blue-600 shadow-md ring-4 ring-blue-50" : etapa.color
                }`}
              >
                {etapa.destacado && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs">
                    {etapa.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">
                      {etapa.mes}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${etapa.badgeColor}`}>
                      {etapa.etapa}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-2xl sm:text-3xl font-black text-slate-950">{etapa.sueldoFijo}</p>
                    <p className="text-[11px] text-slate-700 mt-1 font-medium">{etapa.condicion}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {etapa.descripcion}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-[11px]">Comisión:</span>
                      <strong className="text-slate-900 font-bold">{etapa.comision}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-[11px]">Beneficio extra:</span>
                      <strong className="text-slate-900 text-[11px]">{etapa.bono}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 bg-slate-50 -mx-5 -mb-5 p-3 rounded-b-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">
                    Ingreso Proyectado
                  </span>
                  <span className="text-lg font-black text-blue-700">{etapa.totalPotencial}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── ⭐ AVISO OFICIAL FAST-TRACK: PUGNA DIRECTA POR LOS $450 FIJOS ── */}
          <div id="fast-track" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-xl border-2 border-blue-400/60 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-400/20 pb-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/30 border border-blue-400 text-blue-200 text-xs font-mono font-bold uppercase tracking-wider">
                  <Rocket size={14} className="text-blue-300" />
                  <span>Convocatoria Directa para Vendedores Experimentados</span>
                </div>

                <span className="px-3.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-xs">
                  Sueldo Fijo Inmediato: $450 USD / Mes
                </span>
              </div>

              {/* Cita Textual Exigida */}
              <div className="p-6 rounded-2xl bg-white/10 border-2 border-blue-400/40 backdrop-blur-md">
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-white italic tracking-tight leading-snug">
                  “Si tú tienes todas las habilidades, cuentas con experiencia y crees que puedes realizar estas siete actividades de golpe, avísanos y pugna por los $450 de una vez.”
                </p>
              </div>

              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-3xl">
                No te hacemos pasar por los Meses 1 ($100) ni Mes 2 ($200) si ya tienes un perfil comercial sólido, dominio en ventas o cartera activa. Puedes saltarte el plan formativo e ingresar directamente en el <strong className="text-white">Mes 3 con Sueldo Fijo de $450 USD Mensuales + 20% de Comisiones Corporativas y Contrato Laboral Formal Firmado</strong>.
              </p>

              {/* Requisitos Indispensables No Negociables */}
              <div className="bg-blue-900/40 border border-blue-400/30 rounded-2xl p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>Requisitos Obligatorios No Negociables para Pugnar por el Puesto Fijo ($450):</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold">
                      <Monitor size={20} />
                    </div>
                    <div>
                      <strong className="text-white block text-sm mb-1">Uso Obligatorio de Computadora y Celular</strong>
                      <p className="text-blue-200/90 leading-relaxed text-xs">
                        Es <strong>indispensable contar con una computadora (laptop o PC) y un teléfono celular inteligente</strong> activos y con buena conexión, ya que para cumplir de vendedor fijo se requiere cotizar al instante, operar el CRM y atender clientes en línea.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                      <Clock size={20} />
                    </div>
                    <div>
                      <strong className="text-white block text-sm mb-1">Disponibilidad Total de 8 Horas Diarias (9 a 5)</strong>
                      <p className="text-blue-200/90 leading-relaxed text-xs">
                        Para cumplir el rol de vendedor fijo oficial, es requisito estar disponible las <strong>8 horas laborales de 9:00 AM a 5:00 PM (Lunes a Viernes)</strong>, pendientes, activos y en línea en tiempo real para llamadas y coordinación.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp de Pugna por los $450 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-blue-200">
                  ¿Cumples con las 8 horas (9 a 5), la computadora, el celular y la experiencia previa?
                </div>

                <a
                  href={whatsappLinkFastTrack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                  <Rocket size={18} />
                  <span>Pugnar por los $450 Fijos (Entrevista Inmediata)</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
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
                    Dedicación de solo 2 horas al día para el Plan Laboral formativo. Cumplir con el 80% de estas actividades garantiza tu sueldo fijo de $100 el primer mes, $200 el segundo y $450 el tercero (+ 20% comisiones).
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
                    <ShieldAlert size={14} className="text-amber-600" /> Modalidad Bajo Comisión • 100% Remoto • 20% Comisión
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    Las 3 Tareas Obligatorias para Permanecer en el Grupo
                  </h2>
                  <p className="text-slate-700 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                    Para pertenecer y permanecer activo en el grupo comercial bajo comisión y gozar de las herramientas y comisiones al 20%, debes cumplir estrictamente con estas 3 actividades de lunes a viernes:
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
                          <span>Mínimo de permanencia en grupo</span>
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
                  ¿Listo para comenzar a comisionar al 20% sin horarios fijos?
                </div>
                <a
                  href={whatsappLinkFreelance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
                >
                  <Zap size={15} />
                  <span>Unirme como Vendedor Bajo Comisión (20%)</span>
                </a>
              </div>
            </div>

            {/* Herramientas Comerciales del Freelance */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-950 mb-2">
                Herramientas y Ventajas Comerciales del Asesor Freelance
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm mb-6">
                Aunque trabajes de forma independiente, cuentas con todo el respaldo tecnológico, catálogo de 11 categorías y 20% de comisión en cada venta.
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
              Compara directamente ambas modalidades para tomar la mejor decisión según tu tiempo, equipamiento y experiencia comercial.
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
                    Modalidad Sueldo Fijo ($25 a $450)
                  </th>
                  <th className="py-4 px-4 font-bold w-[37%] bg-amber-950 text-amber-200">
                    Modalidad Bajo Comisión (Freelance - 20%)
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
              href={whatsappLinkFastTrack}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
            >
              <Rocket size={15} />
              <span>Pugnar por los $450 Fijos (Fast-Track)</span>
            </a>
            <a
              href={whatsappLinkRendimiento25}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center gap-2"
            >
              <Target size={15} />
              <span>Postular a Rendimiento $25</span>
            </a>
            <a
              href={whatsappLinkFreelance}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Zap size={15} className="text-amber-500" />
              <span>Bajo Comisión (20%)</span>
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
                Nos encargamos de orientarte y acompañarte para que generes una <strong className="text-slate-950">cartera de clientes sólida</strong> que te pertenezca y siga produciendo comisiones del 20% mes a mes.
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
            Elige el nivel que mejor se ajuste a tu capacidad, escríbenos directamente por WhatsApp para coordinar tu incorporación y crea tu cuenta de vendedor en el sistema.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappLinkFastTrack}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Rocket size={16} />
              <span>Pugnar por los $450 Fijos (Fast-Track)</span>
            </a>

            <a
              href={whatsappLinkRendimiento25}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Target size={16} />
              <span>Postular a Rendimiento $25</span>
            </a>

            <a
              href={whatsappLinkFijo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Briefcase size={16} />
              <span>Plan Laboral ($100 - $450)</span>
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
                  Plantilla de Mensaje de WhatsApp para Enviar al Postulante (Con Nivel $25, $100 y Fast-Track $450)
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
