"use client";

// Publicación #4 — Landing Page & Blog de Recursos YouTube Gratuitos con Imágenes Oficiales de Láminas

import React, { useState } from "react";
import { 
  Youtube, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  Send, 
  ArrowRight, 
  Award, 
  PlayCircle, 
  Instagram
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ── 9 YOUTUBE COURSES WITH OFFICIAL SLIDE IMAGES ──
const YOUTUBE_COURSES = [
  {
    id: "video-01",
    num: "01",
    creator: "Alex Hormozi",
    badge: "Ventas & Negocios",
    title: "How to Sell Better than 99% Of People (4 Hour Ultimate Guide)",
    description: "La guía definitiva de 4 horas para dominar el arte de las ventas, cierre de tratos, manejo de objeciones y psicología del comprador sin ser agresivo.",
    url: "https://www.youtube.com/results?search_query=Alex+Hormozi+How+to+Sell+Better+than+99%25+Of+People",
    image: "/posts/post-4/slide-3.jpg",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    borderColor: "border-amber-500/30"
  },
  {
    id: "video-02",
    num: "02",
    creator: "Awa K. Penn",
    badge: "Inteligencia Artificial & Copywriting",
    title: "Stop Asking Claude to 'Humanise This' — Do This Instead! (100% AI Detection Bypass)",
    description: "Método exacto paso a paso para estructurar prompts en Claude e IA para que redacten textos completamente naturales, humanos y que pasen los detectores de IA.",
    url: "https://www.youtube.com/results?search_query=Awa+K+Penn+Stop+asking+Claude+to+Humanise+This",
    image: "/posts/post-4/slide-1.jpg",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    borderColor: "border-purple-500/30"
  },
  {
    id: "video-03",
    num: "03",
    creator: "Suhit Amin",
    badge: "Marketing de Influencers & Agencias",
    title: "Full Influencer Marketing Agency Course [100% FREE]",
    description: "Curso completo de nivel avanzado para crear y escalar una agencia de marketing de influencers desde $0 hasta facturar más de $5M.",
    url: "https://www.youtube.com/results?search_query=Suhit+Amin+Full+Influencer+Marketing+Agency+Course",
    image: "/posts/post-4/slide-10.jpg",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    borderColor: "border-emerald-500/30"
  },
  {
    id: "video-04",
    num: "04",
    creator: "Nick Saraev",
    badge: "Programación con IA & Agentes",
    title: "CLAUDE CODE FULL COURSE 4 HOURS: Build & Sell (2026)",
    description: "Curso maestro de 4 horas sobre Claude Code, arquitectura de subagentes, herramientas MCP, memoria de contexto y cómo construir y vender software con IA.",
    url: "https://www.youtube.com/results?search_query=Nick+Saraev+CLAUDE+CODE+FULL+COURSE+4+HOURS",
    image: "/posts/post-4/slide-6.jpg",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    borderColor: "border-blue-500/30"
  },
  {
    id: "video-05",
    num: "05",
    creator: "Awa K. Penn",
    badge: "Diseño & UI/UX con IA",
    title: "Forget Canva & Figma: Claude Design is Taking Over (Claude Design in 10 Mins)",
    description: "Cómo usar las capacidades de diseño nativas de Claude para generar interfaces web, componentes visuales y maquetas completas en minutos.",
    url: "https://www.youtube.com/results?search_query=Awa+K+Penn+Forget+Canva+Figma+Claude+Design",
    image: "/posts/post-4/slide-5.jpg",
    tagColor: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    borderColor: "border-pink-500/30"
  },
  {
    id: "video-06",
    num: "06",
    creator: "John Maxwell / Maxwell Leadership",
    badge: "Liderazgo & Comunicación",
    title: "Improve Your Communication Skills with This! How Successful People Talk",
    description: "Los secretos y principios fundamentales de comunicación efectiva, persuasión y oratoria dictados por el equipo de liderazgo certificado de John C. Maxwell.",
    url: "https://www.youtube.com/results?search_query=Maxwell+Leadership+Improve+Your+Communication+Skills+with+This",
    image: "/posts/post-4/slide-9.jpg",
    tagColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    borderColor: "border-cyan-500/30"
  },
  {
    id: "video-07",
    num: "07",
    creator: "Tyson 4D",
    badge: "Copywriting de Respuesta Directa",
    title: "FREE 8 Hour Copywriting Course For Beginners | $0-$10k/mo In 90 Days",
    description: "Masterclass intensiva de 8 horas sobre redacción persuasiva, ofertas irresistibles y secuencias de emails para generar ingresos recurrentes.",
    url: "https://www.youtube.com/results?search_query=Tyson+4D+FREE+8+Hour+Copywriting+Course",
    image: "/posts/post-4/slide-4.jpg",
    tagColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    borderColor: "border-rose-500/30"
  },
  {
    id: "video-08",
    num: "08",
    creator: "Charlie Hills",
    badge: "Edición de Video & Automatización con IA",
    title: "Did Claude Code Just Replace Video Editors? (Editing is Over)",
    description: "Análisis técnico y demostración en vivo sobre cómo los nuevos modelos de IA y herramientas de código pueden automatizar la edición de video.",
    url: "https://www.youtube.com/results?search_query=Charlie+Hills+Did+Claude+Code+Just+Replace+Video+Editors",
    image: "/posts/post-4/slide-7.jpg",
    tagColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    borderColor: "border-indigo-500/30"
  },
  {
    id: "video-09",
    num: "09",
    creator: "Dr. Tracey Marks",
    badge: "Neurociencia & Productividad Mental",
    title: "The 3 Brain Strategies That *Actually* Rewire Your Mind (The REWIRE Formula)",
    description: "Explicación neurocientífica para reprogramar patrones mentales, eliminar la procrastinación y elevar la concentración profunda en proyectos de alto impacto.",
    url: "https://www.youtube.com/results?search_query=Dr+Tracey+Marks+The+3+Brain+Strategies+That+Actually+Rewire+Your+Mind",
    image: "/posts/post-4/slide-8.jpg",
    tagColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    borderColor: "border-teal-500/30"
  }
];

export default function Post4LandingPage() {
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
    <main className="min-h-screen bg-[#030612] text-white flex flex-col relative selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* ── BACKGROUND LIGHT GLOWS ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[650px] bg-gradient-to-b from-red-600/15 via-blue-600/10 to-transparent blur-[160px] pointer-events-none z-0" />
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="relative z-20 w-full px-6 md:px-16 py-6 flex justify-between items-center border-b border-white/10 bg-[#030612]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 p-[2px] shadow-lg shadow-red-500/30">
            <div className="w-full h-full bg-[#070b1a] rounded-full flex items-center justify-center font-black text-red-400 text-sm">
              JPG
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white uppercase">
              JUAN PABLO GUZMÁN
            </span>
            <span className="text-[10px] font-mono text-red-400 font-bold tracking-widest uppercase">
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
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center">
        
        {/* Verification Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.25)]">
          <Youtube size={16} className="text-red-500 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">
            Recursos Mencionados en la Publicación #4
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight uppercase mb-6">
          9 Cursos Gratuitos de YouTube que <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.35)]">
            Enseñan Más que un Título Universitario
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl font-medium text-neutral-300 max-w-2xl leading-relaxed mb-10">
          Selección ejecutiva de las formaciones gratuitas más potentes sobre <strong className="text-white">Ventas, Copywriting, Agentes de IA (Claude Code), Edición, Liderazgo y Neurociencia</strong>.
        </p>

        {/* Action CTA */}
        <a
          href="#cursos"
          className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-black tracking-wider uppercase text-sm shadow-[0_0_40px_rgba(225,29,72,0.5)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 border border-red-300/30"
        >
          <span>ACCEDER A LOS 9 CURSOS CON FOTOS OFICIALES</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </section>

      {/* ── COURSE LIST / BLOG CONTENT WITH SLIDE IMAGES ── */}
      <section id="cursos" className="relative z-10 max-w-5xl mx-auto px-6 py-12 w-full">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <PlayCircle className="text-red-500" size={26} />
            <h2 className="text-2xl font-black tracking-tight uppercase text-white">
              Los 9 Recursos de Alto Valor
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400 font-bold">
            9 / 9 Fotos de Lámina Incluidas
          </span>
        </div>

        {/* YouTube Video Cards with Images */}
        <div className="flex flex-col gap-8">
          {YOUTUBE_COURSES.map((course) => (
            <div 
              key={course.id}
              className={`group relative p-6 sm:p-8 rounded-3xl bg-[#070b1a]/90 border ${course.borderColor} backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] flex flex-col md:flex-row items-stretch gap-8`}
            >
              {/* Slide Image Preview */}
              <div className="w-full md:w-80 h-52 sm:h-60 shrink-0 relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold text-white/90 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
                  LÁMINA OFICIAL {course.num}
                </span>
              </div>

              {/* Course Info */}
              <div className="flex flex-col justify-between flex-1 gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono font-black tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                      Video {course.num}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${course.tagColor}`}>
                      {course.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight group-hover:text-red-300 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                    {course.description}
                  </p>

                  <p className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 pt-1">
                    <Award size={14} className="text-amber-400" />
                    Creador: <span className="text-white font-semibold">{course.creator}</span>
                  </p>
                </div>

                <a
                  href={course.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto self-start px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span>Ver Video en YouTube</span>
                  <ExternalLink size={16} />
                </a>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ── LEAD MAGNET / NEWSLETTER SECTION ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-red-950/70 via-[#070b1a] to-blue-950/70 border border-red-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(239,68,68,0.25)] overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 mb-6 shadow-lg shadow-red-500/20">
              <Mail size={26} />
            </div>

            <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full mb-4">
              BOLETÍN EXCLUSIVO DE IA & NEGOCIOS
            </span>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4">
              Suscríbete a "Perspectivas de IA"
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8">
              Recibe semanalmente guías prácticas, herramientas avanzadas de Inteligencia Artificial y estrategias de negocios sin contenido de relleno.
            </p>

            {submitted ? (
              <div className="w-full p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-medium flex items-center justify-center gap-3 animate-fade-in">
                <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-white text-base">¡Suscripción confirmada!</p>
                  <p className="text-xs text-emerald-200/80">Revisa tu correo para recibir las próximas recomendaciones exclusivas.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-5 py-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-red-400 font-sans sm:w-1/3 transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-5 py-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-red-400 font-sans sm:flex-1 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {loading ? "Registrando..." : "Suscribirme Gratis"}
                  <Send size={15} />
                </button>
              </form>
            )}

            <div className="flex items-center gap-6 mt-6 text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-red-400" /> 100% Gratuito
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-red-400" /> Sin Spam
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-red-400" /> Cancela cuando quieras
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── AUTHORITY FOOTER ── */}
      <footer className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-20 w-full text-center border-t border-white/10">
        <div className="flex flex-col items-center gap-4 max-w-xl mx-auto">
          
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-blue-600 p-[2px] shadow-xl shadow-red-500/20">
            <div className="w-full h-full bg-[#070b1a] rounded-full flex items-center justify-center font-black text-red-400 text-xl">
              JPG
            </div>
          </div>

          <p className="text-sm font-medium text-neutral-300 leading-relaxed italic">
            "Selecciono y sintetizo el mejor contenido educativo gratuito de la web para ayudarte a dominar habilidades de alta demanda y acelerar tus proyectos."
          </p>

          <div className="flex flex-col items-center">
            <h4 className="text-base font-black text-white tracking-tight uppercase">
              Juan Pablo Guzmán
            </h4>
            <p className="text-xs font-mono text-red-400 font-bold tracking-wider">
              @JuanPabloGuzman • Emprendimiento & Tecnología
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
