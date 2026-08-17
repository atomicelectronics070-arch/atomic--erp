"use client";

import React, { useState } from "react";
import { 
  GraduationCap, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  Send, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Zap, 
  UserCheck, 
  Instagram, 
  Linkedin,
  Globe
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ── 5 TOP UNIVERSITY FREE COURSES FOR ENTREPRENEURS ──
const COURSES = [
  {
    id: "mit",
    university: "MIT (Massachusetts Institute of Technology)",
    badge: "Innovación & Emprendimiento",
    title: "Emprendimiento en Tecnología y Startups",
    description: "Aprende el proceso paso a paso para transformar ideas tecnológicas en empresas escalables con metodología del Martin Trust Center de MIT.",
    url: "https://ocw.mit.edu/courses/entrepreneurship/",
    color: "from-red-500/20 to-orange-500/10",
    borderColor: "border-red-500/30",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/30",
    logoText: "MIT"
  },
  {
    id: "harvard",
    university: "Universidad de Harvard",
    badge: "Ciencia de Datos & Negocios",
    title: "CS50: Introducción a la Informática y Programación",
    description: "El curso insignia de Harvard para dominar pensamiento computacional, algoritmos y desarrollo de software aplicado a negocios.",
    url: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
    color: "from-crimson-500/20 to-rose-500/10",
    borderColor: "border-rose-500/30",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    logoText: "HARVARD"
  },
  {
    id: "stanford",
    university: "Universidad de Stanford",
    badge: "Inteligencia Artificial",
    title: "Inteligencia Artificial para Líderes y Emprendedores",
    description: "Comprende el impacto real de Machine Learning y Deep Learning en la automatización empresarial y modelos de negocio de nueva era.",
    url: "https://online.stanford.edu/courses/free-online-courses",
    color: "from-amber-500/20 to-yellow-500/10",
    borderColor: "border-amber-500/30",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    logoText: "STANFORD"
  },
  {
    id: "yale",
    university: "Universidad de Yale",
    badge: "Finanzas & Estrategia",
    title: "Mercados Financieros y Estrategias de Inversión",
    description: "Domina los principios del riesgo financiero, mercados de capitales y gestión de activos dictado por el Premio Nobel Robert Shiller.",
    url: "https://www.coursera.org/learn/financial-markets-global",
    color: "from-blue-500/20 to-indigo-500/10",
    borderColor: "border-blue-500/30",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    logoText: "YALE"
  },
  {
    id: "oxford",
    university: "Universidad de Oxford",
    badge: "Liderazgo & Transformación Digital",
    title: "Estrategias de Transformación Digital y Futuro del Trabajo",
    description: "Analiza cómo la disrupción tecnológica está reconfigurando industrias tradicionales y cómo liderar equipos en entornos de cambio acelerado.",
    url: "https://www.conted.ox.ac.uk/courses/",
    color: "from-purple-500/20 to-indigo-500/10",
    borderColor: "border-purple-500/30",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    logoText: "OXFORD"
  }
];

export default function RecursosLandingPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#050814] text-white flex flex-col relative selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* ── BACKGROUND GLOWS & GRID ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[160px] pointer-events-none z-0" />
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* ── NAVBAR BRANDING ── */}
      <nav className="relative z-20 w-full px-6 md:px-16 py-6 flex justify-between items-center border-b border-white/10 bg-[#050814]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-[#090d20] rounded-full flex items-center justify-center font-black text-blue-400 text-sm">
              JPG
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white">
              JUAN PABLO GUZMÁN
            </span>
            <span className="text-[10px] font-mono text-blue-400 font-bold tracking-widest uppercase">
              @JuanPabloGuzman
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-xs font-mono font-bold text-neutral-300 hover:text-white transition-all"
          >
            <Instagram size={14} className="text-pink-400" />
            <span className="hidden sm:inline">Sígueme en Instagram</span>
          </a>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center">
        
        {/* Verification Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.25)]">
          <Sparkles size={15} className="text-blue-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">
            Recursos Mencionados en Instagram
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight uppercase mb-6">
          Los 5 Cursos Gratuitos de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.35)]">
            Universidades Top
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl font-medium text-neutral-300 max-w-2xl leading-relaxed mb-10">
          Investigué y seleccioné minuciosamente las 5 mejores formaciones académicas sin costo dictadas por 
          <strong className="text-white"> MIT, Harvard, Stanford, Yale y Oxford</strong> para potenciar tus habilidades en tecnología, negocios e IA.
        </p>

        {/* Quick Anchor CTA */}
        <a
          href="#cursos"
          className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black tracking-wider uppercase text-sm shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 border border-blue-300/30"
        >
          <span>VER CURSOS AHORA</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </section>

      {/* ── COURSE LIST SECTION ── */}
      <section id="cursos" className="relative z-10 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-blue-400" size={24} />
            <h2 className="text-2xl font-black tracking-tight uppercase text-white">
              Cursos Seleccionados Directos
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400 font-bold">
            5 / 5 Disponibles Gratis
          </span>
        </div>

        {/* Course Cards */}
        <div className="flex flex-col gap-6">
          {COURSES.map((course, idx) => (
            <div 
              key={course.id}
              className={`group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${course.color} bg-[#080d1e]/90 border ${course.borderColor} backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6`}
            >
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono font-black tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    0{idx + 1} • {course.logoText}
                  </span>
                  <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight group-hover:text-blue-300 transition-colors">
                  {course.title}
                </h3>

                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  {course.description}
                </p>

                <p className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 pt-1">
                  <Award size={14} className="text-amber-400" />
                  Dictado por: <span className="text-white font-semibold">{course.university}</span>
                </p>
              </div>

              <a
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto shrink-0 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span>Acceder al curso gratis</span>
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEAD MAGNET / NEWSLETTER SECTION ("Perspectivas de IA") ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-950/80 via-[#070b1a] to-indigo-950/80 border border-blue-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(37,99,235,0.25)] overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 mb-6 shadow-lg shadow-blue-500/20">
              <Mail size={26} />
            </div>

            <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-4">
              BOLETÍN EXCLUSIVO DE IA & NEGOCIOS
            </span>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4">
              Suscríbete a "Perspectivas de IA"
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8">
              Recibe cada semana análisis accionables, herramientas de Inteligencia Artificial y estrategias de negocios sin contenido de relleno. Directo a tu bandeja de entrada.
            </p>

            {submitted ? (
              <div className="w-full p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-medium flex items-center justify-center gap-3 animate-fade-in">
                <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-white text-base">¡Suscripción confirmada!</p>
                  <p className="text-xs text-emerald-200/80">Revisa tu correo para recibir la primera edición de Perspectivas de IA.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-5 py-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-400 font-sans sm:w-1/3 transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-5 py-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-400 font-sans sm:flex-1 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {loading ? "Registrando..." : "Suscribirme Gratis"}
                  <Send size={15} />
                </button>
              </form>
            )}

            <div className="flex items-center gap-6 mt-6 text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-400" /> 100% Gratuito
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-400" /> Sin Spam
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-400" /> Cancela cuando quieras
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── AUTHORITY CLOSING NOTE ── */}
      <footer className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-20 w-full text-center border-t border-white/10">
        <div className="flex flex-col items-center gap-4 max-w-xl mx-auto">
          
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-xl shadow-blue-500/20">
            <div className="w-full h-full bg-[#090d20] rounded-full flex items-center justify-center font-black text-blue-400 text-xl">
              JPG
            </div>
          </div>

          <p className="text-sm font-medium text-neutral-300 leading-relaxed italic">
            "Mi objetivo es filtrar el ruido de internet y traerte los mejores recursos reales y ejecutables para ayudarte a acelerar tu carrera y tus negocios digitales."
          </p>

          <div className="flex flex-col items-center">
            <h4 className="text-base font-black text-white tracking-tight uppercase">
              Juan Pablo Guzmán
            </h4>
            <p className="text-xs font-mono text-blue-400 font-bold tracking-wider">
              @JuanPabloGuzman • Emprendimiento, IA & Tecnología
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2 text-neutral-400 text-xs font-mono">
            <span>© {new Date().getFullYear()} Juan Pablo Guzmán</span>
            <span>•</span>
            <Link href="/web" className="hover:text-white transition-colors">ATOMIC Store</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
