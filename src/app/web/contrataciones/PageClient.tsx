"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Briefcase, Users, Star, ArrowRight, ShieldCheck, Zap,
  CheckCircle2, Clock, MapPin, Phone, MessageSquare, Send,
  TrendingUp, Award, Laptop, Lock, ChevronRight, Sparkles
} from "lucide-react"

export default function ContratacionesClient() {
  const [activeTab, setActiveTab] = useState<"inicio" | "trabajo-fijo" | "comisiones">("inicio")
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    ciudad: "Quito",
    puesto: "Ingeniero en Redes",
    experiencia: "",
    disponibilidad: "4 Horas al día"
  })
  const [sent, setSent] = useState(false)

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `👋 *NUEVA POSTULACIÓN - ATOMIC RECLUTAMIENTO*%0A%0A` +
      `*Nombre:* ${encodeURIComponent(formData.nombre)}%0A` +
      `*Teléfono:* ${encodeURIComponent(formData.telefono)}%0A` +
      `*Ciudad:* ${encodeURIComponent(formData.ciudad)}%0A` +
      `*Puesto:* ${encodeURIComponent(formData.puesto)}%0A` +
      `*Disponibilidad:* ${encodeURIComponent(formData.disponibilidad)}%0A` +
      `*Experiencia:* ${encodeURIComponent(formData.experiencia || 'No especificada')}%0A%0A` +
      `_Enviado desde el Ecosistema de Contrataciones Atomic_`
    
    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Briefcase className="text-white" size={20} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">TALENT</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Ecosistema de Contrataciones</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/web/contrataciones/login"
              className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <Lock size={15} className="text-cyan-400" />
              <span>Login Contrataciones</span>
            </Link>
            <Link
              href="/web"
              className="hidden sm:flex text-slate-400 hover:text-white text-sm font-semibold transition-colors"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative z-10 pt-12 pb-8 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Convocatorias Abiertas 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Únete a la Revolución Tecnológica de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Atomic Industries</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mt-4">
            Buscamos profesionales apasionados por el desarrollo web, redes, instalaciones inteligentes y ventas digitales. Estabilidad, flexibilidad y oportunidades reales de crecimiento.
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab("inicio")}
              className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === "inicio" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white"
              }`}
            >
              <Briefcase size={16} /> Vacantes Abiertas
            </button>
            <button
              onClick={() => setActiveTab("trabajo-fijo")}
              className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === "trabajo-fijo" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white"
              }`}
            >
              <Award size={16} /> Trabajo Fijo
            </button>
            <button
              onClick={() => setActiveTab("comisiones")}
              className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === "comisiones" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25" : "text-slate-300 hover:text-white"
              }`}
            >
              <TrendingUp size={16} /> Ventas $450/mes
            </button>
          </div>
        </motion.div>
      </section>

      {/* Main Tab Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "inicio" && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Vacancy Cards Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* 1. Ingeniero en Redes & Desarrollo */}
                <div className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-xl">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-500/20">
                        Desarrollo & Redes
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                        <Clock size={13} /> 4 Horas / Día
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                      Ingeniero en Redes & Web
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">
                      Forma parte de nuestro equipo de desarrollo y trabaja en proyectos que marcan la diferencia.
                    </p>

                    <div className="mt-6 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Requisitos:</h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                          <span>Exp. en desarrollo Web HTML (Frontend / Backend)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                          <span>Conocimiento en lenguajes y bases de datos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                          <span>Conocimientos en redes (deseable)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                          <span>Proactivo, responsable y ganas de aprender</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
                      <h4 className="text-xs font-bold uppercase text-cyan-300 tracking-wider mb-2">Te Ofrecemos:</h4>
                      <p className="text-xs text-slate-300">
                        Capacitación y certificaciones profesionales, flexibilidad de trabajo en proyectos e innovación constante.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5">
                    <button
                      onClick={() => {
                        setFormData({ ...formData, puesto: "Ingeniero en Redes & Web" })
                        document.getElementById("formulario-postulacion")?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                    >
                      Postular a esta Vacante <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* 2. Personal Técnico Instalador */}
                <div className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-xl">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/20">
                        Técnico de Campo
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                        <MapPin size={13} /> Quito & Alrededores
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                      Técnico de Instalaciones
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">
                      Integración de cercos eléctricos, videoporteros, cámaras Wi-Fi y sistemas de control de acceso.
                    </p>

                    <div className="mt-6 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Requisitos:</h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                          <span>Manejo de herramientas e instalaciones eléctricas básicas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                          <span>Disposición de trabajo en equipo y atención al cliente</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                          <span>Puntualidad, honestidad y proactividad</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                      <h4 className="text-xs font-bold uppercase text-emerald-300 tracking-wider mb-2">Te Ofrecemos:</h4>
                      <p className="text-xs text-slate-300">
                        Pagos puntuales por obra o sueldo fijo, bono por rendimiento y entrenamiento en tecnologías Smart.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5">
                    <button
                      onClick={() => {
                        setFormData({ ...formData, puesto: "Técnico de Instalaciones" })
                        document.getElementById("formulario-postulacion")?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                    >
                      Postular a esta Vacante <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* 3. Vendedor Digital desde Celular */}
                <div className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/20">
                        Ventas Digitales
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                        <Phone size={13} /> 100% Desde Celular
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                      Gana hasta $450 al Mes
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">
                      Sin inversión inicial. Vende el catálogo de Atomic desde WhatsApp, Marketplace y redes.
                    </p>

                    <div className="mt-6 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Esquema Rápido:</h4>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="block text-slate-400">1 Venta</span>
                          <strong className="text-amber-400 text-sm">$10</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="block text-slate-400">2 Ventas</span>
                          <strong className="text-amber-400 text-sm">$30</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="block text-slate-400">3 Ventas</span>
                          <strong className="text-amber-400 text-sm">$50</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20">
                      <h4 className="text-xs font-bold uppercase text-amber-300 tracking-wider mb-2">Alcance Especialista:</h4>
                      <p className="text-xs text-slate-300">
                        Ventas de $100 o más = <strong>Pago fijo de $450</strong> + Comisión adicional por cada venta.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5">
                    <button
                      onClick={() => {
                        setFormData({ ...formData, puesto: "Ventas Digitales desde Celular" })
                        document.getElementById("formulario-postulacion")?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
                    >
                      Postular a Ventas <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "trabajo-fijo" && (
            <motion.div
              key="trabajo-fijo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Programa de Trabajo Fijo & Estabilidad</h3>
                    <p className="text-slate-400 text-sm">Gana estabilidad laboral con sueldo base garantizado + comisiones por resultados.</p>
                  </div>
                </div>

                <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                  <p>
                    En <strong>Atomic Industries</strong> premiamos la constancia y el compromiso profesional. Si cumples con las metas estipuladas y demuestras un desempeño destacado, accedes de manera inmediata a nuestro esquema de <strong>Trabajo Fijo con Sueldo Base</strong>.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <ShieldCheck className="text-cyan-400 mb-2" size={24} />
                      <h4 className="font-bold text-white mb-1">1. Sueldo Base</h4>
                      <p className="text-xs text-slate-400">Ingresos fijos garantizados mes a mes para darte tranquilidad financiera.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <Zap className="text-cyan-400 mb-2" size={24} />
                      <h4 className="font-bold text-white mb-1">2. Bonos de Excelencia</h4>
                      <p className="text-xs text-slate-400">Comisiones adicionales ilimitadas según tu volumen de proyectos o ventas.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <Users className="text-cyan-400 mb-2" size={24} />
                      <h4 className="font-bold text-white mb-1">3. Afiliación Flexible</h4>
                      <p className="text-xs text-slate-400">Si deseas manejar tus propios tiempos, mantente como asesor afiliado 100% remoto.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "comisiones" && (
            <motion.div
              key="comisiones"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Vende desde tu Celular — Esquema de Ingresos</h3>
                    <p className="text-slate-400 text-sm">Tú pones la actitud, nosotros te damos todo el apoyo, catálogo y capacitación.</p>
                  </div>
                </div>

                {/* Commission Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Nivel / Rango</th>
                        <th className="py-3 px-4">Meta</th>
                        <th className="py-3 px-4">Pago / Comisión</th>
                        <th className="py-3 px-4">Beneficio Extra</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="py-4 px-4 font-bold text-white">1. Inicio Rápido</td>
                        <td className="py-4 px-4">1 Venta</td>
                        <td className="py-4 px-4 font-bold text-emerald-400">$10 USD</td>
                        <td className="py-4 px-4 text-xs text-slate-400">Acceso a catálogo mayorista</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold text-white">2. Intermedio</td>
                        <td className="py-4 px-4">2 Ventas</td>
                        <td className="py-4 px-4 font-bold text-emerald-400">$30 USD</td>
                        <td className="py-4 px-4 text-xs text-slate-400">Acompañamiento 1 a 1</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold text-white">3. Avanzado</td>
                        <td className="py-4 px-4">3 Ventas</td>
                        <td className="py-4 px-4 font-bold text-emerald-400">$50 USD</td>
                        <td className="py-4 px-4 text-xs text-slate-400">Guía de pautas y clientes</td>
                      </tr>
                      <tr className="bg-amber-500/10 font-bold">
                        <td className="py-4 px-4 text-amber-400">★ Alcance Especialista</td>
                        <td className="py-4 px-4 text-white">Ventas de $100 o más</td>
                        <td className="py-4 px-4 text-amber-400 text-lg">$450 FIJO + Comisión</td>
                        <td className="py-4 px-4 text-xs text-amber-200">Sueldo fijo mensual permanente</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    ¿Qué necesitas? Solo celular, conexión a internet y ganas de superarte. Sin inversión inicial.
                  </div>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, puesto: "Ventas Digitales desde Celular" })
                      document.getElementById("formulario-postulacion")?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shrink-0 ml-4"
                  >
                    Quiero Empezar Hoy
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Form Section */}
        <section id="formulario-postulacion" className="mt-20 max-w-3xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight">Formulario de Postulación Inmediata</h2>
              <p className="text-slate-400 text-sm mt-2">
                Completa tus datos y envíalos de forma directa a nuestro equipo de Recursos Humanos por WhatsApp.
              </p>
            </div>

            <form onSubmit={handleApply} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Santiago Ron"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Teléfono WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Ej. 0969043453"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    placeholder="Ej. Quito / Remoto"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Puesto de Interés *</label>
                  <select
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                  >
                    <option value="Ingeniero en Redes & Web">Ingeniero en Redes & Web</option>
                    <option value="Técnico de Instalaciones">Técnico de Instalaciones</option>
                    <option value="Ventas Digitales desde Celular">Ventas Digitales desde Celular</option>
                    <option value="Soporte y Reacondicionamiento">Soporte y Reacondicionamiento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Disponibilidad *</label>
                  <select
                    value={formData.disponibilidad}
                    onChange={(e) => setFormData({ ...formData, disponibilidad: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                  >
                    <option value="4 Horas al día">4 Horas al día</option>
                    <option value="Tiempo Completo (8h)">Tiempo Completo (8h)</option>
                    <option value="Fines de semana">Fines de semana</option>
                    <option value="Freelance / Flexible">Freelance / Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Breve Resumen de Experiencia / Habilidades</label>
                <textarea
                  rows={3}
                  value={formData.experiencia}
                  onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                  placeholder="Cuéntanos en qué te destacas o qué tecnologías manejas..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-lg hover:brightness-110 shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-3"
              >
                <Send size={20} />
                <span>Enviar Postulación por WhatsApp (0969043453)</span>
              </button>

              <p className="text-center text-xs text-slate-500">
                🔒 Tu información es 100% confidencial y tratada directamente por el área de Reclutamiento de Atomic Industries.
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Todos los derechos reservados. Quito, Ecuador.</p>
      </footer>
    </div>
  )
}
