"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Lightbulb, Sparkles, Home, CheckCircle2, ArrowRight,
  MessageSquare, Star, Truck, ShieldCheck, Layers
} from "lucide-react"

const LIGHTING_ITEMS = [
  {
    id: "lampara-colgante-3",
    name: "Lámpara Colgante Industrial de 3 Cabezales Vintage",
    category: "Lámparas Colgantes",
    price: 38.50,
    oldPrice: 58.00,
    badge: "Más Vendido",
    specs: ["Diseño industrial y sofisticado", "3 cabezales ajustables en altura", "Acabado en negro mate con toques dorados", "Boquilla estándar E27 compatible con LED vintage"]
  },
  {
    id: "plafon-nordico",
    name: "Plafón LED Nórdico Circular Minimalista 36W",
    category: "Plafones Modernos",
    price: 29.90,
    oldPrice: 42.00,
    badge: "Luz Cálida / Fría",
    specs: ["Luz tricolor seleccionable (3000K / 4000K / 6500K)", "Ahorro energético 85%", "Cuerpo de aluminio y acrílico óptico", "Ideal para sala, comedor y dormitorios"]
  },
  {
    id: "pendiente-vidrio-ambar",
    name: "Luminaria Pendiente Individual en Vidrio Ámbar Soplado",
    category: "Pendientes Individuales",
    price: 22.00,
    oldPrice: 32.00,
    badge: "Elegancia Pura",
    specs: ["Vidrio texturizado de alta refracción", "Cable textil regulable hasta 1.2m", "Compatible con dimmers de intensidad", "Realza islas de cocina y barras de bar"]
  }
]

export default function IluminacionClient() {
  const handleOrderWhatsApp = (item: typeof LIGHTING_ITEMS[0]) => {
    const msg = `💡 *PEDIDO COLECCIÓN ILUMINACIÓN DE LUJO*%0A%0A` +
      `*Producto:* ${encodeURIComponent(item.name)}%0A` +
      `*Precio Promoción:* $${item.price} USD%0A` +
      `*Categoría:* ${encodeURIComponent(item.category)}%0A%0A` +
      `_Deseo consultar stock disponible y opciones de envío a domicilio._`

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
              <Lightbulb className="text-slate-950" size={22} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-amber-400">LUX</span></span>
          </Link>

          <Link
            href="/web"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a Temporada
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Colección Arquitectónica 2026
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Iluminación de Lujo para Departamentos a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Costo Mega Reducido
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Realza cada rincón de tu hogar con diseños modernos y acabados premium. Transforma la atmósfera de tu departamento sin gastar de más.
          </p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {LIGHTING_ITEMS.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/20">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star size={13} fill="currentColor" /> 4.9 / 5.0
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {item.name}
                </h3>

                <div className="mt-6 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Características:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {item.specs.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-8 pt-0 border-t border-white/5 mt-4">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-black text-amber-400">${item.price} USD</span>
                    <span className="text-xs text-slate-500 line-through ml-2">${item.oldPrice}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Ahorro Mega
                  </span>
                </div>

                <button
                  onClick={() => handleOrderWhatsApp(item)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Comprar por WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Línea de Iluminación y Arquitectura.</p>
      </footer>
    </div>
  )
}
