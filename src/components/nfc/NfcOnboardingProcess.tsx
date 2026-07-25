'use client';
import { motion } from 'framer-motion';

export default function NfcOnboardingProcess() {
  const steps = [
    { number: '01', title: 'Consultoría y Selección', desc: 'Hablas con nuestros asesores para elegir el formato ideal: PVC, Madera, Metal o Acrílico.' },
    { number: '02', title: 'Diseño Customizado', desc: 'Nuestro equipo de diseño crea un arte visual que encaje perfectamente con la identidad de tu marca.' },
    { number: '03', title: 'Programación del Chip', desc: 'Inyectamos la URL o el Perfil Digital directamente en el chip NTAG y bloqueamos el código para evitar falsificaciones.' },
    { number: '04', title: 'Entrega y Activación', desc: 'Recibes el producto físico y accedes a tu dashboard en la nube para controlar todo desde el día 1.' }
  ];

  return (
    <section className="py-24 bg-slate-50 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            El Camino hacia la <span className="text-cyan-600">Digitalización</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Te llevamos de la mano. Nosotros nos encargamos de la parte técnica y de diseño, tú solo disfrutas el resultado.
          </p>
        </div>

        <div className="relative">
          {/* Línea vertical conectora */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 md:w-1/2 ${idx % 2 !== 0 ? 'md:text-left' : 'md:text-right'} w-full text-center`}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                
                <div className="w-16 h-16 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-cyan-500/30 relative z-10 border-4 border-slate-50">
                  {step.number}
                </div>
                
                <div className="flex-1 md:w-1/2 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
