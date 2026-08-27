"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Zap, BatteryCharging, Gauge, ShieldCheck, CheckCircle2,
  ArrowRight, Sparkles, MessageSquare, Star, Truck, Shield
} from "lucide-react"

const SCOOTERS = [
  {
    id: "segway-ninebot-f25",
    name: "Segway Ninebot F25 Smart Scooter",
    tagline: "Mueve tu día sin límites. Rendimiento, seguridad y comodidad.",
    price: 489,
    oldPrice: 599,
    badge: "Modelo Destacado",
    img: "/images/scooters/scooter-ninebot-f25.jpg",
    specs: [
      "Velocidad máxima: 25 km/h",
      "Neumáticos de 10 pulgadas de alta absorción",
      "Carga rápida: 3.5 horas",
      "Luces LED frontales 2.1W de alta luminosidad",
      "Resistencia al agua IPX5",
      "Batería inteligente 367Wh con BMS",
      "Freno de disco + freno electrónico regenerativo"
    ]
  },
  {
    id: "kickscooter-es1l",
    name: "KickScooter ES1L Ligero Urbano",
    tagline: "Movilidad práctica dentro de la ciudad. Ahorra tiempo y energía.",
    price: 412,
    oldPrice: 470,
    badge: "Ultra Ligero 11kg",
    img: "/images/scooters/scooter-es1l.jpg",
    specs: [
      "Ultra ligero: Solo 11 kg (fácil de transportar)",
      "Potencia nominal: 250W",
      "Autonomía: 20 km aprox.",
      "Velocidad: 20 km/h",
      "3 modos de manejo: Eco, Estándar y Deportivo",
      "Faro LED delantero 2.5W",
      "Batería 36.7Wh de alto rendimiento"
    ]
  },
  {
    id: "kickscooter-e12",
    name: "Scooter Smart KickScooter E12",
    tagline: "Movilidad inteligente, libertad sin límites para niños y jóvenes.",
    price: 269,
    oldPrice: 320,
    badge: "Jóvenes 10-12 años",
    img: "/images/scooters/scooter-e12.jpg",
    specs: [
      "Edad recomendada: 10 a 12 años",
      "Velocidad máxima segura: 18 km/h",
      "Recorrido: 10 km aprox.",
      "Amortiguador delantero para suaves recorridos",
      "Adhesivo reflectivo 3M de alta visibilidad",
      "3 modos de conducción: Turbo, Crucero y Seguro",
      "3 tipos de frenos para máxima protección"
    ]
  }
]

export default function ScootersClient() {
  const [selectedScooter, setSelectedScooter] = useState(SCOOTERS[0])

  const handleOrderWhatsApp = (scooter: typeof SCOOTERS[0]) => {
    const msg = `🛵 *PEDIDO SCOOTER SMART ATOMIC MOBILITY*%0A%0A` +
      `*Modelo:* ${encodeURIComponent(scooter.name)}%0A` +
      `*Precio Especial:* $${scooter.price} USD (IVA Incluido)%0A` +
      `*Garantía:* 1 Año Oficial Atomic%0A%0A` +
      `_Deseo confirmar la compra y solicitar entrega a domicilio con envío gratis._`

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
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">MOBILITY</span></span>
          </Link>

          <Link
            href="/web"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a Temporada
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Movilidad Urbana Inteligente 2026
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Muévete Rápido, Ecológico y con Estilo: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Scooters Eléctricos Smart
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Evita el tráfico, reduce tus tiempos de traslado y viaja con total comodidad por la ciudad con la tecnología líder de Segway y Ninebot.
          </p>
        </motion.div>
      </section>

      {/* Product Catalog Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {SCOOTERS.map((scooter) => (
            <div
              key={scooter.id}
              className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-500/20">
                    {scooter.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star size={13} fill="currentColor" /> 5.0
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  {scooter.name}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {scooter.tagline}
                </p>

                <div className="mt-6 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Ficha Técnica:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {scooter.specs.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-8 pt-0 border-t border-white/5 mt-4">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-black text-cyan-400">${scooter.price}</span>
                    <span className="text-xs text-slate-500 line-through ml-2">${scooter.oldPrice} USD</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    IVA Incluido
                  </span>
                </div>

                <button
                  onClick={() => handleOrderWhatsApp(scooter)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Comprar por WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Truck size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-base">Envío Inmediato</strong>
            <p className="text-xs text-slate-400 mt-1">Despacho garantizado a domicilio en todo el Ecuador.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <ShieldCheck size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-base">Garantía Atomic</strong>
            <p className="text-xs text-slate-400 mt-1">1 año de respaldo con stock de repuestos originales.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Zap size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-base">Baterías de Litio BMS</strong>
            <p className="text-xs text-slate-400 mt-1">Protección contra sobrecargas, cortocircuitos y temperatura.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Línea de Movilidad Eléctrica Urbana.</p>
      </footer>
    </div>
  )
}
