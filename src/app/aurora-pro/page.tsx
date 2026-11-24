"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wifi,
  Moon,
  Shield,
  Smartphone,
  Eye,
  CheckCircle2,
  ChevronRight,
  Volume2,
  Camera,
  Bell,
  Droplets,
  Layers,
  Sparkles,
  Wrench,
  Package,
  ShieldCheck,
  Check
} from "lucide-react";

const SPECS = [
  { label: "Modelo y Sistema", value: "Cámara Exterior Doble Lente (PIP) Full Color Wi-Fi" },
  { label: "Línea Oficial", value: "ATOMIC TECNOLOGÍA RESIDENCIAL" },
  { label: "Resolución Óptica", value: "Doble sensor FHD (4MP combinados de alta nitidez)" },
  { label: "Tecnología de Visión", value: "Doble lente simultáneo: Lente panorámico superior + Lente motorizado inferior" },
  { label: "Ángulo y Cobertura", value: "Gran angular 110° (fijo) + Rotación 355° Pan y 90° Tilt (móvil)" },
  { label: "Visión Nocturna", value: "Full-Color 24/7 con focos LED blancos ultrabrillantes + IR nocturno" },
  { label: "Detección Inteligente", value: "Seguimiento automático de personas (Auto-Tracking) sin falsas alarmas" },
  { label: "Disuasión Activa", value: "Sirena de advertencia integrada + Luces destellantes disuasorias" },
  { label: "Resistencia al Clima", value: "Certificación IP66 impermeable resistente a lluvias torrenciales y sol" },
  { label: "Conectividad", value: "Wi-Fi 2.4GHz con antenas de alta ganancia + Puerto Ethernet RJ45" },
  { label: "Audio", value: "Bidireccional en tiempo real (Micrófono y altavoz de alta potencia)" },
  { label: "Almacenamiento", value: "Ranura MicroSD hasta 128GB / 256GB y respaldo opcional en la nube" },
  { label: "Control Móvil", value: "App gratuita para smartphone (iOS & Android) con notificaciones push" },
  { label: "Instalación", value: "Montaje versátil en pared, poste o techo (Opción con instalación +$20.99)" },
  { label: "Garantía", value: "100% Original con garantía directa de fábrica ATOMIC Ecuador" },
];

const FEATURES = [
  {
    icon: <Layers size={24} />,
    title: "Doble Lente (PIP - Picture in Picture)",
    tag: "2 CÁMARAS EN 1",
    desc: "Un lente fijo superior mantiene vigilancia constante de la panorámica completa del parque, calle o portón, mientras el lente domo inferior gira 355° y sigue automáticamente a intrusos sin perder la vista general.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30"
  },
  {
    icon: <Moon size={24} />,
    title: "Visión Nocturna Full Color 24/7",
    tag: "A TODO COLOR",
    desc: "Focos LED de alta luminosidad que iluminan la escena en oscuridad total para capturar colores exactos de prendas, vehículos y rostros, superando por completo las cámaras antiguas en blanco y negro.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/30"
  },
  {
    icon: <Droplets size={24} />,
    title: "Resistente al Agua y Lluvias (IP66)",
    tag: "INTEMPERIE TOTAL",
    desc: "Cuerpo sellado herméticamente para operar bajo lluvias torrenciales, humedad de la costa y el frío o polvo de la sierra ecuatoriana. Lentes con tratamiento antivaho y protección UV.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30"
  },
  {
    icon: <Bell size={24} />,
    title: "Detección de Movimiento y Sirena Activa",
    tag: "DISUASIÓN INMEDIATA",
    desc: "Inteligencia artificial que identifica siluetas humanas y activa automáticamente una sirena sonora y luces estroboscópicas disuasorias para espantar intrusos antes de que ingresen.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/30"
  },
  {
    icon: <Volume2 size={24} />,
    title: "Audio Bidireccional en Tiempo Real",
    tag: "HABLA Y ESCUCHA",
    desc: "Micrófono con cancelación de ruido ambiental y altavoz potente para dialogar con mensajeros, advertir a sospechosos o escuchar lo que ocurre en tu propiedad desde el celular.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30"
  },
  {
    icon: <Smartphone size={24} />,
    title: "Control Total desde tu Smartphone",
    tag: "APP GRATUITA",
    desc: "Monitorea la transmisión en vivo, recibe alertas instantáneas, comparte el acceso con tu familia o vecinos y revisa grabaciones históricas sin costos de suscripción mensual.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30"
  },
];

export default function AuroraProPage() {
  const [activeSpec, setActiveSpec] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#030612] text-white font-sans overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-200">

      {/* ── BACKGROUND GLOW EFFECTS ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-blue-700/20 via-indigo-600/10 to-transparent blur-[160px] pointer-events-none z-0" />
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* ── NAVBAR ── */}
      <nav className="relative z-20 w-full px-6 md:px-16 py-5 flex items-center justify-between border-b border-white/8 bg-[#030612]/90 backdrop-blur-xl">
        <Link
          href="/web"
          className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>ATOMIC STORE</span>
        </Link>
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-blue-400" />
          <span className="text-xs font-mono font-black text-white tracking-widest uppercase">
            CÁMARA DOBLE LENTE (PIP) // FULL COLOR
          </span>
        </div>
        <a
          href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Quiero%20comprar%20la%20Camara%20Doble%20Lente%20PIP%20Full-Color%20Exterior%20($63.77%20en%20combo%20o%20con%20instalacion)"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all hover:scale-105 shadow-md shadow-emerald-500/20"
        >
          💬 Consultar Promoción
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-14 flex flex-col lg:flex-row items-center gap-12">

        {/* Image Side with Poster */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-80 sm:w-[420px] aspect-square">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-cyan-500/20 blur-[60px]" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-900 via-[#0a0e1a] to-neutral-900 shadow-2xl shadow-blue-500/20 p-2 flex items-center justify-center">
              <img
                src="/images/hero-3d/slide-2.jpg"
                alt="Vigila tu Hogar Seguramente - Cámara Doble Lente PIP Full Color Wi-Fi ATOMIC"
                className="w-full h-full object-contain rounded-2xl drop-shadow-[0_10px_40px_rgba(59,130,246,0.3)]"
              />
              {/* Badge Overlay */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-blue-600/95 border border-blue-400/50 text-[10px] font-mono font-black text-white uppercase tracking-widest backdrop-blur-md shadow-lg flex items-center gap-1.5">
                <Sparkles size={12} className="animate-pulse" />
                <span>FULL COLOR WI-FI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5 text-left">
          
          {/* Brand & Category Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-[10px] font-mono font-black text-blue-300 uppercase tracking-widest">
              ATOMIC TECNOLOGÍA RESIDENCIAL
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              En Stock Bodega Nacional
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">
              Doble Lente (PIP)
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight uppercase tracking-tight">
            VIGILA TU HOGAR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              SEGURAMENTE
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
            <strong className="text-white">Protege parques, zonas residenciales y negocios</strong> con la cámara exterior más avanzada de monitoreo simultáneo en tiempo real.
          </p>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Dos cámaras en un solo dispositivo: supervisa el panorama general con su lente fijo gran angular y realiza seguimiento inteligente motorizado en 360° con su domo inferior sin puntos ciegos.
          </p>

          {/* Key Highlights from Flyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { icon: <Layers size={14} />, text: "Doble lente (PIP) simultáneo" },
              { icon: <Moon size={14} />, text: "Visión nocturna a todo color 24/7" },
              { icon: <Bell size={14} />, text: "Detección de movimiento IA" },
              { icon: <Droplets size={14} />, text: "Resistente al agua y clima IP66" },
            ].map(h => (
              <div key={h.text} className="flex items-center gap-2 text-xs font-bold text-neutral-200 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                <div className="text-cyan-400 shrink-0">{h.icon}</div>
                <span>{h.text}</span>
              </div>
            ))}
          </div>

          {/* Pricing Box (Matching Flyer: $63.77 from 3 units / +$20.99 installation) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 via-[#0a0e1a] to-slate-900 border border-blue-500/30 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-wider block">
                  OFERTA POR VOLUMEN // DESDE 3 UNIDADES
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-white font-heading">
                    $63,77 <span className="text-xs font-mono font-bold text-neutral-300">USD c/u</span>
                  </span>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-mono text-emerald-400 font-bold block">
                  +$20,99 con instalación
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Instalación profesional certificada
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-300 font-mono">
              <span>Unidad Individual: <strong className="text-white font-sans">$69.90 USD</strong></span>
              <span className="text-emerald-400 font-bold">✓ Envíos a todo Ecuador</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20adquirir%20la%20Camara%20Doble%20Lente%20PIP%20($63.77%20en%20combo%20de%203%20o%20con%20instalacion%20de%20$20.99).%20Por%20favor%20asesorarme."
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black uppercase tracking-wider text-sm transition-all hover:scale-102 shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              💬 Comprar por WhatsApp
            </a>
            <Link
              href="/web/camaras-hogar"
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-black uppercase tracking-wider text-sm transition-all"
            >
              Ver Catálogo
              <ChevronRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* ── EXPANDED FEATURES (INSPIRADO DIRECTAMENTE EN EL FLYER) ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full">
            TECNOLOGÍA RESIDENCIAL DE ALTA PRECISIÓN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-4 text-white">
            Seguridad Inteligente para <span className="text-cyan-400">Parques, Residencias y Negocios</span>
          </h2>
          <p className="text-sm text-neutral-300 max-w-2xl mx-auto mt-3 leading-relaxed">
            Diseñada especialmente para eliminar puntos ciegos, disuadir sospechosos antes de cualquier intrusión y operar sin interrupciones bajo sol y lluvia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className={`p-6 rounded-3xl ${f.bg} border backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 group flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 ${f.color}`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className={`text-base font-black mb-2.5 ${f.color}`}>{f.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING & INSTALLATION PACKAGES (FLYER EXPANDED) ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
            PLANES DE COMPRA & INSTALACIÓN
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-3">
            Elige la Modalidad Ideal para tu Proyecto
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="rounded-3xl bg-[#070b1a]/90 border border-white/10 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
            <div>
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider block mb-2">
                UNIDAD INDIVIDUAL
              </span>
              <h3 className="text-xl font-black text-white mb-2">1 Cámara Doble Lente</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Ideal para cubrir el ingreso peatonal o portón de tu vivienda particular.
              </p>
              <div className="text-3xl font-black text-white font-heading mb-4">
                $69,90 <span className="text-xs font-mono text-neutral-400">USD</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 mb-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Cámara Doble Lente PIP Full Color</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Accesorios de anclaje para pared</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> App móvil sin mensualidades</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Garantía oficial directa</li>
              </ul>
            </div>
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Quiero%20comprar%201%20Camara%20Doble%20Lente%20PIP%20a%20$69.90%20USD."
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors block"
            >
              Pedir 1 Unidad
            </a>
          </div>

          {/* Plan 2: PACK 3 UNIDADES (EL DESTACADO DEL FLYER) */}
          <div className="rounded-3xl bg-gradient-to-b from-blue-950/80 to-[#070b1a] border-2 border-cyan-400 p-6 flex flex-col justify-between relative shadow-2xl shadow-blue-500/20 scale-102">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-mono font-black uppercase tracking-widest shadow-md">
              MÁS POPULAR • AHORRO MAYORISTA
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-cyan-300 uppercase tracking-wider block mb-2 mt-1">
                PACK PARQUES & RESIDENCIAS
              </span>
              <h3 className="text-xl font-black text-white mb-2">Desde 3 Unidades</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Protección integral para urbanizaciones, perímetros comunales o negocios con múltiples accesos.
              </p>
              <div className="text-3xl font-black text-cyan-300 font-heading mb-4">
                $63,77 <span className="text-xs font-mono text-neutral-300">USD c/u</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-200 mb-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Precio mayorista preferencial desde 3 cámaras</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Cobertura perimetral completa sin puntos ciegos</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Visualización sincronizada de todas en tu teléfono</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Despacho sin recargo a todo el país</li>
              </ul>
            </div>
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20comprar%20el%20Pack%20de%203%20Camaras%20Doble%20Lente%20PIP%20a%20$63.77%20USD%20cada%20una."
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider text-center transition-all shadow-lg block"
            >
              Pedir Pack ($63.77 c/u)
            </a>
          </div>

          {/* Plan 3: SERVICIO CON INSTALACIÓN */}
          <div className="rounded-3xl bg-[#070b1a]/90 border border-white/10 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
            <div>
              <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wider block mb-2">
                SERVICIO TÉCNICO OFICIAL
              </span>
              <h3 className="text-xl font-black text-white mb-2">Con Instalación Incluida</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Técnicos certificados fijan el equipo, sellan conexiones y configuran la app en tus dispositivos.
              </p>
              <div className="text-3xl font-black text-emerald-400 font-heading mb-4">
                +$20,99 <span className="text-xs font-mono text-neutral-400">por cámara</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 mb-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Montaje seguro en muro, poste o cornisa</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Cableado y aislamiento impermeable hermético</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Enlace a tu red Wi-Fi y calibración de zonas</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Capacitación de uso para tu familia o personal</li>
              </ul>
            </div>
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20la%20Camara%20Doble%20Lente%20con%20servicio%20de%20instalacion%20incluida%20(+$20.99)."
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors block"
            >
              Pedir con Instalación
            </a>
          </div>
        </div>
      </section>

      {/* ── FULL SPECS TABLE ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-black text-neutral-400 uppercase tracking-widest">FICHA TÉCNICA VERIFICADA</span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">Especificaciones Técnicas Oficiales</h2>
        </div>
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#070b1a]/80 backdrop-blur-xl">
          {SPECS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 cursor-pointer transition-colors ${activeSpec === i ? 'bg-blue-500/10' : 'hover:bg-white/3'}`}
              onClick={() => setActiveSpec(activeSpec === i ? null : i)}
            >
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">{s.label}</span>
              <span className="text-sm font-black text-white text-right">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-950/80 via-[#070b1a] to-cyan-950/80 border border-blue-500/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(59,130,246,0.2)]">
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
            ¿Listo para Vigilar tu Hogar Seguramente?
          </h2>
          <p className="text-sm text-neutral-300 mb-8 max-w-md mx-auto leading-relaxed">
            Protege parques, zonas residenciales y locales comerciales con la cámara exterior doble lente más completa de Ecuador. Doble cobertura, visión nocturna a color y disuasión activa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Quiero%20solicitar%20la%20Camara%20Doble%20Lente%20PIP%20Full%20Color%20Exterior%20($63.77%20en%20combo%20o%20con%20instalacion)."
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black uppercase tracking-wider text-sm transition-all hover:scale-105 shadow-xl shadow-emerald-500/30"
            >
              💬 Cotizar por WhatsApp
            </a>
            <Link
              href="/web/camaras-hogar"
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-wider text-sm transition-all"
            >
              Explorar Showroom de Cámaras
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 max-w-4xl mx-auto px-6 pb-12 pt-6 border-t border-white/8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Shield size={14} className="text-cyan-400" />
          <span className="text-xs font-mono text-neutral-400">Producto 100% Original con Garantía Directa · ATOMIC INDUSTRIAS · Ecuador</span>
        </div>
        <div className="flex items-center justify-center gap-6 text-[10px] font-mono text-neutral-500 mt-2">
          <Link href="/senseface-2a" className="hover:text-neutral-300 transition-colors">
            🔐 ZKTeco SenseFace 2A
          </Link>
          <Link href="/h6c" className="hover:text-neutral-300 transition-colors">
            📹 EZVIZ H6c 2K IA
          </Link>
          <Link href="/web/camaras-hogar" className="hover:text-neutral-300 transition-colors">
            🎥 Showroom de Videovigilancia
          </Link>
        </div>
      </footer>

    </main>
  );
}
