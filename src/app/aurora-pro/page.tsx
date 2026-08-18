"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wifi,
  Moon,
  Shield,
  Smartphone,
  Mic,
  Eye,
  Zap,
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  Volume2,
  Camera,
  Bell,
  Lock
} from "lucide-react";

const SPECS = [
  { label: "Resolución", value: "2MP / 1080p Full HD" },
  { label: "Ángulo de visión", value: "360° Pan & Tilt" },
  { label: "Visión nocturna", value: "Full Color a todo color 30m" },
  { label: "Conectividad", value: "Wi-Fi 2.4GHz" },
  { label: "Audio", value: "Bidireccional Integrado" },
  { label: "Alertas", value: "Luces Rojo-Azul + Sirena" },
  { label: "Compresión", value: "H.265 / H.264" },
  { label: "Resistencia", value: "IP67 Exterior" },
  { label: "Almacenamiento", value: "Micro SD hasta 256GB / Nube" },
  { label: "Compatible", value: "IMOU Life App (iOS & Android)" },
  { label: "Instalación", value: "Fácil montaje sin cables" },
  { label: "Energía", value: "Cable de corriente AC" },
];

const FEATURES = [
  {
    icon: <Moon size={24} />,
    title: "Visión Nocturna Full Color",
    desc: "Tecnología de sensor avanzado que captura imágenes a todo color incluso en oscuridad total, sin filtro infrarrojo.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/30"
  },
  {
    icon: <Volume2 size={24} />,
    title: "Audio Bidireccional",
    desc: "Habla y escucha en tiempo real desde tu celular. Micrófono y altavoz integrados de alta fidelidad.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30"
  },
  {
    icon: <Bell size={24} />,
    title: "Alertas Inteligentes con Luces",
    desc: "Detecta movimiento y activa sirena + luces rojo-azul disuasorias automáticamente para alejar intrusos.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/30"
  },
  {
    icon: <Smartphone size={24} />,
    title: "Control desde tu Celular",
    desc: "App IMOU Life gratuita para iOS y Android. Ve tu cámara en vivo, graba clips y ajusta la configuración desde cualquier lugar.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30"
  },
  {
    icon: <Eye size={24} />,
    title: "IA de Detección Inteligente",
    desc: "Distingue personas, vehículos y animales. Solo te notifica lo que importa — sin falsas alarmas.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30"
  },
  {
    icon: <Wifi size={24} />,
    title: "Conexión Wi-Fi 100% Inalámbrica",
    desc: "Instalación sencilla sin cableado complicado. Solo conecta a corriente y escanea el código QR con la app.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30"
  },
];

export default function AuroraProPage() {
  const [activeSpec, setActiveSpec] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#030612] text-white font-sans overflow-x-hidden">

      {/* ── BACKGROUND EFFECTS ── */}
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
          <span className="text-xs font-mono font-black text-white tracking-widest uppercase">IMOU Aurora Pro</span>
        </div>
        <a
          href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Quiero%20informacion%20sobre%20la%20IMOU%20Aurora%20Pro"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all hover:scale-105"
        >
          💬 Consultar Precio
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-14 pb-10 flex flex-col lg:flex-row items-center gap-12">

        {/* Image Side */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-cyan-500/20 blur-[60px]" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-900 via-[#0a0e1a] to-neutral-900 shadow-2xl shadow-blue-500/20 flex items-center justify-center p-8">
              <img
                src="/images/hero-3d/slide-2.jpg"
                alt="IMOU Aurora Pro Full-Color Wi-Fi Camera"
                className="w-full h-full object-contain drop-shadow-[0_10px_40px_rgba(59,130,246,0.4)]"
              />
              {/* Badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-blue-600/90 border border-blue-400/40 text-[10px] font-mono font-black text-white uppercase tracking-widest backdrop-blur-md shadow-lg">
                Full Color Wi-Fi
              </div>
            </div>
          </div>
        </div>

        {/* Info Side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          
          {/* Brand Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-black text-neutral-300 uppercase tracking-widest">IMOU</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              En Stock
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono font-black text-blue-400 uppercase tracking-widest">Audio Bidireccional</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight uppercase tracking-tight">
            IMOU{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              AURORA PRO
            </span>
          </h1>

          <p className="text-base text-neutral-300 leading-relaxed">
            Cámara de seguridad exterior <strong className="text-white">Full-Color Wi-Fi</strong> con <strong className="text-white">audio bidireccional</strong>, visión nocturna a todo color, alertas con luces rojo-azul y control total desde tu smartphone.
          </p>

          {/* Key Highlights */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Volume2 size={14} />, text: "Audio Bidireccional" },
              { icon: <Moon size={14} />, text: "Nocturna Full Color" },
              { icon: <Bell size={14} />, text: "Alertas Inteligentes" },
              { icon: <Smartphone size={14} />, text: "App Gratuita" },
            ].map(h => (
              <div key={h.text} className="flex items-center gap-2 text-xs font-bold text-neutral-200">
                <div className="text-blue-400 shrink-0">{h.icon}</div>
                <span>{h.text}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 pt-2">
            <span className="text-4xl font-black text-white">$110</span>
            <span className="text-sm font-mono text-neutral-400 pb-1">Precio referencial</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Quiero%20comprar%20la%20IMOU%20Aurora%20Pro%20Full-Color%20Wi-Fi"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black uppercase tracking-wider text-sm transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              💬 Comprar por WhatsApp
            </a>
            <Link
              href="/web"
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-black uppercase tracking-wider text-sm transition-all"
            >
              Ver Catálogo
              <ChevronRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
            Características Principales
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight mt-4 text-white">
            Seguridad Inteligente de <span className="text-blue-400">Última Generación</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className={`p-6 rounded-3xl ${f.bg} border backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 group`}>
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${f.color} mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className={`text-base font-black mb-2 ${f.color}`}>{f.title}</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FULL SPECS ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Especificaciones Técnicas</h2>
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
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-950/80 via-[#070b1a] to-indigo-950/80 border border-blue-500/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(59,130,246,0.2)]">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
            ¿Listo para Proteger tu Hogar?
          </h2>
          <p className="text-sm text-neutral-300 mb-8 max-w-md mx-auto leading-relaxed">
            La IMOU Aurora Pro es la cámara exterior más completa del mercado a su precio. Audio bidireccional, full color y control desde tu celular.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Me%20interesa%20la%20IMOU%20Aurora%20Pro"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black uppercase tracking-wider text-sm transition-all hover:scale-105 shadow-xl shadow-emerald-500/30"
            >
              💬 Consultar Disponibilidad
            </a>
            <Link
              href="/web"
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-wider text-sm transition-all"
            >
              Ver Más Cámaras en ATOMIC
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 max-w-4xl mx-auto px-6 pb-12 pt-6 border-t border-white/8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Shield size={14} className="text-blue-400" />
          <span className="text-xs font-mono text-neutral-400">Producto 100% Original con Garantía · ATOMIC INDUSTRIAS · Ecuador</span>
        </div>
        <div className="flex items-center justify-center gap-6 text-[10px] font-mono text-neutral-600 mt-2">
          {["🔐 ZKTeco SenseFace 2A", "📹 EZVIZ H6c PT 2K"].map((p, i) => (
            <Link key={i} href={i === 0 ? "/senseface-2a" : "/h6c"} className="hover:text-neutral-300 transition-colors">
              {p}
            </Link>
          ))}
        </div>
      </footer>

    </main>
  );
}
