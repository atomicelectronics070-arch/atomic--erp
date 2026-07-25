'use client';
import { motion } from 'framer-motion';

export default function NfcVideoGallery() {
  const videos = [
    {
      src: '/nfc/nfc-1.mp4',
      title: 'Networking Inteligente',
      desc: 'Compartir contactos con estilo.'
    },
    {
      src: '/nfc/nfc-2.mp4',
      title: 'Menús Dinámicos',
      desc: 'Pedidos ultrarrápidos y sin apps.'
    },
    {
      src: '/nfc/nfc-3.mp4',
      title: 'Accesos y Membresías',
      desc: 'Acceso VIP sin fricción física.'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Magia en <span className="text-indigo-600">Movimiento</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Observa la reacción de los clientes cuando la tecnología desaparece y solo queda la experiencia pura.
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
              className="group relative rounded-[2rem] overflow-hidden shadow-2xl bg-black aspect-[9/16]"
            >
              <video 
                src={vid.src} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }}
                style={{ cursor: "pointer" }}
                title="Click para activar/desactivar volumen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{vid.title}</h3>
                <p className="text-slate-300 font-medium">{vid.desc}</p>
                <div className="mt-4 flex items-center text-xs text-white/50 uppercase tracking-widest font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                  Volumen con Clic
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
