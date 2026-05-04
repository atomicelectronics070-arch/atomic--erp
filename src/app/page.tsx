"use client"
// Atomic Solutions Unified Core - v7.1.0 (Navy Theme + Banners)

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowRight, Shield, Database, BrainCircuit,
  LayoutGrid, Sparkles, Activity, Eye, FileText
} from "lucide-react"

// Banners data — una imagen + descripción + PDF por banner
const BANNERS = [
  {
    id: "sence-face",
    image: "/banners/banner2.jpg",
    title: "SENCE FACE",
    subtitle: "Tecnología de Reconocimiento Facial Corporativo",
    description: "Solución de control de acceso e identificación biométrica con IA. Precisión militar para entornos empresariales.",
    cta: "Ver Ficha Técnica",
    badge: "NUEVO",
    color: "#1E3A8A",
  },
  {
    id: "operacion-espias",
    image: "/banners/banner1.jpg",
    title: "OPERACIÓN INTEL",
    subtitle: "Inteligencia Corporativa en Tiempo Real",
    description: "Sistema de vigilancia y análisis de datos para proteger activos estratégicos de su organización.",
    cta: "Descargar Brochure",
    badge: "EXCLUSIVO",
    color: "#0F172A",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-x-hidden selection:bg-[#1E3A8A]/10 relative">

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#1E3A8A]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-slate-200/50 blur-[120px]" />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 border-2 border-[#1E3A8A] flex items-center justify-center">
            <div className="w-3 h-3 bg-[#1E3A8A]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-[#0F172A] leading-none">
              ATOMIC<span className="text-[#1E3A8A]">.</span>
            </span>
            <span className="text-[8px] font-black tracking-[0.4em] text-slate-400 uppercase mt-1">Solutions ERP</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-8">
          <a
            href="/web"
            className="hidden sm:inline-flex text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 hover:text-[#1E3A8A] transition-colors"
          >
            Tienda Pública
          </a>
          <a
            href="/login"
            className="px-5 py-2 border-2 border-[#1E3A8A] text-[10px] uppercase font-black tracking-[0.2em] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all"
          >
            Portal Acceso
          </a>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <main className="relative z-10 pt-44 md:pt-52 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 border border-slate-200 bg-white shadow-sm rounded-full mb-8"
        >
          <Sparkles size={14} className="text-[#1E3A8A]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Inteligencia Operativa Centralizada</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[0.85] text-[#0F172A] mb-8 uppercase italic"
        >
          Precisión a <br className="hidden md:block" />
          <span className="text-[#1E3A8A]">Escala Global.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mb-16 leading-relaxed"
        >
          Ecosistema integral diseñado bajo estrictos estándares corporativos para operar ventas, finanzas, documentación e Inteligencia Artificial centralizada.
        </motion.p>

        {/* ===== CTA BUTTONS — FIXED con <a> para navegación garantizada ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto"
        >
          <a
            href="/login"
            id="cta-login"
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-[#1E3A8A] text-white px-12 py-5 text-xs font-black uppercase tracking-widest hover:translate-y-[-2px] hover:shadow-xl transition-all shadow-lg group relative overflow-hidden"
          >
            <span className="relative z-10 text-white">Iniciar Sesión Segura</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform text-white" />
          </a>

          <a
            href="/web"
            id="cta-tienda"
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-white border-2 border-slate-200 px-12 py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] hover:border-[#1E3A8A] hover:shadow-lg transition-all group"
          >
            <LayoutGrid size={16} className="text-[#1E3A8A] group-hover:scale-110 transition-transform" />
            <span>Tienda en Línea</span>
          </a>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex items-center gap-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistemas Activos</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#1E3A8A]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v7.1.0 Stable</span>
          </div>
        </motion.div>
      </main>

      {/* ===== BANNERS SECTION ===== */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto my-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1E3A8A]">Soluciones Destacadas</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] uppercase italic tracking-tight mt-2">
            Tecnología de Élite
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BANNERS.map((banner, i) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative bg-white border border-slate-200 overflow-hidden hover:border-[#1E3A8A] hover:shadow-2xl hover:shadow-[#1E3A8A]/10 transition-all duration-500"
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white"
                  style={{ backgroundColor: banner.color }}>
                  {banner.badge}
                </span>
              </div>

              {/* Image */}
              <div className="relative h-72 w-full overflow-hidden bg-slate-100">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />

                {/* Title over image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight leading-tight">
                    {banner.title}
                  </h3>
                  <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-1">
                    {banner.subtitle}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                  {banner.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: banner.color }}
                  >
                    <Eye size={13} />
                    Ver Detalles
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-all"
                  >
                    <FileText size={13} />
                    PDF
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<BrainCircuit className="text-[#1E3A8A]" size={24} />}
            title="Motores de IA"
            desc="Modelos cognitivos avanzados para la automatización de procesos operativos y respuestas."
          />
          <FeatureCard
            icon={<Database className="text-[#3B82F6]" size={24} />}
            title="Data Cloud"
            desc="Sincronización masiva de inventarios y gestión documental bajo encriptación militar."
          />
          <FeatureCard
            icon={<Shield className="text-[#1E3A8A]" size={24} />}
            title="Seguridad ACL"
            desc="Control granular de permisos y roles para una administración transparente y segura."
          />
          <FeatureCard
            icon={<Activity className="text-[#3B82F6]" size={24} />}
            title="Market Scraping"
            desc="Extracción de inteligencia comercial en tiempo real con Scraper Pro AI nativo."
          />
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 px-6 py-20 bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#1E3A8A] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#1E3A8A]" />
              </div>
              <span className="text-xs font-black text-[#0F172A] tracking-[0.3em] uppercase">ATOMIC Solutions</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Infraestructura Modular de Alto Nivel</p>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            <FooterLink label="Privacidad" />
            <FooterLink label="API Docs" />
            <FooterLink label="Soporte" />
            <FooterLink label="Garantía" />
          </div>

          <div className="flex items-center space-x-6">
            <a href="/register" className="border-2 border-[#1E3A8A] px-8 py-4 text-[10px] font-black text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all flex items-center space-x-3 uppercase tracking-widest">
              <span>Solicitar Acceso</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-100 flex justify-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Atomic Electronics Gmbh - Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 transition-all group flex flex-col justify-start h-full cursor-default bg-white border border-slate-200 hover:border-[#1E3A8A] hover:shadow-xl">
      <div className="mb-8 w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-tight mb-3 opacity-90 group-hover:text-[#1E3A8A] transition-colors">{title}</h3>
        <p className="text-xs font-medium text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function FooterLink({ label }: { label: string }) {
  return (
    <a href="#" className="text-[10px] font-black text-slate-400 hover:text-[#1E3A8A] uppercase tracking-widest transition-colors">
      {label}
    </a>
  )
}
