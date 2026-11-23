"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search, ChevronLeft, ChevronRight, ShoppingBag, Cpu, Battery, Power,
  Settings, Monitor, Cable, Zap, ShieldCheck, Wrench, HardDrive, LayoutGrid,
  Filter, CheckCircle2, MessageCircle, ArrowRight, Sparkles, Check, Copy,
  Package, X, PhoneCall, Image as ImageIcon
} from "lucide-react";

const WHATSAPP_NUMBER = "593969043453";

export const CATEGORIES = [
  { id: "todos", label: "Todos los Repuestos", icon: LayoutGrid },
  { id: "baterias", label: "Baterías de Laptop", icon: Battery },
  { id: "cargadores", label: "Cargadores Originales", icon: Zap },
  { id: "ram", label: "Memorias RAM", icon: HardDrive },
  { id: "fuentes", label: "Fuentes de Poder", icon: Power },
  { id: "cases", label: "Cases & Gabinetes", icon: LayoutGrid },
  { id: "cpus", label: "Procesadores (CPUs)", icon: Cpu },
  { id: "pantallas", label: "Pantallas & Teclados", icon: Monitor },
  { id: "almacenamiento", label: "Discos SSD & M.2", icon: HardDrive },
  { id: "motherboards", label: "Tarjetas Madre", icon: Settings }
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

// Strict Disqualifier: Exclude complete laptops, complete phones, tablets, TVs and non-computer hardware
const DISQUALIFY_KEYWORDS = [
  // Phones & Tablets
  "celular", "telefono", "teléfono", "smartphone", "iphone", "xiaomi", "redmi", "poco ",
  "infinix", "tecno spark", "motorola", "galaxy a", "galaxy s", "galaxy z", "honor x",
  "honor magic", "realme", "oppo", "zte ", "tablet", "ipad", "kindle",
  // Complete Laptops & Computers
  "laptop dell", "laptop hp", "laptop asus", "laptop lenovo", "laptop acer", "laptop msi",
  "macbook", "notebook asus", "notebook hp", "notebook dell", "notebook lenovo",
  "asus rog strix g", "dell latitude 7", "dell latitude 5", "dell latitude 3",
  "dell inspiron 1", "dell inspiron 5", "dell inspiron 3", "hp probook", "hp elitebook",
  "hp victus", "hp pavilion", "lenovo ideapad", "lenovo thinkpad", "acer aspire", "acer nitro",
  "msi thin", "zenbook", "vivobook", "all-in-one", "all in one", "aio ", "optiplex",
  "computador de escritorio", "computadora de escritorio", "cpu desktop", "cpu de escritorio",
  "computador desktop", "torre gamer", "pc gamer", "imac", "mac mini", "mini pc", "minipc",
  "cubi 5", "blackelite", "silverelite", "blackluxe", "xtratech xt", "infinytek",
  // Non-computer / Household items
  "foco led", "tubo led", "dicroico", "cinta led", "sifón", "sifon", "flexómetro", "flexometro",
  "freno blanco", "ojos devil", "neewer", "cargador de batería auto", "camara", "cámara",
  "videoportero", "reloj", "smartwatch", "generador", "calefactor", "soldadora", "motorreductor",
  "inversor solar", "pos system", "speaker", "parlante", "audifono", "audífono", "auricular",
  "pulverizador", "tacometro", "tacómetro", "balanza", "caja de audio", "teclado led cableado de 10 zonas"
];

// Specific part keywords for categorization
const CATEGORY_MAP: Record<Exclude<CategoryId, "todos">, string[]> = {
  baterias: [
    "bateria para dell", "bateria para hp", "bateria para asus", "bateria para lenovo",
    "bateria para acer", "bateria para toshiba", "bateria para macbook", "bateria para allienware",
    "batería para dell", "batería para hp", "batería para asus", "batería para lenovo",
    "batería para acer", "batería para toshiba", "bateria lenovo", "batería lenovo",
    "bateria dell", "bateria hp", "bateria acer", "bateria asus"
  ],
  cargadores: [
    "cargador para dell", "cargador para hp", "cargador para asus", "cargador para lenovo",
    "cargador para acer", "cargador para toshiba", "cargador para macbook", "cargador para laptop",
    "cargador laptop", "adaptador para dell", "adaptador para hp", "cargador tipo c 65w",
    "cargador 65w", "cargador 45w", "cargador 90w", "cargador 135w"
  ],
  ram: [
    "so-dimm", "sodimm", "dimm ddr", "memoria ram", "ram ddr4", "ram ddr5", "ram ddr3",
    "memoria para laptop", "memoria para pc", "adata 16gb pc-3200", "kingston fury"
  ],
  fuentes: [
    "power supply", "fuente de poder", "fuente cert", "fuente 80 plus", "fuente real", "fuente atx", "fuente asus tuf gaming"
  ],
  cases: [
    "case gamer", "case atx", "gabinete atx", "gabinete gamer", "chasis gamer", "case micro atx",
    "case corsair", "case cooler master", "case antec", "case xtech"
  ],
  cpus: [
    "procesador intel", "procesador amd", "cpu amd ryzen", "cpu intel core",
    "core i3-", "core i5-", "core i7-", "core i9-", "ryzen 5 ", "ryzen 7 ", "ryzen 9 ", "ryzen 3 ",
    "intel core i5-1", "intel core i7-1", "amd ryzen 5 5", "amd ryzen 7 5"
  ],
  pantallas: [
    "pantalla laptop", "pantalla led fhd 1920", "pantalla led hd 1366", "pantalla para dell",
    "pantalla para hp", "teclado para dell", "teclado para hp", "teclado para asus",
    "teclado para lenovo", "teclado para acer", "ventilador laptop", "cooler laptop",
    "fan para dell", "fan para hp", "flex de video", "bisagra laptop"
  ],
  almacenamiento: [
    "solid state drive", "disco solido", "disco sólido", "m.2 nvme", "ssd kingston",
    "ssd western digital", "disco duro interno", "disco duro para pc", "disco duro para laptop",
    "ssd adata", "ssd crucial"
  ],
  motherboards: [
    "motherboard", "mbo asus", "mbo msi", "mbo gigabyte", "tarjeta madre", "placa madre"
  ]
};

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

// Safe Repuesto Image Component with Timeout & Zero Infinite Spin
function SafeRepuestoImage({
  src,
  alt,
  categoryId
}: {
  src?: string;
  alt: string;
  categoryId?: string;
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

  const getCategoryDetails = () => {
    switch (categoryId) {
      case "baterias":
        return { icon: <Battery size={26} className="text-amber-500" />, label: "BATERÍA CERTIFICADA" };
      case "cargadores":
        return { icon: <Zap size={26} className="text-blue-500" />, label: "CARGADOR ORIGINAL" };
      case "ram":
        return { icon: <HardDrive size={26} className="text-indigo-500" />, label: "MEMORIA RAM" };
      case "fuentes":
        return { icon: <Power size={26} className="text-emerald-500" />, label: "FUENTE 80 PLUS" };
      case "cases":
        return { icon: <LayoutGrid size={26} className="text-cyan-500" />, label: "GABINETE / CASE" };
      case "cpus":
        return { icon: <Cpu size={26} className="text-purple-500" />, label: "PROCESADOR" };
      case "pantallas":
        return { icon: <Monitor size={26} className="text-sky-500" />, label: "PANTALLA / TECLADO" };
      case "almacenamiento":
        return { icon: <HardDrive size={26} className="text-teal-500" />, label: "DISCO SSD / M.2" };
      case "motherboards":
        return { icon: <Settings size={26} className="text-violet-500" />, label: "TARJETA MADRE" };
      default:
        return { icon: <Cpu size={26} className="text-blue-500" />, label: "REPUESTO ORIGINAL" };
    }
  };

  const renderFallback = () => {
    const details = getCategoryDetails();

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-100 text-slate-400 p-4 text-center select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.06]" />

        <div className="relative z-10 w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center justify-center mb-2 group-hover:scale-110 group-hover:shadow-blue-500/10 transition-all duration-300">
          {details.icon}
        </div>

        <span className="relative z-10 px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-slate-900 text-white mb-1 shadow-xs">
          {details.label}
        </span>

        <span className="relative z-10 text-[10px] text-slate-600 font-sans line-clamp-1 max-w-[170px] font-medium">
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

export default function RepuestosLandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("todos");
  const [onlyWithImage, setOnlyWithImage] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Fetch products from database and apply strict clean repuestos filter
  useEffect(() => {
    const fetchRepuestos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/web/products?pageSize=2000").then(r => r.json());
        const raw = res.products || [];

        // STRICT FILTER: ONLY genuine parts, cases, power supplies, RAM, CPUs, screens. ZERO phones, ZERO complete laptops.
        const cleanList: any[] = [];

        raw.forEach((p: any) => {
          const nameLower = (p.name || "").toLowerCase();
          const catLower = (p.category?.name || "").toLowerCase();

          // 1. Disqualify phones, tablets, complete laptops, complete desktops
          const isDisqualified = DISQUALIFY_KEYWORDS.some(k => nameLower.includes(k) || catLower.includes(k));
          if (isDisqualified) return;

          // 2. Extra guard: reject any phone or complete laptop
          if (
            nameLower.includes("celular") ||
            nameLower.includes("telefono") ||
            nameLower.includes("smartphone") ||
            nameLower.includes("iphone") ||
            nameLower.includes("xiaomi")
          ) return;

          if (
            nameLower.includes("laptop") &&
            !nameLower.includes("para laptop") &&
            !nameLower.includes("repuesto") &&
            !nameLower.includes("pantalla") &&
            !nameLower.includes("teclado") &&
            !nameLower.includes("bateria") &&
            !nameLower.includes("cargador") &&
            !nameLower.includes("ventilador") &&
            !nameLower.includes("cooler") &&
            !nameLower.includes("flex") &&
            !nameLower.includes("bisagra")
          ) return;

          // 3. Classify into verified category
          let assignedCategory: CategoryId | null = null;
          for (const [catKey, patterns] of Object.entries(CATEGORY_MAP)) {
            if (patterns.some(pat => nameLower.includes(pat))) {
              assignedCategory = catKey as CategoryId;
              break;
            }
          }

          if (!assignedCategory) {
            if (catLower.includes("repuestos de laptop") || catLower.includes("repuestos laptops")) {
              if (nameLower.includes("bateria") || nameLower.includes("batería")) assignedCategory = "baterias";
              else if (nameLower.includes("cargador") || nameLower.includes("adaptador")) assignedCategory = "cargadores";
              else if (nameLower.includes("teclado") || nameLower.includes("pantalla") || nameLower.includes("ventilador")) assignedCategory = "pantallas";
              else assignedCategory = "pantallas";
            } else if (catLower.includes("fuentes de poder")) {
              assignedCategory = "fuentes";
            } else if (catLower.includes("cases")) {
              assignedCategory = "cases";
            } else if (catLower.includes("memorias ram")) {
              assignedCategory = "ram";
            } else if (catLower.includes("motherboards")) {
              assignedCategory = "motherboards";
            } else if (catLower.includes("procesadores")) {
              assignedCategory = "cpus";
            } else if (catLower.includes("discos duros")) {
              assignedCategory = "almacenamiento";
            }
          }

          if (!assignedCategory) return;

          // Image sanity check
          const parsedImages = safeParseArray(p.images, []);
          const firstImg = parsedImages.length > 0 ? parsedImages[0] : "";
          const hasWorkingImg = Boolean(
            firstImg &&
            firstImg.startsWith("http") &&
            !firstImg.includes("multitecnologiavyv.com")
          );

          cleanList.push({
            ...p,
            repuestoCategory: assignedCategory,
            mainImage: firstImg,
            hasWorkingImg
          });
        });

        setProducts(cleanList);
      } catch (err) {
        console.error("Error cargando productos de repuestos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepuestos();
  }, []);

  // Filter products by category, search query, and image toggle
  const filteredProducts = useMemo(() => {
    let list = products;

    // Filter by active category
    if (activeCategory !== "todos") {
      list = list.filter(p => p.repuestoCategory === activeCategory);
    }

    // Filter by image toggle
    if (onlyWithImage) {
      list = list.filter(p => p.hasWorkingImg);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => {
        const target = `${p.name || ''} ${p.sku || ''} ${p.provider || ''}`.toLowerCase();
        return target.includes(q);
      });
    }

    // Sort: items with verified working images appear first for optimal visual appeal
    return [...list].sort((a, b) => {
      if (a.hasWorkingImg === b.hasWorkingImg) return 0;
      return a.hasWorkingImg ? -1 : 1;
    });
  }, [products, activeCategory, onlyWithImage, search]);

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
• *Categoría:* ${product.repuestoCategory?.toUpperCase() || 'REPUESTO'}
• *Proveedor / Marca:* ${product.provider || 'ATOMIC Oficial'}

¿Tienen compatibilidad inmediata y stock para entrega o envío?`;
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
      
      {/* ── BACKGROUND BLUR GLOWS ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[160px]" />
      </div>

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="relative z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.06] text-slate-700 text-xs font-mono py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="text-blue-600">⚡</span>
        <span className="font-bold text-slate-900">LÍNEA DE REPUESTOS & HARDWARE PARA COMPUTADORAS // ATOMIC PARTS</span>
        <span className="hidden md:inline text-slate-500">• Baterías, Cargadores, RAM, Fuentes 80 Plus, Cases, CPUs y Pantallas con Despacho Inmediato</span>
      </div>

      {/* ── HEADER NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cpu size={20} />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 uppercase font-mono">
                ATOMIC <span className="text-blue-600">REPUESTOS</span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono">Hardware, Partes & Componentes</p>
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
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola ATOMIC, necesito consultar la compatibilidad de un repuesto específico para mi laptop/computadora.")}`}
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

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-white/70 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
                <Sparkles size={14} className="text-blue-600" />
                <span>100% Repuestos de Computación // Cero Celulares o Laptops Completas</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 font-mono leading-tight">
                LÍNEA DE REPUESTOS PARA<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                  LAPTOPS & COMPUTADORAS
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                Catálogo especializado de componentes y partes para servicio técnico y ensamble: <strong>Cases Gamer, Fuentes de Poder 80 Plus, Memorias RAM DDR4/DDR5, Baterías de Laptop, Cargadores Originales, Procesadores Intel/Ryzen, Pantallas LED y Teclados</strong> con despacho inmediato a todo el Ecuador.
              </p>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { t: "100% Repuestos", d: "Cero celulares o equipos enteros" },
                  { t: "Garantía Escrita", d: "Soporte técnico directo" },
                  { t: "Stock Inmediato", d: "Despacho en 24 horas" },
                  { t: "Compatibilidad", d: "HP, Dell, Asus, Lenovo, Acer" }
                ].map((badge, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-xs text-left">
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
                    ⚡ Catálogo Oficial ATOMIC Hardware & Repuestos
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CATEGORY TABS & SEARCH ── */}
      <section className="sticky top-16 z-40 bg-white/85 backdrop-blur-2xl border-b border-black/[0.06] py-3.5 shadow-xs">
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

          {/* Photo Toggle & Search Input */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            
            {/* Filter Toggle: Solo con foto */}
            <button
              onClick={() => { setOnlyWithImage(!onlyWithImage); setVisibleCount(24); }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
                onlyWithImage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-black/[0.08] hover:bg-slate-100"
              }`}
              title="Filtrar repuestos que poseen fotografía de distribuidor"
            >
              <ImageIcon size={13} />
              <span className="hidden sm:inline">Solo con foto</span>
            </button>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(24); }}
                placeholder="Buscar SKU, DDR4, 65W, Dell..."
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
              Repuestos & Componentes Disponibles ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Solo repuestos de laptop, fuentes, cases, RAM, CPUs y pantallas • Mostrando {Math.min(visibleProducts.length, filteredProducts.length)} de {filteredProducts.length} artículos
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-xs">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-mono text-slate-500">Cargando catálogo de repuestos verificado...</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="p-16 text-center bg-white/90 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-xl">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 font-mono">No se encontraron repuestos con estos criterios</h3>
            <p className="text-xs text-slate-500 mt-1">Prueba seleccionando otra categoría o borrando el término de búsqueda.</p>
            <button
              onClick={() => { setActiveCategory("todos"); setOnlyWithImage(false); setSearch(""); }}
              className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs uppercase font-mono shadow-md cursor-pointer"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((p) => {
              const price = Number(p.price || 0);

              return (
                <div
                  key={p.id}
                  className="rounded-3xl bg-white/90 backdrop-blur-xl border border-black/[0.06] hover:border-blue-500/40 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:scale-[1.01]"
                >
                  {/* Visual Image Header */}
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100/60 overflow-hidden border-b border-black/[0.04] p-4 flex items-center justify-center">
                    <SafeRepuestoImage
                      src={p.mainImage}
                      alt={p.name}
                      categoryId={p.repuestoCategory}
                    />

                    {/* SKU Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-slate-950 text-white shadow-xs">
                        {p.sku ? `SKU: ${p.sku}` : "REPUESTO"}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 z-20 bg-blue-600 text-white font-mono font-black text-sm px-3 py-1 rounded-xl shadow-md shadow-blue-600/20">
                      ${price.toFixed(2)} <span className="text-[9px] font-normal">+IVA</span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block truncate">
                        {p.repuestoCategory?.toUpperCase() || "REPUESTO"} · {p.provider || "ATOMIC Oficial"}
                      </span>

                      <h3 className="text-sm font-black text-slate-900 uppercase font-mono mt-1 leading-snug line-clamp-2">
                        {p.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-2 font-sans line-clamp-2 leading-relaxed">
                        {p.description ? p.description.replace(/<[^>]*>/g, '').substring(0, 110) : "Repuesto 100% compatible y garantizado para ensamble y servicio técnico en Ecuador."}
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
                        title="Copiar detalles del repuesto"
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
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-black/[0.08] shadow-xs">
              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Cargando más repuestos y componentes...</span>
            </div>
          ) : (
            filteredProducts.length > 0 && (
              <p className="text-xs font-mono text-slate-400 bg-white/60 px-4 py-2 rounded-full border border-black/[0.04]">
                ✓ Has llegado al final del catálogo de repuestos ({filteredProducts.length} artículos)
              </p>
            )
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/[0.06] bg-white/80 backdrop-blur-xl py-12 px-6 text-center text-xs text-slate-500 font-mono space-y-2 relative z-10">
        <p>© 2026 ATOMIC INDUSTRIES — Distribución de Repuestos & Componentes para Computadoras en Ecuador.</p>
        <p className="text-[11px] text-slate-400">Baterías, cargadores, memorias RAM, fuentes 80 Plus, cases, procesadores y pantallas con garantía oficial y asesoría técnica.</p>
      </footer>

    </div>
  );
}
