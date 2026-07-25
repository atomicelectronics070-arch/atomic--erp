'use client';
import { motion } from 'framer-motion';

export default function NfcUseCasesMasonry() {
  const uses = [
    { title: 'Menú Digital sin Fricción', desc: 'Acrílicos en cada mesa. El cliente acerca su iPhone y el menú se abre en 1 segundo.', color: 'bg-blue-50' },
    { title: 'Tarjetas de Presentación Elite', desc: 'No más papel. Pasa tu contacto, redes y portafolio con solo tocar el teléfono de tu cliente.', color: 'bg-indigo-50' },
    { title: 'Google Reviews Turbo', desc: 'Un acrílico en la caja. "Acerca tu móvil para dejarnos una reseña". Las reseñas de 5 estrellas se multiplican x10.', color: 'bg-amber-50' },
    { title: 'Control de Accesos VIP', desc: 'Pulseras NFC para gimnasios o clubes. Control total de quién entra y a qué hora.', color: 'bg-emerald-50' },
    { title: 'Identificación Médica', desc: 'Stickers en cascos o llaveros con tu tipo de sangre y contactos de emergencia para paramédicos.', color: 'bg-rose-50' },
    { title: 'Conexión WiFi Automática', desc: '¿Cansado de que te pidan la clave del WiFi? Solo acercan su celular y se conectan sin teclear nada.', color: 'bg-cyan-50' }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Casos de Uso <span className="text-indigo-600">Ilimitados</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            La tecnología NFC no es solo para pagos. Es un puente invisible entre el mundo físico y digital.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uses.map((use, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`${use.color} rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow`}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{use.title}</h3>
              <p className="text-slate-600 leading-relaxed">{use.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
