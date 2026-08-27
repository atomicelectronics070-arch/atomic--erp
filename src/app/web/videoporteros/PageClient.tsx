"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ShieldCheck, Video, Lock, Wifi, Smartphone, CheckCircle2,
  ArrowRight, Sparkles, MessageSquare, Star, Truck, Eye, Bell
} from "lucide-react"

const VIDEOPORTEROS = [
  {
    id: "kit-diel-10",
    name: "Kit Videoportero DIEL LCD de 10\" con Botonera Metálica",
    subtitle: "Oferta de alta calidad: Botonera antigolpes metálica y anti-vandálica",
    price: 221.01,
    oldPrice: 285.00,
    priceNote: "IVA Incluido",
    badge: "Botonera Antivandálica",
    color: "from-blue-600 to-cyan-500",
    specs: [
      "Pantalla panorámica LCD de 10\" DIEL de alta definición",
      "Botonera exterior metálica de aleación de aluminio anti-impacto",
      "Cámara integrada gran angular con visión nocturna infrarroja nítida",
      "Apertura de cerradura eléctrica y portón desde el monitor interno",
      "Comunicación de audio bidireccional claro y sin eco",
      "Instalación sencilla de 4 hilos para residencias, negocios y oficinas"
    ]
  },
  {
    id: "ezviz-hp7-cb1",
    name: "Portero Electrónico Smart EZVIZ HP7 CB1 Sin Cables",
    subtitle: "Portero unifamiliar de alto rendimiento y máxima calidad",
    price: 199.99,
    oldPrice: 249.99,
    priceNote: "+ IVA",
    badge: "100% Sin Cables / Wi-Fi",
    color: "from-red-600 to-rose-500",
    specs: [
      "Pantalla táctil a color de 7 pulgadas con interfaz moderna",
      "Cámara 2K con lente ultra gran angular de 162° y visión nocturna",
      "Detección inteligente de movimiento humano con alertas en tiempo real",
      "Desbloqueo inteligente por tarjetas RFID de proximidad (2 etiquetas)",
      "Atiende la puerta y abre remotamente desde la App EZVIZ en tu celular",
      "Compatible con timbre inalámbrico adicional e integración con Alexa"
    ]
  }
]

export default function VideoporterosClient() {
  const handleOrderWhatsApp = (item: typeof VIDEOPORTEROS[0]) => {
    const msg = `📹 *PEDIDO VIDEOPORTERO SMART*%0A%0A` +
      `*Equipo:* ${encodeURIComponent(item.name)}%0A` +
      `*Precio Promocional:* $${item.price} USD (${item.priceNote})%0A` +
      `*Garantía:* 1 Año Oficial Atomic Security%0A%0A` +
      `_Deseo consultar sobre instalación en mi domicilio u oficina._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Video className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">ACCESS</span></span>
          </Link>

          <Link
            href="/web"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a Ofertas
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} /> Control de Acceso & Seguridad Residencial
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Videoporteros Smart de Alta Calidad: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
              Ve, Habla y Abre desde Cualquier Lugar
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Protege lo que más importa. Soluciones cableadas antivandálicas e inalámbricas Wi-Fi con apertura remota para casas, oficinas y negocios.
          </p>
        </motion.div>
      </section>

      {/* Product Comparison Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {VIDEOPORTEROS.map((item) => (
            <div
              key={item.id}
              className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-500/20">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star size={13} fill="currentColor" /> 5.0 / 5.0
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {item.subtitle}
                </p>

                <div className="mt-6 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Beneficios Principales:</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {item.specs.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-xs text-slate-400 uppercase font-bold">Precio Especial</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-cyan-400">${item.price} USD</span>
                    <span className="text-xs text-slate-500 line-through">${item.oldPrice}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.priceNote}</span>
                </div>

                <button
                  onClick={() => handleOrderWhatsApp(item)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-sm hover:brightness-110 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
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
        <p>© 2026 Atomic Industries. Videoporteros, Intercomunicadores y Control de Acceso.</p>
      </footer>
    </div>
  )
}
