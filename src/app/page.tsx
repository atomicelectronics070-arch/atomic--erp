"use client"
// Atomic Industrias — Landing Page v9.0 — Framer Premium Dark

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
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#0055fe]/20">

      {/* Subtle background texture */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(0,85,254,0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 50%)`
          }}
        />
        {/* Thin grid lines for high-end tech feel */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                             linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: `80px 80px`
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-3xl">

        {/* ── ATOM LOGO ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10"
        >
          <AtomLogo />
        </motion.div>

        {/* ── BRAND NAME ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-3"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-white leading-none">
            ATOMIC <span className="text-[#0055fe]">INDUSTRIAS</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm font-semibold tracking-[0.2em] uppercase text-white/50 mb-16"
        >
          Sistema de Gestión Empresarial
        </motion.p>

        {/* ── TWO ACTION CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
        >
          {/* Card: Iniciar Sesión */}
          <a
            href="/login"
            id="cta-login"
            className="group relative flex flex-col items-center justify-center gap-5 bg-white/5 backdrop-blur-xl text-white rounded-[24px] p-10 border border-white/10
                       hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5
                       active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Hover shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)'
              }}
            />
            <div className="relative z-10 w-16 h-16 rounded-[100px] bg-white/10 flex items-center justify-center
                            group-hover:bg-[#0055fe] transition-all duration-500">
              <LogIn size={26} className="text-white" />
            </div>
            <div className="relative z-10 text-center">
              <p className="text-xl font-bold tracking-tight text-white mb-1">Iniciar Sesión</p>
              <p className="text-[11px] font-medium text-white/40 tracking-widest uppercase">Portal privado</p>
            </div>
          </a>

          {/* Card: Tienda en Línea */}
          <a
            href="/web"
            id="cta-tienda"
            className="group relative flex flex-col items-center justify-center gap-5 bg-[#0055fe]/10 backdrop-blur-xl text-white rounded-[24px] p-10 border border-[#0055fe]/20
                       hover:bg-[#0055fe]/20 hover:border-[#0055fe]/40 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#0055fe]/20
                       active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Hover fill */}
            <div className="absolute inset-0 bg-[#0055fe] opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300" />
            <div className="relative z-10 w-16 h-16 rounded-[100px] bg-[#0055fe] flex items-center justify-center
                            group-hover:scale-110 transition-all duration-500 shadow-lg shadow-[#0055fe]/30">
              <ShoppingBag size={26} className="text-white" />
            </div>
            <div className="relative z-10 text-center">
              <p className="text-xl font-bold tracking-tight text-white mb-1">Tienda en Línea</p>
              <p className="text-[11px] font-medium text-white/40 tracking-widest uppercase">Catálogo público</p>
            </div>
          </a>
        </motion.div>

        {/* ── LIVE INDICATOR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-[100px]"
        >
          <span className="w-2 h-2 rounded-full bg-[#0055fe] animate-pulse shadow-[0_0_8px_#0055fe]" />
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Sistemas operativos en línea</span>
        </motion.div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 py-8 flex justify-center border-t border-white/5">
        <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Atomic Industrias — Ecosistema Digital
        </p>
      </footer>
    </div>
  )
}

// ── SVG Atom Logo (White Framer Style) ──
function AtomLogo() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-2xl"
    >
      {/* Nucleus */}
      <circle cx="36" cy="36" r="5" fill="#0055fe" className="animate-pulse" />

      {/* Orbit 1 — horizontal */}
      <ellipse
        cx="36" cy="36"
        rx="30" ry="10"
        stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
        fill="none"
      />

      {/* Orbit 2 — rotated 60° */}
      <ellipse
        cx="36" cy="36"
        rx="30" ry="10"
        stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
        fill="none"
        transform="rotate(60 36 36)"
      />

      {/* Orbit 3 — rotated 120° */}
      <ellipse
        cx="36" cy="36"
        rx="30" ry="10"
        stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
        fill="none"
        transform="rotate(120 36 36)"
      />

      {/* Electron dots */}
      <circle cx="66" cy="36" r="3" fill="#fff" />
      <circle cx="21" cy="10.5" r="3" fill="#fff" />
      <circle cx="21" cy="61.5" r="3" fill="#fff" />
    </svg>
  )
}
