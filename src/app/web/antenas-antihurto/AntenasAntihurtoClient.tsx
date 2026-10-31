"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Store,
  Shirt,
  Sparkles,
  ShoppingBag,
  Smartphone,
  ChevronDown,
  Volume2,
  Award,
  Layers,
  Wrench,
  Radio,
  Check,
  TrendingDown,
  Lock,
  Tag,
  HelpCircle,
  Truck
} from "lucide-react"

interface AntenaKit {
  id: string
  name: string
  tagline: string
  price: number
  badge: string
  badgeColor: string
  image: string
  idealFor: string
  detectionWidth: string
  features: string[]
}

const ANTENA_KITS: AntenaKit[] = [
  {
    id: "kit-estandar-576",
    name: "Sistema Antihurto RF Dual Estándar (Par de Pedestales)",
    tagline: "La solución más rentable y efectiva contra el robo hormiga en tiendas y locales",
    price: 576.00,
    badge: "🔥 Más Vendido",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    image: "/images/antihurto/antenas-antihurto-par-576.jpg",
    idealFor: "Boutiques, tiendas de ropa juvenil, bazares, ferreterías y zapaterías",
    detectionWidth: "Hasta 1.40m entre pedestales (según tipo de etiqueta)",
    features: [
      "Par de antenas (1 Transmisora TX + 1 Receptora RX)",
      "Frecuencia estándar 8.2 MHz compatible con el 95% de tags del mercado",
      "Alarma sonora de 95dB y luz LED estroboscópica roja disuasiva",
      "Filtro DSP digital anti-interferencias para evitar falsos disparos",
      "Chasis de aleación de aluminio reforzado con base de acero",
      "Fácil anclaje a piso con pernos expansivos incluidos",
      "3 Años de Garantía Directa en ATOMIC Electronics"
    ]
  },
  {
    id: "kit-premium-acrilico-745",
    name: "Sistema Antihurto Acrílico Crystal de Lujo (Par de Pedestales)",
    tagline: "Elegancia transparente y máxima potencia de detección para centros comerciales",
    price: 745.00,
    badge: "👑 Serie Premium Crystal",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    image: "/images/antihurto/antenas-antihurto-retail-seguridad.jpg",
    idealFor: "Centros comerciales, tiendas de moda de diseñador, ópticas, joyerías y perfumerías",
    detectionWidth: "Hasta 1.80m de pasillo amplio sin reducir el flujo de clientes",
    features: [
      "Cuerpo de Acrílico Cristalino transparente de alta densidad y lujo",
      "Iluminación LED ambiental integrada que realza la estética de la entrada",
      "Procesador DSP de ultra alta velocidad con detección en 0.1 segundos",
      "Compatible con etiquetas blandas adhesivas y tags rígidos mini/golf",
      "Mayor rango de cobertura entre pedestales (hasta 1.80 metros)",
      "Resistente a rayaduras y deformaciones por impacto accidental",
      "3 Años de Garantía Directa Oficial ATOMIC"
    ]
  }
]

const ACCESORIOS = [
  {
    name: "Tags Rígidos Mini / Golf (Ropa y Calzado)",
    desc: "Caja x 1000 unidades con clavo ranurado. Reutilizables por miles de ciclos.",
    icon: Tag,
    price: "Desde $0.12 c/u"
  },
  {
    name: "Desactivador Magnético de Súper Potencia",
    desc: "Fuerza de 12,000 a 16,000 Gauss para abrir cualquier tipo de tag en caja.",
    icon: Lock,
    price: "Desde $45.00"
  },
  {
    name: "Etiquetas Adhesivas RF 4x4 con Código de Barras",
    desc: "Rollo x 1000 etiquetas para cosméticos, libros, accesorios y cajas de producto.",
    icon: ShoppingBag,
    price: "Desde $28.00 / rollo"
  },
  {
    name: "Desactivador Electrónico de Etiquetas Adhesivas",
    desc: "Pad plano de mostrador que neutraliza la etiqueta por radiofrecuencia al cobrar.",
    icon: Radio,
    price: "Desde $110.00"
  }
]

const TARGET_BUSINESSES = [
  {
    icon: Shirt,
    title: "Tiendas de Ropa & Boutiques",
    lossWithout: "Pérdidas de $300 a $1,200 mensuales por prendas sustraídas en probadores.",
    gainWith: "Reducción del 98% del robo hormiga. Recuperación de la inversión en menos de 90 días."
  },
  {
    icon: Store,
    title: "Locales de Electrónica & Accesorios",
    lossWithout: "Robo de audífonos, cables, fundas y gadgets de alto valor por descuidos en mostrador.",
    gainWith: "Exhibición abierta para que el cliente toque el producto sin miedo al extravío."
  },
  {
    icon: ShoppingBag,
    title: "Farmacias, Minimarkets & Cosméticos",
    lossWithout: "Sustracción silenciosa de cremas, vitaminas y artículos de bolsillo.",
    gainWith: "Protección invisible con etiquetas adhesivas de 8.2MHz que activan la alarma al pasar."
  }
]

const FAQS = [
  {
    q: "¿Por qué el modelo de $745 es más costoso que el de $576?",
    a: "El kit de $745 está fabricado en cuerpo de Acrílico Cristalino transparente de alta gama (muy demandado en locales de centros comerciales como Quicentro, CCI o Mall del Sol) y cuenta con una tarjeta procesadora DSP más avanzada que permite mayor distancia de separación entre antenas (hasta 1.80m) sin generar falsas alarmas."
  },
  {
    q: "¿El par de antenas incluye los sensores o tags para la ropa?",
    a: "El kit de pedestales incluye las dos antenas, la centralita de control, fuente de poder y pernos de anclaje. Los accesorios de protección (tags rígidos, clavos, desactivadores y etiquetas) se venden por separado por millar para ajustarse exactamente a la cantidad de prendas o productos de tu inventario."
  },
  {
    q: "¿Es muy complicada la instalación?",
    a: "Es muy sencilla: las dos antenas se fijan al suelo en la puerta de salida mediante pernos de expansión, se conectan entre sí mediante un cable oculto bajo perfil de aluminio o piso flotante, y se conectan a un tomacorriente común de 110V. También ofrecemos servicio técnico de instalación en Quito y valles."
  },
  {
    q: "¿Las antenas interfieren con datáfonos, cajas registradoras o Wi-Fi?",
    a: "No. Operan en la banda de radiofrecuencia estandarizada de 8.2 MHz, la cual no interfiere con redes Wi-Fi (2.4/5GHz), puntos de venta (POS) ni teléfonos móviles."
  },
  {
    q: "¿Hacen envíos a provincias de Ecuador?",
    a: "Sí. Enviamos diariamente a Guayaquil, Cuenca, Ambato, Santo Domingo, Manta, Machala y todo el país a través de Servientrega o transporte de carga pesada, con embalaje de madera reforzado para garantizar que el acrílico y la electrónica lleguen intactos."
  }
]

export default function AntenasAntihurtoClient() {
  const [selectedKit, setSelectedKit] = useState<AntenaKit>(ANTENA_KITS[0])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const whatsappBaseUrl = "https://wa.me/593969043453"
  const whatsappUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(
    `¡Hola ATOMIC Electronics! 👋 Deseo asesoría sobre las *${selectedKit.name}* ($${selectedKit.price.toFixed(2)} + IVA). Necesito proteger mi local comercial de robos. ¿Me pueden cotizar con tags y envío? 🚨`
  )}`

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      {/* Top Banner de Alerta */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-800/40 text-xs py-2 px-4 text-center text-red-200 flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 font-bold tracking-wide">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> ¡NO DEJES QUE TE ROBEN EN TU NEGOCIO!
        </span>
        <span className="hidden sm:inline text-red-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Award className="w-3.5 h-3.5 text-red-400" /> 3 AÑOS DE GARANTÍA OFICIAL ATOMIC
        </span>
        <span className="hidden sm:inline text-red-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Truck className="w-3.5 h-3.5 text-red-400" /> DESPACHOS SEGUROS A TODO EL ECUADOR
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Lado Izquierdo */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-semibold mb-6 tracking-wide uppercase">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Prevención de Pérdidas Retail 2026
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                No Dejes Que Te Roben:{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-amber-400">
                  Antenas Anti-Hurto
                </span>{" "}
                para Locales y Retail
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                El <strong className="text-white">robo hormiga</strong> puede destruir la rentabilidad de tu negocio mes a mes. Protege tu mercadería con sistemas de detección por radiofrecuencia (RF 8.2MHz) y pedestales de acrílico cristalino de alta potencia sonora y lumínica.
              </p>

              {/* Selector Rápido de Kits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {ANTENA_KITS.map(kit => {
                  const isSelected = selectedKit.id === kit.id
                  return (
                    <button
                      key={kit.id}
                      onClick={() => setSelectedKit(kit)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-slate-900 border-red-500/70 shadow-lg shadow-red-900/20 ring-1 ring-red-500/50"
                          : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${kit.badgeColor}`}>
                          {kit.badge}
                        </span>
                        <span className="text-xl font-extrabold text-white">
                          ${kit.price.toFixed(2)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">{kit.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{kit.detectionWidth}</p>
                    </button>
                  )
                })}
              </div>

              {/* Botón WhatsApp de Acción Directa */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base"
                >
                  <Smartphone className="w-5 h-5" /> Proteger Mi Local por WhatsApp
                </a>
                <a
                  href="#comparativa-antenas"
                  className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-center transition-all flex items-center justify-center text-sm"
                >
                  Ver Comparativa de Modelos
                </a>
              </div>
            </div>

            {/* Lado Derecho: Flyers Oficiales */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-red-500/40 bg-black/60 aspect-square shadow-2xl">
                <Image
                  src={selectedKit.image}
                  alt={selectedKit.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-red-600 text-white shadow-lg">
                    ${selectedKit.price.toFixed(2)} + IVA
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black/40 aspect-video shadow-xl">
                <Image
                  src="/images/antihurto/antenas-antihurto-retail-seguridad.jpg"
                  alt="No dejes que te roben Antenas Anti Hurto ATOMIC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impacto Económico: Pérdidas vs Protección */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-red-400 text-sm font-semibold tracking-wider uppercase">El Costo Real de no Protegerse</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4">
            ¿Cuánto dinero pierde tu negocio cada mes?
          </h2>
          <p className="text-slate-400 text-base">
            El 83% de los comerciantes subestima las mermas por robo no detectado hasta que hacen su inventario anual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TARGET_BUSINESSES.map((tb, idx) => {
            const Icon = tb.icon
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">{tb.title}</h3>
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/40 text-xs text-red-300 mb-3">
                    <strong className="block font-bold text-red-400 mb-1">Sin Sistema Antihurto:</strong>
                    {tb.lossWithout}
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/40 text-xs text-emerald-300">
                    <strong className="block font-bold text-emerald-400 mb-1">Con Antenas ATOMIC:</strong>
                    {tb.gainWith}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Comparativa Detallada de Modelos */}
      <section id="comparativa-antenas" className="py-20 bg-slate-950/80 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-400 text-sm font-semibold tracking-wider uppercase">Diferencias Técnicas</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
              Compara Nuestro Modelo Estándar ($576) vs Acrílico Premium ($745)
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Ambos sistemas garantizan una tasa de disuasión superior al 98%, variando en diseño y amplitud de cobertura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {ANTENA_KITS.map(kit => (
              <div
                key={kit.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-red-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${kit.badgeColor}`}>
                      {kit.badge}
                    </span>
                    <span className="text-3xl font-black text-white">
                      ${kit.price.toFixed(2)} <span className="text-xs text-slate-400 font-normal">+ IVA</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-2">{kit.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{kit.tagline}</p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-6">
                    <div className="text-xs text-slate-400">
                      <strong>Ancho recomendado:</strong> {kit.detectionWidth}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      <strong>Ideal para:</strong> {kit.idealFor}
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-8">
                    {kit.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`${whatsappBaseUrl}?text=${encodeURIComponent(
                    `¡Hola ATOMIC! Deseo pedir la proforma del *${kit.name}* ($${kit.price.toFixed(2)}). ¿Me ayudan con la cotización completa? 🚨`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-600/20"
                >
                  <Smartphone className="w-4 h-4" /> Cotizar este Sistema
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accesorios y Consumibles */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-red-400 text-sm font-semibold tracking-wider uppercase">Solución Integral</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            Tags, Sensores y Desactivadores de Caja
          </h2>
          <p className="text-slate-400 text-base">
            Equipa tus mostradores y prendas con los consumibles oficiales más duraderos y seguros.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACCESORIOS.map((acc, idx) => {
            const Icon = acc.icon
            return (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-red-400 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2">{acc.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{acc.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs font-bold text-red-400">
                  {acc.price}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-red-400" /> Respuestas a Comerciantes
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Preguntas Frecuentes sobre Antenas Antihurto
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-red-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-red-400" : ""}`} />
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
      <section className="py-16 bg-gradient-to-b from-slate-950 to-red-950/40 border-t border-slate-800 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Cada día sin antenas es mercadería que pierdes para siempre
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            Habla hoy mismo con un especialista en seguridad retail de ATOMIC. Te asesoramos sobre la separación óptima de pedestales y la mejor configuración para tu local.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all"
          >
            <Smartphone className="w-5 h-5" /> Contactar a un Asesor por WhatsApp
          </a>
          <p className="text-xs text-slate-500 mt-4">
            ATOMIC Electronics Ecuador • Soluciones de Seguridad Comercial • Despachos a nivel nacional
          </p>
        </div>
      </section>
    </div>
  )
}
