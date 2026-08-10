"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Cpu, Search, Zap, ShieldCheck, Flame, SlidersHorizontal, ArrowUpDown, ChevronRight, CheckCircle2, MessageSquare, ExternalLink, BarChart3, Radio } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images?: string;
  stock: number;
  sku?: string;
  specs?: string;
  category?: { id: string; name: string; slug: string };
}

// Curated high-performance CPUs catalog to enrich demonstration if DB items are limited
const DEMO_CPUS: Product[] = [
  {
    id: "cpu-intel-i9-14900k",
    name: "Intel Core i9-14900K Flagship Processor",
    description: "24 Núcleos (8P + 16E), 32 Hilos, Frecuencia Turbo hasta 6.0 GHz, LGA1700, 36MB Cache, Soporte DDR5/DDR4.",
    price: 689.0,
    compareAtPrice: 749.0,
    images: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    sku: "CPU-INT-14900K",
    specs: "Cores: 24 (8P+16E) | Hilos: 32 | Frecuencia: 6.0 GHz Max | Cache: 36MB | TDP: 125W-253W | Socket: LGA1700",
    category: { id: "cat-cpu", name: "Procesadores Intel", slug: "intel" }
  },
  {
    id: "cpu-amd-ryzen9-7950x3d",
    name: "AMD Ryzen 9 7950X3D 16-Core 3D V-Cache",
    description: "El procesador definitivo para Gaming y Render 3D. 16 Núcleos, 32 Hilos, 144MB Cache L2+L3, AM5, 5.7 GHz Boost.",
    price: 729.0,
    compareAtPrice: 799.0,
    images: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    stock: 5,
    sku: "CPU-AMD-7950X3D",
    specs: "Cores: 16 | Hilos: 32 | Frecuencia: 5.7 GHz Boost | Cache: 144MB 3D V-Cache | TDP: 120W | Socket: AM5",
    category: { id: "cat-cpu", name: "Procesadores AMD", slug: "amd" }
  },
  {
    id: "cpu-intel-i7-14700k",
    name: "Intel Core i7-14700K High Performance CPU",
    description: "20 Núcleos (8P + 12E), 28 Hilos, Frecuencia Turbo hasta 5.6 GHz, LGA1700, 33MB Cache Inteligente.",
    price: 449.0,
    compareAtPrice: 489.0,
    images: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    sku: "CPU-INT-14700K",
    specs: "Cores: 20 (8P+12E) | Hilos: 28 | Frecuencia: 5.6 GHz Max | Cache: 33MB | TDP: 125W | Socket: LGA1700",
    category: { id: "cat-cpu", name: "Procesadores Intel", slug: "intel" }
  },
  {
    id: "cpu-amd-ryzen7-7800x3d",
    name: "AMD Ryzen 7 7800X3D #1 Gaming Processor",
    description: "8 Núcleos, 16 Hilos, 104MB Cache, Socket AM5, 5.0 GHz Boost. Reconocido mundialmente como el mejor CPU Gamer.",
    price: 429.0,
    compareAtPrice: 469.0,
    images: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    sku: "CPU-AMD-7800X3D",
    specs: "Cores: 8 | Hilos: 16 | Frecuencia: 5.0 GHz Boost | Cache: 104MB 3D V-Cache | TDP: 120W | Socket: AM5",
    category: { id: "cat-cpu", name: "Procesadores AMD", slug: "amd" }
  },
  {
    id: "cpu-intel-i5-14600k",
    name: "Intel Core i5-14600K Unlocked Desktop CPU",
    description: "14 Núcleos (6P + 8E), 20 Hilos, Frecuencia Turbo hasta 5.3 GHz, LGA1700, 24MB Cache Intel Smart.",
    price: 319.0,
    compareAtPrice: 349.0,
    images: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    sku: "CPU-INT-14600K",
    specs: "Cores: 14 (6P+8E) | Hilos: 20 | Frecuencia: 5.3 GHz Max | Cache: 24MB | TDP: 125W | Socket: LGA1700",
    category: { id: "cat-cpu", name: "Procesadores Intel", slug: "intel" }
  },
  {
    id: "cpu-amd-ryzen5-7600x",
    name: "AMD Ryzen 5 7600X Next-Gen 6-Core Processor",
    description: "6 Núcleos, 12 Hilos, Frecuencia Turbo 5.3 GHz, Socket AM5, Arquitectura Zen 4 en 5nm.",
    price: 229.0,
    compareAtPrice: 269.0,
    images: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    sku: "CPU-AMD-7600X",
    specs: "Cores: 6 | Hilos: 12 | Frecuencia: 5.3 GHz Boost | Cache: 38MB | TDP: 105W | Socket: AM5",
    category: { id: "cat-cpu", name: "Procesadores AMD", slug: "amd" }
  },
  {
    id: "cpu-amd-threadripper-7980x",
    name: "AMD Ryzen Threadripper 7980X 64-Core Monster",
    description: "Procesador Enterprise para Estaciones de Trabajo Pesadas. 64 Núcleos, 128 Hilos, 320MB Cache, 350W TDP.",
    price: 4999.0,
    compareAtPrice: 5399.0,
    images: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    stock: 2,
    sku: "CPU-TR-7980X",
    specs: "Cores: 64 | Hilos: 128 | Frecuencia: 5.1 GHz Boost | Cache: 320MB | TDP: 350W | Socket: sTR5",
    category: { id: "cat-cpu", name: "Servidores & Workstation", slug: "enterprise" }
  },
  {
    id: "cpu-apple-m3-max",
    name: "Apple Silicon M3 Max Workstation Chip (MacBook Pro Config)",
    description: "16-Core CPU (12 Performance + 4 Efficiency), GPU de 40 Núcleos, 128GB Memoria Unificada, 400 GB/s ancho de banda.",
    price: 3499.0,
    compareAtPrice: 3799.0,
    images: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    stock: 4,
    sku: "CPU-APL-M3MAX",
    specs: "Cores: 16 (12P+4E) | Hilos: 16 | GPU: 40 Cores | Ancho de Banda: 400 GB/s | Arquitectura: 3nm",
    category: { id: "cat-cpu", name: "Apple Silicon", slug: "apple" }
  }
];

export default function CPUsClient({ dbProducts }: { dbProducts: Product[] }) {
  // Combine DB products + DEMO products to ensure a complete landing experience
  const allProducts = useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) return DEMO_CPUS;
    // Append demo products if DB has fewer than 4 items to ensure rich showcase
    const existingIds = new Set(dbProducts.map((p) => p.id));
    const uniqueDemo = DEMO_CPUS.filter((d) => !existingIds.has(d.id));
    return [...dbProducts, ...uniqueDemo];
  }, [dbProducts]);

  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"price-desc" | "price-asc" | "cores">("price-desc");
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  // Filtering
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const text = `${p.name} ${p.description || ""} ${p.specs || ""}`.toLowerCase();
        // Brand filter
        if (selectedBrand === "INTEL" && !text.includes("intel") && !text.includes("i9") && !text.includes("i7") && !text.includes("i5")) return false;
        if (selectedBrand === "AMD" && !text.includes("amd") && !text.includes("ryzen") && !text.includes("threadripper")) return false;
        if (selectedBrand === "APPLE" && !text.includes("apple") && !text.includes("m3") && !text.includes("m2") && !text.includes("m1")) return false;
        if (selectedBrand === "WORKSTATION" && !text.includes("threadripper") && !text.includes("xeon") && !text.includes("epyc")) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return text.includes(q);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "cores") {
          const getCores = (specsStr?: string) => {
            const match = specsStr?.match(/Cores:\s*(\d+)/i) || specsStr?.match(/(\d+)\s*Núcleos/i);
            return match ? parseInt(match[1]) : 0;
          };
          return getCores(b.specs) - getCores(a.specs);
        }
        return 0;
      });
  }, [allProducts, selectedBrand, searchQuery, sortBy]);

  const getWhatsAppLink = (product: Product) => {
    const text = `Hola ATOMIC, deseo solicitar información o cotizar el procesador: ${product.name} (SKU: ${product.sku || product.id}) - Precio: $${product.price}`;
    return `https://wa.me/593992823615?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* ── BACKGROUND NEON GLOW ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-purple-700/10 rounded-full blur-[200px]" />
      </div>

      {/* ── HEADER NAVIGATION ── */}
      <header className="relative z-20 border-b border-cyan-900/40 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-cyan-400 font-black">
              <Cpu size={20} className="animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
              ATOMIC <span className="text-cyan-400">CPUs</span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">MATRIZ DE PROCESADORES MAESTROS</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/ecosistema-tomc"
            className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all font-mono text-xs font-bold flex items-center gap-2"
          >
            <Radio size={14} className="animate-pulse text-emerald-400" />
            <span>NÚCLEO ECOSISTEMA</span>
          </Link>
          <Link
            href="/web"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono"
          >
            <span>INICIO</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-6">
          <Flame size={14} className="text-amber-400 animate-bounce" />
          <span>POTENCIA DE CÓMPUTO INDUSTRIAL Y GAMING</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white max-w-4xl mx-auto leading-tight font-mono">
          PROCESADORES <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">DE ÚLTIMA GENERACIÓN</span>
        </h1>

        <p className="mt-4 text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-sans leading-relaxed">
          Explora la matriz completa de CPUs Intel Core i9/i7/i5, AMD Ryzen 3D V-Cache, Apple Silicon M3/M4 y Procesadores Enterprise. Cotiza directo con envío garantizado a nivel nacional.
        </p>

        {/* Quick specs pill stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-900/30 backdrop-blur-md">
            <span className="block text-cyan-400 font-bold text-lg">HASTA 6.0 GHz</span>
            <span className="text-slate-500 text-[10px]">FRECUENCIA TURBO MAX</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-900/30 backdrop-blur-md">
            <span className="block text-emerald-400 font-bold text-lg">64 HILOS</span>
            <span className="text-slate-500 text-[10px]">ARQUITECTURA MULTI-CORE</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-900/30 backdrop-blur-md">
            <span className="block text-amber-400 font-bold text-lg">144MB CACHE</span>
            <span className="text-slate-500 text-[10px]">TECNOLOGÍA 3D V-CACHE</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-900/30 backdrop-blur-md">
            <span className="block text-purple-400 font-bold text-lg">STOCK LOCAL</span>
            <span className="text-slate-500 text-[10px]">ENTREGA INMEDIATA</span>
          </div>
        </div>
      </section>

      {/* ── FILTER & SEARCH BAR ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-10">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-900/40 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Brand Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide font-mono text-xs">
              {[
                { id: "ALL", label: "TODOS LOS CPUs" },
                { id: "INTEL", label: "INTEL CORE" },
                { id: "AMD", label: "AMD RYZEN" },
                { id: "APPLE", label: "APPLE SILICON" },
                { id: "WORKSTATION", label: "WORKSTATION / SERVIDOR" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBrand(tab.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedBrand === tab.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort selection */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end font-mono text-xs">
              <span className="text-slate-400 flex items-center gap-1 shrink-0">
                <ArrowUpDown size={14} /> ORDENAR:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-cyan-900/40 text-cyan-300 rounded-xl px-3 py-2 focus:outline-none font-bold"
              >
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="cores">Mayor Número de Núcleos</option>
              </select>
            </div>

          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por modelo (ej: i9-14900K, Ryzen 7 7800X3D, M3 Max, Threadripper)..."
              className="w-full bg-slate-900/90 border border-cyan-900/40 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
            />
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6 font-mono text-xs">
          <span className="text-slate-400">
            PROCESADORES ENCONTRADOS: <strong className="text-cyan-400 font-bold">{filteredProducts.length}</strong>
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck size={14} /> PRECIOS ATOMIC INCLUYEN IVA & GARANTÍA DIRECTA
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-slate-950/60 border border-slate-800">
            <Cpu size={48} className="mx-auto text-slate-600 mb-4 animate-pulse" />
            <h3 className="text-lg font-bold font-mono text-slate-300 uppercase">No se encontraron procesadores con esos filtros</h3>
            <p className="text-xs text-slate-500 mt-1">Prueba cambiando la búsqueda o seleccionando "TODOS LOS CPUs"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isIntel = product.name.toLowerCase().includes("intel") || product.name.toLowerCase().includes("core i");
              const isAmd = product.name.toLowerCase().includes("amd") || product.name.toLowerCase().includes("ryzen");
              const isApple = product.name.toLowerCase().includes("apple") || product.name.toLowerCase().includes("m3") || product.name.toLowerCase().includes("m2");

              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-slate-950/80 border border-cyan-900/30 hover:border-cyan-400/80 p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        isIntel
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : isAmd
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : isApple
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      }`}
                    >
                      {isIntel ? "INTEL" : isAmd ? "AMD" : isApple ? "APPLE" : "ENTERPRISE"}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      STOCK DISPONIBLE
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-44 rounded-xl bg-slate-900/80 mb-4 overflow-hidden relative group-hover:scale-105 transition-transform duration-500 flex items-center justify-center p-4">
                    {product.images ? (
                      <img
                        src={product.images.split(",")[0]}
                        alt={product.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        onError={(e: any) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <Cpu size={64} className="text-cyan-400/40" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono line-clamp-2 mb-2 group-hover:text-cyan-300 transition-colors">
                      {product.name}
                    </h3>

                    {product.specs && (
                      <div className="mb-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-cyan-300/90 leading-relaxed">
                        ⚡ {product.specs}
                      </div>
                    )}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 border-t border-slate-900 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-500 font-mono block">PVP ATOMIC</span>
                        <span className="text-xl font-black text-white font-mono tracking-tight">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <a
                      href={getWhatsAppLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      <MessageSquare size={14} />
                      <span>COTIZAR AHORA</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── BENCHMARK COMPARISON SECTION ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-900/50 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-cyan-400 animate-pulse" size={24} />
            <h2 className="text-xl md:text-2xl font-black font-mono text-white uppercase tracking-wider">
              BENCHMARK DE RENDIMIENTO MULTI-CORE (CINEBENCH R23)
            </h2>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {[
              { name: "AMD Ryzen Threadripper 7980X (64 Cores)", score: 100, color: "bg-purple-500", pts: "100,000+ pts" },
              { name: "Intel Core i9-14900K (24 Cores)", score: 40, color: "bg-blue-500", pts: "40,000 pts" },
              { name: "AMD Ryzen 9 7950X3D (16 Cores)", score: 38, color: "bg-amber-500", pts: "38,500 pts" },
              { name: "Apple Silicon M3 Max (16 Cores)", score: 35, color: "bg-cyan-500", pts: "34,200 pts" },
              { name: "Intel Core i7-14700K (20 Cores)", score: 34, color: "bg-blue-400", pts: "34,000 pts" },
              { name: "AMD Ryzen 7 7800X3D (8 Cores)", score: 20, color: "bg-emerald-500", pts: "19,500 pts" },
            ].map((bm, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span>{bm.name}</span>
                  <span className="text-cyan-300">{bm.pts}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div className={`h-full ${bm.color} rounded-full transition-all duration-1000`} style={{ width: `${bm.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-20 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs font-mono text-slate-500">
        <p>© 2026 ATOMIC SOLUTIONS · CATÁLOGO DE CPUs & PROCESADORES MAESTROS</p>
      </footer>
    </div>
  );
}
