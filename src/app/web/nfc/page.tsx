'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NfcContactModal from '@/components/nfc/NfcContactModal';
import NfcDemoQRModal from '@/components/nfc/NfcDemoQRModal';
import AtomicBotChat from '@/components/nfc/AtomicBotChat';

export default function NFCLandingPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDemoQROpen, setIsDemoQROpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 opacity-70 z-0"></div>
        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            El Futuro a un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Toque</span> de Distancia
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 mb-10"
          >
            Revoluciona la interacción de tus clientes con tecnología NFC de última generación.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <a href="#demo" className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 hover:shadow-xl transition-all hover:scale-105 inline-block">
              Descubre Cómo Funciona
            </a>
          </motion.div>
        </div>
        
        {/* Decoraciones de fondo */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-48 h-48 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </section>

      {/* Qué es NFC */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">¿Qué es el NFC y cómo lo lee el celular?</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              NFC (Near Field Communication) es una tecnología de comunicación inalámbrica de corto alcance. Funciona mediante inducción magnética: tu smartphone genera un pequeño campo electromagnético que "despierta" al chip NFC cuando lo acercas a menos de 4 centímetros. 
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              No requiere baterías, no necesita emparejamiento por Bluetooth, ni descargar aplicaciones. Es literalmente mágico: el cliente acerca el teléfono e instantáneamente la información aparece en su pantalla.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 bg-white p-2">
            <video onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }} style={{ cursor: "pointer" }} title="Click para activar/desactivar volumen" 
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
              <video onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }} style={{ cursor: "pointer" }} title="Click para activar/desactivar volumen" src="/nfc/nfc-1.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Networking Inteligente</h3>
            <p className="text-slate-600">Tarjetas de presentación NFC. Acerca tu tarjeta al celular de tu contacto y tus datos se guardarán directamente en su agenda en un segundo.</p>
          </div>

          {/* Menús de Restaurantes Interactivos */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-6 bg-slate-100 relative">
              <video onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }} style={{ cursor: "pointer" }} title="Click para activar/desactivar volumen" src="/nfc/nfc-2.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Menús Dinámicos</h3>
            <p className="text-slate-600">Menús interactivos y completos que superan al QR. Actualiza precios en tiempo real, añade fotos de alta calidad y botones de pedido directo a WhatsApp.</p>
          </div>

          {/* Control de Acceso y Gimnasios */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-6 bg-slate-100 relative">
              <video onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }} style={{ cursor: "pointer" }} title="Click para activar/desactivar volumen" src="/nfc/nfc-3.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
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
          <button onClick={() => setIsContactOpen(true)} className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-black hover:scale-105 transition-all shadow-xl">
            Agendar Asesoría Gratuita
          </button>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={() => setIsDemoQROpen(true)} className="px-6 py-3 bg-white text-slate-800 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Demo con QR
            </button>
            <a href="https://wa.me/593969043453?text=Hola,%20quisiera%20solicitar%20una%20demo%20de%20NFC" target="_blank" rel="noreferrer" className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors shadow-sm shadow-green-500/30 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Solicitar Demo Directa
            </a>
          </div>
        </div>
      </section>

      {/* Galería Adicional de Demostración */}
      <section id="demo" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Más Ejemplos en Acción</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white p-2 hover:scale-[1.02] transition-transform">
            <video onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }} style={{ cursor: "pointer" }} title="Click para activar/desactivar volumen" src="/nfc/nfc-4.mp4" autoPlay muted loop playsInline className="w-full h-auto rounded-2xl" />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white p-2 hover:scale-[1.02] transition-transform">
            <video onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }} style={{ cursor: "pointer" }} title="Click para activar/desactivar volumen" src="/nfc/nfc-5.mp4" autoPlay muted loop playsInline className="w-full h-auto rounded-2xl" />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white p-2 hover:scale-[1.02] transition-transform">
            <video onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }} style={{ cursor: "pointer" }} title="Click para activar/desactivar volumen" src="/nfc/nfc-6.mp4" autoPlay muted loop playsInline className="w-full h-auto rounded-2xl" />
          </div>
        </div>
      </section>
      {/* Modales y Bot Interactivo */}
      <NfcContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <NfcDemoQRModal isOpen={isDemoQROpen} onClose={() => setIsDemoQROpen(false)} />
      <AtomicBotChat />
      
    </div>
  );
}
