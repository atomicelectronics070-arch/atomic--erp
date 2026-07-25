'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function NfcFAQ() {
  const faqs = [
    {
      q: '¿El cliente necesita descargar alguna aplicación para leer el NFC?',
      a: 'No. Absolutamente cero fricción. El 100% de los teléfonos modernos (Apple y Android) leen chips NFC de forma nativa. Solo acercan el celular desbloqueado y la magia ocurre.'
    },
    {
      q: '¿Qué pasa si mi cliente tiene un celular muy antiguo?',
      a: 'Todos nuestros productos NFC (Acrílicos y Tarjetas) incluyen un Código QR de respaldo grabado a láser con un diseño ultra premium. Si el teléfono es de hace 10 años, simplemente escanean el QR.'
    },
    {
      q: '¿Los chips NFC necesitan baterías o recargas?',
      a: 'No. Nuestros chips NFC son pasivos. Se alimentan por inducción magnética del propio teléfono del usuario durante la fracción de segundo en que se acercan. Tienen una vida útil virtualmente ilimitada.'
    },
    {
      q: '¿Puedo actualizar mi menú o mis datos después de comprar el acrílico?',
      a: '¡Por supuesto! Esa es la mayor ventaja. No necesitas comprar otro acrílico. Entras a tu panel de control desde tu celular, cambias el enlace o el PDF de tu menú, y todos tus acrílicos físicos se actualizan instantáneamente en la nube.'
    },
    {
      q: '¿Hay mensualidades ocultas?',
      a: 'En los planes básicos y tarjetas personales, el pago es único. En planes corporativos que requieren integraciones con CRM o análisis avanzado de datos, existe una suscripción mensual, pero siempre seremos 100% transparentes contigo antes de iniciar.'
    }
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-900 text-white px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Preguntas <span className="text-blue-500">Frecuentes</span>
          </h2>
          <p className="text-xl text-slate-400">
            Resolvemos tus dudas técnicas antes de dar el salto.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <button 
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors focus:outline-none"
              >
                <span className="font-bold text-lg pr-8">{faq.q}</span>
                <span className={`transform transition-transform duration-300 ${open === idx ? 'rotate-180 text-blue-400' : 'text-slate-500'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </button>
              <AnimatePresence>
                {open === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-slate-400 leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
