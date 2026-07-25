'use client';
import { motion } from 'framer-motion';

export default function NfcEcoFriendly() {
  return (
    <section className="py-32 bg-[#0A1A12] text-white relative overflow-hidden border-t border-emerald-900/50">
      {/* Organic glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-8">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Tecnología que <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Salva al Planeta</span>
          </h2>
          <p className="text-xl text-emerald-100/70 mb-8 font-light leading-relaxed">
            Cada año se talan más de 7 millones de árboles solo para imprimir tarjetas de presentación. El 88% de ellas terminan en la basura en menos de una semana.
          </p>
          <p className="text-xl text-emerald-100/70 font-light leading-relaxed mb-10">
            Al migrar a Menús Digitales y Smart Cards NFC, tu negocio no solo luce más moderno, sino que reduce su huella de carbono a cero. Un solo acrílico reemplaza miles de impresiones mensuales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl font-black text-emerald-400 mb-2">-100%</div>
              <div className="text-sm text-emerald-100/60 uppercase tracking-widest">Gasto en Papelería</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl font-black text-teal-400 mb-2">1 Vida</div>
              <div className="text-sm text-emerald-100/60 uppercase tracking-widest">Útil Ilimitada</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[600px] rounded-[3rem] overflow-hidden border border-emerald-500/20 shadow-2xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop" 
            alt="Eco friendly" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A12] via-[#0A1A12]/40 to-transparent"></div>
          
          <div className="absolute bottom-12 left-12 right-12">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-2">Certificación Verde</h3>
              <p className="text-emerald-100/70">Tus clientes valorarán enormemente tu iniciativa de digitalizar los procesos para proteger el medio ambiente.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
