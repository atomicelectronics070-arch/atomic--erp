"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Shield,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  Maximize2,
  Layers,
  Zap,
  Clock,
  Truck,
  RotateCw,
  HelpCircle,
  Star,
  ChevronDown,
  Ruler,
  Award,
  Sliders,
  Check,
  ChevronRight,
  Eye
} from "lucide-react";

export default function EncimeraNewYork76Page() {
  // Photos from Atomic DB
  const officialImages = [
    {
      url: "https://bpecuador.com/wp-content/uploads/2025/12/BPA0660-300x300.webp",
      label: "Foto Oficial New York 76",
      badge: "Cubierta 76 cm"
    },
    {
      url: "https://bpecuador.com/wp-content/uploads/2023/03/BPA0056-1x1-1-300x300.png",
      label: "Vista de Parrillas y Hornillas",
      badge: "Hierro Fundido"
    },
    {
      url: "https://bpecuador.com/wp-content/uploads/2023/03/BPA0057-1x1-1-300x300.png",
      label: "Detalle Quemador Triple Fuego",
      badge: "Wok 3.8kW"
    }
  ];

  const [selectedImg, setSelectedImg] = useState(0);

  // Quote Builder State
  const [gasType, setGasType] = useState<"glp" | "gn">("glp");
  const [includeInstall, setIncludeInstall] = useState(false);
  const [includeRegulator, setIncludeRegulator] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Official DB Price
  const basePrice = 192.49;
  const regularPrice = 249.00;
  const installPrice = 35.00;
  const regulatorPrice = 20.00;
  
  const finalPrice = (basePrice + (includeInstall ? installPrice : 0) + (includeRegulator ? regulatorPrice : 0)).toFixed(2);

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `¡Hola ATOMIC! 👋 Deseo ordenar/cotizar la *ENCIMERA A GAS NEW YORK 76 (5 QUEMADORES)*:\n\n` +
      `🔥 *SKU/Modelo:* Encimera a Gas New York 76 (76x51cm / Corte 72x47cm)\n` +
      `🧪 *Tipo de Gas:* ${gasType === "glp" ? "Gas en Tanque (GLP)" : "Gas por Tubería (Natural)"}\n` +
      `🛠️ *Instalación:* ${includeInstall ? "SÍ (+$35.00)" : "No requerida"}\n` +
      `🔧 *Kit Manguera + Regulador:* ${includeRegulator ? "SÍ (+$20.00)" : "No requerido"}\n` +
      `💰 *Total Final:* $${finalPrice} USD\n\n` +
      `📍 Por favor coordinar disponibilidad y despacho en mi ciudad.`
    );
    return `https://wa.me/593969043453?text=${text}`;
  };

  const FAQS = [
    {
      q: "¿Cuáles son las medidas exactas de corte en el mesón?",
      a: "Medida exterior: 76.0 cm x 51.0 cm. Medida de corte (hueco en mesón de granito, cuarzo o madera): 72.0 cm de ancho x 47.0 cm de profundidad, con espacio libre inferior mínimo de 8 cm."
    },
    {
      q: "¿Qué tipo de energía eléctrica requiere para el encendido?",
      a: "Funciona con conexión estándar de 110V - 120V a 60Hz. Su encendido es por pulso electrónico automático integrado en cada perilla."
    },
    {
      q: "¿Sirve para gas de tanque (GLP) y gas por tubería (Natural)?",
      a: "Sí, viene configurada de fábrica para Gas Licuado (GLP) e incluye el juego de inyectores intercambiables para Gas Natural."
    },
    {
      q: "¿El vidrio templado resiste altas temperaturas y ollas pesadas?",
      a: "Sí, cuenta con tablero de cristal templado Black Crystal de 8mm de espesor con tratamiento térmico y parrillas de hierro fundido independientes."
    },
    {
      q: "¿Qué garantía tiene y cómo es el envío?",
      a: "Incluye 1 Año de Garantía Directa respaldada por ATOMIC Ecuador. Envíos asegurados por transporte expreso a todas las provincias del país."
    }
  ];

  return (
    <main className="min-h-screen bg-[#060813] text-slate-100 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs py-2 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2 shadow-md">
        <Sparkles size={14} className="animate-spin text-amber-200" />
        <span>⚡ PRODUCTO OFICIAL ATOMIC: Descuento Especial $192.49 + Entrega Express a Todo Ecuador</span>
      </div>

      {/* ── HEADER / NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-[#060813]/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/web" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame size={22} className="text-black" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight uppercase text-white flex items-center gap-1.5">
                ATOMIC <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">PRO</span>
              </span>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Hogar & Electrodomésticos</p>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#fotos" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Eye size={15} /> Fotos Reales
          </a>
          <a href="#medidas" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Ruler size={15} /> Medidas Técnicas
          </a>
          <a href="#quemadores" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Flame size={15} /> 5 Hornillas
          </a>
          <a href="#cotizador" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Award size={15} /> Cotizar Pedido
          </a>
          <a href="#faq" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <HelpCircle size={15} /> FAQ
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Pedir por WhatsApp</span>
            <span className="sm:hidden">Pedir</span>
          </a>
        </div>
      </nav>

      {/* ── HERO SECTION WITH OFFICIAL PRODUCT PHOTO GALLERY ── */}
      <section id="fotos" className="relative pt-10 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-amber-500/15 via-orange-600/10 to-transparent blur-[140px] pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Product Information */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={14} className="text-amber-400" />
                Producto Original · Banco del Perno
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                En Stock (10 Unidades)
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
              ENCIMERA A GAS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                NEW YORK 76
              </span>
              <span className="block text-xl sm:text-2xl text-slate-300 font-extrabold mt-1">
                5 Quemadores · Vidrio Templado 8mm
              </span>
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
              Equipada con quemador <strong className="text-amber-400">Triple Fuego Wok</strong> de máxima potencia, parrillas de hierro fundido de alta estabilidad, encendido automático por pulso a 110V y sensor de fuga de gas termocupla.
            </p>

            {/* Official Feature Icons Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
              {[
                { icon: "https://bpecuador.com/wp-content/uploads/2022/12/ICN_TRIPLE-FUEGO-111.svg", name: "Triple Fuego" },
                { icon: "https://bpecuador.com/wp-content/uploads/2022/12/ICN_VIDRIO-TEMPLADO-112.svg", name: "Vidrio 8mm" },
                { icon: "https://bpecuador.com/wp-content/uploads/2022/12/ICN_REJILLA-114.svg", name: "Hierro Fundido" },
                { icon: "https://bpecuador.com/wp-content/uploads/2022/12/ICN_PULSO-115.svg", name: "Pulso 110V" },
                { icon: "https://bpecuador.com/wp-content/uploads/2022/12/ICN_SENSOR-GAS-116.svg", name: "Sensor Fuga" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center text-center gap-1.5 hover:border-amber-500/40 transition-colors">
                  <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain filter invert opacity-90" />
                  <span className="text-[10px] font-bold text-slate-300 leading-tight">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Price & Action Area */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 line-through">$${regularPrice.toFixed(2)}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">OFERTA ATOMIC</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">$${basePrice.toFixed(2)}</span>
                  <span className="text-xs font-mono text-slate-400">USD</span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">✓ Precio Oficial de Base de Datos</p>
              </div>

              <div className="flex-1 w-full sm:w-auto flex flex-col gap-2.5">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-center text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span>Comprar por WhatsApp</span>
                </a>
                <a
                  href="#medidas"
                  className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-center text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Ruler size={15} />
                  <span>Ver Medidas 76x51 (Corte 72x47)</span>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 pt-1">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-400" /> 1 Año Garantía de Fábrica</span>
              <span className="flex items-center gap-1.5"><Truck size={15} className="text-amber-400" /> Envíos Rápidos a Nivel Nacional</span>
              <span className="flex items-center gap-1.5"><Shield size={15} className="text-blue-400" /> Válvulas con Sensor de Fuga</span>
            </div>

          </div>

          {/* Right Column: Interactive Real Photo Viewer */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900/95 via-[#0b0e22] to-slate-900/95 border border-white/15 shadow-2xl shadow-black/90 overflow-hidden">
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
                    {officialImages[selectedImg].label}
                  </span>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {officialImages[selectedImg].badge}
                </span>
              </div>

              {/* Main Photo Card */}
              <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-white/10 p-6 flex items-center justify-center overflow-hidden group">
                <img
                  src={officialImages[selectedImg].url}
                  alt="Encimera New York 76 Oficial"
                  className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(245,158,11,0.25)] transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-amber-400">
                  Foto Oficial Catálogo
                </div>
              </div>

              {/* Thumbnails Selector */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {officialImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`relative p-2 rounded-2xl border transition-all overflow-hidden bg-slate-950 flex flex-col items-center gap-1.5 ${
                      selectedImg === i
                        ? "border-amber-500 ring-2 ring-amber-500/30 scale-105"
                        : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-14 h-14 object-contain" />
                    <span className="text-[10px] font-bold text-slate-300 text-center truncate w-full">{img.badge}</span>
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: MEDIDAS Y PLANO TÉCNICO DE CORTE ── */}
      <section id="medidas" className="py-16 px-4 md:px-12 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            Guía de Corte Oficial
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white mt-3 tracking-tight">
            Dimensiones Exactas de la <span className="text-amber-400">New York 76</span>
          </h2>
          <p className="text-slate-300 text-sm mt-2">
            Verifica el espacio en tu mesón antes de instalar. Diseñada para encastre estándar de 76 cm.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* Box 1: Exterior */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0b1026] to-slate-900 border border-blue-500/30 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Maximize2 size={20} className="text-blue-400" />
                <h3 className="text-lg font-black uppercase text-white">Dimensiones Externas</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 font-bold">
                Superficie
              </span>
            </div>

            <div className="h-44 w-full rounded-2xl bg-[#030614] border border-blue-500/20 relative flex flex-col items-center justify-center p-4">
              <div className="w-full flex items-center justify-between text-blue-400 text-xs font-mono font-bold mb-2">
                <span>◀</span>
                <span className="border-b border-blue-400/50 flex-1 mx-2 text-center pb-1 text-sm font-black">76.0 cm (760 mm)</span>
                <span>▶</span>
              </div>
              <div className="w-4/5 h-20 rounded-xl bg-slate-800/80 border-2 border-blue-400 flex items-center justify-between px-4 text-xs font-bold text-slate-200">
                <span>Cubierta Vidrio 8mm</span>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                  <Flame size={14} /> 5 Hornillas
                </div>
              </div>
              <div className="w-full flex items-center justify-between text-blue-400 text-xs font-mono font-bold mt-2">
                <span>▲ Fondo: 51.0 cm (510 mm) ▼</span>
              </div>
            </div>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Ancho Exterior:</span>
                <span className="font-bold text-white text-sm">76.0 cm (760 mm)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Profundidad / Fondo:</span>
                <span className="font-bold text-white text-sm">51.0 cm (510 mm)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Espesor de Tablero:</span>
                <span className="font-bold text-white text-sm">8 mm Vidrio Templado</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Encendido:</span>
                <span className="font-bold text-white text-sm">Pulso 110V Integrado</span>
              </div>
            </div>
          </div>

          {/* Box 2: Corte */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-[#1a0f12] to-slate-900 border border-amber-500/40 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Ruler size={20} className="text-amber-400" />
                <h3 className="text-lg font-black uppercase text-white">Dimensiones Internas (Corte)</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                Hueco en Mesón
              </span>
            </div>

            <div className="h-44 w-full rounded-2xl bg-[#030614] border border-amber-500/20 relative flex flex-col items-center justify-center p-4">
              <div className="w-full flex items-center justify-between text-amber-400 text-xs font-mono font-bold mb-2">
                <span>◀</span>
                <span className="border-b border-dashed border-amber-400/80 flex-1 mx-2 text-center pb-1 text-sm font-black">72.0 cm</span>
                <span>▶</span>
              </div>
              <div className="w-3/4 h-20 rounded-lg border-2 border-dashed border-amber-400 bg-amber-950/20 flex flex-col items-center justify-center text-xs font-bold text-amber-200">
                <span>Corte en Mesón</span>
                <span className="text-[10px] font-mono text-slate-400">(Granito / Cuarzo)</span>
              </div>
              <div className="w-full flex items-center justify-between text-amber-400 text-xs font-mono font-bold mt-2">
                <span>▲ Fondo de Corte: 47.0 cm ▼</span>
              </div>
            </div>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Ancho de Corte:</span>
                <span className="font-bold text-amber-400 text-sm">72.0 cm (720 mm)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Profundidad de Corte:</span>
                <span className="font-bold text-amber-400 text-sm">47.0 cm (470 mm)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Parrillas:</span>
                <span className="font-bold text-white text-sm">Hierro Fundido Forjado</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Tecnología Gas:</span>
                <span className="font-bold text-white text-sm">G.L.P / Gas Natural</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: COTIZADOR DIRECTO WHATSAPP ── */}
      <section id="cotizador" className="py-16 px-4 md:px-12 max-w-4xl mx-auto border-t border-white/10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0f172a] to-amber-950/40 border border-amber-500/30 shadow-2xl">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase border border-amber-500/30">
              Personaliza tu Orden
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3">
              Cotizador con Despacho Inmediato
            </h2>
            <p className="text-slate-300 text-xs mt-1">Configura los accesorios que requieres para tu cocina y confirma con un asesor.</p>
          </div>

          <div className="space-y-6">
            
            {/* 1. Tipo de Gas */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">1. Selecciona tu Tipo de Gas:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGasType("glp")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    gasType === "glp"
                      ? "bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <p className="font-black text-sm text-white">Gas en Tanque (GLP)</p>
                  <p className="text-[11px] text-slate-300 mt-1">Para cilindros tradicionales de gas</p>
                </button>

                <button
                  type="button"
                  onClick={() => setGasType("gn")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    gasType === "gn"
                      ? "bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <p className="font-black text-sm text-white">Gas Natural por Tubería</p>
                  <p className="text-[11px] text-slate-300 mt-1">Incluye inyectores intercambiables</p>
                </button>
              </div>
            </div>

            {/* 2. Opciones Adicionales */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">2. Servicios y Accesorios Opcionales:</label>
              <div className="space-y-2.5">
                
                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeInstall}
                      onChange={(e) => setIncludeInstall(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-sm text-white">Instalación y Calibración Técnica a Domicilio</p>
                      <p className="text-xs text-slate-400">Montaje seguro y prueba de fuego por técnico especializado</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">+$${installPrice.toFixed(2)}</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeRegulator}
                      onChange={(e) => setIncludeRegulator(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-sm text-white">Kit Manguera Blindada de Alta Presión + Regulador</p>
                      <p className="text-xs text-slate-400">2 metros reforzada con abrazaderas de grado industrial</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">+$${regulatorPrice.toFixed(2)}</span>
                </label>

              </div>
            </div>

            {/* Summary & Big WhatsApp Order Button */}
            <div className="pt-4 p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase">Total a Pagar Estimado:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-400">$${finalPrice}</span>
                  <span className="text-xs font-mono text-slate-300">USD</span>
                </div>
              </div>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                <span>Pedir por WhatsApp</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 4: FAQ ── */}
      <section id="faq" className="py-16 px-4 md:px-12 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">Preguntas Frecuentes</h2>
          <p className="text-slate-400 text-xs font-mono mt-1">INFORMACIÓN TÉCNICA Y GARANTÍA</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === i ? "rotate-180 text-amber-400" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5 bg-white/[0.01]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 bg-[#04060d] py-12 px-4 md:px-12 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-white font-black text-base">
            <Flame size={20} className="text-amber-500" />
            <span>ATOMIC STORE · ECUADOR</span>
          </div>
          <p className="max-w-lg mx-auto text-slate-400">
            Distribuidor Oficial de Tecnología y Electrodomésticos. Garantía directa y envíos asegurados a todo el país.
          </p>
          <div className="flex flex-wrap justify-center gap-6 font-mono text-[11px] text-slate-400 pt-2">
            <a href="https://wa.me/593969043453" target="_blank" rel="noreferrer" className="hover:text-amber-400">
              📞 WhatsApp: +593 96 904 3453
            </a>
            <Link href="/web" className="hover:text-amber-400">
              🏬 Catálogo General
            </Link>
            <a href="#medidas" className="hover:text-amber-400">
              📐 Medidas 76x51 cm (Corte 72x47 cm)
            </a>
          </div>
          <p className="text-[10px] text-slate-600 pt-4">
            © {new Date().getFullYear()} ATOMIC. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP CTA ── */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm shadow-2xl shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all"
        >
          <MessageCircle size={22} />
          <span className="hidden sm:inline">Cotizar por WhatsApp</span>
        </a>
      </div>

    </main>
  );
}
