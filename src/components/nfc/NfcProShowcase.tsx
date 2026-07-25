'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const showcaseItems = [
  {
    id: 'tarjetas',
    title: 'Tarjetas Inteligentes',
    subtitle: 'El Nuevo Estándar del Networking',
    desc: 'Olvídate del papel. Una sola tarjeta ultra premium en PVC Mate, Metal o Madera Sustentable. La acercas al teléfono de tu cliente y toda tu información, portafolio y redes sociales se guardan instantáneamente en su agenda.',
    features: ['PVC Mate / Metal', 'Sin recargas', 'Diseño Personalizado', 'Actualizable'],
    imgUrl: 'https://images.unsplash.com/photo-1579389083046-c236746811cc?q=80&w=2070&auto=format&fit=crop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
    )
  },
  {
    id: 'acrilicos',
    title: 'Acrílicos y Displays',
    subtitle: 'Interacción en el Punto de Venta',
    desc: 'Acrílicos de lujo cortados a láser, perfectos para mesas de restaurantes, barras o la recepción. Ideales para disparar tus Reseñas en Google o cargar tu Menú Digital sin que el cliente pelee con la cámara para leer un QR.',
    features: ['Google Reviews', 'Menús Digitales', 'Pagos Rápidos', 'Base LED opcional'],
    imgUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
    )
  },
  {
    id: 'fijos',
    title: 'Stickers y Superficies Fijas',
    subtitle: 'Tecnología Invisible',
    desc: 'Convierte cualquier mesa, pared o vitrina en una superficie inteligente. Los chips NFC en formato sticker son diminutos, discretos y pueden pegarse debajo de la mesa o detrás de posters publicitarios. ¡El usuario solo acerca su móvil al objeto físico!',
    features: ['Económicos', 'Resistentes al agua', 'Completamente ocultables', 'Múltiples tamaños'],
    imgUrl: 'https://images.unsplash.com/photo-1620063231464-9b265bd17e2e?q=80&w=2070&auto=format&fit=crop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
    )
  },
  {
    id: 'wearables',
    title: 'Wearables y Llaveros',
    subtitle: 'Accesos y Membresías sin Fricción',
    desc: 'Llaveros epoxy de alta durabilidad y pulseras de silicón con tecnología NFC incrustada. La solución definitiva para gimnasios, condominios, clubes VIP y eventos, permitiendo accesos instantáneos e identificación segura.',
    features: ['Pulseras de Silicón', 'Llaveros Epoxy', 'Alta durabilidad', 'Control de Acceso'],
    imgUrl: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2088&auto=format&fit=crop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
    )
  }
];

export default function NfcProShowcase() {
  const [activeTab, setActiveTab] = useState(showcaseItems[0].id);

  const activeItem = showcaseItems.find(item => item.id === activeTab) || showcaseItems[0];

  return (
    <section className="py-24 bg-[#050505] text-white relative overflow-hidden rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 my-20">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-sm tracking-widest mb-6">
            CATÁLOGO ATOMIC PRO
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
            Ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">NFC Premium</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
            Soluciones de hardware físico integradas con software en la nube. Diseñadas a la medida para potenciar la interacción en tu negocio.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Menu / Tabs */}
          <div className="w-full lg:w-1/3 space-y-4">
            {showcaseItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border flex items-start gap-4 group ${
                  activeTab === item.id 
                    ? 'bg-white/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                    : 'bg-transparent border-white/5 hover:bg-white/5'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500">{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Viewer Panel */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group"
              >
                {/* Product Image Panel */}
                <div className="relative h-80 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
                  <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: "easeOut" }}
                    src={activeItem.imgUrl} 
                    alt={activeItem.title}
                    className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute bottom-6 left-8 z-20">
                    <h3 className="text-3xl font-black text-white">{activeItem.title}</h3>
                  </div>
                </div>

                {/* Details Panel */}
                <div className="p-8">
                  <p className="text-slate-300 text-lg leading-relaxed mb-8">
                    {activeItem.desc}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {activeItem.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-slate-300 text-sm font-semibold">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
