import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

export const revalidate = 60;

export default async function CampanasPremiumPage() {
  const prisma = new PrismaClient();
  
  const campanas = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { category: { name: { contains: 'campana', mode: 'insensitive' } } },
        { category: { name: { contains: 'extractor', mode: 'insensitive' } } }
      ],
      price: { gt: 200 },
      isDeleted: false
    },
    orderBy: { price: 'desc' }
  });

  // Deduplicar por nombre (nos quedamos con el de mayor precio si hay duplicados)
  const seen = new Map<string, typeof campanas[0]>();
  for (const c of campanas) {
    const key = c.name.toLowerCase().trim();
    if (!seen.has(key) || c.price > seen.get(key)!.price) {
      seen.set(key, c);
    }
  }
  const uniqueCampanas = Array.from(seen.values()).sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-28 px-6 text-center overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"/>
          <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-indigo-600/10 rounded-full blur-[80px]"/>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-5 py-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>
            Línea Premium · Banco del Perno
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Campanas Extractoras<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">de Alta Gama</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Diseñadas para transformar tu cocina: potentes, silenciosas y con un diseño premium que combina tecnología y elegancia. {uniqueCampanas.length} modelos disponibles.
          </p>
        </div>
      </section>

      {/* Filtros visuales */}
      <section className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Tipo:</span>
          {['Todos', 'Isla', 'Pared', 'Retráctil'].map((f) => (
            <span key={f} className={`text-xs font-bold px-4 py-2 rounded-full cursor-pointer border transition-all ${f === 'Todos' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Catálogo Grid */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        {uniqueCampanas.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-2xl font-bold mb-2">Sin productos disponibles</p>
            <p className="text-sm">Revisa la configuración del catálogo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {uniqueCampanas.map((campana) => {
              // Imagen principal
              let primaryImage = '/img/placeholder.png';
              if (campana.images) {
                try {
                  const imgs = JSON.parse(campana.images);
                  if (imgs.length > 0) primaryImage = imgs[0];
                } catch {}
              }

              // Specs
              let specs: Record<string, string> = {};
              if (campana.specs) {
                try { specs = JSON.parse(campana.specs); } catch {}
              }

              const tipo = specs.tipo || null;
              const caudal = specs.caudal_extraccion || null;
              const motor = specs.motor || null;

              // Color badge por tipo
              const tipoBadge: Record<string, string> = {
                'Isla': 'bg-blue-100 text-blue-700 border-blue-200',
                'Pared': 'bg-slate-100 text-slate-700 border-slate-200',
                'Retráctil': 'bg-indigo-100 text-indigo-700 border-indigo-200',
              };

              return (
                <Link
                  href={`/web/campanas/${campana.id}`}
                  key={campana.id}
                  className="group flex flex-col bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Imagen */}
                  <div className="relative aspect-square bg-slate-50 p-5 flex items-center justify-center overflow-hidden">
                    <img
                      src={primaryImage}
                      alt={campana.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Precio */}
                    <div className="absolute top-3 right-3 bg-slate-900 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                      ${campana.price.toFixed(0)}
                    </div>
                    {/* Tipo badge */}
                    {tipo && (
                      <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${tipoBadge[tipo] || 'bg-gray-100 text-gray-600'}`}>
                        {tipo}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-grow flex flex-col gap-3">
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {campana.name}
                    </h3>

                    {/* Mini specs pills */}
                    {(caudal || motor) && (
                      <div className="flex flex-wrap gap-1.5">
                        {caudal && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            💨 {caudal}
                          </span>
                        )}
                        {motor && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            ⚡ {motor.split('/')[0].trim()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stock */}
                    {campana.stock > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                        En stock
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"/>
                        Sin stock
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-600">Ver ficha completa</span>
                      <svg className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-10 md:p-14 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            ¿No encuentras el modelo ideal?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Nuestros asesores especializados te ayudan a elegir la campana perfecta según el tamaño de tu cocina, la distancia de evacuación y tu presupuesto.
          </p>
          <a
            href="https://wa.me/593969043453?text=Hola%2C%20quisiera%20asesoría%20para%20elegir%20una%20campana%20extractora"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
          >
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Asesoría Gratuita por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
