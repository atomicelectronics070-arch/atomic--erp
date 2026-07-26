'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BlockMachineLanding({ products }: { products: any[] }) {
  const whatsappNumber = "593969043453";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Atomic, estoy interesado en asesoría sobre las máquinas para hacer bloques y los componentes que incluye. ¿Podemos hablar?')}`;

  return (
    <div className="bg-[#030712] min-h-screen text-white font-sans selection:bg-orange-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/10 via-[#030712]/80 to-[#030712] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?q=80&w=2070&auto=format&fit=crop" 
            alt="Construcción Industrial" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 font-bold text-sm tracking-[0.2em] mb-8 uppercase">
              Guía Técnica Especializada
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-tight">
              EL PODER DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">FABRICAR.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              Todo lo que necesitas saber sobre nuestras líneas de producción de bloques de concreto: Capacidades, tamaños, qué incluyen y cómo rentabilizar tu inversión.
            </p>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-slate-900 px-8 py-4 rounded-full font-black text-lg transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105"
            >
              Contactar Asesor por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. ¿QUÉ TAMAÑOS Y TIPOS SE PUEDEN HACER? */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Tipos y Tamaños <span className="text-orange-500">Admitidos</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl">
              Nuestras máquinas (como la serie QTJ4-35) son multi-propósito. Cambiando el molde puedes fabricar una variedad infinita de piezas para construcción.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:border-orange-500/30 transition-colors">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-3xl">🧱</div>
              <h3 className="text-2xl font-bold mb-4">Bloques Huecos</h3>
              <p className="text-slate-400 mb-6">Ideales para muros de contención y divisiones. Ahorran material y aligeran estructuras.</p>
              <ul className="text-sm font-bold text-orange-400 space-y-2">
                <li>• Estándar: 400 x 200 x 200 mm</li>
                <li>• Medio: 400 x 150 x 200 mm</li>
                <li>• Delgado: 400 x 100 x 200 mm</li>
              </ul>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:border-orange-500/30 transition-colors">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-3xl">🏗️</div>
              <h3 className="text-2xl font-bold mb-4">Adoquines (Paving)</h3>
              <p className="text-slate-400 mb-6">Perfectos para aceras, parques, entradas vehiculares y zonas peatonales pesadas.</p>
              <ul className="text-sm font-bold text-orange-400 space-y-2">
                <li>• Rectangular: 200 x 100 x 60 mm</li>
                <li>• Tipo Zig-Zag o Hueso</li>
                <li>• Hexagonales y Cruz</li>
              </ul>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:border-orange-500/30 transition-colors">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-3xl">🧩</div>
              <h3 className="text-2xl font-bold mb-4">Macizos e Interlocking</h3>
              <p className="text-slate-400 mb-6">Ladrillos sólidos de alta resistencia y bloques tipo "Lego" que no requieren mortero en juntas.</p>
              <ul className="text-sm font-bold text-orange-400 space-y-2">
                <li>• Ladrillo Macizo: 240 x 115 x 53 mm</li>
                <li>• Bloque Interlocking (Suelo Cemento)</li>
                <li>• Bordillos para Carreteras</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ¿QUÉ INCLUYE LA INVERSIÓN? */}
      <section className="py-24 bg-slate-950 relative border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
              Línea de Producción <span className="text-orange-500">Completa</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto">
              Cuando adquieres una de nuestras maquinarias, no solo compras el vibrador principal. Adquieres una fábrica lista para operar. (Aplica a configuraciones QT4 / Automáticas).
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 flex flex-col justify-center min-h-[200px]">
                <h4 className="text-xl font-bold text-white mb-2">1. Mezcladora (Mixer)</h4>
                <p className="text-sm text-slate-400">Mezcladora industrial (ej. JD350/JS500) que garantiza la mezcla homogénea de arena, cemento y ripio.</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 flex flex-col justify-center min-h-[200px] mt-8">
                <h4 className="text-xl font-bold text-white mb-2">2. Banda Transportadora</h4>
                <p className="text-sm text-slate-400">Automatiza la alimentación del material desde la mezcladora hacia la tolva de la máquina principal.</p>
              </div>
              <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20 flex flex-col justify-center min-h-[200px]">
                <h4 className="text-xl font-bold text-orange-400 mb-2">3. Formadora Principal</h4>
                <p className="text-sm text-slate-300">El corazón del sistema. Prensa y vibra hidráulica/mecánicamente para crear bloques de alta densidad.</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 flex flex-col justify-center min-h-[200px] mt-8">
                <h4 className="text-xl font-bold text-white mb-2">4. Moldes y Carritos</h4>
                <p className="text-sm text-slate-400">Incluye 1 molde estándar (intercambiable) y carritos de transporte manual para las paletas (pallets) con bloques frescos.</p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-square border border-white/10 flex items-center justify-center p-8">
                {/* Imagen Representativa de Planta */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-3xl font-black uppercase text-white mb-4 drop-shadow-xl">Configuración Llave en Mano</h3>
                  <p className="text-lg text-slate-200 font-medium drop-shadow-xl">Convierte residuos de construcción, ceniza, escoria y agregados en bloques altamente rentables.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOPORTE TÉCNICO Y GARANTÍA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-black rounded-[3rem] p-12 lg:p-20 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">Soporte Técnico Especializado</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-orange-500 font-black text-5xl mb-4">01</div>
                  <h4 className="text-xl font-bold mb-2">Garantía</h4>
                  <p className="text-slate-400">1 año de garantía estructural y de motores (componentes principales). Respaldo directo de fábrica.</p>
                </div>
                <div>
                  <div className="text-orange-500 font-black text-5xl mb-4">02</div>
                  <h4 className="text-xl font-bold mb-2">Capacitación</h4>
                  <p className="text-slate-400">Manuales en español, diagramas de cimientos y videos de instalación. Opción a asesoría técnica remota o presencial según modelo.</p>
                </div>
                <div>
                  <div className="text-orange-500 font-black text-5xl mb-4">03</div>
                  <h4 className="text-xl font-bold mb-2">Repuestos</h4>
                  <p className="text-slate-400">Abastecimiento continuo de repuestos y diseño de moldes personalizados a la medida de tu proyecto (bloques logo, estriados, etc).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CATÁLOGO INTEGRADO */}
      <section className="py-24 bg-[#010308] border-t border-white/5" id="catalogo">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
                Equipos <span className="text-orange-500">Disponibles</span>
              </h2>
              <p className="text-slate-400">Nuestros modelos industriales para entrega e importación.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <Link href={`/web/product/${p.id}`} key={p.id}>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-300 group h-full flex flex-col relative">
                  
                  <div className="absolute top-6 right-6 bg-orange-500 text-slate-900 font-bold px-4 py-2 rounded-full text-sm z-10 shadow-lg">
                    ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors uppercase pr-20">
                      {p.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                      {p.description || "Máquina industrial formadora de bloques. Sistema de alta presión para máxima rentabilidad."}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                    <span>Ver Detalles</span>
                    <span className="group-hover:translate-x-2 transition-transform text-orange-500">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl text-slate-500">
              No se encontraron máquinas de bloques en la base de datos en este momento.
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
