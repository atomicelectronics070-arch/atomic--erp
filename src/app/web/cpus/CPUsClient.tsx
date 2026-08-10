"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Cpu, Search, ShieldCheck, Flame, ArrowUpDown, MessageSquare, Monitor, Zap } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CATALOG — scraped from BestCell.com.ec & CEMCO.com.ec · +25% margen ATOMIC
// Base price × 1.25 = ATOMIC price
// ─────────────────────────────────────────────────────────────────────────────
const MARGIN = 1.25;

interface Product {
  id: string;
  name: string;
  specs: string;
  basePrice: number;   // precio del proveedor
  image: string;
  brand: "INTEL" | "AMD" | "OTRO";
  type: "CPU-GAMER" | "CPU-OFICINA" | "PROCESADOR";
  source: "BestCell" | "CEMCO";
}

const CATALOG: Product[] = [
  // ── BESTCELL · CPUs Gamer (equipos completos) ──────────────────────────────
  {
    id: "bc-gamer-1",
    name: "CPU Gamer Intel Core Ultra 7 265K | 16GB DDR5 | 1TB NVMe | RTX 5060 Ti 16GB",
    specs: "Intel Core Ultra 7 265K · 16GB DDR5 · 1TB SSD NVMe 4.0 · RTX 5060 Ti 16GB · LGA1851",
    basePrice: 1950.00,
    image: "https://www.bestcell.com.ec/imgadmin/storage/imagenes_articulos/1990/14278.jpg.280.webp",
    brand: "INTEL", type: "CPU-GAMER", source: "BestCell",
  },
  {
    id: "bc-gamer-2",
    name: "CPU Gamer Intel Core Ultra 7 265K | 32GB DDR5 | 1TB NVMe 5.0 | RTX 5070 Ti",
    specs: "Intel Core Ultra 7 265K · 32GB DDR5 · 1TB SSD NVMe 5.0 · RTX 5070 Ti · LGA1851",
    basePrice: 3100.00,
    image: "https://www.bestcell.com.ec/imgadmin/storage/imagenes_articulos/2089/14327.jpg.280.webp",
    brand: "INTEL", type: "CPU-GAMER", source: "BestCell",
  },
  {
    id: "bc-gamer-3",
    name: "CPU Gamer Intel Core Ultra 9 285K | 32GB DDR5 | 2TB NVMe 4.0 | RTX 5070 Ti",
    specs: "Intel Core Ultra 9 285K · 32GB DDR5 · 2TB SSD NVMe 4.0 · RTX 5070 Ti · LGA1851",
    basePrice: 3570.00,
    image: "https://www.bestcell.com.ec/imgadmin/storage/imagenes_articulos/2096/14968.jpg.280.webp",
    brand: "INTEL", type: "CPU-GAMER", source: "BestCell",
  },
  {
    id: "bc-gamer-4",
    name: "CPU Gamer Intel Core Ultra 9 285K | 32GB DDR5 | 2TB NVMe 4.0/5.0 | RTX 5080",
    specs: "Intel Core Ultra 9 285K · 32GB DDR5 · 2TB SSD NVMe 4.0/5.0 · RTX 5080 · LGA1851",
    basePrice: 4200.00,
    image: "https://www.bestcell.com.ec/imgadmin/storage/imagenes_articulos/2422/13240.jpg.280.webp",
    brand: "INTEL", type: "CPU-GAMER", source: "BestCell",
  },
  // ── BESTCELL · Procesadores standalone ─────────────────────────────────────
  {
    id: "bc-proc-1",
    name: "Procesador Intel Core Ultra 5 225F | 2.7/4.9GHz | 10 Núcleos | LGA1851",
    specs: "Intel Core Ultra 5 225F · 10 Núcleos / 12 Hilos · Boost 4.9GHz · LGA1851 · Sin gráficos integrados",
    basePrice: 214.99,
    image: "https://www.bestcell.com.ec/imgadmin/storage/imagenes_articulos/2381/13053.jpg.280.webp",
    brand: "INTEL", type: "PROCESADOR", source: "BestCell",
  },
  {
    id: "bc-proc-2",
    name: "Procesador Intel Core Ultra 5 250K PLUS | 4.2/5.3GHz | 18 Núcleos | LGA1851",
    specs: "Intel Core Ultra 5 250K PLUS · 18 Núcleos · Boost 5.3GHz · LGA1851 · Gráficos Intel Arc integrados",
    basePrice: 294.99,
    image: "https://www.bestcell.com.ec/imgadmin/storage/imagenes_articulos/2737/14769.jpg.280.webp",
    brand: "INTEL", type: "PROCESADOR", source: "BestCell",
  },
  {
    id: "bc-proc-3",
    name: "Procesador Intel Core Ultra 7 265K | 3.3/5.5GHz | 20 Núcleos | LGA1851",
    specs: "Intel Core Ultra 7 265K · 20 Núcleos (8P+12E+4LPE) · Boost 5.5GHz · LGA1851 · Gráficos Intel Arc",
    basePrice: 430.00,
    image: "https://www.bestcell.com.ec/imgadmin/storage/imagenes_articulos/1940/10670.jpg.280.webp",
    brand: "INTEL", type: "PROCESADOR", source: "BestCell",
  },
  {
    id: "bc-proc-4",
    name: "Procesador Intel Core Ultra 9 285K | 3.2/5.7GHz | 24 Núcleos | LGA1851",
    specs: "Intel Core Ultra 9 285K · 24 Núcleos (8P+16E) · Boost 5.7GHz · LGA1851 · Gráficos Intel Arc Xe",
    basePrice: 519.99,
    image: "https://www.bestcell.com.ec/imgadmin/storage/imagenes_articulos/2068/11318.jpg.280.webp",
    brand: "INTEL", type: "PROCESADOR", source: "BestCell",
  },
  // ── CEMCO · CPUs Hogar & Oficina (equipos completos) ───────────────────────
  {
    id: "cemco-1",
    name: "PC AMD Ryzen 5 8500G | 16GB DDR5 | SSD 500GB | Radeon 740M | A620",
    specs: "AMD Ryzen 5 8500G · 16GB DDR5 · SSD 500GB · Gráficos Radeon 740M integrados · Board A620",
    basePrice: 671.74,
    image: "https://cemco.com.ec/wp-content/uploads/pc-ryzen5-8500g.jpg",
    brand: "AMD", type: "CPU-OFICINA", source: "CEMCO",
  },
  {
    id: "cemco-2",
    name: "CPU de Escritorio Intel Core i5-14400 | 14va Gen | ASUS H610 | 16GB DDR5",
    specs: "Intel Core i5-14400 · 14va Generación · 16GB DDR5 · SSD 500GB · Board ASUS H610 · Gráficos integrados UHD 730",
    basePrice: 766.17,
    image: "https://cemco.com.ec/wp-content/uploads/cpu-i5-14400.jpg",
    brand: "INTEL", type: "CPU-OFICINA", source: "CEMCO",
  },
  {
    id: "cemco-3",
    name: "PC AMD Ryzen 5 8600G | 16GB DDR5 | SSD 500GB | Radeon 760M | A620",
    specs: "AMD Ryzen 5 8600G · 16GB DDR5 · SSD 500GB · Gráficos Radeon 760M integrados · Board A620",
    basePrice: 766.95,
    image: "https://cemco.com.ec/wp-content/uploads/pc-ryzen5-8600g.jpg",
    brand: "AMD", type: "CPU-OFICINA", source: "CEMCO",
  },
  {
    id: "cemco-4",
    name: "CPU Intel Core Ultra 5 225 | 16GB DDR5 | 500GB SSD | H810 | Teclado + Mouse + Parlantes",
    specs: "Intel Core Ultra 5 225 · 16GB DDR5 · 500GB SSD · Board H810 · Gráficos Arc integrados · Kit periféricos incluido",
    basePrice: 820.41,
    image: "https://cemco.com.ec/wp-content/uploads/cpu-ultra5-225.jpg",
    brand: "INTEL", type: "CPU-OFICINA", source: "CEMCO",
  },
  {
    id: "cemco-5",
    name: "CPU Intel Core Ultra 7-265 | H810 | Gráficos Intel Arc | 16GB DDR5",
    specs: "Intel Core Ultra 7-265 · 20 Núcleos · 16GB DDR5 · 500GB SSD · Board H810 · Gráficos Intel Arc integrados",
    basePrice: 1025.04,
    image: "https://cemco.com.ec/wp-content/uploads/cpu-ultra7-265.jpg",
    brand: "INTEL", type: "CPU-OFICINA", source: "CEMCO",
  },
];

// ── Safe Image with proxy fallback ────────────────────────────────────────────
function SafeImage({ src, alt, brand }: { src: string; alt: string; brand: string }) {
  const [stage, setStage] = useState<"direct" | "proxy" | "fallback">("direct");
  const proxyUrl = `/api/img-proxy?url=${encodeURIComponent(src)}`;
  const brandColor = brand === "INTEL" ? "#3b82f6" : brand === "AMD" ? "#f59e0b" : "#00f0ff";

  if (stage === "fallback") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl">
        <Cpu size={36} style={{ color: brandColor }} className="animate-pulse" />
        <span className="text-[9px] font-mono mt-2 text-slate-500 uppercase tracking-widest">{brand}</span>
      </div>
    );
  }

  return (
    <img
      src={stage === "direct" ? src : proxyUrl}
      alt={alt}
      onError={() => stage === "direct" ? setStage("proxy") : setStage("fallback")}
      className="w-full h-full object-contain rounded-xl bg-slate-900 p-3"
    />
  );
}

// ── Type badge label ──────────────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  "CPU-GAMER": "🎮 CPU GAMER",
  "CPU-OFICINA": "🖥️ CPU HOGAR/OFICINA",
  "PROCESADOR": "⚡ PROCESADOR",
};
const TYPE_COLOR: Record<string, string> = {
  "CPU-GAMER": "bg-purple-500/10 text-purple-300 border-purple-500/30",
  "CPU-OFICINA": "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  "PROCESADOR": "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
};
const BRAND_COLOR: Record<string, string> = {
  INTEL: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  AMD: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  OTRO: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function CPUsClient() {
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc">("price-asc");

  const filtered = useMemo(() => {
    return CATALOG
      .filter((p) => {
        const text = `${p.name} ${p.specs}`.toLowerCase();
        if (brandFilter !== "ALL" && p.brand !== brandFilter) return false;
        if (typeFilter !== "ALL" && p.type !== typeFilter) return false;
        if (search.trim() && !text.includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) =>
        sortBy === "price-asc"
          ? a.basePrice * MARGIN - b.basePrice * MARGIN
          : b.basePrice * MARGIN - a.basePrice * MARGIN
      );
  }, [brandFilter, typeFilter, search, sortBy]);

  const waLink = (p: Product) =>
    `https://wa.me/593992823615?text=${encodeURIComponent(
      `Hola ATOMIC, quisiera cotizar: ${p.name} — Precio referencial: $${(p.basePrice * MARGIN).toFixed(2)}`
    )}`;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans">
      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-purple-700/10 rounded-full blur-[200px]" />
      </div>

      {/* HEADER */}
      <header className="relative z-20 border-b border-cyan-900/40 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Monitor size={20} className="text-slate-950" />
          </div>
          <div>
            <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
              ATOMIC <span className="text-cyan-400">CPUs</span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">COMPUTADORAS & PROCESADORES</p>
          </div>
        </Link>
        <Link href="/web" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono">
          ← INICIO
        </Link>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-6">
          <Flame size={14} className="text-amber-400 animate-bounce" />
          <span>CATÁLOGO OFICIAL ATOMIC · PROCESADORES & EQUIPOS COMPLETOS</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white max-w-4xl mx-auto leading-tight font-mono">
          CPUs, COMPUTADORAS<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">& PROCESADORES</span>
        </h1>
        <p className="mt-4 text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Equipos completos para oficina y gaming · Procesadores Intel Core Ultra & AMD Ryzen · 
          Stock disponible · Envío a todo Ecuador
        </p>

        {/* Source badges */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 font-bold">
            📦 Fuente: <span className="text-cyan-400">BestCell.com.ec</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 font-bold">
            📦 Fuente: <span className="text-emerald-400">CEMCO.com.ec</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-bold">
            ✅ Margen ATOMIC +25% incluido
          </span>
        </div>
      </section>

      {/* FILTERS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-8">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-900/40 backdrop-blur-xl shadow-2xl space-y-4">
          {/* Row 1: Type + Sort */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Type filter */}
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {[
                { id: "ALL", label: "TODO" },
                { id: "CPU-GAMER", label: "🎮 CPU GAMER" },
                { id: "CPU-OFICINA", label: "🖥️ HOGAR/OFICINA" },
                { id: "PROCESADOR", label: "⚡ PROCESADORES" },
              ].map((t) => (
                <button key={t.id} onClick={() => setTypeFilter(t.id)}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    typeFilter === t.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >{t.label}</button>
              ))}
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select value={sortBy} onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-cyan-900/40 text-cyan-300 rounded-xl px-3 py-2 focus:outline-none font-bold">
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Row 2: Brand + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 font-mono text-xs">
              {["ALL","INTEL","AMD"].map((b) => (
                <button key={b} onClick={() => setBrandFilter(b)}
                  className={`px-3 py-2 rounded-xl font-bold transition-all ${
                    brandFilter === b
                      ? b === "INTEL" ? "bg-blue-600 text-white" : b === "AMD" ? "bg-amber-600 text-white" : "bg-slate-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >{b === "ALL" ? "TODAS LAS MARCAS" : b}</button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={16} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por modelo, especificación..."
                className="w-full bg-slate-900/90 border border-cyan-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-5 font-mono text-xs">
          <span className="text-slate-400">
            MOSTRANDO <strong className="text-cyan-400">{filtered.length}</strong> DE {CATALOG.length} PRODUCTOS
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck size={13} /> PRECIOS CON IVA INCLUIDO · MARGEN +25%
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-slate-950/60 border border-slate-800">
            <Cpu size={48} className="mx-auto text-slate-600 mb-4 animate-pulse" />
            <p className="text-slate-400 font-mono uppercase">No hay productos con esos filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => {
              const atomicPrice = p.basePrice * MARGIN;
              return (
                <div key={p.id}
                  className="group rounded-2xl bg-slate-950/80 border border-cyan-900/30 hover:border-cyan-400/80 p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col justify-between"
                >
                  {/* Badges */}
                  <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${BRAND_COLOR[p.brand]}`}>
                      {p.brand}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${TYPE_COLOR[p.type]}`}>
                      {TYPE_LABEL[p.type]}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="w-full h-44 mb-4 overflow-hidden rounded-xl">
                    <SafeImage src={p.image} alt={p.name} brand={p.brand} />
                  </div>

                  {/* Name */}
                  <h3 className="text-sm font-bold text-white font-mono line-clamp-2 mb-2 group-hover:text-cyan-300 transition-colors leading-snug">
                    {p.name}
                  </h3>

                  {/* Specs */}
                  <div className="mb-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-cyan-300/90 leading-relaxed">
                    <Zap size={10} className="inline mr-1 text-amber-400" />
                    {p.specs}
                  </div>

                  {/* Source badge */}
                  <div className="text-[10px] font-mono text-slate-500 mb-3">
                    📦 Fuente: <span className="text-slate-400">{p.source}</span>
                    <span className="ml-2 text-slate-600">· Base: ${p.basePrice.toFixed(2)} +25%</span>
                  </div>

                  {/* Price + CTA */}
                  <div className="pt-3 border-t border-slate-900 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block">PRECIO ATOMIC</span>
                        <span className="text-xl font-black text-white font-mono">${atomicPrice.toFixed(2)}</span>
                      </div>
                      <span className="text-xs text-slate-600 font-mono line-through">${p.basePrice.toFixed(2)}</span>
                    </div>
                    <a href={waLink(p)} target="_blank" rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                      <MessageSquare size={14} />
                      COTIZAR POR WHATSAPP
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="relative z-20 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs font-mono text-slate-500">
        © 2026 ATOMIC SOLUTIONS · COMPUTADORAS, CPUs & PROCESADORES
      </footer>
    </div>
  );
}
