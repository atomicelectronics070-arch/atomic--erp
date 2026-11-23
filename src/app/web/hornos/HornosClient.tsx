'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

/* ─────────────────────────── helpers ─────────────────────────── */

function parseImages(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extrae dimensiones del horno desde la descripción o nombre */
function extractDimensions(desc: string | null, name: string): string {
  const text = `${name} ${desc ? stripHtml(desc) : ''}`;
  const match3 = text.match(/(\d{2,4})\s*[xX×]\s*(\d{2,4})\s*[xX×]\s*(\d{2,4})\s*(mm|cm)?/i);
  if (match3) {
    const unit = match3[4] ? match3[4].toLowerCase() : 'mm';
    return `${match3[1]} × ${match3[2]} × ${match3[3]} ${unit}`;
  }
  const match2 = text.match(/(\d{2,3})\s*[xX×]\s*(\d{2,3})\s*(cm|mm)?/i);
  if (match2) {
    const unit = match2[3] ? match2[3].toLowerCase() : 'cm';
    return `${match2[1]} × ${match2[2]} ${unit}`;
  }
  if (name.toLowerCase().includes('60')) return '60 × 60 cm (Nicho Universal)';
  return '60 × 60 cm Estándar';
}

/** Extrae capacidad del horno en litros */
function extractCapacity(desc: string | null, name: string): string {
  const text = `${name} ${desc ? stripHtml(desc) : ''}`.toLowerCase();
  const match = text.match(/(\d{2,3})\s*(?:litros?|lts?|l\b)/i);
  if (match) return `${match[1]} Litros`;
  if (text.includes('80')) return '80 Litros';
  if (text.includes('30')) return '30 Litros';
  if (text.includes('15')) return '15 Litros';
  return 'Capacidad Estándar';
}

/** Clasifica el tipo de horno */
function getHornoType(name: string): 'gas' | 'electrico' | 'microondas' | 'freidora' {
  const n = name.toLowerCase();
  if (n.includes('microondas')) return 'microondas';
  if (n.includes('freidora') || n.includes('airfryer')) return 'freidora';
  if (n.includes('gas')) return 'gas';
  return 'electrico';
}

function getFuelDetails(type: 'gas' | 'electrico' | 'microondas' | 'freidora') {
  switch (type) {
    case 'gas':
      return {
        label: 'A Gas (GLP / Natural)',
        badge: '🔥 A Gas de Empotrar',
        icon: '🔥',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        benefit: 'Calor envolvente y dorados perfectos a gas'
      };
    case 'electrico':
      return {
        label: 'Eléctrico Convección 220V',
        badge: '⚡ Eléctrico Convección',
        icon: '⚡',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        benefit: 'Turbina de calor 360° para repostería precisa'
      };
    case 'microondas':
      return {
        label: 'Microondas Empotrable + Grill',
        badge: '⏱️ Microondas Empotre',
        icon: '⏱️',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        benefit: 'Ideal para columna de cocina con marco empotrable'
      };
    case 'freidora':
      return {
        label: 'Horno Freidora de Aire Digital',
        badge: '🍟 Horno AirFryer',
        icon: '🍟',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        benefit: 'Horneado y dorados sin aceite con temporizador'
      };
  }
}

/* ─────────────────────────── types ─────────────────────────── */

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string | null;
  specs: string | null;
  description: string | null;
  category: { name: string } | null;
}

/* ─────────────────────────── product card ─────────────────────────── */

function HornoCard({ p, onQuote }: { p: Product; onQuote: (p: Product) => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = parseImages(p.images);
  const img = imgs[imgIdx] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800';
  const type = getHornoType(p.name);
  const fuel = getFuelDetails(type);
  const dims = extractDimensions(p.description, p.name);
  const capacity = extractCapacity(p.description, p.name);

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square bg-stone-50 flex items-center justify-center overflow-hidden p-4">
        <img
          src={img}
          alt={p.name}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800'; }}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Type badge (Top-Left) */}
        <div className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-lg border backdrop-blur-sm bg-stone-900/90 text-stone-100 border-stone-700`}>
          {fuel.badge}
        </div>

        {/* Stock badge (Top-Right) */}
        <div className="absolute top-3 right-3">
          {p.stock > 0 ? (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50/95 text-emerald-700 border border-emerald-200/80 backdrop-blur-sm flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              En Stock
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-white/95 text-stone-600 border border-stone-200/80 backdrop-blur-sm shadow-sm">
              Bajo Pedido
            </span>
          )}
        </div>

        {/* Image carousel dots */}
        {imgs.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-stone-800 w-3' : 'bg-stone-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        {/* Title */}
        <h3 className="text-xs font-bold text-stone-900 leading-snug line-clamp-2 min-h-[32px] group-hover:text-amber-800 transition-colors">
          {p.name}
        </h3>

        {/* Ficha técnica elegante y legible */}
        <div className="bg-stone-50/90 rounded-xl border border-stone-200/70 p-2.5 space-y-2">
          {/* Capacidad */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1.5">
              <span className="text-stone-400">🔥</span> Capacidad
            </span>
            <span className="font-mono font-bold text-stone-900 text-xs">
              {capacity}
            </span>
          </div>

          {/* Medidas */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1.5">
              <span className="text-stone-400">📐</span> Medidas Nicho
            </span>
            <span className="font-mono font-bold text-stone-900 text-xs">
              {dims}
            </span>
          </div>

          {/* Sistema */}
          <div className="flex items-center justify-between text-xs pt-0.5 border-t border-stone-200/50">
            <span className="text-[11px] font-medium text-stone-500">
              Sistema
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${fuel.bg} ${fuel.text} ${fuel.border}`}>
              {fuel.label}
            </span>
          </div>
        </div>

        {/* Pie del producto: Precio al pie + CTA */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                PVP Contado
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                Garantía 1 Año Oficial
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-stone-900 tracking-tight">
                ${p.price.toFixed(0)}
              </span>
              <span className="text-[11px] font-semibold text-stone-400 ml-1">+IVA</span>
            </div>
          </div>

          <button
            onClick={() => onQuote(p)}
            className="w-full py-2.5 bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <span>Consultar Horno por WhatsApp</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── main component ─────────────────────────── */

export default function HornosClient({ products }: { products: Product[] }) {
  const [fuelFilter, setFuelFilter] = useState<'todos' | 'gas' | 'electrico' | 'microondas' | 'freidora'>('todos');
  const [capacityFilter, setCapacityFilter] = useState<'todos' | 'compacto' | 'estandar' | 'xl'>('todos');
  const [search, setSearch] = useState('');
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const type = getHornoType(p.name);
      if (fuelFilter !== 'todos' && type !== fuelFilter) return false;

      const cap = extractCapacity(p.description, p.name);
      const capNum = parseInt(cap) || 0;

      if (capacityFilter === 'compacto' && (capNum > 35 || capNum === 0)) return false;
      if (capacityFilter === 'estandar' && (capNum < 35 || capNum > 75)) return false;
      if (capacityFilter === 'xl' && capNum < 76) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const text = `${p.name} ${p.description ? stripHtml(p.description) : ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [products, fuelFilter, capacityFilter, search]);

  const hornosGas = products.filter((p) => getHornoType(p.name) === 'gas');
  const hornosElectricos = products.filter((p) => getHornoType(p.name) === 'electrico');
  const microondas = products.filter((p) => getHornoType(p.name) === 'microondas');

  const waBase = 'https://wa.me/593969043453';

  function buildWhatsApp(p: Product) {
    const type = getHornoType(p.name);
    const fuel = getFuelDetails(type);
    const dims = extractDimensions(p.description, p.name);
    const capacity = extractCapacity(p.description, p.name);

    let msg = `Hola ATOMIC! Estoy interesado/a en este horno de empotrar:\n\n` +
      `🔥 *${p.name}*\n` +
      `💰 PVP Contado: $${p.price.toFixed(0)} +IVA\n` +
      `📦 Capacidad: ${capacity}\n` +
      `📐 Medidas de Nicho: ${dims}\n` +
      `⚡ Sistema: ${fuel.label}\n\n` +
      `Deseo confirmar stock, ficha técnica de instalación y coordinar el despacho.`;

    return `${waBase}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="min-h-screen font-sans text-stone-900" style={{ background: 'linear-gradient(135deg, #fdfcfb 0%, #f6f2ee 100%)' }}>

      {/* ═══════════ HEADER NAVEGACIÓN ═══════════ */}
      <nav className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-2.5 text-white group">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              🔥
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white block">ATOMIC <span className="text-amber-400">HORNOS</span></span>
              <span className="text-[10px] text-stone-400 tracking-wider uppercase block">Línea de Empotrar 2026</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/web/cocinas"
              className="text-xs font-semibold text-stone-300 hover:text-white px-3 py-1.5 rounded-lg border border-stone-700 hover:border-stone-500 transition-colors"
            >
              🍳 Ver Encimeras
            </Link>
            <a
              href={`${waBase}?text=${encodeURIComponent('Hola ATOMIC! Deseo asesoría técnica para elegir un horno de empotrar.')}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Asesoría WhatsApp</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section
        className="relative overflow-hidden text-white py-24 px-6"
        style={{
          background: 'linear-gradient(135deg, #1b1713 0%, #2b1f14 50%, #3e2815 100%)',
        }}
      >
        {/* Glows y detalles ambientales */}
        <div
          className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform: 'translate(20%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)', transform: 'translate(-20%, 30%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/30 rounded-full px-5 py-2 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Catálogo Especializado · Hornos de Empotrar & Convección
          </div>

          <h1 className="text-4xl sm:text-7xl font-black mb-5 leading-tight tracking-tight">
            Hornos de Empotrar: <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24 0%, #f97316 100%)' }}>
              Cocción Europea & Alta Capacidad
            </span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Diseñados para empotre en mueble de cocina estándar de 60 cm. Equipados con convección 3D forzada,
            asadores a gas, dorador superior y acabados en cristal templado negro y acero inoxidable.
          </p>

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15 font-semibold text-stone-200">
              🔥 {hornosGas.length} Modelos a Gas
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15 font-semibold text-stone-200">
              ⚡ {hornosElectricos.length} Modelos Eléctricos Convección
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15 font-semibold text-stone-200">
              ⏱️ {microondas.length} Microondas Empotrables
            </div>
            <a
              href="#guia-nicho"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold transition-all shadow-md"
            >
              📐 Ver Medidas de Nicho →
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ STICKY FILTERS BAR ═══════════ */}
      <div className="sticky top-[61px] z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm py-3.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Tipo de Horno */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'todos', label: `✨ Todos (${products.length})` },
              { id: 'electrico', label: `⚡ Convección Eléctrica (${hornosElectricos.length})` },
              { id: 'gas', label: `🔥 A Gas (${hornosGas.length})` },
              { id: 'microondas', label: `⏱️ Microondas Empotre (${microondas.length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFuelFilter(f.id as any)}
                className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                  fuelFilter === f.id
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {f.label}
              </button>
            ))}

            <div className="h-5 w-px bg-stone-200 mx-1 hidden sm:block" />

            {/* Capacidad */}
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value as any)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 focus:outline-none focus:border-amber-600"
            >
              <option value="todos">Todas las Capacidades</option>
              <option value="xl">Gran Capacidad (80 Litros)</option>
              <option value="estandar">Mediana (35 a 75 Litros)</option>
              <option value="compacto">Compactos (15 a 30 Litros)</option>
            </select>
          </div>

          {/* Buscador */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Buscar por modelo, litros o medidas..."
            className="w-full md:w-64 px-4 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ═══════════ CATALOG GRID ═══════════ */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/80">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Modelos de Hornos Disponibles ({filtered.length})
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Equipamiento homologado con entrega inmediata en Quito y envíos asegurados a nivel nacional.
            </p>
          </div>

          <span className="text-xs font-mono font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
            Filtro activo: {fuelFilter.toUpperCase()}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <span className="text-4xl block mb-3">🔥</span>
            <p className="text-xl font-bold text-stone-700 mb-2">No se encontraron hornos con ese filtro</p>
            <p className="text-xs text-stone-400 mb-5">Intenta restablecer los filtros para ver todos los 11 modelos de empotrar.</p>
            <button
              onClick={() => { setFuelFilter('todos'); setCapacityFilter('todos'); setSearch(''); }}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <HornoCard key={p.id} p={p} onQuote={setQuoteProduct} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════ GUÍA DE NICHO & MEDIDAS (60 CM) ═══════════ */}
      <section className="py-16 px-6 bg-white border-t border-stone-200" id="guia-nicho">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-3">
              📐 Asesoría Técnica de Instalación
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Medidas Estándar para Hornos de Empotrar (60 cm)
            </h2>
            <p className="text-stone-500 text-sm max-w-2xl mx-auto mt-2">
              Todos nuestros hornos principales Quantum, Neptune, Astronomy e Infinity siguen la norma internacional de nicho de 60 cm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">🔲</span>
                <h3 className="font-bold text-stone-900 text-sm mb-1">Medidas del Frente Visible</h3>
                <p className="text-xs text-stone-500 mb-4">Lo que queda a la vista al cerrar la puerta del mueble.</p>
                <div className="font-mono font-bold text-amber-700 text-base bg-white p-3 rounded-xl border border-stone-200">
                  59.5 × 59.5 cm
                </div>
              </div>
              <span className="text-[11px] text-stone-400 mt-4 block">Acabado empotrado al ras con el mueble</span>
            </div>

            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">📐</span>
                <h3 className="font-bold text-stone-900 text-sm mb-1">Corte Interno del Nicho</h3>
                <p className="text-xs text-stone-500 mb-4">Espacio exacto que tu carpintero debe dejar en el mueble.</p>
                <div className="font-mono font-bold text-amber-700 text-base bg-white p-3 rounded-xl border border-stone-200">
                  56.0 × 58.0 × 55.0 cm
                </div>
              </div>
              <span className="text-[11px] text-stone-400 mt-4 block">Ancho × Alto × Profundidad libre</span>
            </div>

            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">💨</span>
                <h3 className="font-bold text-stone-900 text-sm mb-1">Ventilación Requerida</h3>
                <p className="text-xs text-stone-500 mb-4">Holgura posterior obligatoria para disipación térmica.</p>
                <div className="font-mono font-bold text-amber-700 text-base bg-white p-3 rounded-xl border border-stone-200">
                  50 mm holgura trasera
                </div>
              </div>
              <span className="text-[11px] text-stone-400 mt-4 block">Salida de aire superior o zócalo inferior</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPARATIVA: GAS VS ELÉCTRICO ═══════════ */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-stone-900 text-center mb-10 tracking-tight">
          ¿Horno a Gas o Horno Eléctrico de Convección?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta Gas */}
          <div className="bg-white rounded-3xl p-8 border border-orange-200/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full translate-x-6 -translate-y-6" />
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔥</span>
              <h3 className="text-lg font-black text-stone-900">Horno a Gas de Empotrar</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              La elección favorita para quienes prefieren la potencia directa del fuego tradicional. Ideal para asados jugosos, carnes y panes rústicos.
            </p>
            <ul className="space-y-2 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Mayor economía en consumo de gas doméstico (GLP / Central).
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Dorador superior y quemador inferior independientes.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Encendido eléctrico incorporado a 110V.
              </li>
            </ul>
          </div>

          {/* Tarjeta Eléctrico */}
          <div className="bg-white rounded-3xl p-8 border border-blue-200/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full translate-x-6 -translate-y-6" />
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚡</span>
              <h3 className="text-lg font-black text-stone-900">Horno Eléctrico Convección</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              El favorito de la repostería y la alta cocina moderna. Su turbina distribuye el aire caliente en 360° logrando cocción uniforme sin quemar las orillas.
            </p>
            <ul className="space-y-2 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Temperatura exacta grado a grado para recetas complejas.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Múltiples niveles de horneado simultáneos sin mezcla de olores.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Conexión 220V con aislamiento de triple cristal.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ASESORÍA ═══════════ */}
      <section className="py-16 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-10 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1b1713 0%, #2b1f14 60%, #432c18 100%)' }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            ¿Deseas Asesoría Técnica para tu Horno?
          </h2>
          <p className="text-stone-300 text-sm max-w-xl mx-auto mb-8">
            Envíanos una foto del mueble de tu cocina o sus medidas y nuestros técnicos te confirmarán el modelo exacto que encaja perfecto.
          </p>
          <a
            href={`${waBase}?text=${encodeURIComponent('Hola ATOMIC! Deseo asesoría sobre medidas de nicho y modelos de hornos de empotrar.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black uppercase tracking-wider rounded-xl transition-all shadow-lg text-xs"
          >
            <span>Consultar con un Asesor por WhatsApp</span>
            <span>→</span>
          </a>
        </div>
      </section>

      {/* ═══════════ MODAL QUOTE WHATSAPP ═══════════ */}
      {quoteProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setQuoteProduct(null)}
        >
          <div
            className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 p-1">
                <img
                  src={parseImages(quoteProduct.images)[0] || ''}
                  alt={quoteProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm leading-snug mb-1">{quoteProduct.name}</h3>
                <div className="text-xl font-black text-amber-700 font-mono">${quoteProduct.price.toFixed(0)} <span className="text-xs text-stone-400 font-sans">+IVA</span></div>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between mb-4">
              <span className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
                <span>📐</span> Medidas de Empotre
              </span>
              <span className="text-xs font-mono font-bold text-stone-900">
                {extractDimensions(quoteProduct.description, quoteProduct.name)}
              </span>
            </div>

            <a
              href={buildWhatsApp(quoteProduct)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-green-600/30 mb-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              <span>Consultar por WhatsApp</span>
            </a>
            <button
              onClick={() => setQuoteProduct(null)}
              className="w-full py-2.5 text-stone-500 text-xs font-bold uppercase tracking-wider hover:text-stone-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
