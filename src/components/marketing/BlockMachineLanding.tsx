'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function BlockMachineLanding({ products }: { products: any[] }) {
  const whatsappNumber = "593969043453";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Atomic, deseo asesoría técnica especializada y cotización completa sobre las Plantas Industriales de Bloques y Adoquines.')}`;

  // State for ROI Calculator
  const [blocksPerDay, setBlocksPerDay] = useState(5000);
  const [profitPerBlock, setProfitPerBlock] = useState(0.12);
  const monthlyProfit = blocksPerDay * profitPerBlock * 26; // 26 working days
  const annualProfit = monthlyProfit * 12;

  // State for Capacitación / Masterclass Tabs
  const [activeTab, setActiveTab] = useState<'proceso' | 'modelos' | 'moldes' | 'repuestos'>('proceso');

  // State for FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "¿De qué tamaño y estilos vienen los bloques que puede producir la máquina?",
      a: "Nuestras plantas son multi-molde de intercambio rápido. Pueden fabricar: 1) Bloques Huecos Estándar (400x200x200mm, 400x150x200mm, 400x100x200mm), 2) Adoquines de Alta Resistencia (Holandés 200x100mm, Hexagonal, Unidecor, Hueso/Zig-Zag), 3) Bloques Ecológicos Interlocking (tipo Lego sin mortero) y 4) Bordillos viales de hasta 1 metro. La matriz intercambiable permite fabricar prácticamente cualquier geometría de concreto prefabricado."
    },
    {
      q: "¿Qué incluye exactamente la compra de una planta completa con ATOMIC?",
      a: "Se entrega una solución 'Llave en Mano' (Turnkey Project). Incluye: Máquina Principal Vibratoria e Hidráulica (Host Machine), Mezcladora Obligatoria de Doble Eje JS350/JS500/JS750, Cinta Transportadora de Agregados automatizada, Apilador Automático de Paletas (Stacker), Tablero de Control Digital PLC Siemens/Mitsubishi con pantalla táctil, 1 Molde de acero templado al manganeso a elección, Kit de repuestos críticos y Carritos manuales de retiro."
    },
    {
      q: "¿Qué cobertura y características tiene el Soporte Técnico y Garantía?",
      a: "Todas las plantas cuentan con 2 Años de Garantía Estructural y Mecánica. Nuestro servicio incluye: Instalación y montaje en planta por nuestros ingenieros mecánicos/electrónicos, calibración de presiones y ciclos de vibración, capacitación técnica en sitio para su personal de operarios, tele-diagnóstico remoto vía módem industrial PLC 24/7 y stock permanente de repuestos originales (sellos hidráulicos, electroválvulas, motores vibradores, sensores inductivos)."
    },
    {
      q: "¿Cuál es el tiempo de retorno de inversión (ROI) estimado?",
      a: "Para una planta media (ej. QT4-15 o QTJ4-35) operando al 70% de su capacidad nominal en una jornada de 8 horas (aprox. 4,000 a 6,000 bloques/día), el margen neto promedio por bloque oscila entre $0.10 y $0.15 USD. El retorno total del capital invertido se logra típicamente entre los 6 y 10 meses de operación continua."
    },
    {
      q: "¿Qué requerimientos eléctricos e infraestructura se necesitan previa instalación?",
      a: "Se requiere acometida eléctrica trifásica a 220V o 380V (60Hz) con una capacidad instalada recomendada de 35 kW a 75 kW según el modelo. El terreno para la nave industrial debe contar con un piso nivelado de hormigón armado de 15 a 20 cm de espesor y un área de curado al aire libre de al menos 800 a 1,500 m² para acopio de producto final."
    }
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-amber-600/10 via-yellow-500/5 to-transparent blur-[160px] rounded-full"></div>
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-orange-600/5 blur-[180px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 z-10 border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-3 px-5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-8 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">
                División de Maquinaria Pesada & Prefabricados
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.9] mb-8 text-white">
              EL PODER DE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 italic">
                FABRICAR.
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed mb-12 tracking-wide">
              Ingeniería industrial de compresión hidráulica y vibración de alta frecuencia. Diseñadas para producir hasta <strong className="text-white font-semibold">18,000 bloques por turno</strong> con estándares europeos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] hover:scale-105 flex items-center justify-center space-x-3"
              >
                <span>Solicitar Asesoría & Cotización</span>
                <span className="text-base">→</span>
              </a>
              <a 
                href="#capacitacion" 
                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-300 backdrop-blur-md hover:border-amber-500/40"
              >
                🎓 Guía Técnica & Capacitación
              </a>
            </div>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 pt-12 border-t border-white/10 text-left max-w-5xl mx-auto">
            <div className="p-4 border-l-2 border-amber-500 bg-white/[0.01]">
              <div className="text-3xl md:text-4xl font-black text-white font-mono">100 KN</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">Fuerza de Compresión</div>
            </div>
            <div className="p-4 border-l-2 border-amber-500 bg-white/[0.01]">
              <div className="text-3xl md:text-4xl font-black text-white font-mono">15-20 s</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">Ciclo de Moldeo</div>
            </div>
            <div className="p-4 border-l-2 border-amber-500 bg-white/[0.01]">
              <div className="text-3xl md:text-4xl font-black text-white font-mono">100% PLC</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">Control Siemens/Mitsubishi</div>
            </div>
            <div className="p-4 border-l-2 border-amber-500 bg-white/[0.01]">
              <div className="text-3xl md:text-4xl font-black text-white font-mono">2 AÑOS</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">Garantía Estructural</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MASTERCLASS / CAPACITACIÓN TÉCNICA COMPLETA */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05] bg-gradient-to-b from-neutral-950 via-black to-neutral-950" id="capacitacion">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <span className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-widest">
                🎓 CAPACITACIÓN MAESTRA DE OPERACIÓN & INGENIERÍA
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
              Todo lo que Debes Saber sobre las <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 italic">
                Plantas de Concreto y Bloques
              </span>
            </h2>
            <p className="text-neutral-400 text-sm font-light mt-4 leading-relaxed">
              Aprende el funcionamiento técnico, dosificación perfecta, comparativa de modelos, mantenimiento y accesorios indispensables para operar tu bloquera con máxima rentabilidad.
            </p>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { id: 'proceso', label: '1. Proceso & Dosificación' },
              { id: 'modelos', label: '2. Comparativa de Modelos' },
              { id: 'moldes', label: '3. Moldes & Productos' },
              { id: 'repuestos', label: '4. Repuestos & Opcionales' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-amber-500/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
            {activeTab === 'proceso' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="text-2xl font-black text-amber-400 uppercase tracking-wide mb-6">
                  ⚙️ El Proceso de Vibro-Compresión Hidráulica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                    <span className="text-3xl font-mono font-black text-amber-400 block mb-3">PASO 01</span>
                    <h4 className="text-lg font-bold text-white mb-2">Dosificación Seca (Baja Agua)</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      La mezcla de bloquera utiliza agua mínima (relación agua/cemento 0.35-0.40). La mezcladora obligatoria JS500 homogeneiza arena, cemento y gravilla en 2-3 minutos.
                    </p>
                  </div>
                  <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                    <span className="text-3xl font-mono font-black text-amber-400 block mb-3">PASO 02</span>
                    <h4 className="text-lg font-bold text-white mb-2">Vibro-Prensado (100 KN)</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      El material cae en la caja del molde. La mesa vibratoria oscila a 4500 RPM impulsando el aire fuera, mientras el pistón hidráulico desciende aplicando 10 a 45 MPa.
                    </p>
                  </div>
                  <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                    <span className="text-3xl font-mono font-black text-amber-400 block mb-3">PASO 03</span>
                    <h4 className="text-lg font-bold text-white mb-2">Desmolde en Caliente & Curado</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      El bloque sale firme y compacto sobre la paleta de madera/PVC. Pasa al apilador (Stacker) y requiere 24h de curado húmedo antes del acopio final.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'modelos' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="text-2xl font-black text-amber-400 uppercase tracking-wide mb-6">
                  📊 Diferencias de Modelos Ofrecidos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-amber-400 uppercase font-bold">
                        <th className="py-3 px-4">Modelo</th>
                        <th className="py-3 px-4">Producción/Turno (Bloque 20)</th>
                        <th className="py-3 px-4">Fuerza de Presión</th>
                        <th className="py-3 px-4">Potencia Total</th>
                        <th className="py-3 px-4">Nivel Automatización</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-neutral-300">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-white">QTJ4-40 (Semi-Automática)</td>
                        <td className="py-3.5 px-4">3,500 – 4,800 und</td>
                        <td className="py-3.5 px-4">40 KN</td>
                        <td className="py-3.5 px-4">18 kW</td>
                        <td className="py-3.5 px-4 text-amber-400">Semi-Automática (Palanca)</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-white">QT4-15 (Línea Estándar PLC)</td>
                        <td className="py-3.5 px-4">6,000 – 8,000 und</td>
                        <td className="py-3.5 px-4">70 KN</td>
                        <td className="py-3.5 px-4">32 kW</td>
                        <td className="py-3.5 px-4 text-amber-400">Total PLC Siemens + Stacker</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-white">QT6-15 (Línea Pesada)</td>
                        <td className="py-3.5 px-4">9,000 – 12,000 und</td>
                        <td className="py-3.5 px-4">100 KN</td>
                        <td className="py-3.5 px-4">45 kW</td>
                        <td className="py-3.5 px-4 text-amber-400">Total PLC Pantalla Táctil HMI</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-white">QT10-15 (Macro Planta Industrial)</td>
                        <td className="py-3.5 px-4">15,000 – 18,000 und</td>
                        <td className="py-3.5 px-4">120 KN</td>
                        <td className="py-3.5 px-4">75 kW</td>
                        <td className="py-3.5 px-4 text-amber-400">Línea Robótica Completa</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'moldes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="text-2xl font-black text-amber-400 uppercase tracking-wide mb-6">
                  🧩 Matrices Interchangeables & Productos Fabricables
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                    <h4 className="font-bold text-white mb-2 text-sm">Bloques Huecos</h4>
                    <p className="text-neutral-400 font-light leading-relaxed mb-3">400x200x200mm, 400x150x200mm y 400x100x200mm. Estructurales sismo-resistentes.</p>
                    <span className="text-amber-400 font-mono font-bold block">1 Molde estándar incluido</span>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                    <h4 className="font-bold text-white mb-2 text-sm">Adoquines Pavers</h4>
                    <p className="text-neutral-400 font-light leading-relaxed mb-3">Holandés 200x100mm, Hexagonal 200x80mm, Unidecor Zig-Zag y Hueso.</p>
                    <span className="text-amber-400 font-mono font-bold block">Resistencia &gt; 45 MPa</span>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                    <h4 className="font-bold text-white mb-2 text-sm">Interlocking Lego</h4>
                    <p className="text-neutral-400 font-light leading-relaxed mb-3">Bloques ecológicos de auto-encaje sin mortero. Ahorro de 80% en pegante.</p>
                    <span className="text-amber-400 font-mono font-bold block">Traba Macho-Hembra</span>
                  </div>
                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                    <h4 className="font-bold text-white mb-2 text-sm">Bordillos Viales</h4>
                    <p className="text-neutral-400 font-light leading-relaxed mb-3">Bordillos de retención urbana hasta 1 metro de longitud y canales de agua.</p>
                    <span className="text-amber-400 font-mono font-bold block">Alta Densidad Vial</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'repuestos' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="text-2xl font-black text-amber-400 uppercase tracking-wide mb-6">
                  📦 Repuestos Críticos & Accesorios Opcionales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-3">Kit de Repuestos Críticos Incluido</h4>
                    <ul className="text-xs text-neutral-300 space-y-2 font-mono">
                      <li className="flex items-center space-x-2"><span className="text-amber-400">✔</span><span>Juego completo de sellos hidráulicos de nitrilo alto impacto.</span></li>
                      <li className="flex items-center space-x-2"><span className="text-amber-400">✔</span><span>Electroválvulas proporcionales mecánicas y relés auxiliares.</span></li>
                      <li className="flex items-center space-x-2"><span className="text-amber-400">✔</span><span>Sensores de proximidad inductivos para posición de desmolde.</span></li>
                      <li className="flex items-center space-x-2"><span className="text-amber-400">✔</span><span>2 Carritos manuales reforzados para retiro de paletas de madera/PVC.</span></li>
                    </ul>
                  </div>

                  <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-3">Accesorios Opcionales de Expansión</h4>
                    <ul className="text-xs text-neutral-300 space-y-2 font-mono">
                      <li className="flex items-center space-x-2"><span className="text-amber-400">+</span><span>Silo de Cemento a Granel de 50 a 100 Toneladas con rosca transportadora.</span></li>
                      <li className="flex items-center space-x-2"><span className="text-amber-400">+</span><span>Dispositivo secundario de alimentación de colorante (Adoquines Bicapa).</span></li>
                      <li className="flex items-center space-x-2"><span className="text-amber-400">+</span><span>Moldes adicionales personalizados con tu logo corporativo grabado en relieve.</span></li>
                      <li className="flex items-center space-x-2"><span className="text-amber-400">+</span><span>Paletas sintéticas de PVC industrial de larga duración (+10 años).</span></li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* 3. CATÁLOGO INTEGRADO DE PRODUCTOS DE BBDD */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05]" id="catalogo">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] block mb-2">● Inventario Industrial Disponible</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
                Plantas & Máquinas <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 italic">Destacadas</span>
              </h2>
            </div>
            <p className="text-neutral-400 text-sm max-w-md font-light">
              Equipos de alta presión importados directamente con configuración personalizada de moldes y voltaje adaptado a tu planta local.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="p-16 border border-white/10 rounded-3xl bg-white/[0.02] text-center">
              <p className="text-neutral-400">Cargando inventario de maquinaria...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {products.map((p) => {
                let firstImage = "https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?q=80&w=2070";
                try {
                  if (p.images) {
                    const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                    if (Array.isArray(parsed) && parsed.length > 0) firstImage = parsed[0];
                  }
                } catch(e) {}

                // Strip HTML tags for clean card description preview
                const cleanDesc = p.description ? p.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

                return (
                  <div key={p.id} className="bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 group flex flex-col sm:flex-row shadow-2xl">
                    <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden bg-neutral-900">
                      <img 
                        src={firstImage} 
                        alt={p.name} 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src.includes('maxresdefault.jpg')) {
                            target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                          } else {
                            target.src = "https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?q=80&w=2070";
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                        Industrial Grade
                      </div>
                    </div>

                    <div className="sm:w-3/5 p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-3 uppercase tracking-tight leading-snug group-hover:text-amber-400 transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-neutral-400 text-xs font-light line-clamp-3 mb-6 leading-relaxed">
                          {cleanDesc || "Planta industrial automatizada para la fabricación en masa de bloques de concreto, adoquines viales y prefabricados con sistema de alta presión vibratoria."}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-6">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Inversión Estimada</span>
                            <span className="text-2xl font-black text-amber-400 font-mono">
                              ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Soporte</span>
                            <span className="text-xs font-bold text-white">Incluido 24/7</span>
                          </div>
                        </div>

                        <Link 
                          href={`/web/product/${p.id}`} 
                          className="w-full py-3.5 bg-white/5 hover:bg-amber-500 hover:text-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-white/10 hover:border-amber-500"
                        >
                          <span>Ver Ficha Técnica Completa</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. ¿QUÉ INCLUYE LA PLANTA COMPLETA? (COMPONENTES DE SERIE) */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] block mb-3">● Equipamiento de Serie Incluido</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
                ¿Qué Incluye Tu Compra por la <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 italic">Adquisición de la Planta?</span>
              </h2>
            </div>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:border-amber-500 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center space-x-3 shrink-0"
            >
              <span>Solicitar Lista de Partes</span>
              <span>→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="text-amber-500 font-mono text-xs mb-4">COMPONENTE 01</div>
              <h3 className="text-2xl font-bold text-white mb-3">Máquina Principal (Host)</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                Chasis de acero estructural electro-soldado de alta densidad. Incorpora mesa vibratoria síncrona accionado por motores de 11 kW y sistema hidráulico de presión descendente.
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 font-mono">
                <li className="flex items-center space-x-2"><span className="text-amber-400">✓</span><span>Sistema de alimentación automática de material.</span></li>
                <li className="flex items-center space-x-2"><span className="text-amber-400">✓</span><span>Válvulas electro-hidráulicas de proporcionalidad.</span></li>
              </ul>
            </div>

            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="text-amber-500 font-mono text-xs mb-4">COMPONENTE 02</div>
              <h3 className="text-2xl font-bold text-white mb-3">Mezcladora Obligatoria</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                Mezcladora de doble eje JS500 o tipo sartén Pan-Mixer. Diseñada específicamente para concreto seco de baja relación agua/cemento.
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 font-mono">
                <li className="flex items-center space-x-2"><span className="text-amber-400">✓</span><span>Revestimiento interno con placas de aleación anti-desgaste.</span></li>
                <li className="flex items-center space-x-2"><span className="text-amber-400">✓</span><span>Descarga neumática/hidráulica automatizada.</span></li>
              </ul>
            </div>

            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="text-amber-500 font-mono text-xs mb-4">COMPONENTE 03</div>
              <h3 className="text-2xl font-bold text-white mb-3">Panel de Control PLC Siemens</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                Cerebro automatizado con pantalla táctil HMI a color. Permite monitorear presiones, tiempos de vibración, conteo de bloques y diagnóstico de fallas en tiempo real.
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 font-mono">
                <li className="flex items-center space-x-2"><span className="text-amber-400">✓</span><span>Modo Automático, Semi-Automático y Manual.</span></li>
                <li className="flex items-center space-x-2"><span className="text-amber-400">✓</span><span>Módulo de tele-asistencia remota vía red IP.</span></li>
              </ul>
            </div>

            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="text-amber-500 font-mono text-xs mb-4">COMPONENTE 04</div>
              <h3 className="text-2xl font-bold text-white mb-3">Cinta Transportadora de Agregados</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                Banda transportadora vulcanizada de 6 a 8 metros con rodillos de rodamiento blindados para la elevación continua de la mezcla desde la mezcladora a la tolva.
              </p>
            </div>

            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="text-amber-500 font-mono text-xs mb-4">COMPONENTE 05</div>
              <h3 className="text-2xl font-bold text-white mb-3">Apilador de Paletas (Block Stacker)</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                Sistema elevar-apilar que agrupa automáticamente 3 a 5 paletas de bloques frescos producidos para su fácil retiro mediante montacargas o carritos.
              </p>
            </div>

            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="text-amber-500 font-mono text-xs mb-4">COMPONENTE 06</div>
              <h3 className="text-2xl font-bold text-white mb-3">Kit de Repuestos & Carritos</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                Incluye 2 carritos de extracción manual, caja de herramientas de mantenimiento industrial y paquete de sellos hidráulicos, relés e interruptores de repuesto.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. COBERTURA DE SOPORTE TÉCNICO & GARANTÍA */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05] bg-neutral-950/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] block mb-3">● Respaldo Corporativo ATOMIC</span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6 leading-none">
                Soporte Técnico <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 italic">Especializado 24/7</span>
              </h2>
              <p className="text-neutral-300 text-base font-light mb-8 leading-relaxed">
                Entendemos que el paro de una planta de producción significa pérdidas inmediatas. Por ello, estructuramos un plan integral de acompañamiento técnico post-venta.
              </p>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Montaje e Instalación On-Site</h4>
                    <p className="text-xs text-neutral-400 font-light">Nuestros ingenieros se trasladan a tu terreno para supervisar el anclaje, conexiones eléctricas e hidráulicas.</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Capacitación Operativa de Personal</h4>
                    <p className="text-xs text-neutral-400 font-light">Entrenamos a tus operarios en el manejo del panel PLC, dosificación correcta de la mezcla y limpieza preventiva.</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Stock de Repuestos & Tele-Diagnóstico</h4>
                    <p className="text-xs text-neutral-400 font-light">Acceso a repuestos originales en bodega local y diagnóstico remoto en tiempo real de códigos de falla PLC.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-neutral-900 to-black p-10 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-black text-white uppercase mb-6">Garantía Certificada ATOMIC</h3>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">Garantía Estructural Chasis</span>
                  <span className="text-xs font-mono font-bold text-amber-400">2 Años</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">Garantía Sistema Hidráulico</span>
                  <span className="text-xs font-mono font-bold text-amber-400">12 Meses</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">Garantía Módulos Electrónicos PLC</span>
                  <span className="text-xs font-mono font-bold text-amber-400">12 Meses</span>
                </div>
              </div>

              <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">¿Tienes dudas técnicas sobre tu proyecto?</p>
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-white underline hover:text-amber-300"
                >
                  Hablar directamente con un Ingeniero de Soporte →
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CALCULADORA INTERACTIVA DE PROYECCIÓN FINANCIERA (ROI) */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] block mb-3">● Proyección Financiera</span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase">Simula el Retorno de tu Inversión (ROI)</h2>
            <p className="text-neutral-400 text-sm font-light mt-2">Ajusta la producción estimada y calcula la ganancia líquida estimada para tu bloquera.</p>
          </div>

          <div className="bg-neutral-950 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              
              {/* Slider 1 */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex justify-between mb-3">
                  <span>Producción Diaria (Bloques):</span>
                  <span className="text-amber-400 font-mono text-base">{blocksPerDay.toLocaleString()} und</span>
                </label>
                <input 
                  type="range" 
                  min="1000" 
                  max="15000" 
                  step="500"
                  value={blocksPerDay}
                  onChange={(e) => setBlocksPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-neutral-500 mt-2 block">Capacidad estimada para turnos de 8 horas.</span>
              </div>

              {/* Slider 2 */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex justify-between mb-3">
                  <span>Margen Neto Estimado / Bloque:</span>
                  <span className="text-amber-400 font-mono text-base">${profitPerBlock.toFixed(2)} USD</span>
                </label>
                <input 
                  type="range" 
                  min="0.05" 
                  max="0.30" 
                  step="0.01"
                  value={profitPerBlock}
                  onChange={(e) => setProfitPerBlock(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-neutral-500 mt-2 block">Promedio de ganancia neta restando materia prima y energía.</span>
              </div>

            </div>

            {/* ROI Results Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-neutral-900/80 rounded-2xl border border-white/10 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Ganancia Estimada Mensual (26 días)</span>
                <span className="text-3xl md:text-4xl font-black text-amber-400 font-mono">
                  ${monthlyProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                </span>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Ganancia Anual Proyectada</span>
                <span className="text-3xl md:text-4xl font-black text-white font-mono">
                  ${annualProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05] bg-neutral-950/60">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] block mb-3">● Resolviendo tus Dudas</span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase">Preguntas Frecuentes de Clientes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-neutral-900/80 border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center space-x-4 hover:text-amber-400 transition-colors"
                >
                  <span className="font-bold text-sm md:text-base text-white">{faq.q}</span>
                  <span className="text-amber-400 font-mono text-xl font-black">
                    {activeFaq === idx ? "−" : "+"}
                  </span>
                </button>
                
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-xs md:text-sm text-neutral-400 font-light leading-relaxed border-t border-white/5 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FOOTER CTA PREMIUM */}
      <section className="py-24 px-6 text-center relative z-10 bg-gradient-to-b from-neutral-950 to-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
            ¿Listo para montar tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 italic">
              Planta Industrial de Bloques?
            </span>
          </h2>
          <p className="text-neutral-400 text-base font-light mb-10 max-w-2xl mx-auto">
            Cotiza directamente con nuestros especialistas de la división de maquinaria pesada. Te enviamos planos de distribución de planta y propuesta económica formal.
          </p>

          <a 
            href={whatsappLink}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-4 px-12 py-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs uppercase tracking-[0.3em] rounded-full transition-all duration-300 shadow-[0_0_50px_rgba(245,158,11,0.5)] hover:scale-105"
          >
            <span>Contactar por WhatsApp Directo</span>
            <span className="text-lg">→</span>
          </a>
        </div>
      </section>

    </div>
  );
}
