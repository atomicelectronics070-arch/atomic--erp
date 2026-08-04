import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // No cache for immediate updates

export default async function HonorMagic7Page() {

  // Producto estrella: Honor Magic 7 Lite 5G
  const dbProduct = await prisma.product.findFirst({
    where: {
      sku: 'HONOR-MAGIC-7-LITE',
      isDeleted: false,
    },
  }) ?? await prisma.product.findFirst({
    where: {
      name: { contains: 'Honor Magic 7', mode: 'insensitive' },
      isDeleted: false,
    },
  });

  // Base $380.00 + 15% margen = $437.00
  const costPrice = 380.00;
  const salePrice = dbProduct?.price || Math.round(costPrice * 1.15 * 100) / 100;
  const comparePrice = dbProduct?.compareAtPrice || 499.00;

  const heroProduct = {
    id: dbProduct?.id || 'honor-magic-7-default',
    name: 'Honor Magic 7 Lite 5G',
    sku: 'HONOR-MAGIC-7-LITE',
    price: salePrice,
    compareAtPrice: comparePrice,
    stock: dbProduct?.stock || 15,
  };

  const heroImg = 'https://www.importadoracel.com/wp-content/uploads/2025/02/Importadora-Cel-Honor-Magic-7-Lite-1.jpg';

  // Obtener otros smartphones del catálogo de la DB sin repetir el héroe
  const otherPhones = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'honor', mode: 'insensitive' } },
        { name: { contains: 'samsung', mode: 'insensitive' } },
        { name: { contains: 'iphone', mode: 'insensitive' } },
        { name: { contains: 'infinix', mode: 'insensitive' } },
        { name: { contains: 'huawei', mode: 'insensitive' } },
        { name: { contains: 'xiaomi', mode: 'insensitive' } },
        { name: { contains: 'redmi', mode: 'insensitive' } },
      ],
      NOT: { sku: 'HONOR-MAGIC-7-LITE' },
      isDeleted: false,
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

  return (
    // -mt-32 cancela el pt-32 del layout para hero full screen
    <div className="-mt-32 overflow-x-hidden font-sans bg-[#080808]">

      {/* =========== HERO SECTION =========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#080808] to-[#080808]">
        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[180px] -translate-y-1/3" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] translate-y-1/4" />
        </div>

        {/* Tech Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-32 pt-40">

          {/* COLUMNA IZQUIERDA: TEXTO & PRECIO */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-5 py-2.5 text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Nuevo LLegada 2025 · Serie Flagship
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight text-white">
                HONOR<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                  MAGIC 7 LITE
                </span><br />
                <span className="text-3xl md:text-4xl tracking-widest text-zinc-300">5G EDITION</span>
              </h1>
              <p className="text-zinc-500 text-xs mt-3 font-mono">
                {heroProduct.name} · SKU: {heroProduct.sku}
              </p>
            </div>

            <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg">
              Resistencia anticaídas de nivel superior, pantalla AMOLED curva a <strong className="text-white">120Hz</strong>, cámara ultra nítida de <strong className="text-white">108 MP</strong> y una bestial súper batería de <strong className="text-blue-400">6600 mAh</strong>.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: '6.78"', label: 'AMOLED 120Hz' },
                { val: '108 MP', label: 'Cámara Ultra' },
                { val: '6600mAh', label: 'Super Batería' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-black text-blue-400">{s.val}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Precio + Margen 15% + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Precio Promocional (15% Margen)</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-white">
                    ${heroProduct.price.toFixed(2)}
                  </span>
                  <span className="text-xl text-zinc-600 line-through">
                    ${heroProduct.compareAtPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-bold mt-1">IVA Incluido · Incluye Margen 15%</div>
              </div>
              <a
                href={`https://wa.me/593969043453?text=Hola%2C%20quiero%20comprar%20el%20*${encodeURIComponent(heroProduct.name)}*%20(SKU%3A%20${heroProduct.sku})%20al%20precio%20de%20%24${heroProduct.price.toFixed(2)}`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-lg rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.6)] transition-all hover:-translate-y-1 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Pedir por WhatsApp
              </a>
            </div>

            {/* Badges */}
            <div className="flex gap-3 flex-wrap">
              <span className="text-xs font-mono text-zinc-400 border border-zinc-800 px-3 py-1.5 rounded-full">
                SKU: HONOR-MAGIC-7-LITE
              </span>
              <span className="text-xs font-bold text-emerald-400 border border-emerald-800/50 bg-emerald-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En Stock Inmediato
              </span>
              <span className="text-xs font-bold text-blue-400 border border-blue-800/50 bg-blue-500/10 px-3 py-1.5 rounded-full">
                🛡️ Certificación IP64
              </span>
            </div>
          </div>

          {/* COLUMNA DERECHA: FOTO DEL PRODUCTO */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-[90px]" />
            <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm shadow-2xl">
              <img
                src={heroImg}
                alt="Honor Magic 7 Lite 5G"
                className="w-full max-w-sm mx-auto object-contain drop-shadow-[0_30px_60px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute top-6 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl rotate-3">
              ⚡ MagicOS 8.0
            </div>
            <div className="absolute bottom-6 left-2 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl">
              🔋 6600 mAh Súper Batería
            </div>
          </div>
        </div>
      </section>

      {/* =========== SPECS STRIP =========== */}
      <section className="py-16 bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: '📱', label: 'Pantalla', val: '6.78" AMOLED 120Hz' },
            { icon: '⚡', label: 'Procesador', val: 'Snapdragon 6 Gen 1' },
            { icon: '📸', label: 'Cámara Principal', val: '108 MP Ultra-Clara' },
            { icon: '🔋', label: 'Batería & Carga', val: '6600 mAh · 66W' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-xl font-black text-blue-400 mb-1">{s.val}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =========== FEATURES =========== */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              ¿Por qué el <span className="text-blue-400">Honor Magic 7 Lite</span> es imbatible?
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Diseñado para durar más, resistir golpes y ofrecer fotografía profesional en 5G.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔋', title: 'Batería Masiva 6600 mAh', desc: 'Hasta 2 días de uso continuo. Disfruta juegos, streaming y redes sin preocuparte por el cargador.' },
              { icon: '📸', title: 'Sensor de 108 MP', desc: 'Captura detalles ultra nítidos en cualquier condición de luz. Fotos profesionales listas para redes.' },
              { icon: '🛡️', title: 'Resistencia Ultra Anticaídas', desc: 'Estructura reinforced multidireccional con protección IP64 contra agua y polvo.' },
              { icon: '⚡', title: 'Snapdragon 6 Gen 1 (4nm)', desc: 'Procesador de 4nm ultra eficiente con tecnología 5G para multitarea rápida y fluida.' },
              { icon: '🎨', title: 'Pantalla Curva AMOLED 120Hz', desc: '1.070 millones de colores con atenuación PWM a alta frecuencia para cuidar tu vista.' },
              { icon: '💾', title: '8GB RAM + 8GB Turbo / 256GB', desc: 'Tecnología RAM Turbo que amplía la memoria a 16GB de RAM efectiva para máxima fluidez.' },
            ].map((f) => (
              <div key={f.title} className="group bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-300">
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== CATALOGO DE OTROS CELULARES EN ATOMIC (CON 15% MARGEN) =========== */}
      {otherPhones.length > 0 && (
        <section className="py-20 px-6 bg-[#080808] border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Más Smartphones y Celulares
              </h2>
              <p className="text-zinc-500 text-base">Explora todo el catálogo de telefonía en Atomic (Precios de Venta Público con 15% de margen aplicado).</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {otherPhones.map((c) => {
                const img = getImage(c);
                return (
                  <Link
                    key={c.id}
                    href={`/web/product/${c.id}`}
                    className="group bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-white/5 flex items-center justify-center p-4 overflow-hidden">
                      <img
                        src={img}
                        alt={c.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                        {c.name}
                      </h3>
                      <div className="text-blue-400 font-black text-lg">${c.price.toFixed(2)}</div>
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
