"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Laptop, Search, ArrowRight, MessageSquare, Star, Cpu, HardDrive, Wifi, Battery, Shield, ChevronLeft } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ATOMIC — Línea de Laptops & Computadoras (Appit Dark Theme)
// ─────────────────────────────────────────────────────────────────────────────

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

const CATALOG: LaptopProduct[] = [
  {
    id: "dell-7390",
    name: "Dell Latitude 7390",
    brand: "DELL",
    specs: "Intel Core i5/i7 Gen 8 · 8GB-16GB RAM · 256GB-512GB SSD · 13.3\" Full HD · Windows 11 Pro",
    price: 850,
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/latitude-7000/latitude-7390/global-spi/ng/laptop-lat-7390-nt-bk-frt-1.psd",
    badge: "REFURBISHED PREMIUM",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    category: "LAPTOP",
    chip: "Intel Core i7-8650U",
    ram: "16 GB DDR4",
    storage: "512 GB SSD NVMe",
    screen: "13.3\" FHD",
  },
  {
    id: "hp-15-fd",
    name: "HP 15-fd0089wm Laptop",
    brand: "HP",
    specs: "Intel Core i5-1335U · 8GB RAM · 512GB SSD · 15.6\" FHD · Windows 11 Home",
    price: 699,
    image: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08539604.png",
    badge: "MÁS VENDIDO",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    category: "LAPTOP",
    chip: "Intel Core i5-1335U",
    ram: "8 GB DDR4",
    storage: "512 GB SSD",
    screen: "15.6\" FHD",
  },
  {
    id: "hp-probook-455",
    name: "HP ProBook 455 G4",
    brand: "HP",
    specs: "AMD A6 · 8GB RAM · 128GB SSD · 15.6\" HD · Windows 10 Pro",
    price: 420,
    image: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c05153083.png",
    badge: "ECONÓMICA",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    category: "LAPTOP",
    chip: "AMD A6-9210",
    ram: "8 GB DDR4",
    storage: "128 GB SSD",
    screen: "15.6\" HD",
  },
  {
    id: "acer-cbv514",
    name: "Chromebook Acer CBV514",
    brand: "ACER",
    specs: "Intel Core i3-1215U · 8GB RAM · 256GB SSD · 14\" FHD · ChromeOS + Linux",
    price: 580,
    image: "https://www.acer.com/content/dam/acer/regional/apac/en/images/Products/notebooks/Chromebook/Chromebook-Vero-514/acer-chromebook-vero-514-cbv514-01h-product-gallery-1.png",
    badge: "ECO FRIENDLY",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    category: "LAPTOP",
    chip: "Intel Core i3-1215U",
    ram: "8 GB",
    storage: "256 GB SSD",
    screen: "14\" FHD",
  },
  {
    id: "dell-pro-max-16",
    name: "Dell Pro Max 16 MC16250",
    brand: "DELL",
    specs: "Intel Core Ultra 9-285H vPro · 2×32GB DDR5 · 2TB M.2 · 16\" FHD+ · RTX Pro 1000 8GB · W11 Pro 3Y",
    price: 5061,
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/precision-notebooks/precision-5690/global-spi/laptop-precision-5690-hero-504x350-ng.psd",
    badge: "WORKSTATION",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    category: "WORKSTATION",
    chip: "Intel Core Ultra 9-285H vPro",
    ram: "64 GB DDR5",
    storage: "2 TB NVMe M.2",
    screen: "16\" FHD+",
  },
  {
    id: "hp-zbook-x-g1i",
    name: "HP ZBook X G1i",
    brand: "HP",
    specs: "Intel Core Ultra 9 285H · 32GB RAM · 1TB SSD · 16\" · RTX Pro 1000 8GB · Win11 Pro",
    price: 3831,
    image: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08826832.png",
    badge: "PROFESIONAL",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    category: "WORKSTATION",
    chip: "Intel Core Ultra 9 285H",
    ram: "32 GB DDR5",
    storage: "1 TB SSD NVMe",
    screen: "16\" WQUXGA",
  },
  {
    id: "asus-proart-px13",
    name: "ASUS ProArt PX13",
    brand: "ASUS",
    specs: "Ryzen AI 9 HX-370 · 16GB RAM · 1TB SSD · 13.3\" OLED · RTX 4050 6GB · Win11",
    price: 3407,
    image: "https://dlcdnwebimgs.asus.com/files/media/65DB5C4B-08B8-45E7-8AB0-45CAE9660E35/v2/img/kv/mb.png",
    badge: "CREATIVO",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    category: "LAPTOP",
    chip: "AMD Ryzen AI 9 HX-370",
    ram: "16 GB LPDDR5X",
    storage: "1 TB SSD NVMe",
    screen: "13.3\" OLED 120Hz",
  },
  {
    id: "dell-pro-slim",
    name: "Dell Pro Max Slim FCS1250",
    brand: "DELL",
    specs: "Intel Core Ultra 9-285K · 2×32GB · 2TB SSD · RTX A1000 8GB · W11 Pro",
    price: 3855,
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/optiplex/optiplex-small-form-factor-plus-7020/media-gallery/desktop-optiplex-sff-7020-ant-bk-frt-1.psd",
    badge: "DESKTOP PRO",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    category: "DESKTOP",
    chip: "Intel Core Ultra 9-285K",
    ram: "64 GB DDR5",
    storage: "2 TB SSD NVMe",
    screen: "Monitor no incluido",
  },
  {
    id: "asus-vivobook",
    name: "ASUS VivoBook 15",
    brand: "ASUS",
    specs: "Intel Core i5-12th Gen · 12GB RAM · 512GB SSD · 15.6\" FHD IPS 90Hz · Win11 Home",
    price: 680,
    image: "https://dlcdnwebimgs.asus.com/files/media/a63ece3c-2079-4a94-9b0e-cd35f7d5e23e/v3/img/kv/desktop.png",
    badge: "ESTUDIANTE",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
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
    image: "https://p2-ofp.static.pub/fes/cms/2022/09/22/c57w9n5m4jj3b8ow7k9x8o7z2e1y1z463570.png",
    badge: "CONFIABLE",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    category: "LAPTOP",
    chip: "Intel Core i5-1235U",
    ram: "8 GB DDR4",
    storage: "512 GB SSD",
    screen: "15.6\" FHD IPS",
  },
  {
    id: "gaming-rog-strix",
    name: "ASUS ROG Strix G16",
    brand: "ASUS",
    specs: "Intel Core i9-14900HX · 32GB DDR5 · 1TB SSD NVMe · 16\" WQHD 240Hz · RTX 4070 Ti 12GB",
    price: 2890,
    image: "https://dlcdnwebimgs.asus.com/files/media/d3a5a40c-c90c-4609-b0a1-2c28bb29e476/v3/img/kv/desktop.png",
    badge: "GAMING",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    category: "GAMING",
    chip: "Intel Core i9-14900HX",
    ram: "32 GB DDR5",
    storage: "1 TB SSD NVMe",
    screen: "16\" WQHD 240Hz",
  },
  {
    id: "dell-gaming-g15",
    name: "Dell G15 Gaming",
    brand: "DELL",
    specs: "Intel Core i7-13650HX · 16GB DDR5 · 512GB SSD · 15.6\" FHD 165Hz · RTX 4060 8GB",
    price: 1650,
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/g-series/g15-5530/global-spi/ng/laptop-g15-5530-nt-bk-frt-1.psd",
    badge: "GAMER ENTRY",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    category: "GAMING",
    chip: "Intel Core i7-13650HX",
    ram: "16 GB DDR5",
    storage: "512 GB SSD NVMe",
    screen: "15.6\" FHD 165Hz",
  },
];

const CATEGORIES = ["TODO", "LAPTOP", "DESKTOP", "WORKSTATION", "GAMING"] as const;
const BRANDS = ["TODAS", "DELL", "HP", "ASUS", "ACER", "LENOVO"];

const WA_NUMBER = "593969043453";

export default function LaptopsClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("TODO");
  const [activeBrand, setActiveBrand] = useState("TODAS");

  const filtered = useMemo(() => {
    return CATALOG.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specs.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "TODO" || p.category === activeCategory;
      const matchBrand = activeBrand === "TODAS" || p.brand === activeBrand;
      return matchSearch && matchCat && matchBrand;
    });
  }, [search, activeCategory, activeBrand]);

  const waLink = (name: string) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola ATOMIC! Me interesa cotizar: ${name}. ¿Pueden darme más información y precio?`)}`;

  return (
    <main className="min-h-screen bg-[#09090A] text-white font-sans" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/5 pointer-events-none" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <Link href="/web" className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors mb-8">
            <ChevronLeft size={14} />
            Volver a la tienda
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Laptop size={12} />
              Línea de Computación ATOMIC
            </div>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight text-white mb-4" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              Laptops &<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Computadoras</span>
            </h1>
            <p className="text-[#94969D] text-base leading-relaxed max-w-2xl mb-8">
              Portátiles de alto rendimiento, workstations profesionales y equipos gaming desde $420 hasta $5,000+. Dell, HP, ASUS, Lenovo y Acer. Garantía, factura y soporte técnico incluidos.
            </p>

            <div className="flex flex-wrap gap-6 text-xs text-neutral-300 font-bold">
              {[
                { icon: <Shield size={14} />, text: "Garantía de Fábrica" },
                { icon: <Star size={14} />, text: "Envío Gratis Quito" },
                { icon: <MessageSquare size={14} />, text: "Cotización Inmediata" },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-neutral-300">{item.icon} {item.text}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="sticky top-0 z-30 bg-[#09090A]/95 backdrop-blur-md border-b border-white/[0.06] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar laptop, specs, marca..."
              className="w-full bg-[#131315] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:border-white/30 outline-none transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat === "TODO" ? "Todos" : cat}
              </button>
            ))}
          </div>

          {/* Brands */}
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => setActiveBrand(b)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  activeBrand === b
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-transparent text-neutral-500 border-white/[0.06] hover:border-white/20"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-8">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group bg-[#0E0E10] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)] transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-[#131315] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300/131315/FFFFFF?text=" + p.brand;
                  }}
                />
                {p.badge && (
                  <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${p.badgeColor}`}>
                    {p.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{p.brand}</div>
                <h3 className="text-sm font-black text-white leading-snug mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                  {p.name}
                </h3>

                {/* Key specs pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[
                    p.chip && { icon: <Cpu size={10} />, text: p.chip.split(" ").slice(-2).join(" ") },
                    p.ram && { icon: <HardDrive size={10} />, text: p.ram },
                    p.storage && { icon: <HardDrive size={10} />, text: p.storage },
                    p.screen && { icon: <Laptop size={10} />, text: p.screen },
                  ].filter(Boolean).slice(0, 3).map((s: any, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[#131315] border border-white/[0.06] rounded-full text-[9px] font-bold text-neutral-400">
                      {s.icon} {s.text}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-black text-white">${p.price.toLocaleString("en-US")}</span>
                    <span className="text-xs text-neutral-500">USD</span>
                  </div>

                  <a
                    href={waLink(p.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-white hover:bg-neutral-100 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-white/10"
                  >
                    <MessageSquare size={13} />
                    Cotizar en WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-neutral-500">
            <Laptop size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold">No se encontraron equipos con esos criterios.</p>
          </div>
        )}
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="border-t border-white/[0.06] py-16 px-6 bg-[#0E0E10]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black uppercase text-white mb-3" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
            ¿No encontraste lo que buscas?
          </h2>
          <p className="text-neutral-400 text-sm mb-8">
            Tenemos acceso a catálogos exclusivos de distribuidores nacionales e importamos equipos bajo pedido. Cuéntanos qué necesitas.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola ATOMIC! Busco una laptop/computadora con estas características:")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black text-sm uppercase tracking-wider hover:bg-neutral-100 transition-all shadow-2xl"
          >
            <MessageSquare size={16} />
            Consultar por WhatsApp
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </main>
  );
}
