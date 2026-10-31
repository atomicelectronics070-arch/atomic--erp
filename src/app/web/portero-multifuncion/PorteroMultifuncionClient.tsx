"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  ScanFace,
  Fingerprint,
  CreditCard,
  KeyRound,
  Smartphone,
  Wifi,
  DoorOpen,
  Users,
  History,
  Lock,
  ChevronDown,
  Award,
  Sparkles,
  Zap,
  Building,
  Home,
  Check,
  PhoneCall,
  BellRing,
  HelpCircle,
  Truck
} from "lucide-react"

const VERIFICATION_METHODS = [
  {
    icon: ScanFace,
    title: "Reconocimiento Facial Ultra Rápido",
    capacity: "1,500 Rostros",
    description: "Algoritmo biométrico de luz visible con detección de rostros vivos (anti-spoofing que evita engaños con fotografías o videos en pantallas). Reconoce en menos de 0.3 segundos incluso con mascarilla o poca luz.",
    color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-400"
  },
  {
    icon: Fingerprint,
    title: "Lector Biométrico de Huella",
    capacity: "3,000 Huellas",
    description: "Sensor óptico de alta precisión SilkID que lee huellas secas, húmedas o desgastadas con tasa de falso rechazo prácticamente nula. Ideal para empleados y residentes diarios.",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400"
  },
  {
    icon: CreditCard,
    title: "Tarjetas y Llaveros RFID",
    capacity: "3,000 Tarjetas",
    description: "Lector de proximidad integrado compatible con tarjetas y tags RFID 125kHz. Perfecto para personal de servicio, visitas frecuentes o usuarios de tercera edad.",
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-400"
  },
  {
    icon: Smartphone,
    title: "App Móvil ZKBio Zlink (GRATIS)",
    capacity: "Usuarios Ilimitados",
    description: "Recibe videollamadas en tiempo real cuando alguien timbra a tu puerta. Puedes ver al visitante, hablar en audio bidireccional y abrir la cerradura eléctrica a distancia desde cualquier lugar del mundo sin cuotas mensuales.",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400"
  },
  {
    icon: KeyRound,
    title: "Contraseña / PIN Numérico",
    capacity: "Códigos Seguros",
    description: "Teclado táctil iluminado que permite asignar contraseñas numéricas personales o de emergencia para accesos sin llaves ni tarjetas.",
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/40 text-rose-400"
  },
  {
    icon: History,
    title: "Memoria Masiva de Eventos",
    capacity: "150,000 Registros",
    description: "Guarda un registro detallado e inviolable de cada entrada con fecha, hora exacta, método de verificación utilizado y fotografía del usuario. Auditable en cualquier momento desde la aplicación o software de gestión.",
    color: "from-slate-500/20 to-slate-700/20 border-slate-600/40 text-slate-300"
  }
]

const SPECS = [
  { label: "Capacidad de Rostros", value: "1,500 Rostros registrados" },
  { label: "Capacidad de Huellas", value: "3,000 Huellas dactilares" },
  { label: "Capacidad de Tarjetas", value: "3,000 Tarjetas / Tags RFID" },
  { label: "Historial de Eventos", value: "150,000 Registros sin sobreescritura" },
  { label: "Plataforma Móvil", value: "ZKBio Zlink oficial (iOS y Android)" },
  { label: "Costo de Licencia", value: "¡GRATIS de por vida (0 cuotas)!" },
  { label: "Conectividad", value: "Wi-Fi integrado + Puerto de Red RJ45" },
  { label: "Control de Puerta", value: "Relé seco para cerraduras eléctricas, magnéticas y portones" },
  { label: "Audio y Video", value: "Cámara HD con visión nocturna + Audio 2 vías" },
  { label: "Garantía", value: "3 Años Oficial en ATOMIC Electronics Ecuador" }
]

const FAQS = [
  {
    q: "¿Necesito pagar mensualidades por la aplicación ZKBio Zlink?",
    a: "No, la aplicación oficial ZKBio Zlink es completamente gratuita de por vida. Puedes agregar usuarios, registrar huellas, ver el historial y abrir la puerta de manera remota sin pagar suscripciones mensuales."
  },
  {
    q: "¿Funciona si estoy fuera de casa o de viaje en otra ciudad?",
    a: "Sí. Gracias a la conexión a la nube de ZKBio Zlink, cuando un visitante presiona el botón del timbre, tu teléfono celular suena como una llamada telefónica convencional en cualquier parte del mundo con conexión a internet (Wi-Fi o datos móviles 4G/5G)."
  },
  {
    q: "¿Es compatible con cualquier tipo de cerradura eléctrica?",
    a: "Sí. Cuenta con una salida de relé estándar normalmente abierto (NO) y normalmente cerrado (NC), lo que permite conectarlo a chapas eléctricas convencionales de 12V, electroimanes magnéticos, motores de portón vehicular y brazos hidráulicos."
  },
  {
    q: "¿Qué sucede si se va la energía eléctrica?",
    a: "La memoria interna no volátil conserva todas las configuraciones, rostros, huellas y registros de eventos. Además, es totalmente compatible con fuentes de poder ininterrumpidas (UPS de 12V con batería de respaldo) para continuar operando durante cortes de luz."
  },
  {
    q: "¿Realizan envíos a provincias de Ecuador?",
    a: "Sí, realizamos despachos diarios 100% asegurados a todo el territorio nacional vía Servientrega o cooperativa de transporte de tu preferencia. En Quito contamos con opción de entrega inmediata y servicio de instalación técnica profesional."
  }
]

export default function PorteroMultifuncionClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const whatsappBaseUrl = "https://wa.me/593969043453"
  const whatsappUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(
    "¡Hola ATOMIC Electronics! 👋 Deseo cotizar el *Portero Eléctrico Multifunción ZKTeco con App ZKBio Zlink* ($198.99). ¿Tienen stock disponible y cobertura de envío/instalación? 🚪"
  )}`

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Banner de Confianza */}
      <div className="bg-gradient-to-r from-blue-900/40 via-cyan-900/40 to-blue-900/40 border-b border-cyan-800/30 text-xs py-2 px-4 text-center text-cyan-200 flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 font-medium">
          <Award className="w-3.5 h-3.5 text-cyan-400" /> DISTRIBUIDOR AUTORIZADO ZKTECO ECUADOR
        </span>
        <span className="hidden sm:inline text-cyan-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> INCLUYE APP ZKBIO ZLINK 100% GRATIS DE POR VIDA
        </span>
        <span className="hidden sm:inline text-cyan-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Truck className="w-3.5 h-3.5 text-cyan-400" /> ENVÍO RÁPIDO A TODO EL PAÍS
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Contenido Izquierda */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold mb-6 tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4" /> Nueva Generación Biometría & Control de Acceso
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Portero Multifunción{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  ZKTeco con Reconocimiento Facial
                </span>{" "}
                y App Móvil
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                El control de acceso definitivo para residencias, oficinas y edificios. Olvídate de llaves perdidas: abre con tu <strong className="text-white">rostro, huella digital, tarjeta RFID o directo desde tu celular</strong> mediante videollamada HD con la App ZKBio Zlink.
              </p>

              {/* Caja de Precio Destacado */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/60 border border-cyan-500/40 rounded-2xl p-6 mb-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/50">
                      Precio Oficial de Lanzamiento
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-white mt-2">
                      $198.99 <span className="text-sm font-normal text-slate-400">+ IVA</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Incluye equipo ZKTeco, soporte de pared, transformador y App ZKBio Zlink GRATIS
                    </p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base shrink-0"
                  >
                    <Smartphone className="w-5 h-5" /> Comprar por WhatsApp
                  </a>
                </div>
              </div>

              {/* Beneficios rápidos en viñetas */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>1,500 Rostros</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>3,000 Huellas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>3,000 Tarjetas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>150,000 Eventos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Videollamada en Celular</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>3 Años de Garantía</span>
                </div>
              </div>
            </div>

            {/* Galería de Flyers Oficiales Derecha */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-black/50 aspect-square shadow-2xl">
                <Image
                  src="/images/porteros/portero-inteligente-app-movil-198.jpg"
                  alt="Portero Inteligente con App Móvil $198.99 ATOMIC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500 text-black shadow-lg">
                    $198.99 + IVA
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black/40 aspect-video shadow-xl">
                <Image
                  src="/images/porteros/portero-zkteco-multifuncion-zkbio.jpg"
                  alt="ZKTeco Portero Multifunción ZKBio Zlink Gratis"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Métodos de Verificación en Detalle */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Versatilidad Sin Límites</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4">
            6 Métodos de Acceso en un Solo Equipo
          </h2>
          <p className="text-slate-400 text-base">
            Cada miembro de la familia o empleado de la oficina puede ingresar con el método que le resulte más cómodo y seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFICATION_METHODS.map((method, idx) => {
            const Icon = method.icon
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
                      {method.capacity}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{method.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Cómo Funciona con la App ZKBio Zlink */}
      <section className="py-20 bg-slate-950/80 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Control Total en tu Bolsillo</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-6">
                Tu Smartphone es tu Pantalla de Videoportero
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">El visitante timbra en el equipo</h4>
                    <p className="text-sm text-slate-400">
                      Al presionar el botón del portero exterior, el equipo genera una llamada de video instantánea por internet.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Suena tu celular en cualquier lugar</h4>
                    <p className="text-sm text-slate-400">
                      Contesta la videollamada desde la app ZKBio Zlink. Puedes ver al visitante con claridad HD y mantener una conversación de audio bidireccional.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Apertura de puerta con 1 toque</h4>
                    <p className="text-sm text-slate-400">
                      Presiona el botón de desbloqueo en la pantalla y la chapa eléctrica o portón se abrirá al instante sin importar si estás en el trabajo o de viaje.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Aplicaciones */}
            <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-cyan-400" /> Ideal para diferentes escenarios:
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 text-sm mb-1">🏠 Residencias y Familias</h4>
                  <p className="text-xs text-slate-400">
                    Abre a tus hijos cuando regresan de la escuela o recibe paquetes de mensajería sin tener que estar físicamente en la vivienda.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 text-sm mb-1">🏢 Oficinas y Consultorios</h4>
                  <p className="text-xs text-slate-400">
                    Controla la asistencia y horarios de entrada de colaboradores con reconocimiento facial sin contacto ni manipulación de tarjetas.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 text-sm mb-1">🏬 Departamentos en Renta y Airbnb</h4>
                  <p className="text-xs text-slate-400">
                    Genera accesos temporales con PIN para huéspedes o abre la puerta a distancia sin necesidad de entregar llaves físicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla Técnica */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Ficha de Ingeniería</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
            Especificaciones Técnicas ZKTeco
          </h2>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
            <tbody className="divide-y divide-slate-800">
              {SPECS.map((spec, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-5 font-bold text-white bg-slate-950/40 w-1/2">{spec.label}</td>
                  <td className="py-3.5 px-5 text-cyan-300">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Dudas Comunes
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Preguntas Frecuentes sobre el Portero ZKTeco
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
      <section className="py-16 bg-gradient-to-b from-slate-950 to-blue-950/40 border-t border-slate-800 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <DoorOpen className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Actualiza el Acceso de tu Propiedad a la Tecnología 2026
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            Adquiere hoy tu Portero Multifunción ZKTeco por solo <strong className="text-white">$198.99 + IVA</strong> con entrega inmediata a domicilio o coordina la visita de un técnico instalador.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all"
          >
            <Smartphone className="w-5 h-5" /> Solicitar Asesoría por WhatsApp
          </a>
          <p className="text-xs text-slate-500 mt-4">
            ATOMIC Electronics • Quito, Ecuador • Facturación electrónica con garantía directa
          </p>
        </div>
      </section>
    </div>
  )
}
