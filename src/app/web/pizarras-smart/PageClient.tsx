"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Tv, Sparkles, CheckCircle2, ArrowRight, MessageSquare,
  ShieldCheck, Presentation, Wifi, Cpu, Layers, Star, Truck
} from "lucide-react"

export default function PizarrasClient() {
  const handleOrderWhatsApp = () => {
    const msg = `🖥️ *SOLICITUD PIZARRA SMART INTERACTIVA 4K UHD 75"*%0A%0A` +
      `*Modelo:* ViewBoard IFP7550-5F 75" 4K UHD%0A` +
      `*Especificaciones:* 8GB RAM, 128GB ROM, Android 11, Wi-Fi 6 Dual Band%0A` +
      `*Precio Especial:* $1,890 USD (Incluye soporte de pared y lápices stylus)%0A%0A` +
      `_Deseo coordinar una demostración en vivo e información para facturación._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Presentation className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-purple-400">SMART BOARD</span></span>
          </Link>

          <Link
            href="/web/monitores"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <span>Ver Monitores LED</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Visualización de Alta Calidad & Interactividad
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Pizarra Smart Interactiva 4K UHD: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500">
              ViewBoard IFP7550-5F de 75"
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto mt-6">
            Lleva las reuniones de directorio, capacitaciones y clases magistrales al siguiente nivel con pantalla táctil multitouch de 20 puntos, Android 11 y conectividad inalámbrica total.
          </p>
        </motion.div>
      </section>

      {/* Product Highlight Box */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/30">
                Formato Gigante 75 Pulgadas
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Truck size={12} /> Instalación Disponible
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white">
              ViewBoard 75" 4K Multitáctil
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Tv size={18} className="text-purple-400 shrink-0" />
                <span>Panel 4K Ultra HD (3840 x 2160) Anti-Reflejo</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Cpu size={18} className="text-purple-400 shrink-0" />
                <span>8 GB Memoria RAM + 128 GB ROM</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Layers size={18} className="text-purple-400 shrink-0" />
                <span>Sistema Operativo Android 11 Oficial</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Wifi size={18} className="text-purple-400 shrink-0" />
                <span>Wi-Fi 6 Dual Band + Bluetooth 5.0</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
              <div>
                <span className="block text-xs text-slate-400">Precio Corporativo</span>
                <span className="text-4xl font-black text-purple-400">$1,890 <span className="text-lg text-slate-400">USD</span></span>
              </div>
              <span className="text-xs text-slate-400">Incluye 2 Lápices Stylus</span>
            </div>

            <button
              onClick={handleOrderWhatsApp}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-black text-lg hover:brightness-110 shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare size={20} />
              <span>Solicitar Cotización & Demo</span>
            </button>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-xs text-slate-300">
            <h3 className="text-xl font-black text-white mb-2">Beneficios Clave:</h3>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block mb-1">Escritura Ultra Fluida en Tiempo Real</strong>
              <p className="text-slate-400">Detección de trazo precisa sin latencia, ideal para anotaciones sobre documentos PDF y hojas de cálculo.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block mb-1">Compartición de Pantalla Inalámbrica</strong>
              <p className="text-slate-400">Transmite desde tu iPhone, Android, Mac o Windows sin necesidad de cables ni adaptadores adicionales.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block mb-1">Cámaras y Micrófonos Integrables</strong>
              <p className="text-slate-400">Compatibilidad nativa con Zoom, Microsoft Teams y Google Meet para videoconferencias híbridas.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Pizarras Interactivas y Pantallas Smart 4K.</p>
      </footer>
    </div>
  )
}
