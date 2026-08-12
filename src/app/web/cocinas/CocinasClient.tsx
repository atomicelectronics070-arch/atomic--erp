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

/** Pull dimensions string from raw HTML description */
function extractDimensions(desc: string | null): string | null {
  if (!desc) return null;
  const clean = stripHtml(desc);
  // Look for patterns like "90 X 52 cm", "595 x 547 x 595 mm", "60 x 60 cm"
  const match = clean.match(
    /Dimensiones[^:]*:\s*([\d.,]+\s*[xX×]\s*[\d.,]+(?:\s*[xX×]\s*[\d.,]+)?)\s*(mm|cm|MM|CM)?/i
  );
  if (match) {
    const dims = match[1].replace(/\s/g, '').toUpperCase().replace(/X/g, ' × ');
    const unit = match[2] ? match[2].toLowerCase() : 'cm';
    return `${dims} ${unit}`;
  }
  return null;
}

/** Extract burner count from description */
function extractBurners(desc: string | null, name: string): number | null {
  const text = `${name} ${desc ? stripHtml(desc) : ''}`;
  // Explicit "X zonas" pattern for induction
  const zonaMatch = text.match(/(\d)\s*zonas?/i);
  if (zonaMatch) return parseInt(zonaMatch[1]);
  // Gas hornillas count: look for digits near "hornillas" or "quemadores"
  const hornMatch = text.match(/(\d)\s*(hornillas?|quemadores?)/i);
  if (hornMatch) return parseInt(hornMatch[1]);
  // Pattern like "5 Quemadores"
  const qMatch = text.match(/(\d)\s*quemadores?/i);
  if (qMatch) return parseInt(qMatch[1]);
  // Try name keywords like "5q", "4 quemadores"
  const nameMatch = name.match(/(\d)\s*(q\b|zon|horn|quem)/i);
  if (nameMatch) return parseInt(nameMatch[1]);
  return null;
}

/** Extract oven capacity from description */
function extractCapacity(desc: string | null): string | null {
  if (!desc) return null;
  const clean = stripHtml(desc);
  const m = clean.match(/Capacidad[^:]*:\s*([\d.]+\s*litros?)/i);
  return m ? m[1] : null;
}

/** Determine product type */
function getType(name: string): 'encimera' | 'horno' {
  return name.toLowerCase().includes('horno') ? 'horno' : 'encimera';
}

/** Determine fuel type */
function getFuel(name: string, desc: string | null): 'Gas' | 'Inducción' | 'Eléctrico' {
  const text = `${name} ${desc ? stripHtml(desc) : ''}`.toLowerCase();
  if (text.includes('inducción') || text.includes('induccion') || text.includes('zonas')) return 'Inducción';
  if (text.includes('eléctrico') || text.includes('electrico') || text.includes('220v')) {
    if (!text.includes('horno a gas')) return 'Eléctrico';
  }
  if (text.includes('gas')) return 'Gas';
  return 'Eléctrico';
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

function ProductCard({ p, onQuote }: { p: Product; onQuote: (p: Product) => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = parseImages(p.images);
  const img = imgs[imgIdx] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800';
  const type = getType(p.name);
  const fuel = getFuel(p.name, p.description);
  const dims = extractDimensions(p.description);
  const burners = type === 'encimera' ? extractBurners(p.description, p.name) : null;
  const capacity = type === 'horno' ? extractCapacity(p.description) : null;

  const fuelColors: Record<string, string> = {
    Gas: 'bg-orange-100 text-orange-700 border-orange-200',
    Inducción: 'bg-blue-100 text-blue-700 border-blue-200',
    Eléctrico: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400">
      {/* Image */}
      <div className="relative aspect-square bg-stone-50 flex items-center justify-center overflow-hidden p-4">
        <img
          src={img}
          alt={p.name}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800'; }}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
        />

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg font-mono">
          ${p.price.toFixed(0)}
        </div>

        {/* Type badge */}
        <div className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full border ${type === 'encimera' ? 'bg-stone-800 text-stone-100 border-stone-700' : 'bg-amber-800 text-amber-100 border-amber-700'}`}>
          {type === 'encimera' ? '🍳 Encimera' : '🔥 Horno'}
        </div>

        {/* Image carousel dots */}
        {imgs.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-amber-700 w-3' : 'bg-stone-400'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-4 flex-grow">
        <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
          {p.name}
        </h3>

        {/* ★ BIG DIMENSION DISPLAY */}
        {dims && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-center">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">
              📐 Dimensiones Externas
            </div>
            <div className="text-xl font-black text-stone-900 font-mono tracking-tight">
              {dims}
            </div>
          </div>
        )}

        {/* ★ BIG BURNERS DISPLAY (encimeras) */}
        {type === 'encimera' && burners && (
          <div className="bg-stone-900 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Hornillas</span>
            <div className="flex items-center gap-2">
              {Array.from({ length: burners }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-600 shadow-sm shadow-amber-500/50" />
              ))}
              <span className="text-2xl font-black text-white ml-1 font-mono">{burners}</span>
            </div>
          </div>
        )}

        {/* ★ OVEN CAPACITY (hornos) */}
        {type === 'horno' && capacity && (
          <div className="bg-stone-900 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Capacidad</span>
            <span className="text-2xl font-black text-white font-mono">{capacity}</span>
          </div>
        )}

        {/* Fuel badge */}
        <div className="flex flex-wrap gap-2">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${fuelColors[fuel]}`}>
            {fuel === 'Gas' ? '🔥' : fuel === 'Inducción' ? '⚡' : '🔌'} {fuel}
          </span>
          {p.stock > 0 ? (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              En Stock
            </span>
          ) : (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              Bajo Pedido
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onQuote(p)}
          className="mt-auto w-full py-3 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-amber-800 hover:to-amber-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-md hover:shadow-amber-900/30"
        >
          Consultar por WhatsApp →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── main component ─────────────────────────── */

export default function CocinasClient({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<'todos' | 'encimera' | 'horno'>('todos');
  const [fuelFilter, setFuelFilter] = useState<'todos' | 'Gas' | 'Inducción' | 'Eléctrico'>('todos');
  const [search, setSearch] = useState('');
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const type = getType(p.name);
      if (filter !== 'todos' && type !== filter) return false;
      const fuel = getFuel(p.name, p.description);
      if (fuelFilter !== 'todos' && fuel !== fuelFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const text = `${p.name} ${p.description ? stripHtml(p.description) : ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [products, filter, fuelFilter, search]);

  const encimeras = products.filter((p) => getType(p.name) === 'encimera');
  const hornos = products.filter((p) => getType(p.name) === 'horno');

  const waBase = 'https://wa.me/593969043453';

  function buildWhatsApp(p: Product) {
    const dims = extractDimensions(p.description);
    const burners = getType(p.name) === 'encimera' ? extractBurners(p.description, p.name) : null;
    const fuel = getFuel(p.name, p.description);
    let msg = `Hola ATOMIC! Estoy interesado/a en:\n\n*${p.name}*\n💰 Precio: $${p.price.toFixed(0)}`;
    if (dims) msg += `\n📐 Medidas: ${dims}`;
    if (burners) msg += `\n🍳 Hornillas: ${burners}`;
    msg += `\n⚡ Tipo: ${fuel}`;
    msg += `\n\nDeseo más información y coordinar la compra.`;
    return `${waBase}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #fdfcfb 0%, #f5f0eb 100%)' }}>

      {/* ═══════════ HERO ═══════════ */}
      <section
        className="relative overflow-hidden text-white py-28 px-6"
        style={{
          background: 'linear-gradient(135deg, #292219 0%, #3d2c1a 40%, #5c3d20 100%)',
        }}
      >
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #d97706 0%, transparent 70%)', transform: 'translate(-30%, 40%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-5 py-2 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Línea Premium de Cocina · ATOMIC
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-4 leading-none">
            Encimeras <span className="text-amber-400">&</span>
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f97316)' }}>
              Hornos
            </span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Equipa tu cocina con la línea que combina diseño europeo, tecnología de cocción avanzada
            y dimensiones precisas para cada espacio. Gas · Inducción · Eléctrico.
          </p>

          {/* stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 font-bold">
              🍳 {encimeras.length} Encimeras disponibles
            </div>
            <div className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 font-bold">
              🔥 {hornos.length} Hornos disponibles
            </div>
            <a
              href="#combos"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-full font-bold transition-colors shadow-lg shadow-amber-500/30"
            >
              ✨ Ver Conjuntos & Promos
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ STICKY FILTER BAR ═══════════ */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Type filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['todos', 'encimera', 'horno'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-5 py-2.5 rounded-full border transition-all duration-200 ${filter === f
                    ? 'bg-stone-900 text-white border-stone-900 scale-105 shadow-md'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
              >
                {f === 'todos' ? '✨ Todos' : f === 'encimera' ? '🍳 Encimeras' : '🔥 Hornos'}
              </button>
            ))}
            <div className="h-5 w-px bg-stone-200 mx-1" />
            {(['todos', 'Gas', 'Inducción', 'Eléctrico'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFuelFilter(f)}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 ${fuelFilter === f
                    ? 'bg-amber-700 text-white border-amber-700 scale-105'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
              >
                {f === 'todos' ? 'Todo Combustible' : f === 'Gas' ? '🔥 Gas' : f === 'Inducción' ? '⚡ Inducción' : '🔌 Eléctrico'}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Buscar por nombre o medida..."
            className="w-full md:w-72 px-4 py-2.5 text-xs bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ═══════════ PRODUCT GRID ═══════════ */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-200">
            <p className="text-2xl font-bold text-stone-600 mb-3">No encontramos productos con ese filtro</p>
            <button
              onClick={() => { setFilter('todos'); setFuelFilter('todos'); setSearch(''); }}
              className="px-6 py-3 bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-amber-600 transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} onQuote={setQuoteProduct} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════ COMBOS / CONJUNTOS SECTION ═══════════ */}
      <section className="py-20 px-6" id="combos">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 rounded-full px-5 py-2 text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
              ✨ OFERTA ESPECIAL
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-3">
              Haz Juego — Conjuntos de Cocina
            </h2>
            <p className="text-stone-500 text-base max-w-2xl mx-auto">
              Cuando compras tu encimera y horno juntos, obtienes una cocina con diseño uniforme, instalación coordinada y mejor precio. ¡Pregúntanos por el combo que más te conviene!
            </p>
          </div>

          {/* combo cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Combo 1 */}
            <div className="relative bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-8 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="text-3xl mb-3">🍳🔥</div>
              <h3 className="text-xl font-black mb-2">Conjunto Gas Clásico</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">
                Encimera a Gas (5 hornillas, 90 cm) + Horno a Gas de Empotrar (60×60 cm, 80 L). El favorito de los hogares ecuatorianos.
              </p>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">Ahorra en instalación conjunta</div>
              <a
                href={`${waBase}?text=${encodeURIComponent('Hola! Me interesa el *Conjunto Gas Clásico* (Encimera 5 hornillas + Horno a gas). ¿Cuál es el mejor precio disponible?')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-full px-6 py-3 transition-colors"
              >
                Consultar Combo <span>→</span>
              </a>
            </div>

            {/* Combo 2 */}
            <div className="relative bg-gradient-to-br from-blue-950 to-indigo-900 text-white rounded-3xl p-8 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="text-3xl mb-3">⚡🔌</div>
              <h3 className="text-xl font-black mb-2">Conjunto Moderno Inducción</h3>
              <p className="text-stone-300 text-sm leading-relaxed mb-4">
                Encimera de Inducción (5 zonas, 90×52 cm, 220V) + Horno Eléctrico de Empotrar (60×60 cm, 80 L, AirFry). La cocina del futuro, hoy.
              </p>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-4">Máxima eficiencia energética</div>
              <a
                href={`${waBase}?text=${encodeURIComponent('Hola! Me interesa el *Conjunto Moderno Inducción* (Encimera de inducción 5 zonas + Horno eléctrico). ¿Cuál es el mejor precio disponible?')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-400 hover:bg-blue-300 text-blue-950 font-bold text-xs uppercase tracking-wider rounded-full px-6 py-3 transition-colors"
              >
                Consultar Combo <span>→</span>
              </a>
            </div>

            {/* Combo 3 - Custom */}
            <div className="relative border-2 border-dashed border-amber-400 rounded-3xl p-8 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #fffbf5, #fef3c7)' }}>
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-xl font-black text-stone-900 mb-2">Tu Conjunto Personalizado</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                ¿Tienes medidas específicas o prefieres un tipo de combustible? Cuéntanos y armamos el conjunto perfecto para tu cocina.
              </p>
              <div className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-4">Asesoría gratuita disponible</div>
              <a
                href={`${waBase}?text=${encodeURIComponent('Hola! Quiero armar un *Conjunto Personalizado* de cocina (encimera + horno). Necesito asesoría para elegir los mejores modelos según mi espacio.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider rounded-full px-6 py-3 transition-colors"
              >
                Armar mi conjunto <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SIZE GUIDE BANNER ═══════════ */}
      <section className="py-16 px-6 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-stone-900 text-center mb-10">
            Guía de Tamaños Estándar — ¿Cuál te Cabe?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Encimeras guide */}
            <div className="bg-stone-50 rounded-3xl p-7 border border-stone-200">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">🍳</span>
                <h3 className="text-lg font-black text-stone-900">Encimeras a Gas</h3>
              </div>
              <div className="space-y-3">
                {[
                  { burners: '4 hornillas', dims: '76 × 50 cm', label: 'Cocinas compactas o de isla pequeña' },
                  { burners: '5 hornillas', dims: '90 × 52 cm', label: 'El más popular en hogares y deptos' },
                  { burners: '6+ hornillas', dims: '90 × 60 cm', label: 'Cocinas profesionales y restaurantes' },
                ].map((r) => (
                  <div key={r.burners} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200">
                    <div>
                      <div className="font-black text-stone-900 text-sm">{r.burners}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{r.label}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-amber-700 font-mono text-lg">{r.dims}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hornos guide */}
            <div className="bg-stone-50 rounded-3xl p-7 border border-stone-200">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">🔥</span>
                <h3 className="text-lg font-black text-stone-900">Hornos de Empotrar</h3>
              </div>
              <div className="space-y-3">
                {[
                  { size: 'Estándar 60cm', dims: '60 × 60 cm', cap: '60–70 L', label: 'Para muebles de cocina estándar' },
                  { size: 'Compacto 45cm', dims: '45 × 60 cm', cap: '40–50 L', label: 'Cocinas pequeñas o segundo horno' },
                  { size: 'Pro 60cm XL', dims: '60 × 60 × 60 cm', cap: '80 L', label: 'Máxima capacidad residencial' },
                ].map((r) => (
                  <div key={r.size} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200">
                    <div>
                      <div className="font-black text-stone-900 text-sm">{r.size}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{r.label}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-amber-700 font-mono text-base">{r.dims}</div>
                      <div className="text-xs text-stone-400">{r.cap}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-stone-400 text-sm mt-8">
            💡 ¿No estás seguro de cuál cabe en tu mueble? Escríbenos con las medidas del hueco y te recomendamos el modelo ideal.
          </p>
        </div>
      </section>

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section className="py-20 px-6">
        <div
          className="max-w-4xl mx-auto rounded-[2rem] p-12 text-center text-white shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #292219 0%, #3d2c1a 60%, #5c3d20 100%)' }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            ¿Listo para renovar tu cocina?
          </h2>
          <p className="text-stone-300 text-base mb-8 max-w-xl mx-auto">
            Nuestros asesores te ayudan a elegir la encimera y el horno perfectos según las medidas de tu espacio, tu presupuesto y tu estilo de vida.
          </p>
          <a
            href={`${waBase}?text=${encodeURIComponent('Hola ATOMIC! Quisiera asesoría para elegir una encimera y/o horno para mi cocina.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider rounded-full transition-all hover:scale-105 shadow-xl shadow-amber-500/30 text-sm"
          >
            <span>Hablar con un Asesor por WhatsApp</span>
            <span>→</span>
          </a>
        </div>
      </section>

      {/* ═══════════ WHATSAPP QUOTE MODAL ═══════════ */}
      {quoteProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setQuoteProduct(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                <img
                  src={parseImages(quoteProduct.images)[0] || ''}
                  alt={quoteProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-sm leading-snug mb-1">{quoteProduct.name}</h3>
                <div className="text-2xl font-black text-amber-700 font-mono">${quoteProduct.price.toFixed(0)}</div>
              </div>
            </div>

            {/* dims reminder */}
            {extractDimensions(quoteProduct.description) && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center mb-4">
                <div className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Dimensiones</div>
                <div className="text-lg font-black text-stone-900 font-mono">{extractDimensions(quoteProduct.description)}</div>
              </div>
            )}

            <a
              href={buildWhatsApp(quoteProduct)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-colors shadow-lg shadow-green-500/30 mb-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Consultar por WhatsApp
            </a>
            <button
              onClick={() => setQuoteProduct(null)}
              className="w-full py-3 text-stone-500 text-xs font-bold uppercase tracking-wider hover:text-stone-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
