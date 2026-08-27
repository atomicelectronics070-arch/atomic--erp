"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Eye, EyeOff, ShieldCheck, Sparkles, Video, BatteryCharging,
  HardDrive, Lock, MessageSquare, ArrowRight, CheckCircle2, Star
} from "lucide-react"

const ESPIA_PRODUCTS = [
  {
    id: "gafas-camara-hd",
    title: "Gafas de Sol con Cámara Oculta Full HD 1080p",
    price: 49.99,
    oldPrice: 69.99,
    badge: "Más Vendido",
    img: "/images/camaras-espia/gafas-camara-espia.jpg",
    specs: ["Grabación de Video & Fotos 1080p", "Lente invisible frontal", "Batería recargable integrada", "Soporta MicroSD hasta 128GB", "Diseño moderno y ligero"],
    desc: "Captura lo importante sin que nadie lo note. Diseño elegante con tecnología avanzada para grabación de video y toma de fotos en alta definición."
  },
  {
    id: "cargador-camara-wifi",
    title: "Cargador de Pared USB con Micro Cámara Oculta Wi-Fi",
    price: 39.99,
    oldPrice: 55.00,
    badge: "100% Invisible",
    img: "/images/lotes_nuevos/foto_10.jpg",
    specs: ["Transmisión en vivo por App móvil", "Alimentación continua 24/7", "Detección de movimiento", "Graba en bucle automático", "Carga celulares de verdad"],
    desc: "Parece un cargador normal pero transmite audio y video en tiempo real directamente a tu smartphone desde cualquier lugar."
  },
  {
    id: "perchero-camara",
    title: "Perchero de Pared con Cámara Espía y Sensor PIR",
    price: 34.99,
    oldPrice: 48.00,
    badge: "Ideal Hogar / Oficina",
    img: "/images/lotes_nuevos/foto_11.jpg",
    specs: ["Activación por detección de movimiento", "Batería de larga duración", "Ángulo de visión 90°", "Fácil fijación en cualquier pared"],
    desc: "Instálalo en la entrada o dormitorio. Graba discretamente cada vez que alguien pasa frente al sensor."
  },
  {
    id: "reloj-despertador-espia",
    title: "Reloj Despertador Digital con Cámara Oculta Visión Nocturna",
    price: 45.00,
    oldPrice: 65.00,
    badge: "Visión Nocturna",
    img: "/images/lotes_nuevos/foto_12.jpg",
    specs: ["Visión nocturna por infrarrojos invisibles", "Hora real funcional", "Audio bidireccional", "Conexión Wi-Fi P2P"],
    desc: "El accesorio perfecto de mesa de noche para vigilar tu habitación o negocio de día y de noche."
  },
  {
    id: "lapicero-grabador",
    title: "Lapicero Ejecutivo con Microcámara HD & Grabador de Voz",
    price: 28.50,
    oldPrice: 38.00,
    badge: "Portátil Élite",
    img: "/images/lotes_nuevos/foto_13.jpg",
    specs: ["Escribe con tinta real", "Micrófono de alta fidelidad", "Botón de un solo toque", "Conexión USB plug & play"],
    desc: "Llévalo en tu bolsillo de camisa para reuniones o acuerdos importantes con grabación nítida."
  }
]

export default function CamarasEspiaClient() {
  const [selectedProduct, setSelectedProduct] = useState(ESPIA_PRODUCTS[0])

  const handleOrderWhatsApp = (p: typeof ESPIA_PRODUCTS[0]) => {
    const msg = `🕵️ *PEDIDO DISPOSITIVO ESPÍA DISCRETO*%0A%0A` +
      `*Producto:* ${encodeURIComponent(p.title)}%0A` +
      `*Precio Promocional:* $${p.price} USD%0A%0A` +
      `_Deseo coordinar el envío con entrega 100% confidencial y empaque discreto._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-rose-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[500px] h-[500px] rounded-full bg-rose-600/15 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <EyeOff className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-rose-400">DISCREET</span></span>
          </Link>

          <Link
            href="/web"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a Ofertas
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} /> Discreción • Tecnología • Seguridad
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Vigilancia Invisible: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
              Cámaras Ocultas & Micro Dispositivos
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Tecnología que te acompaña, discreción que te protege. Graba video Full HD y audio con total naturalidad sin levantar sospechas.
          </p>
        </motion.div>
      </section>

      {/* Product Catalog Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ESPIA_PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-rose-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-black uppercase tracking-wider border border-rose-500/20">
                    {p.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star size={13} fill="currentColor" /> 4.9 / 5.0
                  </div>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-rose-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {p.desc}
                </p>

                <div className="mt-6 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Especificaciones:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {p.specs.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-rose-400 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-white/5 mt-4">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-2xl font-black text-rose-400">${p.price}</span>
                    <span className="text-xs text-slate-500 line-through ml-2">${p.oldPrice}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Envío 100% Discreto
                  </span>
                </div>

                <button
                  onClick={() => handleOrderWhatsApp(p)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-sm hover:brightness-110 shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Comprar por WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discreet Delivery Guarantee Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Empaque Neutro y Máxima Confidencialidad</h4>
              <p className="text-xs text-slate-400">Todos los pedidos se despachan en cajas selladas sin logotipos de seguridad exterior.</p>
            </div>
          </div>
          <button
            onClick={() => handleOrderWhatsApp(ESPIA_PRODUCTS[0])}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all shrink-0"
          >
            Consultar Asesoría Privada
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Línea de Vigilancia Discreta.</p>
      </footer>
    </div>
  )
}
