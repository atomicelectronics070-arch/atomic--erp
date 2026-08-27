"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Store, Smartphone, MapPin, CheckCircle2, ArrowRight,
  Sparkles, MessageSquare, Laptop, ShieldCheck, HeartHandshake, Zap
} from "lucide-react"

export default function TiendaOnlineClient() {
  const handleConsultWhatsApp = (plan: string) => {
    const msg = `🚀 *CONSULTA DESARROLLO DE TIENDA EN LÍNEA / PÁGINA WEB*%0A%0A` +
      `*Plan de Interés:* ${encodeURIComponent(plan)}%0A` +
      `*Ubicación de Reunión:* Oficina El Labrador, Quito o Videollamada Online%0A%0A` +
      `_Deseo recibir una propuesta personalizada para digitalizar mi negocio._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Store className="text-white" size={20} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-emerald-400">STUDIO</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Desarrollo Web & Tiendas</span>
            </div>
          </div>

          <Link
            href="/web"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a Servicios
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <MapPin size={14} /> Desde Quito • Oficina en El Labrador
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Impulsa tu Negocio con tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Propia Tienda en Línea
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto mt-6">
            Creamos soluciones digitales para que vendas más, con soporte continuo y acompañamiento real. ¡Gestiona todos tus pedidos y clientes directamente desde tu celular!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Smartphone size={15} className="text-emerald-400" /> Fácil de gestionar desde tu celular
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <ShieldCheck size={15} className="text-emerald-400" /> Soporte continuo durante 1 año
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <HeartHandshake size={15} className="text-emerald-400" /> Reuniones presenciales cuando lo necesites
            </span>
          </div>
        </motion.div>
      </section>

      {/* Plans Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl">
            <div>
              <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-black uppercase">
                Landing Page Express
              </span>
              <h3 className="text-2xl font-black text-white mt-4">Página de Presentación</h3>
              <p className="text-xs text-slate-400 mt-2">Ideal para marcas personales, servicios y captación de clientes por WhatsApp.</p>
              
              <ul className="mt-6 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Diseño moderno 100% responsivo para móviles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Botones de contacto directo a WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Dominio .com + Hosting por 1 año</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <span className="text-3xl font-black text-emerald-400">$180 USD</span>
              <button
                onClick={() => handleConsultWhatsApp("Landing Page Express ($180)")}
                className="w-full mt-4 py-3 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Empezar Proyecto</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 to-teal-950/30 border border-emerald-500/40 transition-all flex flex-col justify-between shadow-2xl relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
              Más Recomendado
            </span>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase">
                Tienda Online Completa
              </span>
              <h3 className="text-2xl font-black text-white mt-4">E-Commerce con Carrito</h3>
              <p className="text-xs text-slate-300 mt-2">Vende tus productos las 24 horas del día con catálogo autoadministrable.</p>
              
              <ul className="mt-6 space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Catálogo ilimitado de productos y categorías</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Pasarela de pagos con tarjetas de crédito / débito</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Panel de administración desde tu celular</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Capacitación personalizada presencial o por Zoom</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <span className="text-3xl font-black text-emerald-400">$390 USD</span>
              <button
                onClick={() => handleConsultWhatsApp("Tienda Online Completa ($390)")}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Solicitar Tienda Online</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl">
            <div>
              <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-black uppercase">
                Sistema Web a Medida
              </span>
              <h3 className="text-2xl font-black text-white mt-4">Plataforma Empresarial</h3>
              <p className="text-xs text-slate-400 mt-2">Para empresas con requerimientos de inventarios, roles y conexión a ERPs.</p>
              
              <ul className="mt-6 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Desarrollo personalizado en Next.js y bases de datos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Integración de facturación electrónica SRI</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>SLA de soporte técnico y servidor dedicado</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <span className="text-3xl font-black text-emerald-400">Cotización a Medida</span>
              <button
                onClick={() => handleConsultWhatsApp("Sistema Web a Medida")}
                className="w-full mt-4 py-3 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Conversar con un Ingeniero</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Desarrollo Web, E-Commerce y Soluciones Digitales. Quito, Ecuador.</p>
      </footer>
    </div>
  )
}
