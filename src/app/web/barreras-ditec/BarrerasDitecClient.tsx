"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
  Building2,
  Car,
  Clock,
  Gauge,
  Sliders,
  Sparkles,
  Smartphone,
  ChevronDown,
  Warehouse,
  Hospital,
  Store,
  Layers,
  Wrench,
  Radio,
  FileCheck2,
  Check,
  Truck,
  HelpCircle,
  ShieldAlert
} from "lucide-react"

const USE_CASES = [
  {
    icon: Building2,
    title: "Condominios & Urbanizaciones Privadas",
    description: "Elimina cuellos de botella en horas pico. Integración con tags RFID vehiculares (telepeaje), reconocimiento de placas LPR y control remoto para residentes.",
    badge: "Residencial Premium"
  },
  {
    icon: Hospital,
    title: "Hospitales & Centros Médicos",
    description: "Apertura prioritaria en menos de 2 segundos para ambulancias y emergencias. Operación silenciosa y continua durante las 24 horas del día.",
    badge: "Servicio Crítico"
  },
  {
    icon: Store,
    title: "Centros Comerciales & Supermercados",
    description: "Capacidad para soportar miles de ciclos diarios ininterrumpidos en días festivos y fines de semana. Integrable a sistemas de cobro y tickets.",
    badge: "Alto Tráfico"
  },
  {
    icon: Warehouse,
    title: "Parques Logísticos & Complejos Industriales",
    description: "Mástiles de hasta 6 metros de longitud para cubrir carriles anchos de tráilers y camiones pesados, con chasis de acero galvanizado con pintura poliéster anticorrosiva.",
    badge: "Heavy Duty"
  },
  {
    icon: Car,
    title: "Parqueaderos Públicos Tarifados",
    description: "Precisión milimétrica para sincronización con bucles magnéticos inductivos (sensores de masa vehicular) y fotocélulas de seguridad antiaplastamiento.",
    badge: "Tarificación"
  },
  {
    icon: Layers,
    title: "Torres Corporativas & Entidades Financieras",
    description: "Diseño estético vanguardista que realza el estatus arquitectónico del edificio, con luces LED dinámicas integradas en la tapa del mueble.",
    badge: "Corporativo"
  }
]

const KEY_BENEFITS = [
  {
    icon: Gauge,
    title: "Motor Brushless 24V de Uso Intensivo",
    description: "Motorreductor electromecánico de tecnología Brushless (sin escobillas) diseñado para uso continuo (100% duty cycle) sin sobrecalentamiento ni desgaste prematuro."
  },
  {
    icon: Clock,
    title: "Apertura Ultrarrápida Regulable",
    description: "Velocidad de apertura ajustable desde 2.0 hasta 6.0 segundos según el largo del brazo y las necesidades específicas del carril."
  },
  {
    icon: ShieldAlert,
    title: "Seguridad Antiaplastamiento con Encoder",
    description: "Encoder digital de precisión que detecta cualquier obstáculo al milisegundo e invierte el sentido de marcha inmediatamente para evitar daños a vehículos o transeúntes."
  },
  {
    icon: Radio,
    title: "Iluminación LED Semaforizada",
    description: "Leds de señalización integrados de alta visibilidad que alternan entre verde (paso libre) y rojo (barrera cerrando o denegada)."
  },
  {
    icon: Wrench,
    title: "Liberación Manual con Llave Personalizada",
    description: "En caso de falla eléctrica prolongada, el mecanismo de desbloqueo excéntrico permite levantar el mástil manualmente con suavidad total."
  },
  {
    icon: Award,
    title: "3 Años de Garantía & Respaldo ATOMIC",
    description: "Stock permanente de mástiles, resortes de balanceo, tarjetas electrónicas y piñones originales en nuestras bodegas de Quito."
  }
]

const SPECS_TABLE = [
  { label: "Fabricante & Línea", value: "Dítec (Tecnología Europea de Vanguardia)" },
  { label: "Serie / Modelo", value: "Dítec Serie 2027 Oficial" },
  { label: "Precio Promocional", value: "$1,928.90 + IVA (Precio de Lanzamiento)" },
  { label: "Alimentación de Motor", value: "24 Vcc de corriente continua" },
  { label: "Ciclo de Trabajo", value: "Uso Intensivo / Continuo (100% Duty Cycle)" },
  { label: "Longitud de Mástil", value: "Compatible con brazos de 3m, 4m y hasta 6m" },
  { label: "Tiempo de Maniobra", value: "Ajustable desde 2.0 a 6.0 segundos" },
  { label: "Protección Chasis", value: "Acero galvanizado con tratamiento cataforesis y pintura poliéster" },
  { label: "Grado de Hermeticidad", value: "IP54 apto para intemperie extrema" },
  { label: "Sistemas Compatibles", value: "LPR (Placas), TAGs RFID, Control Remoto, Teclado, Pulsador" },
  { label: "Garantía Oficial", value: "3 Años con soporte técnico directo en Ecuador" }
]

const FAQS = [
  {
    q: "¿Qué incluye el valor de lanzamiento de $1,928.90?",
    a: "El paquete incluye la columna o mueble de barrera Dítec Serie 2027 con motorreductor de 24V, tarjeta electrónica de control avanzada con microprocesador, mástil de aluminio con gomas de protección, resortes de balanceo calibrados y juego de fotocélulas de seguridad antiaplastamiento."
  },
  {
    q: "¿Brindan servicio de instalación y obra civil en Ecuador?",
    a: "Sí. Contamos con cuadrillas especializadas para la fundición de la base de hormigón, tendido de ductería subterránea, instalación de bucles magnéticos inductivos y puesta a punto de sistemas de control de acceso en Quito, Valles, Guayaquil y a nivel nacional."
  },
  {
    q: "¿Se puede integrar con lectores de telepeaje RFID para que los autos no se detengan?",
    a: "Totalmente. La central Dítec dispone de entradas estándar para receptores de antenas de largo alcance (UHF RFID). Al aproximarse el vehículo del residente con su tag pegado en el parabrisas, la barrera se abre automáticamente a gran velocidad sin necesidad de bajar la ventana."
  },
  {
    q: "¿Qué pasa si se corta la luz en la urbanización?",
    a: "La barrera cuenta con un sistema de desbloqueo mecánico con llave codificada para elevar el mástil a mano en 2 segundos. Además, es compatible con kits de baterías de respaldo de 24V para seguir operando decenas de aperturas durante cortes eléctricos."
  },
  {
    q: "¿Cuál es la vida útil estimada de una barrera Dítec?",
    a: "Gracias a su motor de corriente continua sin carbones y engranajes templados en baño de grasa permanente, las barreras Dítec están calculadas para superar ampliamente el millón de ciclos de maniobra con un mantenimiento preventivo periódico mínimo."
  }
]

export default function BarrerasDitecClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const whatsappBaseUrl = "https://wa.me/593969043453"
  const whatsappUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(
    "¡Hola ATOMIC Electronics! 👋 Deseo asesoría técnica y cotización formal de la *Barrera Vehicular Automática Dítec Serie 2027* ($1,928.90). ¿Me pueden agendar una visita técnica o enviar ficha técnica? 🚧"
  )}`

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Banner de Confianza */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border-b border-cyan-800/30 text-xs py-2 px-4 text-center text-cyan-200 flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 font-medium">
          <Award className="w-3.5 h-3.5 text-cyan-400" /> TECNOLOGÍA DÍTEC 2027 • INGENIERÍA EUROPEA
        </span>
        <span className="hidden sm:inline text-cyan-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" /> MOTOR 24V USO INTENSIVO (100% DUTY CYCLE)
        </span>
        <span className="hidden sm:inline text-cyan-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Wrench className="w-3.5 h-3.5 text-cyan-400" /> INSTALACIÓN & VISITA TÉCNICA A NIVEL NACIONAL
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Lado Izquierdo: Pitch Comercial Ultra Profesional */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold mb-6 tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4" /> Lanzamiento Oficial Dítec 2027
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Barreras Automáticas{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  Dítec Serie 2027:
                </span>{" "}
                El Futuro del Control de Acceso
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                Diseñadas para las aplicaciones más exigentes de alto flujo vehicular en Ecuador. Equipadas con motorreductor electromecánico de 24V continuo, apertura ultra veloz en 2 segundos y compatibilidad universal con lectores RFID, TAGs y cámaras de placas LPR.
              </p>

              {/* Card de Precio Promocional de Lanzamiento */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/60 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded border border-cyan-800/50">
                      Precio Especial de Lanzamiento
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-white mt-2">
                      $1,928.90 <span className="text-sm font-normal text-slate-400">+ IVA</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Incluye mueble Dítec 2027, motor 24V, central inteligente, mástil y fotocélulas
                    </p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base shrink-0"
                  >
                    <Smartphone className="w-5 h-5" /> Cotizar Proyecto
                  </a>
                </div>
              </div>

              {/* Highlights técnicos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">2.0 seg</div>
                  <div className="text-xs text-slate-400">Apertura Rápida</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">Hasta 6m</div>
                  <div className="text-xs text-slate-400">Brazo de Mástil</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">100%</div>
                  <div className="text-xs text-slate-400">Uso Continuo</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">3 Años</div>
                  <div className="text-xs text-slate-400">Garantía Directa</div>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Flyers Oficiales Dítec 2027 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/40 bg-black/60 aspect-[4/5] shadow-2xl">
                <Image
                  src="/images/barreras/barrera-ditec-tecnologia-2027-precio.jpg"
                  alt="Dítec Tecnología 2027 $1928.90 ATOMIC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-cyan-500 text-black shadow-lg">
                    Lanzamiento $1,928.90
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black/40 aspect-video shadow-xl">
                <Image
                  src="/images/barreras/barrera-ditec-serie-2027-futuro.jpg"
                  alt="Dítec Serie 2027 El Futuro del Control de Acceso"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aplicaciones Reales e Industrias */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Versatilidad Arquitectónica</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4">
            Diseñada para Cada Tipo de Proyecto
          </h2>
          <p className="text-slate-400 text-base">
            Desde la urbanización residencial más exclusiva hasta centros logísticos con tránsito ininterrumpido de carga pesada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc, idx) => {
            const Icon = uc.icon
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      {uc.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{uc.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{uc.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Beneficios de Ingeniería Dítec */}
      <section className="py-20 bg-slate-950/80 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Excelencia Mecánica</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
              Por qué la Ingeniería Dítec Supera al Mercado
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Menor consumo eléctrico, componentes libres de fricción y máxima seguridad operativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEY_BENEFITS.map((b, idx) => {
              const Icon = b.icon
              return (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ficha Técnica Completa */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Ficha Técnica Oficial</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
            Especificaciones del Sistema Dítec 2027
          </h2>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
            <tbody className="divide-y divide-slate-800">
              {SPECS_TABLE.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-4 px-5 font-bold text-white bg-slate-950/40 w-1/2">{item.label}</td>
                  <td className="py-4 px-5 text-cyan-300 font-medium">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Consultas de Clientes e Ingenieros
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Preguntas Frecuentes sobre Barreras Dítec
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-cyan-400" : ""}`} />
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
      <section className="py-16 bg-gradient-to-b from-slate-950 to-cyan-950/40 border-t border-slate-800 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            ¿Requieres una Cotización Formal o Visita Técnica?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            Nuestros ingenieros en automatización vehicular preparan tu proforma con memoria descriptiva, diagramas de conexionado y opciones de instalación en menos de 2 horas.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all"
          >
            <Smartphone className="w-5 h-5" /> Coordinar con un Ingeniero por WhatsApp
          </a>
          <p className="text-xs text-slate-500 mt-4">
            ATOMIC Electronics Ecuador • Automatización Industrial & Seguridad Perimetral
          </p>
        </div>
      </section>
    </div>
  )
}
