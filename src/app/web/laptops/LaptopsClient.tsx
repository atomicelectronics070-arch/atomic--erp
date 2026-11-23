"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Laptop, Search, ArrowRight, MessageSquare, Star, Cpu, HardDrive,
  Wifi, Battery, Shield, ChevronLeft, Sparkles, Filter, Check, Copy,
  Package, LayoutGrid, Monitor, Flame, MessageCircle, X, CheckCircle2,
  PhoneCall, Truck, Award, Server
} from "lucide-react";

export const CATEGORIES = [
  "TODO",
  "LAPTOPS",
  "CPUS & DESKTOP",
  "MINI PCS",
  "MACS & APPLE",
  "GAMING & WORKSTATION"
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export const BRANDS = ["TODAS", "DELL", "HP", "ASUS", "LENOVO", "APPLE", "ACER", "MSI"] as const;

const WA_NUMBER = "593969043453";

interface LaptopProduct {
  id: string;
  name: string;
  brand: string;
  specs: string;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  category: CategoryType;
  chip?: string;
  ram?: string;
  storage?: string;
  screen?: string;
}

const FEATURED_COMPUTERS: LaptopProduct[] = [
  {
    id: "dell-7390",
    name: "Dell Latitude 7390 Core i7",
    brand: "DELL",
    specs: "Intel Core i7 Gen 8 · 16GB RAM · 512GB SSD NVMe · 13.3\" Full HD · Windows 11 Pro",
    price: 850,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    badge: "REFURBISHED PREMIUM",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    category: "LAPTOPS",
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
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    badge: "MÁS VENDIDO",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    category: "LAPTOPS",
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
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
    badge: "ESTUDIANTE PRO",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    category: "LAPTOPS",
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
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
    badge: "ALTA DURABILIDAD",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    category: "LAPTOPS",
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
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    badge: "GAMING EXTREMO",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    category: "GAMING & WORKSTATION",
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
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop&q=80",
    badge: "GAMER PRO",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    category: "GAMING & WORKSTATION",
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
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    badge: "WORKSTATION",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    category: "GAMING & WORKSTATION",
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
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
    badge: "ARQUITECTURA & 3D",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    category: "GAMING & WORKSTATION",
    chip: "Intel Core Ultra 9",
    ram: "32 GB DDR5",
    storage: "1 TB SSD NVMe",
    screen: "16\" WQUXGA",
  },
  {
    id: "dell-optiplex-desktop",
    name: "Dell OptiPlex Pro Desktop Core i7 Torre",
    brand: "DELL",
    specs: "Intel Core i7-13700 · 16GB DDR5 · 512GB SSD NVMe · Windows 11 Pro · Puertos HDMI/DP",
    price: 940,
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=80",
    badge: "CPU CORPORATIVO",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    category: "CPUS & DESKTOP",
    chip: "Intel Core i7-13700",
    ram: "16 GB DDR5",
    storage: "512 GB SSD NVMe",
    screen: "Torre / SFF",
  },
  {
    id: "imac-24-m4",
    name: "Apple iMac 24\" All-in-One M4 Retina 4.5K",
    brand: "APPLE",
    specs: "Apple Silicon M4 · 16GB RAM Unificada · 256GB SSD · Pantalla Retina 4.5K 24\" · macOS Sequoia",
    price: 1480,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    badge: "APPLE OFICIAL",
    badgeColor: "bg-zinc-100 text-zinc-900 border-zinc-300",
    category: "MACS & APPLE",
    chip: "Apple Silicon M4",
    ram: "16 GB Unificada",
    storage: "256 GB SSD",
    screen: "24\" 4.5K Retina",
  },
  {
    id: "msi-cubi-mini",
    name: "MSI Cubi 5 NUC Mini PC Intel Core i5",
    brand: "MSI",
    specs: "Intel Core i5-12th · 16GB RAM · 512GB SSD M.2 · Wi-Fi 6E + BT · Doble salida HDMI/DP · Win11",
    price: 640,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    badge: "ULTRA COMPACTO",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    category: "MINI PCS",
    chip: "Intel Core i5 12th",
    ram: "16 GB DDR4",
    storage: "512 GB SSD",
    screen: "Mini PC / NUC",
  },
  {
    id: "macbook-air-m3",
    name: "Apple MacBook Air 13.6\" M3 Liquid Retina",
    brand: "APPLE",
    specs: "Apple Silicon M3 · 16GB RAM · 512GB SSD · Liquid Retina 13.6\" · Hasta 18h Batería · macOS",
    price: 1290,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    badge: "APPLE SILICON",
    badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
    category: "MACS & APPLE",
    chip: "Apple Silicon M3",
    ram: "16 GB Unificada",
    storage: "512 GB SSD",
    screen: "13.6\" Liquid Retina",
  }
];

// Disqualifiers: Exclude phones, tablets, parts, cables, and unrelated electronics
const DISQUALIFY_KEYWORDS = [
  // Phones / Celulares
  "celular", "telefono", "teléfono", "smartphone", "iphone", "xiaomi", "redmi", "poco ",
  "infinix", "tecno spark", "motorola", "galaxy a", "galaxy s", "galaxy z", "honor x",
  "honor magic", "realme", "oppo", "zte ",
  // Tablets / iPads
  "tablet", "ipad", "kindle",
  // Parts & Repuestos
  "bateria para", "batería para", "pantalla laptop", "teclado para", "ventilador laptop",
  "cargador para", "bisagra", "flex de video", "ventilador hp", "ventilador toshiba",
  "ventilador dell", "repuesto", "repuestos", "display para", "pantalla all in one",
  "bateria lenovo", "batería l12m", "fuente de poder", "motherboard", "mbo ", "tarjeta madre",
  "placa madre", "tarjeta de video", "memoria ram", "disco duro", "ssd kingston",
  "disco solido", "pasta termica", "lector memoria", "dvd writer", "case ", "chasis ",
  "cooler ", "solid state drive",
  // Peripherals & Accessories
  "soporte de laptop", "soporte para laptop", "soporte giratorio", "funda para", "estuche para",
  "candado para", "mochila para", "cooler pad", "base refrigerante", "parlantes", "parlante",
  "tarjeta buscador", "mouse pad", "destornillador", "soldadora", "motorreductor", "modulo",
  "fotorresistencia", "cable tipo c", "cargador de celular", "banco de carga", "cargador portatil",
  "cargador portátil", "power bank", "wallbox", "tacometro", "tacómetro", "generador",
  "headphones", "auricular", "sennheiser", "inversor solar", "pos system",
  // Non-computer electronics
  "monitor", "pantalla/3nstar", "camara", "cámara", "videoportero", "reloj", "smartwatch",
  "audifono", "audífono", "calefactor", "impresora", "proyector", "balanza"
];

// Strict Computer Allowlist
const ALLOWED_COMPUTER_KEYWORDS = [
  "laptop", "notebook", "macbook", "thinkpad", "ideapad", "latitude", "inspiron",
  "probook", "elitebook", "vivobook", "zenbook", "rog strix", "legion", "predator",
  "nitro 5", "nitro v", "victus", "omen", "zbook", "precision 7", "precision 5", "precision 3",
  "asus rog strix g", "asus tuf gaming f", "asus tuf gaming a",
  "computador de escritorio", "computadora de escritorio", "computador desktop",
  "cpu desktop", "cpu de escritorio", "desktop computer", "all-in-one", "all in one",
  "aio ", "aio-", "optiplex", "prodesk", "elitedesk", "thinkcentre", "imac",
  "blackelite torre", "silverelite torre", "blackluxe torre", "torre gamer", "pc gamer",
  "xtratech xt", "infinytek amd", "mini pc", "minipc", "mac mini", "msi cubi", "cubi 5",
  "mac studio", "mac pro", "hp elite 805", "msi thin"
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

// Resilient Product Image Component with Timeout & Zero Infinite Spin
function SafeProductImage({
  src,
  alt,
  brand,
  category
}: {
  src?: string;
  alt: string;
  brand?: string;
  category?: CategoryType;
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Blacklist dead or hanging hosts
  const isBlacklisted = useMemo(() => {
    if (!src) return true;
    const lower = src.toLowerCase();
    if (lower.includes("multitecnologiavyv.com")) return true;
    if (lower.includes("coretms.tecnomegastore.ec/assets/images/main/24/com")) return true;
    return false;
  }, [src]);

  useEffect(() => {
    if (isBlacklisted || !src) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    // Hard timeout: 1.8s max. If server hangs, immediately switch to clean fallback
    const timer = setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [src, isBlacklisted]);

  const renderFallback = () => {
    const isMac = category === "MACS & APPLE" || brand === "APPLE";
    const isDesktop = category === "CPUS & DESKTOP";
    const isMini = category === "MINI PCS";
    const isGaming = category === "GAMING & WORKSTATION";

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-100 text-slate-400 p-5 text-center select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.06]" />

        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-blue-600 mb-2.5 group-hover:scale-110 group-hover:shadow-blue-500/10 transition-all duration-300">
          {isGaming ? (
            <Flame size={28} className="text-red-500" />
          ) : isMini ? (
            <Cpu size={28} className="text-indigo-600" />
          ) : isDesktop ? (
            <Monitor size={28} className="text-blue-600" />
          ) : (
            <Laptop size={28} className="text-blue-600" />
          )}
        </div>

        <div className="relative z-10 flex items-center gap-1.5 mb-1">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-slate-900 text-white shadow-xs">
            {brand || "ATOMIC"}
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">
            {isGaming
              ? "GAMING / WORKSTATION"
              : isMini
              ? "MINI PC & NUC"
              : isDesktop
              ? "DESKTOP / AIO"
              : isMac
              ? "APPLE SILICON"
              : "LAPTOP PROFESIONAL"}
          </span>
        </div>

        <span className="relative z-10 text-[10px] text-slate-500 font-sans line-clamp-1 max-w-[200px] font-medium">
          {alt}
        </span>
      </div>
    );
  };

  if (isBlacklisted || error || !src) {
    return renderFallback();
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/70 z-10 backdrop-blur-xs">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) {
            setError(true);
          }
          setLoading(false);
        }}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        className={`w-full h-full object-contain p-2 group-hover:scale-105 transition-all duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}

export default function LaptopsClient() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("TODO");
  const [activeBrand, setActiveBrand] = useState<string>("TODAS");
  const [visibleCount, setVisibleCount] = useState(24);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Fetch dynamic products from database with strict computer filtering
  useEffect(() => {
    const fetchComputers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/web/products?pageSize=2000").then(r => r.json());
        const raw = res.products || [];

        // Apply strict filter: ONLY Computers, CPUs, Mini PCs and Macs (ZERO phones / parts)
        const filteredFromDb = raw.filter((p: any) => {
          const name = (p.name || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const cat = (p.category?.name || "").toLowerCase();

          // Disqualify any phone, tablet, component or accessory
          const isDisqualified = DISQUALIFY_KEYWORDS.some(k => name.includes(k) || cat.includes(k));
          if (isDisqualified) return false;

          // Must match an allowed computer keyword
          const isComputer = ALLOWED_COMPUTER_KEYWORDS.some(k => name.includes(k));
          if (!isComputer) return false;

          // Price sanity check for complete systems
          if (Number(p.price || 0) < 100) return false;

          return true;
        });

        setDbProducts(filteredFromDb);
      } catch (err) {
        console.error("Error fetching db computers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComputers();
  }, []);

  // Combine featured catalog and DB products
  const allProducts = useMemo(() => {
    const fromFeatured = FEATURED_COMPUTERS.map(p => ({
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

      // Brand assignment
      let brand = "ATOMIC";
      if (nameLower.includes("dell")) brand = "DELL";
      else if (
        nameLower.includes("hp ") ||
        nameLower.includes("hp-") ||
        nameLower.startsWith("hp") ||
        nameLower.includes("probook") ||
        nameLower.includes("elitebook") ||
        nameLower.includes("zbook") ||
        nameLower.includes("prodesk") ||
        nameLower.includes("elitedesk") ||
        nameLower.includes("omnistudio") ||
        nameLower.includes("proone")
      ) brand = "HP";
      else if (nameLower.includes("asus") || nameLower.includes("rog") || nameLower.includes("zenbook") || nameLower.includes("vivobook")) brand = "ASUS";
      else if (nameLower.includes("lenovo") || nameLower.includes("thinkpad") || nameLower.includes("ideapad") || nameLower.includes("thinkcentre")) brand = "LENOVO";
      else if (nameLower.includes("apple") || nameLower.includes("macbook") || nameLower.includes("imac") || nameLower.includes("mac mini")) brand = "APPLE";
      else if (nameLower.includes("acer") || nameLower.includes("aspire") || nameLower.includes("nitro")) brand = "ACER";
      else if (nameLower.includes("msi") || nameLower.includes("cubi")) brand = "MSI";
      else if (nameLower.includes("xtratech")) brand = "XTRATECH";
      else if (nameLower.includes("advance")) brand = "ADVANCE";

      // Category assignment
      let cat: CategoryType = "LAPTOPS";
      if (
        nameLower.includes("macbook") ||
        nameLower.includes("imac") ||
        nameLower.includes("mac mini") ||
        nameLower.includes("mac studio") ||
        nameLower.includes("apple")
      ) {
        cat = "MACS & APPLE";
      } else if (
        nameLower.includes("mini pc") ||
        nameLower.includes("minipc") ||
        nameLower.includes("cubi") ||
        nameLower.includes("nuc") ||
        nameLower.includes("micro sff")
      ) {
        cat = "MINI PCS";
      } else if (
        nameLower.includes("gaming") ||
        nameLower.includes("rtx") ||
        nameLower.includes("rog") ||
        nameLower.includes("legion") ||
        nameLower.includes("predator") ||
        nameLower.includes("workstation") ||
        nameLower.includes("zbook") ||
        nameLower.includes("precision") ||
        nameLower.includes("omen")
      ) {
        cat = "GAMING & WORKSTATION";
      } else if (
        nameLower.includes("desktop") ||
        nameLower.includes("all-in-one") ||
        nameLower.includes("all in one") ||
        nameLower.includes("aio") ||
        nameLower.includes("optiplex") ||
        nameLower.includes("torre") ||
        nameLower.includes("computador de escritorio") ||
        nameLower.includes("cpu desktop") ||
        nameLower.includes("cpu de escritorio") ||
        nameLower.includes("computador desktop") ||
        nameLower.includes("prodesk") ||
        nameLower.includes("elitedesk")
      ) {
        cat = "CPUS & DESKTOP";
      } else {
        cat = "LAPTOPS";
      }

      return {
        id: p.id,
        name: p.name,
        brand,
        specs: p.description?.replace(/<[^>]*>/g, '').substring(0, 120) || "Garantía oficial y soporte técnico directo en Ecuador",
        price: Number(p.price || 0),
        image: img,
        badge: cat === "GAMING & WORKSTATION" ? "ALTO RENDIMIENTO" : cat === "CPUS & DESKTOP" ? "SOBREMESA" : cat === "MINI PCS" ? "NUC / MINI" : "DISPONIBLE",
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
      
      {/* ── BACKGROUND BLUR GLOWS ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[160px]" />
      </div>

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="relative z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.06] text-slate-700 text-xs font-mono py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="text-blue-600">⚡</span>
        <span className="font-bold text-slate-900">LÍNEA OFICIAL DE COMPUTACIÓN & LAPTOPS // ATOMIC ECUADOR</span>
        <span className="hidden md:inline text-slate-500">• Laptops, CPUs de Escritorio, Mini PCs, Macs y Workstations con 1 Año de Garantía</span>
      </div>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Laptop size={20} />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 uppercase font-mono">
                ATOMIC <span className="text-blue-600">COMPUTACIÓN</span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono">Laptops, CPUs & Macs</p>
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

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-white/70 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
                <Sparkles size={14} className="text-blue-600" />
                <span>Portátiles Profesionales, CPUs & Ecosistema Mac</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 font-mono leading-tight">
                LÍNEA DE COMPUTACIÓN<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                  & LAPTOPS ATOMIC
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                Catálogo especializado de <strong>Laptops, CPUs de escritorio, Torres Gamer, Mini PCs y Macs</strong> con procesadores Intel Core Ultra, Core i5/i7/i9, AMD Ryzen y Apple Silicon. 100% computadoras verificadas, sin celulares ni repuestos.
              </p>

              {/* Value Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { t: "100% Computadoras", d: "Cero celulares o repuestos" },
                  { t: "Windows 11 / macOS", d: "Sistemas operativos listos" },
                  { t: "SSD NVMe M.2", d: "Arranque ultra veloz" },
                  { t: "Envíos 24 Horas", d: "A las 24 Provincias" }
                ].map((b, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-xs text-left">
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
                    alt="Línea de Laptops & Computadoras ATOMIC"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-mono font-bold text-white">
                    ⚡ Catálogo Oficial ATOMIC Computación
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FILTERS & CATEGORIES (STICKY WHITE BLUR) ── */}
      <section className="sticky top-16 z-40 bg-white/85 backdrop-blur-2xl border-b border-black/[0.06] py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(24); }}
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
              onChange={(e) => { setActiveBrand(e.target.value); setVisibleCount(24); }}
              className="px-3 py-2 rounded-xl bg-white border border-black/[0.08] text-xs font-mono font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
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
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(24); }}
                placeholder="Buscar Core i7, Ryzen, 16GB, RTX..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-black/[0.08] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-xs"
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
              Equipos Disponibles ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Solo computadoras, CPUs de escritorio, Mini PCs y Macs • Mostrando {Math.min(visibleProducts.length, filteredProducts.length)} de {filteredProducts.length} equipos
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
              className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs uppercase font-mono shadow-md cursor-pointer"
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
                  <SafeProductImage
                    src={prod.image}
                    alt={prod.name}
                    brand={prod.brand}
                    category={prod.category}
                  />

                  {/* Brand / Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-slate-950 text-white shadow-xs">
                      {prod.brand}
                    </span>
                    {prod.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono border ${prod.badgeColor || 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 z-20 bg-blue-600 text-white font-mono font-black text-sm px-3 py-1 rounded-xl shadow-md shadow-blue-600/20">
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
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-black/[0.08] shadow-xs">
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
        <p>© 2026 ATOMIC INDUSTRIES — Distribución de Computadoras, Laptops, CPUs & Macs en Ecuador.</p>
        <p className="text-[11px] text-slate-400">Marcas oficiales: Dell, HP, ASUS, Lenovo, Acer, Apple y MSI con 1 Año de Garantía y soporte directo.</p>
      </footer>

    </main>
  );
}
