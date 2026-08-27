"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Zap, Sun, Fuel, Volume2, VolumeX, ShieldCheck, ArrowRight,
  CheckCircle2, XCircle, Sparkles, RefreshCw, ShoppingCart, MessageSquare, Plus
} from "lucide-react"

const GENERADORES = [
  {
    id: "gen-solar-1000",
    name: "Estación Solar Portátil Atomic EcoPower 1000W / 1024Wh",
    type: "electrico",
    price: 649,
    img: "/images/lotes_nuevos/foto_17.jpg",
    features: ["Cero humo / Silencioso", "Batería LiFePO4 3000 ciclos", "Carga con panel solar o pared", "Ideal para interiores y departamentos"]
  },
  {
    id: "gen-solar-2000",
    name: "Generador Solar Atomic ProMax 2400W / 2048Wh",
    type: "electrico",
    price: 1199,
    img: "/images/lotes_nuevos/foto_18.jpg",
    features: ["Potencia para refrigerador y herramientas", "Carga ultra rápida 1.2h", "App de monitoreo Bluetooth/Wi-Fi", "Amigable con el medio ambiente"]
  },
  {
    id: "gen-gas-3500",
    name: "Generador a Gasolina Atomic Thunder 3500W 4T",
    type: "gasolina",
    price: 420,
    img: "/images/lotes_nuevos/foto_19.jpg",
    features: ["Alta potencia continua", "Autonomía de 8 horas continuas", "Arranque manual y eléctrico", "Uso rudo en exteriores y obras"]
  }
]

const PANELES = [
  { id: "sin-panel", name: "Sin Paneles Solares adicionales", price: 0 },
  { id: "panel-100w", name: "Panel Solar Plegable Monocristalino 100W", price: 89 },
  { id: "panel-200w", name: "Panel Solar de Alta Eficiencia 200W IP68", price: 165 },
  { id: "panel-400w", name: "Panel Solar Bifacial Ultra 400W", price: 295 }
]

const ACCESORIOS = [
  { id: "cable-mc4", name: "Kit de Cables de Extensión Solar MC4 (5m)", price: 25 },
  { id: "funda-protectora", name: "Funda Protectora Acolchada e Impermeable", price: 35 },
  { id: "adaptador-auto", name: "Cable de Carga Rápida para Auto 12V/24V", price: 18 }
]

export default function GeneradoresClient() {
  const [activeTab, setActiveTab] = useState<"versus" | "configurador">("configurador")
  
  // Builder state
  const [selectedGen, setSelectedGen] = useState(GENERADORES[0])
  const [selectedPanel, setSelectedPanel] = useState(PANELES[1])
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([ACCESORIOS[0].id])

  const toggleAccessory = (accId: string) => {
    if (selectedAccessories.includes(accId)) {
      setSelectedAccessories(selectedAccessories.filter(id => id !== accId))
    } else {
      setSelectedAccessories([...selectedAccessories, accId])
    }
  }

  const accessoriesTotal = selectedAccessories.reduce((sum, accId) => {
    const item = ACCESORIOS.find(a => a.id === accId)
    return sum + (item ? item.price : 0)
  }, 0)

  const totalPrice = selectedGen.price + selectedPanel.price + accessoriesTotal

  const handleCheckoutWhatsApp = () => {
    const accNames = selectedAccessories.map(id => ACCESORIOS.find(a => a.id === id)?.name).filter(Boolean).join(", ")
    const msg = `⚡ *COTIZACIÓN DE COMBO GENERADOR + PANELES + ACCESORIOS*%0A%0A` +
      `*1. Generador:* ${encodeURIComponent(selectedGen.name)} ($${selectedGen.price})%0A` +
      `*2. Panel Solar:* ${encodeURIComponent(selectedPanel.name)} ($${selectedPanel.price})%0A` +
      `*3. Accesorios:* ${encodeURIComponent(accNames || 'Ninguno')} ($${accessoriesTotal})%0A%0A` +
      `*💰 TOTAL DEL COMBO:* $${totalPrice} USD (IVA Incluido)%0A%0A` +
      `_Deseo confirmar disponibilidad y tiempo de entrega._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-600/15 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-emerald-400">ENERGY</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("versus")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "versus" ? "bg-white/10 text-white border border-white/20" : "text-slate-400 hover:text-white"
              }`}
            >
              Comparativa VS
            </button>
            <button
              onClick={() => setActiveTab("configurador")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "configurador" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              Configurador de Combos
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-12 pb-6 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sun size={14} /> Soluciones Energéticas 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Generadores Eléctricos <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">+ Paneles + Accesorios</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Energía silenciosa, limpia y renovable para tu hogar, negocio o actividades al aire libre. Arma tu combo a la medida con entrega inmediata.
          </p>
        </motion.div>
      </section>

      {/* Tab 1: Versus Comparison */}
      {activeTab === "versus" && (
        <section className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Eléctrico / Solar */}
            <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  Energía Limpia
                </span>
                <VolumeX className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-2xl font-black text-white">Generadores Eléctricos / Solares</h2>
              <p className="text-xs text-slate-400 mt-2">100% ecológicos, sin humos y silenciosos.</p>

              <div className="mt-6 space-y-4">
                <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Ventajas Clave:</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Cero Emisiones:</strong> Seguro de usar dentro de casas o departamentos.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>100% Silencioso:</strong> No produce ruidos molestos.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Recargable con Sol:</strong> Conéctalo a paneles solares y olvídate del combustible.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Mantenimiento Cero:</strong> No requiere cambios de aceite ni bujías.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveTab("configurador")}
                className="w-full mt-8 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <span>Configurar mi Kit Solar</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Gasolina */}
            <div className="p-8 rounded-3xl bg-amber-950/20 border border-amber-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider">
                  Combustión Tradicional
                </span>
                <Fuel className="text-amber-400" size={24} />
              </div>
              <h2 className="text-2xl font-black text-white">Generadores a Gasolina</h2>
              <p className="text-xs text-slate-400 mt-2">Potencia bruta para obras y emergencias externas.</p>

              <div className="mt-6 space-y-4">
                <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider">Características:</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                    <span><strong>Alta Potencia de Arranque:</strong> Para maquinaria pesada.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle size={16} className="text-rose-400 shrink-0" />
                    <span><strong>Emite Gases Tóxicos:</strong> Solo puede ser usado al aire libre.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle size={16} className="text-rose-400 shrink-0" />
                    <span><strong>Ruidoso:</strong> Nivel sonoro elevado (70dB - 90dB).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle size={16} className="text-rose-400 shrink-0" />
                    <span><strong>Gasto Continuo:</strong> Depende constantemente de gasolina y aceite.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveTab("configurador")}
                className="w-full mt-8 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
              >
                <span>Ver Modelos Disponibles</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Interactive Combo Builder */}
      {activeTab === "configurador" && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left: 3 Configuration Steps */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Step 1: Generador */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">1</span>
                  <h3 className="text-xl font-black text-white">Selecciona tu Generador Base</h3>
                </div>

                <div className="space-y-4">
                  {GENERADORES.map((gen) => (
                    <div
                      key={gen.id}
                      onClick={() => setSelectedGen(gen)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        selectedGen.id === gen.id ? "bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10" : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">{gen.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                            gen.type === 'electrico' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {gen.type === 'electrico' ? 'Eco Solar' : 'Gasolina'}
                          </span>
                        </div>
                        <ul className="mt-2 text-xs text-slate-400 space-y-1">
                          {gen.features.slice(0, 2).map((f, i) => (
                            <li key={i}>• {f}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right sm:text-right shrink-0">
                        <span className="block text-2xl font-black text-emerald-400">${gen.price} USD</span>
                        <span className="text-[10px] text-slate-400">IVA Incluido</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Paneles Solares */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">2</span>
                  <h3 className="text-xl font-black text-white">Añadir Panel Solar (Opcional)</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {PANELES.map((panel) => (
                    <div
                      key={panel.id}
                      onClick={() => setSelectedPanel(panel)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPanel.id === panel.id ? "bg-emerald-500/10 border-emerald-500" : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <h4 className="font-bold text-white text-sm">{panel.name}</h4>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-black text-emerald-400">
                          {panel.price === 0 ? "Sin Panel" : `+$${panel.price} USD`}
                        </span>
                        {selectedPanel.id === panel.id && (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Accesorios */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">3</span>
                  <h3 className="text-xl font-black text-white">Accesorios Complementarios</h3>
                </div>

                <div className="space-y-3">
                  {ACCESORIOS.map((acc) => {
                    const isChecked = selectedAccessories.includes(acc.id)
                    return (
                      <div
                        key={acc.id}
                        onClick={() => toggleAccessory(acc.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked ? "bg-emerald-500/10 border-emerald-500" : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded accent-emerald-500"
                          />
                          <span className="text-sm text-slate-200 font-semibold">{acc.name}</span>
                        </div>
                        <span className="font-black text-emerald-400 text-sm">+$${acc.price} USD</span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Right: Realtime Summary Sticky Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl space-y-6">
                <h3 className="text-xl font-black text-white border-b border-white/10 pb-4">Resumen del Combo</h3>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Generador:</span>
                    <strong className="text-white text-right max-w-[160px] truncate">{selectedGen.name}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Precio Generador:</span>
                    <span className="font-bold text-white">${selectedGen.price} USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Panel Solar:</span>
                    <span className="font-bold text-white">{selectedPanel.price === 0 ? "Ninguno" : `+$${selectedPanel.price} USD`}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Accesorios ({selectedAccessories.length}):</span>
                    <span className="font-bold text-white">+${accessoriesTotal} USD</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-bold text-slate-400">Total del Combo:</span>
                    <span className="text-3xl font-black text-emerald-400">${totalPrice} USD</span>
                  </div>
                  <span className="block text-right text-[11px] text-slate-500">IVA 15% Incluido</span>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-base hover:brightness-110 shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  <span>Cotizar Combo por WhatsApp</span>
                </button>

                <div className="text-[11px] text-slate-400 space-y-1 text-center">
                  <p>🚚 Envío seguro a todo el Ecuador</p>
                  <p>🛡️ Garantía oficial de 1 a 2 años</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Línea de Generadores y Energía Solar.</p>
      </footer>
    </div>
  )
}
