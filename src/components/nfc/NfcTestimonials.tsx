'use client';
import { motion } from 'framer-motion';

export default function NfcTestimonials() {
  const testimonials = [
    {
      quote: "Desde que instalamos los acrílicos iluminados en nuestras mesas, las propinas subieron un 15% porque el menú carga instantáneo y la gente pide más rápido. Se pagaron solos la primera semana.",
      name: "Carlos Rivera",
      role: "Gerente General, La Terraza Bistró",
      stars: 5
    },
    {
      quote: "Las tarjetas de madera NFC de Atomic nos dieron un salto de estatus increíble. Cuando me reúno con clientes corporativos y acerco mi tarjeta a su iPhone, sus caras de sorpresa lo dicen todo.",
      name: "Sofía Montenegro",
      role: "Directora Comercial, Inmobiliaria Vanguard",
      stars: 5
    },
    {
      quote: "Pusimos el acrílico de Google Reviews en la caja de cobro. Pasamos de tener 10 reseñas al mes a casi 150. Ahora somos el gimnasio #1 en búsquedas en nuestra ciudad. Brutal.",
      name: "Diego Sánchez",
      role: "Fundador, Iron Fit Center",
      stars: 5
    }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Historias de <span className="text-emerald-600">Éxito Reales</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Negocios que decidieron dar el salto al futuro y ahora disfrutan de una ventaja injusta sobre su competencia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 relative shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl text-emerald-400 absolute top-6 right-8 font-serif">"</div>
              <div className="flex gap-1 mb-6">
                {[...Array(test.stars)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
              </div>
              <p className="text-slate-700 mb-8 italic text-lg leading-relaxed">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{test.name}</h4>
                  <p className="text-sm text-slate-500">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
