'use client';
import { motion } from 'framer-motion';

export default function NfcSecurity() {
  return (
    <section className="py-24 bg-black text-white px-6 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono text-sm tracking-widest">
            SEGURIDAD BANCARIA
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            Tecnología Encriptada. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Datos Inquebrantables.</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            No utilizamos chips genéricos de baja calidad. Integrados con microcontroladores NTAG215/216 de NXP Semiconductors, garantizamos cifrado de 32 bits, protección contra escritura (Read-Only Locking) y clonación.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="border-l-2 border-rose-500 pl-4">
              <div className="text-3xl font-black text-white mb-1">NXP</div>
              <div className="text-sm text-slate-500">Certificación Original</div>
            </div>
            <div className="border-l-2 border-rose-500 pl-4">
              <div className="text-3xl font-black text-white mb-1">100K</div>
              <div className="text-sm text-slate-500">Ciclos de Lectura</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Hologram Effect Box */}
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 border border-rose-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-4 border-2 border-dashed border-orange-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute inset-10 bg-gradient-to-br from-rose-900/50 to-black rounded-full flex items-center justify-center border border-rose-500/10 shadow-[0_0_100px_rgba(225,29,72,0.2)]">
              <svg className="w-32 h-32 text-rose-500 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
