"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  QrCode, ShieldCheck, Ticket, Users, BarChart3, Lock,
  CheckCircle2, ArrowRight, Sparkles, MessageSquare, Laptop, Building2
} from "lucide-react"

export default function SoftwareQrClient() {
  const handleDemoWhatsApp = () => {
    const msg = `💻 *SOLICITUD DE DEMO - SOFTWARE CONTROL POR QR / TICKETS*%0A%0A` +
      `*Módulos Requeridos:* Registro de Visitantes + Generación de QRs Dinámicos + Integración Torniquetes/Barreras%0A%0A` +
      `_Deseo agendar una demostración en vivo y cotización según mi número de accesos._`

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
              <QrCode className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">ACCESS QR</span></span>
          </Link>

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Control de Acceso & Automatización de Entradas
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Software de Control de Acceso por <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
              Códigos QR Dinámicos & Tickets
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto mt-4">
            Genera códigos QR temporales para visitantes, socios o empleados. Controla torniquetes, barreras vehiculares y puertas peatonales con reportes de aforo en tiempo real.
          </p>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <QrCode size={24} />
            </div>
            <h3 className="text-xl font-black text-white">Invitaciones por QR en WhatsApp</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Los residentes o administradores envían invitaciones con códigos QR únicos por WhatsApp con validez por fecha y hora o de un solo uso.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Ticket size={24} />
            </div>
            <h3 className="text-xl font-black text-white">Tickets & Registro de Visitantes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Impresión instantánea de tickets térmicos con lector óptico en garita. Historial completo con cédula, placa vehicular y fotos.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-black text-white">Reportes y Auditoría en Vivo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Panel administrativo en la nube accesible desde cualquier navegador. Gráficos de horas pico, aforo actual y descargas en Excel.
            </p>
          </div>
        </div>

        {/* CTA Box */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-teal-950/20 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">¿Listo para modernizar los accesos de tu condominio o empresa?</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Compatible con lectoras QR 2D de alta velocidad, barreras automáticas y electrocerraduras de cualquier marca.
            </p>
          </div>

          <button
            onClick={handleDemoWhatsApp}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-base hover:brightness-110 shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2 shrink-0"
          >
            <MessageSquare size={18} />
            <span>Solicitar Demostración</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Systems. Sistemas de Control de Acceso y Gestión de Aforo.</p>
      </footer>
    </div>
  )
}
