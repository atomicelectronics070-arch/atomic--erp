'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function NFCLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      
      {/* Qué es NFC (Sección de la Señorita - al Inicio de la Página) */}
      <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-mono text-xs font-bold uppercase tracking-wider mb-6">
              <span>Tecnología de Radiofrecuencia</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">¿Qué es el NFC y cómo lo lee el celular?</h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              NFC (Near Field Communication) es una tecnología de comunicación inalámbrica de corto alcance. Funciona mediante inducción magnética: tu smartphone genera un pequeño campo electromagnético que "despierta" al chip NFC cuando lo acercas a menos de 4 centímetros. 
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              No requiere baterías, no necesita emparejamiento por Bluetooth, ni descargar aplicaciones. Es literalmente mágico: el cliente acerca el teléfono e instantáneamente la información aparece en su pantalla.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 bg-white p-2">
            <video 
              src="/nfc/nfc-long.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Hero Section (Sección Secundaria de Conversión) */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-white border-y border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 opacity-70 z-0"></div>
        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            El Futuro a un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Toque</span> de Distancia
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10"
          >
            Revoluciona la interacción de tus clientes con tecnología NFC de última generación.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <a href="#demo" className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-base hover:bg-blue-700 hover:shadow-xl transition-all hover:scale-105 inline-block">
              Descubre Cómo Funciona
            </a>
          </motion.div>
        </div>
        
        {/* Decoraciones de fondo */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-48 h-48 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </section>

      {/* Beneficios Económicos */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">El Impacto en tus Finanzas</h2>
            <p className="text-blue-100 text-xl">Datos reales de mejora al implementar tecnología NFC en negocios.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-700/50 backdrop-blur-md p-8 rounded-3xl border border-blue-500">
              <h3 className="text-5xl font-black mb-4">+35%</h3>
              <p className="text-lg text-blue-100">En conversión de ventas al reducir la fricción en el proceso de acceso a la información o pago.</p>
            </div>
            <div className="bg-blue-700/50 backdrop-blur-md p-8 rounded-3xl border border-blue-500">
              <h3 className="text-5xl font-black mb-4">+22%</h3>
              <p className="text-lg text-blue-100">En retención de clientes gracias a una experiencia de usuario (UX) moderna, fluida y sin contacto.</p>
            </div>
            <div className="bg-blue-700/50 backdrop-blur-md p-8 rounded-3xl border border-blue-500">
              <h3 className="text-5xl font-black mb-4">-40%</h3>
              <p className="text-lg text-blue-100">En costos de impresión recurrentes (papelería, tarjetas de presentación, menús físicos, catálogos).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Casos Prácticos (Más allá de Menús) */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-slate-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Casos de Uso Revolucionarios</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">La tecnología NFC va mucho más allá de un simple enlace web. Mira lo que podemos construir para ti.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Tarjetas de Presentación Inteligentes */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-6 bg-slate-100 relative">
              <video src="/nfc/nfc-1.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Networking Inteligente</h3>
            <p className="text-slate-600">Tarjetas de presentación NFC. Acerca tu tarjeta al celular de tu contacto y tus datos se guardarán directamente en su agenda en un segundo.</p>
          </div>

          {/* Menús de Restaurantes Interactivos */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-6 bg-slate-100 relative">
              <video src="/nfc/nfc-2.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Menús Dinámicos</h3>
            <p className="text-slate-600">Menús interactivos y completos que superan al QR. Actualiza precios en tiempo real, añade fotos de alta calidad y botones de pedido directo a WhatsApp.</p>
          </div>

          {/* Control de Acceso y Gimnasios */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-6 bg-slate-100 relative">
              <video src="/nfc/nfc-3.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Accesos y Membresías</h3>
            <p className="text-slate-600">Llaveros o pulseras NFC para gimnasios y condominios. Acceso seguro, rápido e identificable para gestionar membresías sin fricción.</p>
          </div>
        </div>
      </section>

      {/* Recuadro Destacado de Acompañamiento */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200 rounded-3xl p-10 md:p-16 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Te llevamos de la mano en <span className="text-blue-600">todo el proceso</span>
          </h2>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            No tienes que ser un experto en tecnología. Nosotros nos encargamos del diseño de la web, la programación del chip NFC, el diseño físico (tarjetas, acrílicos) y la capacitación de tu equipo. Tu única tarea es ver cómo crecen tus resultados.
          </p>
          <button className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-black hover:scale-105 transition-all shadow-xl">
            Agendar Asesoría Gratuita
          </button>
        </div>
      </section>

      {/* Galería Adicional de Demostración */}
      <section id="demo" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Más Ejemplos en Acción</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white p-2 hover:scale-[1.02] transition-transform">
            <video src="/nfc/nfc-4.mp4" autoPlay muted loop playsInline className="w-full h-auto rounded-2xl" />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white p-2 hover:scale-[1.02] transition-transform">
            <video src="/nfc/nfc-5.mp4" autoPlay muted loop playsInline className="w-full h-auto rounded-2xl" />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white p-2 hover:scale-[1.02] transition-transform">
            <video src="/nfc/nfc-6.mp4" autoPlay muted loop playsInline className="w-full h-auto rounded-2xl" />
          </div>
        </div>
      </section>
      
    </div>
  );
}
