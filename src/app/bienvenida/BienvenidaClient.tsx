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
  ShoppingBag,
  Layers,
  Search,
  Check,
  ArrowRight,
  Flame,
  Clock,
  RefreshCw
} from "lucide-react";
import {
  SUICIDE_SQUAD_CATEGORIES,
  SuicideSquadCategoryLanding
} from "@/lib/data/suicideSquadCategories";
import { generateCategoryCatalogPDF } from "@/lib/pdf/categoryCatalogPdf";

// TikTok custom SVG icon
function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-3.6.04-7.2.06-10.8z" />
    </svg>
  );
}

export default function BienvenidaClient() {
  const [activeTab, setActiveTab] = useState<"formulario" | "remate" | "catalogos" | "nosotros" | "referencias" | "youtube">("formulario");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  // Clearance Stock (Stock de Remate) states
  const [remateItems, setRemateItems] = useState<any[]>([]);
  const [loadingRemate, setLoadingRemate] = useState(false);
  const [remateSearch, setRemateSearch] = useState("");

  const fetchRemateItems = async () => {
    setLoadingRemate(true);
    try {
      const res = await fetch("/api/stock-remate");
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setRemateItems(data.products);
      }
    } catch (e) {
      console.error("Error loading clearance products:", e);
    } finally {
      setLoadingRemate(false);
    }
  };

  React.useEffect(() => {
    fetchRemateItems();
  }, []);

  // Form states
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("Quito");
  const [producto, setProducto] = useState("Cámaras de Seguridad & CCTV");
  const [mensaje, setMensaje] = useState("");

  const officialPhone = "+593963226319";
  const officialPhoneDisplay = "096 322 6319";
  const secondaryPhone = "+593999047979";
  const secondaryPhoneDisplay = "099 904 7979";
  const officialEmail = "ventas@atomiccotizador.shop";

  // vCard generator & download
  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Solutions;ATOMIC;;;
FN:ATOMIC Solutions Ecuador
ORG:ATOMIC Solutions S.A.
TITLE:Tecnología, Domótica & Seguridad Electrónica
TEL;TYPE=WORK,VOICE:${officialPhone}
TEL;TYPE=CELL,VOICE:${secondaryPhone}
EMAIL;TYPE=WORK:${officialEmail}
URL:https://atomiccotizador.shop/bienvenida
ADR;TYPE=WORK:;;Quito;Pichincha;;Ecuador
NOTE:Empresa líder en tecnología y equipamiento electrónico. Envíos nacionales Servientrega y Garantía oficial de 1 año.
X-SOCIALPROFILE;type=tiktok:https://www.tiktok.com/@santiagoguzman216
X-SOCIALPROFILE;type=instagram:https://www.instagram.com/atomic_industries_26
X-SOCIALPROFILE;type=youtube:https://youtube.com/@atomicmenquantum
X-SOCIALPROFILE;type=facebook:https://www.facebook.com/share/14uWsX16BQH/
X-SOCIALPROFILE;type=tiktok:https://www.tiktok.com/@juanguzman35886
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

  const handleDownloadCategoryPdf = async (cat: SuicideSquadCategoryLanding) => {
    setDownloadingSlug(cat.slug);
    try {
      const ok = await generateCategoryCatalogPDF(cat);
      if (ok) {
        setDownloadNotification(`¡Catálogo oficial de ${cat.name} descargado con éxito!`);
        setTimeout(() => setDownloadNotification(null), 4000);
      }
    } catch (e) {
      console.error("Error downloading category PDF:", e);
    } finally {
      setDownloadingSlug(null);
    }
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

          {/* Quick CTA Actions (PRIORIZANDO VER PRODUCTOS Y CONTACTO A WHATSAPP) */}
          <div className="space-y-3 mt-6 pt-6 border-t border-[#F1F5F9] relative z-10">
            {/* Fila Principal de Alta Prioridad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/bienvenida/categoria"
                className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 active:scale-95 group text-center"
              >
                <ShoppingBag size={18} className="animate-pulse shrink-0" />
                <span>Ver Productos & Catálogo 2026</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>

              <a
                href={`https://wa.me/593963226319?text=${encodeURIComponent(
                  "¡Hola ATOMIC Solutions! 👋 Vengo desde la tarjeta de presentación oficial y deseo cotizar productos con asesoría y garantía."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 active:scale-95 text-center"
              >
                <MessageCircle size={18} className="shrink-0" />
                <span>Contacto WhatsApp Inmediato</span>
              </a>
            </div>

            {/* 🔥 BANNER BOTÓN STOCK DE REMATE (% OFF) */}
            <button
              onClick={() => {
                setActiveTab("remate");
                const elem = document.getElementById("seccion-catalogos-tabs");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-rose-500/25 flex items-center justify-between gap-3 cursor-pointer group active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Flame size={20} className="text-yellow-300 animate-pulse shrink-0" />
                <span className="truncate">🔥 STOCK DE REMATE · HASTA -60% OFF</span>
              </div>
              <span className="text-[11px] font-mono font-bold bg-black/30 px-3 py-1 rounded-full shrink-0 group-hover:scale-105 transition-transform flex items-center gap-1">
                <span>Ver Ofertas</span>
                <ArrowRight size={12} />
              </span>
            </button>

            {/* Fila Secundaria de Soporte & Catálogo */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setActiveTab("catalogos");
                  const elem = document.getElementById("seccion-catalogos-tabs");
                  if (elem) elem.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition shadow cursor-pointer text-center"
              >
                <Download size={13} className="shrink-0 text-orange-400" />
                <span className="truncate">Descargar Catálogo PDF</span>
              </button>

              <button
                onClick={downloadVCard}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-bold transition cursor-pointer text-center"
              >
                <FileText size={13} className="shrink-0 text-blue-600" />
                <span className="truncate">Guardar Contacto</span>
              </button>

              <a
                href={`tel:${officialPhone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#026CDF] border border-blue-200 text-[11px] font-bold transition text-center"
              >
                <Phone size={13} className="shrink-0" />
                <span className="truncate">Llamar al Asesor</span>
              </a>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* 2. CANALES DE CONTACTO OFICIALES (REDES SOCIALES) */}
        {/* ═══════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Share2 size={16} className="text-[#026CDF]" />
              Canales Oficiales & Redes Sociales ATOMIC
            </h2>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
              ● En Línea 24/7
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* 1. WhatsApp Oficial Cotizaciones (PRIORITARIO) */}
            <a
              href="https://wa.me/593963226319?text=Hola%20ATOMIC%20Solutions%2C%20deseo%20asesoria%20comercial%20y%20precios"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] transition group shadow-sm hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate text-emerald-950">WhatsApp Cotizaciones</p>
                <p className="text-[10px] text-emerald-700 font-mono truncate font-bold">{officialPhoneDisplay} · Inmediato</p>
              </div>
            </a>

            {/* 2. TikTok Jefe Técnico (ATOMIC ELECTRONICS) */}
            <a
              href="https://www.tiktok.com/@santiagoguzman216?_r=1&_t=ZS-9AU9OLRgZkY"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/5 hover:bg-slate-900/10 border border-slate-300 text-slate-900 transition group shadow-sm hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform">
                <TikTokIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">Jefe Técnico (Pruebas)</p>
                <p className="text-[10px] text-slate-500 truncate font-mono">@santiagoguzman216 · Demos</p>
              </div>
            </a>

            {/* 3. Instagram Industrias (LÍNEA DE PRODUCTOS) */}
            <a
              href="https://www.instagram.com/atomic_industries_26?cplk=bDczYW9xN2F6NXFs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-300 text-pink-700 transition group shadow-sm hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform">
                <Instagram size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate text-purple-950">Atomic Industrias</p>
                <p className="text-[10px] text-pink-700 truncate font-mono">@atomic_industries_26</p>
              </div>
            </a>

            {/* 4. YouTube Canal Comercial & Capacitaciones */}
            <a
              href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition group shadow-sm hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform">
                <Youtube size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate text-red-950">Canal Comercial & Demos</p>
                <p className="text-[10px] text-red-600 truncate font-mono">@atomicmenquantum</p>
              </div>
            </a>

            {/* 5. Facebook Línea de Productos */}
            <a
              href="https://www.facebook.com/share/14uWsX16BQH/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition group shadow-sm hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform">
                <Facebook size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate text-blue-950">Atomic Industrias FB</p>
                <p className="text-[10px] text-blue-600 truncate">Línea de Productos Oficial</p>
              </div>
            </a>

            {/* 6. TikTok Atomic Home (UNBOXING & REVIEWS) */}
            <a
              href="https://www.tiktok.com/@juanguzman35886?_r=1&_t=ZS-9AU9ov9ihow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/5 hover:bg-slate-900/10 border border-slate-300 text-slate-900 transition group shadow-sm hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform">
                <TikTokIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">Atomic Home (Unboxing)</p>
                <p className="text-[10px] text-slate-500 truncate font-mono">@juanguzman35886</p>
              </div>
            </a>

            {/* 7. WhatsApp Ventas & Despachos Secundario */}
            <a
              href="https://wa.me/593999047979?text=Hola%20ATOMIC%20Solutions%2C%20deseo%20consultar%20mi%20despacho%20Servientrega"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition group shadow-sm hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform">
                <Truck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">Despachos & Guías</p>
                <p className="text-[10px] text-emerald-700 truncate font-mono">{secondaryPhoneDisplay} · Servientrega</p>
              </div>
            </a>

            {/* 8. Correo Institucional */}
            <a
              href={`mailto:${officialEmail}?subject=Consulta%20desde%20Portal%20ATOMIC`}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition group shadow-sm hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">Correo Legal</p>
                <p className="text-[10px] text-slate-500 truncate">ventas@atomic...</p>
              </div>
            </a>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* 3. TABS DE NAVEGACIÓN (FORMULARIO, CATÁLOGOS PDF, NOSOTROS, REFERENCIAS, YOUTUBE) */}
        {/* ═══════════════════════════════════════════════════ */}
        <div id="seccion-catalogos-tabs" className="flex items-center justify-between border-b border-[#E2E8F0] gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("formulario")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "formulario"
                ? "bg-[#026CDF] text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Send size={14} />
            <span>Solicitar Cotización</span>
          </button>

          <button
            onClick={() => setActiveTab("remate")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "remate"
                ? "bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-md shadow-rose-500/30"
                : "text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200"
            }`}
          >
            <Flame size={14} className={activeTab === "remate" ? "text-yellow-300 animate-pulse" : "text-rose-500"} />
            <span>🔥 Stock de Remate (% OFF)</span>
          </button>

          <button
            onClick={() => setActiveTab("catalogos")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "catalogos"
                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30"
                : "text-slate-600 hover:text-slate-900 hover:bg-orange-50 border border-transparent hover:border-orange-200"
            }`}
          >
            <Download size={14} className={activeTab === "catalogos" ? "text-white" : "text-orange-500"} />
            <span>📥 Catálogos PDF (Descargables)</span>
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
        {/* PESTAÑA: STOCK DE REMATE (% OFF / LIQUIDACIÓN) */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "remate" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md space-y-6 animate-in fade-in duration-300">
            {/* Header Showcase Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white space-y-3 relative overflow-hidden border border-rose-500/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/40 flex items-center gap-1.5 font-mono">
                  <Flame size={14} className="text-rose-400 animate-pulse" />
                  Liquidación Inmediata · Stock de Remate
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                  Descuentos hasta -60% OFF
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>Vitrina Oficial de Stock de Remate</span>
                  <span className="text-rose-400 font-mono text-base sm:text-lg">[% OFF]</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Aprovecha precios de liquidación por renovación de inventario y últimas unidades en bodega. 
                  Todos los artículos cuentan con garantía legal ATOMIC de 1 año y entrega nacional inmediata vía Servientrega.
                </p>
              </div>

              {/* Badges / Guarantees bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl">
                  <Flame size={14} className="text-rose-400 shrink-0" />
                  <span>{remateItems.length} Artículos en Oferta</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>100% Nuevos con Garantía</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl">
                  <Truck size={14} className="text-cyan-400 shrink-0" />
                  <span>Despacho 24h Servientrega</span>
                </div>
              </div>
            </div>

            {/* Search Bar for Clearance Products */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={remateSearch}
                  onChange={(e) => setRemateSearch(e.target.value)}
                  placeholder="Buscar en remate por nombre, SKU o categoría..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-xs outline-none transition bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 self-end sm:self-auto">
                <button
                  onClick={fetchRemateItems}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 font-bold cursor-pointer"
                  title="Recargar artículos"
                >
                  <RefreshCw size={12} className={loadingRemate ? "animate-spin" : ""} />
                  <span>Actualizar</span>
                </button>
                <span>
                  {remateItems.filter((i) => {
                    const q = remateSearch.toLowerCase();
                    return !q || i.name.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q);
                  }).length} productos disponibles
                </span>
              </div>
            </div>

            {/* Product Cards Grid */}
            {loadingRemate ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw size={24} className="animate-spin text-rose-500 mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Cargando productos en Stock de Remate...</p>
              </div>
            ) : remateItems.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                <Flame size={32} className="text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">No hay productos en Stock de Remate en este momento</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pronto agregaremos nuevas promociones y liquidaciones de equipos tecnológicos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {remateItems
                  .filter((item) => {
                    const q = remateSearch.toLowerCase();
                    return !q || item.name.toLowerCase().includes(q) || item.sku?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
                  })
                  .map((item) => {
                    const mainImage = item.images?.[0] || "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80";
                    const isLowStock = item.stock <= 2;
                    const discount = item.discountPercent || (item.compareAtPrice > item.price ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100) : 0);

                    const whatsappRemateMsg = `¡Hola ATOMIC Solutions! 👋 Deseo comprar de inmediato el producto en *Stock de Remate*: *${item.name}* (Código: ${item.sku}) por *$${item.price.toFixed(2)} USD* (con ${discount}% OFF). ¿Aún tienen unidades disponibles?`;

                    return (
                      <div
                        key={item.id || item.sku}
                        className="group rounded-3xl bg-white border-2 border-slate-200 hover:border-rose-500/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        {/* Image Container with Badges */}
                        <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                          <img
                            src={mainImage}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                          {/* % OFF Ribbon */}
                          {discount > 0 && (
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-xs font-mono shadow-lg flex items-center gap-1.5 border border-white/20 animate-pulse">
                              <Flame size={14} className="text-yellow-300" />
                              <span>-{discount}% OFF</span>
                            </div>
                          )}

                          {/* Remaining Stock Badge */}
                          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold backdrop-blur-md border ${
                            isLowStock
                              ? "bg-rose-500/90 text-white border-rose-300"
                              : "bg-emerald-600/90 text-white border-emerald-300"
                          }`}>
                            {item.stock} {item.stock === 1 ? "unidad" : "unidades"}
                          </div>

                          {/* Category Tag */}
                          <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-mono">
                            {item.category || "Liquidación"}
                          </div>
                        </div>

                        {/* Body Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                SKU: {item.sku}
                              </span>
                              <span className="text-rose-600 font-bold uppercase text-[10px]">
                                Liquidación 2026
                              </span>
                            </div>

                            <h4 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                              {item.name}
                            </h4>

                            {item.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Pricing Block */}
                          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-1">
                            {item.compareAtPrice && item.compareAtPrice > item.price && (
                              <div className="flex items-baseline justify-between text-xs font-mono text-slate-500">
                                <span>PVP Normal:</span>
                                <span className="line-through text-slate-400">
                                  ${item.compareAtPrice.toFixed(2)} USD
                                </span>
                              </div>
                            )}

                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-black uppercase text-rose-700 font-mono flex items-center gap-1">
                                <Flame size={13} className="text-rose-600" />
                                Precio Remate:
                              </span>
                              <span className="text-xl font-black font-mono text-rose-600">
                                ${item.price.toFixed(2)} USD
                              </span>
                            </div>
                          </div>

                          {/* WhatsApp Direct Buy Button */}
                          <a
                            href={`https://wa.me/593963226319?text=${encodeURIComponent(whatsappRemateMsg)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-emerald-600 hover:from-[#20ba59] hover:to-emerald-500 text-white text-xs font-black uppercase tracking-wider transition shadow-md hover:shadow-lg active:scale-98"
                          >
                            <MessageCircle size={16} />
                            <span>Apartar / Comprar por WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* PESTAÑA: CATÁLOGOS DESCARGABLES POR CATEGORÍA (PDF) */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "catalogos" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  📥 Catálogos Oficiales 2026 en PDF
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  11 Categorías Especializadas
                </span>
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mt-2">
                Descarga de Proformas & Catálogos por Categoría
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Genera al instante el documento PDF formal con especificaciones técnicas, precios oficiales PVP con 15% de IVA desglosado, garantía legal de 1 año y respaldo de despachos Servientrega a nivel nacional.
              </p>
            </div>

            {/* Notification Toast */}
            {downloadNotification && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-emerald-800 animate-in fade-in shadow-sm">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{downloadNotification}</span>
              </div>
            )}

            {/* Search filter for categories */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar categoría para descargar catálogo (ej. Cerraduras, CCTV, Solar, Alarmas)..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-slate-50/50 transition"
              />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUICIDE_SQUAD_CATEGORIES.filter((cat) => {
                const q = catalogSearch.toLowerCase();
                return (
                  cat.name.toLowerCase().includes(q) ||
                  cat.subtitle.toLowerCase().includes(q) ||
                  cat.squadName.toLowerCase().includes(q) ||
                  cat.badge.toLowerCase().includes(q)
                );
              }).map((cat) => {
                const isDownloading = downloadingSlug === cat.slug;
                const whatsappCatMsg = `¡Hola ATOMIC Solutions! 👋 Deseo cotizar productos de la categoría *${cat.name}* (${cat.squadCode}) con garantía oficial y envío a mi ciudad.`;

                return (
                  <div
                    key={cat.slug}
                    className="p-5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-orange-400/80 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-orange-400">
                          {cat.squadCode} · {cat.squadName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                          {cat.badge}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {cat.subtitle}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-600">
                        <span>PVP: ${cat.priceRange.min} - ${cat.priceRange.max} USD</span>
                        <span className="text-emerald-700 font-bold font-sans">IVA 15% Inc.</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/70">
                      <button
                        onClick={() => handleDownloadCategoryPdf(cat)}
                        disabled={isDownloading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold transition shadow-sm active:scale-98 cursor-pointer disabled:opacity-60"
                      >
                        {isDownloading ? (
                          <>
                            <RefreshCw size={14} className="animate-spin text-white" />
                            <span>Generando PDF Oficial...</span>
                          </>
                        ) : (
                          <>
                            <Download size={14} className="text-white" />
                            <span>Descargar Catálogo PDF</span>
                          </>
                        )}
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/bienvenida/categoria/${cat.slug}`}
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold transition text-center"
                        >
                          <ShoppingBag size={12} className="text-blue-600" />
                          <span>Ver Productos</span>
                        </Link>

                        <a
                          href={`https://wa.me/593963226319?text=${encodeURIComponent(whatsappCatMsg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold transition text-center"
                        >
                          <MessageCircle size={12} className="text-emerald-600" />
                          <span>Cotizar WA</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
        {/* PESTAÑA: YOUTUBE & DEMOSTRACIONES MULTIMEDIA */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "youtube" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  ▶️ Canal Oficial & Demos en Video
                </span>
                <h3 className="text-xl font-black text-[#0F172A] mt-2">
                  Capacitaciones, Unboxing & Pruebas en Vivo
                </h3>
              </div>

              <a
                href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow"
              >
                <Youtube size={16} />
                <span>@atomicmenquantum</span>
              </a>
            </div>

            <p className="text-xs sm:text-sm text-slate-600">
              Conoce el funcionamiento real de cada equipo antes de comprar: calidad de imagen nocturna en cámaras, aperturas biométricas en cerraduras inteligentes y unboxings detallados.
            </p>

            {/* Video Cards Grid */}
            <div className="space-y-4">
              {/* Video 1: YouTube Oficial Capacitaciones */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group relative">
                <div className="aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-white relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-2 py-0.5 rounded w-fit mb-1">
                      YOUTUBE COMERCIAL & CAPACITACIONES
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      ATOMIC: Presentación de Línea de Productos & Capacitaciones Técnicas
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Canal oficial @atomicmenquantum · Demostraciones completas y asesoría técnica.
                    </p>
                  </div>
                  <a
                    href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                  >
                    <Play size={24} className="ml-1" />
                  </a>
                </div>
              </div>

              {/* Video 2: TikTok Jefe Técnico */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group relative">
                <div className="aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-white relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-mono uppercase bg-black text-white font-bold px-2 py-0.5 rounded w-fit mb-1 border border-slate-600 flex items-center gap-1">
                      <TikTokIcon className="w-3 h-3" />
                      TIKTOK JEFE TÉCNICO
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Pruebas de Campo, Instalación y Configuración por el Jefe Técnico
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Santiago Guzmán (@santiagoguzman216) · Respuestas técnicas directas y testeos.
                    </p>
                  </div>
                  <a
                    href="https://www.tiktok.com/@santiagoguzman216?_r=1&_t=ZS-9AU9OLRgZkY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-black/90 text-white border-2 border-white/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                  >
                    <Play size={24} className="ml-1" />
                  </a>
                </div>
              </div>

              {/* Video 3: TikTok Atomic Home Unboxing */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group relative">
                <div className="aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-white relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-mono uppercase bg-blue-600 text-white font-bold px-2 py-0.5 rounded w-fit mb-1 flex items-center gap-1">
                      <TikTokIcon className="w-3 h-3" />
                      ATOMIC HOME UNBOXING
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Unboxing de Cerraduras Inteligentes, Domótica y Gadgets Residenciales
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Juan Guzmán (@juanguzman35886) · Desempaque real y primeros pasos de usuario.
                    </p>
                  </div>
                  <a
                    href="https://www.tiktok.com/@juanguzman35886?_r=1&_t=ZS-9AU9ov9ihow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                  >
                    <Play size={24} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow text-center"
              >
                <Youtube size={16} />
                <span>Suscribirse a YouTube (@atomicmenquantum)</span>
              </a>

              <a
                href="https://www.tiktok.com/@santiagoguzman216?_r=1&_t=ZS-9AU9OLRgZkY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow text-center"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>Seguir a Jefe Técnico en TikTok</span>
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
