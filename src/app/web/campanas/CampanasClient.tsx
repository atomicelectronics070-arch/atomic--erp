'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string | null;
  specs: string | null;
  category?: { name: string } | null;
}

function getDerivedType(item: ProductItem): 'Isla' | 'Pared' | 'Retráctil' {
  let specsTipo = '';
  if (item.specs) {
    try {
      const parsed = typeof item.specs === 'string' ? JSON.parse(item.specs) : item.specs;
      if (parsed.tipo) specsTipo = parsed.tipo.toString().toLowerCase();
    } catch {}
  }
  const nameLower = (item.name || '').toLowerCase();

  if (specsTipo.includes('isla') || nameLower.includes('isla')) return 'Isla';
  if (
    specsTipo.includes('retractil') ||
    specsTipo.includes('retráctil') ||
    nameLower.includes('retractil') ||
    nameLower.includes('retráctil') ||
    nameLower.includes('telescop') ||
    nameLower.includes('baja') ||
    nameLower.includes('slim')
  ) {
    return 'Retráctil';
  }
  return 'Pared';
}

export default function CampanasClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | 'Isla' | 'Pared' | 'Retráctil'>('Todos');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((item) => {
      // 1. Text Search Filter
      const searchMatch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        (item.specs && item.specs.toLowerCase().includes(search.toLowerCase().trim()));

      if (!searchMatch) return false;

      // 2. Type Filter ('Todos' | 'Isla' | 'Pared' | 'Retráctil')
      if (selectedFilter === 'Todos') return true;

      const derivedType = getDerivedType(item);
      return derivedType === selectedFilter;
    });
  }, [initialProducts, selectedFilter, search]);

  const tipoBadge: Record<string, string> = {
    Isla: 'bg-blue-100 text-blue-700 border-blue-200',
    Pared: 'bg-slate-100 text-slate-700 border-slate-200',
    Retráctil: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-5 py-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Línea Premium Extractoras · ATOMIC INDUSTRIAL
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Campanas Extractoras <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-500">
              de Alta Gama
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Diseñadas para transformar tu cocina: potentes, silenciosas y con un diseño premium que combina ingeniería y elegancia. {filteredProducts.length} de {initialProducts.length} modelos disponibles.
          </p>
        </div>
      </section>

      {/* FILTROS INTERACTIVOS Y BÚSQUEDA */}
      <section className="bg-white border-b border-slate-200 py-6 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* BOTONES DE TIPO */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">TIPO:</span>
            {(['Todos', 'Isla', 'Pared', 'Retráctil'] as const).map((filterName) => {
              const isActive = selectedFilter === filterName;
              return (
                <button
                  key={filterName}
                  onClick={() => setSelectedFilter(filterName)}
                  className={`text-xs font-bold px-5 py-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300'
                  }`}
                >
                  {filterName === 'Todos' ? '✨ TODOS LOS MODELOS' : filterName}
                </button>
              );
            })}
          </div>

          {/* BUSCADOR TEXTUAL */}
          <div className="w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Buscar modelo o medida..."
              className="w-full px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-full font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </section>

      {/* CATALOGO GRID */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <p className="text-2xl font-bold text-slate-700 mb-2">No se encontraron campanas en esta categoría</p>
            <p className="text-sm text-slate-400 mb-6">Prueba seleccionando "✨ TODOS LOS MODELOS" o borra el término de búsqueda.</p>
            <button
              onClick={() => { setSelectedFilter('Todos'); setSearch(''); }}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-blue-700 transition-colors"
            >
              Ver Todos los Modelos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((campana) => {
              let primaryImage = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070';
              if (campana.images) {
                try {
                  const imgs = typeof campana.images === 'string' ? JSON.parse(campana.images) : campana.images;
                  if (Array.isArray(imgs) && imgs.length > 0) primaryImage = imgs[0];
                } catch {}
              }

              let specs: Record<string, string> = {};
              if (campana.specs) {
                try {
                  specs = typeof campana.specs === 'string' ? JSON.parse(campana.specs) : campana.specs;
                } catch {}
              }

              const tipo = getDerivedType(campana);
              const caudal = specs.caudal_extraccion || null;
              const motor = specs.motor || null;

              return (
                <Link
                  href={`/web/campanas/${campana.id}`}
                  key={campana.id}
                  className="group flex flex-col bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Imagen */}
                  <div className="relative aspect-square bg-slate-50 p-5 flex items-center justify-center overflow-hidden">
                    <img
                      src={primaryImage}
                      alt={campana.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070';
                      }}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Precio */}
                    <div className="absolute top-3 right-3 bg-slate-900 text-white px-3.5 py-1.5 rounded-full font-bold text-sm shadow-lg font-mono">
                      ${campana.price.toFixed(0)}
                    </div>
                    {/* Tipo badge */}
                    {tipo && (
                      <div className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full border ${tipoBadge[tipo] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {tipo}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-grow flex flex-col gap-3">
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {campana.name}
                    </h3>

                    {(caudal || motor) && (
                      <div className="flex flex-wrap gap-1.5">
                        {caudal && (
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            💨 {caudal}
                          </span>
                        )}
                        {motor && (
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            ⚡ {motor.split('/')[0].trim()}
                          </span>
                        )}
                      </div>
                    )}

                    {campana.stock > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Disponible en Stock ({campana.stock} und)
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Bajo Pedido Especial
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Ver Ficha Técnica</span>
                      <svg className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 rounded-[2rem] p-10 md:p-14 text-center shadow-2xl text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            ¿Necesitas asesoría personalizada para tu cocina?
          </h2>
          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Nuestros asesores industriales te ayudan a elegir la campana ideal según las dimensiones de tu cocina, altura del cielo raso y flujo de extracción.
          </p>
          <a
            href="https://wa.me/593969043453?text=Hola%2C%20quisiera%20asesoría%20para%20elegir%20una%20campana%20extractora"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-blue-500 transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
          >
            <span>Hablar con un Especialista por WhatsApp</span>
            <span>→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
