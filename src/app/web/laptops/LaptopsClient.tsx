"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Laptop, Search, ArrowRight, MessageSquare, Star, Cpu, HardDrive,
  Wifi, Battery, Shield, ChevronLeft, Sparkles, Filter, Check, Copy,
  Package, LayoutGrid, Monitor, Flame, MessageCircle, X, CheckCircle2,
  PhoneCall, Truck, Award
} from "lucide-react";

interface LaptopProduct {
  id: string;
  name: string;
  brand: string;
  specs: string;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  category: "LAPTOP" | "DESKTOP" | "WORKSTATION" | "GAMING";
  chip?: string;
  ram?: string;
  storage?: string;
  screen?: string;
}

const FEATURED_LAPTOPS: LaptopProduct[] = [
  {
    id: "dell-7390",
    name: "Dell Latitude 7390 Core i7",
    brand: "DELL",
    specs: "Intel Core i7 Gen 8 · 16GB RAM · 512GB SSD NVMe · 13.3\" Full HD · Windows 11 Pro",
    price: 850,
    image: "https://coretms.tecnomegastore.ec/assets/images/main/24/COMDELLAT7390.webp",
    badge: "REFURBISHED PREMIUM",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    category: "LAPTOP",
    chip: "Intel Core i7-8650U",
    ram: "16 GB DDR4",
    storage: "512 GB SSD NVMe",
    screen: "13.3\" FHD IPS",
  },
  {
    id: "hp-15-fd",
    name: "HP 15-fd0089wm Core i5 13ª Gen",
    brand: "HP",
    specs: "Intel Core i5-1335U · 8GB RAM · 512GB SSD · 15.6\" FHD · Windows 11 Home",
    price: 699,
    image: "https://coretms.tecnomegastore.ec/assets/images/main/24/COMHP15FD0089.webp",
    badge: "MÁS VENDIDO",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    category: "LAPTOP",
    chip: "Intel Core i5-1335U",
    ram: "8 GB DDR4",
    storage: "512 GB SSD",
    screen: "15.6\" FHD",
  },
  {
    id: "asus-vivobook",
    name: "ASUS VivoBook 15 IPS 90Hz",
    brand: "ASUS",
    specs: "Intel Core i5-12th Gen · 12GB RAM · 512GB SSD · 15.6\" FHD IPS 90Hz · Win11 Home",
    price: 680,
    image: "https://coretms.tecnomegastore.ec/assets/images/main/24/COMASUSX1502.webp",
    badge: "ESTUDIANTE PRO",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    category: "LAPTOP",
    chip: "Intel Core i5-1235U",
    ram: "12 GB DDR4",
    storage: "512 GB SSD",
    screen: "15.6\" FHD 90Hz",
  },
  {
    id: "lenovo-ideapad",
    name: "Lenovo IdeaPad Slim 3i",
    brand: "LENOVO",
    specs: "Intel Core i5-12th · 8GB RAM · 512GB SSD · 15.6\" FHD IPS · Win11 Home",
    price: 590,
    image: "https://coretms.tecnomegastore.ec/assets/images/main/24/COMLEN82RK009.webp",
    badge: "ALTA DURABILIDAD",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    category: "LAPTOP",
    chip: "Intel Core i5-1235U",
    ram: "8 GB DDR4",
    storage: "512 GB SSD",
    screen: "15.6\" FHD IPS",
  },
  {
    id: "gaming-rog-strix",
    name: "ASUS ROG Strix G16 RTX 4070",
    brand: "ASUS",
    specs: "Intel Core i9-14900HX · 32GB DDR5 · 1TB SSD NVMe · 16\" WQHD 240Hz · RTX 4070 8GB",
    price: 2890,
    image: "https://coretms.tecnomegastore.ec/assets/images/main/24/COMASUSG614.webp",
    badge: "GAMING EXTREMO",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    category: "GAMING",
    chip: "Intel Core i9-14900HX",
    ram: "32 GB DDR5",
    storage: "1 TB SSD NVMe",
    screen: "16\" WQHD 240Hz",
  },
  {
    id: "dell-gaming-g15",
    name: "Dell G15 Gaming RTX 4060",
    brand: "DELL",
    specs: "Intel Core i7-13650HX · 16GB DDR5 · 512GB SSD · 15.6\" FHD 165Hz · RTX 4060 8GB",
    price: 1650,
    image: "https://coretms.tecnomegastore.ec/assets/images/main/24/COMDELLG155530.webp",
    badge: "GAMER PRO",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    category: "GAMING",
    chip: "Intel Core i7-13650HX",
    ram: "16 GB DDR5",
    storage: "512 GB SSD NVMe",
    screen: "15.6\" FHD 165Hz",
  },
  {
    id: "dell-pro-max-16",
    name: "Dell Precision Workstation 16",
    brand: "DELL",
    specs: "Intel Core Ultra 9-285H · 64GB DDR5 · 2TB M.2 · 16\" FHD+ · RTX Pro 1000 8GB · W11 Pro",
    price: 5061,
    image: "https://coretms.tecnomegastore.ec/assets/images/main/24/COMDELPREC7680.webp",
    badge: "WORKSTATION",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    category: "WORKSTATION",
    chip: "Intel Core Ultra 9-285H",
    ram: "64 GB DDR5",
    storage: "2 TB NVMe M.2",
    screen: "16\" FHD+",
  },
  {
    id: "hp-zbook-x-g1i",
    name: "HP ZBook Fury G10 Workstation",
    brand: "HP",
    specs: "Intel Core Ultra 9 · 32GB RAM · 1TB SSD · 16\" · RTX Pro 1000 8GB · Win11 Pro",
    price: 3831,
    image: "https://coretms.tecnomegastore.ec/assets/images/main/24/COMHPZBOOKG10.webp",
    badge: "ARQUITECTURA & 3D",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    category: "WORKSTATION",
    chip: "Intel Core Ultra 9",
    ram: "32 GB DDR5",
    storage: "1 TB SSD NVMe",
    screen: "16\" WQUXGA",
  }
];

const CATEGORIES = ["TODO", "LAPTOP", "DESKTOP", "WORKSTATION", "GAMING"] as const;
const BRANDS = ["TODAS", "DELL", "HP", "ASUS", "ACER", "LENOVO", "APPLE"];
const WA_NUMBER = "593969043453";

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

// Resilient Product Image Component (No Broken Images Ever)
function SafeProductImage({ src, alt, brand, category }: { src?: string; alt: string; brand?: string; category?: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!src || error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/80 text-slate-400 p-6 text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
          {category === "DESKTOP" ? <Monitor size={26} /> : <Laptop size={26} />}
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider">
          {brand || "ATOMIC"} {category || "PC"}
        </span>
        <span className="text-[9px] text-slate-400 font-sans line-clamp-1 mt-0.5 max-w-[180px]">
          {alt}
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

export default function LaptopsClient() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("TODO");
  const [activeBrand, setActiveBrand] = useState("TODAS");
  const [visibleCount, setVisibleCount] = useState(20);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Fetch dynamic products from database
  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/web/products?pageSize=2000").then(r => r.json());
        const raw = res.products || [];
        // Filter products that belong to computer category or have laptop keywords
        const filteredFromDb = raw.filter((p: any) => {
          const name = (p.name || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const cat = (p.category?.name || "").toLowerCase();
          return (
            cat.includes("laptop") || cat.includes("computacion") || cat.includes("computación") || cat.includes("pc") ||
            name.includes("laptop") || name.includes("notebook") || name.includes("all-in-one") ||
            name.includes("desktop") || name.includes("optiplex") || name.includes("latitude") ||
            name.includes("thinkpad") || name.includes("ideapad") || name.includes("vivobook") ||
            name.includes("probook") || name.includes("macbook") || name.includes("zbook") ||
            name.includes("core i") || name.includes("ryzen") || name.includes("workstation")
          );
        });
        setDbProducts(filteredFromDb);
      } catch (err) {
        console.error("Error fetching db laptops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLaptops();
  }, []);

  // Combine featured catalog and DB products
  const allProducts = useMemo(() => {
    const fromFeatured = FEATURED_LAPTOPS.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      specs: p.specs,
      price: p.price,
      image: p.image,
      badge: p.badge,
      badgeColor: p.badgeColor,
      category: p.category,
      sku: p.id.toUpperCase(),
      provider: "ATOMIC Store"
    }));

    const fromDb = dbProducts.map(p => {
      const parsedImages = safeParseArray(p.images, []);
      let img = parsedImages.length > 0 ? parsedImages[0] : "";

      const nameLower = (p.name || "").toLowerCase();
      let brand = "ATOMIC";
      if (nameLower.includes("dell")) brand = "DELL";
      else if (nameLower.includes("hp")) brand = "HP";
      else if (nameLower.includes("asus") || nameLower.includes("rog")) brand = "ASUS";
      else if (nameLower.includes("lenovo") || nameLower.includes("thinkpad")) brand = "LENOVO";
      else if (nameLower.includes("acer")) brand = "ACER";
      else if (nameLower.includes("apple") || nameLower.includes("macbook")) brand = "APPLE";

      let cat: "LAPTOP" | "DESKTOP" | "WORKSTATION" | "GAMING" = "LAPTOP";
      if (nameLower.includes("gaming") || nameLower.includes("rtx") || nameLower.includes("rog")) cat = "GAMING";
      else if (nameLower.includes("workstation") || nameLower.includes("precision") || nameLower.includes("zbook")) cat = "WORKSTATION";
      else if (nameLower.includes("desktop") || nameLower.includes("all-in-one") || nameLower.includes("optiplex")) cat = "DESKTOP";

      return {
        id: p.id,
        name: p.name,
        brand,
        specs: p.description?.replace(/<[^>]*>/g, '').substring(0, 110) || "Garantía oficial y soporte técnico directo en Ecuador",
        price: Number(p.price || 0),
        image: img,
        badge: cat === "GAMING" ? "GAMER" : "DISPONIBLE",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
        category: cat,
        sku: p.sku || `PC-${p.id.substring(0, 6)}`,
        provider: p.provider || "ATOMIC Oficial"
      };
    });

    return [...fromFeatured, ...fromDb];
  }, [dbProducts]);

  // Filter products by search, category and brand
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.specs.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());

      const matchCat = activeCategory === "TODO" || p.category === activeCategory;
      const matchBrand = activeBrand === "TODAS" || p.brand === activeBrand;

      return matchSearch && matchCat && matchBrand;
    });
  }, [allProducts, search, activeCategory, activeBrand]);

  // Infinite scroll slice
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Intersection observer for continuous infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((prev) => Math.min(prev + 20, filteredProducts.length));
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
    const msg = `*¡Hola ATOMIC! Me interesa cotizar este equipo de computación:*
• *Equipo:* ${product.name}
• *Marca:* ${product.brand}
• *Categoría:* ${product.category}
• *Precio:* $${product.price.toFixed(2)} + IVA
• *Especificaciones:* ${product.specs}

¿Tienen stock disponible para entrega o envío?`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const handleCopySpecs = (product: any) => {
    const text = `💻 ${product.name} (${product.brand}) - $${product.price.toFixed(2)} + IVA
Especificaciones: ${product.specs}`;
    navigator.clipboard.writeText(text);
    setCopiedSku(product.id);
    setTimeout(() => setCopiedSku(null), 2500);
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] font-sans selection:bg-blue-600 selection:text-white relative">
      
      {/* ── BACKGROUND BLUR GLOWS (BLANCO BLUR EFFECT) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[160px]" />
      </div>

      {/* ── TOP ANNOUNCEMENT BAR (CLEAN WHITE) ── */}
      <div className="relative z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.06] text-slate-700 text-xs font-mono py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="text-blue-600">⚡</span>
        <span className="font-bold text-slate-900">LÍNEA DE COMPUTACIÓN & LAPTOPS // ATOMIC ECUADOR</span>
        <span className="hidden md:inline text-slate-500">• Laptops, Workstations, All-in-One y PCs Gamer con 1 Año de Garantía y Envíos a Nivel Nacional</span>
      </div>

      {/* ── NAVBAR (BLANCO BLUR GLASSMORPHISM) ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Laptop size={20} />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 uppercase font-mono">
                ATOMIC <span className="text-blue-600">COMPUTACIÓN</span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono">Laptops & PCs Oficiales</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/web"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.08] text-slate-700 hover:text-slate-900 hover:bg-black/[0.03] text-xs font-mono font-bold transition-all"
            >
              ← Volver al Menú
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hola%20ATOMIC%2C%20deseo%20asesor%C3%ADa%20en%20computadoras%20y%20laptops.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all"
            >
              <PhoneCall size={14} />
              <span>Asesor Especialista</span>
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
                <span>Portátiles Profesionales & PCs de Escritorio</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 font-mono leading-tight">
                LÍNEA DE COMPUTACIÓN<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                  & LAPTOPS ATOMIC
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                Equipos seleccionados para <strong>productividad, arquitectura, diseño gráfico, ingeniería y gaming</strong> con procesadores Intel Core Ultra, Core i5/i7/i9 y AMD Ryzen, discos SSD NVMe de alta velocidad y 1 Año de Garantía oficial con repuestos en Ecuador.
              </p>

              {/* Value Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { t: "100% Garantizados", d: "Soporte y repuestos" },
                  { t: "Windows 11 Pro", d: "Licencias originales" },
                  { t: "SSD NVMe M.2", d: "Arranque ultra veloz" },
                  { t: "Envíos 24 Horas", d: "A las 24 Provincias" }
                ].map((b, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-sm text-left">
                    <div className="text-xs font-bold text-blue-600 font-mono">{b.t}</div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">{b.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portada Image Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-black/[0.08] bg-white shadow-2xl p-2.5 backdrop-blur-xl">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-slate-950">
                  <img
                    src="/images/promociones/laptops-portada.jpg"
                    alt="Línea de Laptops ATOMIC"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-mono font-bold text-white">
                    ⚡ Portada Oficial ATOMIC Laptops
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FILTERS & CATEGORIES (STICKY WHITE BLUR) ── */}
      <section className="sticky top-16 z-40 bg-white/85 backdrop-blur-2xl border-b border-black/[0.06] py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(20); }}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                  activeCategory === cat
                    ? "bg-slate-950 text-white border-slate-950 shadow-md"
                    : "bg-white text-slate-600 border-black/[0.08] hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Brand Filter & Search Input */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={activeBrand}
              onChange={(e) => { setActiveBrand(e.target.value); setVisibleCount(20); }}
              className="px-3 py-2 rounded-xl bg-white border border-black/[0.08] text-xs font-mono font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b === "TODAS" ? "Todas las marcas" : b}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(20); }}
                placeholder="Buscar Core i7, 16GB, RTX..."
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

        </div>
      </section>

      {/* ── PRODUCTS GRID (INFINITE SCROLL) ── */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 font-mono tracking-tight">
              Equipos de Computación ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Scroll infinito activado • Mostrando {Math.min(visibleProducts.length, filteredProducts.length)} de {filteredProducts.length} productos
            </p>
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="p-16 text-center bg-white/90 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-xl">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 font-mono">No se encontraron equipos con estos filtros</h3>
            <p className="text-xs text-slate-500 mt-1">Prueba cambiando la marca o borrando el término de búsqueda.</p>
            <button
              onClick={() => { setActiveCategory("TODO"); setActiveBrand("TODAS"); setSearch(""); }}
              className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs uppercase font-mono shadow-md"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-3xl bg-white/90 backdrop-blur-xl border border-black/[0.06] hover:border-blue-500/40 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:scale-[1.01]"
              >
                {/* Visual Image Header */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100/60 overflow-hidden border-b border-black/[0.04] p-4 flex items-center justify-center">
                  <SafeProductImage src={prod.image} alt={prod.name} brand={prod.brand} category={prod.category} />

                  {/* Brand / Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-slate-950 text-white shadow-sm">
                      {prod.brand}
                    </span>
                    {prod.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono border ${prod.badgeColor || 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-blue-600 text-white font-mono font-black text-sm px-3 py-1 rounded-xl shadow-md shadow-blue-600/20">
                    ${prod.price.toFixed(2)} <span className="text-[9px] font-normal">+IVA</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                      {prod.category} · {prod.provider || "ATOMIC Oficial"}
                    </span>

                    <h3 className="text-sm font-black text-slate-900 uppercase font-mono mt-1 leading-snug line-clamp-2">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-2 font-sans line-clamp-2 leading-relaxed">
                      {prod.specs}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={getWaLink(prod)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      <span>Cotizar</span>
                    </a>

                    <button
                      onClick={() => handleCopySpecs(prod)}
                      className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                      title="Copiar ficha técnica"
                    >
                      {copiedSku === prod.id ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── INFINITE SCROLL TRIGGER / LOADER ── */}
        <div ref={observerTarget} className="w-full py-12 flex items-center justify-center">
          {visibleCount < filteredProducts.length ? (
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-black/[0.08] shadow-sm">
              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Cargando más equipos de computación...</span>
            </div>
          ) : (
            filteredProducts.length > 0 && (
              <p className="text-xs font-mono text-slate-400 bg-white/60 px-4 py-2 rounded-full border border-black/[0.04]">
                ✓ Has llegado al final del catálogo de computación ({filteredProducts.length} productos)
              </p>
            )
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/[0.06] bg-white/80 backdrop-blur-xl py-12 px-6 text-center text-xs text-slate-500 font-mono space-y-2 relative z-10">
        <p>© 2026 ATOMIC INDUSTRIES — Distribución de Computadoras, Laptops & Workstations en Ecuador.</p>
        <p className="text-[11px] text-slate-400">Marcas oficiales: Dell, HP, ASUS, Lenovo, Acer y Apple con 1 Año de Garantía y soporte de repuestos.</p>
      </footer>

    </main>
  );
}
