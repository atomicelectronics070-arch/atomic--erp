"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Download,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Star,
  MapPin,
  Sparkles,
  ExternalLink,
  Award,
  Send,
  Building,
  Play,
  FileText,
  BadgeCheck,
} from "lucide-react";

// TikTok custom SVG icon
function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-3.6.04-7.2.06-10.8z" />
    </svg>
  );
}

export default function BienvenidaClient() {
  const [activeTab, setActiveTab] = useState<"nosotros" | "referencias" | "youtube" | "formulario">("formulario");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("Quito");
  const [producto, setProducto] = useState("Cámaras de Seguridad & CCTV");
  const [mensaje, setMensaje] = useState("");

  const officialPhone = "+593999047979";
  const officialPhoneDisplay = "099 904 7979";
  const officialEmail = "ventas@atomiccotizador.shop";

  // vCard generator & download
  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Solutions;ATOMIC;;;
FN:ATOMIC Solutions Ecuador
ORG:ATOMIC Solutions S.A.
TITLE:Tecnología, Domótica & Seguridad Electrónica
TEL;TYPE=WORK,VOICE:+593999047979
TEL;TYPE=CELL,VOICE:+593969043453
EMAIL;TYPE=WORK:${officialEmail}
URL:https://atomiccotizador.shop/bienvenida
ADR;TYPE=WORK:;;Quito;Pichincha;;Ecuador
NOTE:Empresa líder en tecnología y equipamiento electrónico. Envíos nacionales Servientrega y Garantía oficial de 1 año.
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ATOMIC_Solutions_Contacto.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() && !telefono.trim()) {
      alert("Por favor ingresa tu nombre y número de teléfono o WhatsApp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bienvenida/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre,
          phone: telefono,
          city: ciudad,
          requirement: `Interés en: ${producto}. Detalle: ${mensaje || "Sin comentarios"}`,
        }),
      });

      if (res.ok) {
        setFormSubmitted(true);
      } else {
        // Still proceed to WhatsApp smoothly
        setFormSubmitted(true);
      }
    } catch (_) {
      setFormSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLeadUrl = () => {
    const msg = `¡Hola ATOMIC Solutions! 👋 Mi nombre es ${nombre || "Cliente"} desde ${ciudad}.
Me interesa recibir el catálogo y descuento especial para: *${producto}*.
${mensaje ? `Comentarios: ${mensaje}` : "¿Me pueden ayudar con disponibilidad y precio promocional?"}`;
    return `https://wa.me/593999047979?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#026CDF]/20 selection:text-[#026CDF]">
      {/* ── Top Announcement Banner ── */}
      <div className="bg-[#026CDF] text-white px-4 py-2 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Sparkles size={14} className="text-yellow-300 animate-pulse" />
        <span>¡Bienvenido a ATOMIC Solutions! Envíos 100% asegurados a todo el Ecuador por Servientrega 🇪🇨</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
        
        {/* ═══════════════════════════════════════════════════ */}
        {/* 1. TARJETA DIGITAL DE PRESENTACIÓN / VIRTUAL CARD */}
        {/* ═══════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xl relative overflow-hidden text-center sm:text-left">
          {/* Subtle brand glow behind avatar */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
            {/* Logo Avatar with Atom Icon */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-1 shadow-lg border border-[#CBD5E1] flex items-center justify-center overflow-hidden">
                <img
                  src="/icon-192.png"
                  alt="ATOMIC Solutions Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow">
                <BadgeCheck size={16} />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
                  ATOMIC <span className="text-[#026CDF]">SOLUTIONS</span>
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <BadgeCheck size={12} /> Oficial 🇪🇨
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Tecnología, Domótica Inteligente & Seguridad Electrónica de Alta Gama.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#026CDF]" /> Quito · Envíos Nacionales
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" /> Garantía 1 Año
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-6 pt-6 border-t border-[#F1F5F9] relative z-10">
            <button
              onClick={downloadVCard}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow hover:shadow-md cursor-pointer"
            >
              <Download size={14} />
              <span>Guardar Contacto</span>
            </button>

            <a
              href={`https://wa.me/593999047979?text=${encodeURIComponent(
                "¡Hola ATOMIC Solutions! 👋 Vengo desde el portal de bienvenida de Marketplace y deseo consultar información y promociones."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow hover:shadow-md"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Directo</span>
            </a>

            <a
              href="tel:+593999047979"
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#026CDF] border border-blue-200 text-xs font-bold transition"
            >
              <Phone size={14} />
              <span>Llamar al Asesor</span>
            </a>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* 2. CANALES DE CONTACTO OFICIALES (REDES SOCIALES) */}
        {/* ═══════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Share2 size={16} className="text-[#026CDF]" />
              Canales Oficiales de Contacto
            </h2>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● Atención Activa
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/593999047979?text=Hola%20ATOMIC%20Solutions%2C%20deseo%20asesoria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow">
                <MessageCircle size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">WhatsApp</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">099 904 7979</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/atomic.electronics.ec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-300 text-pink-700 transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shadow">
                <Instagram size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">Instagram</p>
                <p className="text-[10px] text-slate-500 truncate">@atomic.electronics</p>
              </div>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@atomic_ecuador_oficial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow">
                <TikTokIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">TikTok</p>
                <p className="text-[10px] text-slate-500 truncate">@atomic_ecuador</p>
              </div>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/atomicecuador"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow">
                <Facebook size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">Facebook</p>
                <p className="text-[10px] text-slate-500 truncate">Atomic Ecuador</p>
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@AtomicSolutionsEc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow">
                <Youtube size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">YouTube</p>
                <p className="text-[10px] text-slate-500 truncate">Reviews & Demos</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${officialEmail}?subject=Consulta%20desde%20Portal%20ATOMIC`}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">Correo</p>
                <p className="text-[10px] text-slate-500 truncate">ventas@atomic...</p>
              </div>
            </a>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* 3. TABS DE NAVEGACIÓN (FORMULARIO, NOSOTROS, REFERENCIAS, YOUTUBE) */}
        {/* ═══════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("formulario")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "formulario"
                ? "bg-[#026CDF] text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Send size={14} />
            <span>Solicitar Catálogo / Cotización</span>
          </button>

          <button
            onClick={() => setActiveTab("nosotros")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "nosotros"
                ? "bg-[#026CDF] text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Building size={14} />
            <span>Sobre Nosotros</span>
          </button>

          <button
            onClick={() => setActiveTab("referencias")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "referencias"
                ? "bg-[#026CDF] text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Star size={14} />
            <span>Referencias</span>
          </button>

          <button
            onClick={() => setActiveTab("youtube")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "youtube"
                ? "bg-[#026CDF] text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Youtube size={14} />
            <span>YouTube & Demos</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PESTAÑA: FORMULARIO INTERACTIVO (CARTA VIRTUAL) */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "formulario" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md space-y-6 animate-in fade-in duration-300">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#026CDF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                🎁 Descuento Exclusivo Marketplace
              </span>
              <h3 className="text-lg font-black text-[#0F172A] mt-2">
                Solicita Catálogo, Precios de Mayorista & Asesoría
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Completa tus datos y recibirás la proforma formal con garantía por WhatsApp en minutos.
              </p>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tu Nombre o Razón Social
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#026CDF] focus:ring-2 focus:ring-[#026CDF]/20 text-sm outline-none transition bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp o Teléfono (Ecuador)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 099 123 4567"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#026CDF] focus:ring-2 focus:ring-[#026CDF]/20 text-sm outline-none transition bg-slate-50/50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Ciudad o Cantón de Destino
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Quito / Guayaquil / Cuenca"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#026CDF] focus:ring-2 focus:ring-[#026CDF]/20 text-sm outline-none transition bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Producto o Requerimiento de Interés
                  </label>
                  <select
                    value={producto}
                    onChange={(e) => setProducto(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#026CDF] focus:ring-2 focus:ring-[#026CDF]/20 text-sm outline-none transition bg-white"
                  >
                    <option value="Cámaras de Seguridad & CCTV HD / 4K">📹 Cámaras de Seguridad & CCTV HD / 4K</option>
                    <option value="Domótica & Cerraduras Inteligentes Biométricas">🔐 Cerraduras Inteligentes & Domótica</option>
                    <option value="Barreras Vehiculares & Motores de Garaje">🚧 Barreras Vehiculares & Control de Acceso</option>
                    <option value="Torniquetes Peatonales & Relojes Biométricos">⏱ Control de Asistencia & Torniquetes</option>
                    <option value="Equipamiento de Redes, Wi-Fi 6 & Fibra">📡 Redes Corporativas & Wi-Fi de Largo Alcance</option>
                    <option value="Computadores, Monitores & Accesorios">💻 Computadores, Monitores & Accesorios</option>
                    <option value="Otro Requerimiento / Solución Especial">⚡ Otro Requerimiento Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Comentario o Detalle Adicional (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Necesito 4 cámaras para negocio con instalación..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#026CDF] focus:ring-2 focus:ring-[#026CDF]/20 text-sm outline-none transition bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#026CDF] hover:bg-[#0256b1] text-white text-sm font-black uppercase tracking-wider transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Procesando...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Enviar y Recibir Cotización con Descuento</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h4 className="text-base font-black text-emerald-900">
                    ¡Solicitud Recibida con Éxito, {nombre}!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Tu asesor técnico ya tiene tu información. Abre WhatsApp ahora mismo para enviarte el catálogo en PDF y confirmar tu descuento.
                  </p>
                </div>

                <a
                  href={getWhatsAppLeadUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white text-sm font-black uppercase tracking-wider transition shadow-md hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  <span>Abrir WhatsApp con mi Asesor</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* PESTAÑA: SOBRE NOSOTROS */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "nosotros" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md space-y-6 animate-in fade-in duration-300">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#026CDF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                🏢 Respaldo & Compromiso
              </span>
              <h3 className="text-xl font-black text-[#0F172A] mt-2">
                ATOMIC Solutions Ecuador
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Somos una empresa ecuatoriana especializada en soluciones integrales de tecnología, seguridad electrónica perimetral, domótica para residencias y edificios inteligentes, y equipamiento corporativo para empresas a nivel nacional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#026CDF] flex items-center justify-center">
                  <Truck size={18} />
                </div>
                <h4 className="text-xs font-black uppercase text-slate-800">Envíos a Nivel Nacional</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Despachos diarios 100% asegurados a las 24 provincias mediante Servientrega Express y transporte interprovincial con número de rastreo.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="text-xs font-black uppercase text-slate-800">Garantía Real de 1 Año</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Todos nuestros productos cuentan con garantía escrita oficial de 12 meses contra defectos de fábrica con servicio técnico directo.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <h4 className="text-xs font-black uppercase text-slate-800">Facturación SRI Legal</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Emitimos facturación electrónica autorizada por el SRI con desglose del 15% de IVA para deducción tributaria y garantía de tu inversión.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Award size={18} />
                </div>
                <h4 className="text-xs font-black uppercase text-slate-800">Formas de Pago Transparentes</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Transferencias Banco Pichincha, Guayaquil, Produbanco, Tarjeta de Crédito en cuotas, Efectivo en entregas locales y Binance Pay / USDT.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* PESTAÑA: REFERENCIAS & TESTIMONIOS */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "referencias" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md space-y-6 animate-in fade-in duration-300">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ⭐️ Pruebas de Confianza
              </span>
              <h3 className="text-xl font-black text-[#0F172A] mt-2">
                Referencias Reales de Clientes Satisfechos
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                La satisfacción y seguridad de nuestros compradores en todo el país es nuestro mayor respaldo.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-200 text-center">
              <div>
                <p className="text-2xl font-black text-[#026CDF] font-mono">+1,850</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Envíos Exitosos</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600 font-mono">4.9 / 5</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Calificación Promedio</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-500 font-mono">100%</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Garantías Resueltas</p>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Marco Echeverría</span>
                  <div className="flex text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "Compré un kit de 4 cámaras y una cerradura digital. El envío a Guayaquil por Servientrega llegó al día siguiente en la mañana. Muy buena asesoría por WhatsApp para configurar la app."
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Guayaquil · Entrega Verificada</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Ing. Patricia Valverde</span>
                  <div className="flex text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "Excelente empresa. Necesitábamos cotización formal para el conjunto residencial en Cuenca. Nos enviaron proforma con desglose de IVA y el despacho fue puntual con guía de Servientrega."
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Cuenca · Conjunto Residencial</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">David Cando</span>
                  <div className="flex text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "Atención impecable en Marketplace. Me mandaron fotos reales y videos de prueba antes de transferir. 100% recomendados en tecnología."
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Quito · Retiro Inmediato</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* PESTAÑA: YOUTUBE & DEMOSTRACIONES */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "youtube" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  ▶️ Canal Oficial de YouTube
                </span>
                <h3 className="text-xl font-black text-[#0F172A] mt-2">
                  Demostraciones & Tutoriales en Video
                </h3>
              </div>

              <a
                href="https://www.youtube.com/@AtomicSolutionsEc"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow"
              >
                <Youtube size={16} />
                <span>Suscribirse</span>
              </a>
            </div>

            <p className="text-xs text-slate-600">
              Mira cómo funcionan nuestros equipos antes de comprar: calidad de imagen nocturna en cámaras, apertura remota desde celular con cerraduras inteligentes y unboxing de equipos.
            </p>

            {/* Video Cards Grid */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group relative">
                <div className="aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-white relative">
                  {/* Decorative preview banner */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-2 py-0.5 rounded w-fit mb-1">
                      REVIEW OFICIAL
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Demostración de Cámaras de Seguridad HD con Visión Nocturna a Color
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Configuración paso a paso en celular y alertas en tiempo real.
                    </p>
                  </div>
                  <a
                    href="https://www.youtube.com/@AtomicSolutionsEc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                  >
                    <Play size={24} className="ml-1" />
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group relative">
                <div className="aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-white relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-2 py-0.5 rounded w-fit mb-1">
                      UNBOXING & TEST
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Cerradura Biométrica Inteligente: Huella, Código, Tarjeta y App Wi-Fi
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Instalación residencial y prueba de seguridad antibumping.
                    </p>
                  </div>
                  <a
                    href="https://www.youtube.com/@AtomicSolutionsEc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                  >
                    <Play size={24} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href="https://www.youtube.com/@AtomicSolutionsEc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow"
              >
                <Youtube size={16} className="text-red-500" />
                <span>Ver Más Videos en Nuestro Canal Oficial</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* 4. FOOTER INSTITUCIONAL */}
        {/* ═══════════════════════════════════════════════════ */}
        <div className="text-center space-y-2 pt-6 border-t border-slate-200 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            © {new Date().getFullYear()} ATOMIC Solutions Ecuador · RUC: 1723948291001
          </p>
          <p>
            Matriz: Quito, Ecuador · Despachos a Nivel Nacional · Términos & Garantía Oficial
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 font-mono text-[11px] text-[#026CDF]">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>
            <span>·</span>
            <Link href="/dashboard" className="hover:underline">
              Portal Asesores
            </Link>
            <span>·</span>
            <a href="https://wa.me/593999047979" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Soporte WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
