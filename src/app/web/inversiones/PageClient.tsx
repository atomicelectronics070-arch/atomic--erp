"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  TrendingUp, ShieldCheck, DollarSign, ArrowRight, Award,
  Sparkles, CheckCircle2, Building, BarChart3, Lock, MessageSquare
} from "lucide-react"

export default function InversionesClient() {
  const [calculatorAmount, setCalculatorAmount] = useState(100)
  const [months, setMonths] = useState(12)

  const estimatedReturn = Math.round(calculatorAmount * 1.35) // 35% projected annual return

  const handleContactWhatsApp = () => {
    const msg = `👋 *CONSULTA ECOSISTEMA INVERSIONES FUTURA TECH*%0A%0A` +
      `*Monto de Inversión:* $${calculatorAmount} USD%0A` +
      `*Plazo:* ${months} Meses%0A` +
      `*Proyección Estimada:* $${estimatedReturn} USD%0A%0A` +
      `Deseo recibir el brochure oficial de accionistas y detalles de contrato.`
    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#060810]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">FUTURA <span className="text-cyan-400">TECH</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/30">Ecosistema Inversiones</span>
            </div>
          </div>

          <button
            onClick={handleContactWhatsApp}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <MessageSquare size={16} />
            <span>Hablar con un Asesor</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Innovación que Genera Valor
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Invierte <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">$100 USD</span> y Compra Acciones por 1 Año
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto mt-6">
            Forma parte de una empresa de tecnología con visión de futuro y participa en el crecimiento acelerado de un sector en constante expansión.
          </p>
        </motion.div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-black text-white">Crecimiento Sostenido</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Empresa tecnológica con proyección sólida y enfoque en innovación constante y diversificación de productos.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <DollarSign size={24} />
            </div>
            <h3 className="text-lg font-black text-white">Beneficios Constantes</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Recibe rendimientos periódicos durante 12 meses, respaldados por el desempeño comercial y operacional.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-black text-white">Transparencia & Seguridad</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Operaciones claras y seguras, con información periódica sobre el rendimiento y avances de la empresa.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Building size={24} />
            </div>
            <h3 className="text-lg font-black text-white">Tecnología que Transforma</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Soluciones innovadoras con impacto real en el mercado global y de alta demanda tecnológica.
            </p>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white">Simulador de Participación Accionaria</h2>
            <p className="text-slate-400 text-sm mt-2">Calcula tu proyección de retorno a 12 meses de beneficios constantes.</p>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-300">Monto a Invertir:</span>
                <span className="text-2xl font-black text-cyan-400">${calculatorAmount} USD</span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={50}
                value={calculatorAmount}
                onChange={(e) => setCalculatorAmount(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>$100 USD (Mínimo)</span>
                <span>$2,500 USD</span>
                <span>$5,000 USD</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-400">Plazo de Contrato</span>
                <strong className="text-xl font-bold text-white">12 Meses (1 Año)</strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-400">Retorno Proyectado Total</span>
                <strong className="text-2xl font-black text-emerald-400">~ ${estimatedReturn} USD</strong>
              </div>
            </div>

            <button
              onClick={handleContactWhatsApp}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-lg hover:brightness-110 shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Solicitar Participación por WhatsApp</span>
              <ArrowRight size={20} />
            </button>

            <p className="text-center text-xs text-slate-500">
              * La inversión en proyectos conlleva análisis de riesgos. Infórmate adecuadamente antes de formalizar.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Futura Tech & Atomic Capital. Ecosistema Privado de Inversiones.</p>
      </footer>
    </div>
  )
}
