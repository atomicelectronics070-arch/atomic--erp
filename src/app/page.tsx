"use client"
// Atomic Industrias — Landing Page v8.0 — Minimal Monochrome

import { useEffect } from "react"
import { motion } from "framer-motion"
import { LogIn, ShoppingBag } from "lucide-react"

export default function Home() {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "web" })
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-black/10">

      {/* Subtle background texture */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(0,0,0,0.03) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(0,0,0,0.03) 0%, transparent 50%)`
          }}
        />
        {/* Thin grid lines */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                             linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: `80px 80px`
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-2xl">

        {/* ── ATOM LOGO ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <AtomLogo />
        </motion.div>

        {/* ── BRAND NAME ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-2"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-black leading-none">
            ATOMIC INDUSTRIAS
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs font-bold tracking-[0.4em] uppercase text-zinc-400 mb-16"
        >
          Sistema de Gestión Empresarial
        </motion.p>

        {/* ── TWO ACTION CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
        >
          {/* Card: Iniciar Sesión */}
          <a
            href="/login"
            id="cta-login"
            className="group relative flex flex-col items-center justify-center gap-4 bg-black text-white rounded-2xl p-10 border border-black
                       hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/20
                       active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Hover shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)'
              }}
            />
            <div className="relative z-10 w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center
                            group-hover:scale-110 group-hover:bg-white/15 transition-all duration-300">
              <LogIn size={24} className="text-white" />
            </div>
            <div className="relative z-10 text-center">
              <p className="text-base font-black uppercase tracking-[0.2em] text-white">Iniciar Sesión</p>
              <p className="text-[10px] font-medium text-white/50 mt-1 tracking-widest uppercase">Portal privado</p>
            </div>
          </a>

          {/* Card: Tienda en Línea */}
          <a
            href="/web"
            id="cta-tienda"
            className="group relative flex flex-col items-center justify-center gap-4 bg-white text-black rounded-2xl p-10 border border-zinc-200
                       hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/10 hover:border-black
                       active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Hover fill */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
            <div className="relative z-10 w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center
                            group-hover:scale-110 group-hover:bg-black group-hover:border-black transition-all duration-300">
              <ShoppingBag size={24} className="text-black group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="relative z-10 text-center">
              <p className="text-base font-black uppercase tracking-[0.2em] text-black">Tienda en Línea</p>
              <p className="text-[10px] font-medium text-zinc-400 mt-1 tracking-widest uppercase">Catálogo público</p>
            </div>
          </a>
        </motion.div>

        {/* ── LIVE INDICATOR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em]">Sistemas operativos</span>
        </motion.div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 py-6 flex justify-center">
        <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.4em]">
          © {new Date().getFullYear()} Atomic Industrias — Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}

// ── SVG Atom Logo (B&W minimal) ──
function AtomLogo() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      {/* Nucleus */}
      <circle cx="36" cy="36" r="5" fill="#000" />

      {/* Orbit 1 — horizontal */}
      <ellipse
        cx="36" cy="36"
        rx="30" ry="10"
        stroke="#000" strokeWidth="1.5"
        fill="none"
      />

      {/* Orbit 2 — rotated 60° */}
      <ellipse
        cx="36" cy="36"
        rx="30" ry="10"
        stroke="#000" strokeWidth="1.5"
        fill="none"
        transform="rotate(60 36 36)"
      />

      {/* Orbit 3 — rotated 120° */}
      <ellipse
        cx="36" cy="36"
        rx="30" ry="10"
        stroke="#000" strokeWidth="1.5"
        fill="none"
        transform="rotate(120 36 36)"
      />

      {/* Electron dots */}
      <circle cx="66" cy="36" r="2.5" fill="#000" />
      <circle cx="21" cy="10.5" r="2.5" fill="#000" />
      <circle cx="21" cy="61.5" r="2.5" fill="#000" />
    </svg>
  )
}
