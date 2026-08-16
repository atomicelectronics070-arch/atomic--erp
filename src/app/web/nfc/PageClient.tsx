'use client';


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight, MessageCircle, Send, X, Shield, 
  Sparkles, CheckSquare, Award, Clock, ArrowDown, HelpCircle, Layers 
} from 'lucide-react';

export default function NFCLandingPage() {
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [personalizeForm, setPersonalizeForm] = useState({
    companyName: '',
    address: '',
    socials: '',
    quantity: '1-5 unidades'
  });

  // Interactive Checklist State
  const [checklist, setChecklist] = useState({
    step1: false,
    step2: false,
    step3: false
  });

  const handlePersonalizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Quiero personalizar un NFC para mi empresa. Mis datos son los siguientes:\n- Empresa: ${personalizeForm.companyName}\n- Dirección: ${personalizeForm.address}\n- Redes Sociales a integrar: ${personalizeForm.socials}\n- Unidades: ${personalizeForm.quantity}`;
    const waUrl = `https://wa.me/593969043453?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setIsPersonalizeOpen(false);
    setPersonalizeForm({ companyName: '', address: '', socials: '', quantity: '1-5 unidades' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 relative selection:bg-blue-500/20">
      
      {/* ── 1. QUÉ ES NFC (Sección de la Señorita - al Inicio de la Página) ── */}
      <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-blue-500" />
              <span>Tecnología de Radiofrecuencia</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              ¿Qué es el NFC y <br />
              cómo lo lee el celular?
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              NFC (Near Field Communication) es una tecnología de comunicación inalámbrica de corto alcance. Funciona mediante inducción magnética: tu smartphone genera un pequeño campo electromagnético que "despierta" al chip NFC cuando lo acercas a menos de 4 centímetros. 
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              No requiere baterías, no necesita emparejamiento por Bluetooth, ni descargar aplicaciones. Es literalmente mágico: el cliente acerca el teléfono e instantáneamente la información aparece en su pantalla.
            </p>

            <button 
              onClick={() => setIsPersonalizeOpen(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-black text-sm uppercase tracking-wider hover:bg-blue-700 hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <MessageCircle size={18} />
              <span>Personalizar mi NFC Ahora</span>
            </button>
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

      {/* ── EXPLICACIÓN 1: LA RUTA DEL ÉXITO EN 3 PASOS (Timeline) ── */}
      <section className="py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              GUÍA DE IMPLEMENTACIÓN EXPRESS
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              ¿Cómo Funciona el Proceso de Compra?
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Sigue estos tres sencillos pasos para solicitar y personalizar tu tarjeta inteligente en cuestión de minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Prepara tus Datos",
                desc: "Ten en mente los datos clave de tu empresa: Nombre oficial, logotipo corporativo en alta resolución y la dirección física que enlazarás en la tarjeta."
              },
              {
                step: "02",
                title: "Elige tus Redes",
                desc: "Define qué canales (Instagram, WhatsApp, TikTok, Google Reviews, etc.) quieres que se activen automáticamente al tocar el chip NFC."
              },
              {
                step: "03",
                title: "Solicita por WhatsApp",
                desc: "Haz clic en el botón inferior para enviarnos tu formulario y coordinar directamente con un asesor el diseño estético, unidades y tarifas finales."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 p-8 rounded-3xl space-y-4 relative group hover:border-blue-500/40 transition-colors">
                <span className="text-6xl font-black text-slate-800/80 absolute top-4 right-6 group-hover:text-blue-500/20 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-white relative z-10">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={() => setIsPersonalizeOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-wider hover:from-blue-400 hover:to-indigo-500 transition-all hover:scale-105 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <MessageCircle size={16} />
              <span>Realizar Pedido por WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── HERO SECTION SECUNDARIO ── */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-white border-b border-slate-100">
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

      {/* Casos Prácticos */}
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

      {/* ── EXPLICACIÓN 2: CONFIGURADOR INTERACTIVO RÁPIDO (Interactive Checklist) ── */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-6 text-center md:text-left relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold rounded-full">
                <CheckSquare size={14} />
                CHECKLIST DE CONFIGURACIÓN PRE-COMPRA
              </span>
              
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Prepara tu NFC en 60 Segundos
              </h3>
              
              <p className="text-slate-400 text-sm font-light">
                Marca los puntos que tienes listos para habilitar el botón de envío directo a WhatsApp.
              </p>

              {/* Checklist items */}
              <div className="space-y-3.5 pt-2">
                {[
                  {
                    key: 'step1' as const,
                    title: "Nombre y Dirección de la Empresa",
                    desc: "Tengo claros los datos de facturación y despacho para mi tarjeta física."
                  },
                  {
                    key: 'step2' as const,
                    title: "Canales Digitales Definidos",
                    desc: "Tengo listos los enlaces de Instagram, WhatsApp y mi perfil de Google Reviews."
                  },
                  {
                    key: 'step3' as const,
                    title: "Logotipo de Marca Listo",
                    desc: "Tengo mi archivo de logotipo listo para enviar al asesor técnico."
                  }
                ].map((item) => (
                  <label 
                    key={item.key}
                    className="flex items-start gap-4 bg-slate-950 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-blue-500/40 transition-colors text-left"
                  >
                    <input 
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className="mt-1 w-5 h-5 rounded-lg border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-light">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Animated indicator pointing to button when checklist is ready */}
              <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800/80 mt-8">
                <div className="text-left">
                  {checklist.step1 && checklist.step2 && checklist.step3 ? (
                    <p className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                      <span>✓ ¡Listo para enviar! Presiona el botón derecho</span>
                    </p>
                  ) : (
                    <p className="text-slate-500 text-xs font-mono">
                      Completa los 3 checks para desbloquear el pedido rápido.
                    </p>
                  )}
                </div>

                <div className="relative shrink-0 w-full md:w-auto">
                  {/* Animated Arrow Indicators pointing to the button */}
                  {checklist.step1 && checklist.step2 && checklist.step3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="absolute -left-12 top-1/2 -translate-y-1/2 text-cyan-400 hidden md:block"
                    >
                      <ArrowRight size={24} />
                    </motion.div>
                  )}
                  
                  <button 
                    onClick={() => setIsPersonalizeOpen(true)}
                    className="w-full py-4 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    <span>Hacer Pedido por WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Recuadro Destacado de Acompañamiento */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200 rounded-[3rem] p-10 md:p-16 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Te llevamos de la mano en <span className="text-blue-600">todo el proceso</span>
          </h2>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            No tienes que ser un experto en tecnología. Nosotros nos encargamos del diseño de la web, la programación del chip NFC, el diseño físico (tarjetas, acrílicos) y la capacitación de tu equipo. Tu única tarea es ver cómo crecen tus resultados.
          </p>
          <button 
            onClick={() => setIsPersonalizeOpen(true)}
            className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-black hover:scale-105 transition-all shadow-xl"
          >
            Agendar Asesoría Gratuita
          </button>
        </div>
      </section>

      {/* ── EXPLICACIÓN 3: EL BLUEPRINT DE DISEÑO A LA MEDIDA (Bespoke Visual Board) ── */}
      <section className="py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
              DISEÑO & PRECIOS AL DETALLE
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Blueprint de Personalización
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Cada tarjeta se diseña individualmente. Conoce las fases finales antes de la producción física de tus chips.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Fase 1: Recolección",
                desc: "Ingresa los datos de tu empresa y los enlaces de redes sociales que deseas enlazar en el formulario inicial.",
                icon: "✍️"
              },
              {
                title: "Fase 2: Cotización de Volumen",
                desc: "Definimos contigo el volumen final de unidades. Ofrecemos descuentos progresivos según la cantidad que requieras.",
                icon: "💰"
              },
              {
                title: "Fase 3: Materiales Premium",
                desc: "Elige entre PVC Mate de alta resistencia, Madera Ecológica Sustentable o Metal Grabado con Láser de alta precisión.",
                icon: "🛠️"
              },
              {
                title: "Fase 4: Aprobación Digital",
                desc: "Creamos un prototipo digital de tu diseño para tu aprobación final antes de iniciar el grabado y programación del chip.",
                icon: "✨"
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="text-3xl">{step.icon}</div>
                <h3 className="font-bold text-white text-base leading-tight">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-2xl max-w-2xl mx-auto text-center space-y-4">
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              💡 **Último Paso Importante:** Recuerda que el diseño final, la elección del material y los precios especiales por volumen se acuerdan directamente conversando por chat con un asesor especializado en WhatsApp.
            </p>
            
            <button 
              onClick={() => setIsPersonalizeOpen(true)}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all hover:scale-105 inline-flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              <MessageCircle size={16} />
              <span>Personalizar Diseño con un Asesor</span>
            </button>
          </div>
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

      {/* MODAL DE PERSONALIZACIÓN COMPACTO */}
      <AnimatePresence>
        {isPersonalizeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsPersonalizeOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-white border border-slate-100 rounded-3xl w-full max-w-lg p-8 shadow-2xl z-10 text-slate-800"
            >
              <button 
                onClick={() => setIsPersonalizeOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="space-y-2 mb-6">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block">
                  CONFIGURACIÓN DE TARJETA NFC
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  Datos de Personalización
                </h3>
                <p className="text-slate-500 text-xs font-light">
                  Completa este formulario rápido. Serás redirigido a WhatsApp para finalizar diseño, materiales y precio con un asesor.
                </p>
              </div>

              <form onSubmit={handlePersonalizeSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Nombre de tu Empresa / Marca *
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={personalizeForm.companyName}
                    onChange={e => setPersonalizeForm(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Ej. Atomic Electronics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Dirección Física *
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={personalizeForm.address}
                    onChange={e => setPersonalizeForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Ej. Av. Amazonas y Shyris, Edificio Principal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Redes Sociales a Integrar
                  </label>
                  <input 
                    type="text" 
                    value={personalizeForm.socials}
                    onChange={e => setPersonalizeForm(prev => ({ ...prev, socials: e.target.value }))}
                    placeholder="Ej. Instagram: @mi_marca, WhatsApp, Web..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Cantidad Estimada
                  </label>
                  <select 
                    value={personalizeForm.quantity}
                    onChange={e => setPersonalizeForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-all text-slate-800 cursor-pointer"
                  >
                    <option value="1-5 unidades">1 - 5 unidades (Familiar / Socios)</option>
                    <option value="6-20 unidades">6 - 20 unidades (Equipo Comercial)</option>
                    <option value="21+ unidades">21+ unidades (Corporativo / Empresa)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_25px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Continuar a WhatsApp</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
