"use client";

// Atomic Industrias — Landing Page v15.0 — 3D Globe Hero Background (Originkit Presence01)

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
      
      {/* ═══════════ 3D GLOBE & ATMOSPHERE BACKGROUND (BEHIND EVERYTHING) ═══════════ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[850px] h-[650px] pointer-events-none z-0 overflow-hidden">
        
        {/* Radial Blue Light Beam behind Globe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />

        {/* Orbit Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-125">
          <OrbitControls />
        </div>

        {/* 3D WebGL Dotted Globe */}
        <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[650px] opacity-85">
          <Globe
            direction="right"
            speed={1.2}
            interactive
            oceanColor="#030712"
          />
        </div>

        {/* Smooth bottom fade to dark */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#030712]/70 to-[#030712]" />
      </div>

      {/* ═══════════ NAVIGATION BAR ═══════════ */}
      <nav className="relative z-30 w-full px-6 md:px-16 py-6 flex justify-between items-center border-b border-white/10 bg-[#030712]/60 backdrop-blur-md">
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
            className="text-white hover:text-blue-400 transition-colors flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/25 border border-blue-500/40 hover:bg-blue-600/40 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            <ShoppingBag size={15} />
            <span>Tienda en Línea</span>
          </Link>
          <Link 
            href="/login" 
            className="text-neutral-300 hover:text-white transition-colors flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30 font-bold"
          >
            <LogIn size={15} />
            <span>INICIAR SESIÓN</span>
          </Link>
        </div>
      </nav>

      {/* ═══════════ HERO CONTENT (OVERLAY ON TOP OF GLOBE) ═══════════ */}
      <section className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-16 max-w-6xl mx-auto w-full pt-16 pb-20">
        
        {/* Tag Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-950/60 border border-blue-500/40 px-5 py-2.5 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md mb-8">
          <GlobeIcon size={16} className="text-blue-400 animate-spin-slow" />
          <span>Presencia Global & Distribución Nacional</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-6 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
          ATOMIC <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-[0_0_40px_rgba(59,130,246,0.4)]">
            INDUSTRIAS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl font-medium leading-relaxed text-neutral-200 text-base sm:text-xl mb-10 drop-shadow-md">
          Ecosistema empresarial de nueva generación y tienda oficial en línea. 
          Tecnología de vanguardia, equipamiento industrial y logística de alta precisión para todo Ecuador.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-xl justify-center">
          <Link
            href="/web"
            className="group relative px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black tracking-wider uppercase text-sm shadow-[0_0_45px_rgba(37,99,235,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 border border-blue-300/40"
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

        {/* Metrics Grid */}
        <ul className="mt-16 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10">
          {METRICS.map((metric) => (
            <li
              key={metric.value}
              className="flex flex-col items-center gap-2 p-6 rounded-3xl bg-[#070b18]/80 border border-white/10 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] text-center"
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

      </section>
    </main>
  );
}
