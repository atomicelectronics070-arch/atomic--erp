"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search, ChevronLeft, ChevronRight, ShoppingBag, Cpu, Battery, Power,
  Settings, Monitor, Cable, Zap, ShieldCheck, Wrench, HardDrive, LayoutGrid,
  Filter, CheckCircle2, MessageCircle, ArrowRight, Sparkles, Check, Copy,
  Package, X, PhoneCall
} from "lucide-react";
import { calculateDiscountedPrice } from "@/lib/utils/pricing";

const WHATSAPP_NUMBER = "593969043453";

const CATEGORIES = [
  { id: "todos", label: "Todos los Repuestos", icon: LayoutGrid, count: 0 },
  { id: "baterias", label: "Baterías de Laptop", icon: Battery, keywords: ["bateria", "batería", "battery"] },
  { id: "cargadores", label: "Cargadores de Laptop", icon: Zap, keywords: ["cargador", "charger", "adaptador corriente", "power adapter"] },
  { id: "ram", label: "Memorias RAM", icon: HardDrive, keywords: ["ram", "sodimm", "ddr4", "ddr5", "memoria"] },
  { id: "fuentes", label: "Fuentes de Poder", icon: Power, keywords: ["fuente", "power supply", "psu", "80 plus"] },
  { id: "cases", label: "Cases & Gabinetes", icon: LayoutGrid, keywords: ["case", "gabinete", "chasis", "atx"] },
  { id: "cpus", label: "CPUs & Procesadores", icon: Cpu, keywords: ["procesador", "core i3", "core i5", "core i7", "core i9", "ryzen", "cpu"] },
  { id: "pantallas", label: "Pantallas & Teclados", icon: Monitor, keywords: ["pantalla", "display", "screen", "teclado", "keyboard", "flex", "bisagra"] }
];

// Safe Array Parser for Damaged/JSON Stringified Image Fields
const safeParseArray = (str: any, fallback: any = []): string[] => {
  if (!str || str === 'null' || str === '[]' || str === '') return fallback;
  if (Array.isArray(str)) return str.length > 0 ? str : fallback;
  if (typeof str === 'string') {
    const trimmed = str.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) return [trimmed];
    try {
      let cleaned = trimmed;
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\"/g, '"');
      }
      let parsed = JSON.parse(cleaned);
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch (e) {}
      }
      if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
      if (typeof parsed === 'string' && parsed.length > 0) return [parsed];
    } catch (e) {
      const urlRegex = /(https?:\/\/[^\s"\]]+)/g;
      const matches = trimmed.match(urlRegex);
      if (matches && matches.length > 0) return matches;
    }
  }
  return fallback;
};

// Safe Product Image with Hardware Category Specific Fallbacks
function SafeRepuestoImage({ src, alt, categoryId }: { src?: string; alt: string; categoryId?: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const getCategoryIcon = () => {
    switch (categoryId) {
      case "baterias": return <Battery size={24} className="text-amber-600" />;
      case "cargadores": return <Zap size={24} className="text-blue-600" />;
      case "ram": return <HardDrive size={24} className="text-indigo-600" />;
      case "fuentes": return <Power size={24} className="text-emerald-600" />;
      case "cpus": return <Cpu size={24} className="text-purple-600" />;
      case "pantallas": return <Monitor size={24} className="text-cyan-600" />;
      default: return <Cpu size={24} className="text-blue-600" />;
    }
  };

  if (!src || error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
          {getCategoryIcon()}
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider line-clamp-1 max-w-[160px]">
          {alt}
        </span>
        <span className="text-[9px] text-slate-400 font-sans mt-0.5">
          Repuesto 100% Garantizado
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
        className={`w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}

export default function RepuestosLandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/web/products?pageSize=2000").then(r => r.json());
        setProducts(res.products || []);
      } catch (e) {
        console.error("Error cargando productos de repuestos:", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    let list = products;

    // Filter by active category
    if (activeCategory !== "todos") {
      const catConfig = CATEGORIES.find(c => c.id === activeCategory);
      if (catConfig && catConfig.keywords) {
        list = list.filter(p => {
          const target = `${p.name || ''} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
          return catConfig.keywords.some(kw => target.includes(kw));
        });
      }
    } else {
      // For "todos", filter to computer components / parts
      const allKeywords = [
        "bateria", "batería", "cargador", "ram", "memoria", "ddr4", "ddr5", "fuente", "power supply",
        "case", "gabinete", "procesador", "core i3", "core i5", "core i7", "core i9", "ryzen",
        "ssd", "disco", "pantalla laptop", "teclado laptop", "flex", "cooler", "ventilador"
      ];
      list = list.filter(p => {
        const target = `${p.name || ''} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
        return allKeywords.some(kw => target.includes(kw));
      });
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => {
        const target = `${p.name || ''} ${p.sku || ''} ${p.provider || ''} ${p.description || ''}`.toLowerCase();
        return target.includes(q);
      });
    }

    return list;
  }, [products, activeCategory, search]);

  // Infinite scroll slice
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Intersection observer for continuous infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((prev) => Math.min(prev + 24, filteredProducts.length));
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  const getWaLink = (product: any) => {
    const msg = `*¡Hola ATOMIC! Me interesa cotizar este repuesto para computadora:*
• *Producto:* ${product.name}
• *Código / SKU:* ${product.sku || 'N/A'}
• *Precio Referencial:* $${Number(product.price || 0).toFixed(2)} + IVA
• *Proveedor / Marca:* ${product.provider || 'ATOMIC Oficial'}

¿Tienen compatibilidad inmediata para mi equipo?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const handleCopy = (product: any) => {
    const text = `💻 REPUESTO: ${product.name} (SKU: ${product.sku || 'N/A'}) - $${Number(product.price || 0).toFixed(2)} + IVA`;
    navigator.clipboard.writeText(text);
    setCopiedSku(product.sku || product.id);
    setTimeout(() => setCopiedSku(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] font-sans selection:bg-blue-600 selection:text-white relative">
      
      {/* ── BACKGROUND BLUR GLOWS (BLANCO BLUR EFFECT) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[160px]" />
      </div>

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="relative z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.06] text-slate-700 text-xs font-mono py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="text-blue-600">⚡</span>
        <span className="font-bold text-slate-900">LÍNEA DE REPUESTOS PARA COMPUTADORAS // ATOMIC PARTS</span>
        <span className="hidden md:inline text-slate-500">• Baterías, Cargadores, Memorias RAM, CPUs, Cases & Fuentes con Despacho Inmediato</span>
      </div>

      {/* ── HEADER NAVBAR (BLANCO BLUR GLASSMORPHISM) ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cpu size={20} />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 uppercase font-mono">
                ATOMIC <span className="text-blue-600">REPUESTOS</span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono">Hardware & Componentes</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/web/laptops"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.08] text-slate-700 hover:text-slate-900 hover:bg-black/[0.03] text-xs font-mono font-bold transition-all"
            >
              ← Ver Laptops Completas
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola ATOMIC, necesito consultar la disponibilidad de un repuesto específico para mi laptop/computadora.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all"
            >
              <PhoneCall size={14} />
              <span>Consultar Repuesto</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION (PURE WHITE BLUR) ── */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-white/70 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                <Sparkles size={14} className="text-blue-600" />
                <span>Línea Integral de Repuestos Originales 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 font-mono leading-tight">
                LÍNEA DE REPUESTOS PARA<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                  LAPTOPS & COMPUTADORAS
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                Encuentra repuestos 100% garantizados y componentes de alta durabilidad: <strong>Baterías, Cargadores Originales, Memorias RAM DDR4/DDR5, Fuentes de Poder 80 Plus, Gabinetes/Cases, Procesadores Intel/AMD, Pantallas y Teclados</strong> con envíos inmediatos a nivel nacional.
              </p>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { t: "100% Compatibles", d: "HP, Dell, Asus, Lenovo, Acer" },
                  { t: "Garantía Escrita", d: "Soporte técnico directo" },
                  { t: "Stock Inmediato", d: "Despacho en 24 horas" },
                  { t: "Asesoría Técnica", d: "Verificación de modelo" }
                ].map((badge, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-sm text-left">
                    <div className="text-xs font-bold text-blue-600 font-mono">{badge.t}</div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">{badge.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Portada Image Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-black/[0.08] bg-white shadow-2xl p-2.5 backdrop-blur-xl">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-slate-950">
                  <img
                    src="/images/promociones/repuestos-computadoras-portada.jpg"
                    alt="Línea de Repuestos para Computadoras ATOMIC"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-mono font-bold text-white">
                    ⚡ Catálogo Oficial ATOMIC Parts
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CATEGORY TABS & SEARCH (STICKY WHITE BLUR) ── */}
      <section className="sticky top-16 z-40 bg-white/85 backdrop-blur-2xl border-b border-black/[0.06] py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setVisibleCount(24); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? "bg-slate-950 text-white border-slate-950 shadow-md"
                      : "bg-white text-slate-600 border-black/[0.08] hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(24); }}
              placeholder="Buscar SKU, modelo, DDR4, 65W..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-black/[0.08] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* ── PRODUCTS GRID (INFINITE SCROLL) ── */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 font-mono tracking-tight">
              Repuestos & Componentes ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Scroll infinito activado • Mostrando {Math.min(visibleProducts.length, filteredProducts.length)} de {filteredProducts.length} repuestos
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-sm">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-mono text-slate-500">Cargando inventario de repuestos...</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="p-16 text-center bg-white/90 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-xl">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 font-mono">No se encontraron repuestos con estos criterios</h3>
            <p className="text-xs text-slate-500 mt-1">Prueba seleccionando otra categoría o borrando el término de búsqueda.</p>
            <button
              onClick={() => { setActiveCategory("todos"); setSearch(""); }}
              className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs uppercase font-mono shadow-md"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((p) => {
              const parsedImages = safeParseArray(p.images, []);
              const img = parsedImages.length > 0 ? parsedImages[0] : "";
              const price = Number(p.price || 0);

              return (
                <div
                  key={p.id}
                  className="rounded-3xl bg-white/90 backdrop-blur-xl border border-black/[0.06] hover:border-blue-500/40 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:scale-[1.01]"
                >
                  {/* Visual Image Header */}
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100/60 overflow-hidden border-b border-black/[0.04] p-4 flex items-center justify-center">
                    <SafeRepuestoImage src={img} alt={p.name} categoryId={activeCategory} />

                    {/* SKU Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-slate-950 text-white shadow-sm">
                        {p.sku ? `SKU: ${p.sku}` : "REPUESTO"}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-blue-600 text-white font-mono font-black text-sm px-3 py-1 rounded-xl shadow-md shadow-blue-600/20">
                      ${price.toFixed(2)} <span className="text-[9px] font-normal">+IVA</span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block truncate">
                        {p.category?.name || "Repuesto General"} · {p.provider || "ATOMIC Oficial"}
                      </span>

                      <h3 className="text-sm font-black text-slate-900 uppercase font-mono mt-1 leading-snug line-clamp-2">
                        {p.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-2 font-sans line-clamp-2 leading-relaxed">
                        {p.description ? p.description.replace(/<[^>]*>/g, '') : "Componente original para computadoras y laptops. 100% garantizado."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={getWaLink(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                      >
                        <MessageCircle size={14} />
                        <span>Cotizar</span>
                      </a>

                      <button
                        onClick={() => handleCopy(p)}
                        className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                        title="Copiar detalles"
                      >
                        {copiedSku === (p.sku || p.id) ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── INFINITE SCROLL TRIGGER / LOADER ── */}
        <div ref={observerTarget} className="w-full py-12 flex items-center justify-center">
          {visibleCount < filteredProducts.length ? (
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-black/[0.08] shadow-sm">
              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Cargando más repuestos y componentes...</span>
            </div>
          ) : (
            filteredProducts.length > 0 && (
              <p className="text-xs font-mono text-slate-400 bg-white/60 px-4 py-2 rounded-full border border-black/[0.04]">
                ✓ Has llegado al final del catálogo de repuestos ({filteredProducts.length} productos)
              </p>
            )
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/[0.06] bg-white/80 backdrop-blur-xl py-12 px-6 text-center text-xs text-slate-500 font-mono space-y-2 relative z-10">
        <p>© 2026 ATOMIC INDUSTRIES — Distribución de Repuestos & Componentes para Computadoras en Ecuador.</p>
        <p className="text-[11px] text-slate-400">Baterías, cargadores, memorias RAM, fuentes, procesadores y pantallas con garantía y asesoría técnica especializada.</p>
      </footer>

    </div>
  );
}
