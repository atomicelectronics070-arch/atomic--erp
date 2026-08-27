"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Volume2, Gift, Sparkles, Bluetooth, Music, Mic, Battery,
  ShieldCheck, ArrowRight, MessageSquare, Star, Truck
} from "lucide-react"

const AUDIFONOS_OPCIONES = [
  { id: "earbuds-pro", name: "Audífonos TWS Pro ANC (Cancelación Activa de Ruido)", color: "Negro Mate" },
  { id: "earbuds-sport", name: "Audífonos Deportivos Ergonómicos IPX7", color: "Blanco Glaciar" },
  { id: "earbuds-gaming", name: "Audífonos Gamer Baja Latencia con Luces RGB", color: "Cyber Cyan" }
]

export default function ParlanteSmartClient() {
  const [selectedGift, setSelectedGift] = useState(AUDIFONOS_OPCIONES[0])

  const handleOrderWhatsApp = () => {
    const msg = `🔊 *PEDIDO PARLANTE SMART ALTO RENDIMIENTO*%0A%0A` +
      `*Producto:* Parlante Smart Alto Rendimiento (Sonido Único Envolvente)%0A` +
      `*Precio Promocional:* $79.99 USD (Antes $110.00)%0A` +
      `*🎁 Audífonos Bluetooth de Obsequio Elegidos:* ${encodeURIComponent(selectedGift.name)} (${selectedGift.color})%0A%0A` +
      `_Deseo confirmar el pedido y coordinar entrega inmediata con envío gratis._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Volume2 className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">AUDIO</span></span>
          </Link>

          <Link
            href="/web"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a Promociones
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Promoción Exclusiva 2026
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Parlante Smart Alto Rendimiento <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Sonido Único Envolvente
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Sonido que impacta, experiencia que conecta. Potencia acústica de alta definición con luces LED dinámicas.
          </p>
        </motion.div>
      </section>

      {/* Product & Gift Selector Main Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl">
          
          {/* Left: Product Specs */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-500/30">
                Lanzamiento Especial
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Truck size={12} /> Envío a Nivel Nacional
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Torre de Sonido Smart Bluetooth
            </h2>

            {/* Big Promo Gift Alert */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Gift size={18} className="text-cyan-400" />
                <span>¡OBSEQUIO INCLUIDO POR TU COMPRA!</span>
              </div>
              <p className="text-xs text-slate-300">
                Por la compra de este parlante, te obsequiamos unos <strong>Audífonos Bluetooth totalmente a tu elección</strong> de nuestra web.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Music size={16} className="text-cyan-400 shrink-0" />
                <span>Sonido Potente & Graves Profundos</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Bluetooth size={16} className="text-cyan-400 shrink-0" />
                <span>Conectividad Bluetooth 5.3</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400 shrink-0" />
                <span>Luces LED Dinámicas RGB</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Battery size={16} className="text-cyan-400 shrink-0" />
                <span>Batería de Larga Duración</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Mic size={16} className="text-cyan-400 shrink-0" />
                <span>Entrada para Micrófono (Karaoke)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                <span>Garantía Oficial 1 Año</span>
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
              <div>
                <span className="block text-xs text-slate-400">Precio Especial de Promoción</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-cyan-400">$79.99 <span className="text-lg text-slate-400">USD</span></span>
                  <span className="text-base text-slate-500 line-through">$110.00</span>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                Ahorras $30 USD
              </span>
            </div>
          </div>

          {/* Right: Gift Selection & Buy */}
          <div className="space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Gift className="text-cyan-400" size={20} />
              <span>Elige tus Audífonos Bluetooth de Regalo:</span>
            </h3>

            <div className="space-y-3">
              {AUDIFONOS_OPCIONES.map((gift) => (
                <div
                  key={gift.id}
                  onClick={() => setSelectedGift(gift)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedGift.id === gift.id ? "bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/15" : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{gift.name}</h4>
                    <span className="text-xs text-slate-400">Color: {gift.color}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                    GRATIS
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleOrderWhatsApp}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-lg hover:brightness-110 shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-3 mt-6"
            >
              <MessageSquare size={20} />
              <span>Comprar Parlante + Audífonos Gratis</span>
            </button>

            <p className="text-center text-xs text-slate-400">
              * Incluye empaque de regalo y despacho express en 24 horas.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Línea de Audio y Sonido Inteligente.</p>
      </footer>
    </div>
  )
}
