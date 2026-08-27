"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Sun, Zap, ShieldCheck, CheckCircle2, ArrowRight, Sparkles,
  MessageSquare, Star, Truck, Plus, Eye
} from "lucide-react"

const LUMINARIAS = [
  {
    id: "solar-300w",
    code: "28194",
    name: "Luminaria Solar LED 300W",
    price: 43.00,
    oldPrice: 59.00,
    leds: "336 LED 5730 de Alta Luminosidad",
    panel: "Panel Solar 6V / 8W Integrado",
    battery: "Batería de soporte LiFePO4 3.2V / 10AH",
    coverage: "Área de iluminación: 80 - 100 m²",
    img: "/images/luminarias/luces-led-solares-300-800w.jpg"
  },
  {
    id: "solar-600w",
    code: "28195",
    name: "Luminaria Solar LED 600W",
    price: 54.00,
    oldPrice: 75.00,
    badge: "Más Vendido",
    leds: "576 LED 5730 de Alta Luminosidad",
    panel: "Panel Solar 6V / 18W Integrado",
    battery: "Batería de soporte LiFePO4 3.2V / 15AH",
    coverage: "Área de iluminación: 140 - 180 m²",
    img: "/images/luminarias/luces-led-solares-300-800w.jpg"
  },
  {
    id: "solar-800w",
    code: "28196",
    name: "Luminaria Solar LED 800W Pro",
    price: 66.00,
    oldPrice: 92.00,
    badge: "Máxima Potencia",
    leds: "864 LED 5730 de Alta Luminosidad",
    panel: "Panel Solar 6V / 25W Integrado",
    battery: "Batería de soporte LiFePO4 3.2V / 20AH",
    coverage: "Área de iluminación: 220 - 280 m²",
    img: "/images/luminarias/luces-led-solares-300-800w.jpg"
  }
]

const SOPORTE = {
  id: "soporte-acero",
  code: "12376",
  name: "Soporte Adaptable Tubular de Acero para Pared/Poste (45 cm)",
  price: 27.50,
  desc: "Estructura metálica resistente a la corrosión para fijación firme y segura en cualquier superficie."
}

export default function LuminariasSolaresClient() {
  const [includeSoporte, setIncludeSoporte] = useState(true)

  const handleOrderWhatsApp = (lum: typeof LUMINARIAS[0]) => {
    const total = includeSoporte ? (lum.price + SOPORTE.price).toFixed(2) : lum.price.toFixed(2)
    const msg = `💡 *PEDIDO LUMINARIAS SOLARES ATOMECA INDUSTRIA*%0A%0A` +
      `*Producto:* ${encodeURIComponent(lum.name)} (COD: ${lum.code}) - $${lum.price} USD%0A` +
      (includeSoporte ? `*Soporte de Acero 45cm (COD: ${SOPORTE.code}):* +$${SOPORTE.price} USD%0A` : '') +
      `*💰 TOTAL:* $${total} USD (PVP Oficial)%0A%0A` +
      `_Deseo confirmar el pedido y coordinar el despacho inmediato._`

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
              <Sun className="text-slate-950" size={22} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">ATOMECA <span className="text-amber-400">INDUSTRIA</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">Luminarias Solares</span>
            </div>
          </div>

          <Link
            href="/web/iluminacion"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <span>Ver Iluminación Departamentos</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Energía Solar 100% Renovable
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Luz de Alta Potencia Sin Electricidad: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Luminarias Solares Autónomas IP65
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Ilumina parques, calles, conjuntos residenciales, fincas y patios sin gastar un solo centavo en la planilla eléctrica. Encendido automático día/noche.
          </p>

          {/* Soporte Checkbox Selector */}
          <div className="mt-8 inline-flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer" onClick={() => setIncludeSoporte(!includeSoporte)}>
            <input
              type="checkbox"
              checked={includeSoporte}
              onChange={() => {}}
              className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
            />
            <span className="text-xs text-slate-200 font-bold">
              Añadir Soporte de Acero Adaptable (45 cm) por +${SOPORTE.price} USD (COD: {SOPORTE.code})
            </span>
          </div>
        </motion.div>
      </section>

      {/* Product Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {LUMINARIAS.map((lum) => {
            const finalPrice = includeSoporte ? (lum.price + SOPORTE.price).toFixed(2) : lum.price.toFixed(2)

            return (
              <div
                key={lum.id}
                className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/20">
                      COD: {lum.code}
                    </span>
                    {lum.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                        {lum.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {lum.name}
                  </h3>

                  <div className="mt-6 space-y-2 text-xs text-slate-300">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[10px] uppercase">Iluminación:</span>
                      <strong>{lum.leds}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[10px] uppercase">Panel Solar:</span>
                      <strong>{lum.panel}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[10px] uppercase">Batería de Respaldo:</span>
                      <strong>{lum.battery}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[10px] uppercase">Cobertura:</span>
                      <strong>{lum.coverage}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0 border-t border-white/5 mt-4">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-3xl font-black text-amber-400">${finalPrice} USD</span>
                      <span className="text-xs text-slate-500 line-through ml-2">${lum.oldPrice}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      P.V.P Oficial
                    </span>
                  </div>

                  <button
                    onClick={() => handleOrderWhatsApp(lum)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    <span>Pedir por WhatsApp</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 grid sm:grid-cols-4 gap-6 text-center text-xs">
          <div>
            <Sun size={24} className="text-amber-400 mx-auto mb-2" />
            <strong className="block text-white text-sm">Panel Solar Integrado</strong>
            <span className="text-slate-400">Recarga con luz diurna</span>
          </div>
          <div>
            <ShieldCheck size={24} className="text-amber-400 mx-auto mb-2" />
            <strong className="block text-white text-sm">Protección IP65</strong>
            <span className="text-slate-400">Resistente a lluvias torrenciales</span>
          </div>
          <div>
            <Zap size={24} className="text-amber-400 mx-auto mb-2" />
            <strong className="block text-white text-sm">Control Remoto</strong>
            <span className="text-slate-400">Ajuste de temporizador y brillo</span>
          </div>
          <div>
            <Truck size={24} className="text-amber-400 mx-auto mb-2" />
            <strong className="block text-white text-sm">Envíos a Todo el País</strong>
            <span className="text-slate-400">Entrega rápida y segura</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomeca Industria. Catálogo Oficial de Iluminación Solar Autónoma.</p>
      </footer>
    </div>
  )
}
