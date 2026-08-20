"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield, Wifi, Camera, Fingerprint, Monitor, ChevronLeft,
  MessageSquare, CheckCircle, ArrowRight, Phone, Lock, Radio,
  Eye, Building2, Home, Zap
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ATOMIC — Sistema de Seguridad: ZKTeco + TP-Link (dark Appit theme)
// Landing page explicativa + catálogo de productos
// ─────────────────────────────────────────────────────────────────────────────

const WA = "593969043453";
const waLink = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const FEATURES = [
  {
    icon: <Fingerprint size={20} />,
    title: "Control de Acceso Biométrico",
    desc: "Reconocimiento facial 3D, huella dactilar y tarjeta RFID. Hasta 1,500 rostros y 3,000 huellas almacenadas. Compatible con ZKBio Access.",
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
  },
  {
    icon: <Monitor size={20} />,
    title: "Video Portero IP 7\"",
    desc: "Monitor táctil Linux de 7\" con visualización 4 canales simultáneos, apertura remota de puertas, integración ONVIF y protocolo SIP 2.0.",
    color: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/20",
  },
  {
    icon: <Wifi size={20} />,
    title: "Access Point Profesional",
    desc: "TP-Link EAP225-Outdoor AC1200 MU-MIMO. Cobertura de largo alcance para interiores y exteriores. Gestión centralizada con Omada Controller.",
    color: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/20",
  },
  {
    icon: <Camera size={20} />,
    title: "Videovigilancia IP",
    desc: "Cámaras TP-Link VIGI con visión nocturna, detección IA, almacenamiento local y en nube. Integración con el ecosistema ZKTeco.",
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
  },
];

const PRODUCTS = [
  {
    id: "eap225",
    name: "Access Point TP-Link EAP225-Outdoor",
    subtitle: "AC1200 MU-MIMO Indoor/Outdoor",
    price: 103.64,
    priceProvider: 79.72,
    badge: "REDES",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    specs: ["AC1200 Mbps dual band", "2×2 MIMO", "Compatible PoE 802.3af", "IP65 resistente a la intemperie", "Omada Controller gratuito", "Portal cautivo integrado"],
    image: "https://static.tp-link.com/upload/product-overview/2022/202206/20220627/EAP225-Outdoor(EU)_V4_1.jpg",
    sku: "APOTPLC225-OUTDOOR",
    waMsg: "Hola ATOMIC! Quiero cotizar el Access Point TP-Link EAP225-Outdoor AC1200. ¿Disponibilidad y precio?",
  },
  {
    id: "senseface2a",
    name: "ZKTeco SenseFace 2A",
    subtitle: "Reloj Biométrico Facial + Huella + RFID",
    price: 125.40,
    priceProvider: null,
    badge: "CONTROL ACCESO",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    specs: ["Reconocimiento facial visible", "1,500 rostros / 3,000 huellas", "3,000 tarjetas RFID", "150,000 registros de eventos", "TCP/IP y USB Host", "ONVIF + ZKBio Access compatible"],
    image: "https://www.zkteco.es/wp-content/uploads/2023/01/ZKTeco-SenseFace-2A.jpg",
    sku: "ZK-SENSEFACE-2A",
    waMsg: "Hola ATOMIC! Quiero cotizar el ZKTeco SenseFace 2A – Reloj Biométrico Facial. ¿Stock y precio?",
  },
  {
    id: "vt07",
    name: "Monitor ZKTeco ZK-VT07-B01-W",
    subtitle: "Video Portero IP 7\" WiFi Linux ONVIF",
    price: 117.14,
    priceProvider: 90.11,
    badge: "VIDEO PORTERO",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    specs: ["Pantalla táctil LCD 7\"", "4 canales simultáneos", "Protocolo SIP 2.0 + TCP/IP", "WiFi + Ethernet", "Apertura remota de puerta", "Micro TF hasta 128GB"],
    image: "https://www.zkteco.com/upfile/file/20230215/20230215164408_13437.jpg",
    sku: "ZK-VT07-B01-W",
    waMsg: "Hola ATOMIC! Quiero cotizar el Monitor ZKTeco ZK-VT07-B01-W (video portero 7\"). ¿Stock y precio?",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "El visitante llega",
    desc: "La cámara del portero detecta al visitante y envía video en tiempo real al monitor interior y al celular del residente.",
    icon: <Eye size={16} />,
  },
  {
    step: "02",
    title: "Verificación biométrica",
    desc: "El SenseFace 2A identifica al usuario con reconocimiento facial o huella dactilar en menos de 0.5 segundos.",
    icon: <Fingerprint size={16} />,
  },
  {
    step: "03",
    title: "Acceso autorizado",
    desc: "El sistema abre la puerta automáticamente. Se registra el evento con foto, hora y datos del usuario.",
    icon: <Lock size={16} />,
  },
  {
    step: "04",
    title: "Monitoreo remoto",
    desc: "Desde cualquier celular ves las cámaras, abres la puerta y recibes alertas en tiempo real. 24/7.",
    icon: <Phone size={16} />,
  },
];

const APPLICATIONS = [
  { icon: <Building2 size={18} />, title: "Edificios y condominios", desc: "Control de acceso por departamento con video portero IP centralizado." },
  { icon: <Home size={18} />, title: "Residencias", desc: "Seguridad perimetral con cámaras y apertura remota desde el celular." },
  { icon: <Radio size={18} />, title: "Oficinas y empresas", desc: "Registro de asistencia biométrico, acceso restringido por áreas." },
  { icon: <Zap size={18} />, title: "Locales comerciales", desc: "Control de aforo, vigilancia y WiFi profesional para clientes." },
];

export default function SeguridadClient() {
  const [activeTab, setActiveTab] = useState<"productos" | "como-funciona" | "aplicaciones">("productos");

  return (
    <main className="min-h-screen bg-[#09090A] text-white" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-40 bg-[#09090A]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft size={14} />
            ATOMIC Store
          </Link>
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Sistemas de Seguridad</span>
          <a
            href={waLink("Hola ATOMIC! Quiero información sobre sistemas de seguridad y control de acceso.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-black rounded-full hover:bg-neutral-100 transition-all"
          >
            <MessageSquare size={12} />
            Asesoría Gratis
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-purple-600/5 pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Shield size={12} />
            Sistema Integral de Seguridad
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4 leading-[0.9]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                Protege lo<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  que más importa
                </span>
              </h1>
              <p className="text-[#94969D] text-base leading-relaxed mb-8 max-w-xl">
                Control de acceso biométrico, video portero IP y WiFi profesional. Tecnología ZKTeco + TP-Link instalada e integrada por expertos ATOMIC.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  "Reconocimiento Facial",
                  "Video Portero IP",
                  "WiFi Profesional",
                  "Monitoreo 24/7",
                ].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-full text-xs font-bold text-neutral-300">
                    ✓ {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={waLink("Hola ATOMIC! Quiero una cotización de sistema de seguridad completo para mi propiedad.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-black text-sm uppercase tracking-wider hover:bg-neutral-100 transition-all shadow-lg"
                >
                  <MessageSquare size={14} />
                  Cotizar Sistema Completo
                </a>
                <button
                  onClick={() => setActiveTab("como-funciona")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
                >
                  Cómo funciona
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f.title} className={`p-4 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border}`}>
                  <div className="text-white mb-2">{f.icon}</div>
                  <h3 className="text-xs font-black text-white mb-1 leading-tight">{f.title}</h3>
                  <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-3">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMAGE GALLERY (user downloads) ── */}
      <section className="border-b border-white/[0.06] py-10 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-6">Sistema en acción</p>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {[
              {
                src: "https://www.zkteco.es/wp-content/uploads/2023/01/ZKTeco-SenseFace-2A-edificio.jpg",
                caption: "SenseFace 2A — Lobby edificio",
              },
              {
                src: "https://www.zkteco.com/upfile/file/20230215/20230215164408_13437.jpg",
                caption: "Monitor VT07 — Pantalla principal",
              },
              {
                src: "https://static.tp-link.com/upload/product-overview/2022/202206/20220627/EAP225-Outdoor(EU)_V4_1.jpg",
                caption: "EAP225-Outdoor — Cobertura amplia",
              },
              {
                src: "https://www.zkteco.es/wp-content/uploads/2023/03/Kit-SenseFace-2A.jpg",
                caption: "Kit completo de instalación",
              },
            ].map((img, i) => (
              <div key={i} className="flex-none w-64 rounded-2xl overflow-hidden bg-[#0E0E10] border border-white/[0.06]">
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="px-4 py-2 text-[10px] font-bold text-neutral-500">{img.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-2 mb-10 border-b border-white/[0.06] pb-4">
          {[
            { id: "productos" as const, label: "Productos" },
            { id: "como-funciona" as const, label: "Cómo funciona" },
            { id: "aplicaciones" as const, label: "Aplicaciones" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === tab.id
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PRODUCTOS */}
        {activeTab === "productos" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="group bg-[#0E0E10] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-[0_0_40px_rgba(59,130,246,0.06)] transition-all duration-300 flex flex-col"
              >
                <div className="relative bg-[#131315] flex items-center justify-center p-6 aspect-square">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-44 w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/131315/FFFFFF?text=${encodeURIComponent(prod.sku)}`;
                    }}
                  />
                  <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${prod.badgeColor}`}>
                    {prod.badge}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">SKU: {prod.sku}</p>
                  <h3 className="text-sm font-black text-white leading-snug mb-0.5 group-hover:text-blue-300 transition-colors">{prod.name}</h3>
                  <p className="text-xs text-neutral-500 mb-4">{prod.subtitle}</p>

                  <ul className="space-y-1 mb-5 flex-grow">
                    {prod.specs.map((s) => (
                      <li key={s} className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                        <CheckCircle size={10} className="text-blue-400 flex-none" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-2xl font-black text-white">${prod.price.toFixed(2)}</span>
                      <span className="text-xs text-neutral-500">USD</span>
                      {prod.priceProvider && (
                        <span className="text-[10px] text-neutral-600 line-through ml-1">${prod.priceProvider}</span>
                      )}
                    </div>
                    <p className="text-[9px] text-neutral-600 mb-4">+ instalación disponible</p>
                    <a
                      href={waLink(prod.waMsg)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider transition-all"
                    >
                      <MessageSquare size={13} />
                      Cotizar en WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CÓMO FUNCIONA */}
        {activeTab === "como-funciona" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
                  <div className="absolute top-4 right-4 text-5xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-colors">{step.step}</div>
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-sm font-black text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Diagram */}
            <div className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 text-center">Arquitectura del sistema</h3>
              <div className="flex flex-wrap justify-center items-center gap-4">
                {[
                  { icon: <Camera size={20} />, label: "Cámaras IP\nTP-Link VIGI", color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" },
                  { arrow: true },
                  { icon: <Fingerprint size={20} />, label: "ZKTeco\nSenseFace 2A", color: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
                  { arrow: true },
                  { icon: <Monitor size={20} />, label: "Monitor VT07\n7\" IP", color: "border-purple-500/30 bg-purple-500/10 text-purple-300" },
                  { arrow: true },
                  { icon: <Wifi size={20} />, label: "EAP225\nAccess Point", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
                  { arrow: true },
                  { icon: <Phone size={20} />, label: "App Móvil\nControl remoto", color: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
                ].map((item, i) =>
                  (item as any).arrow ? (
                    <ArrowRight key={i} size={16} className="text-neutral-600 hidden sm:block" />
                  ) : (
                    <div key={i} className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${(item as any).color} w-28`}>
                      {(item as any).icon}
                      <p className="text-[9px] font-bold text-center leading-tight whitespace-pre-line">{(item as any).label}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* APLICACIONES */}
        {activeTab === "aplicaciones" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {APPLICATIONS.map((app) => (
              <div key={app.title} className="group bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-6 hover:border-white/20 transition-all flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-none mt-0.5">
                  {app.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white mb-1">{app.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-3">{app.desc}</p>
                  <a
                    href={waLink(`Hola ATOMIC! Me interesa un sistema de seguridad para ${app.title.toLowerCase()}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    Consultar solución <ArrowRight size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="border-t border-white/[0.06] py-16 px-6 bg-[#0E0E10]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Shield size={12} />
            Instalación + Garantía incluidas
          </div>
          <h2 className="text-4xl font-black uppercase text-white mb-3 leading-tight" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
            Tu seguridad,<br />nuestra prioridad.
          </h2>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Instalación profesional, configuración, capacitación y soporte técnico. Diseñamos el sistema de seguridad ideal para tu propiedad o negocio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waLink("Hola ATOMIC! Quiero cotizar un sistema completo de seguridad: control de acceso + video portero + WiFi.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black text-sm uppercase tracking-wider hover:bg-neutral-100 transition-all shadow-2xl"
            >
              <MessageSquare size={16} />
              Cotizar sistema completo
              <ArrowRight size={14} />
            </a>
            <Link
              href="/web"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/[0.05] border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Ver toda la tienda
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
