"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Bot, MessageSquare, PhoneCall, Calendar, FileText, CheckCircle2,
  ArrowRight, Sparkles, Zap, ShieldCheck, Database, BarChart3, Clock,
  DollarSign, Send, Play
} from "lucide-react"

const MODULES = [
  {
    id: "atiende",
    title: "1. Módulo ATIENDE (24/7 sin pausas)",
    subtitle: "El bot que atiende y cotiza automáticamente en WhatsApp, Instagram y Facebook",
    icon: MessageSquare,
    color: "from-orange-500 to-amber-500",
    features: [
      "Flujos lógicos avanzados que guían al cliente hasta la venta",
      "Escarba en la base de productos en tiempo real (precios y stock)",
      "Genera cotizaciones en PDF instantáneas con diseño oficial",
      "Exporta reportes diarios en Excel de leads y pedidos",
      "Atención 24/7 los 365 días del año sin intervención humana"
    ]
  },
  {
    id: "facturacion",
    title: "2. Módulo FACTURACIÓN & SRI",
    subtitle: "Emisión de comprobantes autorizados y cobranza automática",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Conectado directamente a tu cuenta del SRI de Ecuador",
      "Emite facturas electrónicas, notas de crédito y retenciones",
      "Histórico ordenado de todos tus comprobantes y clientes",
      "Envío automático de comprobantes por WhatsApp y correo",
      "Recordatorios automáticos de pagos y vencimientos"
    ]
  },
  {
    id: "llama",
    title: "3. Módulo LLAMA (Voz IA Natural)",
    subtitle: "Llamadas telefónicas salientes inteligentes y profesionales",
    icon: PhoneCall,
    color: "from-emerald-500 to-teal-500",
    features: [
      "Llamadas ordenadas siguiendo secuencias lógicas de prospección",
      "Voz con entonación natural, fluida y empática",
      "Confirmación de pedidos, citas y cobranzas pendientes",
      "Registro de respuestas y clasificación automática de interesados",
      "Gestión completa de llamadas sin salir del sistema"
    ]
  },
  {
    id: "agenda",
    title: "4. Módulo AGENDA (Tu tiempo optimizado)",
    subtitle: "Reserva y sincronización de citas y reuniones",
    icon: Calendar,
    color: "from-purple-500 to-pink-500",
    features: [
      "Registro cronológico ordenado de citas y compromisos",
      "Recordatorios automáticos por WhatsApp antes de cada reunión",
      "Sincronización multiplataforma con Google Calendar y Outlook",
      "Reportes de tiempo y disponibilidad en tiempo real"
    ]
  }
]

export default function AutomatizacionClient() {
  const [selectedPlan, setSelectedPlan] = useState<"mensual" | "anual">("mensual")

  const handleActivateBotWhatsApp = (modTitle?: string) => {
    const msg = `🤖 *SOLICITUD DE ACTIVACIÓN DE BOT INTELIGENTE ATOMIC SYSTEMS*%0A%0A` +
      `*Plan Seleccionado:* Todo en Uno ($99 USD / Mes)%0A` +
      `*Módulos Incluidos:* Atiende 24/7 + Facturación SRI + Llama (Voz IA) + Agenda%0A` +
      (modTitle ? `*Interés Principal:* ${encodeURIComponent(modTitle)}%0A` : '') +
      `\nDeseo agendar una demo en vivo y activar el bot para mi negocio.`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-orange-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-orange-600/15 blur-[160px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Bot className="text-slate-950" size={22} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-orange-400">SYSTEMS</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">IA & Automatización</span>
            </div>
          </Link>

          <button
            onClick={() => handleActivateBotWhatsApp()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
          >
            <Zap size={14} />
            <span>Activa Tu Bot Hoy</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Tecnología que Impulsa tu Negocio
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Ten un Bot Inteligente que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Trabaja por Ti 24/7
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto mt-6">
            Atiende mensajes, genera cotizaciones en PDF, emite facturas conectadas al SRI, realiza llamadas con voz natural y agenda reuniones. Sin pausas. Sin errores.
          </p>

          {/* Pricing Highlight Hero Card */}
          <div className="mt-10 p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-orange-500/30 backdrop-blur-2xl max-w-xl mx-auto shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Todo el Sistema Incluido por Solo</span>
            <div className="flex items-baseline justify-center gap-2 my-2">
              <span className="text-6xl font-black text-white">$99</span>
              <span className="text-xl text-slate-400 font-bold">/ Mes</span>
            </div>
            <p className="text-xs text-slate-300">
              Tu bot inteligente trabaja por ti para que tú te enfoques en crecer.
            </p>

            <button
              onClick={() => handleActivateBotWhatsApp()}
              className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-base hover:brightness-110 shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} />
              <span>Activar mi Bot por WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* 4 Pillars Modules Detailed Showcase */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          {MODULES.map((mod) => {
            const Icon = mod.icon
            return (
              <div
                key={mod.id}
                className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-orange-500/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{mod.title}</h3>
                      <span className="text-xs text-slate-400">{mod.subtitle}</span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    {mod.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-orange-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Incluido en el Plan de $99/mes</span>
                  <button
                    onClick={() => handleActivateBotWhatsApp(mod.title)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-slate-950 text-white font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Probar Módulo</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Business Impact Highlights */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-yellow-950/20 border border-orange-500/30 grid sm:grid-cols-4 gap-6 text-center">
          <div>
            <Clock size={28} className="text-orange-400 mx-auto mb-2" />
            <strong className="block text-2xl font-black text-white">24 / 7 / 365</strong>
            <span className="text-xs text-slate-400">Atención sin pausas</span>
          </div>
          <div>
            <DollarSign size={28} className="text-orange-400 mx-auto mb-2" />
            <strong className="block text-2xl font-black text-white">-80%</strong>
            <span className="text-xs text-slate-400">Reducción de costos operativos</span>
          </div>
          <div>
            <Zap size={28} className="text-orange-400 mx-auto mb-2" />
            <strong className="block text-2xl font-black text-white">&lt; 3 Segundos</strong>
            <span className="text-xs text-slate-400">Respuesta y cotización instantánea</span>
          </div>
          <div>
            <ShieldCheck size={28} className="text-orange-400 mx-auto mb-2" />
            <strong className="block text-2xl font-black text-white">100% Legal</strong>
            <span className="text-xs text-slate-400">Conexión directa con SRI</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Systems. Inteligencia Artificial y Automatización de Procesos Comerciales.</p>
      </footer>
    </div>
  )
}
