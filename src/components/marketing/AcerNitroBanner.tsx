'use client';
import { motion, Variants } from 'framer-motion';

export default function AcerNitroBanner() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#0a0a0a] text-white overflow-hidden rounded-[2.5rem] mt-16 shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/5 relative">
      
      {/* Luces de Neón de Fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      
      {/* 1. HERO SECTION */}
      <div className="relative pt-24 pb-32 px-6 lg:px-20 flex flex-col items-center text-center border-b border-white/10 overflow-hidden">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="relative z-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-sm tracking-widest mb-6">
            SERIE NITRO V 16
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500">
            MÁS ALLÁ DEL <br/>RENDIMIENTO.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Diseñada para aplastar cualquier juego. Potenciada por la 14ª Gen de Intel y la magia de la IA de NVIDIA.
          </p>
        </motion.div>
        
        {/* Decoración abstracta */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.15] mix-blend-overlay"
        />
      </div>

      {/* 2. PROCESADOR INTEL (AZUL) */}
      <div className="grid lg:grid-cols-2 border-b border-white/10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="p-12 lg:p-20 flex flex-col justify-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Intel_Core_i7_logo_%282020%29.svg/1024px-Intel_Core_i7_logo_%282020%29.svg.png" alt="Intel Core i7" className="w-24 mb-8 opacity-90 brightness-200" />
          <h3 className="text-4xl font-extrabold mb-4 text-white">Intel® Core™ i7 <span className="text-blue-500">14va Gen</span></h3>
          <p className="text-slate-400 text-lg mb-6 leading-relaxed">
            Arquitectura híbrida de máximo rendimiento. Distribuye inteligentemente las tareas entre los <strong>P-Cores (Rendimiento)</strong> y los <strong>E-Cores (Eficiencia)</strong> para que juegues, grabes y transmitas sin caídas de FPS.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <div className="text-3xl font-black text-blue-400">16</div>
              <div className="text-sm text-slate-400 font-medium">NÚCLEOS (8P + 8E)</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <div className="text-3xl font-black text-blue-400">5.2</div>
              <div className="text-sm text-slate-400 font-medium">GHz FRECUENCIA MAX</div>
            </div>
          </div>
        </motion.div>
        <div className="bg-[#050f24] relative overflow-hidden hidden lg:block">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] to-transparent"></div>
        </div>
      </div>

      {/* 3. GPU NVIDIA (VERDE) */}
      <div className="grid lg:grid-cols-2 border-b border-white/10">
        <div className="bg-[#0a1a0f] relative overflow-hidden hidden lg:block order-2 lg:order-1">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621081702598-a3fcf4d3c34a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
           <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] to-transparent"></div>
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="p-12 lg:p-20 flex flex-col justify-center order-1 lg:order-2">
          <h3 className="text-4xl font-extrabold mb-4 text-white">NVIDIA® GeForce <span className="text-[#76b900]">RTX™ 40 Series</span></h3>
          <p className="text-slate-400 text-lg mb-6 leading-relaxed">
            Descubre mundos hiperrealistas con Ray Tracing completo y multiplica tus FPS con <strong>NVIDIA DLSS 3.5</strong> impulsado por Inteligencia Artificial. La latencia más baja para ventajas competitivas insuperables.
          </p>
          <ul className="space-y-4 mt-2">
            <li className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#76b900]/20 flex items-center justify-center text-[#76b900]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="text-slate-300 font-semibold">Ray Tracing (Trazado de Rayos)</span>
            </li>
            <li className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#76b900]/20 flex items-center justify-center text-[#76b900]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <span className="text-slate-300 font-semibold">NVIDIA DLSS 3.5 (IA)</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* 4. REFRIGERACIÓN Y PANTALLA */}
      <div className="p-12 lg:p-20 relative text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="max-w-3xl mx-auto">
          <h3 className="text-3xl lg:text-5xl font-black mb-8">Fría bajo presión. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Ultrarrápida a 165Hz.</span></h3>
          <p className="text-slate-400 text-lg mb-12">
            El sistema de doble ventilador mantiene tu Nitro V 16 fresca incluso en las partidas más intensas. Disfruta todo este poder en un panel WUXGA 16:10 de 165Hz para una ventaja visual letal y sin tearing (cortes de pantalla).
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="text-3xl font-black text-white mb-2">16"</div>
              <div className="text-xs text-slate-500 font-bold tracking-widest uppercase">PANTALLA WUXGA 16:10</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="text-3xl font-black text-white mb-2">165<span className="text-xl">Hz</span></div>
              <div className="text-xs text-slate-500 font-bold tracking-widest uppercase">TASA DE REFRESCO</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="text-3xl font-black text-white mb-2">Doble</div>
              <div className="text-xs text-slate-500 font-bold tracking-widest uppercase">VENTILADOR ACTIVO</div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
