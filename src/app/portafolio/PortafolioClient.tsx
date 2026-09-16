"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Home,
  Cpu,
  Code2,
  Wrench,
  Play,
  ArrowUpRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  X,
  Building2,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface ReferenceVideo {
  id: string;
  youtubeId: string;
  title: string;
  tag: string;
  category: string;
  clientOrLocation: string;
  description: string;
  highlights: string[];
}

const REFERENCE_VIDEOS: ReferenceVideo[] = [
  {
    id: "video-1",
    youtubeId: "Iyh6334LjsA",
    title: "Integración de Control de Acceso y Barreras Antipánico en Novacel",
    tag: "PROYECTO CORPORATIVO E INDUSTRIAL",
    category: "Control de Acceso & Normativa",
    clientOrLocation: "Novacel • Latacunga, Ecuador",
    description:
      "Despliegue e instalación integral en planta industrial de Novacel: montaje de barreras antipánico certificadas para salidas de emergencia y rutas de evacuación rápida, enlazadas con sistema de control de accesos automatizado para personal autorizado.",
    highlights: [
      "Barras antipánico de accionamiento mecánico inmediato",
      "Control de accesos y registro de personal",
      "Cumplimiento con normativas de seguridad industrial",
      "Acabados de alta resistencia para uso continuo"
    ]
  },
  {
    id: "video-2",
    youtubeId: "6r2jteg0AGg",
    title: "Sistema Residencial de Alto Nivel: Portería Smart 100% Sin Cables",
    tag: "TECNOLOGÍA RESIDENCIAL & COMUNICACIÓN",
    category: "Portería Inteligente",
    clientOrLocation: "Sector Residencial & Urbanizaciones",
    description:
      "Solución de citofonía y control de ingreso inteligente para conjuntos habitacionales y edificios: recepción de llamadas y apertura remota directamente en el teléfono celular sin necesidad de cableados analógicos entre garita y residencias.",
    highlights: [
      "Operación 100% inalámbrica sin cables a departamentos",
      "Recepción de llamadas de visita en smartphone",
      "Apertura remota de puertas y portones peatonales",
      "Reducción sustancial de costos de mantenimiento e infraestructura"
    ]
  },
  {
    id: "video-3",
    youtubeId: "WdnVlD4mXTE",
    title: "Línea Hogar: Campana Extractora Coruña para Cocinas de Alto Nivel",
    tag: "LÍNEA HOGAR & ARQUITECTURA",
    category: "Equipamiento de Cocina",
    clientOrLocation: "Línea para Arquitectos y Constructoras",
    description:
      "Presentación técnica y revisión exhaustiva de la campana extractora de pared modelo Coruña: cuerpo en acero inoxidable satinado, alta capacidad de absorción y filtrado de humos con niveles sonoros mínimos para proyectos residenciales de vanguardia.",
    highlights: [
      "Acero inoxidable de alta pureza y fácil limpieza",
      "Motor silencioso con múltiples velocidades de extracción",
      "Filtros lavables de aluminio multicapa",
      "Precios preferenciales por volumen para constructores"
    ]
  },
  {
    id: "video-4",
    youtubeId: "_rI46cUolfQ",
    title: "Barreras Antipánico Certificadas para Accesos y Salidas de Emergencia",
    tag: "SEGURIDAD INDUSTRIAL & EVACUACIÓN",
    category: "Normativa de Seguridad",
    clientOrLocation: "Edificaciones Comerciales & Corporativas",
    description:
      "Demostración de funcionamiento y análisis normativo de sistemas de barra antipánico: apertura expedita mediante presión de cuerpo, protección contra bloqueo exterior y compatibilidad con cerraduras de alta seguridad para edificios corporativos.",
    highlights: [
      "Mecanismo de apertura rápida tipo push de gran durabilidad",
      "Diseño certificado para vías de escape en caso de siniestro",
      "Opciones con manija exterior con llave de seguridad",
      "Instalación profesional certificada con garantía técnica"
    ]
  }
];

export default function PortafolioClient() {
  const [activeVideoModal, setActiveVideoModal] = useState<ReferenceVideo | null>(null);

  // Override root body background for a crisp pure white experience
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    const prevColor = document.body.style.color;
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#0F172A";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideoModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.color = prevColor;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const whatsappBaseUrl = "https://wa.me/593969043453";
  const buildWhatsAppLink = (tema: string) => {
    const text = encodeURIComponent(
      `Estimado equipo de ATOMIC, me comunico tras revisar su Portafolio Corporativo. Deseo solicitar asesoría técnica y cotización formal respecto a: ${tema}.`
    );
    return `${whatsappBaseUrl}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* ── TOP CORPORATE BAR ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/portafolio" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-black tracking-tighter text-lg group-hover:bg-blue-900 transition-colors">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-neutral-950 font-sans leading-none">
                  ATOMIC
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500 mt-1">
                  Portafolio Corporativo
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase text-neutral-600">
            <a
              href="#residencial"
              className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900"
            >
              Tecnología Residencial
            </a>
            <a
              href="#hogar"
              className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900"
            >
              Hogar
            </a>
            <a
              href="#electronica"
              className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900"
            >
              Electrónica
            </a>
            <a
              href="#software"
              className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900"
            >
              Software
            </a>
            <a
              href="#servicios"
              className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900"
            >
              Servicios
            </a>
            <a
              href="#referencias"
              className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900 font-bold text-blue-900"
            >
              Referencias en Video
            </a>
          </nav>

          {/* Corporate CTA */}
          <div className="flex items-center gap-3">
            <a
              href={buildWhatsAppLink("Consulta General de Portafolio")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-neutral-950 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Contactar a Ingeniería</span>
              <span className="sm:hidden">Contacto</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER: MINIMALIST & SOBER ── */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50/60 to-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-900 text-[11px] font-bold uppercase tracking-widest mb-6">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              Ecosistema Integral de Soluciones
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 font-sans leading-tight">
              Ingeniería, Tecnología y Equipamiento Integral
            </h1>
            <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Presentamos el portafolio corporativo de <strong>ATOMIC</strong>. Consolidamos divisiones especializadas en seguridad electrónica, línea arquitectónica para el hogar, ingeniería de hardware, desarrollo de software corporativo y servicios técnicos certificados.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-900" /> Cobertura Nacional
              </span>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-900" /> Asesoría Técnica Directa
              </span>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-900" /> Precios Especiales para Profesionales
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE DIVISIONS CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* ═══════════════════════════════════════════════════════════
            1. TECNOLOGÍA RESIDENCIAL (Horizontal Banner Format)
        ═══════════════════════════════════════════════════════════ */}
        <section id="residencial" className="scroll-mt-24">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Image Column - Facebook Cover Horizontal Aspect Ratio */}
              <div className="lg:col-span-6 relative aspect-[16/9] lg:aspect-auto h-full min-h-[260px] lg:min-h-[400px] overflow-hidden bg-neutral-100">
                <Image
                  src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80"
                  alt="Tecnología Residencial y Seguridad Electrónica ATOMIC"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm border border-neutral-200 text-neutral-900 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                    División 01
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-800" />
                    <span>Seguridad & Automatización Perimetral</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                    Tecnología Residencial
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Nos especializamos en grandes categorías de tecnología residencial, en las más importantes como cámaras de seguridad, cercos eléctricos, control de accesos perimetrales y soluciones integrales de videovigilancia y protección para urbanizaciones, edificios y conjuntos residenciales.
                  </p>

                  <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Cámaras de seguridad IP con visión nocturna, analítica inteligente y acceso remoto desde dispositivos móviles.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Cercos eléctricos de alto voltaje pulsante certificados, con algoritmos anti-sabotaje y monitoreo celular.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Sistemas de control de acceso vehicular y peatonal para garitas de alta afluencia.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Citofonía digital e intercomunicadores inteligentes sin necesidad de cableado complejo.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={buildWhatsAppLink("Tecnología Residencial y Seguridad Electrónica")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Solicitar Propuesta Residencial</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-neutral-400 font-medium">
                    Proyectos Llave en Mano • Garantía Técnica
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. HOGAR (Horizontal Banner Format)
        ═══════════════════════════════════════════════════════════ */}
        <section id="hogar" className="scroll-mt-24">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Content Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between order-2 lg:order-1">
                <div>
                  <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                    <Home className="w-4 h-4 text-blue-800" />
                    <span>Línea Arquitectónica & Construcción</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                    Línea Hogar para Arquitectos y Constructores
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Nos complace también ofrecer nuestra línea de hogar personalizada para arquitectos y constructores que desean precios preferenciales para adaptaciones o artículos al por mayor. Ponemos a su disposición encimeras, campanas extractoras, calefones, calefactores de ambientes y equipamiento de cocina con los más altos estándares de eficiencia, durabilidad y estética contemporánea.
                  </p>

                  <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Precios corporativos directos de distribuidor para constructoras, contratistas y estudios de diseño.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Encimeras de 4 y 5 quemadores en vidrio templado y acero inoxidable (gas e inducción).</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Campanas extractoras empotrables de pared e isla con filtración silenciosa de alta potencia.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Calefones a gas y eléctricos de alto rendimiento para agua caliente continua en obras.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={buildWhatsAppLink("Línea Hogar para Arquitectos y Constructoras")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Cotizar Lotes por Mayor</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-neutral-400 font-medium">
                    Atención a Planos y Mediciones en Obra
                  </span>
                </div>
              </div>

              {/* Image Column */}
              <div className="lg:col-span-6 relative aspect-[16/9] lg:aspect-auto h-full min-h-[260px] lg:min-h-[400px] overflow-hidden bg-neutral-100 order-1 lg:order-2">
                <Image
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
                  alt="Línea Hogar Arquitectónica ATOMIC"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm border border-neutral-200 text-neutral-900 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                    División 02
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            3. ELECTRÓNICA (Horizontal Banner Format)
        ═══════════════════════════════════════════════════════════ */}
        <section id="electronica" className="scroll-mt-24">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Image Column */}
              <div className="lg:col-span-6 relative aspect-[16/9] lg:aspect-auto h-full min-h-[260px] lg:min-h-[400px] overflow-hidden bg-neutral-100">
                <Image
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
                  alt="Ingeniería Electrónica y Componentes ATOMIC"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm border border-neutral-200 text-neutral-900 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                    División 03
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                    <Cpu className="w-4 h-4 text-blue-800" />
                    <span>Hardware, Sensores & Prototipado</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                    Ingeniería Electrónica y Componentes
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Proveemos equipamiento especializado y la más alta asesoría técnica profesional en componentes electrónicos para el diseño, prototipado y ejecución de proyectos interactivos, automatización y soluciones embebidas de alta precisión.
                  </p>

                  <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Suministro de semiconductores, microcontroladores y módulos de adquisición de datos.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Instrumentación de laboratorio, fuentes reguladas y herramientas de precisión para bancos de prueba.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Asesoría en diseño esquemático, montaje de circuitos impresos y validación de hardware.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Integración de dispositivos IoT, telemetría y protocolos industriales de comunicación.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={buildWhatsAppLink("Equipamiento y Componentes Electrónicos")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Consultar Componentes & Proyectos</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-neutral-400 font-medium">
                    Asesoría Técnica en Prototipos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            4. SOFTWARE (Horizontal Banner Format)
        ═══════════════════════════════════════════════════════════ */}
        <section id="software" className="scroll-mt-24">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Content Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between order-2 lg:order-1">
                <div>
                  <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                    <Code2 className="w-4 h-4 text-blue-800" />
                    <span>Desarrollo de Software & Soluciones Digitales</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                    Software y Plataformas Empresariales
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Diseñamos y desarrollamos las mejores soluciones digitales corporativas para empresas de todo tamaño: desde tiendas de comercio electrónico de alto rendimiento y catálogos en línea, hasta sistemas integrales de gestión ERP y CRM con facturación electrónica mensual en la nube, operados por equipos experimentados de ingeniería de software.
                  </p>

                  <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Tiendas virtuales y catálogos interactivos con pasarelas de pago y gestión de inventario en tiempo real.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Sistemas ERP y CRM a medida para el control de cotizaciones, clientes, comisiones y logística.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Facturación electrónica mensual autorizada por el SRI con emisión masiva y resguardo tributario.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Infraestructura moderna en la nube con alta disponibilidad, seguridad de datos y copias de respaldo.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={buildWhatsAppLink("Desarrollo de Software, Tiendas Online y ERP")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Solicitar Demostración de Software</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-neutral-400 font-medium">
                    Desarrollo Ágil • Facturación SRI
                  </span>
                </div>
              </div>

              {/* Image Column */}
              <div className="lg:col-span-6 relative aspect-[16/9] lg:aspect-auto h-full min-h-[260px] lg:min-h-[400px] overflow-hidden bg-neutral-100 order-1 lg:order-2">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                  alt="Desarrollo de Software y ERP ATOMIC"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm border border-neutral-200 text-neutral-900 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                    División 04
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            5. SERVICIOS (Horizontal Banner Format)
        ═══════════════════════════════════════════════════════════ */}
        <section id="servicios" className="scroll-mt-24">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Image Column */}
              <div className="lg:col-span-6 relative aspect-[16/9] lg:aspect-auto h-full min-h-[260px] lg:min-h-[400px] overflow-hidden bg-neutral-100">
                <Image
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                  alt="Servicios Técnicos Especializados ATOMIC"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm border border-neutral-200 text-neutral-900 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                    División 05
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                    <Wrench className="w-4 h-4 text-blue-800" />
                    <span>Soporte Técnico, Instalación & Consultoría</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                    Servicios Técnicos Especializados
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Además de nuestras divisiones de tecnología, nuestro personal técnico recibe constantes capacitaciones, certificaciones y herramientas de precisión para brindar servicios altamente competentes: instalación profesional, mantenimiento preventivo y correctivo, consultoría en sitio y desarrollo de propuestas técnicas a medida para proyectos residenciales, comerciales e industriales.
                  </p>

                  <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Cuadrillas técnicas capacitadas y provistas con instrumental homologado de prueba.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Instalación y calibración de equipos cumpliendo normativas de seguridad y orden técnico.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Planes de mantenimiento preventivo para garantizar la continuidad operativa de sus sistemas.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span>Emisión de informes técnicos de diagnóstico con levantamiento de observaciones y recomendaciones.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={buildWhatsAppLink("Servicios Técnicos Especializados e Instalación")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Agendar Visita Técnica</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-neutral-400 font-medium">
                    Personal Calificado • Garantía de Servicio
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            6. SECCIÓN DIFERENCIADA: REFERENCIAS Y TRABAJOS REALIZADOS
        ═══════════════════════════════════════════════════════════ */}
        <section
          id="referencias"
          className="scroll-mt-24 pt-12 pb-16 px-6 sm:px-10 lg:px-12 rounded-3xl bg-neutral-50/80 border border-neutral-200/90 shadow-sm"
        >
          {/* Header of the Distinct Section */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-[11px] font-bold uppercase tracking-widest mb-4">
              <Play className="w-3 h-3 text-blue-800 fill-blue-800" />
              Evidencia en Video de Instalaciones
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Referencias y Trabajos Realizados
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Consulte registros audiovisuales reales de intervenciones técnicas, ensamblajes de equipos y puesta en marcha ejecutados por nuestro equipo. Cada video documenta la aplicación de normas técnicas y la calidad de los acabados entregados a nuestros clientes.
            </p>
          </div>

          {/* 4 Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REFERENCE_VIDEOS.map((video, idx) => (
              <div
                key={video.id}
                className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* YouTube Thumbnail Container with 16:9 Aspect Ratio */}
                  <div
                    onClick={() => setActiveVideoModal(video)}
                    className="relative aspect-video w-full bg-neutral-900 overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Dark gradient overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

                    {/* Category / Location Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-neutral-200 text-neutral-900 text-[9px] font-extrabold uppercase tracking-wider rounded">
                        {video.category}
                      </span>
                    </div>

                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-blue-900/90 group-hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all transform group-hover:scale-110">
                        <Play className="w-6 h-6 ml-0.5 fill-white text-white" />
                      </div>
                    </div>

                    {/* Video Duration / Client strip */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white/90">
                      <span>{video.clientOrLocation}</span>
                      <span className="px-2 py-0.5 rounded bg-black/60 font-mono text-[10px]">
                        YouTube Video
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Project Summary */}
                  <div className="p-6">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-blue-900 mb-2">
                      {video.tag}
                    </div>
                    <h3 className="text-lg font-bold text-neutral-950 leading-snug group-hover:text-blue-900 transition-colors">
                      {video.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {video.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2">
                      {video.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-neutral-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-neutral-100 mt-4">
                  <button
                    onClick={() => setActiveVideoModal(video)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 hover:text-blue-700 uppercase tracking-wider py-2"
                  >
                    <span>Reproducir Video</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                  >
                    <span>Ver en YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Notice for link additions and transparency */}
          <div className="mt-12 p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center flex-shrink-0">
                <Play className="w-4 h-4 fill-blue-900" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-600">
                <strong>Actualización de Proyectos:</strong> El departamento técnico de ATOMIC documenta periódicamente nuevas instalaciones y casos de éxito para su consulta corporativa.
              </p>
            </div>
            <a
              href={buildWhatsAppLink("Consulta sobre Referencias de Obras y Videos")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0"
            >
              <span>Consultar Obras Similares</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>

      {/* ── VIDEO PLAYER MODAL ── */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                  {activeVideoModal.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-neutral-900 line-clamp-1">
                  {activeVideoModal.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
                title="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded YouTube Player with Autoplay */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Modal Bottom Details */}
            <div className="p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-neutral-600 max-w-xl">
                {activeVideoModal.description}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideoModal.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Abrir en YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CORPORATE FOOTER ── */}
      <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-600 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Column 1: Brand presentation */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-black text-sm">
                  A
                </div>
                <span className="font-extrabold text-lg tracking-tight text-neutral-950">
                  ATOMIC
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Empresa especializada en soluciones de ingeniería, seguridad electrónica, equipamiento para el hogar, electrónica aplicada y desarrollo de software.
              </p>
              <p className="text-[11px] text-neutral-400 font-medium">
                Quito, Ecuador • Cobertura Nacional
              </p>
            </div>

            {/* Column 2: Divisions */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-4">
                Divisiones
              </h5>
              <ul className="space-y-2.5 text-xs text-neutral-600 font-medium">
                <li>
                  <a href="#residencial" className="hover:text-blue-900 transition-colors">
                    Tecnología Residencial
                  </a>
                </li>
                <li>
                  <a href="#hogar" className="hover:text-blue-900 transition-colors">
                    Línea Hogar Arquitectónica
                  </a>
                </li>
                <li>
                  <a href="#electronica" className="hover:text-blue-900 transition-colors">
                    Ingeniería Electrónica
                  </a>
                </li>
                <li>
                  <a href="#software" className="hover:text-blue-900 transition-colors">
                    Desarrollo de Software & ERP
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="hover:text-blue-900 transition-colors">
                    Servicios Técnicos Certificados
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Attention */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-4">
                Contacto Técnico
              </h5>
              <ul className="space-y-3 text-xs text-neutral-600">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <span>Oficina Matriz: Sector El Labrador, Quito - Ecuador</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <span>Atención Comercial: +593 96 904 3453</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <span>Lunes a Viernes: 08:30 – 18:00</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Action */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-4">
                Solicitud de Propuestas
              </h5>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                Atendemos requerimientos institucionales, arquitectónicos y comerciales con cotizaciones detalladas y asesoría técnica.
              </p>
              <a
                href={buildWhatsAppLink("Solicitud General de Propuesta Técnica")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-neutral-950 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Solicitar Asesoría</span>
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <span>
              © {new Date().getFullYear()} ATOMIC. Todos los derechos reservados.
            </span>
            <div className="flex items-center gap-6">
              <Link href="/web" className="hover:text-neutral-900 transition-colors">
                Catálogo Web
              </Link>
              <Link href="/login" className="hover:text-neutral-900 transition-colors">
                Acceso Corporativo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
