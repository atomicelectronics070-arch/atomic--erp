"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Building2, Cpu, Zap, ShieldCheck, ArrowRight, Phone, 
  Layers, Users, Award, TrendingUp, CheckCircle2, Rocket, 
  Terminal, Globe, MessageSquare, ExternalLink, ChevronRight
} from "lucide-react"

export default function SantiagoGuzmanClient() {
  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  const PILARES = [
    {
      icon: <Cpu className="text-amber-400" size={24} />,
      title: "Arquitectura Tecnológica & ERP",
      desc: "Desarrollo y modernización de plataformas empresariales de alta disponibilidad, sistemas multi-tenant y motores automatizados de facturación e inventario."
    },
    {
      icon: <Building2 className="text-blue-400" size={24} />,
      title: "Ecosistema Comercial ATOMIC",
      desc: "Consolidación de líneas de distribución directa en seguridad inteligente (cerraduras biométricas, CCTV 4K), energía portátil de emergencia (Anker SOLIX), computación y monitores."
    },
    {
      icon: <TrendingUp className="text-emerald-400" size={24} />,
      title: "Automatización & Escalamiento",
      desc: "Integración de pipelines continuos, omnicanalidad con WhatsApp corporativo y logística de despacho el mismo día para Quito y cobertura nacional."
    },
    {
      icon: <ShieldCheck className="text-purple-400" size={24} />,
      title: "Garantía & Confianza del Cliente",
      desc: "Políticas comerciales transparentes con facturación autorizada por el SRI, soporte técnico certificado y respaldo de fábrica en todos los equipos."
    }
  ]

  const PROYECTOS = [
    {
      name: "ATOMIC Store Ecuador",
      tag: "E-COMMERCE & HARDWARE",
      desc: "Tienda insignia con catálogo inteligente de tecnología residencial, periféricos gamers y equipos industriales.",
      link: "/web"
    },
    {
      name: "Cerraduras Inteligentes & Biometría",
      tag: "SEGURIDAD DE ACCESO",
      desc: "Línea líder de cerraduras WiFi con reconocimiento facial 3D, 5 pistones y entrega inmediata.",
      link: "/web/cerraduras-oferta"
    },
    {
      name: "Estaciones Anker SOLIX & Respaldo",
      tag: "ENERGÍA LIMPIA",
      desc: "Generadores eléctricos LiFePO4 sin combustible ni ruidos para contingencias energéticas.",
      link: "/web/anker-solix"
    },
    {
      name: "Serie: 48 Leyes del Poder (Juan Pablo Guzmán)",
      tag: "CONTENIDO & ESTRATEGIA",
      desc: "Serie en video sobre psicología de poder y modelos de crecimiento de marca personal.",
      link: "/web/juan-pablo-guzman"
    }
  ]

  return (
    <div className="min-h-screen bg-[#070a12] text-stone-100 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 text-white px-4 py-2 text-center text-xs font-mono font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-2 flex-wrap">
        <span>⚡ EQUIPO FUNDADOR // SANTIAGO GUZMÁN • FUNDADOR & DIRECTOR EJECUTIVO (CEO)</span>
        <span className="bg-black/40 text-amber-300 px-2 py-0.5 rounded text-[10px]">
          ATOMIC ECUADOR
        </span>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#080d1a]/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/web" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              SG
            </div>
            <div>
              <span className="font-heading font-black text-base sm:text-lg text-white tracking-wider">
                SANTIAGO GUZMÁN
              </span>
              <span className="block text-[9px] font-mono text-cyan-400 tracking-widest uppercase">
                FUNDADOR & CEO // ATOMIC
              </span>
            </div>
          </Link>

          {/* Sibling navigation to Juan Pablo Guzmán */}
          <div className="flex items-center gap-3">
            <Link
              href="/web/juan-pablo-guzman"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all"
            >
              <Users size={13} />
              <span>Ver Juan Pablo Guzmán</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/web"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold transition-all"
            >
              <span>Tienda Oficial</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER: FOUNDER PROFILE ── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-8 border-b border-stone-800 bg-radial from-[#131d36] via-[#090e1c] to-[#04060d]">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
            <Building2 size={14} className="text-blue-400" />
            <span>Liderazgo, Ejecución & Visión Tecnológica</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight uppercase leading-[1.08] max-w-4xl mx-auto">
            Construyendo el Futuro del <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Comercio & Hardware en Ecuador
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Al frente de la dirección operativa y tecnológica de <strong>ATOMIC</strong>, 
            <strong> Santiago Guzmán</strong> lidera la integración de soluciones de seguridad biométrica, 
            autonomía energética y escalabilidad empresarial con los estándares de calidad más altos del mercado ecuatoriano.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href={`https://wa.me/${officialPhone}?text=${encodeURIComponent("¡Hola Santiago! Deseo ponerme en contacto contigo para una consulta comercial / tecnológica de ATOMIC.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all"
            >
              <Phone size={14} />
              <span>Contactar a Santiago ({formattedPhone})</span>
            </a>

            <Link
              href="/web/juan-pablo-guzman"
              className="py-3 px-6 rounded-xl bg-[#0e1628] hover:bg-[#131e36] border border-amber-500/50 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <span>Explorar Serie 48 Leyes (Juan Pablo)</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* ── PILARES DE LIDERAZGO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-widest">
            PRINCIPIOS DE EJECUCIÓN
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase">
            Pilares Estratégicos de Gestión
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Una visión pragmática basada en resultados medibles, velocidad de desarrollo y excelencia en el servicio al cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILARES.map((p, idx) => (
            <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-[#090f1e] border border-stone-800 space-y-3 hover:border-blue-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="font-heading font-black text-lg text-white uppercase pt-1">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROYECTOS & VERTICALES ACTIVAS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-stone-800 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-blue-400 tracking-wider">
              ECOSISTEMA ACTIVO
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase">
              Verticales de Negocio en ATOMIC
            </h2>
          </div>
          <Link
            href="/web"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Ver toda la tienda en línea</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROYECTOS.map((proj, idx) => (
            <Link
              key={idx}
              href={proj.link}
              className="p-6 rounded-3xl bg-[#070d1a] border border-stone-800 hover:border-cyan-500/50 p-6 flex flex-col justify-between space-y-4 group transition-all shadow-lg"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black uppercase text-cyan-400 tracking-wider block">
                  {proj.tag}
                </span>
                <h3 className="font-heading font-black text-base text-white uppercase group-hover:text-cyan-300 transition-colors">
                  {proj.name}
                </h3>
                <p className="text-xs text-stone-400 font-sans leading-relaxed">
                  {proj.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>Acceder a la sección</span>
                <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-stone-800 bg-[#04060c] py-12 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/web/juan-pablo-guzman"
              className="px-5 py-2.5 rounded-full bg-[#0a1224] hover:bg-[#101b36] border border-amber-500/40 text-amber-300 font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <Users size={14} />
              <span>Ver perfil de Juan Pablo Guzmán (Marca Personal & 48 Leyes)</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/web"
              className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 transition-all"
            >
              Ir a la Tienda ATOMIC
            </Link>
          </div>

          <p>© {new Date().getFullYear()} ATOMIC Ecuador • Liderazgo & Dirección de Operaciones.</p>
        </div>
      </footer>

    </div>
  )
}
