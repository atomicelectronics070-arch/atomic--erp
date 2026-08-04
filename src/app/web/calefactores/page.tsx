import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";
export const revalidate = 0; // No cache for immediate updates

export default async function CalefactorCilindroBLACKPage() {
  const prisma = new PrismaClient();

  // Producto estrella: Calefactor de Ambientes Tipo Cilindro Base Black (SKU: BPA0627)
  const dbProduct = await prisma.product.findFirst({
    where: {
      sku: 'BPA0627',
      isDeleted: false,
    },
  }) ?? await prisma.product.findFirst({
    where: {
      name: { contains: 'Cilindro Base Black', mode: 'insensitive' },
      isDeleted: false,
    },
  });

  // Base $199.99 + 15% margen = $229.99
  const salePrice = dbProduct?.price && dbProduct.price > 200 ? dbProduct.price : 229.99;
  const comparePrice = dbProduct?.compareAtPrice || 269.99;

  const heroProduct = {
    id: dbProduct?.id || 'bpa0627-default',
    name: 'Calefactor de Ambientes Tipo Cilindro Base Black',
    sku: 'BPA0627',
    price: salePrice,
    compareAtPrice: comparePrice,
    stock: dbProduct?.stock || 10,
  };

  // Imagen oficial exacta del Cilindro Base Black (BPA0627-1.webp)
  const heroImg = 'https://bpecuador.com/wp-content/uploads/2025/05/BPA0627-1.webp';

  // SKUs oficiales BP Ecuador
  const validSkus = [
    'BPA0627', 'BPA0629', 'BPA0628', 'BPA0354', 'BPA0355',
    'BPA0801', 'BPA0352', 'BPA0800', 'BPA0353', 'BPA0351',
    'BPA0356', 'BPA0357'
  ];

  // Resto de calefactores (con 15% margen)
  const otherHeatersDB = await prisma.product.findMany({
    where: {
      sku: { in: validSkus },
      NOT: { sku: 'BPA0627' },
      isDeleted: false,
    },
    orderBy: { price: 'desc' },
  });

  const getImage = (p: any): string => {
    if (!p?.images) return '/img/placeholder.png';
    try {
      const arr = JSON.parse(p.images);
      return arr[0] || '/img/placeholder.png';
    } catch { return '/img/placeholder.png'; }
  };

  return (
    // -mt-32 cancela el pt-32 del layout para que el hero sea full screen
    <div className="-mt-32 overflow-x-hidden font-sans">

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
              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight text-white">
                CALEFACTOR<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-amber-400">
                  CILINDRO
                </span><br />
                <span className="text-3xl md:text-4xl tracking-widest text-zinc-300">BLACK EDITION</span>
              </h1>
              <p className="text-zinc-500 text-xs mt-3 font-mono">
                {heroProduct.name} · SKU: {heroProduct.sku}
              </p>
            </div>

            <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg">
              El calefactor perfecto para tu espacio. Diseño cilíndrico de base negra con acabado martillado de alta durabilidad que genera calor uniforme y potente en espacios de <strong className="text-white">5 a 10 m²</strong>.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: '5-10m²', label: 'Área de Calor' },
                { val: 'Gas', label: 'Combustible' },
                { val: 'Pulso', label: 'Encendido' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-orange-400">{s.val}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Precio + Margen + CTA */}
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
                href={`https://wa.me/593969043453?text=Hola%2C%20quiero%20información%20del%20*${encodeURIComponent(heroProduct.name)}*%20(SKU%3A%20BPA0627)%20a%20%24${heroProduct.price.toFixed(2)}`}
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
              <span className="text-xs font-mono text-zinc-400 border border-zinc-800 px-3 py-1.5 rounded-full">
                SKU: BPA0627
              </span>
              <span className="text-xs font-bold text-emerald-400 border border-emerald-800/50 bg-emerald-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En Stock
              </span>
              <span className="text-xs font-bold text-amber-400 border border-amber-800/50 bg-amber-500/10 px-3 py-1.5 rounded-full">
                🚚 Envío Gratis a Nivel Nacional
              </span>
            </div>
          </div>

          {/* IMAGEN OFICIAL EXACTA DEL PRODUCTO (BPA0627-1.webp) */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 bg-orange-500/15 rounded-full blur-[80px]" />
            <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <img
                src={heroImg}
                alt="Calefactor de Ambientes Tipo Cilindro Base Black"
                className="w-full max-w-sm mx-auto object-contain drop-shadow-[0_40px_80px_rgba(234,88,12,0.3)] hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute top-6 right-2 bg-orange-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl rotate-3">
              🔥 Black Edition
            </div>
            <div className="absolute bottom-6 left-2 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl">
              ✅ Gas Doméstico
            </div>
          </div>
        </div>
      </section>

      {/* =========== FEATURES =========== */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Por qué elegir el <span className="text-orange-400">Cilindro Base Black</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Ingeniería de calefacción residencial de alto rendimiento para terrazas, patios y exteriores.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔥', title: 'Calor Cilíndrico 360°', desc: 'El diseño cilíndrico irradia calor uniformemente en todas las direcciones. Sin puntos fríos.' },
              { icon: '⛽', title: 'Gas Doméstico', desc: 'Funciona con cilindro estándar de gas de uso doméstico. Cámara integrada con apertura de puerta.' },
              { icon: '🔆', title: 'Encendido de Pulso', desc: 'Sistema de encendido eléctrico de pulso confiable. Sin cerillas ni encendedores externos.' },
              { icon: '🏗️', title: 'Acero Negro Martillado', desc: 'Quemadores de acero inoxidable con revestimiento de polvo negro martillado ultra duradero.' },
              { icon: '🧯', title: 'Sistema de Seguridad', desc: 'Protección de punta integrada con apagado automático de llama en caso de inclinación.' },
              { icon: '🚶', title: 'Portátil y Flexible', desc: 'Fácil de trasladar a terrazas, patios o jardines. Lleva el calor exactamente a donde estés.' },
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
            { icon: '🌡️', label: 'Área de calentamiento', val: '5 – 10 m²' },
            { icon: '⛽', label: 'Combustible', val: 'Gas doméstico' },
            { icon: '🔆', label: 'Encendido', val: 'Pulso eléctrico' },
            { icon: '🏭', label: 'Marca', val: 'Banco del Perno' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-2xl font-black text-orange-400 mb-1">{s.val}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</div>
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
              Nuestros asesores te ayudan con instalación, modelos disponibles y envío a todo el Ecuador.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/593969043453?text=Hola%2C%20me%20interesa%20el%20*Calefactor%20Cilindro%20Base%20Black*%20a%20%24${heroProduct.price.toFixed(2)}`}
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

      {/* =========== OTROS CALEFACTORES BP ECUADOR (CON 15% MARGEN) =========== */}
      {otherHeatersDB.length > 0 && (
        <section className="py-20 px-6 bg-[#080808] border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Más Calefactores de Ambiente
              </h2>
              <p className="text-zinc-500 text-base">Toda la línea de calefacción residencial Banco del Perno (Precios de Venta Público con 15% de margen).</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {otherHeatersDB.map((c) => {
                const img = getImage(c);
                const displayPrice = c.price;
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
                      <div className="text-orange-400 font-black text-lg">${displayPrice.toFixed(2)}</div>
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
