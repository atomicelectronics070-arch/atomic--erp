"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Volume2,
  Sparkles,
  Bluetooth,
  Battery,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Check,
  Star,
  Tv,
  Gamepad2,
  Headphones,
  Radio,
  Sliders,
  ChevronDown,
  Layers,
  ArrowRight,
  Eye,
  Maximize2,
  Zap,
  Flame,
  Award,
  Music,
  ExternalLink
} from "lucide-react"

const FLYERS_DATA = [
  {
    id: "flyer-precio",
    title: "¡Precio Especial de Lanzamiento $28.90 + IVA!",
    subtitle: "8 Modos RGB, Conectividad 4 en 1, Batería 2000 mAh y 10W Cristalinos",
    src: "/images/audio/barra-sonido-boc241n-1hora-precio-28.jpg"
  },
  {
    id: "flyer-futuro",
    title: "El Futuro del Sonido en tus Manos",
    subtitle: "Distribuidor Autorizado 1 HORA · Construcción Americana & 3 Años Garantía",
    src: "/images/audio/barra-sonido-boc241n-1hora-futuro.jpg"
  }
]

const RGB_MODES = [
  { name: "Ciclo Arcoíris Dinámico", desc: "Transición fluida de espectro RGB completo", color: "from-pink-500 via-purple-500 to-cyan-500" },
  { name: "Pulsación Gamer Ritmo", desc: "Sincroniza la luz con el ritmo de los bajos", color: "from-cyan-400 to-blue-600" },
  { name: "Ola Neón Futurista", desc: "Efecto de onda luminosa de izquierda a derecha", color: "from-emerald-400 to-cyan-500" },
  { name: "Respiración Suave", desc: "Intensidad modulada para sesiones nocturnas", color: "from-violet-500 to-fuchsia-500" },
  { name: "Rojo Furia Combate", desc: "Ambiente intenso para juegos de acción y disparos", color: "from-rose-600 to-red-600" },
  { name: "Azul Cyber Ciberpunk", desc: "Tono eléctrico para streaming y setups limpios", color: "from-blue-500 to-indigo-600" },
  { name: "Verde Matrix Tecnológico", desc: "Vibra digital para programación y diseño", color: "from-emerald-500 to-teal-600" },
  { name: "Modo Audio Puro (Luz Apagada)", desc: "Apaga las luces para máxima concentración o cine a oscuras", color: "from-slate-700 to-slate-900" }
]

const USE_CASES = [
  {
    id: "setup-gamer",
    icon: Gamepad2,
    title: "Setup Gamer & PC de Escritorio",
    badge: "🎮 Favorito de Gamers",
    description: "Diseñada para colocarse justo debajo de tu monitor sin ocupar espacio. Siente cada paso, disparo y explosión en juegos competitivos como Valorant, Call of Duty, Free Fire o Fortnite con latencia cero usando el cable AUX o Bluetooth.",
    bullets: ["Diseño horizontal slim bajo monitor", "Sonido espacial para escuchar pasos y enemigos", "Luces RGB que combinan con tu mouse y teclado"]
  },
  {
    id: "celular-musica",
    icon: Smartphone,
    title: "Celular, Spotify & TikTok",
    badge: "📲 Música sin Cables",
    description: "Conéctate al instante por Bluetooth 5.0 y llena tu cuarto con tus canciones favoritas. La batería de 2000 mAh te da más de 5 horas de música continua para que te olvides de los enchufes.",
    bullets: ["Bluetooth 5.0 estable hasta 10 metros", "Bajos ricos que no suenan a lata", "Perilla superior para cambiar volumen sin tocar el celular"]
  },
  {
    id: "laptop-cine",
    icon: Tv,
    title: "Laptop, Series & Películas",
    badge: "🎬 Cine en tu Habitación",
    description: "¿Cansado de que tu laptop suene bajito y sin fuerza? Conecta la barra y disfruta de diálogos nítidos y sonido envolvente viendo tus animes, películas en Netflix o videos en YouTube.",
    bullets: ["Multiplica x5 la potencia de tu laptop", "Voces nítidas y efectos sonoros claros", "Fácil de llevar en tu mochila o morral"]
  },
  {
    id: "fiesta-portatil",
    icon: Music,
    title: "Reuniones & Fiesta con Amigos",
    badge: "🔋 100% Portátil",
    description: "Llévala a la sala, al patio o a la casa de tus amigos. Con sus 4 entradas (Bluetooth, USB, MicroSD y AUX), cualquier amigo puede poner música al instante.",
    bullets: ["Batería recargable de 2000 mAh", "Reproduce música directa desde un pendrive o tarjeta MicroSD", "Manos libres integrado para responder llamadas"]
  }
]

const SPECS_TABLE = [
  { label: "Marca Oficial", value: "1 HORA (Distribuidor Autorizado)" },
  { label: "Modelo", value: "BOC241N Soundbar Gaming" },
  { label: "Potencia de Audio", value: "10W RMS (Doble bocina acústica reforzada)" },
  { label: "Iluminación", value: "8 Modos Dinámicos LED RGB integrados" },
  { label: "Batería Interna", value: "2000 mAh Recargable de larga duración" },
  { label: "Autonomía", value: "Más de 5 horas de música continua" },
  { label: "Conectividad Inalámbrica", value: "Bluetooth 5.0 de baja latencia (alcance 10m)" },
  { label: "Conexiones Físicas", value: "Puerto USB, Ranura Tarjeta TF (MicroSD), Entrada AUX 3.5mm" },
  { label: "Controles", value: "Perilla giratoria ergonómica con botón multifunción" },
  { label: "Micrófono", value: "Integrado para llamadas manos libres y Discord" },
  { label: "Garantía Oficial", value: "3 Años de Garantía Directa ATOMIC" },
  { label: "Construcción", value: "Estándar Americano de Alta Durabilidad y Acústica Reforzada" }
]

const FAQS = [
  {
    q: "¿Puedo conectarla a mi PC de escritorio y a mi celular?",
    a: "¡Sí! Puedes dejarla conectada a tu computadora por el cable AUX de 3.5mm o por USB, y al mismo tiempo emparejarla por Bluetooth con tu celular. Con un toque en el panel alternas entre una fuente y otra sin desconectar cables."
  },
  {
    q: "¿Las luces LED RGB se pueden apagar?",
    a: "Sí, totalmente. La barra incluye 8 modos de iluminación RGB dinámicos, y si deseas usarla a oscuras para ver películas o estudiar, puedes apagar la luz con un solo botón manteniendo el sonido al 100%."
  },
  {
    q: "¿Viene con los cables incluidos en la caja?",
    a: "Sí. Viene en su caja oficial con su cable de carga USB y cable de audio AUX de 3.5mm listo para conectar a cualquier PC, monitor, laptop o celular."
  },
  {
    q: "¿En qué consiste la Garantía de 3 Años?",
    a: "Respaldamos la calidad y durabilidad con estándar americano de 1 HORA. Si el equipo presenta cualquier falla de fábrica, sonido o batería en un periodo de 3 años, ATOMIC te brinda soporte técnico directo o reemplazo."
  },
  {
    q: "¿Cómo es la entrega y el pago?",
    a: "Hacemos envíos rápidos y seguros a todo el Ecuador. Puedes pagar con transferencia bancaria, tarjeta de crédito o consultar disponibilidad de pago contraentrega en tu ciudad."
  }
]

export default function BarraSonidoClient() {
  const [activeFlyerIndex, setActiveFlyerIndex] = useState(0)
  const [activeUseCase, setActiveUseCase] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [modalFlyer, setModalFlyer] = useState<string | null>(null)

  const productPrice = 28.90

  const whatsappUrl = useMemo(() => {
    const text = `Hola Atomic, vengo de la página oficial de la *Barra de Sonido 1 HORA BOC241N*. Me interesa aprovechar el precio de lanzamiento de *$${productPrice.toFixed(2)} + IVA* (con 8 modos RGB, 10W y 3 años de garantía). ¿En qué tiempo me la entregan y cuáles son los métodos de pago?`
    return `https://wa.me/593969043453?text=${encodeURIComponent(text)}`
  }, [productPrice])

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Top Banner Gamer / Lanzamiento */}
      <div className="bg-gradient-to-r from-pink-950 via-purple-950 to-cyan-950 border-b border-cyan-500/40 py-2 px-4 text-center text-xs font-bold text-cyan-200 flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-pink-400 shrink-0 animate-pulse" />
        <span>🚀 ¡PRECIO DE LANZAMIENTO! Barra de Sonido BOC241N a solo $28.90 + IVA · 3 Años de Garantía Oficial</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050811]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-cyan-900/40">
            ⚡
          </div>
          <div>
            <span className="font-black text-sm tracking-wide text-white uppercase block leading-none">
              1 HORA <span className="text-cyan-400">GAMING</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Distribuidor Autorizado ATOMIC</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block font-mono text-xs font-black text-pink-400 bg-pink-950/60 border border-pink-500/40 px-2.5 py-1 rounded-lg">
            $28.90 + IVA
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-950 flex items-center gap-1.5 cursor-pointer"
          >
            <Smartphone size={14} />
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Glows de fondo RGB */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-pink-600/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[500px] h-[300px] bg-cyan-600/15 blur-[130px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: Información y Propuesta de Valor */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Zap size={13} className="text-pink-400" />
              <span>Construcción Americana · 3 Años de Garantía Oficial</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              El Futuro del Sonido: <br />
              <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Barra de Sonido BOC241N 1 HORA
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
              Potencia de <strong>10W con sonido cristalino</strong>, bajos profundos y <strong>8 modos de luces LED RGB</strong> que transforman tu setup de PC, tu habitación y tus partidas de juego en una experiencia visual y auditiva única.
            </p>

            {/* Badges de Beneficios Clave */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-cyan-400 font-mono uppercase block">Potencia Real</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  <Volume2 size={13} className="text-cyan-400" /> 10W Sin Distorsión
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-pink-400 font-mono uppercase block">Iluminación</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  <Sparkles size={13} className="text-pink-400" /> 8 Modos LED RGB
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-emerald-400 font-mono uppercase block">Batería Propia</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  <Battery size={13} className="text-emerald-400" /> 2000 mAh (+5 Horas)
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-purple-400 font-mono uppercase block">Conexiones</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  <Bluetooth size={13} className="text-purple-400" /> Bluetooth, AUX, USB, TF
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-amber-400 font-mono uppercase block">Calidad Superior</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={13} className="text-amber-400" /> 3 Años Garantía
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-rose-400 font-mono uppercase block">Estándar</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  🇺🇸 Construcción Americana
                </span>
              </div>
            </div>

            {/* Precio & CTA */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="bg-gradient-to-r from-pink-950/80 to-purple-950/80 border border-pink-500/60 p-3.5 rounded-2xl flex items-baseline gap-2">
                <span className="text-xs font-bold text-pink-300 uppercase">Lanzamiento:</span>
                <span className="text-3xl font-black text-white font-mono">$28.90</span>
                <span className="text-xs font-bold text-slate-400 font-mono">+ IVA</span>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 hover:opacity-95 text-black font-black text-sm px-7 py-4 rounded-2xl transition-all shadow-xl shadow-pink-950/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone size={18} />
                <span>¡Pedir Ahora por WhatsApp!</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Vista Previa del Flyer Oficial */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 shadow-2xl relative group">
              <div className="relative w-full h-[400px] sm:h-[450px] rounded-2xl overflow-hidden bg-slate-950">
                <Image
                  src={FLYERS_DATA[activeFlyerIndex].src}
                  alt={FLYERS_DATA[activeFlyerIndex].title}
                  fill
                  className="object-contain p-2"
                  priority
                />
                <button
                  onClick={() => setModalFlyer(FLYERS_DATA[activeFlyerIndex].src)}
                  className="absolute bottom-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-xl text-xs flex items-center gap-1 border border-slate-700 cursor-pointer transition-colors"
                >
                  <Maximize2 size={14} /> Ampliar
                </button>
              </div>

              {/* Selector de Flyers */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {FLYERS_DATA.map((flyer, idx) => (
                  <button
                    key={flyer.id}
                    onClick={() => setActiveFlyerIndex(idx)}
                    className={`text-left p-2 rounded-xl text-xs transition-all border cursor-pointer ${
                      activeFlyerIndex === idx
                        ? "bg-slate-800 border-cyan-400 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="font-bold block truncate">
                      {idx === 0 ? "Flyer Precio $28.90" : "Flyer Características"}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Ver foto oficial
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE BENEFICIOS CLAVE */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            DISEÑADA PARA SUPERAR A CUALQUIER PARLANTE TRADICIONAL
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            ¿Por qué la BOC241N es la Mejor Elección?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Conoce a detalle cada uno de los beneficios que hacen de esta barra el producto favorito de jóvenes y gamers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Beneficio 1 */}
          <div className="bg-gradient-to-b from-slate-900/90 to-[#0a0f1d] border border-cyan-500/30 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
              <Volume2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">10W de Potencia Cristalina</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Equipada con dos altavoces de alta respuesta de frecuencia y un radiador pasivo de bajos. Produce un sonido envolvente y potente que no distorsiona incluso al volumen máximo.
            </p>
            <div className="text-[11px] text-cyan-300 font-mono pt-1">
              • Bajos profundos + Agudos ricos
            </div>
          </div>

          {/* Beneficio 2 */}
          <div className="bg-gradient-to-b from-slate-900/90 to-[#0a0f1d] border border-pink-500/30 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-pink-950 border border-pink-500/50 flex items-center justify-center text-pink-300">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">8 Modos de Luz LED RGB</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dale vida a tu setup o habitación. Incluye 8 efectos luminosos (arcoíris, respiración, pulso con la música y colores fijos) que convierten cualquier espacio en un estudio gamer.
            </p>
            <div className="text-[11px] text-pink-300 font-mono pt-1">
              • Espectáculo visual dinámico
            </div>
          </div>

          {/* Beneficio 3 */}
          <div className="bg-gradient-to-b from-slate-900/90 to-[#0a0f1d] border border-emerald-500/30 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <Battery size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Batería de 2000 mAh (+5h)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No estás atado a cables. Su batería de litio de alta densidad te permite llevarte la música a cualquier rincón de la casa, terraza o reuniones con amigos durante más de 5 horas seguidas.
            </p>
            <div className="text-[11px] text-emerald-300 font-mono pt-1">
              • Recargable por USB rápido
            </div>
          </div>

          {/* Beneficio 4 */}
          <div className="bg-gradient-to-b from-slate-900/90 to-[#0a0f1d] border border-purple-500/30 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Conexiones 4 en 1 Totales</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bluetooth 5.0 para tu teléfono o tablet, puerto AUX 3.5mm para tu PC o TV, puerto USB para pendrives y ranura TF para tarjetas MicroSD. Conecta lo que quieras sin límites.
            </p>
            <div className="text-[11px] text-purple-300 font-mono pt-1">
              • Bluetooth + AUX + USB + MicroSD
            </div>
          </div>

          {/* Beneficio 5 */}
          <div className="bg-gradient-to-b from-slate-900/90 to-[#0a0f1d] border border-amber-500/30 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <Sliders size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Perilla Ergonómica & Manos Libres</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Controla el volumen de forma rápida e intuitiva con su rueda iluminada superior. Además cuenta con micrófono integrado de alta sensibilidad para atender llamadas o chatear en Discord.
            </p>
            <div className="text-[11px] text-amber-300 font-mono pt-1">
              • Control táctil y chat de voz
            </div>
          </div>

          {/* Beneficio 6 */}
          <div className="bg-gradient-to-b from-slate-900/90 to-[#0a0f1d] border border-blue-500/30 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-500/50 flex items-center justify-center text-blue-300">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Construcción Americana & 3 Años Garantía</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rejilla metálica acústica y acabados reforzados bajo estándares de calidad americanos. Respaldada por 3 años de garantía oficial directa de ATOMIC Electronics Ecuador.
            </p>
            <div className="text-[11px] text-blue-300 font-mono pt-1">
              • 3 Años de respaldo oficial
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA DE CASOS DE USO */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">VERSATILIDAD TOTAL</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Perfecta para Cada Momento de tu Día</h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {USE_CASES.map((uc, idx) => {
            const Icon = uc.icon
            const isAct = activeUseCase === idx
            return (
              <button
                key={uc.id}
                onClick={() => setActiveUseCase(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border cursor-pointer ${
                  isAct
                    ? "bg-gradient-to-r from-cyan-950 to-pink-950 text-white border-pink-500/60 shadow-lg"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Icon size={15} className={isAct ? "text-cyan-400" : "text-slate-400"} />
                <span>{uc.title.split("&")[0]}</span>
              </button>
            )
          })}
        </div>

        {/* Card Contenido */}
        <div className="bg-gradient-to-br from-slate-900/90 to-[#0e1624] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-950 text-pink-300 border border-pink-500/40">
              {USE_CASES[activeUseCase].badge}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
            {USE_CASES[activeUseCase].title}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {USE_CASES[activeUseCase].description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            {USE_CASES[activeUseCase].bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESPECIFICACIONES TÉCNICAS */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-8 space-y-1">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">TRANSPARENCIA TOTAL</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Ficha Técnica Oficial BOC241N</h2>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SPECS_TABLE.map((item, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{item.label}</span>
                <span className="text-xs font-bold text-white text-right ml-2">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA DE COMPRA FINAL */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="bg-gradient-to-r from-pink-950/80 via-purple-950/80 to-cyan-950/80 border border-pink-500/50 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
            OFERTA POR TIEMPO LIMITADO
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Llévate la Barra de Sonido 1 HORA por solo <span className="text-pink-400">$28.90 + IVA</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Asegura la tuya con 3 años de garantía oficial, envío rápido a todo el Ecuador y la mejor vibra RGB para tu cuarto o setup.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Smartphone size={18} />
              <span>Pedir por WhatsApp ($28.90 + IVA)</span>
            </a>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="py-12 px-4 md:px-8 max-w-3xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-8 space-y-1">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">DUDAS COMUNES</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-400">ATOMIC Ecuador · Distribuidor Autorizado 1 HORA</p>
        <p>© {new Date().getFullYear()} ATOMIC Electronics. Todos los derechos reservados.</p>
        <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-400">
          <Link href="/web" className="hover:text-cyan-400 transition-colors">Inicio</Link>
          <Link href="/web/camaras-hogar" className="hover:text-pink-400 transition-colors">Cámaras Hogar</Link>
          <Link href="/web/cercos-electricos" className="hover:text-amber-400 transition-colors">Cercos Eléctricos</Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">WhatsApp Pedidos</a>
        </div>
      </footer>

      {/* MODAL DE FLYER EN ALTA RESOLUCIÓN */}
      <AnimatePresence>
        {modalFlyer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e1624] border border-slate-700 rounded-3xl max-w-xl w-full p-4 space-y-3 relative shadow-2xl"
            >
              <button
                onClick={() => setModalFlyer(null)}
                className="absolute top-4 right-4 bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center z-10 cursor-pointer"
              >
                ✕
              </button>

              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-slate-950">
                <Image
                  src={modalFlyer}
                  alt="Flyer Oficial"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="text-center pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone size={14} />
                  <span>Pedir esta Barra por WhatsApp ($28.90 + IVA)</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
