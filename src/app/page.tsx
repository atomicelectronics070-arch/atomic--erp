"use client"
// Atomic Industrias — Landing Page v10.0 — Ether Studio Aesthetic (3D + Framer Motion)

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn, ShoppingBag, ArrowRight } from "lucide-react"
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative selection:bg-[#0055fe]/30 font-sans">
      
      {/* ── BACKGROUND 3D CANVAS ── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        {mounted && <Atom3D />}
      </div>
      
      {/* ── GRAIN / NOISE OVERLAY ── */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

      {/* ── NAVIGATION (Minimalist) ── */}
      <nav className="relative z-10 w-full px-8 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-black tracking-tighter">ATOMIC</div>
        <div className="flex gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">
          <Link href="/login" className="hover:text-white transition-colors">ERP Portal</Link>
          <Link href="/web" className="hover:text-white transition-colors">Store</Link>
        </div>
      </nav>

      {/* ── HERO CONTENT (Ether Studio Style) ── */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-20 max-w-[1400px] mx-auto w-full mix-blend-difference">
        
        <div className="max-w-4xl pt-20">
          {/* Subtle Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="w-12 h-[1px] bg-[#0055fe]" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#0055fe]">
              The Future of Industry
            </span>
          </motion.div>

          {/* Massive Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter uppercase mb-6"
          >
            ATOMIC <br />
            <span className="text-white/40">INDUSTRIAS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl font-medium text-white/50 max-w-lg mb-16 leading-relaxed"
          >
            Next-generation enterprise resource planning and public e-commerce ecosystems, engineered for precision.
          </motion.p>
        </div>

        {/* ── ACTION LINKS (Minimalist Brutalism) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 mt-auto pb-12"
        >
          <Link
            href="/web"
            className="group flex items-center gap-4 text-2xl font-black tracking-tight uppercase hover:text-[#0055fe] transition-colors duration-500"
          >
            Explore Store
            <span className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 group-hover:border-[#0055fe] group-hover:bg-[#0055fe] transition-all duration-500">
              <ArrowRight size={18} className="group-hover:text-white group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>

          <Link
            href="/login"
            className="group flex items-center gap-4 text-2xl font-black tracking-tight uppercase text-white/40 hover:text-white transition-colors duration-500 sm:ml-12"
          >
            Client Portal
            <span className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:border-white/40 transition-all duration-500">
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        </motion.div>
      </main>
      
    </div>
  )
}
