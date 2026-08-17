"use client"
// Atomic Industrias — Landing Page v12.0 — Originkit Features-02 Background & Ultra-Modern Aesthetic (3D + Framer Motion)

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LogIn, ShoppingBag, ArrowRight, ShieldCheck, Truck, Zap, MessageCircle, Cpu, Layers, Sparkles, Database, Code, Globe } from "lucide-react"
import Atom3D from "@/components/ui/Atom3D"
import Link from "next/link"

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "web" })
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col relative selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* ═══════════ ORIGINKIT FEATURES-02 BACKGROUND GRID & BEAM GLOWS ═══════════ */}
      
      {/* 1. Radial Beam Glow at top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.3),rgba(99,102,241,0.15),transparent_100%)] pointer-events-none z-0" />

      {/* 2. Originkit High-Tech Grid Mesh with Radial Mask */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_15%,#000_60%,transparent_100%)] pointer-events-none z-0" 
      />

      {/* 3. 3D Atom Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        {mounted && <Atom3D />}
      </div>

      {/* 4. Secondary Ambient Orbs */}
      <div className="fixed top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-1/4 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* ═══════════ NAVIGATION BAR ═══════════ */}
      <nav className="relative z-20 w-full px-6 md:px-16 py-6 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-[#030712]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-blue-500/25">
            <div className="w-full h-full bg-[#070b14] rounded-[15px] flex items-center justify-center font-black text-blue-400 text-base">
              ⚛
            </div>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            ATOMIC <span className="text-blue-400 text-xs tracking-widest font-mono">ECUADOR</span>
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase font-mono">
          <Link href="/web" className="text-blue-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/50">
            <ShoppingBag size={14} />
            <span>Tienda en Línea</span>
          </Link>
          <Link href="/login" className="text-neutral-400 hover:text-white transition-colors hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20">
            <LogIn size={14} />
            <span>Portal ERP</span>
          </Link>
        </div>
      </nav>

      {/* ═══════════ HERO CONTENT ═══════════ */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 max-w-[1400px] mx-auto w-full pt-12 pb-16">
        
        <div className="max-w-4xl pt-8">
          
          {/* Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 text-blue-400 mb-8 backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
              Originkit Tech Architecture • El Futuro de la Industria & Comercio
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[11vw] md:text-[7.5vw] font-black leading-[0.88] tracking-tighter uppercase mb-6"
          >
            ATOMIC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400/80 drop-shadow-[0_0_35px_rgba(59,130,246,0.3)]">
              INDUSTRIAS
            </span>
          </motion.h1>

          {/* Subtitle Spanish */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg md:text-xl font-medium text-neutral-300 max-w-2xl mb-12 leading-relaxed"
          >
            Ecosistema empresarial de nueva generación y tienda oficial en línea. 
            Tecnología de vanguardia, equipamiento industrial y logística de alta precisión para todo Ecuador.
          </motion.p>
        </div>

        {/* ═══════════ ACTION BUTTONS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 mt-2"
        >
          {/* Primary CTA button */}
          <Link
            href="/web"
            className="group relative px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black tracking-wider uppercase text-sm shadow-[0_0_45px_rgba(37,99,235,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 border border-blue-400/40"
          >
            <span>INGRESAR A LA TIENDA Y CATÁLOGO</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          {/* Secondary CTA button */}
          <Link
            href="/login"
            className="px-8 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-bold tracking-wider uppercase text-sm backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3 hover:border-white/25"
          >
            <LogIn size={16} />
            <span>PORTAL CLIENTES & ERP</span>
          </Link>

          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold tracking-wider uppercase text-xs backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            <span>ASESORÍA WHATSAPP</span>
          </a>
        </motion.div>

        {/* ═══════════ ORIGINKIT FEATURES-02 TECH GRID CARDS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-10 border-t border-white/10"
        >
          {/* Card 1 */}
          <div className="group relative p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-blue-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Truck size={22} />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-wider mb-2">Envíos a Todo Ecuador</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Cobertura logística nacional directa con despacho urgente asegurado.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-wider mb-2">Garantía Directa</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Equipamiento 100% original con respaldo técnico de fábrica y soporte oficial.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-indigo-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap size={22} />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-wider mb-2">Atención Inmediata</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Cotización automatizada con asesoría humana y respuesta en tiempo real.
            </p>
          </div>
        </motion.div>

      </main>
      
    </div>
  )
}
