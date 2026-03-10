"use client"

import Link from "next/link"
import { ArrowRight, Shield, Database, BrainCircuit, ExternalLink } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-neutral-100 bg-white/90 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 border border-neutral-200 flex items-center justify-center bg-neutral-50 shadow-sm">
            <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-orange-600 rounded-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-bold tracking-tight text-neutral-900 leading-none">ATOMIC</span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Industries</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link href="/login" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-orange-600 transition-colors">
            Acceso Corporativo
          </Link>
          <Link href="/login" className="flex items-center space-x-2 bg-neutral-900 text-white px-5 py-2.5 md:px-7 md:py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-colors hover:shadow-lg shadow-orange-600/20">
            <span>Ingresar</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 md:pt-56 pb-20 md:pb-32 px-6 max-w-6xl mx-auto flex flex-col justify-center items-start">
        {/* Status indicator */}
        <div className="inline-flex items-center space-x-2 border border-neutral-200 bg-neutral-50 px-3 py-1.5 mb-10 shadow-sm rounded-sm">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Plataforma Operativa v2.7</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-neutral-900 mb-8 max-w-4xl">
          Ingeniería de Gestión. <br className="hidden md:block" />
          <span className="text-orange-600/90 font-light italic">Precisión</span> a escala.
        </h1>

        <p className="text-neutral-500 text-lg md:text-xl font-medium max-w-2xl mb-12 leading-relaxed tracking-tight">
          Ecosistema integral diseñado bajo estrictos estándares corporativos para operar ventas, finanzas, documentación e Inteligencia Artificial centralizada.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-orange-600 text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors shadow-xl shadow-orange-600/10 group rounded-sm"
          >
            <span>Iniciar Sesión Segura</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/web"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 border-2 border-neutral-200 text-neutral-600 bg-white hover:border-orange-600 hover:text-orange-600 px-10 py-5 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm group"
          >
            <ExternalLink size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            <span>Tienda en Línea</span>
          </Link>
        </div>
      </section>

      {/* Decorative Technical Divider */}
      <div className="w-full h-px bg-neutral-200 relative max-w-6xl mx-auto flex items-center justify-center my-12 hidden md:flex">
        <div className="absolute bg-white px-4 text-[10px] font-bold text-neutral-300 tracking-[0.3em] uppercase">INFRAESTRUCTURA MODULAR</div>
      </div>

      {/* Grid Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<BrainCircuit className="text-orange-600" size={24} />}
            title="Capacitador IA"
            desc="Chat automático con inteligencia artificial entrenada con prompts corporativos modificables por gerencia."
          />
          <FeatureCard
            icon={<Database className="text-orange-600" size={24} />}
            title="Banco Documental"
            desc="Almacenamiento en la nube estructurado por carpetas para disponibilidad inmediata de recursos."
          />
          <FeatureCard
            icon={<Shield className="text-orange-600" size={24} />}
            title="Permisos Granulares"
            desc="Acceso segmentado: Admin, Gerencia, Coordinador, Asistente de Coordinación y Asesores."
          />
          <FeatureCard
            icon={<ArrowRight className="text-orange-600" size={24} />}
            title="Extracción Web"
            desc="Motor automatizado para recopilación de datos de mercado con configuración por dominios."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-neutral-50 px-6 py-12 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border border-neutral-300 flex items-center justify-center bg-white">
              <div className="w-1.5 h-1.5 bg-orange-600" />
            </div>
            <span className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase">ATOMIC INDUSTRIES</span>
          </div>
          <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
          <Link href="/register" className="text-[10px] font-bold text-orange-600 hover:text-neutral-900 uppercase tracking-widest transition-colors flex items-center space-x-1">
            <span>Solicitar Acceso</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-neutral-200 p-8 hover:border-orange-600 hover:shadow-xl hover:shadow-orange-600/5 transition-all group flex flex-col justify-between items-start h-full rounded-sm">
      <div className="w-12 h-12 bg-orange-50 flex items-center justify-center mb-8 border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-colors [&>svg]:group-hover:text-white rounded-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight mb-3">{title}</h3>
        <p className="text-xs text-neutral-500 font-medium leading-relaxed leading-6">{desc}</p>
      </div>
    </div>
  )
}
