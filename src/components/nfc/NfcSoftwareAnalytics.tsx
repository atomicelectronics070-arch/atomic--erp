'use client';
import { motion } from 'framer-motion';

export default function NfcSoftwareAnalytics() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-mono text-sm tracking-widest mb-6">
            ATOMIC SOFTWARE
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            No es solo Hardware. Es el <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Cerebro de tu Negocio.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed font-light">
            Nuestros chips NFC no son simples "enlaces". Están conectados directamente a un dashboard inteligente (CRM) diseñado por Atomic. Cada vez que alguien acerca su teléfono, registras data invaluable.
          </p>

          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Métricas en Tiempo Real</h4>
                <p className="text-slate-400 text-sm">Descubre cuántos escaneos recibe cada mesa o cada vendedor, a qué horas, y desde qué dispositivos.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Actualización en la Nube</h4>
                <p className="text-slate-400 text-sm">Cambiaste de precios o de WhatsApp? No necesitas comprar otro acrílico. Lo actualizas desde tu celular en 1 segundo.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Retargeting y Pixels</h4>
                <p className="text-slate-400 text-sm">Instalamos tu pixel de Facebook en el enlace NFC. Si un cliente escaneó el menú pero no compró, le enviaremos anuncios en Instagram esa misma noche.</p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }} 
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative perspective-1000"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
          <div className="relative bg-[#050505] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Window header */}
            <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <div className="ml-4 text-xs text-slate-500 font-mono">atomic-dashboard.io</div>
            </div>
            {/* Fake Dashboard Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Escaneos Hoy</div>
                  <div className="text-4xl font-black text-white">1,248 <span className="text-sm text-emerald-400 ml-2">↑ 24%</span></div>
                </div>
                <div className="w-32 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center">
                  <svg className="w-full h-full text-indigo-500 opacity-50" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0 30 L10 20 L20 25 L30 10 L40 15 L50 5 L60 12 L70 2 L80 8 L90 0 L100 15 L100 30 Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-slate-400 mb-2">Mesa Más Activa</div>
                  <div className="text-lg font-bold text-white">Mesa 12 (Terraza)</div>
                  <div className="text-xs text-indigo-400 mt-1">45 escaneos</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-slate-400 mb-2">Reseñas Captadas</div>
                  <div className="text-lg font-bold text-white">+18 Nuevas</div>
                  <div className="text-xs text-yellow-400 mt-1">⭐⭐⭐⭐⭐ Promedio</div>
                </div>
              </div>

              <div className="w-full h-24 bg-white/5 rounded-xl border border-white/5 p-4 flex items-end gap-2">
                {[40, 70, 45, 90, 60, 100, 85].map((h, i) => (
                  <div key={i} className="w-full bg-indigo-500/50 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
