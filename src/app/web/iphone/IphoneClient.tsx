"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, MessageSquare, Search, Star, Shield, Zap, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ATOMIC — Línea Apple: iPhone & Mac  (All-White Premium Theme)
// ─────────────────────────────────────────────────────────────────────────────

interface AppleProduct {
  id: string;
  name: string;
  subtitle: string;
  specs: string;
  price: number;
  priceNote?: string;
  image: string;
  category: "IPHONE" | "MAC";
  storage?: string;
  chip?: string;
  display?: string;
  colors?: string[];
  badge?: string;
}

const CATALOG: AppleProduct[] = [
  // ─── iPhones ───────────────────────────────────────────────────────────────
  {
    id: "iphone-17-air-256-white",
    name: "iPhone 17 Air",
    subtitle: "256 GB · Cloud White",
    specs: "Chip A18 Pro · Cámara 48MP · Pantalla 6.1\" Super Retina XDR · Face ID · USB-C",
    price: 3838,
    image: "/images/iphone/iphone-17-air-white.png",
    category: "IPHONE",
    chip: "Apple A18 Pro",
    display: "6.1\" Super Retina XDR",
    storage: "256 GB",
    colors: ["Cloud White"],
    badge: "NUEVO 2025",
  },
  {
    id: "iphone-17-air-256-black",
    name: "iPhone 17 Air",
    subtitle: "256 GB · Space Black",
    specs: "Chip A18 Pro · Cámara 48MP · Pantalla 6.1\" Super Retina XDR · Face ID · USB-C",
    price: 3838,
    image: "/images/iphone/iphone-16-pro-natural.png",
    category: "IPHONE",
    chip: "Apple A18 Pro",
    display: "6.1\" Super Retina XDR",
    storage: "256 GB",
    colors: ["Space Black"],
    badge: "NUEVO 2025",
  },
  {
    id: "iphone-16-128",
    name: "iPhone 16",
    subtitle: "128 GB",
    specs: "Chip A18 · Cámara 48MP con Control de Cámara · iOS 18 · Botón de Acción · USB-C 3.0",
    price: 4021,
    priceNote: "Precio con financiamiento local",
    image: "/images/iphone/iphone-16-black.png",
    category: "IPHONE",
    chip: "Apple A18",
    display: "6.1\" Super Retina XDR",
    storage: "128 GB",
    badge: "EN STOCK",
  },
  {
    id: "iphone-16-pro-256",
    name: "iPhone 16 Pro",
    subtitle: "256 GB · Titanio Natural",
    specs: "Chip A18 Pro · Sistema Pro de 4 cámaras · Titanio · Pantalla 6.3\" ProMotion 120Hz",
    price: 4800,
    image: "/images/iphone/iphone-16-pro-natural.png",
    category: "IPHONE",
    chip: "Apple A18 Pro",
    display: "6.3\" ProMotion 120Hz",
    storage: "256 GB",
    badge: "PRO",
  },
  {
    id: "iphone-16-pro-max-512",
    name: "iPhone 16 Pro Max",
    subtitle: "512 GB · Desert Titanium",
    specs: "Chip A18 Pro · Batería 33 horas · Cámara Tetra-Prisma 5× · Pantalla 6.9\" ProMotion",
    price: 5800,
    image: "/images/iphone/iphone-16-pro-max.png",
    category: "IPHONE",
    chip: "Apple A18 Pro",
    display: "6.9\" Super Retina XDR 120Hz",
    storage: "512 GB",
    badge: "MAX",
  },
  {
    id: "samsung-galaxy-a17",
    name: "Samsung Galaxy A17",
    subtitle: "4GB RAM · 128GB",
    specs: "Octa-Core · Cámara 50MP · Pantalla 6.5\" FHD+ · Batería 5000mAh · Android 14",
    price: 3777,
    priceNote: "Con precio de mercado nacional",
    image: "/images/iphone/samsung-a16.png",
    category: "IPHONE",
    chip: "Octa-Core 2.0GHz",
    display: "6.5\" FHD+ 90Hz",
    storage: "128 GB",
    badge: "SAMSUNG",
  },

  // ─── Mac ──────────────────────────────────────────────────────────────────
  {
    id: "macbook-pro-m3-36gb",
    name: "MacBook Pro",
    subtitle: "Chip M3 · 36GB · 512GB · 16.2\"",
    specs: "Apple M3 Pro · 36GB RAM Unificada · 512GB SSD · Pantalla Liquid Retina XDR 16.2\" · macOS · Silver",
    price: 4771,
    image: "/images/iphone/macbook-pro-m3.png",
    category: "MAC",
    chip: "Apple M3 Pro",
    display: "16.2\" Liquid Retina XDR",
    storage: "512 GB SSD",
    badge: "PRO",
  },
  {
    id: "macbook-air-m2-13",
    name: "MacBook Air",
    subtitle: "Chip M2 · 8GB · 256GB · 13\"",
    specs: "Apple M2 · 8GB RAM Unificada · 256GB SSD · Pantalla Liquid Retina 13.6\" · macOS · Starlight",
    price: 1799,
    image: "/images/iphone/macbook-air-m2.png",
    category: "MAC",
    chip: "Apple M2",
    display: "13.6\" Liquid Retina",
    storage: "256 GB SSD",
    badge: "BÁSICO",
  },
  {
    id: "macbook-air-m3-15",
    name: "MacBook Air 15\"",
    subtitle: "Chip M3 · 8GB · 256GB · 15\"",
    specs: "Apple M3 · 8GB RAM Unificada · 256GB SSD · Pantalla Liquid Retina 15.3\" · macOS · Midnight",
    price: 2199,
    image: "/images/iphone/macbook-air-m2.png",
    category: "MAC",
    chip: "Apple M3",
    display: "15.3\" Liquid Retina",
    storage: "256 GB SSD",
    badge: "AIR 15",
  },
];

const WA_NUMBER = "593969043453";

export default function IphoneClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"TODOS" | "IPHONE" | "MAC">("TODOS");

  const filtered = useMemo(() => {
    return CATALOG.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specs.toLowerCase().includes(search.toLowerCase()) || p.subtitle.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "TODOS" || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const waLink = (name: string, sub: string) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola ATOMIC! Me interesa cotizar: ${name} ${sub}. ¿Precio y disponibilidad?`)}`;

  return (
    <main className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft size={16} />
            ATOMIC Store
          </Link>
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Línea Apple</span>
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola ATOMIC! Quiero cotizar un iPhone o Mac.")}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-all"
          >
            Cotizar
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">
            <svg viewBox="0 0 814 1000" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 268.8-317.7 70.5 0 128.8 42.7 172.7 42.7 43.1 0 110.2-46.5 188.8-46.5 31 0 81.5 3.8 127.8 37.2zM514.2 118.4c-14.6 37.8-40.8 71.1-73.5 93.1s-61.1 30-96.8 30c-3.6 0-7.4-.1-11.3-.3-1-32.4 9.9-67.1 26.5-93.5 18.2-29.1 44.8-54.4 77.2-72.3s65.3-27.3 98.2-27.3c.8 0 1.7 0 2.5.1C541.6 81.5 528.8 80.6 514.2 118.4z"/></svg>
            iPhone & Mac
          </div>

          <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-black mb-4">
            Línea
            <span className="block text-gray-400">Apple</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            iPhone 17 Air, iPhone 16 Pro, MacBook Pro M3 y toda la familia Mac. Con garantía local, factura y soporte ATOMIC.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            {[
              { icon: <Shield size={13} />, text: "Garantía Verificada" },
              { icon: <Star size={13} />, text: "Originales" },
              { icon: <Zap size={13} />, text: "Entrega Rápida" },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">{item.icon} {item.text}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar modelo, almacenamiento..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-xs text-gray-700 placeholder-gray-400 focus:border-gray-400 focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
          {(["TODOS", "IPHONE", "MAC"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">
          {filtered.length} modelo{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative bg-gray-50 flex items-center justify-center p-8 aspect-square overflow-hidden rounded-t-3xl">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-48 w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/F5F5F7/1D1D1F?text=${encodeURIComponent(p.name)}`;
                  }}
                />
                {p.badge && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase rounded-full tracking-wider">
                    {p.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow border-t border-gray-50">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  {p.category === "IPHONE" ? "iPhone / Celular" : "Mac"}
                </div>
                <h3 className="text-sm font-black text-gray-900 leading-snug">{p.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{p.subtitle}</p>

                {/* Mini specs */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {[p.chip, p.display, p.storage].filter(Boolean).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-[9px] font-bold text-gray-500">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-black text-gray-900">${p.price.toLocaleString("en-US")}</span>
                    <span className="text-xs text-gray-400">USD</span>
                  </div>
                  {p.priceNote && <p className="text-[9px] text-gray-400 mb-3">{p.priceNote}</p>}

                  <a
                    href={waLink(p.name, p.subtitle)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-black hover:bg-gray-800 text-white text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <MessageSquare size={13} />
                    Cotizar ahora
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="font-bold text-lg mb-2">Sin resultados</p>
            <p className="text-sm">Intenta otro término de búsqueda.</p>
          </div>
        )}
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4 tracking-tight">¿Quieres un modelo específico?</h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Importamos directamente y tenemos acceso a toda la línea Apple. Consulta disponibilidad, colores y almacenamiento en tiempo real.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola ATOMIC! Busco este iPhone o Mac en específico:")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-black text-sm uppercase tracking-wider rounded-full hover:bg-gray-100 transition-all"
          >
            <MessageSquare size={16} />
            Hablar con un asesor
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </main>
  );
}
