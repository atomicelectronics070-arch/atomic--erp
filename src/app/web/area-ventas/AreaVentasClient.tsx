"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, Lock, Unlock, CheckCircle2, Award, BookOpen, 
  Clock, Users, ArrowRight, ExternalLink, Calendar, Phone, 
  DollarSign, Target, Shield, Sparkles, ChevronRight, Share2,
  FileText, CheckSquare, MessageSquare, AlertCircle, Briefcase,
  Flame, Monitor, Video
} from "lucide-react"

interface Chapter {
  id: number
  title: string
  subtitle: string
  unlocked: boolean
  youtubeId?: string
  duration: string
  date: string
  instructor: string
  summary: string[]
  keyTakeaways: string[]
  tags: string[]
}

const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    title: "Introducción al Puesto de Ventas: Comisión vs Fijo ($450), Bitácora y Catálogo",
    subtitle: "Reglas de permanencia, términos, condiciones, catálogo digital y métricas del plan laboral.",
    unlocked: true,
    youtubeId: "Jm7RPpxJ54E",
    duration: "47:20 min",
    date: "18 de Noviembre de 2026",
    instructor: "Juan Pablo Guzmán (Supervisor de Ventas)",
    summary: [
      "Diferenciación exacta entre Vendedor 100% a Comisión y Vendedor Fijo con Sueldo Base de $450 USD.",
      "Vendedor a Comisión: 20% de ganancia neta por venta, acceso a bonos semanales de rendimiento ($15-$30) y tickets de obsequio. Obligación: Asistencia y 2-3 días de publicaciones por semana.",
      "Vendedor Fijo ($450 Base): Evaluación estricta de 30 días en la plataforma interna. Horario de 09:00 a 17:00 (máximo 2 faltas injustificadas al mes).",
      "Las 6 Actividades Diarias/Semanales Obligatorias: 5 posts diarios con captura, 10 contactos B2B/semana, 3 llamadas diarias supervisadas en vivo por Zoom, seguimiento comercial, difusión lunes/miércoles y 1 estado personal semanal.",
      "La Plataforma como Bitácora Inalterable: Registro a las 09:00 ('Iniciar mi día') y timbrado de salida a las 17:00 para garantizar pagos justos y transparentes sin discrepancias."
    ],
    keyTakeaways: [
      "El esfuerzo se respalda en el sistema: todo lo que haces queda registrado en la bitácora inalterable.",
      "En ventas no rogamos: resolvemos problemas operativos reales y asesoramos con postura técnica.",
      "La constancia telefónica diaria supera a la improvisación semanal."
    ],
    tags: ["Inducción", "Plan Laboral", "Sueldo $450", "Bitácora", "Comisiones 20%"]
  },
  {
    id: 2,
    title: "Técnicas de Publicación en Marketplace & Redes (Algoritmo y Captación)",
    subtitle: "Estructura de copy persuasivo, elección de palabras clave y tácticas anti-baneo.",
    unlocked: false,
    duration: "Próximamente",
    date: "En Grabación",
    instructor: "Equipo Comercial ATOMIC",
    summary: [
      "Configuración de publicaciones con alta tasa de respuesta en Facebook Marketplace y grupos locales.",
      "Cómo seleccionar títulos y fotografías para evitar advertencias de algoritmo.",
      "Captura de pantalla obligatoria y reporte diario al grupo de supervisión."
    ],
    keyTakeaways: [
      "El título y la imagen definen el 80% del click en Marketplace.",
      "Publicar todos los días en la misma franja horaria alimenta el algoritmo de tracción."
    ],
    tags: ["Marketplace", "Copywriting", "Generación de Leads"]
  },
  {
    id: 3,
    title: "Laboratorio Telefónico en Vivo: Contacto en Frío y Agendamiento de Citas",
    subtitle: "Simulaciones reales en directo vía Zoom con feedback inmediato del supervisor.",
    unlocked: false,
    duration: "Próximamente",
    date: "Próxima Sesión",
    instructor: "Juan Pablo Guzmán",
    summary: [
      "Estructura del speech de los primeros 15 segundos para romper la barrera del receptor.",
      "Cómo superar filtros de secretaría y llegar al tomador de decisión (administradores y gerentes).",
      "Objetivo único de la llamada: no cobrar en frío, sino agendar la cita de evaluación técnica."
    ],
    keyTakeaways: [
      "Nunca hables de precio antes de que el cliente entienda el valor del problema que le resuelves.",
      "El vendedor abre la cita; el especialista técnico acude a dimensionar y cerrar."
    ],
    tags: ["Llamadas en Frío", "Speech Comercial", "Zoom en Vivo"]
  },
  {
    id: 4,
    title: "La Postura Comercial: 'No Rogamos por Ventas' y Categorías de Valor",
    subtitle: "Diferenciación entre vender sueños y solucionar necesidades de seguridad urgentes.",
    unlocked: false,
    duration: "Próximamente",
    date: "Próxima Sesión",
    instructor: "Juan Pablo Guzmán",
    summary: [
      "Por qué la seguridad electrónica, cámaras y control de acceso son compras por dolor urgente.",
      "Cómo mantener la postura de autoridad cuando el cliente intenta regatear o comparar con marcas genéricas.",
      "El protocolo de paz: vender con tranquilidad respaldados por garantía real y soporte 24/7."
    ],
    keyTakeaways: [
      "Vender con postura genera más respeto y mejores márgenes que rogar por una compra.",
      "Un cliente que busca precio te dejará por precio; un cliente que busca respaldo se queda contigo años."
    ],
    tags: ["Postura de Valor", "Seguridad B2B", "Cierre Ético"]
  },
  {
    id: 5,
    title: "Manejo de Objeciones, Cotizaciones Formales en PDF y Cierre Técnico",
    subtitle: "Uso del Cotizador Atomic para emitir propuestas instantáneas con IVA y PVP.",
    unlocked: false,
    duration: "Próximamente",
    date: "Próxima Sesión",
    instructor: "Equipo Técnico & Comercial",
    summary: [
      "Respuestas estructuradas a 'está muy caro' y 'voy a consultar con mi socio'.",
      "Generación de cotizaciones oficiales en 30 segundos con ficha técnica y garantía.",
      "Seguimiento automatizado por WhatsApp con recordatorios inteligentes."
    ],
    keyTakeaways: [
      "La rapidez de entrega de la cotización multiplica la probabilidad de cierre por tres.",
      "Una cotización formal en PDF con membrete genera 10 veces más confianza que un mensaje de texto."
    ],
    tags: ["Cotizador Atomic", "Manejo Objeciones", "Propuestas PDF"]
  },
  {
    id: 6,
    title: "Auditoría de Bitácora Digital, Métricas y Cobro de Bonificaciones",
    subtitle: "Cómo computar tus asistencias, llamadas y verificar tu tabla salarial al final del mes.",
    unlocked: false,
    duration: "Próximamente",
    date: "Próxima Sesión",
    instructor: "Coordinación Administrativa",
    summary: [
      "Navegación completa por el panel de asistencia (atomiccotizador.shop/dashboard/asistencia).",
      "Reglas de cálculo para los bonos de $15 a $30 semanales.",
      "Transición exitosa del periodo de prueba de 30 días al contrato fijo indefinido."
    ],
    keyTakeaways: [
      "La plataforma es tu mejor aliada: garantiza que nadie pueda cuestionar tus comisiones.",
      "El orden diario es el secreto de los mejores cheques a fin de mes."
    ],
    tags: ["Plataforma", "Bonos Semanales", "Sueldo Fijo"]
  }
]

export default function AreaVentasClient() {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1)
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false)
  const [lockedChapterTitle, setLockedChapterTitle] = useState<string>("")

  const activeChapter = CHAPTERS_DATA.find(c => c.id === selectedChapterId) || CHAPTERS_DATA[0]

  const handleSelectChapter = (ch: Chapter) => {
    if (!ch.unlocked) {
      setLockedChapterTitle(ch.title)
      setShowLockedModal(true)
      return
    }
    setSelectedChapterId(ch.id)
  }

  return (
    <div className="min-h-screen bg-[#040714] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* ── TOP NAV BAR ── */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-black font-black shadow-lg shadow-cyan-500/20">
            <GraduationCapIcon size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-white">Área de Ventas</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Academia ATOMIC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Capacitaciones Oficiales • Plan Laboral & Métricas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/asistencia"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <CheckSquare size={13} />
            <span className="hidden sm:inline">Ruta del Día / Asistencia</span>
            <span className="sm:hidden">Asistencia</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <Monitor size={13} />
            <span>Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* ── HERO BANNER ── */}
      <header className="relative border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-[#060b1e] to-[#040714] px-4 sm:px-8 py-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold mb-4">
            <Sparkles size={13} />
            <span>PROGRAMA OFICIAL DE FORMACIÓN COMERCIAL 2026-2027</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-4xl leading-tight mb-4">
            Serie de Capacitaciones Oficiales <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Área de Ventas & Plan Laboral
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed mb-6">
            Aprende la metodología comercial de ATOMIC: conoce los dos perfiles laborales (comisión y sueldo fijo de $450 USD), domina la prospección activa, las llamadas en frío supervisadas y el registro inalterable en la bitácora del sistema.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Capítulo 1 Desbloqueado y Listo</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Lock size={14} className="text-amber-400" />
              <span>5 Capítulos Desbloqueables en Producción</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <DollarSign size={14} className="text-cyan-400" />
              <span>Escala Salarial Fija: $450 USD / Mes</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT: REPRODUCTOR & LISTA DE CAPÍTULOS ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: REPRODUCTOR Y DETALLES (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* REPRODUCTOR DE VIDEO */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {activeChapter.unlocked && activeChapter.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeChapter.youtubeId}?rel=0&modestbranding=1&color=white`}
                  title={activeChapter.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                  <Lock size={48} className="text-amber-500/50 mb-3" />
                  <p className="text-sm font-mono text-slate-300 font-bold">Capítulo Bloqueado</p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Esta sesión está actualmente en producción. Se habilitará para todo el equipo al publicarse en la academia.
                  </p>
                </div>
              )}
            </div>

            {/* INFO BAR INMEDIATA DEL VIDEO */}
            <div className="p-5 border-t border-slate-800/80 bg-slate-900/50">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Capítulo #{activeChapter.id} • {activeChapter.duration}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  📅 {activeChapter.date} • {activeChapter.instructor}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mb-2">
                {activeChapter.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {activeChapter.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {activeChapter.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    #{t}
                  </span>
                ))}
                {activeChapter.youtubeId && (
                  <a
                    href={`https://youtu.be/${activeChapter.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Abrir en YouTube</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* DESGLOSE Y TÉRMINOS Y CONDICIONES (TABLA & CHECKLIST) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-cyan-400 w-5 h-5" />
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Términos, Condiciones y Resumen Operativo
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Puntos canónicos tratados por Juan Pablo Guzmán en esta capacitación para validar el pago de sueldos y comisiones.
              </p>
            </div>

            {/* TABLA COMPARATIVA COMISIÓN VS FIJO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider">
                    Vendedor 100% a Comisión
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    Flexible
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ideal para estudiantes o personas con ocupaciones alternas que buscan generar ingresos sin rigidez de horarios.
                </p>
                <div className="border-t border-slate-800 pt-2 mt-1 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Ganancia:</span>
                    <strong className="text-white font-mono">20% Utilidad Neta</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Bonos de Rendimiento:</span>
                    <strong className="text-emerald-400 font-mono">$15 a $30 / sem</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Obligación:</span>
                    <span className="text-slate-200">Asistencia + 2-3 días posts/sem</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Plataforma:</span>
                    <span className="text-slate-400">No obligatoria</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-wider">
                    Vendedor Fijo ($450 Base)
                  </span>
                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                    Dedicación 100%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Profesionales dedicados que buscan estabilidad mensual fija y ascenso a coordinación o cargos administrativos.
                </p>
                <div className="border-t border-slate-800 pt-2 mt-1 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Sueldo Base:</span>
                    <strong className="text-cyan-400 font-mono">$450 USD + Comisiones</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Jornada:</span>
                    <span className="text-slate-200">Lun-Vie (09:00 a 17:00)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Margen de Faltas:</span>
                    <span className="text-amber-400 font-mono">Máximo 2 injustificadas</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Bitácora Digital:</span>
                    <strong className="text-emerald-400">100% Obligatoria</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* CHECKLIST DE LAS 6 ACTIVIDADES DEL VENDEDOR FIJO */}
            <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
              <h4 className="text-xs font-mono font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Target size={14} className="text-cyan-400" />
                <span>Las 6 Actividades Diarias/Semanales Obligatorias del Vendedor Fijo</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-slate-200">5 Publicaciones Diarias en Marketplace</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">Realizadas entre 09:00 y 17:00 con capturas de evidencia enviadas al grupo.</p>
                  </div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-slate-200">10 Números Cualificados por Semana</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">Contactos telefónicos reales de negocios y empresas afines a los productos asignados.</p>
                  </div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-slate-200">3 Llamadas Diarias Supervisadas en Vivo</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">Conectados en Zoom con supervisión directa para registrar la métrica y pulir el speech.</p>
                  </div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="text-slate-200">Seguimiento Comercial Activo</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">Recontacto diario con clientes de días anteriores ("cultiva clientes y da bastante dinero a la larga").</p>
                  </div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">5</span>
                  <div>
                    <strong className="text-slate-200">Difusión Promocional Estratégica</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">Lunes y miércoles, únicamente bajo indicación expresa cuando existan ofertas activas.</p>
                  </div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">6</span>
                  <div>
                    <strong className="text-slate-200">1 Estado Personal a la Semana</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">Publicación en WhatsApp/Facebook personal para activar el círculo cercano de confianza.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUOTE DE JUAN PABLO GUZMAN */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 p-4 rounded-xl border-l-4 border-cyan-400 text-xs text-slate-300 italic leading-relaxed">
              "El sistema te garantiza un conteo justo, puntual y sobre todo a modo de bitácora porque en el sistema se guarda todo. No va a haber un momento en el que tú puedas decir 'yo he sido responsable y no me quieren pagar', porque todo queda respaldado objetivamente en la plataforma."
              <span className="block not-italic font-mono font-bold text-cyan-300 text-[11px] mt-1">— Juan Pablo Guzmán, Supervisor del Área de Ventas</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PLAYLIST DE CAPÍTULOS DESBLOQUEABLES (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-cyan-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Índice de Capítulos
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
              1 / 6 Listos
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {CHAPTERS_DATA.map((ch) => {
              const isCurrent = ch.id === selectedChapterId
              return (
                <div
                  key={ch.id}
                  onClick={() => handleSelectChapter(ch)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                    isCurrent
                      ? "bg-gradient-to-r from-cyan-950/60 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/20"
                      : ch.unlocked
                      ? "bg-slate-950 hover:bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700"
                      : "bg-slate-950/40 border-slate-800/40 text-slate-500 hover:border-amber-500/40 hover:bg-slate-900/40 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
                      {ch.unlocked ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Capítulo #{ch.id}</span>
                        </span>
                      ) : (
                        <span className="text-amber-400/80 flex items-center gap-1">
                          <Lock size={12} />
                          <span>Capítulo #{ch.id} • Bloqueado</span>
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ch.duration}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold leading-snug ${isCurrent ? "text-cyan-300" : ch.unlocked ? "text-slate-100" : "text-slate-400"}`}>
                    {ch.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {ch.subtitle}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                    <span>{ch.date}</span>
                    <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                      {ch.unlocked ? "Ver sesión →" : "Por desbloquear 🔒"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ACCESOS DIRECTOS DEL ASESOR */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 mt-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Herramientas de Trabajo Rápido
            </h4>
            <Link
              href="/dashboard/asistencia"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-mono flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-emerald-400" />
                <span>Ruta del Día & Asistencia</span>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </Link>
            <Link
              href="/dashboard/quotes"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-mono flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-cyan-400" />
                <span>Generar Cotización Formal</span>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </Link>
          </div>
        </div>
      </main>

      {/* ── MODAL CAPÍTULO BLOQUEADO ── */}
      <AnimatePresence>
        {showLockedModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-950 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">
                Capítulo en Producción
              </h3>
              <p className="text-xs font-mono text-amber-400 mb-3">
                {lockedChapterTitle}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Este capítulo corresponde a las próximas sesiones prácticas de la academia comercial (grabación en vivo de llamadas, copywriting o cotizador). Se desbloqueará automáticamente a medida que el supervisor suba la clase correspondiente.
              </p>
              <button
                onClick={() => setShowLockedModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Entendido, volver al Capítulo 1
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs font-mono text-slate-500">
        <p>ATOMIC &bull; ATOMIC ERP &bull; Academia Comercial Oficial 2026</p>
        <p className="text-[11px] text-slate-600 mt-1">Ecuador &bull; Soporte, Control de Acceso y Soluciones Tecnológicas B2B</p>
      </footer>
    </div>
  )
}

function GraduationCapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  )
}
