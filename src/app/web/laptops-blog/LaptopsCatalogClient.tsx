'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Laptop, Cpu, ShieldCheck, ArrowRight, Sparkles, Zap, 
  Search, Filter, CheckCircle2, Flame, Star, ShoppingBag, Terminal
} from 'lucide-react';

export default function LaptopsCatalogClient({ initialLaptops }: { initialLaptops: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('todos');

  const filteredLaptops = initialLaptops.filter((laptop) => {
    const nameMatch = (laptop.cleanName || laptop.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const cpuMatch = (laptop.features?.cpu?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const brandMatch = selectedBrand === 'todos' || (laptop.name || '').toLowerCase().includes(selectedBrand.toLowerCase());
    return (nameMatch || cpuMatch) && brandMatch;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white py-16 px-4 sm:px-8 lg:px-12 relative overflow-hidden font-sans">
      
      {/* Dynamic Cyberpunk Lighting Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header Hero Banner */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-500/40 rounded-full text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Catálogo Ultra-Gaming & Pro Workstations 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
            El Ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">Premium.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Explora las computadoras portátiles más potentes del mercado ecuatoriano. Fichas técnicas avanzadas, galerías HD de estudio y precios actualizados.
          </p>

          {/* Search Bar & Brand Filters */}
          <div className="pt-4 space-y-4 max-w-2xl mx-auto">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por modelo (Ryzen 7, RTX, MSI Thin, Asus TUF, Lenovo)..."
                className="w-full bg-slate-900/90 border border-cyan-500/30 p-4 pl-12 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-xl font-mono"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white">
                  ✕ Limpiar
                </button>
              )}
            </div>

            {/* Quick Brand Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {['todos', 'msi', 'asus', 'lenovo', 'acer', 'hp', 'apple'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                    selectedBrand === brand
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Laptops Cards Grid */}
        {filteredLaptops.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <Laptop size={40} className="text-cyan-400 mx-auto" />
            <p className="text-slate-400 font-mono text-sm">No se encontraron laptops para "{searchTerm}".</p>
            <button onClick={() => { setSearchTerm(''); setSelectedBrand('todos'); }} className="text-cyan-400 font-bold text-xs hover:underline">
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLaptops.map((laptop: any) => (
              <Link href={`/web/laptops-blog/${laptop.slug}`} key={laptop.id} className="group">
                <div className="h-full bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-3xl p-7 border border-slate-800/80 hover:border-cyan-400/60 hover:shadow-[0_0_50px_rgba(6,182,212,0.25)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden group-hover:-translate-y-1.5">
                  
                  {/* Glowing Top Line on Hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div>
                    {/* Header Pill & Price */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                        <Flame size={12} className="text-amber-400 animate-bounce" /> Stock Garantizado
                      </span>

                      <div className="bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-black px-4 py-1.5 rounded-full text-sm font-mono shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                        ${laptop.price ? laptop.price.toFixed(2) : 'Consultar'}
                      </div>
                    </div>

                    {/* Clean Studio Product Image */}
                    <div className="w-full h-60 bg-black/60 rounded-2xl border border-slate-800/90 flex items-center justify-center p-4 mb-6 relative overflow-hidden group-hover:border-cyan-500/30 transition-colors">
                      <img 
                        src={laptop.images[0]} 
                        alt={laptop.cleanName} 
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                      />
                    </div>

                    {/* Product Clean Name */}
                    <h2 className="text-xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-cyan-300 transition-colors">
                      {laptop.cleanName || laptop.name}
                    </h2>
                  </div>

                  {/* Specs & CTA */}
                  <div className="space-y-4 pt-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-2">
                      {laptop.features?.cpu?.title && (
                        <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl text-[11px] font-bold font-mono">
                          ⚡ {laptop.features.cpu.title}
                        </span>
                      )}
                      {laptop.features?.gpu?.title && (
                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-xl text-[11px] font-bold font-mono">
                          🎮 {laptop.features.gpu.title}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white transition-colors pt-2">
                      <span className="flex items-center gap-1.5">
                        <Terminal size={14} className="text-cyan-400" /> Ver Ficha Completa
                      </span>
                      <ArrowRight size={16} className="text-cyan-400 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
