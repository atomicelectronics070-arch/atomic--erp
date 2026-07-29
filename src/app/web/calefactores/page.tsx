import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

export const revalidate = 60;

export default async function CalefactorCilindroBLACKPage() {
  const prisma = new PrismaClient();

  // Producto estrella: Calefactor Tipo Cilindro BLACK
  const hero = await prisma.product.findFirst({
    where: {
      AND: [
        { name: { contains: 'calefactor', mode: 'insensitive' } },
        {
          OR: [
            { name: { contains: 'cilindro', mode: 'insensitive' } },
            { name: { contains: 'black', mode: 'insensitive' } },
          ]
        },
        { isDeleted: false },
      ]
    },
    orderBy: { price: 'desc' },
  });

  // Fallback: el más caro
  const heroProduct = hero ?? await prisma.product.findFirst({
    where: {
      name: { contains: 'calefactor', mode: 'insensitive' },
      isDeleted: false,
    },
    orderBy: { price: 'desc' },
  });

  // Resto de calefactores
  const otherHeaters = await prisma.product.findMany({
    where: {
      name: { contains: 'calefactor', mode: 'insensitive' },
      isDeleted: false,
      NOT: { id: heroProduct?.id ?? '__none__' },
    },
    orderBy: { price: 'desc' },
    take: 20,
  });

  const getImage = (p: any): string => {
    if (!p?.images) return '/img/placeholder.png';
    try {
      const arr = JSON.parse(p.images);
      return arr[0] || '/img/placeholder.png';
    } catch { return '/img/placeholder.png'; }
  };

  const heroImg = getImage(heroProduct);

  return (
    // -mt-32 cancela el pt-32 del layout para que el hero sea full screen
    <div className="-mt-32 overflow-x-hidden">

      {/* =========== HERO SECTION =========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080808]">
        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[160px] -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-700/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />
        </div>

        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-32 pt-40">

          {/* TEXTO */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-5 py-2.5 text-orange-400 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Tecnología Residencial · Alta Potencia
            </div>

            <div>
              <h1 className="text-6xl md:text-7xl font-black leading-none tracking-tight text-white">
                CALEFACTOR<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-amber-400">
                  CILINDRO
                </span><br />
                <span className="text-4xl md:text-5xl tracking-widest">BLACK EDITION</span>
              </h1>
              {heroProduct?.name && (
                <p className="text-zinc-600 text-sm mt-2 font-mono">{heroProduct.name}</p>
              )}
            </div>

            <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
              El calefactor más potente de la línea Banco del Perno. Diseño cilíndrico de acero con acabado negro mate que genera calor intenso y envolvente para espacios de hasta <strong className="text-white">80 m²</strong>.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: '80m²', label: 'Cobertura' },
                { val: '3', label: 'Velocidades' },
                { val: '110V', label: 'Voltaje' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-orange-400">{s.val}</div>
                  <div className="text-xs text-zinc-600 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Precio + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div>
                <div className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Precio</div>
                <div className="text-5xl font-black text-white">
                  ${heroProduct?.price?.toFixed(2) ?? '—'}
                </div>
                {heroProduct?.compareAtPrice && (
                  <div className="text-lg text-zinc-700 line-through">${heroProduct.compareAtPrice.toFixed(2)}</div>
                )}
              </div>
              <a
                href={`https://wa.me/593969043453?text=Hola%2C%20quiero%20información%20del%20*${encodeURIComponent(heroProduct?.name ?? 'Calefactor Cilindro Black')}*%20a%20%24${heroProduct?.price?.toFixed(2)}`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-black text-lg rounded-2xl shadow-[0_8px_30px_rgba(234,88,12,0.4)] hover:shadow-[0_12px_40px_rgba(234,88,12,0.6)] transition-all hover:-translate-y-1 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Pedir por WhatsApp
              </a>
            </div>

            {/* Badges */}
            <div className="flex gap-3 flex-wrap">
              {heroProduct?.sku && (
                <span className="text-xs font-mono text-zinc-600 border border-zinc-800 px-3 py-1.5 rounded-full">
                  SKU: {heroProduct.sku}
                </span>
              )}
              {(heroProduct?.stock ?? 0) > 0 ? (
                <span className="text-xs font-bold text-emerald-400 border border-emerald-800/50 bg-emerald-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En Stock
                </span>
              ) : (
                <span className="text-xs font-bold text-red-400 border border-red-800/50 bg-red-500/10 px-3 py-1.5 rounded-full">Sin Stock</span>
              )}
              <span className="text-xs font-bold text-amber-400 border border-amber-800/50 bg-amber-500/10 px-3 py-1.5 rounded-full">🚚 Envío Gratis</span>
            </div>
          </div>

          {/* IMAGEN */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 bg-orange-500/15 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <img
                src={heroImg}
                alt={heroProduct?.name ?? 'Calefactor Cilindro Black'}
                className="w-full max-w-sm mx-auto drop-shadow-[0_40px_80px_rgba(234,88,12,0.25)] hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute top-8 right-4 bg-orange-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl rotate-3">
              🔥 Black Edition
            </div>
            <div className="absolute bottom-8 left-4 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl">
              ✅ Alta Potencia
            </div>
          </div>
        </div>
      </section>

      {/* =========== FEATURES =========== */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Por qué elegir el <span className="text-orange-400">Cilindro Black</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Ingeniería de calefacción residencial de alto rendimiento. Potente, duradero y con diseño que domina cualquier espacio.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔥', title: 'Calor Envolvente 360°', desc: 'Diseño cilíndrico que distribuye el calor de forma homogénea en toda la habitación, sin puntos fríos.' },
              { icon: '⚡', title: 'Motor de Alta Potencia', desc: 'Motor eficiente con bajo consumo eléctrico. Funciona a 110V - 60Hz en cualquier toma estándar.' },
              { icon: '🎛️', title: '3 Niveles de Temperatura', desc: 'Adapta la intensidad del calor según el clima y el tamaño del espacio con 3 velocidades de control.' },
              { icon: '🏗️', title: 'Cuerpo Acero Negro Mate', desc: 'Construido con acero de alta resistencia acabado negro mate. Resistente, higiénico y duradero.' },
              { icon: '🌿', title: 'Ecofriendly & Eficiente', desc: 'Maximiza el calor por BTU consumido. Menor impacto ambiental por temporada frente a soluciones convencionales.' },
              { icon: '🛡️', title: 'Garantía de Fábrica', desc: '1 año de garantía en piezas. Respaldado por Banco del Perno, mayor distribuidor de electrodomésticos del Ecuador.' },
            ].map((f) => (
              <div key={f.title} className="group bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-300">
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-orange-400 transition-colors">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== SPECS STRIP =========== */}
      <section className="py-16 bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: '🌡️', label: 'Cobertura máxima', val: 'hasta 80 m²' },
            { icon: '⚡', label: 'Voltaje', val: '110V · 60Hz' },
            { icon: '🎛️', label: 'Velocidades', val: '3 niveles' },
            { icon: '🏭', label: 'Marca', val: 'Banco del Perno' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-2xl font-black text-orange-400 mb-1">{s.val}</div>
              <div className="text-xs text-zinc-600 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =========== CTA =========== */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto relative bg-gradient-to-br from-orange-600/20 via-red-600/10 to-transparent border border-orange-500/20 rounded-[3rem] p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">¿Listo para calentar tu espacio?</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              Nuestros asesores te ayudan con instalación, modelos disponibles y el mejor precio del mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/593969043453?text=Hola%2C%20me%20interesa%20el%20*Calefactor%20Cilindro%20Black*%20a%20%24${heroProduct?.price?.toFixed(2)}`}
                target="_blank"
                rel="noreferrer"
                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg rounded-full shadow-[0_8px_30px_rgba(234,88,12,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Cotizar Ahora
              </a>
              <Link
                href="/web/products"
                className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-lg rounded-full transition-all flex items-center justify-center gap-2"
              >
                Ver Catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========== OTROS CALEFACTORES =========== */}
      {otherHeaters.length > 0 && (
        <section className="py-20 px-6 bg-[#080808] border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Más Calefactores de Ambiente
              </h2>
              <p className="text-zinc-500 text-base">Toda la línea de calefacción residencial Banco del Perno.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {otherHeaters.map((c) => {
                const img = getImage(c);
                return (
                  <Link
                    key={c.id}
                    href={`/web/product/${c.id}`}
                    className="group bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-orange-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-white/5 flex items-center justify-center p-4 overflow-hidden">
                      <img
                        src={img}
                        alt={c.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-orange-400 transition-colors">
                        {c.name}
                      </h3>
                      <div className="text-orange-400 font-black text-lg">${c.price.toFixed(2)}</div>
                      {c.stock > 0 ? (
                        <div className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />En stock
                        </div>
                      ) : (
                        <div className="text-[10px] text-red-500 font-semibold mt-1">Sin stock</div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
