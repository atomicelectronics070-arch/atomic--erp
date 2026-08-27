"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Bike, Zap, Percent, GraduationCap, ShieldCheck, CheckCircle2,
  ArrowRight, Sparkles, MessageSquare, Star, Truck, Sun
} from "lucide-react"

const BIKES = [
  {
    id: "r8014-shimano",
    name: "Bicicleta Eléctrica R8014 Shimano",
    tagline: "Componentes Shimano originales con marco de acero reforzado",
    basePrice: 520, // Internal real price
    fullOriginalPrice: 865, // Inflated price +40% technique: 865 -> 40% off = 520
    summerPrice: 649, // 25% off
    studentPrice: 520, // 40% off
    badge: "Componentes Shimano",
    img: "/images/bicicletas/bicicleta-shimano-r8014.jpg",
    specs: [
      "Fabricado con componentes originales SHIMANO",
      "Transmisión precisa de 21 Velocidades",
      "Regulación electrónica de 3 velocidades asistidas",
      "Pantalla Digital LCD multifunción",
      "Marco de acero de alta resistencia y durabilidad",
      "Frenos de disco mecánicos de alta potencia"
    ]
  },
  {
    id: "montana-26",
    name: "Bicicleta Eléctrica de Montaña 26\" Uso Rudo",
    tagline: "Motor 350W con batería de litio 48V 10Ah para uso continuado 24/7",
    basePrice: 620,
    fullOriginalPrice: 1030,
    summerPrice: 775,
    studentPrice: 620,
    badge: "Uso Rudo 24/7",
    img: "/images/bicicletas/bicicleta-montana-26.jpg",
    specs: [
      "Motor eléctrico Brushless de 350W",
      "Batería de litio extraíble 48V 10Ah",
      "Neumáticos anchos de 26 pulgadas todo terreno",
      "Pantalla LCD con velocímetro e indicador de carga",
      "Amortiguación delantera hidráulica para caminos difíciles",
      "Autonomía hasta 50 km con pedaleo asistido"
    ]
  },
  {
    id: "plegable-21",
    name: "Bicicleta Eléctrica Plegable Alto Rendimiento",
    tagline: "Neumáticos de 21 pulgadas, amortiguación delantera y puerto USB LCD",
    basePrice: 480,
    fullOriginalPrice: 800,
    summerPrice: 600,
    studentPrice: 480,
    badge: "Plegable Urbana",
    img: "/images/bicicletas/bicicleta-plegable-48v.jpg",
    specs: [
      "Diseño plegable ultra compacto para guardar en cajuela o dpto",
      "Batería de litio 48V 8Ah",
      "Pantalla USB LCD para cargar celular en ruta",
      "Neumáticos de 21 pulgadas con agarre urbano",
      "Amortiguación delantera de confort superior",
      "Luz LED frontal y reflectores traseros"
    ]
  }
]

export default function BicicletasClient() {
  const [isStudent, setIsStudent] = useState(false)

  const handleOrderWhatsApp = (bike: typeof BIKES[0]) => {
    const finalPrice = isStudent ? bike.studentPrice : bike.summerPrice
    const discountText = isStudent ? "40% OFF Descuento Estudiante" : "25% OFF Especial de Verano"
    
    const msg = `🚲 *PEDIDO BICICLETA ELÉCTRICA - OFERTA DE TEMPORADA*%0A%0A` +
      `*Modelo:* ${encodeURIComponent(bike.name)}%0A` +
      `*Promoción Aplicada:* ${discountText}%0A` +
      `*Precio a Pagar:* $${finalPrice} USD (Precio Regular: $${bike.fullOriginalPrice} USD)%0A` +
      (isStudent ? `*Nota:* Presentaré carnet/matrícula estudiantil vigente.%0A` : '') +
      `\nDeseo confirmar la entrega con despacho gratis a domicilio.`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-orange-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-orange-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Bike className="text-slate-950" size={22} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-orange-400">BIKES</span></span>
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sun size={14} /> Temporada de Verano 2026
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Disfruta del Verano con tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Bicicleta Eléctrica con 25% a 40% OFF
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto mt-6">
            Ahorra gasolina, mantente activo y llega más rápido. Descuento general del 25% por temporada de verano y <strong>hasta 40% de descuento para estudiantes</strong>.
          </p>

          {/* Student Toggle Switch */}
          <div className="mt-8 inline-flex items-center gap-4 p-2 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-xl">
            <button
              onClick={() => setIsStudent(false)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                !isStudent ? "bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/25" : "text-slate-400 hover:text-white"
              }`}
            >
              Oferta Verano (25% OFF)
            </button>
            <button
              onClick={() => setIsStudent(true)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                isStudent ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25" : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap size={16} />
              <span>Soy Estudiante (40% OFF)</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Product Catalog Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {BIKES.map((bike) => {
            const currentPrice = isStudent ? bike.studentPrice : bike.summerPrice
            const discountPct = isStudent ? 40 : 25

            return (
              <div
                key={bike.id}
                className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-orange-500/50 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-black uppercase tracking-wider border border-orange-500/20">
                      {bike.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                      {discountPct}% OFF
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors">
                    {bike.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {bike.tagline}
                  </p>

                  <div className="mt-6 space-y-2">
                    <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Detalles:</h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {bike.specs.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-orange-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-8 pt-0 border-t border-white/5 mt-4">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-3xl font-black text-orange-400">${currentPrice} USD</span>
                      <span className="text-sm text-slate-500 line-through ml-2">${bike.fullOriginalPrice}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Ahorras ${bike.fullOriginalPrice - currentPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOrderWhatsApp(bike)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    <span>Aprovechar Descuento</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Línea de Bicicletas Eléctricas y Movilidad de Verano.</p>
      </footer>
    </div>
  )
}
