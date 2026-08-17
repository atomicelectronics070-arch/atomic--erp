"use client";

// Landing Page Dedicada — EZVIZ H6c (Cámara de Seguridad PT 360° Wi-Fi Smart)

import React from "react";
import { 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  Video, 
  Eye, 
  Volume2, 
  Wifi, 
  Sparkles,
  Smartphone,
  Moon
} from "lucide-react";
import Link from "next/link";

export default function EzvizH6cLanding() {
  return (
    <main className="min-h-screen bg-[#040714] text-white flex flex-col relative selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* ── BACKGROUND LIGHT GLOWS ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[550px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[160px] pointer-events-none z-0" />
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="relative z-30 w-full px-6 md:px-16 py-6 flex justify-between items-center border-b border-white/10 bg-[#040714]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-blue-500/30">
              <div className="w-full h-full bg-[#070b16] rounded-[15px] flex items-center justify-center font-black text-blue-400 text-base">
                ⚛
              </div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">
              ATOMIC <span className="text-blue-400 text-xs tracking-widest font-mono">SECURITY</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold tracking-wider uppercase font-mono">
          <Link 
            href="/web" 
            className="text-neutral-300 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
          >
            <span>Ver Catálogo</span>
          </Link>
          <a
            href="https://wa.me/593969043453?text=Hola!%20Deseo%20cotizar%20la%20C%C3%A1mara%20EZVIZ%20H6c."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <MessageCircle size={15} />
            <span>Cotizar WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Info */}
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 mb-6 backdrop-blur-md">
            <Sparkles size={15} className="text-blue-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              Cámara de Seguridad Smart Wi-Fi 360°
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight uppercase mb-6">
            EZVIZ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.35)]">
              H6c 2K / 4MP
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8">
            Cámara de vigilancia inteligente con <strong className="text-white">cobertura panorámica 360°, detección humana con seguimiento automático y audio bidireccional</strong>. Monitorea tu hogar u oficina en tiempo real desde tu smartphone.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-8 font-mono text-xs text-neutral-300">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
              <Eye className="text-blue-400 shrink-0" size={18} />
              <span>Visión Panorámica PT 360°</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
              <Video className="text-emerald-400 shrink-0" size={18} />
              <span>Resolución 2K HD / 4MP</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
              <Volume2 className="text-amber-400 shrink-0" size={18} />
              <span>Audio Bidireccional</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
              <Moon className="text-purple-400 shrink-0" size={18} />
              <span>Visión Nocturna Infrarroja</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
            <a
              href="https://wa.me/593969043453?text=Hola!%20Deseo%20adquirir%20la%20C%C3%A1mara%20EZVIZ%20H6c."
              target="_blank"
              rel="noreferrer"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black tracking-wider uppercase text-sm shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center gap-3 border border-blue-300/30"
            >
              <span>SOLICITAR COTIZACIÓN WHATSAPP</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Product Card Visual */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-[450px] aspect-square rounded-3xl bg-gradient-to-br from-blue-950/60 via-[#080d1f] to-indigo-950/60 border border-blue-500/30 backdrop-blur-2xl p-8 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.3)]">
            <div className="w-44 h-44 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse">
              <Video size={80} />
            </div>

            <div className="text-center">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 mb-2 inline-block">
                ● DISPONIBLE EN STOCK ECUADOR
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">EZVIZ H6c</h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">Cámara de Seguridad PT 360° Wi-Fi</p>
            </div>
          </div>
        </div>

      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 text-center text-xs font-mono text-neutral-400">
        <p>© {new Date().getFullYear()} ATOMIC Security — Distribuidor Oficial EZVIZ Ecuador</p>
      </footer>

    </main>
  );
}
