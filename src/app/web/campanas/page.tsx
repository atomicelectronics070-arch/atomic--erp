import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every 60 seconds

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Colección Premium de Campanas Extractoras</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Descubre nuestra exclusiva selección de campanas de alta gama, diseñadas para transformar tu cocina en un espacio libre de humos y lleno de elegancia.
        </p>
      </section>

      {/* Catálogo Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campanas.map((campana) => {
            // Extraer la primera imagen del string JSON
            let primaryImage = '/img/placeholder.png';
            if (campana.images) {
              try {
                const imagesArray = JSON.parse(campana.images);
                if (imagesArray.length > 0) primaryImage = imagesArray[0];
              } catch (e) {
                // Ignore parse errors
              }
            }

            return (
              <Link href={`/web/campanas/${campana.id}`} key={campana.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative aspect-square bg-white p-6 flex items-center justify-center">
                  <img 
                    src={primaryImage} 
                    alt={campana.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-slate-900 text-white px-4 py-1 rounded-full font-bold shadow-lg">
                    ${campana.price.toFixed(2)}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{campana.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Ver Ficha Técnica Completa</span>
                    <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
