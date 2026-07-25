'use client';
import { motion } from 'framer-motion';

export default function NfcPricing() {
  const plans = [
    {
      name: 'Smart Card',
      price: '$35',
      desc: 'Ideal para profesionales, freelancers y directivos.',
      features: ['1 Tarjeta de PVC Mate o Madera', 'Perfil digital ilimitado', 'Sin mensualidades', 'Actualizaciones en la nube', 'Envío a nivel nacional'],
      color: 'bg-slate-100',
      btnColor: 'bg-slate-900 text-white',
      border: 'border-slate-200'
    },
    {
      name: 'Pack Restaurantes',
      price: '$120',
      desc: 'Perfecto para digitalizar el menú de tus mesas.',
      features: ['10 Acrílicos NFC de Mesa', 'Diseño personalizado con tu logo', 'Menú digital alojado en nube', 'Dashboard de Estadísticas (Básico)', 'Garantía de 1 año'],
      color: 'bg-blue-600 text-white',
      btnColor: 'bg-white text-blue-900',
      border: 'border-blue-500 scale-105 shadow-2xl shadow-blue-600/30',
      popular: true
    },
    {
      name: 'Corporate Elite',
      price: 'Custom',
      desc: 'Para empresas con gran volumen de empleados o accesos.',
      features: ['Tarjetas de Metal Cepillado VIP', 'Integración con CRM existente', 'Wearables (Pulseras/Llaveros)', 'Desarrollo de Software a medida', 'Soporte 24/7 Dedicado'],
      color: 'bg-slate-900 text-white',
      btnColor: 'bg-indigo-500 text-white',
      border: 'border-slate-800'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Planes de <span className="text-blue-600">Inversión</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Olvídate de pagar miles de dólares al año en impresiones. Con Atomic haces un pago único por el hardware, y el software básico viene incluido de por vida.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-3xl p-8 relative border ${plan.color} ${plan.border} transition-transform duration-300 hover:-translate-y-2`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
                  Más Vendido
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`mb-6 text-sm ${plan.popular || idx === 2 ? 'text-slate-300' : 'text-slate-500'}`}>{plan.desc}</p>
              <div className="mb-8">
                <span className="text-5xl font-black">{plan.price}</span>
                {plan.price !== 'Custom' && <span className={`text-sm ml-2 ${plan.popular || idx === 2 ? 'text-slate-300' : 'text-slate-500'}`}>/ pago único</span>}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-blue-300' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="font-medium text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/593969043453?text=Hola,%20me%20interesa%20el%20plan%20de%20NFC" target="_blank" rel="noreferrer" className={`w-full block text-center py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg ${plan.btnColor}`}>
                Cotizar Ahora
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
