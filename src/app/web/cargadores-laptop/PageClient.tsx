"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Zap, Laptop, ShieldCheck, CheckCircle2, ArrowRight,
  Sparkles, MessageSquare, Star, Truck, Users, Percent
} from "lucide-react"

const CHARGERS = [
  {
    brand: "ASUS",
    name: "Cargador ASUS Original Punta Azul / Universal (65W 19V 3.42A)",
    unitPrice: 24.50,
    distributorPrice: 15.90, // When purchasing 6+
    compatible: ["Zenbook", "Vivobook", "ROG", "TUF Gaming", "Series X/K"],
    type: "100% Original & Certificado"
  },
  {
    brand: "HP",
    name: "Cargador HP Punta Azul Smart Pin (45W / 65W 19.5V 3.33A)",
    unitPrice: 22.00,
    distributorPrice: 14.50,
    compatible: ["Pavilion", "Envy", "ProBook", "EliteBook", "Series 14/15"],
    type: "Original OEM & Genérico Triple A"
  },
  {
    brand: "DELL",
    name: "Cargador DELL Punta Redonda 4.5mm / 7.4mm (65W / 90W 19.5V)",
    unitPrice: 23.50,
    distributorPrice: 15.00,
    compatible: ["Inspiron", "Latitude", "Vostro", "XPS", "Precision"],
    type: "100% Original & Certificado"
  },
  {
    brand: "LENOVO",
    name: "Cargador Lenovo Punta Amarilla Slim Tip & Tipo C (65W 20V 3.25A)",
    unitPrice: 24.00,
    distributorPrice: 15.50,
    compatible: ["ThinkPad", "IdeaPad", "Yoga", "Legion", "V-Series"],
    type: "Original OEM & Genérico Triple A"
  },
  {
    brand: "APPLE",
    name: "Cargador Apple MagSafe 2 / USB-C PD (45W / 60W / 85W / 96W)",
    unitPrice: 38.00,
    distributorPrice: 25.00,
    compatible: ["MacBook Air M1/M2", "MacBook Pro Retina", "MacBook Pro 14/16"],
    type: "Grado A+ con Chip de Protección"
  }
]

export default function CargadoresLaptopClient() {
  const [quantity, setQuantity] = useState(6)
  const isDistributor = quantity >= 6

  const handleOrderWhatsApp = (c: typeof CHARGERS[0]) => {
    const pricePerUnit = isDistributor ? c.distributorPrice : c.unitPrice
    const total = (pricePerUnit * quantity).toFixed(2)

    const msg = `⚡ *PEDIDO CARGADORES PARA LAPTOP - ${isDistributor ? 'PRECIO DISTRIBUIDOR' : 'CONSUMIDOR FINAL'}*%0A%0A` +
      `*Marca/Modelo:* ${encodeURIComponent(c.name)}%0A` +
      `*Cantidad:* ${quantity} Unidades%0A` +
      `*Precio Unitario:* $${pricePerUnit} USD (${isDistributor ? 'Descuento Distribuidor 6+ Unidades' : 'PVP Normal'})%0A` +
      `*💰 TOTAL:* $${total} USD%0A%0A` +
      `_Deseo coordinar la entrega y factura comercial._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Glow */}
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
            <div>
              <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">PARTS</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Cargadores & Repuestos</span>
            </div>
          </Link>

          <Link
            href="/web/repuestos"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Ver Todo Repuestos
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Percent size={14} /> Trato de Distribuidor Mayorista
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Compra 6 Unidades y Ten Trato de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Distribuidor con Descuentos Exclusivos
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto mt-6">
            Traemos componentes 100% originales y genéricos Triple A con total transparencia. A partir de 1 unidad precio de consumidor final, a partir de <strong>6 unidades precio de distribuidor</strong> para maximizar tu ganancia.
          </p>

          {/* Quantity Selector */}
          <div className="mt-8 inline-flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <span className="text-xs font-bold text-slate-300">Selecciona Cantidad:</span>
            <div className="flex items-center gap-2">
              {[1, 6, 12, 24].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantity(q)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    quantity === q
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {q} {q === 1 ? 'Unidad (PVP)' : 'Unidades (Distribuidor)'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Catalog Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CHARGERS.map((c, idx) => {
            const currentUnitPrice = isDistributor ? c.distributorPrice : c.unitPrice
            const totalPack = (currentUnitPrice * quantity).toFixed(2)

            return (
              <div
                key={idx}
                className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-500/20">
                      {c.brand}
                    </span>
                    {isDistributor && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                        Precio Mayorista
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
                    {c.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 block mt-1">{c.type}</span>

                  <div className="mt-6 space-y-2">
                    <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Compatibilidad Comprobada:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {c.compatible.map((m, mIdx) => (
                        <span key={mIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0 border-t border-white/5 mt-4">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-xs text-slate-400 block">Precio por unidad ({quantity} u.):</span>
                      <span className="text-3xl font-black text-cyan-400">${currentUnitPrice} USD</span>
                      {isDistributor && (
                        <span className="text-xs text-slate-500 line-through ml-2">${c.unitPrice}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total del Lote:</span>
                      <span className="text-lg font-black text-emerald-400">${totalPack} USD</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOrderWhatsApp(c)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    <span>Pedir Lote por WhatsApp</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Transparency Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 grid sm:grid-cols-3 gap-6 text-center text-xs">
          <div>
            <ShieldCheck size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-sm">Transparencia Total</strong>
            <span className="text-slate-400">Te indicamos con exactitud si el repuesto es 100% original o genérico Triple A.</span>
          </div>
          <div>
            <Zap size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-sm">Protección Integrada</strong>
            <span className="text-slate-400">Protección contra sobrecargas, sobrecalentamiento y cortocircuitos.</span>
          </div>
          <div>
            <Truck size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-sm">Despacho Inmediato</strong>
            <span className="text-slate-400">Envíos express en 24 horas a talleres y locales en todo el país.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Línea de Cargadores, Baterías y Repuestos para Laptops.</p>
      </footer>
    </div>
  )
}
