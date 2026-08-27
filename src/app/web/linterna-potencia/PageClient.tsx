"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Flashlight, Gift, Sparkles, BatteryCharging, ShieldCheck,
  CheckCircle2, ArrowRight, MessageSquare, Sun, Truck, Eye
} from "lucide-react"

export default function LinternaClient() {
  const handleOrderWhatsApp = () => {
    const msg = `🔦 *PEDIDO LINTERNA STEREN ALTO NIVEL LUMÍNICO*%0A%0A` +
      `*Producto:* Linterna de Alta Potencia Steren con Mango Ergonómico%0A` +
      `*Precio de Combo:* $34.50 USD%0A` +
      `*🎁 Obsequio Incluido:* Paquete de Baterías de Larga Duración Gratis%0A%0A` +
      `_Deseo solicitar envío inmediato a domicilio._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-amber-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-amber-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sun className="text-slate-950" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-amber-400">TOOLS</span></span>
          </Link>

          <Link
            href="/web"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a Combos
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Potencia Lumínica Extrema
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Linterna Steren de Alto Nivel Lumínico <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Potencia que Ilumina tu Camino
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Diseñada para exploraciones, seguridad perimetral, apagones y trabajos pesados. Haz frente a cualquier oscuridad con iluminación de alcance superior.
          </p>
        </motion.div>
      </section>

      {/* Main Showcase */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                Combo Especial
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Truck size={12} /> Envío Nacional Rápido
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Linterna Industrial Steren Ultra Beam
            </h2>

            {/* Gift Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-yellow-950/60 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Gift size={18} className="text-amber-400" />
                <span>¡OBSEQUIO EXCLUSIVO INCLUIDO!</span>
              </div>
              <p className="text-xs text-slate-300">
                Por la compra de esta linterna, te obsequiamos un <strong>Paquete Completo de Baterías de Larga Duración</strong> de repuesto totalmente gratis.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Sun size={18} className="text-amber-400 shrink-0" />
                <span>Haz Lumínico de Alta Potencia & Alcance</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <BatteryCharging size={18} className="text-amber-400 shrink-0" />
                <span>Batería de Gran Autonomía Continua</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-400 shrink-0" />
                <span>Cuerpo Resistente a Golpes y Caídas</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Eye size={18} className="text-amber-400 shrink-0" />
                <span>Mango Ergonómico y Ajustable Multipolar</span>
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
              <div>
                <span className="block text-xs text-slate-400">Precio Combo con Baterías de Regalo</span>
                <span className="text-4xl font-black text-amber-400">$34.50 <span className="text-lg text-slate-400">USD</span></span>
              </div>
              <span className="text-xs text-slate-400">Entrega Inmediata</span>
            </div>

            <button
              onClick={handleOrderWhatsApp}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-lg hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare size={20} />
              <span>Pedir Combo Linterna + Baterías Gratis</span>
            </button>
          </div>

          {/* Right: Technical Highlights */}
          <div className="space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-xl font-black text-white">Ideal para:</h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span><strong>Seguridad y Vigilancia:</strong> Rondas nocturnas en conjuntos y fincas.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span><strong>Hogar & Emergencias:</strong> Iluminación potente ante cortes de energía.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span><strong>Camping y Automotriz:</strong> Compañero indispensable en la cajuela de tu auto.</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Línea de Iluminación y Herramientas.</p>
      </footer>
    </div>
  )
}
