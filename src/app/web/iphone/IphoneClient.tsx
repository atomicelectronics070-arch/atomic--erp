"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Star,
  Zap,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  Smartphone,
  Laptop,
  CheckCircle2,
  Flame,
  Award
} from "lucide-react";

interface AppleProduct {
  id: string;
  name: string;
  subtitle: string;
  specs: string;
  price: number;
  compareAtPrice: number;
  priceNote?: string;
  image: string;
  category: "IPHONE" | "MAC";
  chip: string;
  display: string;
  storage: string;
  colors?: string[];
  badge?: string;
  inStock?: boolean;
}

const CATALOG: AppleProduct[] = [
  // ─── iPhones & Celulares Top ──────────────────────────────────────────────
  {
    id: "iphone-16-128",
    name: "iPhone 16",
    subtitle: "128 GB · Black & Teal",
    specs: "Chip A18 · Botón de Control de Cámara · Cámara 48MP Fusión · Dynamic Island · USB-C",
    price: 949.00,
    compareAtPrice: 1099.00,
    priceNote: "Precio especial efectivo / transferencia",
    image: "/images/iphone/iphone-16-black.png",
    category: "IPHONE",
    chip: "Apple A18",
    display: "6.1\" Super Retina XDR",
    storage: "128 GB",
    badge: "🔥 MÁS VENDIDO",
    inStock: true
  },
  {
    id: "iphone-16-pro-256",
    name: "iPhone 16 Pro",
    subtitle: "256 GB · Titanio Natural",
    specs: "Chip A18 Pro · Chasis Titanio Grado 5 · Cámara Teleobjetivo 5x · Pantalla 120Hz ProMotion",
    price: 1289.00,
    compareAtPrice: 1450.00,
    priceNote: "Homologado 100% Ecuador (Claro/Movistar/CNT)",
    image: "/images/iphone/iphone-16-pro-natural.png",
    category: "IPHONE",
    chip: "Apple A18 Pro",
    display: "6.3\" ProMotion 120Hz",
    storage: "256 GB",
    badge: "⚡ TITANIO PRO",
    inStock: true
  },
  {
    id: "iphone-16-pro-max-512",
    name: "iPhone 16 Pro Max",
    subtitle: "512 GB · Desert Titanium",
    specs: "Chip A18 Pro · Batería épica hasta 33h · Sensor Tetraprisma 5x · Pantalla inmersiva 6.9\"",
    price: 1599.00,
    compareAtPrice: 1790.00,
    priceNote: "Garantía Oficial 1 Año Apple & ATOMIC",
    image: "/images/iphone/iphone-16-pro-max.png",
    category: "IPHONE",
    chip: "Apple A18 Pro",
    display: "6.9\" Super Retina XDR",
    storage: "512 GB",
    badge: "👑 TOPE DE GAMA",
    inStock: true
  },
  {
    id: "iphone-17-air-256-white",
    name: "iPhone 17 Air (Ultra Slim)",
    subtitle: "256 GB · Cloud White",
    specs: "Diseño ultradelgado 5.5mm · Chip A19 Pro · Chasis Titanio/Aluminio · Pantalla ProMotion",
    price: 1249.00,
    compareAtPrice: 1420.00,
    priceNote: "Reserva prioritaria con despacho garantizado",
    image: "/images/iphone/iphone-17-air-white.png",
    category: "IPHONE",
    chip: "Apple A19 Bionic",
    display: "6.6\" Super Retina XDR",
    storage: "256 GB",
    badge: "✨ PRE-RESERVA 2026",
    inStock: true
  },
  {
    id: "samsung-galaxy-a17",
    name: "Samsung Galaxy A16 / A17",
    subtitle: "4GB RAM · 128GB Almacenamiento",
    specs: "Pantalla 6.5\" Super AMOLED 90Hz · Cámara Triple 50MP · Batería 5000 mAh · 6 años de updates",
    price: 175.00,
    compareAtPrice: 215.00,
    priceNote: "Excelente rendimiento / precio de entrada",
    image: "/images/iphone/samsung-a16.png",
    category: "IPHONE",
    chip: "Octa-Core 2.0GHz",
    display: "6.5\" FHD+ 90Hz",
    storage: "128 GB",
    badge: "🏷️ OFERTA CALLE",
    inStock: true
  },

  // ─── MacBooks & Computación Pro ───────────────────────────────────────────
  {
    id: "macbook-air-m2-13",
    name: "MacBook Air M2 13.6\"",
    subtitle: "Chip M2 · 8GB RAM · 256GB SSD · Starlight",
    specs: "Pantalla Liquid Retina 13.6\" · Hasta 18h de batería · Teclado Magic Keyboard con Touch ID · MagSafe 3",
    price: 1089.00,
    compareAtPrice: 1250.00,
    priceNote: "Ideal estudiantes universitarios y ejecutivos",
    image: "/images/iphone/macbook-air-m2.png",
    category: "MAC",
    chip: "Apple M2 (8 núcleos)",
    display: "13.6\" Liquid Retina",
    storage: "256 GB SSD",
    badge: "⭐ SUPER PRECIO",
    inStock: true
  },
  {
    id: "macbook-air-m3-15",
    name: "MacBook Air M3 15.3\"",
    subtitle: "Chip M3 · 8GB RAM · 256GB SSD · Midnight",
    specs: "Gran pantalla de 15.3\" · Motor neuronal para Apple Intelligence · Audio espacial de 6 parlantes",
    price: 1389.00,
    compareAtPrice: 1590.00,
    priceNote: "Portabilidad con máxima área visual",
    image: "/images/iphone/macbook-air-m2.png",
    category: "MAC",
    chip: "Apple M3 (8C CPU / 10C GPU)",
    display: "15.3\" Liquid Retina",
    storage: "256 GB SSD",
    badge: "💻 M3 PANORÁMICO",
    inStock: true
  },
  {
    id: "macbook-pro-m3-36gb",
    name: "MacBook Pro M3 Pro 16.2\"",
    subtitle: "Chip M3 Pro · 36GB RAM Unificada · 512GB SSD",
    specs: "Pantalla Liquid Retina XDR 1000 nits · HDMI 8K · Ranura SDXC · Chasis Space Silver · Máxima potencia",
    price: 2450.00,
    compareAtPrice: 2850.00,
    priceNote: "Estación de trabajo para ingenieros y creadores",
    image: "/images/iphone/macbook-pro-m3.png",
    category: "MAC",
    chip: "Apple M3 Pro 12-Core",
    display: "16.2\" Liquid Retina XDR",
    storage: "512 GB SSD",
    badge: "🚀 WORKSTATION",
    inStock: true
  }
];

const WA_NUMBER = "593969043453";

export default function IphoneClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"TODOS" | "IPHONE" | "MAC">("TODOS");

  const filtered = useMemo(() => {
    return CATALOG.filter((p) => {
      const matchesCat = activeCategory === "TODOS" || p.category === activeCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        p.chip.toLowerCase().includes(q) ||
        p.storage.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory]);

  const waLink = (product: AppleProduct) => {
    const text = encodeURIComponent(
      `Hola ATOMIC! Deseo información y comprar el *${product.name}* (${product.subtitle}).\n` +
      `💵 *Precio Oferta:* $${product.price.toFixed(2)} USD (Antes: $${product.compareAtPrice.toFixed(2)})\n` +
      `🛡️ *Garantía:* 1 Año Oficial Apple / ATOMIC Ecuador\n` +
      `¿Tienen disponibilidad en stock para entrega o despacho inmediato a mi ciudad?`
    );
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Background Cyber Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[180px]" />
      </div>

      {/* Top Bar Header */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 px-6 py-4 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            A
          </div>
          <div>
            <span className="font-heading font-black tracking-wider text-sm text-white group-hover:text-cyan-400 transition-colors">
              ATOMIC <span className="text-cyan-400 font-mono text-xs">// APPLE & TECH</span>
            </span>
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Equipos 100% Homologados Ecuador
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/web"
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Volver al Ecosistema
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola ATOMIC! Deseo consultar sobre la disponibilidad de iPhones y MacBooks oficiales.")}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
          >
            <MessageSquare size={14} /> Asesor WhatsApp
          </a>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-inner">
          <Sparkles size={13} className="text-cyan-400 animate-pulse" />
          <span>GARANTÍA OFICIAL ATOMIC • PRECIOS DIRECTOS DE IMPORTACIÓN</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white font-heading">
          LÍNEA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">APPLE & SMARTPHONES</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          iPhone 16 Pro Max, iPhone 16, MacBook Air M2/M3 y toda la serie Apple con homologación directa ARCOTEL, factura oficial y 1 año de garantía por escrito.
        </p>

        {/* Confidence highlights */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs font-mono text-slate-300">
          <span className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Shield size={14} className="text-cyan-400" /> 1 Año Garantía
          </span>
          <span className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <CheckCircle2 size={14} className="text-emerald-400" /> Equipos Homologados
          </span>
          <span className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Zap size={14} className="text-amber-400" /> Entrega Express 24h
          </span>
        </div>
      </section>

      {/* Filter and Search Bento Bar */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-10">
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {(["TODOS", "IPHONE", "MAC"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_18px_rgba(6,182,212,0.4)] scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                {cat === "IPHONE" && <Smartphone size={14} />}
                {cat === "MAC" && <Laptop size={14} />}
                {cat === "TODOS" && <Sparkles size={14} />}
                <span>{cat === "TODOS" ? "TODOS LOS EQUIPOS" : cat === "IPHONE" ? "SMARTPHONES" : "MACBOOKS"}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar modelo, chip, RAM, GB..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/60 font-mono text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider">
            Mostrando <strong className="text-cyan-400">{filtered.length}</strong> modelos disponibles
          </span>
          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold">
            ✓ Stock Inmediato para Quito & Provincias
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => {
            const discountPct = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
            return (
              <div
                key={p.id}
                className="group relative bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1 backdrop-blur-sm"
              >
                {/* Card Top: Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/20">
                      {p.badge || "ORIGINAL"}
                    </span>
                    {discountPct > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-mono font-black border border-red-500/20">
                        -{discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Image Frame */}
                  <div className="relative aspect-square w-full rounded-2xl bg-slate-950/80 border border-slate-800/60 p-6 flex items-center justify-center overflow-hidden mb-4 group-hover:border-slate-700 transition-colors">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/0b1329/38bdf8?text=${encodeURIComponent(p.name)}`;
                      }}
                    />
                  </div>

                  {/* Title & Specs */}
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                    {p.category === "IPHONE" ? "Smartphone Homologado" : "Apple Silicon"}
                  </span>
                  <h3 className="text-base font-black text-white font-heading leading-tight group-hover:text-cyan-300 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 mb-2">{p.subtitle}</p>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[9px] font-mono border border-slate-700/50">
                      {p.chip}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[9px] font-mono border border-slate-700/50">
                      {p.display}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-cyan-300 text-[9px] font-mono border border-cyan-500/30 font-bold">
                      {p.storage}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Price and Buy Button */}
                <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-white tracking-tight">
                        ${p.price.toFixed(2)}
                      </span>
                      <span className="text-xs font-mono text-slate-500 line-through">
                        ${p.compareAtPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">USD</span>
                    </div>
                    {p.priceNote && (
                      <p className="text-[9px] font-mono text-emerald-400/90 mt-0.5">
                        ✓ {p.priceNote}
                      </p>
                    )}
                  </div>

                  <a
                    href={waLink(p)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:scale-[1.02]"
                  >
                    <MessageSquare size={14} />
                    <span>Cotizar por WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <p className="text-base font-bold text-slate-300 mb-2 font-mono">No se encontraron modelos con ese término</p>
            <p className="text-xs text-slate-500 font-mono mb-4">Intenta buscando por modelo (ej: 16 Pro, M3, 256GB)</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("TODOS"); }}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </section>

      {/* Footer Banner */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6 text-center text-xs font-mono text-slate-500 space-y-2">
        <p className="text-slate-400 font-bold">
          ATOMIC INDUSTRIES ECUADOR • DIVISIÓN DE TECNOLOGÍA & SMARTPHONES
        </p>
        <p>Todos los productos cuentan con garantía directa y soporte en Quito, Guayaquil, Cuenca y a nivel nacional.</p>
      </footer>
    </main>
  );
}
