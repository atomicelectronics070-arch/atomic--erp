"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Zap,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Award
} from "lucide-react";

interface ProjectCase {
  id: string;
  category: "SEGURIDAD" | "ENERGIA" | "ARQUITECTURA" | "SOFTWARE";
  title: string;
  client: string;
  location: string;
  year: string;
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  ctaMessage: string;
}

const PROJECTS: ProjectCase[] = [
  {
    id: "barreras-arrayanes",
    category: "SEGURIDAD",
    title: "Sistema de Control de Acceso Vehicular con Barreras Dítec 2027 & Tags RFID",
    client: "Urbanización Privada Los Arrayanes",
    location: "Cumbayá, Quito",
    year: "2026",
    description: "Instalación de 2 barreras vehiculares de alto tráfico con apertura en 1.8 segundos, lectoras de telepeaje RFID para 380 vehículos y fotocélulas anti-impacto. Cero filas en horas pico.",
    metrics: [
      { label: "Tiempo de Apertura", value: "1.8 seg" },
      { label: "Vehículos Activos", value: "380+" },
      { label: "Disponibilidad", value: "99.9%" }
    ],
    tags: ["Barreras Dítec", "RFID Tags", "Control Vehicular", "CCTV"],
    ctaMessage: "Hola ATOMIC! Deseo cotizar un sistema de control de acceso vehicular similar al de Urbanización Los Arrayanes."
  },
  {
    id: "energia-solix-clinica",
    category: "ENERGIA",
    title: "Respaldo Energético Crítico LiFePO4 para Quirófanos y Cadena de Frío",
    client: "Centro Médico & Dental San Rafael",
    location: "Valle de los Chillos",
    year: "2026",
    description: "Despliegue de estaciones Anker SOLIX en cascada con transferencia automática (ATS). Garantiza autonomía de 14 horas ininterrumpidas ante apagones para sillones quirúrgicos y conservación biológica.",
    metrics: [
      { label: "Autonomía Continua", value: "14 Horas" },
      { label: "Tiempo de Switch", value: "< 20 ms" },
      { label: "Ciclos de Vida", value: "3,000+" }
    ],
    tags: ["Anker Solix", "LiFePO4", "Transferencia ATS", "Cero Ruido"],
    ctaMessage: "Hola ATOMIC! Deseo cotizar una solución de energía continua y respaldo LiFePO4 para mi empresa/clínica."
  },
  {
    id: "paneles-wpc-corporativo",
    category: "ARQUITECTURA",
    title: "Revestimiento Acústico & Diseño Interior con Paneles Ranurados WPC",
    client: "Edificio Corporativo Amazonas 100",
    location: "Quito Norte",
    year: "2026",
    description: "Instalación express de 240 metros lineales de paneles WPC Akupanel acabado nogal natural con absorción acústica en salas de directorio, recepción y oficinas ejecutivas.",
    metrics: [
      { label: "Área Revestida", value: "240 m²" },
      { label: "Tiempo Instalación", value: "48 Horas" },
      { label: "Absorción Ruido", value: "NRC 0.85" }
    ],
    tags: ["Paneles WPC", "Akupanel", "Acústica", "Diseño Premium"],
    ctaMessage: "Hola ATOMIC! Me interesa cotizar revestimiento con paneles WPC ranurados para remodelación de oficinas/hogar."
  },
  {
    id: "erp-facturacion-retail",
    category: "SOFTWARE",
    title: "Plataforma de Software ERP & Facturación Electrónica Multi-Sucursal",
    client: "Distribuidora Mayorista Ferretera BP",
    location: "Quito / Manta / Ambato",
    year: "2026",
    description: "Implementación del software ATOMIC ERP con control de inventario en tiempo real en 4 sucursales, facturación electrónica SRI automática y bot de cotizaciones para vendedores en WhatsApp.",
    metrics: [
      { label: "Sucursales Conectadas", value: "4 Puntos" },
      { label: "Emisión Facturas SRI", value: "< 1.2 seg" },
      { label: "Cierres Diarios", value: "100% Cuadrados" }
    ],
    tags: ["ATOMIC ERP", "Facturación SRI", "Multi-Tenant", "Bot WhatsApp"],
    ctaMessage: "Hola ATOMIC! Deseo cotizar la implementación del software ERP y bot de ventas para mi empresa."
  }
];

export default function TrabajosPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const filteredProjects = PROJECTS.filter((p) => {
    if (selectedFilter === "ALL") return true;
    return p.category === selectedFilter;
  });

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white pb-24">
      {/* Background Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[180px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 px-6 py-4 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            A
          </div>
          <div>
            <span className="font-heading font-black tracking-wider text-sm text-white group-hover:text-cyan-400 transition-colors">
              ATOMIC <span className="text-cyan-400 font-mono text-xs">// PROYECTOS & CASOS DE ÉXITO</span>
            </span>
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Ingeniería e Infraestructura Ejecutada
            </span>
          </div>
        </Link>

        <Link
          href="/web"
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Volver a la Tienda
        </Link>
      </nav>

      {/* Hero Header */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-inner">
          <Award size={13} className="text-cyan-400" />
          <span>PORTAFOLIO DE INGENIERÍA • MÁS DE 150 PROYECTOS EN ECUADOR</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-heading">
          DESPLIEGUES & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">CASOS REALES</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          Desde condominios de alta plusvalía y centros médicos hasta corporaciones y software industrial. Conoce cómo nuestras 4 divisiones resuelven problemas reales con garantía y soporte de por vida.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {[
            { id: "ALL", label: "TODOS LOS PROYECTOS" },
            { id: "SEGURIDAD", label: "SEGURIDAD & BARRERAS" },
            { id: "ENERGIA", label: "ENERGÍA CRÍTICA" },
            { id: "ARQUITECTURA", label: "PANELES & ACÚSTICA" },
            { id: "SOFTWARE", label: "SOFTWARE & ERP" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all ${
                selectedFilter === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group backdrop-blur-sm"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/20">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-cyan-400" /> {p.location}
                    </span>
                    <span>• {p.year}</span>
                  </div>
                </div>

                <h3 className="text-xl font-heading font-black text-white leading-tight mb-2 group-hover:text-cyan-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs font-mono text-slate-400 mb-4">
                  Cliente: <strong className="text-slate-200">{p.client}</strong>
                </p>

                <p className="text-xs text-slate-300 font-light leading-relaxed mb-6">
                  {p.description}
                </p>

                {/* Metrics Bento Row */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800/60 rounded-2xl p-3 mb-6 text-center">
                  {p.metrics.map((m, idx) => (
                    <div key={idx}>
                      <span className="block text-base font-black font-mono text-cyan-400">{m.value}</span>
                      <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[9px] font-mono text-slate-400 border border-slate-700/50">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/60">
                <a
                  href={`https://wa.me/593969043453?text=${encodeURIComponent(p.ctaMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-white hover:text-slate-950 font-black text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-transparent group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  <MessageSquare size={14} />
                  <span>Cotizar Proyecto Similar</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 mt-16 text-center">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            VISITAS TÉCNICAS EN SITIO
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-heading">
            ¿Tienes un requerimiento institucional o residencial?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo de ingeniería realiza levantamientos técnicos y visitas de factibilidad sin compromiso en Quito y provincias.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/593969043453?text=${encodeURIComponent("Hola ATOMIC! Deseo agendar una visita técnica o reunión de asesoría para un proyecto.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase font-mono tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
            >
              <MessageSquare size={16} />
              <span>Agendar Visita Técnica Oficial</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
