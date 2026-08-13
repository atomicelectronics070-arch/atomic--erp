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

function parseSpecs(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getPlatform(name: string): 'PlayStation' | 'PlayStation Portal' | 'Xbox' | 'Nintendo' | 'Otro' {
  const n = name.toLowerCase();
  if (n.includes('portal')) return 'PlayStation Portal';
  if (n.includes('dualsense') || n.includes('dualshock') || n.includes('playstation') || n.includes('ps5') || n.includes('ps4')) return 'PlayStation';
  if (n.includes('xbox')) return 'Xbox';
  if (n.includes('nintendo') || n.includes('switch')) return 'Nintendo';
  return 'Otro';
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

function ProductCard({ p, onSelect }: { p: Product; onSelect: (p: Product) => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = parseImages(p.images);
  const img = imgs[imgIdx] || 'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-controller-ps5-hero-01-en-14sep21';
  const platform = getPlatform(p.name);
  const specs = parseSpecs(p.specs);

  const platformBadges: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    PlayStation: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: '🎮' },
    'PlayStation Portal': { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30', icon: '📱' },
    Xbox: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '💚' },
    Nintendo: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', icon: '🔴' },
    Otro: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: '⚙️' },
  };

  const badge = platformBadges[platform] || platformBadges.Otro;

  const waBase = 'https://wa.me/593969043453';
  const msg = `Hola ATOMIC GAMING! Estoy interesado/a en:\n\n🎮 *${p.name}*\n💰 Precio: $${p.price.toFixed(2)}\n\n¿Tienen disponibilidad para entrega inmediata?`;
  const waUrl = `${waBase}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="group flex flex-col bg-neutral-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-b from-neutral-950 to-neutral-900 p-6 flex items-center justify-center overflow-hidden">
        <img
          src={img}
          alt={p.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-controller-ps5-hero-01-en-14sep21';
          }}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
        />

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full font-black text-sm shadow-lg font-mono tracking-tight">
          ${p.price.toFixed(2)}
        </div>

        {/* Platform badge */}
        <div className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border} flex items-center gap-1.5 backdrop-blur-md`}>
          <span>{badge.icon}</span>
          <span>{platform}</span>
        </div>

        {/* Image dots */}
        {imgs.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-blue-400 w-3' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-6 flex flex-col gap-4 flex-grow">
        <h3 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
          {p.name}
        </h3>

        {/* Highlights / Specs pills */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {specs.conexion && (
            <span className="bg-white/5 border border-white/10 text-neutral-300 px-2.5 py-1 rounded-full font-mono">
              ⚡ {specs.conexion}
            </span>
          )}
          {specs.pantalla && (
            <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full font-mono">
              📺 {specs.pantalla}
            </span>
          )}
          {specs.color && (
            <span className="bg-white/5 border border-white/10 text-neutral-300 px-2.5 py-1 rounded-full font-mono">
              🎨 {specs.color}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>En Stock para entrega inmediata</span>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => onSelect(p)}
            className="py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10 flex items-center justify-center gap-1"
          >
            <span>Ver Detalle</span>
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1"
          >
            <span>Pedir Ya →</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── main component ─────────────────────────── */

export default function MandosClient({ products }: { products: Product[] }) {
  const [platformFilter, setPlatformFilter] = useState<'Todos' | 'PlayStation' | 'PlayStation Portal' | 'Xbox' | 'Nintendo'>('Todos');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const plat = getPlatform(p.name);
      if (platformFilter !== 'Todos' && plat !== platformFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const text = `${p.name} ${p.description ? stripHtml(p.description) : ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [products, platformFilter, search]);

  const waBase = 'https://wa.me/593969043453';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden py-24 px-6 border-b border-white/10 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-5 py-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            CATÁLOGO GAMING OFICIAL · ATOMIC HARDWARE
          </div>

          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight mb-6">
            Mandos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">&</span> Consolas
          </h1>

          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            Controles 100% originales e insuperables para PlayStation 5, PS4, Xbox Series X|S, Xbox One, Nintendo Switch y PlayStation Portal Remote Player.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <div className="px-5 py-2.5 bg-neutral-900 border border-white/10 rounded-full text-neutral-300 font-bold">
              ⚡ {products.length} Modelos Disponibles
            </div>
            <div className="px-5 py-2.5 bg-neutral-900 border border-white/10 rounded-full text-emerald-400 font-bold">
              ✅ Garantía de Fábrica Directa
            </div>
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC%20GAMING!%20Quisiera%20asesor%C3%ADa%20para%20comprar%20un%20mando"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20"
            >
              Consultar Asesor WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ STICKY FILTERS & SEARCH ═══════════ */}
      <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 py-4 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Platform Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 font-mono uppercase tracking-wider mr-2">Consola:</span>
            {(['Todos', 'PlayStation', 'PlayStation Portal', 'Xbox', 'Nintendo'] as const).map((plat) => {
              const isActive = platformFilter === plat;
              return (
                <button
                  key={plat}
                  onClick={() => setPlatformFilter(plat)}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                      : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {plat === 'Todos' ? '✨ Todos los Mandos' : plat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Buscar modelo, color o consola..."
            className="w-full md:w-80 px-4 py-2.5 text-xs bg-neutral-900 border border-white/10 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* ═══════════ PRODUCTS GRID ═══════════ */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-neutral-950 rounded-3xl border border-white/10 p-8">
            <p className="text-2xl font-bold text-white mb-3">No se encontraron mandos con ese filtro</p>
            <p className="text-sm text-neutral-400 mb-6">Prueba seleccionando "✨ Todos los Mandos" o borra el término de búsqueda.</p>
            <button
              onClick={() => { setPlatformFilter('Todos'); setSearch(''); }}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-blue-500 transition-colors"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} onSelect={setSelectedProduct} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════ FOOTER CTA BANNER ═══════════ */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-blue-950 border border-white/10 rounded-3xl p-10 md:p-14 text-center shadow-2xl overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
              ¿Buscas una edición especial o accesorio gaming?
            </h2>
            <p className="text-neutral-400 text-sm md:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
              Contamos con stock en bodega constante y pedidos especiales directos. Escríbenos por WhatsApp y te enviamos fotos reales y cotización inmediata.
            </p>
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Quisiera%20consultar%20por%20un%20mando%20o%20accesorio%20gaming%20espec%C3%ADfico"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-full transition-all shadow-xl shadow-blue-500/30 hover:scale-105"
            >
              <span>Hablar con un Especialista en WhatsApp</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ PRODUCT DETAIL MODAL ═══════════ */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mb-6">
              <div className="aspect-square bg-black rounded-2xl p-4 flex items-center justify-center border border-white/10">
                <img
                  src={parseImages(selectedProduct.images)[0] || ''}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                  {getPlatform(selectedProduct.name)}
                </span>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {selectedProduct.name}
                </h3>
                <div className="text-3xl font-black text-blue-400 font-mono">
                  ${selectedProduct.price.toFixed(2)} USD
                </div>
                <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Producto Original · En Stock</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedProduct.description && (
              <div
                className="prose prose-invert text-xs text-neutral-300 border-t border-white/10 pt-4 max-h-60 overflow-y-auto space-y-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
              />
            )}

            {/* Actions */}
            <div className="mt-6 border-t border-white/10 pt-4 flex gap-3">
              <a
                href={`${waBase}?text=${encodeURIComponent(`Hola ATOMIC GAMING! Deseo comprar el *${selectedProduct.name}* ($${selectedProduct.price.toFixed(2)}).`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all text-center shadow-lg shadow-emerald-500/20"
              >
                Comprar por WhatsApp →
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
