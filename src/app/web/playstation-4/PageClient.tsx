"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Gamepad2, ShieldCheck, Gift, CheckCircle2, ArrowRight,
  Sparkles, Wrench, RefreshCw, Cpu, Award, MessageSquare, Truck
} from "lucide-react"

export default function PlayStationClient() {
  const [selectedStorage, setSelectedStorage] = useState<"500gb" | "1tb">("1tb")

  const handleOrderWhatsApp = (type: "ps4-bundle" | "control-gaming") => {
    let msg = ""
    if (type === "ps4-bundle") {
      msg = `🎮 *PEDIDO PLAYSTATION 4 SLIM REACONDICIONADA CERTIFICADA*%0A%0A` +
        `*Consola:* PS4 Slim (${selectedStorage.toUpperCase()})%0A` +
        `*Precio Fijo:* $325 USD%0A` +
        `*Incluye:* 2 Controles DualShock + Parlante Bluetooth de Regalo + Cables HDMI/Poder%0A` +
        `*Garantía:* 2 Años de Respaldo + Mantenimiento Preventivo Gratis a los 6 Meses%0A%0A` +
        `_Deseo confirmar el pedido y coordinar entrega inmediata._`
    } else {
      msg = `🎮 *PEDIDO CONTROL WIRELESS BLUETOOTH GAMING (AMC-2885)*%0A%0A` +
        `*Precio Especial:* $29.99 USD%0A` +
        `*Compatibilidad:* PC, Android, iOS, Consolas%0A` +
        `*Promoción:* Envío 100% Gratis + Audífonos de Cable de Regalo%0A%0A` +
        `_Deseo confirmar la compra inmediata._`
    }

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Gamepad2 className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-indigo-400">GAMING</span></span>
          </Link>

          <Link
            href="/web/mantenimiento-consolas"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Wrench size={14} className="text-indigo-400" />
            <span>Servicio Técnico de Consolas</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Reacondicionamiento Técnico Certificado
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            PlayStation 4 Slim Reacondicionada: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
              Máxima Calidad al Mejor Precio
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Inspeccionadas y optimizadas por nuestro equipo de ingenieros electrónicos. Incluye 2 controles, parlante de regalo y 2 años de garantía total.
          </p>
        </motion.div>
      </section>

      {/* Main PS4 Offer Showcase */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl">
          
          {/* Left: Highlights & Includes */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-500/30">
                Combo Completo
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Truck size={12} /> Envío Gratis Nacional
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white">
              PlayStation 4 Slim 1TB + Pack Completo
            </h2>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-300 text-xs">
              <Gift size={20} className="shrink-0 text-amber-400" />
              <span><strong>¡REGALO EXCLUSIVO POR TU COMPRA!</strong> Incluye Parlante Bluetooth Portátil gratis con tu consola.</span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">¿Qué incluye este paquete?</h4>
              <ul className="space-y-2 text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  <span><strong>Consola PS4 Slim:</strong> 100% testeada, pasta térmica cambiada y ventilación optimizada.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  <span><strong>2 Controles Incluidos:</strong> Listos para jugar multijugador con tus amigos o familia.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  <span><strong>Parlante de Regalo:</strong> Audio inalámbrico compacto para tus sesiones.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  <span><strong>Cables completos:</strong> HDMI de alta velocidad, cable de poder y cable de carga.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                  <span><strong>Garantía de 2 Años:</strong> Con mantenimiento preventivo gratuito a los 6 meses de uso.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
              <div>
                <span className="block text-xs text-slate-400">Precio Fijo Garantizado</span>
                <span className="text-4xl font-black text-indigo-400">$325 <span className="text-lg text-slate-400">USD</span></span>
              </div>
              <span className="text-xs text-slate-400">Stock Limitado Disponible</span>
            </div>

            <button
              onClick={() => handleOrderWhatsApp("ps4-bundle")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-black text-lg hover:brightness-110 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare size={20} />
              <span>Comprar PS4 Slim por WhatsApp</span>
            </button>
          </div>

          {/* Right: Technical Certification Process */}
          <div className="space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="text-indigo-400" size={20} />
              <span>Proceso de Reacondicionamiento Técnico</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nuestro equipo comercial y de soporte electrónico certificado rastrea e inspecciona exhaustivamente cada consola para asegurar el más alto estándar operativo:
            </p>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block mb-1">1. Desensamble y Limpieza Ultrasónica</strong>
                <p className="text-slate-400">Eliminación completa de polvo y residuos en disipador, lector óptico y ventilador.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block mb-1">2. Cambio de Pasta Térmica Premium</strong>
                <p className="text-slate-400">Aplicación de pasta térmica de alta conductividad para evitar sobrecalentamiento y ruido.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block mb-1">3. Test de Rendimiento en Carga 48h</strong>
                <p className="text-slate-400">Pruebas continuas de lectura, gráficos, conectividad Wi-Fi, puertos HDMI y Bluetooth.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bonus Product: Wireless Gaming Controller */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-blue-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase">
              Accesorio Destacado • COD: AMC-2885
            </span>
            <h3 className="text-2xl font-black text-white">
              Control Bluetooth Wireless Gaming para PC, Android e iOS
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Diseño ergonómico, batería recargable sin límites, iluminación LED y conexión de baja latencia. <strong>¡Incluye audífonos de cable de regalo y envío gratis!</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-center sm:text-right">
              <span className="text-3xl font-black text-indigo-400">$29.99 USD</span>
              <span className="block text-[10px] text-emerald-400 font-bold">+ Audífonos Gratis</span>
            </div>
            <button
              onClick={() => handleOrderWhatsApp("control-gaming")}
              className="px-6 py-3.5 rounded-xl bg-indigo-500 text-white font-black text-sm hover:bg-indigo-400 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <MessageSquare size={16} />
              <span>Pedir Control</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Gaming. Especialistas en Consolas y Reacondicionamiento.</p>
      </footer>
    </div>
  )
}
