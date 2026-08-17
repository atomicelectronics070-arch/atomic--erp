"use client"
// Atomic Industrias — Landing Page v11.0 — High-Converting Spanish Ultra-Modern Aesthetic (3D + Framer Motion)

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LogIn, ShoppingBag, ArrowRight, ShieldCheck, Truck, Zap, MessageCircle } from "lucide-react"
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
    <div className="min-h-screen bg-[#040407] text-white flex flex-col relative selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* ── BACKGROUND 3D CANVAS & GLOWS ── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        {mounted && <Atom3D />}
      </div>
      
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── GRAIN OVERLAY ── */}
      <div 
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} 
      />

      {/* ── NAVIGATION BAR ── */}
      <nav className="relative z-20 w-full px-6 md:px-16 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md bg-black/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center font-black text-blue-400 text-sm">
              ⚛
            </div>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            ATOMIC <span className="text-blue-500 text-xs tracking-widest font-mono">ECUADOR</span>
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase font-mono">
          <Link href="/web" className="text-blue-400 hover:text-white transition-colors flex items-center gap-2">
            <ShoppingBag size={14} />
            <span>Tienda en Línea</span>
          </Link>
          <Link href="/login" className="text-neutral-400 hover:text-white transition-colors hidden sm:flex items-center gap-2">
            <LogIn size={14} />
            <span>Portal ERP</span>
          </Link>
        </div>
      </nav>

      {/* ── HERO CONTENT ── */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 max-w-[1400px] mx-auto w-full pt-12 pb-16">
        
        <div className="max-w-4xl pt-8">
          
          {/* Tag Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
              El Futuro de la Tecnología & Comercio Electrónico
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[11vw] md:text-[7.5vw] font-black leading-[0.9] tracking-tighter uppercase mb-6"
          >
            ATOMIC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-blue-400/60">
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

        {/* ── ACTION BUTTONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 mt-4"
        >
          {/* Primary CTA button */}
          <Link
            href="/web"
            className="group relative px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black tracking-wider uppercase text-sm shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
          >
            <span>INGRESAR A LA TIENDA Y CATÁLOGO</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          {/* Secondary CTA button */}
          <Link
            href="/login"
            className="px-8 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-bold tracking-wider uppercase text-sm backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3"
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

        {/* ── HIGHLIGHT BADGES ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-white/10 text-xs font-mono text-neutral-400"
        >
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Truck className="text-blue-400 shrink-0" size={18} />
            <div>
              <p className="font-bold text-white uppercase">Envíos a Todo Ecuador</p>
              <p className="text-[10px] text-neutral-500">Entrega rápida y asegurada</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
            <div>
              <p className="font-bold text-white uppercase">Garantía Directa</p>
              <p className="text-[10px] text-neutral-500">Productos 100% Originales</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Zap className="text-amber-400 shrink-0" size={18} />
            <div>
              <p className="font-bold text-white uppercase">Atención Inmediata</p>
              <p className="text-[10px] text-neutral-500">Soporte y cotización al instante</p>
            </div>
          </div>
        </motion.div>

      </main>
      
    </div>
  )
}
