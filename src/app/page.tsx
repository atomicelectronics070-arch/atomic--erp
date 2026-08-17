"use client";

// Atomic Industrias — Landing Page v14.0 — Originkit Presence01 Interactive 3D Dotted Globe

import React from "react";
import Globe from "@/components/originkit/ui/globe";
import OrbitControls from "@/components/originkit/ui/orbit-controls";
import { LogIn, ShoppingBag, ArrowRight, MessageCircle, Globe as GlobeIcon, ShieldCheck, Truck, Zap } from "lucide-react";
import Link from "next/link";

const METRICS = [
  { value: "100%", label: "Cobertura Logística Nacional Directa" },
  { value: "50%", label: "Entregas & Cotización Más Rápidas" },
  { value: "98%+", label: "Satisfacción en Productos Originales" },
] as const;

export default function Presence01() {
  return (
    <main className="min-h-screen bg-[#030712] text-white flex flex-col relative selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* ═══════════ NAVIGATION BAR ═══════════ */}
      <nav className="relative z-30 w-full px-6 md:px-16 py-6 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-[#030712]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-[#070b16] rounded-[15px] flex items-center justify-center font-black text-blue-400 text-base">
              ⚛
            </div>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            ATOMIC <span className="text-blue-400 text-xs tracking-widest font-mono">ECUADOR</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold tracking-wider uppercase font-mono">
          <Link 
            href="/web" 
            className="text-white hover:text-blue-400 transition-colors flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(37,99,235,0.25)]"
          >
            <ShoppingBag size={15} />
            <span>Tienda en Línea</span>
          </Link>
          <Link 
            href="/login" 
            className="text-neutral-300 hover:text-white transition-colors hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20"
          >
            <LogIn size={15} />
            <span>Portal ERP</span>
          </Link>
        </div>
      </nav>

      {/* ═══════════ ORIGINKIT PRESENCE01 3D GLOBE HERO ═══════════ */}
      <section
        aria-labelledby="global-presence-heading"
        className="relative mx-auto flex w-full max-w-7xl flex-col items-center pt-8 pb-16 px-4 sm:px-6 z-10"
      >
        {/* Globe Container */}
        <div className="relative h-[380px] sm:h-[480px] w-full shrink-0 overflow-visible flex items-center justify-center">
          
          {/* Ambient Glow Mask behind Globe */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.25),transparent_70%)]" />
            <OrbitControls />
          </div>

          {/* Interactive 3D Dotted WebGL Globe */}
          <div className="pointer-events-auto relative z-10 w-full max-w-[460px]">
            <Globe
              direction="right"
              speed={1.2}
              interactive
              oceanColor="#030712"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#030712]" />
        </div>

        {/* Content Header */}
        <div className="relative z-20 flex w-full flex-col items-center pt-4 text-center">
          <header className="flex w-full max-w-3xl flex-col items-center gap-4 px-2 text-center -mt-6">
            
            {/* Tag Badge */}
            <p className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.2)]">
              <GlobeIcon size={15} className="text-blue-400 animate-spin-slow" />
              Presencia Global & Distribución Nacional
            </p>

            <div className="flex flex-col items-center gap-4 mt-2">
              <h1
                id="global-presence-heading"
                className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight text-white uppercase"
              >
                ATOMIC <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.3)]">
                  INDUSTRIAS
                </span>
              </h1>

              <p className="max-w-2xl font-medium leading-relaxed text-neutral-300 text-base sm:text-lg">
                Impulsando la tecnología empresarial, equipamiento industrial y comercio electrónico de alta precisión para todo el Ecuador.
              </p>
            </div>
          </header>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8 w-full max-w-xl justify-center px-4">
            <Link
              href="/web"
              className="group relative px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black tracking-wider uppercase text-sm shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 border border-blue-300/30"
            >
              <span>INGRESAR A LA TIENDA Y CATÁLOGO</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold tracking-wider uppercase text-xs backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} />
              <span>ASESORÍA WHATSAPP</span>
            </a>
          </div>

          {/* Metrics Grid from Originkit */}
          <ul className="mt-14 mb-8 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10">
            {METRICS.map((metric, index) => (
              <li
                key={metric.value}
                className="relative flex flex-col items-center gap-3 p-6 rounded-3xl bg-[#080d1e]/80 border border-white/10 hover:border-blue-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] text-center"
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-4xl sm:text-5xl font-black tracking-tight text-transparent">
                  {metric.value}
                </span>
                <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider">
                  {metric.label}
                </span>
              </li>
            ))}
          </ul>

        </div>
      </section>
    </main>
  );
}
