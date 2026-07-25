'use client';
import { motion } from 'framer-motion';

export default function NfcHowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'El cliente acerca su móvil',
      desc: 'Sin descargar aplicaciones ni abrir cámaras. El chip NFC de alta frecuencia despierta al instante cuando un smartphone se aproxima.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
      )
    },
    {
      num: '02',
      title: 'Transmisión Invisible',
      desc: 'La magia ocurre por radiofrecuencia (RFID). Los datos encriptados viajan a la velocidad de la luz hacia el dispositivo receptor en una fracción de segundo.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
      )
    },
    {
      num: '03',
      title: 'Interacción Inmediata',
      desc: 'El menú, la tarjeta de presentación, el formulario o el acceso de seguridad se despliega en pantalla de manera fluida y nativa.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      )
    }
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto bg-white">
      <div className="text-center mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            La Fricción ha <span className="text-blue-600">Desaparecido</span>
          </h2>
          <p className="text-2xl text-slate-500 max-w-3xl mx-auto font-light">
            Escanea códigos QR requiere buscar la cámara, enfocar, esperar y hacer clic. El NFC convierte un proceso de 15 segundos en 1 milisegundo.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-12 relative">
        {/* Línea conectora de fondo */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-200 to-blue-100 -translate-y-1/2 z-0"></div>

        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="relative z-10 bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-20 h-20 bg-blue-600 rounded-3xl text-white flex items-center justify-center mb-8 shadow-xl shadow-blue-600/20">
              {step.icon}
            </div>
            <div className="text-7xl font-black text-slate-100 absolute top-8 right-8 z-0 select-none">
              {step.num}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">{step.title}</h3>
            <p className="text-slate-600 leading-relaxed text-lg relative z-10">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
