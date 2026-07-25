import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = {
  title: 'Catálogo de Laptops Premium | Atomic',
  description: 'Descubre nuestra línea exclusiva de laptops de alto rendimiento, gaming y ofimática.'
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
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight relative z-10">
            El Ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Premium.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto relative z-10">
            Explora nuestra colección curada de laptops para creadores, gamers y profesionales. Descubre análisis en profundidad y galerías detalladas de cada modelo.
          </p>
        </header>

        {laptops.length === 0 ? (
          <div className="text-center text-slate-500">Cargando catálogo...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {laptops.map((laptop: any) => (
              <Link href={`/web/laptops-blog/${laptop.slug}`} key={laptop.id}>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group h-full flex flex-col relative overflow-hidden">
                  
                  {/* Etiqueta de Precio */}
                  <div className="absolute top-6 right-6 bg-slate-900 text-white font-bold px-4 py-2 rounded-full text-sm z-10">
                    ${laptop.price.toFixed(2)}
                  </div>

                  {/* Imagen Principal (la primera del scraper) */}
                  <div className="w-full h-64 flex items-center justify-center mb-8 relative">
                    <img 
                      src={laptop.images[0]} 
                      alt={laptop.cleanName} 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    <h2 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                      {laptop.cleanName}
                    </h2>
                    
                    {/* Tags Rápidos */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                        {laptop.features.cpu.title}
                      </span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-100">
                        {laptop.features.gpu.title}
                      </span>
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
