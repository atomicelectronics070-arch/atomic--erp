"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Wifi, ShieldCheck, Video, Battery, Smartphone, CheckCircle2,
  ArrowRight, Sparkles, MessageSquare, Star, Truck, Eye, Wrench
} from "lucide-react"

const WIFI_CAMERAS = [
  {
    id: "cam-bateria-1080p",
    name: "Cámara Wi-Fi Smart Alimentada con Batería Recargable",
    subtitle: "Cámaras económicas de alto rendimiento para múltiples puntos de visión",
    price: 38.00,
    oldPrice: 52.00,
    badge: "100% Inalámbrica",
    specs: [
      "Resolución Full HD 1080p nítida",
      "Batería recargable integrada de larga duración (cero cables)",
      "Visión nocturna automática de alta claridad",
      "Detección de movimiento con alertas push al celular",
      "Ranura para tarjeta Micro SD y almacenamiento seguro en nube",
      "Base magnética y montaje multiposición"
    ]
  },
  {
    id: "imou-exterior-360",
    name: "Cámara Exterior Profesional IMOU con Antena Wi-Fi Dual",
    subtitle: "Cobertura 360° con micrófono integrado e imagen HD",
    price: 49.90,
    oldPrice: 68.00,
    badge: "Exterior IP66",
    specs: [
      "Rotación y paneo 360° para máxima libertad de vigilancia",
      "Micrófono integrado para escuchar y grabar audio ambiental",
      "Antena Wi-Fi dual para recepción de señal a larga distancia",
      "Protección a prueba de intemperie y lluvia IP66",
      "Visión nocturna a color con reflectores LED incorporados",
      "App móvil IMOU Life con acceso multiusuario"
    ]
  }
]

const USE_CASES = [
  { title: "Locales Comerciales & Tiendas", desc: "Supervisa clientes, cajas registradoras e inventario desde tu teléfono." },
  { title: "Garitas de Vigilancia & Entradas", desc: "Registro claro de placas vehiculares y peatones sin tender cables largos." },
  { title: "Guarderías & Cuartos de Niños", desc: "Monitoreo constante con audio bidireccional para tranquilidad de los padres." },
  { title: "Hogares & Patios Interiores", desc: "Disuasión activa de intrusos con alertas instantáneas de movimiento." },
  { title: "Bodegas & Galpones Industriales", desc: "Vigilancia de áreas extensas con cobertura de visión nocturna ampliada." }
]

export default function CamarasWifiClient() {
  const [includeConfig, setIncludeConfig] = useState(true)

  const handleOrderWhatsApp = (cam: typeof WIFI_CAMERAS[0]) => {
    const msg = `📹 *SOLICITUD CÁMARA DE SEGURIDAD WI-FI*%0A%0A` +
      `*Cámara:* ${encodeURIComponent(cam.name)}%0A` +
      `*Precio Promoción:* $${cam.price} USD%0A` +
      `*Configuración & Puesta en Marcha:* ${includeConfig ? 'INCLUIDA (Te dejamos la App lista y configurada)' : 'Solo Equipo'}%0A%0A` +
      `_Deseo confirmar el pedido y coordinar entrega inmediata._`

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
              <Wifi className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">VISION</span></span>
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> 100% Wi-Fi • Cero Cables • Fácil Instalación
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Cámaras de Seguridad Wi-Fi Económicas de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Alto Rendimiento para Múltiples Puntos
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto mt-4">
            Vigila tu negocio, hogar o garita en tiempo real desde tu celular. Implementación y configuración incluida para que no te compliques con cables.
          </p>
        </motion.div>
      </section>

      {/* Cameras Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {WIFI_CAMERAS.map((cam) => (
            <div
              key={cam.id}
              className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-500/20">
                    {cam.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star size={13} fill="currentColor" /> 4.9 / 5.0
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  {cam.name}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {cam.subtitle}
                </p>

                <div className="mt-6 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Ventajas:</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {cam.specs.map((s, idx) => (
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
                    <span className="text-3xl font-black text-cyan-400">${cam.price} USD</span>
                    <span className="text-xs text-slate-500 line-through">${cam.oldPrice}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">✓ Configuración Móvil Incluida</span>
                </div>

                <button
                  onClick={() => handleOrderWhatsApp(cam)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <MessageSquare size={16} />
                  <span>Comprar por WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Multiple Customer Types Showcase */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white">Diseñadas para Diversos Tipos de Negocios y Espacios</h3>
            <p className="text-slate-400 text-xs mt-1">Una solución adaptable para cualquier requerimiento de seguridad.</p>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {USE_CASES.map((u, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <strong className="block text-white text-xs font-bold mb-1">{u.title}</strong>
                <p className="text-[11px] text-slate-400">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Cámaras de Seguridad Wi-Fi y Circuitos Cerrados.</p>
      </footer>
    </div>
  )
}
