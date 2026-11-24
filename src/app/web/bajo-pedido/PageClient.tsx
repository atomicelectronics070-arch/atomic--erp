"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PackageSearch,
  Plane,
  Ship,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  Server,
  Cpu,
  Factory,
  Boxes,
  Clock,
  Calculator,
  CheckCircle2
} from "lucide-react";

const CATEGORIES = [
  {
    id: "servers",
    icon: Server,
    title: "Servidores & Clusters IA",
    subtitle: "Racks empresariales, GPUs NVIDIA RTX/A100, Xeon y EPYC",
    leadTimeAir: "7-10 días",
    badge: "Enterprise"
  },
  {
    id: "industrial",
    icon: Factory,
    title: "Maquinaria & Motores",
    subtitle: "Plantas bloqueras, motores brushless, brazos vehiculares",
    leadTimeAir: "15-25 días marítimo",
    badge: "Heavy Duty"
  },
  {
    id: "wholesale",
    icon: Boxes,
    title: "Lotes & Stock Mayorista",
    subtitle: "Pallets de consolas PS4/PS5, iPhones, laptops corporativas",
    leadTimeAir: "5-8 días aéreo",
    badge: "Volumen B2B"
  },
  {
    id: "special",
    icon: Cpu,
    title: "Electrónica Especializada",
    subtitle: "Módulos IoT, antenas RFID, placas de control y repuestos únicos",
    leadTimeAir: "6-9 días",
    badge: "Ingeniería"
  }
];

export default function BajoPedidoPage() {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id);
  const [itemName, setItemName] = useState("");
  const [budget, setBudget] = useState("");
  const [shippingMode, setShippingMode] = useState<"aereo" | "maritimo">("aereo");
  const [notes, setNotes] = useState("");

  const currentCat = CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0];

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const item = itemName.trim() || currentCat.title;
    const msg = encodeURIComponent(
      `📦 *SOLICITUD DE IMPORTACIÓN BAJO PEDIDO ATOMIC*\n\n` +
      `📁 *Categoría:* ${currentCat.title}\n` +
      `🎯 *Equipo o Lote Solicitado:* ${item}\n` +
      `💰 *Presupuesto Estimado:* ${budget.trim() ? `$${budget.trim()} USD` : "A convenir / Mejor precio"}\n` +
      `✈️ *Modalidad de Despacho:* ${shippingMode === "aereo" ? "Aéreo Express (5-10 días)" : "Marítimo Consolidado (25-35 días)"}\n` +
      `${notes.trim() ? `📝 *Detalles Técnicos:* ${notes.trim()}\n` : ""}\n` +
      `_Deseo cotización formal con aranceles, seguro y entrega directa en Ecuador._`
    );
    window.open(`https://wa.me/593969043453?text=${msg}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white pb-24">
      {/* Background Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[180px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 px-6 py-4 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            A
          </div>
          <div>
            <span className="font-heading font-black tracking-wider text-sm text-white group-hover:text-cyan-400 transition-colors">
              ATOMIC <span className="text-cyan-400 font-mono text-xs">// IMPORTACIONES</span>
            </span>
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Canal Oficial Bajo Pedido
            </span>
          </div>
        </Link>

        <Link
          href="/web"
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Volver a la Tienda
        </Link>
      </nav>

      {/* Hero Header */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-inner">
          <Sparkles size={13} className="text-cyan-400 animate-pulse" />
          <span>CANAL LOGÍSTICO INTERNACIONAL • USA, CHINA & EUROPA</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-heading">
          IMPORTACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">BAJO PEDIDO</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          ¿Buscas un equipo o lote que no está en catálogo local? Gestionamos la compra internacional, flete aéreo o marítimo, nacionalización aduanera y entrega con factura y garantía en Ecuador.
        </p>

        {/* Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-300 pt-2">
          <span className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <ShieldCheck size={14} className="text-emerald-400" /> Compra 100% Asegurada
          </span>
          <span className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Clock size={14} className="text-cyan-400" /> Tiempos de Entrega Exactos
          </span>
          <span className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <CheckCircle2 size={14} className="text-indigo-400" /> Nacionalización Incluida
          </span>
        </div>
      </section>

      {/* Categories Bento Selection */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-12">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">
          1. Selecciona la División del Equipo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.25)] scale-[1.02]"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 border border-slate-700">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-sm text-white mb-1">{cat.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">{cat.subtitle}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Tránsito:</span>
                  <span className="text-cyan-400 font-bold">{cat.leadTimeAir}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Interactive Quotation Form */}
      <section className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Calculator size={20} />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-white">Configura tu Requerimiento</h2>
              <p className="text-xs font-mono text-slate-400">Cotización formal en menos de 2 horas vía WhatsApp</p>
            </div>
          </div>

          <form onSubmit={handleSendWhatsApp} className="space-y-6">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                ¿Qué producto, modelo o especificación necesitas? *
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Ej: Lote de 10 PS5 Slim, Servidor Dell PowerEdge R750, etc."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Presupuesto Estimado (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Ej: 1500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Modalidad de Despacho
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingMode("aereo")}
                    className={`py-3 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border transition-all ${
                      shippingMode === "aereo"
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Plane size={14} />
                    <span>Aéreo (Rápido)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingMode("maritimo")}
                    className={`py-3 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border transition-all ${
                      shippingMode === "maritimo"
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Ship size={14} />
                    <span>Marítimo (Carga)</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                Detalles Adicionales o Enlace de Referencia (Opcional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indica marca preferida, si necesitas instalación en sitio o entrega en Quito/Guayaquil..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-heading font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>Solicitar Cotización Inmediata por WhatsApp</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
