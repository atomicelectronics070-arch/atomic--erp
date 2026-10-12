"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Star,
  Sparkles,
  ExternalLink,
  Award,
  Zap,
  Lock,
  Camera,
  Layers,
  ChevronRight,
  ArrowRight,
  Check,
  Building,
  Home,
  Store,
  DollarSign,
  ShoppingCart,
  Send,
  HelpCircle,
  FileText,
  Download,
  RefreshCw,
  Instagram,
  Facebook,
  Youtube,
  Flame
} from "lucide-react";
import {
  SuicideSquadCategoryLanding,
  SUICIDE_SQUAD_CATEGORIES,
  CategoryProduct
} from "@/lib/data/suicideSquadCategories";
import { generateCategoryCatalogPDF } from "@/lib/pdf/categoryCatalogPdf";

// TikTok custom SVG icon
function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-3.6.04-7.2.06-10.8z" />
    </svg>
  );
}

export default function CategoryLandingClient({
  category
}: {
  category: SuicideSquadCategoryLanding;
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [calcQty, setCalcQty] = useState(2);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Form states
  const [leadNombre, setLeadNombre] = useState("");
  const [leadTelefono, setLeadTelefono] = useState("");
  const [leadCiudad, setLeadCiudad] = useState("Quito");
  const [leadComentario, setLeadComentario] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const officialPhone = "+593999047979";
  const officialPhoneDisplay = "099 904 7979";
  const officialWhatsApp = "593963226319"; // Número oficial de WhatsApp Business

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${category.name} | ATOMIC Ecuador`,
        text: `Conoce el catálogo oficial y precios de ${category.name} en ATOMIC Solutions Ecuador:`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await generateCategoryCatalogPDF(category);
    } catch (e) {
      console.error("Error generating category PDF:", e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleAddToQuote = (prod: CategoryProduct) => {
    try {
      const saved = localStorage.getItem("atomic_quote_items");
      const current = saved ? JSON.parse(saved) : [];
      const existing = current.find((it: any) => it.productId === prod.id || it.description === prod.name);

      let updated;
      if (existing) {
        updated = current.map((it: any) =>
          it.productId === prod.id || it.description === prod.name
            ? { ...it, quantity: (it.quantity || 1) + 1 }
            : it
        );
      } else {
        updated = [
          ...current,
          {
            id: String(Date.now() + Math.random()),
            productId: prod.id,
            description: prod.name,
            quantity: 1,
            unitPrice: prod.price,
            customImage: prod.imageUrl
          }
        ];
      }
      localStorage.setItem("atomic_quote_items", JSON.stringify(updated));

      // Carrito web
      const savedCart = localStorage.getItem("atomic_cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];
      const inCart = cart.find((it: any) => it.id === prod.id);
      if (inCart) {
        inCart.quantity += 1;
      } else {
        cart.push({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: 1,
          image: prod.imageUrl
        });
      }
      localStorage.setItem("atomic_cart", JSON.stringify(cart));

      setAddedItem(prod.id);
      setTimeout(() => setAddedItem(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadNombre.trim() || !leadTelefono.trim()) return;
    setFormLoading(true);

    try {
      await fetch("/api/bienvenida/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: leadNombre,
          telefono: leadTelefono,
          ciudad: leadCiudad,
          producto: category.name,
          mensaje: leadComentario || `Solicitud desde Landing de ${category.name}`
        })
      });
      setFormSent(true);
    } catch (err) {
      setFormSent(true);
    } finally {
      setFormLoading(false);
    }
  };

  const estimatedTotal = (calcQty * category.priceRange.min * 1.15).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* ── HEADER NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/bienvenida" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              ⚛
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-lg tracking-tight text-slate-900 leading-none">
                ATOMIC <span className="text-blue-600 text-xs px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 font-semibold">ECUADOR</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Catálogo Oficial & Cotizaciones</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Compartir Landing"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>{copiedLink ? "¡Enlace Copiado!" : "Compartir"}</span>
            </button>

            <a
              href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(category.whatsappPitch)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Asesor</span>
            </a>
          </div>
        </div>

        {/* ── SELECTOR RÁPIDO DE CATEGORÍAS SUICIDE SQUAD ── */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2 overflow-x-auto scrollbar-none">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs whitespace-nowrap">
            <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Escuadrones:
            </span>

            {/* Quick Link to Stock de Remate */}
            <Link
              href="/bienvenida#seccion-catalogos-tabs"
              className="px-2.5 py-1 rounded-full text-xs font-black transition-all bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm flex items-center gap-1 hover:brightness-110 active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>🔥 Stock de Remate % OFF</span>
            </Link>

            {SUICIDE_SQUAD_CATEGORIES.map((cat) => {
              const isActive = cat.slug === category.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/bienvenida/categoria/${cat.slug}`}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white py-14 px-4">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          
          {/* Badge Squad & Category */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-4 shadow-sm">
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-wider uppercase">
              {category.squadCode}
            </span>
            <span>{category.squadName}</span>
            <span className="text-white/40">•</span>
            <span className="text-amber-300 font-bold">{category.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            {category.heroHeadline}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            {category.heroPitch}
          </p>

          {/* Badges de Garantía y Respaldo */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantía Oficial 1 Año</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-200">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Envíos Servientrega a 24 Provincias</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-200">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Factura Autorizada SRI Ecuador 🇪🇨</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Soporte Post-Venta Directo</span>
            </div>
          </div>

          {/* CTAs Principales (Priorizando Ver Productos, WhatsApp y Descargar Catálogo PDF) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-600/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isDownloadingPdf ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generando PDF Oficial...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Descargar Catálogo Oficial PDF</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(category.whatsappPitch)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950" />
              <span>Cotizar por WhatsApp</span>
            </a>

            <a
              href="#catalogo-resumido"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <span>Ver Lista de Artículos ↓</span>
            </a>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 1: PRESENTACIÓN OFICIAL & MISIÓN ── */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="md:col-span-2">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block mb-1">
                Presentación Oficial de la Categoría
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {category.name}
              </h2>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {category.mission}
              </p>
              <div className="mt-4 p-3 rounded-xl bg-blue-50/80 border border-blue-100 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-950 font-medium">
                  <strong>Público Objetivo & Cobertura:</strong> {category.targetAudience}
                </p>
              </div>
            </div>

            {/* Caja de Rango de Precios */}
            <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Rango Oficial de Precios
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    ${category.priceRange.min.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">
                    hasta ${category.priceRange.max.toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-300">
                  Ticket Promedio Habitual: <strong className="text-amber-300">{category.priceRange.avg}</strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-tight">
                {category.priceRange.note}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2: ALCANCES & CASOS DE USO (¿QUÉ PRODUCTOS HAY?) ── */}
      <section className="max-w-5xl mx-auto px-4 mt-14">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
            Alcances y Soluciones Disponibles
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            ¿Qué Productos Cubre Esta Categoría?
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Clasificamos cada solución según el tipo de necesidad y espacio para brindarte el equipamiento exacto.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {category.scopes.map((scope, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold mb-3">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {scope.title}
                </h3>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  {scope.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Equipos Destacados:
                </span>
                <ul className="space-y-1">
                  {scope.examples.map((ex, exIdx) => (
                    <li key={exIdx} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECCIÓN 3: PRECIOS & CONDICIONES COMERCIALES ── */}
      <section className="max-w-5xl mx-auto px-4 mt-14">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              Transparencia Financiera
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              Precios Claros & Múltiples Formas de Pago
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Todos nuestros valores están expresados en Dólares de los Estados Unidos (USD) e incluyen IVA del 15% con factura electrónica.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-center">
              <span className="text-xs text-slate-300 font-medium">Entrada / Económico</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                Desde ${category.priceRange.min.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Soluciones portátiles y de instalación autónoma en pocos minutos.
              </p>
            </div>

            <div className="bg-blue-600/30 backdrop-blur-md rounded-xl p-4 border border-blue-400/40 text-center ring-2 ring-blue-500/30">
              <span className="text-xs text-amber-300 font-bold">Ticket Más Comprado</span>
              <div className="text-2xl font-black text-white mt-1">
                {category.priceRange.avg}
              </div>
              <p className="text-[11px] text-slate-200 mt-1">
                Kits completos con accesorios listos para operar inmediatamente.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-center">
              <span className="text-xs text-slate-300 font-medium">Empresarial / Pro</span>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                Hasta ${category.priceRange.max.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Equipamiento de alto tráfico y cobertura industrial continua.
              </p>
            </div>

          </div>

          {/* Formas de Pago Aceptadas */}
          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Transferencia Bancaria (Pichincha, Guayaquil, Produbanco)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Tarjetas de Crédito y Débito (3, 6 y 12 cuotas)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Pago Contra Entrega en Quito</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: LISTA DE ARTÍCULOS RESUMIDA (CATÁLOGO EN GRID) ── */}
      <section id="catalogo-resumido" className="max-w-5xl mx-auto px-4 mt-16 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
              Artículos Destacados
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Lista Resumida de Productos & Precios
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Haz clic en cualquier producto para cotizarlo directamente por WhatsApp o agregarlo a tu proforma oficial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 px-3.5 py-2 rounded-xl shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingPdf ? "Generando PDF..." : "Descargar Catálogo PDF"}</span>
            </button>

            <Link
              href="/web"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200"
            >
              <span>Ver Tienda Completa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {category.featuredProducts.map((prod) => {
            const isAdded = addedItem === prod.id;
            const waProductMessage = `Hola ATOMIC, deseo comprar o cotizar el producto: ${prod.name} (PVP $${prod.price.toFixed(2)} USD). ¿Tienen disponibilidad inmediata?`;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Imagen del Producto */}
                  <div className="relative aspect-square bg-slate-100 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      onError={(e: any) => {
                        e.target.src = "/icon-192.png";
                      }}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {prod.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] shadow-sm">
                        {prod.tag}
                      </span>
                    )}

                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[10px]">
                      En Stock
                    </span>
                  </div>

                  {/* Datos del Producto */}
                  <div className="p-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      SKU: {prod.sku}
                    </span>

                    <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug line-clamp-2">
                      {prod.name}
                    </h3>

                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Especificaciones en Badges */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {prod.specs.map((sp, spIdx) => (
                        <span
                          key={spIdx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>

                    {/* Precio PVP Oficial */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                          PVP PÚBLICO
                        </span>
                        <div className="text-xl font-black text-blue-700">
                          ${prod.price.toFixed(2)}
                          <span className="text-[10px] text-slate-500 font-normal ml-1">Inc. IVA</span>
                        </div>
                      </div>

                      {prod.comparePrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ${prod.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="p-4 pt-0 space-y-2">
                  <a
                    href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(waProductMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Pedir por WhatsApp</span>
                  </a>

                  <button
                    onClick={() => handleAddToQuote(prod)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      isAdded
                        ? "bg-amber-100 border-amber-300 text-amber-800 font-bold"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span>✓ Añadido a Cotización</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
                        <span>➕ Añadir a Cotización</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECCIÓN 5: CALCULADORA EXPRESS DE ESTIMACIÓN ── */}
      <section className="max-w-3xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Simulador Rápido de Inversión</span>
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Calcula tu Presupuesto para {category.name}
          </h3>

          <p className="text-xs text-slate-600 mt-1">
            Mueve el control para indicar cuántos puntos o ambientes deseas equipar y obtén un estimado inmediato.
          </p>

          <div className="mt-6">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Cantidad de Puntos / Equipos a Instalar:</span>
              <span className="text-base font-black text-blue-700">{calcQty} {calcQty === 1 ? "Punto" : "Puntos"}</span>
            </div>

            <input
              type="range"
              min="1"
              max="16"
              value={calcQty}
              onChange={(e) => setCalcQty(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 Punto (Básico)</span>
              <span>8 Puntos (Mediano)</span>
              <span>16 Puntos (Empresarial)</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Inversión Aproximada Estimada:</span>
              <div className="text-2xl font-black text-slate-900">
                ${estimatedTotal} <span className="text-xs text-slate-500 font-normal">USD (Inc. IVA)</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">
                ✓ Incluye asesoría técnica gratuita de preventa
              </span>
            </div>

            <a
              href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                `Hola ATOMIC, utilicé la calculadora para ${category.name} con ${calcQty} puntos y el estimado es de $${estimatedTotal} USD. Deseo la proforma formal con instalación.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Solicitar Proforma Exacta</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: FORMULARIO RÁPIDO DE COTIZACIÓN AL CRM ── */}
      <section className="max-w-3xl mx-auto px-4 mt-14">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="text-center max-w-md mx-auto mb-6">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
              Atención Directa
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              ¿Deseas una Proforma PDF Formal con RUC?
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Completa tus datos y un asesor comercial de ATOMIC te contactará en menos de 10 minutos.
            </p>
          </div>

          {formSent ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-emerald-950">¡Solicitud Recibida con Éxito!</h4>
              <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                Nuestro asesor para la categoría <strong>{category.name}</strong> ha recibido tus datos y te escribirá por WhatsApp enseguida.
              </p>
              <a
                href={`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(
                  `Hola, acabo de enviar mis datos en la web para ${category.name}. Mi nombre es ${leadNombre}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Abrir WhatsApp Ahora Mismo</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nombre o Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadNombre}
                    onChange={(e) => setLeadNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez / Empresa S.A."
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    WhatsApp o Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadTelefono}
                    onChange={(e) => setLeadTelefono(e.target.value)}
                    placeholder="Ej. 099 123 4567"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Ciudad / Cantón
                  </label>
                  <input
                    type="text"
                    value={leadCiudad}
                    onChange={(e) => setLeadCiudad(e.target.value)}
                    placeholder="Ej. Quito, Guayaquil, Cuenca..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Detalle del Requerimiento
                  </label>
                  <input
                    type="text"
                    value={leadComentario}
                    onChange={(e) => setLeadComentario(e.target.value)}
                    placeholder="Ej. Necesito 4 equipos para mi negocio"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {formLoading ? "Enviando Solicitud..." : "Enviar y Solicitar Cotización Oficial"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── SECCIÓN 7: PREGUNTAS FRECUENTES (FAQ) ── */}
      {category.faq && category.faq.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 mt-16">
          <div className="text-center mb-6">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
              Preguntas Frecuentes
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              Dudas Comunes sobre {category.name}
            </h3>
          </div>

          <div className="space-y-3">
            {category.faq.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
              >
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{item.question}</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 pl-6 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SECCIÓN 8: FOOTER DE NAVEGACIÓN ENTRE CATEGORÍAS ── */}
      <footer className="max-w-5xl mx-auto px-4 mt-20 pt-8 border-t border-slate-200">
        <div className="text-center mb-6">
          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
            Explora Todas las Landings del Suicide Squad ATOMIC
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {SUICIDE_SQUAD_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/bienvenida/categoria/${cat.slug}`}
              className={`p-2.5 rounded-xl border text-xs font-medium transition text-center flex flex-col justify-center items-center ${
                cat.slug === category.slug
                  ? "bg-blue-600 text-white font-bold border-blue-600 shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              <span className="text-[10px] text-blue-500 font-black">{cat.squadCode}</span>
              <span className="line-clamp-1">{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* ── REDES SOCIALES OFICIALES ATOMIC ── */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <p className="text-center text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
            Canales Oficiales & Demostraciones en Vivo
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            <a
              href="https://wa.me/593963226319?text=Hola%20ATOMIC%2C%20deseo%20asesoria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">WhatsApp Oficial</span>
            </a>

            <a
              href="https://www.tiktok.com/@santiagoguzman216?_r=1&_t=ZS-9AU9OLRgZkY"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition text-center"
            >
              <TikTokIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">Jefe Técnico TT</span>
            </a>

            <a
              href="https://www.instagram.com/atomic_industries_26?cplk=bDczYW9xN2F6NXFs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-800 text-xs font-bold transition text-center"
            >
              <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
              <span className="truncate">Industrias IG</span>
            </a>

            <a
              href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 text-xs font-bold transition text-center"
            >
              <Youtube className="w-4 h-4 text-red-600 shrink-0" />
              <span className="truncate">Capacitaciones YT</span>
            </a>

            <a
              href="https://www.facebook.com/share/14uWsX16BQH/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition text-center"
            >
              <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Industrias FB</span>
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>© 2026 ATOMIC Solutions Ecuador · Todos los derechos reservados.</p>
          <p className="mt-1">
            Matriz: Quito, Ecuador · PBX: {officialPhoneDisplay} · Correo: ventas@atomiccotizador.shop
          </p>
        </div>
      </footer>

    </div>
  );
}
