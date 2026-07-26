'use client';
import { motion } from 'framer-motion';

export default function NfcVideoGallery() {
  const videos = [
    {
      src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-smartphone-in-her-hands-41477-large.mp4',
      poster: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
      title: 'Demostración NFC en Vivo (Chica Ejecutivo)',
      desc: 'Transferencia instantánea de datos y catálogo digital con un solo toque.'
    },
    {
      src: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smart-card-or-tag-41198-large.mp4',
      poster: 'https://images.unsplash.com/photo-1556742049-0a6756598c8c?q=80&w=800',
      title: 'Acrílicos Inteligentes & Displays',
      desc: 'Cobros y reseñas de Google instantáneas en mostrador.'
    },
    {
      src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-using-a-contactless-payment-system-41478-large.mp4',
      poster: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800',
      title: 'Experiencia VIP de Redes',
      desc: 'Conexión social inmediata a Instagram, TikTok y WhatsApp.'
    }
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative border-y border-slate-800 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
            <span>Demostración en Video HD</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Experiencia NFC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">en Acción</span>
          </h2>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
            Observa cómo nuestros clientes y ejecutivos comparten su perfil y catálogo con un solo toque de su tarjeta inteligente.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((vid, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 aspect-[9/16] hover:border-indigo-500/50 transition-all duration-500"
            >
              <video 
                src={vid.src} 
                poster={vid.poster}
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }}
                style={{ cursor: "pointer" }}
                title="Haz clic para activar / desactivar audio"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none flex flex-col justify-end p-8">
                <h3 className="text-xl font-black text-white mb-2 leading-tight">{vid.title}</h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">{vid.desc}</p>
                
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10 text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Video Demostrativo
                  </span>
                  <span>Audio al Clic 🔊</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
