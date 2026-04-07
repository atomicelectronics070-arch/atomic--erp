"use client"
// Atomic Industries Unified Core - v5.0.2

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowRight, Shield, Database, BrainCircuit, 
  ExternalLink, PenTool, LayoutGrid, Zap, 
  ChevronRight, Sparkles, Activity
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-pink-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 glass-panel flex items-center justify-center relative overflow-hidden group rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-3 h-3 bg-primary shadow-[0_0_15px_rgba(99,102,241,0.8)] rounded-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-white leading-none">
              ATOMIC<span className="text-primary">.</span>
            </span>
            <span className="text-[8px] font-black tracking-[0.4em] text-slate-400/60 uppercase mt-1">Industries ERP</span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
            <Link href="/web" className="hidden sm:inline-flex text-[10px] uppercase font-black tracking-[0.2em] text-white/50 hover:text-primary transition-colors">
                Tienda Pública
            </Link>
            <Link href="/login" className="px-5 py-2 glass-panel border-primary/20 text-[10px] uppercase font-black tracking-[0.2em] text-primary hover:text-white hover:bg-primary/10 transition-all rounded-full">
                Portal Acceso
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-44 md:pt-52 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 border border-primary/30 bg-primary/10 backdrop-blur-md rounded-full mb-8"
        >
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Inteligencia Operativa Centralizada</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[0.85] text-white mb-8"
        >
          Precisión a <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-600 to-pink-600 italic">Escala Global.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mb-16 leading-relaxed"
        >
          Ecosistema integral diseñado bajo estrictos estándares corporativos para operar ventas, finanzas, documentación e Inteligencia Artificial centralizada.
        </motion.p>

        {/* Priority Actions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto"
        >
          {/* Main Action: Dashboard Login */}
          <Link
            href="/login"
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-12 py-5 text-xs font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-[0_10px_40px_-10px_rgba(99,102,241,0.5)] group relative overflow-hidden rounded-2xl"
          >
            <span className="relative z-10">Iniciar Sesión Segura</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          </Link>

          {/* Action 2: Web */}
          <Link
            href="/web"
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 glass-panel px-12 py-5 text-xs font-black uppercase tracking-widest text-white hover:border-primary/50 hover:bg-primary/10 transition-all group rounded-2xl"
          >
            <LayoutGrid size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span>Tienda en Línea</span>
          </Link>
        </motion.div>

        {/* Status indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex items-center gap-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistemas Activos</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">v4.0.2 Stable</span>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto my-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<BrainCircuit className="text-indigo-400" size={24} />}
            title="Motores de IA"
            desc="Modelos cognitivos avanzados para la automatización de procesos operativos y respuestas."
          />
          <FeatureCard
            icon={<Database className="text-pink-400" size={24} />}
            title="Data Cloud"
            desc="Sincronización masiva de inventarios y gestión documental bajo encriptación militar."
          />
          <FeatureCard
            icon={<Shield className="text-indigo-400" size={24} />}
            title="Seguridad ACL"
            desc="Control granular de permisos y roles para una administración transparente y segura."
          />
          <FeatureCard
            icon={<Activity className="text-pink-400" size={24} />}
            title="Market Scraping"
            desc="Extracción de inteligencia comercial en tiempo real con Scraper Pro AI nativo."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-20 bg-slate-950/20 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 glass-panel flex items-center justify-center rounded-lg">
                <div className="w-2 h-2 bg-primary" />
              </div>
              <span className="text-xs font-black text-white tracking-[0.3em] uppercase">ATOMIC INDUSTRIES</span>
            </div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Infraestructura Modular de Alto Nivel</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10">
              <FooterLink label="Privacidad" />
              <FooterLink label="API Docs" />
              <FooterLink label="Soporte" />
              <FooterLink label="Garantía" />
          </div>

          <div className="flex items-center space-x-6">
             <Link href="/register" className="glass-panel border-primary/20 px-8 py-4 text-[10px] font-black text-primary hover:text-white hover:border-primary transition-all rounded-2xl flex items-center space-x-3 uppercase tracking-widest">
                <span>Solicitar Acceso</span>
                <ArrowRight size={14} />
             </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex justify-center text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Atomic Electronics Gmbh — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-panel p-8 hover:border-primary/40 hover:bg-white/5 transition-all group flex flex-col justify-start h-full cursor-default rounded-3xl">
      <div className="mb-8 w-12 h-12 glass-panel border-white/10 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-3 opacity-90">{title}</h3>
        <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function FooterLink({ label }: { label: string }) {
    return (
        <a href="#" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
            {label}
        </a>
    )
}
