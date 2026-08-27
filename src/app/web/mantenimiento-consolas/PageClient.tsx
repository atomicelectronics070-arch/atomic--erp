"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Wrench, ShieldCheck, CheckCircle2, ArrowRight, Sparkles,
  Zap, Clock, Award, MessageSquare, Percent, Flame
} from "lucide-react"

const SERVICES = [
  {
    category: "Consolas Actuales (Generación 9)",
    models: ["PlayStation 5 (Estándar / Slim / Digital)", "Xbox Series X / Series S"],
    items: [
      { name: "Mantenimiento Pro PS5 (Cambio/Reajuste Metal Líquido + Limpieza Bloque Disipador)", price: 45 },
      { name: "Mantenimiento Preventivo Xbox Series X/S (Limpieza de Turbina + Pasta Térmica Térmica Premium)", price: 35 },
      { name: "Reparación Puerto HDMI 2.1 4K 120Hz (Sustitución de conector dañado)", price: 65 },
      { name: "Reparación de Fuente de Poder Interna y Circuitos de Encendido", price: 85 }
    ]
  },
  {
    category: "Consolas Generación 8 & Portátiles",
    models: ["PlayStation 4 (Fat / Slim / Pro)", "Xbox One (S / X)", "Nintendo Switch (OLED / V2 / Lite)"],
    items: [
      { name: "Mantenimiento Integral PS4 / PS4 Pro (Pasta térmica Artic MX-4 + Limpieza Total)", price: 30 },
      { name: "Reparación de Lector Óptico Bluray / Mecanismo de Disco", price: 40 },
      { name: "Cambio de Joy-Con Sticks (Efecto Hall anti-drift) Nintendo Switch", price: 25 },
      { name: "Cambio de Puerto de Carga USB Tipo C Nintendo Switch", price: 45 }
    ]
  },
  {
    category: "Consolas Retro & Clásicas",
    models: ["PlayStation 3 / PS2 / PS1", "Xbox 360 (Slim / E)", "Nintendo Wii / Wii U / GameCube / N64"],
    items: [
      { name: "Restauración y Mantenimiento Completo Consola Retro (Limpieza ultrasónica)", price: 35 },
      { name: "Cambio de Lente Láser Óptico y Calibración", price: 30 },
      { name: "Instalación de Almacenamiento SSD / HDD y Optimización de Sistema", price: 45 }
    ]
  }
]

export default function MantenimientoConsolasClient() {
  const [selectedConsole, setSelectedConsole] = useState("PlayStation 5")

  const handleBookServiceWhatsApp = (serviceName: string, price: number) => {
    const isDiscount = price >= 80
    const finalPrice = isDiscount ? Math.round(price * 0.9) : price
    const msg = `🔧 *SOLICITUD DE SERVICIO TÉCNICO DE CONSOLAS*%0A%0A` +
      `*Consola:* ${encodeURIComponent(selectedConsole)}%0A` +
      `*Servicio Requerido:* ${encodeURIComponent(serviceName)}%0A` +
      `*Precio Regular:* $${price} USD%0A` +
      (isDiscount ? `*🎉 Descuento 10% Aplicado:* $${finalPrice} USD%0A` : '') +
      `\nDeseo coordinar la recepción de mi consola en taller o servicio a domicilio.`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wrench className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-indigo-400">LAB</span></span>
          </Link>

          <Link
            href="/web/playstation-4"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <span>Ver Consolas en Venta</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-8 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Flame size={14} className="text-amber-400" /> Especialistas en Electrónica Gaming
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Reparación & Mantenimiento Profesional de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
              Consolas de Videojuegos
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Diagnóstico especializado, cambio de metal líquido, pasta térmica de alta conductividad y repuestos 100% originales.
          </p>

          {/* Special Discount Banner */}
          <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-xl mx-auto flex items-center justify-center gap-3 text-amber-300 text-xs sm:text-sm font-bold">
            <Percent size={20} className="text-amber-400 shrink-0" />
            <span>¡10% DE DESCUENTO en servicios superiores a $80 USD!</span>
          </div>
        </motion.div>
      </section>

      {/* Service Catalog Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-12">
        {SERVICES.map((cat, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">{cat.category}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {cat.models.map((m, mIdx) => (
                  <span key={mIdx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-semibold">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {cat.items.map((srv, sIdx) => {
                const hasDiscount = srv.price >= 80
                const discountedPrice = hasDiscount ? Math.round(srv.price * 0.9) : srv.price

                return (
                  <div
                    key={sIdx}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">{srv.name}</h4>
                      <p className="text-xs text-slate-400">Incluye diagnóstico, prueba de estrés térmico y garantía de taller.</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
                      <div>
                        {hasDiscount ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-emerald-400">${discountedPrice} USD</span>
                            <span className="text-xs text-slate-500 line-through">${srv.price}</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">10% OFF</span>
                          </div>
                        ) : (
                          <span className="text-2xl font-black text-indigo-400">${srv.price} USD</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleBookServiceWhatsApp(srv.name, srv.price)}
                        className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-400 transition-all flex items-center gap-1.5"
                      >
                        <MessageSquare size={14} />
                        <span>Agendar</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Technical Warranty Callout */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 to-blue-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Garantía Escrita en Todas las Reparaciones</h4>
              <p className="text-xs text-slate-400">Entregamos reporte técnico detallado con fotos del antes y después de tu consola.</p>
            </div>
          </div>
          <button
            onClick={() => handleBookServiceWhatsApp("Consulta General de Taller", 0)}
            className="px-6 py-3.5 rounded-xl bg-indigo-500 text-white font-black text-sm hover:bg-indigo-400 transition-all shrink-0"
          >
            Consultar por WhatsApp
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Servicio Técnico Especializado en Consolas.</p>
      </footer>
    </div>
  )
}
