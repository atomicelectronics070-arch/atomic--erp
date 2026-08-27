"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert, Zap, ShieldCheck, ArrowRight, MessageSquare, PhoneCall,
  CheckCircle2, AlertTriangle, BatteryCharging, Radio, BellRing, Sparkles,
  Sliders, ChevronRight, HelpCircle, FileText, Check, Copy
} from "lucide-react";

interface CercoKit {
  sku: string;
  name: string;
  brand: "HAGROY" | "JFL";
  tag: string;
  tagColor: string;
  price: number;
  image: string;
  highlight: string;
  components: string[];
  specs: {
    voltage: string;
    perimeter: string;
    backup: string;
    siren: string;
    connectivity: string;
  };
}

const CERCO_KITS: CercoKit[] = [
  {
    sku: "15083",
    name: "Kit Cerco Eléctrico Hagroy X-Power i8 Profesional",
    brand: "HAGROY",
    tag: "ALTA PRECISIÓN",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    price: 98.00,
    image: "/images/cercos/cerco-hagroy-xpower-i8-15083.jpg",
    highlight: "Electrificador de alta potencia con algoritmo anti-sabotaje y detección de flexión de alambre.",
    components: [
      "Unidad Central Hagroy X-Power i8 (Panel Electrificador)",
      "Control Remoto con Llavero Metálico de Activación",
      "Batería de Respaldo Recargable 12V 4Ah de Larga Duración",
      "Sirena de Alta Potencia Acústica de 20 Watts",
      "Letrero de Advertencia 'PELIGRO CERCO ELÉCTRICO' Reglamentario",
      "Garantía Escrita de 1 Año + Soporte Técnico ATOMIC"
    ],
    specs: {
      voltage: "13.000V Pulsante Disuasivo",
      perimeter: "Hasta 1.600 metros lineales",
      backup: "Autonomía de 24h a 48h sin luz",
      siren: "20 Watts (118 dB de alta penetración)",
      connectivity: "Receptor inalámbrico 433MHz"
    }
  },
  {
    sku: "11258",
    name: "Kit Cerco Eléctrico Hagroy Yanex Premium 12V",
    brand: "HAGROY",
    tag: "OFERTA ESPECIAL",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    price: 90.00,
    image: "/images/cercos/cerco-hagroy-yanex-11258.jpg",
    highlight: "Excelente relación costo-beneficio para residencias, urbanizaciones y locales comerciales.",
    components: [
      "Electrificador Hagroy Yanex (Panel Principal Inteligente)",
      "Control Remoto de Largo Alcance Multifunción",
      "Batería Recargable 12V 4Ah Libre de Mantenimiento",
      "Sirena Potente de 20 Watts de Respuesta Inmediata",
      "Letrero de Peligro Reglamentario de Alta Visibilidad",
      "Manual de Conexión & Asesoría Técnica de Instalación"
    ],
    specs: {
      voltage: "12.000V Pulsante Seguro",
      perimeter: "Hasta 1.200 metros lineales",
      backup: "Batería 12V 4Ah incluida",
      siren: "20 Watts (115 dB)",
      connectivity: "Transmisión RF codificada"
    }
  },
  {
    sku: "11208",
    name: "Kit Platino JFL Cerco Eléctrico con Módulo Ethernet ME-05",
    brand: "JFL",
    tag: "CONTROL POR CELULAR",
    tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    price: 137.00,
    image: "/images/cercos/cerco-jfl-platino-11208.jpg",
    highlight: "Arme, desarme y reciba notificaciones de intrusión en tiempo real desde la aplicación celular JFL.",
    components: [
      "Electrificador ECR-18 PLUS JFL de Alta Tecnología",
      "Módulo Ethernet ME-05 para Conexión Celular App",
      "Caja Protectora Metálica para Sirena Exterior",
      "Sirena de 20 Watts de Potencia Industrial",
      "Batería 12V 4Ah de Ciclo Profundo",
      "Control Remoto Multifunción + Señal de Advertencia"
    ],
    specs: {
      voltage: "18.000V Ajustable (0.5J a 1.5J)",
      perimeter: "Hasta 5.000 metros de alambre",
      backup: "Respaldo continuo 12V",
      siren: "Sirena 20W + Gabinete Metálico",
      connectivity: "Ethernet / App Celular + RF 433MHz"
    }
  },
  {
    sku: "15023",
    name: "Kit Cerco Eléctrico JFL EOS 18 PLUS Profesional",
    brand: "JFL",
    tag: "LANZAMIENTO",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    price: 89.00,
    image: "/images/cercos/cerco-jfl-eos18-plus-15023.jpg",
    highlight: "Máxima energía de pulso de choque con tecnología de vanguardia para perímetros exigentes.",
    components: [
      "Electrificador JFL EOS 18 PLUS Profesional",
      "Control Remoto de Activación con Código Rolante",
      "Batería 12V 4Ah de Ciclo Profundo de Respaldo",
      "Sirena de 20 Watts de Alta Potencia Acústica",
      "Letrero de Advertencia 'PELIGRO' Normativo INEN",
      "Soporte y Garantía Oficial 1 Año"
    ],
    specs: {
      voltage: "18.000V de Choque Disuasivo",
      perimeter: "Hasta 3.000 metros lineales",
      backup: "Batería 12V 4Ah",
      siren: "20W (118 dB)",
      connectivity: "Receptor Rolling Code Anti-Clonación"
    }
  },
  {
    sku: "11207",
    name: "Kit Cerco Eléctrico JFL ECA 14 PLUS con Caja Protectora",
    brand: "JFL",
    tag: "OFERTA LIMITADA",
    tagColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    price: 109.00,
    image: "/images/cercos/cerco-jfl-eca14-plus-11207.jpg",
    highlight: "Incluye caja protectora de intemperie y sistema de monitoreo de corte o cortocircuito de alta sensibilidad.",
    components: [
      "Electrificador JFL ECA 14 PLUS Certificado CE",
      "Caja Protectora Metálica Anti-Lluvia para Sirena",
      "Sirena Potente de 20 Watts",
      "Control Remoto de Doble Función",
      "Batería Recargable 12V 4Ah",
      "Letrero de Advertencia de Peligro"
    ],
    specs: {
      voltage: "14.000V Efectivo",
      perimeter: "Hasta 2.500 metros lineales",
      backup: "Batería 12V 4Ah",
      siren: "20W + Caja Metálica",
      connectivity: "Sistema RF Inteligente"
    }
  }
];

const WA_NUMBER = "593969043453";

export default function CercosClient() {
  const [selectedKit, setSelectedKit] = useState<CercoKit | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "HAGROY" | "JFL">("ALL");
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const filteredKits = CERCO_KITS.filter(
    (k) => activeTab === "ALL" || k.brand === activeTab
  );

  const getWaLink = (kit: CercoKit) => {
    const msg = `*¡Hola ATOMIC! Me interesa cotizar este Kit de Cerco Eléctrico:*
• *Producto:* ${kit.name}
• *Código / SKU:* ${kit.sku}
• *Precio Referencial:* $${kit.price.toFixed(2)} + IVA
• *Marca:* ${kit.brand}

¿Tienen disponibilidad inmediata para coordinar el envío / instalación?`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const handleCopySpecs = (kit: CercoKit) => {
    const text = `🛡️ ${kit.name.toUpperCase()} (CÓD: ${kit.sku})
💵 Precio: $${kit.price.toFixed(2)} + IVA
⚡ Voltaje: ${kit.specs.voltage}
📏 Perímetro: ${kit.specs.perimeter}
🔋 Respaldo: ${kit.specs.backup}
🔊 Sirena: ${kit.specs.siren}
📦 Incluye: ${kit.components.join(" · ")}`;
    navigator.clipboard.writeText(text);
    setCopiedSku(kit.sku);
    setTimeout(() => setCopiedSku(null), 2500);
  };

  return (
    <main className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-20 left-1/3 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[200px]" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#0A0C14]/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Zap size={20} className="text-black group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
                ATOMIC <span className="text-amber-400">CERCOS</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">SEGURIDAD PERIMETRAL DE ALTA PRECISIÓN</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/web"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 text-xs font-mono font-bold transition-all"
            >
              ← Volver al Catálogo
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola ATOMIC, necesito asesoría técnica para la instalación de un cerco eléctrico.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
            >
              <MessageSquare size={14} />
              <span>Asesoría WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <ShieldAlert size={14} className="text-red-400 animate-pulse" />
          <span>Línea Oficial de Seguridad Perimetral 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white max-w-5xl mx-auto leading-tight font-mono">
          BARRERAS DE CERCO ELÉCTRICO<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-rose-500">
            DE ALTA PRECISIÓN
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto mt-6 leading-relaxed">
          Protección perimetral inteligente para residencias, urbanizaciones, empresas y complejos industriales. 
          Disuasión no letal de alto voltaje (hasta 18.000V), detección instantánea de corte o flexión de alambre, 
          respaldo con batería de ciclo profundo y control total desde tu celular.
        </p>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-10">
          {[
            { icon: <Zap className="text-amber-400" size={20} />, title: "Hasta 18.000V", sub: "Disuasión No Letal" },
            { icon: <BatteryCharging className="text-emerald-400" size={20} />, title: "Respaldo 12V 4Ah", sub: "Sin Cortes de Energía" },
            { icon: <BellRing className="text-red-400" size={20} />, title: "Sirena 20 Watts", sub: "Alerta Instantánea 118dB" },
            { icon: <Radio className="text-blue-400" size={20} />, title: "Monitoreo App", sub: "Notificaciones al Celular" },
          ].map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-left">
              <div className="mb-2">{m.icon}</div>
              <div className="text-sm font-black font-mono text-white">{m.title}</div>
              <div className="text-[11px] text-slate-400 font-sans">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Brand Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {[
            { id: "ALL", label: "TODOS LOS KITS" },
            { id: "HAGROY", label: "HAGROY ELECTRONICS" },
            { id: "JFL", label: "JFL ALARMES" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase font-mono tracking-wider transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? "bg-amber-400 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  : "bg-white/[0.04] text-slate-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKits.map((kit) => (
            <div
              key={kit.sku}
              className="rounded-2xl bg-[#0D0F1A] border-2 border-white/10 hover:border-amber-400/60 transition-all duration-200 overflow-hidden flex flex-col shadow-2xl group"
            >
              {/* Product Visual Card / Image */}
              <div className="relative w-full aspect-square bg-[#05060A] overflow-hidden border-b border-white/10">
                <img
                  src={kit.image}
                  alt={kit.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase font-mono border backdrop-blur-md ${kit.tagColor}`}>
                    {kit.tag}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono bg-black/70 text-slate-300 border border-white/10">
                    CÓD: {kit.sku}
                  </span>
                </div>

                {/* Price Pill */}
                <div className="absolute bottom-3 right-3 bg-red-600/95 text-white font-mono font-black text-sm sm:text-base px-3.5 py-1 rounded-xl shadow-lg border border-red-400/40">
                  ${kit.price.toFixed(2)} <span className="text-[10px] font-sans font-normal">+IVA</span>
                </div>
              </div>

              {/* Product Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      {kit.brand}
                    </span>
                    <button
                      onClick={() => handleCopySpecs(kit)}
                      className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10"
                      title="Copiar especificaciones del kit"
                    >
                      {copiedSku === kit.sku ? (
                        <>
                          <Check size={11} className="text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copiar Ficha</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-black text-white uppercase font-mono leading-snug">
                    {kit.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                    {kit.highlight}
                  </p>

                  {/* Components Included List */}
                  <div className="mt-4 pt-3 border-t border-white/[0.08]">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-300 block mb-2">
                      📦 El Kit Incluye:
                    </span>
                    <ul className="space-y-1.5">
                      {kit.components.map((comp, cIdx) => (
                        <li key={cIdx} className="text-[11px] text-slate-300 flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Specs Pills */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/[0.08] text-[10px] font-mono">
                    <div className="bg-white/[0.02] p-2 rounded border border-white/5">
                      <span className="text-slate-500 block">VOLTAJE:</span>
                      <span className="text-amber-300 font-bold">{kit.specs.voltage}</span>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded border border-white/5">
                      <span className="text-slate-500 block">PERÍMETRO:</span>
                      <span className="text-slate-200 font-bold">{kit.specs.perimeter}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                  <a
                    href={getWaLink(kit)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase font-heading tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
                  >
                    <MessageSquare size={15} />
                    <span>Cotizar por WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSelectedKit(kit)}
                    className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase transition-all"
                    title="Ver Ficha Técnica Completa"
                  >
                    🔍
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY INSTALL ELECTRIC FENCE BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border-2 border-red-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 mb-3">
              <AlertTriangle size={14} />
              ¿Por qué instalar un cerco eléctrico de alta precisión?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-mono leading-tight">
              La primera línea de defensa perimetral que actúa <span className="text-amber-400">antes de la invasión</span>.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-4">
              A diferencia de las cámaras que solo registran lo ocurrido, el cerco eléctrico ofrece una 
              <strong> barrera física y psicológica contundente</strong>. Si un intruso intenta tocar, cortar o 
              manipular el alambrado, recibe una descarga no letal de alto voltaje que lo repele al instante 
              mientras la sirena de 20W y la app móvil alertan a la guardia y residentes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="text-amber-400 font-mono font-black text-lg mb-1">01. Disuasión Activa</div>
                <p className="text-slate-400 text-xs">Descargas de hasta 18.000 voltios regulados que imposibilitan el ingreso.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="text-red-400 font-mono font-black text-lg mb-1">02. Alarma Sonora 20W</div>
                <p className="text-slate-400 text-xs">Detección por corte, tierra o cortocircuito con sirena de 118 decibeles.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="text-emerald-400 font-mono font-black text-lg mb-1">03. Monitoreo Móvil</div>
                <p className="text-slate-400 text-xs">Armado/desarmado remoto y registro de eventos en tu smartphone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DETALLES DEL KIT SELECCIONADO */}
      {selectedKit && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#10121E] border-2 border-amber-400 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedKit(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 hover:text-white flex items-center justify-center text-slate-300 font-bold transition-all cursor-pointer"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-1/2 aspect-square bg-[#05060A] rounded-2xl overflow-hidden border border-white/10 relative">
                <img
                  src={selectedKit.image}
                  alt={selectedKit.name}
                  className="w-full h-full object-contain p-3"
                />
                <span className="absolute bottom-3 right-3 bg-red-600 text-white font-mono font-black text-xs px-3 py-1 rounded-lg">
                  ${selectedKit.price.toFixed(2)} + IVA
                </span>
              </div>

              <div className="w-full sm:w-1/2 space-y-4">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase border ${selectedKit.tagColor}`}>
                  {selectedKit.tag} · CÓD: {selectedKit.sku}
                </span>

                <h3 className="text-lg font-black uppercase font-mono text-white">
                  {selectedKit.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedKit.highlight}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">VOLTAJE:</span>
                    <span className="text-amber-400 font-mono font-bold">{selectedKit.specs.voltage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">PERÍMETRO:</span>
                    <span className="text-white font-mono font-bold">{selectedKit.specs.perimeter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">RESPALDO:</span>
                    <span className="text-emerald-400 font-mono font-bold">{selectedKit.specs.backup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">SIRENA:</span>
                    <span className="text-red-400 font-mono font-bold">{selectedKit.specs.siren}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">CONEXIÓN:</span>
                    <span className="text-blue-400 font-mono font-bold">{selectedKit.specs.connectivity}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <a
                    href={getWaLink(selectedKit)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase font-heading tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <MessageSquare size={16} />
                    <span>Cotizar Inmediatamente</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#05060A] py-10 px-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 ATOMIC INDUSTRIES & SOLUTIONS — Sistemas de Seguridad Perimetral y Electrificadores de Precisión.</p>
        <p className="mt-2 text-[11px] text-slate-600">Disponibilidad inmediata en Quito, Guayaquil, Cuenca y envíos asegurados a nivel nacional.</p>
      </footer>
    </main>
  );
}
