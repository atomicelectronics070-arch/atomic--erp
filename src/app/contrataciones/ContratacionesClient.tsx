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
  Info
} from "lucide-react"

// Las 7 actividades oficiales con descripción técnica y pautas operativas
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

// Matriz comparativa estilo Excel exacta solicitada
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

// Plan de carrera 3 meses
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

export default function ContratacionesClient() {
  const [selectedDayDemo, setSelectedDayDemo] = useState<number | null>(4)
  const [copiedTemplate, setCopiedTemplate] = useState(false)

  const whatsappNumber = "593969043453"
  const whatsappPreMsg = encodeURIComponent(
    "Hola, quiero empezar mi mes laboral. Plan de capacitación para vendedor fijo."
  )
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappPreMsg}`

  const plantillaReclutador = `¡Hola [Nombre]! Bienvenido al equipo comercial de ATOMIC.

Aquí tienes tus enlaces oficiales para comenzar tu Plan Laboral de 30 Días:

1. Manual e Instructivo Paso a Paso:
https://atomiccotizador.shop/contrataciones#manual

2. Enlace de Registro Exclusivo para Vendedores:
https://atomiccotizador.shop/register/vendedor

3. Enlace oficial al Grupo de WhatsApp de tu cuadrilla:
[Ingresa al enlace del grupo que te pasamos aquí]

*Una vez que ingreses al grupo de WhatsApp, te pasaremos por interno el documento oficial de tu Plan Laboral con tus productos asignados.*

¡Muchos éxitos en tus primeros 30 días!`

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
                Ecosistema Comercial de Empleo y Capacitación Profesional
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
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>Solicitar Plan</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER: CONVOCATORIA 30 DÍAS ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <Briefcase size={14} />
            <span>Plan Oficial de Contratación Comercial 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            Forma Parte del Equipo Comercial de <span className="text-blue-600">ATOMIC</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Durante 30 días, como parte de nuestro plan de contratación de ventas, te otorgaremos <strong className="text-slate-950">7 actividades ordinarias</strong> para realizar casi a diario con una dedicación máxima de <strong className="text-slate-950">2 horas al día</strong>. Al cumplir el 80% de asistencia y aciertos, recibirás una remuneración garantizada de <strong className="text-blue-700 font-bold">$100</strong>, más el 15% de comisiones y opción a bonos, iniciando una escala laboral que te proyecta a <strong className="text-slate-950">$450 mensuales fijos</strong> en tu tercer mes.
          </p>

          {/* Tarjetas de Beneficios Rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto mb-10 text-left">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 mb-1.5">
                <Clock size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Tiempo Requerido</span>
              </div>
              <p className="text-xl font-black text-slate-900">2 Horas / Día</p>
              <p className="text-[11px] text-slate-700">Horario flexible y adaptable</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
                <DollarSign size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Mes 1 Inicial</span>
              </div>
              <p className="text-xl font-black text-slate-900">$100 USD</p>
              <p className="text-[11px] text-slate-700">+ 15% Comisión + Bonos</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-purple-600 mb-1.5">
                <TrendingUp size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Mes 2 Incremento</span>
              </div>
              <p className="text-xl font-black text-slate-900">$200 USD</p>
              <p className="text-[11px] text-slate-700">Sueldo fijo al 2do mes</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-blue-700 mb-1.5">
                <Award size={16} />
                <span className="text-[11px] font-mono font-bold uppercase">Mes 3 Puesto Fijo</span>
              </div>
              <p className="text-xl font-black text-slate-900">$450 Fijo</p>
              <p className="text-[11px] text-slate-700">Contrato laboral firmado</p>
            </div>
          </div>

          {/* Botones de acción principales */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group"
            >
              <span>Iniciar Mi Plan Laboral</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#manual"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <FileText size={15} />
              <span>Ver Manual de Plataforma</span>
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
              <span className="text-xs text-slate-700 font-medium">Si quieres leer un poco más sobre nosotros:</span>
              <Link
                href="/portafolio"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Portafolio y presentación de nuestros servicios (Acceso al portafolio)</span>
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
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span><strong>Tecnología Residencial:</strong> Videoporteros IP, CCTV, cercos eléctricos, cerraduras smart.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span><strong>Línea Hogar para Constructores:</strong> Campanas extractoras, encimeras, calefones por mayor.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span><strong>Ingeniería Electrónica & Automatización:</strong> Componentes, sensores, módulos IoT e instrumentación.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span><strong>Software & Plataformas Empresariales:</strong> Sistemas ERP, CRM, facturación electrónica SRI.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span><strong>Servicios Técnicos Especializados:</strong> Cuadrillas de instalación, mantenimiento y diagnóstico de obra.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── LAS 7 ACTIVIDADES ORDINARIAS DETALLADAS ── */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1">
              Manual Operativo Diario
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mb-3">
              Las 7 Actividades Ordinarias de Tu Plan
            </h2>
            <p className="text-slate-700 text-sm">
              Cada una de estas 7 actividades ha sido diseñada para no tomarte más de 2 horas en total. Al cumplir con el 80% de asistencia y aciertos en el mes, garantizas tu remuneración de $100.
            </p>
          </div>

          <div className="space-y-4">
            {ACTIVIDADES.map((act) => {
              const IconComp = act.icono
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

          <div className="grid md:grid-cols-3 gap-6">
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

        </div>
      </section>

      {/* ── LLAMADO A LA ACCIÓN INMEDIATO (WHATSAPP) ── */}
      <section className="py-14 bg-blue-900 text-white border-b border-blue-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-mono font-bold text-blue-200 uppercase tracking-widest block mb-2">
            Comienza Hoy Mismo
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 text-white">
            ¿Estás de acuerdo con el esquema de trabajo?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Si estás de acuerdo con esto, por favor ingresa al grupo de WhatsApp y solicita tu plan laboral. Empieza desde hoy y en 30 días ten resultados tangibles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <MessageCircle size={18} className="text-blue-700" />
              <span>Iniciar Mi Plan Laboral</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/register/vendedor"
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-blue-400/40 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>Crear Cuenta de Vendedor</span>
            </Link>
          </div>
          <p className="text-xs text-blue-300 mt-4 font-mono">
            WhatsApp Oficial de Coordinación: +593 96 904 3453
          </p>
        </div>
      </section>

      {/* ── INSTRUCTIVO Y MANUAL PASO A PASO DE LA PLATAFORMA ── */}
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
              Aprende cómo registrarte, ingresar a tu panel de control y subir tus evidencias día a día para que tu porcentaje de efectividad se compute de forma automática.
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
                Carga Diaria de Evidencias
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                En el módulo <strong className="text-slate-900">Asistencia y Evidencias</strong>, haz clic en el día actual para cargar tus capturas, registrar los 10 números y marcar llamadas.
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
                  Plantilla de Mensaje de WhatsApp para Enviar al Postulante
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
