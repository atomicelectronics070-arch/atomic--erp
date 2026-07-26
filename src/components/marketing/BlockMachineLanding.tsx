'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BlockMachineLanding({ products }: { products: any[] }) {
  const whatsappNumber = "593969043453";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Atomic, requiero cotización y asesoría técnica de nivel industrial sobre sus plantas concreteras y formadoras de bloques.')}`;

  return (
    <div className="bg-transparent min-h-screen text-white font-sans selection:bg-amber-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-32 border-b border-white/[0.02]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/90 to-[#050505] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?q=80&w=2070&auto=format&fit=crop" 
            alt="Construcción Industrial" 
            className="w-full h-full object-cover opacity-[0.15] mix-blend-luminosity grayscale"
          />
        </div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 font-bold text-[9px] tracking-[0.4em] mb-8 uppercase drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Línea Industrial Premium</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-none text-white">
              EL PODER DE <br /><span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-yellow-700 italic pr-4">FABRICAR.</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-16 font-light leading-relaxed tracking-wide">
              Equipamiento de grado industrial para la masificación de bloques de hormigón. Capacidades masivas, ingeniería de precisión y rentabilidad absoluta.
            </p>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:border-amber-500/30 backdrop-blur-md group"
            >
              <span>Contactar Ingeniería</span>
              <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center group-hover:bg-amber-400 transition-colors">→</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. ¿QUÉ TAMAÑOS Y TIPOS SE PUEDEN HACER? */}
      <section className="py-32 relative z-10 bg-[#050505] border-b border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <p className="text-amber-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Ingeniería Multi-Propósito</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4 text-white">
              Capacidades <span className="font-black italic text-neutral-500">Ilimitadas</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2rem] hover:border-amber-500/30 transition-all duration-700 hover:bg-white/[0.04] group relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors"></div>
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-8 text-xl shadow-lg relative z-10 text-neutral-400 group-hover:text-amber-500 transition-colors">🧱</div>
              <h3 className="text-2xl font-black tracking-tight mb-4 text-white relative z-10">Bloques Huecos</h3>
              <p className="text-neutral-500 mb-8 font-light relative z-10">Estructuras ligeras y de alta resistencia. Ahorro sustancial de material y óptimo desempeño sismo-resistente.</p>
              <ul className="text-[11px] font-black tracking-widest text-neutral-400 space-y-3 uppercase relative z-10">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Estándar</span> <span className="text-amber-500">400x200x200</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Medio</span> <span className="text-amber-500">400x150x200</span></li>
                <li className="flex justify-between pb-2"><span>Delgado</span> <span className="text-amber-500">400x100x200</span></li>
              </ul>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2rem] hover:border-amber-500/30 transition-all duration-700 hover:bg-white/[0.04] group relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors"></div>
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-8 text-xl shadow-lg relative z-10 text-neutral-400 group-hover:text-amber-500 transition-colors">🏗️</div>
              <h3 className="text-2xl font-black tracking-tight mb-4 text-white relative z-10">Adoquines Paving</h3>
              <p className="text-neutral-500 mb-8 font-light relative z-10">Fabricación en masa para obra pública y privada. Aceras, parques y zonas de rodamiento vehicular pesado.</p>
              <ul className="text-[11px] font-black tracking-widest text-neutral-400 space-y-3 uppercase relative z-10">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Rectangular</span> <span className="text-amber-500">200x100x60</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Diseño</span> <span className="text-amber-500">Zig-Zag</span></li>
                <li className="flex justify-between pb-2"><span>Geometría</span> <span className="text-amber-500">Hexagonal</span></li>
              </ul>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2rem] hover:border-amber-500/30 transition-all duration-700 hover:bg-white/[0.04] group relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors"></div>
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-8 text-xl shadow-lg relative z-10 text-neutral-400 group-hover:text-amber-500 transition-colors">🧩</div>
              <h3 className="text-2xl font-black tracking-tight mb-4 text-white relative z-10">Interlocking</h3>
              <p className="text-neutral-500 mb-8 font-light relative z-10">Sistema tipo "Lego" ecológico de alta compresión (Suelo-Cemento). Elimina el uso de mortero en las juntas.</p>
              <ul className="text-[11px] font-black tracking-widest text-neutral-400 space-y-3 uppercase relative z-10">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Sólido</span> <span className="text-amber-500">240x115x53</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Ecológico</span> <span className="text-amber-500">Suelo-Cemento</span></li>
                <li className="flex justify-between pb-2"><span>Vial</span> <span className="text-amber-500">Bordillos</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ¿QUÉ INCLUYE LA INVERSIÓN? */}
      <section className="py-32 bg-[#050505] relative border-b border-white/[0.02] overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-20 max-w-2xl">
            <p className="text-amber-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Línea de Producción</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6 text-white leading-tight">
              Ecosistema Operativo <span className="font-black italic text-neutral-500 block">Llave en Mano</span>
            </h2>
            <p className="text-neutral-400 text-lg font-light">
              Nuestros equipos industriales no son simples máquinas; son plantas completas diseñadas para operar desde el día uno con eficiencia implacable.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="text-amber-500 font-mono text-sm mb-4">01.</div>
                <h4 className="text-xl font-black text-white mb-3">Mezcladora</h4>
                <p className="text-sm text-neutral-500 font-light">Equipos obligatorios de doble eje (JD350/JS500) para mezclas ultra homogéneas.</p>
              </div>
              <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-colors group mt-0 sm:mt-12">
                <div className="text-amber-500 font-mono text-sm mb-4">02.</div>
                <h4 className="text-xl font-black text-white mb-3">Banda Transportadora</h4>
                <p className="text-sm text-neutral-500 font-light">Automatización del flujo de material crudo directo a la tolva principal.</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/20 to-transparent p-8 rounded-3xl border border-amber-500/30 group">
                <div className="text-amber-400 font-mono text-sm mb-4">03.</div>
                <h4 className="text-xl font-black text-amber-500 mb-3 drop-shadow-md">Host Machine</h4>
                <p className="text-sm text-neutral-400 font-light">Prensa vibratoria hidráulica. El corazón de la línea, capaz de ejercer presiones masivas.</p>
              </div>
              <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-colors group mt-0 sm:mt-12">
                <div className="text-amber-500 font-mono text-sm mb-4">04.</div>
                <h4 className="text-xl font-black text-white mb-3">Matrices & Logística</h4>
                <p className="text-sm text-neutral-500 font-light">Moldes de acero endurecido y carritos de transporte de paletas para la obra terminada.</p>
              </div>
            </div>
            
            <div className="relative rounded-[2rem] overflow-hidden bg-neutral-900 aspect-square border border-white/5 p-2 lg:ml-12 mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-[#050505]/50"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                  <p className="text-amber-500 font-mono text-[10px] uppercase tracking-widest mb-2">Transformación de Materia</p>
                  <p className="text-white font-medium text-lg">Convierte residuos de construcción y agregados en capital líquido con la mayor eficiencia del mercado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CATÁLOGO INTEGRADO */}
      <section className="py-32 bg-[#050505]" id="catalogo">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div>
              <p className="text-amber-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Catálogo de Equipamiento</p>
              <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">
                Maquinaria <span className="font-black italic text-neutral-500">Disponible</span>
              </h2>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-600 border-b border-neutral-800 pb-1">
              Importación y Entrega Técnica
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((p) => (
              <Link href={`/web/product/${p.id}`} key={p.id}>
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/40 hover:bg-white/[0.04] transition-all duration-500 group flex flex-col sm:flex-row gap-8 relative h-full">
                  
                  {/* Imagen del Catálogo (Youtube thumbnail extraído en BBDD) */}
                  <div className="w-full sm:w-48 h-48 sm:h-auto rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10"></div>
                    <img 
                      src={p.images ? JSON.parse(p.images)[0] : "https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?q=80&w=2070"} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="inline-block px-3 py-1 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-4 group-hover:border-amber-500/30 group-hover:text-amber-500 transition-colors">
                        Industrial Grade
                      </div>
                      <h3 className="text-xl font-black text-white mb-4 leading-tight italic uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-amber-500 transition-all">
                        {p.name}
                      </h3>
                      <p className="text-neutral-500 text-xs font-light line-clamp-3 mb-6">
                        {p.description ? p.description.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : "Equipo industrial de alta compresión hidráulica para la masificación y optimización de materiales prefabricados."}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="font-mono text-amber-500 text-lg font-black tracking-tighter">
                        ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 group-hover:text-white transition-colors">
                        <span className="mr-3">Explorar</span>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                          →
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-32 border border-dashed border-white/10 rounded-[2rem] text-neutral-600 font-light">
              No se encontró equipamiento en la base de datos de producción.
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
