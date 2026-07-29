import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import parse from 'html-react-parser';
import Link from 'next/link';

export const revalidate = 60;

export default async function CampanaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const prisma = new PrismaClient();
  
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!product) notFound();

  // Galería de fotos
  let photos: string[] = [];
  if (product.images) {
    try { photos = JSON.parse(product.images); } catch (e) {}
  }
  const primaryImage = photos.length > 0 ? photos[0] : '/img/placeholder.png';

  // Descripción HTML
  const descriptionHtml = product.description || '<p>Contacta a nuestro asesor para obtener la ficha técnica completa de este modelo.</p>';

  // Specs estructuradas
  let specsObj: Record<string, string> = {};
  if (product.specs) {
    try { specsObj = JSON.parse(product.specs); } catch (e) {}
  }

  // Etiquetas amigables para las keys de specs
  const SPEC_LABELS: Record<string, string> = {
    tipo: 'Tipo de Campana',
    motor: 'Potencia del Motor',
    caudal_extraccion: 'Capacidad de Extracción',
    velocidades: 'Velocidades / Control',
    ancho: 'Ancho',
    filtros: 'Sistema de Filtros',
    material: 'Material del Cuerpo',
    iluminacion: 'Iluminación',
    instalacion: 'Tipo de Instalación',
    voltaje: 'Voltaje',
    garantia: 'Garantía',
    marca: 'Marca',
    acabado: 'Acabado / Color',
    color: 'Color',
    extras: 'Características Adicionales',
  };

  // Iconos por tipo de spec
  const SPEC_ICONS: Record<string, string> = {
    tipo: '🏷️',
    motor: '⚡',
    caudal_extraccion: '💨',
    velocidades: '🎛️',
    ancho: '📐',
    filtros: '🧹',
    material: '🔩',
    iluminacion: '💡',
    instalacion: '🔧',
    voltaje: '🔌',
    garantia: '🛡️',
    marca: '🏢',
    acabado: '🎨',
    color: '🎨',
    extras: '✨',
  };

  const hasSpecs = Object.keys(specsObj).length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center text-sm text-slate-500 gap-2">
          <Link href="/web/campanas" className="hover:text-blue-600 font-medium transition-colors">← Catálogo de Campanas</Link>
          <span>/</span>
          <span className="truncate max-w-md text-slate-800 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid lg:grid-cols-2 gap-16">
        
        {/* ===== COLUMNA IZQUIERDA: Galería ===== */}
        <div className="space-y-5">
          {/* Foto Principal */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm aspect-square flex items-center justify-center relative overflow-hidden group">
            <img 
              src={primaryImage} 
              alt={product.name} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            {/* Badge tipo */}
            {specsObj.tipo && (
              <div className="absolute top-5 left-5 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                {specsObj.tipo}
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="bg-white p-1.5 rounded-xl border border-slate-200 aspect-square flex items-center justify-center hover:border-blue-500 cursor-pointer transition-all shadow-sm hover:shadow-md">
                  <img src={photo} alt={`${product.name} - ${i + 1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}

          {/* Badge de garantía */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="text-3xl">🛡️</div>
            <div>
              <p className="text-white font-bold text-sm">Garantía de Fábrica</p>
              <p className="text-slate-400 text-xs mt-0.5">{specsObj.garantia || '1 año en piezas'} · Marca {specsObj.marca || 'Banco del Perno'}</p>
            </div>
          </div>
        </div>

        {/* ===== COLUMNA DERECHA: Info + Specs ===== */}
        <div className="flex flex-col gap-8">

          {/* Header del producto */}
          <div>
            {specsObj.marca && (
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{specsObj.marca}</div>
            )}
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">{product.name}</h1>
            
            {/* Precio */}
            <div className="flex items-end gap-4 mb-6">
              <span className="text-5xl font-black text-blue-600">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-2xl text-slate-400 line-through mb-1">${product.compareAtPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Badges meta */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.sku && (
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-mono border border-slate-200">
                  SKU: {product.sku}
                </span>
              )}
              {product.stock > 0 ? (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-bold border border-emerald-200">
                  ✅ En Stock · {product.stock} disponibles
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-bold border border-red-200">
                  ❌ Sin stock
                </span>
              )}
              {specsObj.instalacion && (
                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-blue-200">
                  🔧 {specsObj.instalacion}
                </span>
              )}
            </div>

            {/* CTA WhatsApp */}
            <a
              href={`https://wa.me/593969043453?text=Hola%2C%20quisiera%20información%20sobre%20la%20*${encodeURIComponent(product.name)}*%20(SKU%3A%20${product.sku || 'N/A'})%20a%20%24${product.price.toFixed(2)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-5 bg-slate-900 hover:bg-black text-white text-lg font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Consultar por WhatsApp
            </a>
          </div>

          {/* ===== FICHA TÉCNICA VISUAL ===== */}
          {hasSpecs && (
            <div className="bg-white rounded-[1.75rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h2 className="text-white font-bold text-base tracking-wide">Ficha Técnica</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {Object.entries(specsObj)
                  .filter(([key]) => key !== 'extras') // extras va abajo
                  .map(([key, value]) => (
                    <div key={key} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <span className="text-sm font-semibold text-slate-500 flex items-center gap-2 min-w-[160px]">
                        <span>{SPEC_ICONS[key] || '•'}</span>
                        {SPEC_LABELS[key] || key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-slate-800 font-medium text-right">{String(value)}</span>
                    </div>
                  ))}
                {specsObj.extras && (
                  <div className="px-6 py-4 bg-blue-50">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">✨ Características adicionales</p>
                    <p className="text-sm text-slate-700">{specsObj.extras}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== DESCRIPCIÓN DETALLADA ===== */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-sm prose prose-lg prose-blue max-w-none prose-img:rounded-2xl prose-img:shadow-md prose-img:mx-auto prose-headings:text-slate-900 prose-headings:font-extrabold prose-h2:text-3xl prose-h3:text-xl prose-li:text-slate-700 prose-strong:text-slate-900">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 border-b border-slate-200 pb-4 flex items-center gap-3">
            <span>📄</span> Descripción Completa
          </h2>
          {parse(descriptionHtml)}
        </div>

        {/* CTA final */}
        <div className="mt-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-10 text-center shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-3">¿Listo para mejorar tu cocina?</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">Consulta disponibilidad, opciones de instalación y obtén el mejor precio con nuestros asesores.</p>
          <a
            href={`https://wa.me/593969043453?text=Hola%2C%20me%20interesa%20la%20*${encodeURIComponent(product.name)}*%20-%20%24${product.price.toFixed(2)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
          >
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Pedir Cotización por WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}
