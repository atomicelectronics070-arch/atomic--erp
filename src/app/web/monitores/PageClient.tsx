"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Monitor, Sparkles, CheckCircle2, ArrowRight, MessageSquare,
  ShieldCheck, Eye, Zap, Star, Truck
} from "lucide-react"

const MONITORES_LIST = [
  {
    id: "dahua-19-lm19",
    brand: "Dahua Technology",
    name: "Monitor Dahua DH-LM19-L200 19.5\" LED",
    price: 68.00,
    oldPrice: 85.00,
    badge: "Bajo Consumo 24/7",
    specs: [
      "Resolución HD+ 1600 x 900 píxeles",
      "Tecnología LED de ultra bajo consumo eléctrico (<18W)",
      "Puertos de entrada: HDMI y VGA (D-Sub)",
      "Tiempo de respuesta rápido de 5ms",
      "Montaje estándar VESA 75x75 compatible",
      "Diseño con bisel delgado y base estable",
      "Ideal para centros de monitoreo CCTV, oficinas y cajas"
    ]
  },
  {
    id: "dahua-22-fhd",
    brand: "Dahua Technology",
    name: "Monitor Dahua LM22-B200S 21.5\" Full HD",
    price: 89.00,
    oldPrice: 110.00,
    badge: "Full HD 1080p",
    specs: [
      "Resolución Full HD 1920 x 1080 píxeles",
      "Tasa de refresco fluida 75Hz",
      "Altavoces estéreo integrados",
      "Filtro de luz azul y tecnología Flicker-Free para protección ocular",
      "Ángulo de visión amplio 178°/178°",
      "Conectores HDMI y VGA incluidos"
    ]
  },
  {
    id: "dahua-24-frameless",
    brand: "Dahua Technology",
    name: "Monitor Dahua LM24-B200S 24\" IPS Frameless",
    price: 115.00,
    oldPrice: 140.00,
    badge: "Diseño Sin Bordes",
    specs: [
      "Pantalla IPS Full HD 1080p con colores vibrantes",
      "Bordes ultra delgados de 3 lados (Frameless)",
      "Frecuencia de 75Hz / 100Hz",
      "Acabado mate anti-reflejo",
      "Excelente para diseño gráfico, estaciones de trabajo y multitarea"
    ]
  }
]

export default function MonitoresClient() {
  const handleOrderWhatsApp = (m: typeof MONITORES_LIST[0]) => {
    const msg = `🖥️ *PEDIDO MONITOR DAHUA LED*%0A%0A` +
      `*Modelo:* ${encodeURIComponent(m.name)}%0A` +
      `*Precio Promocional:* $${m.price} USD (Antes: $${m.oldPrice} USD)%0A` +
      `*Garantía:* 1 Año Oficial Dahua / Atomic%0A%0A` +
      `_Deseo confirmar el pedido con entrega inmediata._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-red-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-red-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Monitor className="text-white" size={20} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">DAHUA <span className="text-red-400">DISPLAYS</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">Monitores LED</span>
            </div>
          </Link>

          <Link
            href="/web"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a la Tienda
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Calidad Visual Continua 24/7
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Monitores Dahua LED de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-yellow-400">
              Alta Resolución & Bajo Consumo
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Diseñados para durabilidad extrema en oficinas, sistemas de seguridad CCTV, puntos de venta y centros educativos.
          </p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {MONITORES_LIST.map((m) => (
            <div
              key={m.id}
              className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-red-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-wider border border-red-500/20">
                    {m.brand}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star size={13} fill="currentColor" /> {m.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors">
                  {m.name}
                </h3>

                <div className="mt-6 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Ficha Técnica:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {m.specs.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-red-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-8 pt-0 border-t border-white/5 mt-4">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-black text-red-400">${m.price} USD</span>
                    <span className="text-xs text-slate-500 line-through ml-2">${m.oldPrice}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Garantía 1 Año
                  </span>
                </div>

                <button
                  onClick={() => handleOrderWhatsApp(m)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-sm hover:brightness-110 shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Comprar Monitor por WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries & Dahua Technology. Monitores y Pantallas Profesionales.</p>
      </footer>
    </div>
  )
}
