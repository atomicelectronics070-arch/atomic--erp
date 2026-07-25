'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const industries = [
  {
    id: 'restaurantes',
    name: 'Restaurantes y Bares',
    icon: '🍽️',
    title: 'La mesa cobra vida',
    desc: 'Instalamos acrílicos iluminados en cada mesa. Tus clientes acceden al menú, piden y pagan con un solo toque, sin llamar al mesero. Aumentas la rotación de mesas y las reseñas positivas en Google.',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'clinicas',
    name: 'Clínicas y Salud',
    icon: '🏥',
    title: 'Recepción 100% Digital',
    desc: 'Elimina las planillas de papel. Los pacientes acercan su móvil en la recepción para llenar formularios médicos y fichas de salud directamente en sus pantallas, con total privacidad.',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'gimnasios',
    name: 'Gimnasios y Clubes',
    icon: '🏋️‍♂️',
    title: 'Acceso sin Fricción',
    desc: 'Despídete de las tarjetas de plástico y códigos de barras. Entrega a tus socios pulseras impermeables NFC o llaveros ultra resistentes para control de acceso, pagos rápidos en cafetería y lockers.',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'corporativo',
    name: 'Corporativo e Inmobiliarias',
    icon: '🏢',
    title: 'Networking del Futuro',
    desc: 'Agentes y directivos equipados con una única Tarjeta de Metal NFC. Al acercarla al prospecto, se transfiere automáticamente el contacto, portafolio de propiedades y enlace a agendar cita.',
    color: 'from-slate-600 to-slate-800'
  }
];

export default function NfcIndustries() {
  const [active, setActive] = useState(industries[0]);

  return (
    <section className="py-24 bg-white px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
          Una Solución para <span className="text-blue-600">Cada Industria</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          No vendemos productos genéricos. Adaptamos la tecnología NFC a las fricciones específicas de tu sector.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Accordion / List */}
        <div className="space-y-4">
          {industries.map((ind) => (
            <motion.div 
              key={ind.id}
              onClick={() => setActive(ind)}
              className={`p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                active.id === ind.id 
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10' 
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-3xl p-3 rounded-xl bg-white shadow-sm ${active.id === ind.id ? 'ring-2 ring-blue-500' : ''}`}>
                  {ind.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${active.id === ind.id ? 'text-blue-900' : 'text-slate-700'}`}>
                    {ind.name}
                  </h3>
                  {active.id === ind.id && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-slate-600 mt-2 pr-4"
                    >
                      {ind.desc}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Display Panel */}
        <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center p-12 bg-slate-900">
          <div className={`absolute inset-0 bg-gradient-to-br ${active.color} opacity-40 transition-colors duration-700`}></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl"></div>
          
          <AnimatePresenceWrapper active={active} />
        </div>

      </div>
    </section>
  );
}

import { AnimatePresence } from 'framer-motion';

function AnimatePresenceWrapper({ active }: { active: any }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active.id}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center"
      >
        <div className="text-8xl mb-6 drop-shadow-2xl">{active.icon}</div>
        <h3 className="text-4xl font-black text-white mb-4 drop-shadow-md">{active.title}</h3>
        <button className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
          Ver Casos de Estudio
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
