"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Building2, Users, ShoppingBag, ShieldCheck, FileText, 
  MapPin, Sparkles, ArrowRight, Activity, Cpu, Key, UserCheck, Bot,
  Send, ArrowLeft, Loader2
} from "lucide-react"

type OfficeZone = "ventas" | "inventario" | "coordinacion" | "prospeccion"

const FIXED_PROFILES = [
  {
    role: "ADMIN",
    title: "ADMINISTRACIÓN CENTRAL",
    email: "atomic@administrador.com",
    emoji: "🛡️",
    badge: "Visión 360° • Supervisión Maestro",
    color: "from-rose-500 to-pink-600",
    glow: "border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]",
    tag: "ADMIN_ROOT",
    area: "Directiva",
  },
  {
    role: "TECHMAN",
    title: "JEFE DE TECNOLOGÍA",
    email: "atomic@techman.com",
    emoji: "💻",
    badge: "Hardware & Redes • Servidores",
    color: "from-purple-500 to-indigo-600",
    glow: "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    tag: "TECH_LEAD",
    area: "Tecnología",
  },
  {
    role: "SOFTMAN",
    title: "JEFE DE SISTEMAS & IA",
    email: "atomic@softman.com",
    emoji: "⚙️",
    badge: "Desarrollo ERP • Automatizaciones",
    color: "from-cyan-500 to-blue-600",
    glow: "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    tag: "SYS_LEAD",
    area: "Sistemas",
  },
  {
    role: "COORDINATOR",
    title: "DEPARTAMENTO DE COORDINACIÓN",
    email: "atomic@cordinacion.com",
    emoji: "🎯",
    badge: "Supervisión Asesores • Leads",
    color: "from-amber-500 to-orange-600",
    glow: "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    tag: "COORD_LEAD",
    area: "Coordinación",
  },
  {
    role: "MEDIA",
    title: "DEPARTAMENTO DE EDICIÓN & MEDIA",
    email: "atomic@media.com",
    emoji: "📢",
    badge: "Contenido • Blogs • Redes",
    color: "from-emerald-500 to-teal-600",
    glow: "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    tag: "MEDIA_LEAD",
    area: "Marketing",
  },
]

export default function VirtualOfficeWorkspace({ currentModule = "ventas" }: { currentModule?: string }) {
  const [activeZone, setActiveZone] = useState<OfficeZone>("ventas")
  const [avatarPos, setAvatarPos] = useState({ x: 20, y: 25 })
  const [systemUsers, setSystemUsers] = useState<any[]>([])
  const [showAIChat, setShowAIChat] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [zoneChats, setZoneChats] = useState<Record<string, {sender: "user" | "bot", text: string}[]>>({
    ventas: [{ sender: "bot", text: "¡Hola! Soy tu asistente de ventas. ¿Necesitas un guión para cerrar una venta de NFC, o ayuda estructurando una cotización?" }],
    inventario: [{ sender: "bot", text: "Hola, estoy listo para ayudarte con el inventario, control de stock y fichas técnicas de nuestros productos." }],
    coordinacion: [{ sender: "bot", text: "Saludos. Supervisemos juntos las metas semanales y organicemos las bitácoras diarias." }],
    prospeccion: [{ sender: "bot", text: "Radar activo. Escríbeme qué buscar o cómo calificar los leads de Google Maps." }]
  })

  useEffect(() => {
    fetch("/api/admin/manage-users")
      .then(r => r.json())
      .then(d => {
        if (d.users) setSystemUsers(d.users)
      })
      .catch(() => {})
  }, [])

  const handleSendZoneMessage = async () => {
    const text = chatInput.trim()
    if (!text || isChatLoading) return

    const updatedChats = { ...zoneChats }
    updatedChats[activeZone] = [...(updatedChats[activeZone] || []), { sender: "user", text }]
    setZoneChats(updatedChats)
    setChatInput("")
    setIsChatLoading(true)

    let roleOverride = "SALESPERSON"
    let botNameOverride = "Asesor Ventas"
    if (activeZone === "inventario") {
      roleOverride = "MANAGEMENT"
      botNameOverride = "Logística Bot"
    } else if (activeZone === "coordinacion") {
      roleOverride = "COORDINATOR"
      botNameOverride = "Coordinador Bot"
    } else if (activeZone === "prospeccion") {
      roleOverride = "PROSPECTION_BOT"
      botNameOverride = "Radar Bot"
    }

    try {
      const res = await fetch("/api/personal-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          isNamingBot: false,
          currentPath: zones[activeZone].link,
          roleOverride,
          botNameOverride
        })
      })
      const data = await res.json()
      updatedChats[activeZone] = [...updatedChats[activeZone], { sender: "bot", text: data.text || "Sin respuesta." }]
      setZoneChats({ ...updatedChats })
    } catch (err) {
      updatedChats[activeZone] = [...updatedChats[activeZone], { sender: "bot", text: "Error conectando con la IA de la estación." }]
      setZoneChats({ ...updatedChats })
    } finally {
      setIsChatLoading(false)
    }
  }

  const zones = {
    ventas: {
      code: "STATION-V01",
      title: "Módulo de Ventas",
      desc: "Emisión acelerada de PDF con cálculo de impuestos y firma digital.",
      link: "/dashboard/quotes",
      icon: FileText,
      color: "from-indigo-600 to-purple-600",
      glow: "shadow-[0_0_30px_rgba(99,102,241,0.4)]",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      avatarEmoji: "👨‍💼",
      avatarRole: "Asesor Comercial (Avatar)",
      avatarStatus: "Enfocado en Cierre de Ventas",
      stats: "Sistema de Cotizaciones Activo",
      x: 20,
      y: 25
    },
    inventario: {
      code: "STATION-I02",
      title: "Módulo de Inventario",
      desc: "Catálogo completo con precios, stock en tiempo real y fichas técnicas.",
      link: "/dashboard/shop",
      icon: ShoppingBag,
      color: "from-purple-600 to-pink-600",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      avatarEmoji: "📦",
      avatarRole: "Encargado de Logística (Avatar)",
      avatarStatus: "Stock Actualizado al 100%",
      stats: "2,480 Productos Listados",
      x: 70,
      y: 25
    },
    coordinacion: {
      code: "STATION-C03",
      title: "Módulo de Coordinación",
      desc: "Asignación de tareas, seguimiento de metas y supervisión diaria.",
      link: "/dashboard/coordinacion",
      icon: ShieldCheck,
      color: "from-pink-600 to-rose-600",
      glow: "shadow-[0_0_30px_rgba(236,72,153,0.4)]",
      badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/30",
      avatarEmoji: "👔",
      avatarRole: "Coordinador General (Avatar)",
      avatarStatus: "Supervisando Operaciones",
      stats: "5 Metas Activas",
      x: 20,
      y: 75
    },
    prospeccion: {
      code: "STATION-P04",
      title: "Prospección",
      desc: "Radar satelital para prospección comercial de nuevos negocios.",
      link: "/dashboard/map-prospecting",
      icon: MapPin,
      color: "from-blue-600 to-indigo-600",
      glow: "shadow-[0_0_30px_rgba(37,99,235,0.4)]",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      avatarEmoji: "📡",
      avatarRole: "Agente de Inteligencia (Avatar)",
      avatarStatus: "Radar Escaneando Zona",
      stats: "+2,200 Prospectos",
      x: 70,
      y: 75
    }
  }

  const handleSelectZone = (zoneKey: OfficeZone) => {
    setActiveZone(zoneKey)
    setAvatarPos({ x: zones[zoneKey].x, y: zones[zoneKey].y })
    setShowAIChat(false)
  }

  const current = zones[activeZone]

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl p-6 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden space-y-12">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* SECTION 1: HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Entorno Interactivo Virtual ATOMIC v4.0</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Building2 className="text-indigo-400" />
            <span>Estaciones de Trabajo</span>
          </h2>
        </div>

        {/* Quick Zone Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {(Object.keys(zones) as OfficeZone[]).map((key) => {
            const z = zones[key]
            const isSelected = activeZone === key
            return (
              <button
                key={key}
                onClick={() => handleSelectZone(key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  isSelected 
                    ? 'bg-gradient-to-r ' + z.color + ' text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-sm">{z.avatarEmoji}</span>
                <span className="hidden sm:inline capitalize">{key}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* SECTION 2: 2.5D INTERACTIVE FLOORPLAN + ZONE DETAILS */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Floorplan (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative min-h-[440px] flex flex-col justify-between overflow-hidden shadow-inner group">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="relative z-10 flex justify-between items-center text-[11px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-3">
            <span className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-400 animate-pulse" />
              <span>Mapa Laboral</span>
            </span>
            <span className="text-indigo-400 font-bold">Estaciones Operativas</span>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6 my-auto py-6">
            {(Object.keys(zones) as OfficeZone[]).map((key) => {
              const z = zones[key]
              const Icon = z.icon
              const isActive = activeZone === key

              return (
                <div
                  key={key}
                  onClick={() => handleSelectZone(key)}
                  className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden group ${
                    isActive 
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-indigo-500 ' + z.glow
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl border ${z.badgeColor}`}>
                        <Icon size={18} />
                      </div>
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                        {z.avatarEmoji}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{z.code}</span>
                  </div>

                  <h3 className={`font-black text-sm md:text-base mb-1 transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {z.title.split('Módulo de ')[1] || z.title}
                  </h3>
                  
                  <p className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {z.avatarStatus}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono">
                      {z.avatarRole.split(' (')[0]}
                    </span>
                    <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">Ir a Estación →</span>
                  </div>
                </div>
              )
            })}
          </div>

          <motion.div 
            animate={{ x: `${avatarPos.x}%`, y: `${avatarPos.y}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 z-30 pointer-events-none flex flex-col items-center"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center text-black font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.9)] animate-bounce">
              👾
            </div>
            <span className="px-2 py-0.5 bg-black/90 text-[9px] font-mono font-bold text-amber-400 rounded-full border border-amber-500/40 whitespace-nowrap -mt-1 shadow-md">
              Tú (Operador)
            </span>
          </motion.div>
        </div>

        {/* Details Card (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[440px]">
          {showAIChat ? (
            <div className="flex flex-col h-full justify-between space-y-4">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowAIChat(false)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{current.avatarEmoji}</span>
                      <span>IA de {current.title.split('Módulo de ')[1] || current.title}</span>
                    </h4>
                    <p className="text-[9px] font-mono text-emerald-400">En Línea</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Chat Messages scroll window */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[260px] min-h-[240px] text-xs font-sans scrollbar-thin scrollbar-thumb-slate-800">
                {(zoneChats[activeZone] || []).map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-none shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                        : 'bg-slate-950 border border-slate-800/80 text-slate-100 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950 border border-slate-800/80 px-3 py-2 rounded-2xl rounded-bl-none flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2 items-center pt-2 border-t border-slate-800/60">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendZoneMessage()}
                  placeholder={`Preguntar a ${current.avatarRole.split(' (')[0]}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
                />
                <button
                  onClick={handleSendZoneMessage}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${current.badgeColor}`}>
                    {current.code}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Estación Activa</span>
                </div>

                <div className="flex items-center space-x-4 mb-6 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-md">
                    {current.avatarEmoji}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{current.avatarRole}</h4>
                    <p className="text-[11px] text-emerald-400 font-mono font-bold">{current.avatarStatus}</p>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-3 leading-tight">{current.title}</h3>
                <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">{current.desc}</p>

                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Estadística de Operación</span>
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>{current.stats}</span>
                  </p>
                </div>
              </div>

              {/* Redirection / AI Chat buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowAIChat(true)}
                  className="flex-1 py-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-wider text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Bot size={13} className="text-emerald-400" />
                  <span>Hablar con IA</span>
                </button>
                <Link
                  href={current.link}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-wider text-white bg-gradient-to-r ${current.color} shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 group`}
                >
                  <span>Ir a Área</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: DEPARTAMENTOS Y CUENTAS MATRIZ FIJAS */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Cpu className="text-cyan-400" />
              <span>Departamentos Fijos & Conexión Directa a Bots Matriz</span>
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Cuentas corporativas fijas con etiqueta única e Inteligencia Artificial individual en la base de datos
            </p>
          </div>
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold rounded-full">
            5 Cuentas Matrices Conectadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FIXED_PROFILES.map((prof) => {
            const matchedUser = systemUsers.find(u => u.email === prof.email)
            const botName = matchedUser?.personalBot?.botName || "Bot Activo"

            return (
              <div 
                key={prof.email}
                className={`bg-slate-900/90 border p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-all ${prof.glow}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl">
                      {prof.emoji}
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {prof.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-white text-xs leading-snug">{prof.title}</h4>
                    <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">{prof.email}</p>
                  </div>

                  <p className="text-[10px] text-slate-300 font-medium leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    {prof.badge}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Bot size={12} className="text-emerald-400" /> IA Personal:
                    </span>
                    <span className="text-emerald-400 font-bold">{botName}</span>
                  </div>
                  <Link
                    href="/dashboard/admin/personal-management"
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-mono font-bold text-center block text-slate-200 hover:text-white transition-colors"
                  >
                    Ver IA & Reporte →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 4: RED DE VENDEDORES & ASESORES DEL SISTEMA */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Users className="text-emerald-400" />
              <span>Vendedores & Asesores Registrados en el Sistema</span>
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Tarjetas dinámicas de todo el personal con indicador de bot asignado y rendimiento
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold rounded-full">
            {systemUsers.length} Usuarios Registrados
          </span>
        </div>

        {systemUsers.length === 0 ? (
          <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs font-mono text-slate-500">
            Cargando vendedores y asesores...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemUsers.map((usr) => {
              const days = Math.floor((Date.now() - new Date(usr.createdAt).getTime()) / 86400000)
              const botName = usr.personalBot?.botName

              return (
                <div 
                  key={usr.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-emerald-400 text-sm shrink-0">
                      {(usr.name?.[0] || usr.email[0]).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-xs truncate">
                        {usr.name} {usr.lastName || ""}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 truncate">{usr.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono text-indigo-400 font-bold">
                          {usr.role}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {days}d en ATOMIC
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right space-y-1">
                    {botName ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Bot size={10} /> {botName}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-500 block">Sin bot</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
