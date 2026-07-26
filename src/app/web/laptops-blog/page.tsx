import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Laptop, Cpu, ShieldCheck, ArrowRight, Sparkles, Zap, Star } from 'lucide-react';

export const metadata = {
  title: 'Catálogo de Laptops Premium | ATOMIC',
  description: 'Descubre nuestra colección exclusiva de laptops gaming, workstations y ultrabooks de alto rendimiento.'
};

export default function LaptopsBlogMasterPage() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'enrichedLaptops.json');
  let laptops = [];
  try {
    laptops = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (err) {
    console.error("Error reading laptops data:", err);
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white py-20 px-6 sm:px-12 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Tag Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} className="text-blue-400 animate-pulse" />
            <span>Colección Curada ATOMIC 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none">
            El Ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Premium.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto font-light leading-relaxed">
            Explora computadoras de alto rendimiento seleccionadas para creadores de contenido, gamers de elite y ejecutivos. Fotografías en alta resolución y análisis técnico profundo.
          </p>
        </div>

        {/* Laptops Cards Grid */}
        {laptops.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-mono">Cargando catálogo de laptops...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {laptops.map((laptop: any) => (
              <Link href={`/web/laptops-blog/${laptop.slug}`} key={laptop.id} className="group">
                <div className="h-full bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 border border-slate-800 hover:border-indigo-500/50 hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden group-hover:-translate-y-1">
                  
                  {/* Glowing Top Line on Hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div>
                    {/* Header Pill & Price */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Zap size={12} className="text-amber-400" /> Stock Disponible
                      </span>

                      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black px-4 py-1.5 rounded-full text-sm font-mono shadow-lg">
                        ${laptop.price ? laptop.price.toFixed(2) : 'Consultar'}
                      </div>
                    </div>

                    {/* Clean Studio Product Image */}
                    <div className="w-full h-56 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-center p-4 mb-6 relative overflow-hidden group-hover:bg-slate-950/80 transition-colors">
                      <img 
                        src={laptop.images[0]} 
                        alt={laptop.cleanName} 
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                      />
                    </div>

                    {/* Product Clean Name */}
                    <h2 className="text-xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {laptop.cleanName || laptop.name}
                    </h2>
                  </div>

                  {/* Specs & CTA */}
                  <div className="space-y-4 pt-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-2">
                      {laptop.features?.cpu?.title && (
                        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[11px] font-bold font-mono">
                          {laptop.features.cpu.title}
                        </span>
                      )}
                      {laptop.features?.gpu?.title && (
                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-[11px] font-bold font-mono">
                          {laptop.features.gpu.title}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white transition-colors pt-1">
                      <span>Ver Ficha Técnica & Análisis</span>
                      <ArrowRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
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
