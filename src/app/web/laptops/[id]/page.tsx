import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import parse from 'html-react-parser';
import Link from 'next/link';
import AcerNitroBanner from '@/components/marketing/AcerNitroBanner';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function LaptopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const prisma = new PrismaClient();
  
  let product = await prisma.product.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!product && resolvedParams.id === 'acer-nitro-v') {
    product = {
      id: 'acer-nitro-v',
      name: 'Laptop Gamer Acer Nitro V 15',
      price: 1150.00,
      compareAtPrice: 1450.00,
      stock: 8,
      sku: 'AC-NITRO-2026',
      description: '',
      specs: JSON.stringify({
        "Procesador": "Intel Core i7 13va Gen",
        "Tarjeta Gráfica": "NVIDIA RTX 4060 8GB",
        "Memoria RAM": "16GB DDR5 5200MHz",
        "Almacenamiento": "1TB SSD NVMe",
        "Pantalla": "15.6 pulgadas FHD 144Hz"
      }),
      images: JSON.stringify(['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop'])
    } as any;
  }

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
  const descriptionHtml = product.description || '<p>No hay descripción detallada disponible para este modelo.</p>';

  // Parse specifications
  let specsObj: any = {};
  if (product.specs) {
      try {
          specsObj = JSON.parse(product.specs);
      } catch(e) {}
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navegación Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center text-sm text-slate-500 py-4 px-6">
          <Link href="/web/repuestos" className="hover:text-blue-600 font-semibold transition-colors">← Volver a Repuestos & Laptops</Link>
          <span className="mx-3 text-slate-300">/</span>
          <span className="truncate max-w-md font-medium text-slate-700">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Mega Galería Visual - Glassmorphism */}
        <div className="space-y-6">
          {/* Foto Principal */}
          <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] aspect-square flex items-center justify-center relative overflow-hidden group">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <img 
              src={primaryImage} 
              alt={product.name} 
              className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl" 
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-slate-200/50 aspect-square flex items-center justify-center hover:border-blue-500/50 hover:bg-white cursor-pointer transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                  <img src={photo} alt={`${product.name} - Foto ${i+1}`} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ficha de Producto y Compra Premium */}
        <div className="flex flex-col pt-4">
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">{product.name}</h1>
            <div className="flex items-end gap-4 mb-8">
              <span className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-2xl text-slate-400 line-through mb-2 font-medium">${product.compareAtPrice.toFixed(2)}</span>
              )}
            </div>
            
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-3 mb-10">
              {product.sku && (
                <span className="bg-white backdrop-blur-md text-slate-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-slate-200/60 shadow-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
                  SKU: {product.sku}
                </span>
              )}
              {product.stock > 0 ? (
                <span className="bg-emerald-50/80 backdrop-blur-md text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-200/60 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Stock Disponible ({product.stock})
                </span>
              ) : (
                <span className="bg-red-50/80 backdrop-blur-md text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-red-200/60 shadow-sm">
                  Agotado
                </span>
              )}
            </div>

            <button className="w-full py-5 px-8 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white text-xl font-bold rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:translate-y-0 flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Contactar Asesor por WhatsApp
            </button>
          </div>

          {/* Ficha Técnica Tabular (Premium) */}
          {Object.keys(specsObj).length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 p-8 shadow-sm mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                Especificaciones Técnicas
              </h2>
              <div className="divide-y divide-slate-100">
                {Object.entries(specsObj).map(([key, value], idx) => (
                  <div key={key} className="py-4 flex flex-col sm:flex-row sm:justify-between gap-2 group hover:bg-slate-50/50 transition-colors rounded-lg px-2">
                    <span className="font-semibold text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-slate-900 text-right font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Descripción Dinámica (Con Imágenes del Scraper) o Mega Banner */}
      {product.name.toLowerCase().includes('nitro') ? (
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <AcerNitroBanner />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 mt-20">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/50 p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.03)] prose prose-lg prose-blue max-w-none prose-img:rounded-[2rem] prose-img:shadow-xl prose-img:mx-auto prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 transition-all">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-10 pb-6 border-b border-slate-100 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              </span>
              Detalles del Equipo
            </h2>
            {/* El parser se encargará de inyectar los tags <img> reales que haya encontrado el scraper */}
            {parse(descriptionHtml)}
          </div>
        </div>
      )}

    </div>
  );
}
