"use client";

// Landing Page Dedicada — EZVIZ H6c 2K / 4MP (Cámara de Seguridad PT 360° Wi-Fi Smart)

import React, { useState } from "react";
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
  Moon,
  Shield,
  BellRing
} from "lucide-react";
import Link from "next/link";

export default function EzvizH6cLanding() {
  const [imgSrc, setImgSrc] = useState("/images/camaras/camara-ezviz-h6c-3mp-basica-44.jpg");

  return (
    <main className="min-h-screen bg-[#FAFAFC] text-slate-900 flex flex-col relative selection:bg-blue-500/20 selection:text-blue-900 font-sans overflow-x-hidden">
      
      {/* ── BACKGROUND LIGHT GLOWS ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[550px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-[160px] pointer-events-none z-0" />
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="relative z-30 w-full px-6 md:px-16 py-5 flex justify-between items-center border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-[1px] shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center font-black text-blue-600 text-base">
                ⚛
              </div>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-950 uppercase">
              ATOMIC <span className="text-blue-600 text-xs tracking-widest font-mono">SECURITY</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold tracking-wider uppercase font-mono">
          <Link 
            href="/web" 
            className="text-slate-700 hover:text-black transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200"
          >
            <span>Ver Catálogo</span>
          </Link>
          <a
            href="https://wa.me/593969043453?text=Hola!%20Deseo%20cotizar%20la%20C%C3%A1mara%20EZVIZ%20H6c%202K%204MP."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
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
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 mb-6 shadow-sm">
            <Sparkles size={15} className="text-blue-600 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              Cámara de Seguridad Smart Wi-Fi 360° 2K
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight uppercase mb-6 text-slate-950">
            EZVIZ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600">
              H6c 2K / 4MP
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
            Cámara de vigilancia inteligente con <strong className="text-slate-900">resolución 4MP Ultra-Nítida, cobertura panorámica 360°, detección inteligente de personas con seguimiento automático y audio bidireccional</strong>. Monitorea tu hogar, negocio o bodega en tiempo real desde tu smartphone con la app EZVIZ.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-8 font-mono text-xs text-slate-700">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
              <Eye className="text-blue-600 shrink-0" size={18} />
              <span>Visión Panorámica PT 360°</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
              <Video className="text-emerald-600 shrink-0" size={18} />
              <span>Resolución 2K (2560x1440) 4MP</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
              <Volume2 className="text-amber-600 shrink-0" size={18} />
              <span>Audio Bidireccional (Habla & Escucha)</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
              <Moon className="text-purple-600 shrink-0" size={18} />
              <span>Visión Nocturna IR 10 Metros</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
            <a
              href="https://wa.me/593969043453?text=Hola!%20Deseo%20adquirir%20la%20C%C3%A1mara%20EZVIZ%20H6c%202K%204MP%20con%20instalaci%C3%B3n."
              target="_blank"
              rel="noreferrer"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black tracking-wider uppercase text-sm shadow-xl shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>SOLICITAR COTIZACIÓN E INSTALACIÓN</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Product Card Visual */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-[480px] rounded-3xl bg-white border border-slate-200 p-8 flex flex-col items-center justify-center shadow-2xl shadow-blue-500/10">
            
            {/* Foto Real de Producto */}
            <div className="relative w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden mb-6 flex items-center justify-center group">
              <img 
                src={imgSrc} 
                alt="EZVIZ H6c 2K 4MP"
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[10px] font-mono font-bold text-blue-700 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>EZVIZ ORIGINAL</span>
              </div>
            </div>

            <div className="text-center w-full">
              <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2 inline-block">
                ● DISPONIBLE EN STOCK QUITO & GUAYAQUIL
              </span>
              <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">EZVIZ H6c 2K (4MP)</h3>
              <p className="text-xs font-mono text-slate-500 mt-1">Cámara Panorámica Wi-Fi con Detección de Movimiento IA</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Garantía Directa</span>
                <span className="text-sm font-black font-heading text-blue-600">2 Años de Garantía</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── TECHNICAL FEATURES ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-slate-200 w-full">
        <h2 className="text-3xl font-black uppercase text-center tracking-tight mb-12 text-slate-950">
          Especificaciones Técnicas Principales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
            <Eye className="text-blue-600 mb-4" size={28} />
            <h3 className="text-lg font-black uppercase text-slate-950 mb-2">Cobertura Visual de 360°</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-mono">
              Rotación horizontal de 340° y vertical de 55° para eliminar cualquier punto ciego en la habitación o local.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
            <BellRing className="text-emerald-600 mb-4" size={28} />
            <h3 className="text-lg font-black uppercase text-slate-950 mb-2">Seguimiento Inteligente</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-mono">
              Al detectar a una persona en movimiento, la cámara bloquea automáticamente el objetivo y gira para seguir su trayectoria.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
            <Shield className="text-indigo-600 mb-4" size={28} />
            <h3 className="text-lg font-black uppercase text-slate-950 mb-2">Privacidad & Almacenamiento</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-mono">
              Modo de suspensión de lente con un toque en la app para privacidad total. Soporta tarjeta MicroSD de hasta 256GB o nube EZVIZ CloudPlay.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="relative z-10 border-t border-slate-200 py-12 px-6 text-center text-xs font-mono text-slate-500 bg-white">
        <p>© {new Date().getFullYear()} ATOMIC Security — Distribuidor Oficial EZVIZ Ecuador</p>
      </footer>

    </main>
  );
}
