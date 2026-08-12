'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function ProductCardCarousel({ product: p }: { product: any }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  let imageList: string[] = [];
  try {
    if (p.images) {
      const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      if (Array.isArray(parsed) && parsed.length > 0) imageList = parsed;
      else if (typeof parsed === 'string') imageList = [parsed];
    }
  } catch(e) {}
  
  if (imageList.length === 0) {
    imageList = ["https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?q=80&w=2070"];
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const cleanDesc = p.description ? p.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

  return (
    <div className="bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 flex flex-col shadow-2xl group">
      {/* WIDE HORIZONTAL IMAGE SLIDER BANNER (NOT SQUARE) */}
      <div className="w-full h-80 sm:h-[420px] relative overflow-hidden bg-neutral-900 group/slider border-b border-white/10">
        <img
          src={imageList[currentImgIndex]}
          alt={p.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?q=80&w=2070";
          }}
          className="w-full h-full object-contain p-4 bg-neutral-900/90 transition-all duration-500"
        />

        {/* Industrial Grade Badge */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider z-10 shadow-lg">
          Industrial Grade
        </div>

        {/* Counter Badge */}
        {imageList.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/15 text-white px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold z-10 shadow-lg">
            📷 {currentImgIndex + 1} / {imageList.length}
          </div>
        )}

        {/* Interactive Left & Right Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Anterior imagen"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-200 backdrop-blur-md opacity-90 sm:opacity-0 group-hover/slider:opacity-100 z-20 shadow-2xl"
            >
              ‹
            </button>

            <button
              onClick={handleNext}
              aria-label="Siguiente imagen"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-200 backdrop-blur-md opacity-90 sm:opacity-0 group-hover/slider:opacity-100 z-20 shadow-2xl"
            >
              ›
            </button>

            {/* Dots Indicator Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2.5 bg-black/70 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 z-20">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImgIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentImgIndex === idx
                      ? 'bg-amber-400 w-7'
                      : 'bg-white/40 hover:bg-white/80 w-2.5'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* CARD INFO CONTENT */}
      <div className="p-8 md:p-10 flex flex-col justify-between flex-1 bg-neutral-950">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3 uppercase tracking-tight leading-snug group-hover:text-amber-400 transition-colors">
            {p.name}
          </h3>
          <p className="text-neutral-400 text-xs md:text-sm font-light line-clamp-3 mb-6 leading-relaxed">
            {cleanDesc || "Planta industrial automatizada para la fabricación en masa de bloques de concreto, adoquines viales y prefabricados con sistema de alta presión vibratoria."}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Inversión Estimada</span>
              <span className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
                ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Soporte Técnico</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30">
                Incluido 24/7
              </span>
            </div>
          </div>

          <Link
            href={`/web/product/${p.id}`}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <span>Ver Ficha Técnica Completa</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

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

  // State for Head-to-Head Comparison Selector
  const [selectedComparison, setSelectedComparison] = useState<number>(0);

  // State for Video Showcase Selector
  const [selectedVideoModel, setSelectedVideoModel] = useState<number>(0);

  const comparisons = [
    {
      title: "QT4-24 vs. QT4-15",
      subtitle: "Línea Semi-Automática (QT4-24) vs. Línea Comercial PLC (QT4-15)",
      modelA: {
        name: "QT4-24 (Línea Semi-Automática Completa)",
        tag: "Máximo Rendimiento Semi-Automático",
        capacity: "4,000 - 6,000 bloques/día",
        power: "18.5 kW",
        pressure: "50 KN",
        cycle: "24 - 28 segundos",
        price: "$8,450 - $14,000 USD",
        recommendedFor: "Bloqueras en expansión y contratistas regionales que buscan alta producción con consumo de solo 18.5 kW.",
        includes: "Tolva de alimentación, Cinta transportadora 6m, Host QT4-24, Mezcladora Pan JQ500, Panel Eléctrico, Motores vibradores de alta frecuencia y carritos de acarreo.",
        pros: ["Incluye los 8 componentes del kit técnico industrial", "Bajo consumo de energía eléctrica (18.5 kW)", "Retorno de inversión rápida en 5 meses"],
        cons: ["Requiere 4 operarios manuales para paletas"]
      },
      modelB: {
        name: "QT4-15 (Línea Estándar PLC)",
        tag: "Máxima Eficiencia Comercial PLC",
        capacity: "6,000 - 8,000 bloques/día",
        power: "32 kW",
        pressure: "70 KN",
        cycle: "15 - 20 segundos",
        price: "$28,000 - $38,000 USD",
        recommendedFor: "Bloqueras comerciales que requieren control 100% automático por PLC Siemens y apilador Stacker.",
        includes: "Máquina Host Vibratoria Hidráulica, Mezcladora JS500 Doble Eje, Cinta 8m, Pantalla Táctil PLC Siemens, Apilador Stacker Automático, 1 Molde Manganeso.",
        pros: ["Alta velocidad con ciclo de 15s", "Control PLC 100% automático", "Requiere solo 3-4 operarios"],
        cons: ["Requiere acometida eléctrica trifásica 35 kW"]
      }
    },
    {
      title: "QTJ4-40 vs. QT4-24",
      subtitle: "Emprendimiento Regional vs. Línea Industrial Semi-Automática",
      modelA: {
        name: "QTJ4-40 (Semi-Automática)",
        tag: "Inversión Inicial Rápida",
        capacity: "3,500 - 4,800 bloques/día",
        power: "18 kW",
        pressure: "40 KN",
        cycle: "25 - 30 segundos",
        price: "$12,500 - $18,000 USD",
        recommendedFor: "Proyectos en desarrollo, municipios pequeños, constructoras locales iniciando producción propia.",
        includes: "Máquina Host, Mezcladora JQ350, Cinta Transportadora 6m, 1 Molde Estándar, Carritos manuales.",
        pros: ["Bajo consumo eléctrico", "Operación sencilla sin electrónica compleja", "Inversión accesible"],
        cons: ["Requiere más operarios manuales", "Sin apilador automático de paletas"]
      },
      modelB: {
        name: "QT4-24 (Línea Semi-Automática Completa)",
        tag: "Compresión Hidráulica Reforzada",
        capacity: "4,000 - 6,000 bloques/día",
        power: "18.5 kW",
        pressure: "50 KN",
        cycle: "24 - 28 segundos",
        price: "$8,450 - $14,000 USD",
        recommendedFor: "Medianas bloqueras que requieren producir bloques de alta densidad y adoquines viales.",
        includes: "Línea completa con los 8 componentes de catálogo técnico industrial ATOMIC.",
        pros: ["50 KN de presión hidráulica", "Resistencia de bloque sismo-resistente superior"],
        cons: ["Acometida trifásica recomendada"]
      }
    },
    {
      title: "QT4-15 vs. QT6-15",
      subtitle: "Planta Comercial Mediana vs. Alta Escala Vial y Mampostería",
      modelA: {
        name: "QT4-15 (Línea Estándar PLC)",
        tag: "Versatilidad Urbana",
        capacity: "6,000 - 8,000 bloques/día",
        power: "32 kW",
        pressure: "70 KN",
        cycle: "15 - 20 segundos",
        price: "$28,000 - $38,000 USD",
        recommendedFor: "Operaciones con demanda constante de bloque estándar 15 y 20 en ciudades medianas.",
        includes: "Línea completa con PLC Siemens, Stacker de paletas, Mezcladora doble eje.",
        pros: ["Equilibrio perfecto costo/producción", "Mantenimiento económico", "Fácil instalación"],
        cons: ["Limitada si necesitas más de 10,000 bloques/día"]
      },
      modelB: {
        name: "QT6-15 (Línea Pesada Industrial)",
        tag: "Producción Vial & Adoquines Pavers",
        capacity: "9,000 - 12,000 bloques/día",
        power: "45 kW",
        pressure: "100 KN",
        cycle: "15 segundos",
        price: "$45,000 - $58,000 USD",
        recommendedFor: "Proveedores de infraestructura pública, adoquines viales pesados (+45 MPa) y contratos gubernamentales.",
        includes: "Máquina Host Reforzada 6 moldes/ciclo, Mezcladora JS750, Tolva de Agregados Automatizada, Stacker Electroneumático, Muestreo de datos IP.",
        pros: ["Fabrica 6 bloques de 20cm por cada bajada", "Compresión hidráulica extrema para adoquines portuarios", "Tolva inteligente de pesaje"],
        cons: ["Requiere nave industrial de al menos 1,000 m²"]
      }
    },
    {
      title: "QT6-15 vs. QT10-15",
      subtitle: "Línea Pesada vs. Macro Complejo Industrial Robótico",
      modelA: {
        name: "QT6-15 (Línea Pesada Industrial)",
        tag: "Alto Rendimiento Continuo",
        capacity: "9,000 - 12,000 bloques/día",
        power: "45 kW",
        pressure: "100 KN",
        cycle: "15 segundos",
        price: "$45,000 - $58,000 USD",
        recommendedFor: "Empresas consolidadas con flota propia de camiones de distribución regional.",
        includes: "Línea completa automatizada con mezcladora JS750 y mesa de vibración alemana síncrona.",
        pros: ["Operación continua 24/7 sin sobrecalentamiento", "Resistencia de bloque superior a normas internacionales"],
        cons: ["Inversión mayor en pallets y área de curado"]
      },
      modelB: {
        name: "QT10-15 (Macro Complejo Robótico)",
        tag: "Gigante de la Industria",
        capacity: "15,000 - 18,000 bloques/día",
        power: "75 kW",
        pressure: "120 KN",
        cycle: "12 - 15 segundos",
        price: "$75,000 - $110,000 USD",
        recommendedFor: "Megaproyectos de desarrollo urbano, puertos secos, producción masiva para exportación o franquicias de prefabricados.",
        includes: "Línea de dosificación batching plant automática de 3 tolvas, Silo de cemento 100T, Robot de empaquetado final, Sistema de curado automático en túnel.",
        pros: ["Mapeo robótico completo", "Cero manipulación humana del bloque fresco", "Máximo volumen de mercado"],
        cons: ["Inversión de capital industrial alta"]
      }
    }
  ];

  const machineVideos = [
    {
      model: "QT4-24",
      title: "Línea Semi-Automática Completa QT4-24",
      subtitle: "Demostración de operación en planta: dosificación, vibración síncrona y desmolde de bloques 400x150x200mm y adoquines viales.",
      youtubeId: "xm2R1flsOy4",
      altYoutubeId: "vUIqEcVo2s4",
      assemblyYoutubeId: "HrQmM3ewpTo",
      capacity: "4,500 - 6,000 bloques/día",
      features: [
        "Vibración vertical síncrona a 4500 RPM",
        "Compresión hidráulica de 50 KN",
        "Mezcladora Pan-Mixer JQ500 de eje vertical",
        "Cinta transportadora vulcanizada de 6 metros"
      ]
    },
    {
      model: "QT4-15",
      title: "Línea Automática PLC Siemens QT4-15",
      subtitle: "Producción continua automatizada con ciclo de moldeo de 15 segundos y apilador Stacker automático.",
      youtubeId: "HaNyLf74lkY",
      altYoutubeId: "n-WJp91t4E4",
      capacity: "6,000 - 8,000 bloques/día",
      features: [
        "Control 100% automático por PLC Siemens HMI con pantalla táctil",
        "Apilador Stacker automático de paletas cargadas de bloque fresco",
        "Mezcladora obligatoria JS500 de doble eje horizontal",
        "Cámara de compresión hidráulica de 70 KN"
      ]
    },
    {
      model: "QTJ4-35 / QTJ4-40",
      title: "Línea Semi-Automática Inicial QTJ4-35 / QTJ4-40",
      subtitle: "Equipo compacto de alta versatilidad y bajo consumo eléctrico (18 kW) para pequeños y medianos productores.",
      youtubeId: "yJtCybs9IfA",
      capacity: "3,500 - 4,800 bloques/día",
      features: [
        "Operación asistida con cilindros hidráulicos de prensa superior",
        "Motorización industrial de 18 kW (operación económica)",
        "Moldes intercambiables de acero templado al manganeso",
        "Estructura portátil y fácil mantenimiento en campo"
      ]
    },
    {
      model: "QT6-15 / QT10-15",
      title: "Macro Complejo Industrial Hidráulico QT6-15 / QT10-15",
      subtitle: "Demostración de producción pesada para adoquines viales (+45 MPa) y proyectos de infraestructura estatal.",
      youtubeId: "evwb4vWRpN8",
      capacity: "12,000 - 18,000 bloques/día",
      features: [
        "Sistema de vibro-compresión masiva a 100 - 120 KN",
        "Tolva inteligente de batching plant con pesaje automatizado de agregados",
        "Fabricación de 6 a 10 bloques de 20cm por bajada",
        "Diseñado para megaproyectos viales, puertos secos y licitaciones"
      ]
    }
  ];

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
                href="/catalogo-maquinas-de-bloques.pdf" 
                download="Catálogo_Maquinas_Bloques_ATOMIC.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-300 backdrop-blur-md flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                <span>📥 Descargar Catálogo PDF</span>
              </a>
              <a 
                href="#videos-operacion" 
                className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-300 backdrop-blur-md flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                <span>🎬 Ver Videos en Vivo</span>
              </a>
              <a 
                href="#comparativas" 
                className="w-full sm:w-auto px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-300 backdrop-blur-md hover:border-amber-500/40"
              >
                ⚔️ Comparativa 2x2
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

      {/* VIDEO SHOWCASE SECTION - DEMOSTRACIÓN DE FABRICANTES EN VIVO */}
      <section className="py-24 px-6 relative z-10 border-b border-white/[0.05] bg-gradient-to-b from-black via-neutral-950 to-black" id="videos-operacion">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <span className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-widest">
                🎬 DEMOSTRACIÓN DE FABRICANTES EN VIVO
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
              Videos de Operación Real en Planta
            </h2>
            <p className="text-neutral-400 text-sm font-light mt-4 leading-relaxed">
              Mira cómo funcionan nuestras bloqueras industriales en tiempo real: desde el mezclado del agregado hasta la vibro-compresión hidráulica y el desmolde.
            </p>
          </div>

          {/* MODEL SELECTOR BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {machineVideos.map((vid, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedVideoModel(idx)}
                className={`px-6 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedVideoModel === idx
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-amber-500/40'
                }`}
              >
                📹 {vid.model}
              </button>
            ))}
          </div>

          {/* VIDEO PLAYER & DETAILS BOX */}
          <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* VIDEO PLAYER (YOUTUBE IFRAME EMBED) */}
              <div className="lg:col-span-7">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${machineVideos[selectedVideoModel].youtubeId}?autoplay=0&rel=0`}
                    title={machineVideos[selectedVideoModel].title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {machineVideos[selectedVideoModel].assemblyYoutubeId && (
                  <div className="mt-3 flex items-center justify-between px-2 text-xs font-mono">
                    <span className="text-neutral-500">Manual en Video:</span>
                    <a
                      href={`https://www.youtube.com/watch?v=${machineVideos[selectedVideoModel].assemblyYoutubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>🛠️ Ver Video de Montaje & Ensamblaje</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>

              {/* DETAILS & SPECIFICATIONS */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    {machineVideos[selectedVideoModel].model} · VIDEO DEMO
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase mt-4 mb-2">
                    {machineVideos[selectedVideoModel].title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {machineVideos[selectedVideoModel].subtitle}
                  </p>
                </div>

                <div className="p-4 bg-neutral-900/80 border border-white/10 rounded-2xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Capacidad estimada:</span>
                    <span className="text-amber-400 font-bold">{machineVideos[selectedVideoModel].capacity}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block font-mono">
                    Aspectos Destacados en el Video:
                  </span>
                  {machineVideos[selectedVideoModel].features.map((ft, fidx) => (
                    <div key={fidx} className="flex items-center space-x-2 text-neutral-300 font-sans">
                      <span className="text-amber-400 font-mono">▸</span>
                      <span>{ft}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola Atomic, estuve viendo el video de demostración de la bloquera ${machineVideos[selectedVideoModel].model} y requiero asesoría técnica y cotización.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  <span>Cotizar Modelo {machineVideos[selectedVideoModel].model}</span>
                  <span>→</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. CUADRO ESTADÍSTICO DE PRODUCCIÓN Y CAPACIDAD (BAR CHART VISUAL) */}
      <section className="py-24 px-6 relative z-10 border-b border-white/[0.05] bg-neutral-950/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] block mb-3">📊 Métricas Comparativas de Producción</span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              Capacidad Nominal por Turno de 8 Horas
            </h2>
            <p className="text-neutral-400 text-sm font-light mt-3">
              Volumen real estimado en unidades producidas operando con mezcla estandarizada de agregado de 0 a 8mm.
            </p>
          </div>

          <div className="bg-neutral-900/60 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl space-y-8">
            
            {/* Model 1 */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-mono">
                <span className="font-bold text-white uppercase">QTJ4-40 (Semi-Automática) — 4,000 Bloques/Día</span>
                <span className="text-amber-400 font-bold">33% Capacidad Máxima</span>
              </div>
              <div className="w-full h-5 bg-neutral-950 rounded-full overflow-hidden border border-white/5 p-1">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>

            {/* Model QT4-24 */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-mono">
                <span className="font-bold text-amber-400 uppercase">QT4-24 (Línea Semi-Automática Completa) — 5,500 Bloques/Día</span>
                <span className="text-amber-400 font-bold">45% Capacidad Máxima</span>
              </div>
              <div className="w-full h-5 bg-neutral-950 rounded-full overflow-hidden border border-amber-500/30 p-1">
                <div className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            {/* Model 2 */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-mono">
                <span className="font-bold text-white uppercase">QT4-15 (Línea Comercial PLC) — 7,000 Bloques/Día</span>
                <span className="text-amber-400 font-bold">58% Capacidad Máxima</span>
              </div>
              <div className="w-full h-5 bg-neutral-950 rounded-full overflow-hidden border border-white/5 p-1">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>

            {/* Model 3 */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-mono">
                <span className="font-bold text-white uppercase">QT6-15 (Línea Pesada Industrial) — 11,000 Bloques/Día</span>
                <span className="text-amber-400 font-bold">85% Capacidad Máxima</span>
              </div>
              <div className="w-full h-5 bg-neutral-950 rounded-full overflow-hidden border border-white/5 p-1">
                <div className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Model 4 */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-mono">
                <span className="font-bold text-white uppercase">QT10-15 (Macro Complejo Robótico) — 18,000 Bloques/Día</span>
                <span className="text-amber-400 font-bold">100% Capacidad Máxima</span>
              </div>
              <div className="w-full h-5 bg-neutral-950 rounded-full overflow-hidden border border-white/5 p-1">
                <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-amber-200 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-center font-mono text-[11px]">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-neutral-500 block text-[9px] uppercase">Rendimiento Adoquín</span>
                <span className="text-amber-400 font-bold">Hasta 900 m²/día</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-neutral-500 block text-[9px] uppercase">Consumo Eléctrico</span>
                <span className="text-amber-400 font-bold">18 - 75 kW/h</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-neutral-500 block text-[9px] uppercase">Personal Operario</span>
                <span className="text-amber-400 font-bold">3 a 5 personas</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-neutral-500 block text-[9px] uppercase">Vida Útil Molde</span>
                <span className="text-amber-400 font-bold">+120,000 ciclos</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. COMPARATIVAS FRENTE A FRENTE DIRECTAS (2 EN 2) */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05]" id="comparativas">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <span className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-widest">
                ⚔️ ANÁLISIS DE SELECCIÓN DE PLANTA
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
              Comparativas Directas Modelo a Modelo
            </h2>
            <p className="text-neutral-400 text-sm font-light mt-4">
              Te ayudamos a elegir exactamente el equipo óptimo comparando pares directos de capacidad, inversión y mercado objetivo.
            </p>
          </div>

          {/* COMPARISON SELECTOR BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {comparisons.map((comp, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedComparison(idx)}
                className={`px-6 py-3.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedComparison === idx
                    ? 'bg-amber-500 text-black font-black shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-amber-500/40'
                }`}
              >
                {comp.title}
              </button>
            ))}
          </div>

          {/* ACTIVE COMPARISON DISPLAY (HEAD TO HEAD CARDS) */}
          <div className="bg-neutral-950 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            
            <div className="text-center mb-10">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
                {comparisons[selectedComparison].subtitle}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* MODEL A CARD */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                      {comparisons[selectedComparison].modelA.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-500">OPCIÓN A</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase mb-6">
                    {comparisons[selectedComparison].modelA.name}
                  </h3>

                  <div className="space-y-3 font-mono text-xs mb-8 border-t border-b border-white/10 py-6">
                    <div className="flex justify-between"><span className="text-neutral-400">Capacidad Diaria:</span><span className="text-amber-400 font-bold">{comparisons[selectedComparison].modelA.capacity}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Potencia Eléctrica:</span><span className="text-white">{comparisons[selectedComparison].modelA.power}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Fuerza de Presión:</span><span className="text-white">{comparisons[selectedComparison].modelA.pressure}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Tiempo de Ciclo:</span><span className="text-white">{comparisons[selectedComparison].modelA.cycle}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Inversión Estimada:</span><span className="text-amber-400 font-bold">{comparisons[selectedComparison].modelA.price}</span></div>
                  </div>

                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-2">¿Para quién se recomienda?</span>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                      {comparisons[selectedComparison].modelA.recommendedFor}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">Ventajas Clave:</span>
                    {comparisons[selectedComparison].modelA.pros.map((pro, pidx) => (
                      <div key={pidx} className="flex items-center space-x-2 text-neutral-300">
                        <span className="text-emerald-400">✓</span><span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 w-full py-4 bg-white/5 hover:bg-amber-500 hover:text-black text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 border border-white/10 hover:border-amber-500"
                >
                  <span>Cotizar {comparisons[selectedComparison].modelA.name}</span>
                  <span>→</span>
                </a>
              </div>

              {/* MODEL B CARD */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                      {comparisons[selectedComparison].modelB.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-500">OPCIÓN B</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase mb-6">
                    {comparisons[selectedComparison].modelB.name}
                  </h3>

                  <div className="space-y-3 font-mono text-xs mb-8 border-t border-b border-white/10 py-6">
                    <div className="flex justify-between"><span className="text-neutral-400">Capacidad Diaria:</span><span className="text-amber-400 font-bold">{comparisons[selectedComparison].modelB.capacity}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Potencia Eléctrica:</span><span className="text-white">{comparisons[selectedComparison].modelB.power}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Fuerza de Presión:</span><span className="text-white">{comparisons[selectedComparison].modelB.pressure}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Tiempo de Ciclo:</span><span className="text-white">{comparisons[selectedComparison].modelB.cycle}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Inversión Estimada:</span><span className="text-amber-400 font-bold">{comparisons[selectedComparison].modelB.price}</span></div>
                  </div>

                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-2">¿Para quién se recomienda?</span>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                      {comparisons[selectedComparison].modelB.recommendedFor}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">Ventajas Clave:</span>
                    {comparisons[selectedComparison].modelB.pros.map((pro, pidx) => (
                      <div key={pidx} className="flex items-center space-x-2 text-neutral-300">
                        <span className="text-emerald-400">✓</span><span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  <span>Cotizar {comparisons[selectedComparison].modelB.name}</span>
                  <span>→</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. GUÍA "UNA VEZ EN TUS MANOS": ACOMPAÑAMIENTO OPERATIVO PASO A PASO */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05] bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] block mb-3">🤝 Te Acompañamos en Todo Momento</span>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
              ¿Cómo se Opera Una Vez que Llega a tus Manos?
            </h2>
            <p className="text-neutral-400 text-base font-light mt-4">
              No estás solo. Desde la cimentación del terreno hasta la primera colada y la capacitación de tu personal, ATOMIC realiza el acompañamiento integral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* STEP 1 */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-black text-xl mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase">Adecuación de Terreno</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-4">
                Te entregamos los planos CAD exactos de la loza de hormigón armado (15-20cm) y la canaleta de acometida trifásica para que tu terreno esté listo antes del arribo.
              </p>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Supervisión Remota Previa</span>
            </div>

            {/* STEP 2 */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-black text-xl mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase">Instalación On-Site</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-4">
                Nuestros ingenieros mecánicos viajan a tu planta para anclar el chasis host, nivelar la mesa vibratoria, conectar bombas hidráulicas y calibrar sensores PLC.
              </p>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Ingenieros en Sitio</span>
            </div>

            {/* STEP 3 */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-black text-xl mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase">Capacitación a Operarios</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-4">
                Entrenamos a tu tripulación en la dosificación exacta de mezcla seca, manejo de la pantalla táctil Siemens y rutinas diarias de engrase y limpieza preventiva.
              </p>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Entrenamiento Completo</span>
            </div>

            {/* STEP 4 */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-black text-xl mb-6">
                04
              </div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase">Asistencia Continua 24/7</h3>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-4">
                Monitoreo continuo mediante módem industrial IP en el tablero PLC para diagnósticos en vivo, ajustes de ciclo de vibración y envío exprés de repuestos.
              </p>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Módem Tele-Diagnóstico</span>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CAPACITACIÓN MAESTRA (TABS DE DOSIFICACIÓN, MODELOS, MOLDES Y REPUESTOS) */}
      <section className="py-28 px-6 relative z-10 border-b border-white/[0.05] bg-neutral-950/50" id="capacitacion">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <span className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-widest">
                🎓 MANUAL TÉCNICO DE MEZCLA Y PRODUCCIÓN
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
              Ingeniería del Concreto Seco para Bloques
            </h2>
            <p className="text-neutral-400 text-sm font-light mt-4 leading-relaxed">
              La calidad del bloque sismo-resistente depende de la granulometría del agregado y la relación agua/cemento.
            </p>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { id: 'proceso', label: '1. Proceso & Dosificación' },
              { id: 'modelos', label: '2. Especificaciones por Modelo' },
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
                  📊 Especificaciones por Modelo
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

      {/* 6. CATÁLOGO INTEGRADO DE PRODUCTOS DE BBDD */}
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

          {products.filter(p => !p.isDeleted && p.isActive !== false).length === 0 ? (
            <div className="p-16 border border-white/10 rounded-3xl bg-white/[0.02] text-center">
              <p className="text-neutral-400">Cargando inventario de maquinaria...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {products.filter(p => !p.isDeleted && p.isActive !== false).map((p) => (
                <ProductCardCarousel key={p.id} product={p} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 7. ¿QUÉ INCLUYE LA PLANTA COMPLETA? (COMPONENTES DE SERIE) */}
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

      {/* 8. COBERTURA DE SOPORTE TÉCNICO & GARANTÍA */}
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

      {/* 9. CALCULADORA INTERACTIVA DE PROYECCIÓN FINANCIERA (ROI) */}
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

      {/* 10. FAQ ACCORDION SECTION */}
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

      {/* 11. FOOTER CTA PREMIUM */}
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
