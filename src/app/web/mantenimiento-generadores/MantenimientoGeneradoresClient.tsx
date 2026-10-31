"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap,
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Gauge,
  Activity,
  Flame,
  ShieldCheck,
  Building2,
  Home,
  Factory,
  ChevronDown,
  Smartphone,
  Award,
  HelpCircle,
  Truck,
  Droplets,
  Cpu,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react"

const SERVICE_TIERS = [
  {
    id: "basico-50",
    name: "Servicio Básico Preventivo",
    price: 50.00,
    badge: "🔥 Precio Promocional",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
    tagline: "Para generadores domésticos y comerciales de hasta 10 kVA",
    image: "/images/generadores/mantenimiento-generadores-electricos-50.jpg",
    items: [
      "Limpieza integral y desengrase exterior del equipo",
      "Cambio de aceite de motor y calibración de nivel",
      "Limpieza y calibración de bujía o inyector básico",
      "Inspección y soplado del filtro de aire",
      "Revisión de voltaje de salida y frecuencia (60 Hz)",
      "Prueba de encendido y arranque bajo carga controlada",
      "Informe técnico de estado general del equipo"
    ]
  },
  {
    id: "pro-industrial",
    name: "Mantenimiento Industrial & Diésel Pesado",
    price: 180.00,
    badge: "⭐ Plantas Industriales",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    tagline: "Para plantas generadoras desde 15 kVA hasta 500+ kVA (Cummins, Perkins, Caterpillar, etc.)",
    image: "/images/generadores/mantenimiento-generadores-electricos-50.jpg",
    items: [
      "Cambio integral de filtros de aceite, combustible y separador de agua",
      "Revisión y purga de sistema de inyección y bomba de combustible",
      "Inspección del sistema de refrigeración: refrigerante, mangueras y radiador",
      "Diagnóstico computarizado del módulo de control (DeepSea, ComAp, Smartgen)",
      "Prueba y calibración del Tablero de Transferencia Automática (ATS)",
      "Medición de aislamiento de devanados del alternador (Megóhmetro)",
      "Verificación de estado de batería, cargador flotante y alternador de carga",
      "Prueba de transferencia real con simulación de corte de red eléctrica"
    ]
  }
]

const TIMETABLE_RECOMMENDATIONS = [
  {
    interval: "Cada 50 a 100 Horas de Uso (o cada 3 Meses)",
    target: "Generadores Domésticos / Residenciales a Gasolina",
    actions: "Cambio de aceite de motor mineral o sintético, soplado de filtro de aire, comprobación de apriete de bornes de batería y prueba de arranque de 10 minutos."
  },
  {
    interval: "Cada 250 Horas de Uso (o cada 6 Meses)",
    target: "Generadores Diésel Comerciales & Edificios",
    actions: "Sustitución de filtro de aceite y filtro de combustible, verificación de correas de alternador/bomba de agua, comprobación de líquido refrigerante y revisión del ATS."
  },
  {
    interval: "Cada 500 a 1000 Horas (o Anual Integral)",
    target: "Plantas Industriales & Hospitalarias de Alta Exigencia",
    actions: "Cambio de refrigerante anticorrosivo, limpieza de inyectores, calibración de válvulas de motor, ajuste dinamométrico de culata, inspección de turbocompresor y banco de pruebas de carga resistiva."
  }
]

const WARNING_SIGNS = [
  {
    title: "El generador no enciende o tarda en arrancar",
    cause: "Batería de arranque sulfatada o descargada, combustible descompuesto (más de 30 días sin estabilizador) o filtro de gasolina obstruido.",
    danger: "Falla total durante un apagón imprevisto."
  },
  {
    title: "Humo negro, azul o blanco por el escape",
    cause: "Humo negro: exceso de combustible o filtro de aire tupido. Humo azul: quema de aceite de motor. Humo blanco: presencia de agua en diésel o falla de inyectores.",
    danger: "Daño interno severo en cilindros y pistones."
  },
  {
    title: "El voltaje fluctúa o parpadean las luces",
    cause: "Regulador automático de voltaje (AVR) descalibrado o dañado, o gobernador de velocidad inestable que no mantiene las 3600 RPM (60Hz).",
    danger: "Riesgo de quemar servidores, computadoras, refrigeradores y motores sensibles."
  },
  {
    title: "Apagado repentino a los pocos minutos de operar",
    cause: "Sensor de bajo nivel de aceite activado, sobrecalentamiento por radiador tapado o sobrecarga eléctrica en el breaker principal.",
    danger: "Riesgo inminente de fundir el motor."
  }
]

const USAGE_TIPS = [
  {
    tip: "Enciende tu generador al menos 15 minutos cada 15 días",
    desc: "El combustible estancado en el carburador se degrada y forma goma que tapa los chicleres. Un arranque preventivo mantiene el motor lubricado y la batería cargada."
  },
  {
    tip: "Nunca arranques ni apagues el generador con la carga conectada",
    desc: "Asegúrate de que el breaker principal esté en 'OFF' antes de encender o apagar el equipo. Esto evita picos de voltaje que dañan el alternador y tus electrodomésticos."
  },
  {
    tip: "Respeta el límite del 75% - 80% de la capacidad continua",
    desc: "Operar un generador al 100% de su capacidad nominal de forma prolongada acorta su vida útil a la mitad y provoca recalentamiento."
  },
  {
    tip: "Ubica siempre el generador en exteriores ventilados",
    desc: "El monóxido de carbono emitido por el escape es un gas inodoro altamente letal. Nunca lo coloques dentro de departamentos, garajes cerrados o sótanos sin ducto certificado."
  }
]

const FAQS = [
  {
    q: "¿Qué incluye exactamente la promoción de $50?",
    a: "La promoción de $50 + IVA cubre la mano de obra del mantenimiento preventivo básico para generadores portátiles a gasolina compatibles: limpieza integral del equipo, cambio de aceite de motor (aceite incluido para equipos de hasta 1 litro de cárter), limpieza de bujía, soplado de filtro de aire y prueba de generación de voltaje en nuestro taller o en sitio en zonas céntricas de Quito."
  },
  {
    q: "¿Atienden plantas industriales y generadores a diésel pesados?",
    a: "Sí, disponemos de ingenieros electromecánicos certificados para plantas diésel industriales de cualquier capacidad (Cummins, Perkins, Kipor, Hyundai, Poweren, Generac, Caterpillar, etc.), así como mantenimiento de transferencias automáticas ATS y bancos de carga."
  },
  {
    q: "¿Qué sucede si el generador requiere repuestos adicionales o reparación mayor?",
    a: "Durante la revisión inicial, el técnico realiza un diagnóstico exhaustivo. Si se detecta un componente averiado (ej. AVR quemado, carburador para reemplazo, bujía dañada o retenedor con fuga), se le cotiza por separado antes de proceder, garantizando total transparencia."
  },
  {
    q: "¿Tienen cobertura de visita técnica a domicilio?",
    a: "Sí. Para generadores pesados o fijos en urbanizaciones, oficinas y fábricas nos trasladamos con nuestro taller móvil en Quito, Valles (Cumbayá, Tumbaco, Los Chillos) y provincias previa coordinación."
  },
  {
    q: "¿Cómo agendo una cita de mantenimiento urgente?",
    a: "Puedes escribirnos directamente a nuestro WhatsApp oficial haciendo clic en cualquiera de los botones de esta página. Un asesor técnico te solicitará la marca, modelo y fotos del equipo para agendar la visita de inmediato."
  }
]

export default function MantenimientoGeneradoresClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const whatsappBaseUrl = "https://wa.me/593969043453"
  const whatsappUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(
    "¡Hola ATOMIC Soluciones Energéticas! ⚡ Deseo agendar el *Mantenimiento Preventivo de mi Generador Eléctrico* ($50 servicio básico). Por favor indíquenme disponibilidad para coordinar la revisión. 🛠️"
  )}`

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Banner de Alerta Energética */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-800/40 text-xs py-2 px-4 text-center text-amber-200 flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 font-bold tracking-wide">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> TU GENERADOR LISTO CUANDO MÁS LO NECESITES
        </span>
        <span className="hidden sm:inline text-amber-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Wrench className="w-3.5 h-3.5 text-amber-400" /> TÉCNICOS ELECTROMECÁNICOS CERTIFICADOS
        </span>
        <span className="hidden sm:inline text-amber-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Truck className="w-3.5 h-3.5 text-amber-400" /> SERVICIO EN TALLER O A DOMICILIO EN QUITO & VALLES
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Lado Izquierdo: Pitch */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-6 tracking-wide uppercase">
                <Zap className="w-4 h-4 text-amber-400" /> Soluciones Energéticas & Continuidad Operativa
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Mantenimiento y Reparación de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400">
                  Generadores Eléctricos
                </span>{" "}
                Residenciales e Industriales
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                Un corte de energía en el momento más inoportuno no debe paralizar tu clínica, fábrica, oficina o tu hogar. Brindamos servicio preventivo y correctivo multimarca para generadores a <strong className="text-white">gasolina y diésel</strong> con repuestos originales y pruebas bajo carga.
              </p>

              {/* Card Destacado de Precio Promocional $50 */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/60 border border-amber-500/40 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded border border-amber-800/50">
                      Precio Promocional de Servicio
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-white mt-2">
                      $50.00 <span className="text-sm font-normal text-slate-400">Servicio Básico</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Incluye: Limpieza del equipo + Cambio de aceite + Revisión integral de voltaje y encendido
                    </p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base shrink-0"
                  >
                    <Smartphone className="w-5 h-5" /> Agendar por WhatsApp
                  </a>
                </div>
              </div>

              {/* Viñetas de Respaldo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-xl sm:text-2xl font-bold text-amber-400">Gasolina & Diésel</div>
                  <div className="text-xs text-slate-400">Multimarca</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-xl sm:text-2xl font-bold text-amber-400">Hasta 500kVA</div>
                  <div className="text-xs text-slate-400">Capacidad Total</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-xl sm:text-2xl font-bold text-amber-400">Tableros ATS</div>
                  <div className="text-xs text-slate-400">Calibración</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-xl sm:text-2xl font-bold text-amber-400">Garantía</div>
                  <div className="text-xs text-slate-400">Técnica Oficial</div>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Flyer Oficial */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 bg-black/60 aspect-[3/4] shadow-2xl">
                <Image
                  src="/images/generadores/mantenimiento-generadores-electricos-50.jpg"
                  alt="Mantenimiento de Generadores Eléctricos $50 ATOMIC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500 text-black shadow-lg">
                    Promoción $50 USD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planes de Mantenimiento Doméstico vs Industrial */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Cobertura para Toda Escala</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4">
            Planes de Mantenimiento Preventivo
          </h2>
          <p className="text-slate-400 text-base">
            Elige el servicio adecuado según el tipo y potencia de tu planta generadora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {SERVICE_TIERS.map(tier => (
            <div
              key={tier.id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                  <span className="text-3xl font-black text-white">
                    ${tier.price.toFixed(2)}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-slate-400 mb-6">{tier.tagline}</p>

                <div className="space-y-3 mb-8">
                  {tier.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`${whatsappBaseUrl}?text=${encodeURIComponent(
                  `¡Hola ATOMIC! Deseo coordinar el *${tier.name}* ($${tier.price.toFixed(2)}). ¿Tienen fecha para atender mi equipo? ⚡`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-600/20"
              >
                <Smartphone className="w-4 h-4" /> Agendar este Servicio
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Calendario de Mantenimiento Recomendado */}
      <section className="py-20 bg-slate-950/80 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Buenas Prácticas de Ingeniería</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
              ¿Cada cuánto tiempo debes hacer mantenimiento?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              El contador de horas de funcionamiento (horómetro) y el calendario son los dos parámetros críticos para evitar sorpresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIMETABLE_RECOMMENDATIONS.map((rec, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    {rec.target}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-3">{rec.interval}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{rec.actions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Señales de Alerta que Exigen Mantenimiento Inmediato */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-red-400 text-sm font-semibold tracking-wider uppercase">Diagnóstico Preventivo</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            Señales de que tu Generador Requiere Revisión Urgente
          </h2>
          <p className="text-slate-400 text-base">
            Si notas alguno de estos síntomas, no esperes a un corte de energía para descubrir que tu equipo está averiado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WARNING_SIGNS.map((warn, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-2">{warn.title}</h4>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    <strong className="text-slate-400">Causa probable:</strong> {warn.cause}
                  </p>
                  <p className="text-xs text-red-400 font-semibold">
                    ⚠️ {warn.danger}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consejos de Uso para Prolongar la Vida Útil */}
      <section className="py-20 bg-slate-950/80 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Cuidado del Propietario</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
              4 Consejos de Oro para Cuidar tu Planta Eléctrica
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Recomendaciones sencillas de nuestros ingenieros que duplican la durabilidad del motor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USAGE_TIPS.map((tip, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2">{tip.tip}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Preguntas Frecuentes
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Dudas sobre el Servicio de Generadores
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-amber-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-amber-400" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4"
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

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-amber-950/40 border-t border-slate-800 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <Zap className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            ¿Tu generador arrancará con certeza en el próximo apagón?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            No te arriesgues a quedarte a oscuras. Agenda hoy tu mantenimiento básico por solo <strong className="text-white">$50.00</strong> o solicita una visita técnica especializada a tu fábrica o residencia.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all"
          >
            <Smartphone className="w-5 h-5" /> Agendar Mantenimiento por WhatsApp
          </a>
          <p className="text-xs text-slate-500 mt-4">
            ATOMIC Electronics Ecuador • Soluciones Energéticas & Telecomunicaciones
          </p>
        </div>
      </section>
    </div>
  )
}
