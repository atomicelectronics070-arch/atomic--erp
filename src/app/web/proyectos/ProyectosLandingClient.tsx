"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, Building2, Home, Camera, Lock, Zap, CheckCircle2, 
  ArrowRight, Phone, MessageSquare, Mail, MapPin, Clock, Award, 
  Wrench, Users, ChevronRight, Sparkles, Send, Check, AlertCircle,
  FileCheck, ShieldCheck, Cpu, BatteryCharging, Radio
} from "lucide-react"

export default function ProyectosLandingClient() {
  const formRef = useRef<HTMLDivElement>(null)

  // Form State
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [projectType, setProjectType] = useState("Casa / Residencia Familiar")
  const [city, setCity] = useState("Quito (Centro / Norte / Sur)")
  const [message, setMessage] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const officialWhatsapp = "593980319050"
  const formattedWhatsapp = "098 031 9050"

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/landing-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          projectType,
          city,
          message
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setIsSuccess(true)
      } else {
        setErrorMsg(data.error || "Ocurrió un error al enviar. Por favor intenta de nuevo.")
      }
    } catch (err: any) {
      setErrorMsg("Error de conexión. Puedes escribirnos directamente a WhatsApp.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const CATEGORIAS_TECNOLOGICAS = [
    {
      icon: <Building2 className="text-blue-400" size={28} />,
      title: "Edificios, Torres & Condominios",
      desc: "Centrales colectivas de citofonía inteligente (Intelbras Collective para 4 a 24 departamentos), desvío de llamadas del portero a celulares de los copropietarios y apertura remota de accesos.",
      tags: ["Citofonía Colectiva", "App Móvil", "Apertura Remota", "Cableado UTP"]
    },
    {
      icon: <Lock className="text-amber-400" size={28} />,
      title: "Cerraduras Inteligentes & Biometría 3D",
      desc: "Cerraduras WiFi con reconocimiento facial 3D, sensor biométrico de huella, código dinámico y pestillos de 5 pistones de alta seguridad. Ideales para puertas residenciales y oficinas.",
      tags: ["Reconocimiento Facial 3D", "Tuya Smart", "5 Pistones", "Auditoría"]
    },
    {
      icon: <Camera className="text-cyan-400" size={28} />,
      title: "CCTV 4K & Cámaras con IA",
      desc: "Sistemas de videovigilancia de alta resolución para interiores y exteriores IP66 con autotracking 360°, visión nocturna Full Color 24/7 y grabación continua en NVR sin cuotas mensuales.",
      tags: ["Visión Full Color", "Autotracking 360°", "Intemperie IP66", "NVR Central"]
    },
    {
      icon: <Zap className="text-yellow-400" size={28} />,
      title: "Cercos Eléctricos Perimetrales",
      desc: "Protección perimetral disuasiva de alto voltaje con electrificadores certificados JFL y Hagroy, baterías de respaldo de 12V, sirenas de 30W y monitoreo en tiempo real desde tu smartphone.",
      tags: ["Alto Voltaje JFL/Hagroy", "Batería Respaldo", "Sirena 30W", "App Alertas"]
    },
    {
      icon: <Users className="text-purple-400" size={28} />,
      title: "Control de Acceso Peatonal & Vehicular",
      desc: "Torniquetes trípode y molinetes en acero inoxidable ZKTeco, barreras vehiculares automáticas Dítec de 2.0s y telepeaje RFID para urbanizaciones, clubes y empresas.",
      tags: ["Torniquetes ZKTeco", "Barreras Dítec", "Tags RFID", "LPR Placas"]
    },
    {
      icon: <BatteryCharging className="text-emerald-400" size={28} />,
      title: "Respaldo Energético & Estaciones LiFePO4",
      desc: "Generadores solares y estaciones eléctricas portátiles Anker SOLIX C300 con baterías LiFePO4 para mantener encendidos tus sistemas de seguridad, routers y cámaras durante apagones.",
      tags: ["LiFePO4 Durabilidad", "Sin Ruido ni Humo", "Carga Solar", "Respaldo 24/7"]
    }
  ]

  const PILARES_EXPERIENCIA = [
    {
      icon: <Award className="text-amber-400" size={26} />,
      title: "Ingeniería & Equipos Originales",
      desc: "Suministro directo de fábrica con facturación electrónica SRI y marcas líderes a nivel mundial (Hikvision, Dahua, ZKTeco, Intelbras, JFL, Anker)."
    },
    {
      icon: <Wrench className="text-blue-400" size={26} />,
      title: "Instalación Técnica Certificada",
      desc: "Personal capacitado en normativas eléctricas, canalización estética en tubería EMT/PVC pesada y configuración de redes para cero fallas."
    },
    {
      icon: <ShieldCheck className="text-emerald-400" size={26} />,
      title: "Garantía & Respaldo Permanente",
      desc: "De 1 a 3 años de garantía oficial en equipos e instalación. Soporte técnico continuo y atención postventa para copropietarios y administradores."
    },
    {
      icon: <Users className="text-purple-400" size={26} />,
      title: "Capacitación & Puesta a Punto",
      desc: "Te enseñamos paso a paso a usar las aplicaciones móviles, gestionar permisos de acceso y monitorear tus cámaras sin depender de terceros."
    }
  ]

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden">

      {/* ── BACKGROUND AMBIENT GLOWS ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-600/10 blur-[170px]" />
        <div className="absolute top-[25%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[180px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-emerald-500/10 blur-[170px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* ── STICKY TOPBAR ── */}
      <header className="sticky top-0 z-40 bg-[#060813]/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/web" 
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-slate-800/60 border border-slate-800"
            >
              <span>← Tienda ATOMIC</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-purple-300 uppercase hidden sm:inline-block">
                DIVISIÓN DE PROYECTOS & INFRAESTRUCTURA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToForm}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Solicitar Asesoría</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <main className="relative z-10">
        <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold tracking-widest uppercase">
              <Shield size={14} className="text-purple-400 animate-pulse" />
              <span>INGENIERÍA RESIDENCIAL, EDIFICIOS & SEGURIDAD ELECTRÓNICA</span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-heading leading-tight">
              Proyectos de Tecnología, Seguridad y Automatización para <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Residencias</span> y <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">Edificios</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Diseño integral, suministro directo de fábrica, instalación especializada y configuración técnica en sitio. Protegemos casas familiares, conjuntos residenciales, condominios y empresas en todo el Ecuador con respaldo y garantía constante.
            </p>

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={scrollToForm}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <FileCheck size={18} />
                <span>Registrar Mi Proyecto / Cotización</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={`https://wa.me/${officialWhatsapp}?text=${encodeURIComponent("Hola ATOMIC! Vi sus videos y deseo información técnica para un proyecto de infraestructura / seguridad en mi propiedad.")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={17} />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>

            {/* GUARANTEE PILLS */}
            <div className="pt-6 flex flex-wrap justify-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700">✓ Visita Técnica en Quito Sin Costo</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700">✓ Garantía de 1 a 3 Años</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700">✓ Facturación SRI Autorizada</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700">✓ Cobertura Nacional</span>
            </div>
          </motion.div>
        </section>

        {/* ── SHOWCASE DE CATEGORÍAS ── */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto py-12">
          <div className="space-y-3 mb-10 text-center">
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
              ÁREAS DE ESPECIALIDAD TÉCNICA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-heading text-white">
              Sistemas de Seguridad & Infraestructura
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Cada equipo está homologado y seleccionado para garantizar máxima vida útil y estabilidad operativa bajo condiciones exigentes de uso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIAS_TECNOLOGICAS.map((cat, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-950 w-fit border border-slate-800">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-black text-white font-heading">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
                  >
                    <span>Cotizar esta Solución</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PILARES DE EXPERIENCIA & METODOLOGÍA ── */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto py-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-indigo-950/40 border border-slate-800">
            <div className="space-y-3 mb-10 text-center max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">
                METODOLOGÍA PROFESIONAL DE INGENIERÍA
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-heading text-white">
                ¿Por qué confiar tu proyecto a ATOMIC?
              </h2>
              <p className="text-sm text-slate-400">
                No solo vendemos cajas; ejecutamos proyectos llave en mano con respaldo técnico integral.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILARES_EXPERIENCIA.map((p, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 w-fit border border-slate-800">
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-sm text-white font-heading">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORMULARIO PRINCIPAL DE REGISTRO (DESTACADO & AMIGABLE) ── */}
        <section ref={formRef} id="formulario-proyecto" className="px-4 sm:px-6 max-w-4xl mx-auto py-12 scroll-mt-24">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-purple-500/40 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Form */}
            <div className="text-center space-y-3 mb-8">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-purple-300 bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/30 inline-block">
                FORMULARIO DE ASESORÍA TÉCNICA
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-heading text-white">
                Cuéntanos sobre tu Proyecto
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Nosotros resolvemos tus problemas de infraestructura para lograr proyectos de tecnología de primer nivel: desde la selección de equipos e implementación técnica, hasta capacitación y garantía permanente.
              </p>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-black text-white font-heading">
                  ¡Solicitud Recibida con Éxito!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200 max-w-md mx-auto leading-relaxed">
                  Gracias <strong>{firstName}</strong>. Uno de nuestros ingenieros se pondrá en contacto contigo a la brevedad para asesorarte y coordinar la propuesta técnica o visita en sitio.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${officialWhatsapp}?text=${encodeURIComponent(`Hola ATOMIC! Acabo de enviar una solicitud para mi proyecto de ${projectType} en ${city}. Mi nombre es ${firstName} ${lastName}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
                  >
                    <MessageSquare size={15} />
                    <span>Confirmar por WhatsApp Inmediatamente</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false)
                      setFirstName("")
                      setLastName("")
                      setPhone("")
                      setMessage("")
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Enviar Otra Solicitud
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase text-slate-300">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ej. Juan Carlos"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase text-slate-300">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ej. Guzmán"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase text-slate-300">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 098 031 9050"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase text-slate-300">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ej. contacto@empresa.com"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase text-slate-300">
                      Tipo de Inmueble / Proyecto
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="Casa / Residencia Familiar">🏠 Casa / Residencia Familiar</option>
                      <option value="Edificio de Departamentos">🏢 Edificio de Departamentos</option>
                      <option value="Conjunto Residencial / Urbanización">🏘️ Conjunto Residencial / Urbanización</option>
                      <option value="Local Comercial / Tienda">🛍️ Local Comercial / Tienda</option>
                      <option value="Empresa / Industria / Bodega">🏭 Empresa / Industria / Bodega</option>
                      <option value="Obra en Construcción">🏗️ Obra en Construcción</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase text-slate-300">
                      Ciudad o Sector
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="Quito (Centro / Norte / Sur)">Quito (Centro / Norte / Sur)</option>
                      <option value="Cumbayá / Tumbaco / Valles">Cumbayá / Tumbaco / Valles</option>
                      <option value="Valle de los Chillos">Valle de los Chillos</option>
                      <option value="Guayaquil / Samborondón">Guayaquil / Samborondón</option>
                      <option value="Cuenca">Cuenca</option>
                      <option value="Otra provincia del Ecuador">Otra provincia del Ecuador</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase text-slate-300">
                    Cuéntanos tu Necesidad o Problema a Resolver
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe cuántos departamentos son, qué equipos buscas (cámaras, videoportero, cerco, cerradura), si necesitas instalación o visita técnica..."
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registrando Solicitud...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Enviar Solicitud de Asesoría Técnica</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── FOOTER SIMPLE ── */}
        <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 font-mono">
          <p>© 2027 ATOMIC Ecuador • Ingeniería en Proyectos de Seguridad, Infraestructura & Tecnología.</p>
        </footer>
      </main>

      {/* ── FLOATING ACTION PILL ── */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <a
          href={`https://wa.me/${officialWhatsapp}?text=${encodeURIComponent("Hola ATOMIC! Deseo asesoría directa sobre un proyecto de seguridad / tecnología.")}`}
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-2xl hover:scale-105 transition-all flex items-center justify-center"
          title="Escribir por WhatsApp"
        >
          <MessageSquare size={20} />
        </a>

        <button
          onClick={scrollToForm}
          className="px-4 py-3 rounded-full bg-slate-900/90 border border-purple-500/40 text-purple-200 hover:text-white hover:bg-slate-800 text-xs font-bold font-mono uppercase tracking-wider shadow-2xl transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
        >
          <span>Cotizar Proyecto</span>
          <ArrowRight size={13} />
        </button>
      </div>

    </div>
  )
}
