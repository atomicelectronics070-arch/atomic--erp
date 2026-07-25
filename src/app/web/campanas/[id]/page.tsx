import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import parse from 'html-react-parser';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function CampanaDetailPage({ params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (!product) {
    notFound();
  }

  // Extraer galería de fotos
  let photos: string[] = [];
  if (product.images) {
    try {
      photos = JSON.parse(product.images);
    } catch (e) {
      // Ignore
    }
  }

  const primaryImage = photos.length > 0 ? photos[0] : '/img/placeholder.png';

  // Procesar descripción y extraer imágenes inyectadas en HTML
  // (html-react-parser ya se encarga de parsear e hidratar el HTML crudo limpiamente)
  const descriptionHtml = product.description || '<p>No hay descripción disponible para este modelo.</p>';

  // Parse specifications
  let specsObj: any = {};
  if (product.specs) {
      try {
          specsObj = JSON.parse(product.specs);
      } catch(e) {}
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Navegación Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center text-sm text-slate-500">
          <Link href="/web/campanas" className="hover:text-blue-600 font-medium">← Volver al Catálogo</Link>
          <span className="mx-3">/</span>
          <span className="truncate max-w-md">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid lg:grid-cols-2 gap-16">
        
        {/* Galería Súper Mega Completa */}
        <div className="space-y-6">
          {/* Foto Principal */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm aspect-square flex items-center justify-center relative overflow-hidden group">
            <img 
              src={primaryImage} 
              alt={product.name} 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          
          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="bg-white p-2 rounded-2xl border border-slate-200 aspect-square flex items-center justify-center hover:border-blue-500 cursor-pointer transition-colors shadow-sm">
                  <img src={photo} alt={`${product.name} - Foto ${i+1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ficha de Producto y Compra */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-5xl font-black text-blue-600">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-2xl text-slate-400 line-through mb-1">${product.compareAtPrice.toFixed(2)}</span>
              )}
            </div>
            
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.sku && <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-mono border border-slate-200">SKU: {product.sku}</span>}
              {product.stock > 0 ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">En Stock ({product.stock} unidades)</span>
              ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200">Agotado</span>
              )}
              {product.provider && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">Marca: {product.provider.toUpperCase()}</span>}
            </div>

            <button className="w-full py-5 bg-slate-900 hover:bg-black text-white text-xl font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1">
              Contactar Asesor por WhatsApp
            </button>
          </div>

          {/* Ficha Técnica Tabular */}
          {Object.keys(specsObj).length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Ficha Técnica
              </h2>
              <div className="divide-y divide-slate-100">
                {Object.entries(specsObj).map(([key, value]) => (
                  <div key={key} className="py-4 flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="font-semibold text-slate-600 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-slate-800 text-right font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Descripción Dinámica (Con Imágenes del Scraper) */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm prose prose-lg prose-blue max-w-none prose-img:rounded-2xl prose-img:shadow-md prose-img:mx-auto prose-headings:text-slate-900">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 border-b pb-4">Detalles del Artículo</h2>
          {/* El parser se encargará de inyectar los tags <img> reales que haya encontrado el scraper */}
          {parse(descriptionHtml)}
        </div>
      </div>

    </div>
  );
}
