"use client"

import Link from "next/link"
import { ArrowRight, Shield, Database, BrainCircuit, ExternalLink, PenTool, LayoutGrid, Zap, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden selection:bg-orange-500/30">
      
      {/* Background Gradients & Textures */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-orange-900/20 via-[#030712] to-transparent"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-3 h-3 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-white leading-none">
              ATOMIC<span className="text-orange-500">.</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
            <Link href="/web" className="hidden sm:inline-flex text-[10px] uppercase font-black tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                Tienda Pública
            </Link>
            <Link href="/login" className="hidden sm:inline-flex text-[10px] uppercase font-black tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                Portal Empleados
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-44 md:pt-52 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 border border-orange-500/30 bg-orange-500/10 backdrop-blur-md rounded-full mb-8">
            <Zap size={14} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">Sistema Centralizado de Gestión</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[0.9] text-white mb-8">
          Ecosistema Operativo <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 italic">ATOMIC ERP.</span>
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl font-medium max-w-2xl mb-16 leading-relaxed">
          Plataforma de alto rendimiento equipada con Inteligencia Artificial, control de inventarios, gestión de cotizaciones y herramientas B2B integradas.
        </p>

        {/* Priority Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
          {/* Main Action: Dashboard Login */}
          <Link
            href="/login"
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-white text-neutral-950 px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)] group relative overflow-hidden"
          >
            <span className="relative z-10">Iniciar Sesión</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          </Link>

          {/* Action 2: Web */}
          <Link
            href="/web"
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 border border-white/20 bg-white/5 backdrop-blur-md text-white hover:border-orange-500/50 hover:bg-orange-500/10 px-10 py-5 text-xs font-black uppercase tracking-widest transition-all group"
          >
            <LayoutGrid size={16} className="text-orange-500 group-hover:scale-110 transition-transform" />
            <span>Ver Tienda Web</span>
          </Link>

          {/* Action 3: Products directly */}
          <Link
            href="/web#productos"
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 border border-white/20 bg-transparent text-white/70 hover:text-white hover:border-white/40 px-10 py-5 text-xs font-black uppercase tracking-widest transition-all group"
          >
            <Database size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            <span>Ver Productos</span>
          </Link>
        </div>

      </main>

      {/* Decorative Technical Divider */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center mt-32 mb-20 px-6 opacity-30">
        <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent w-full"></div>
        <div className="absolute bg-[#030712] px-4 py-2 border border-white/10 text-[9px] font-black text-white/50 tracking-[0.4em] uppercase">Módulos Secundarios</div>
      </div>

      {/* Grid Features (Less priority, elegant) */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={<BrainCircuit className="text-white/40 group-hover:text-orange-500 transition-colors" size={20} />}
            title="Asistentes IA"
            desc="Modelos cognitivos para automatización de respuestas."
          />
          <FeatureCard
            icon={<Database className="text-white/40 group-hover:text-orange-500 transition-colors" size={20} />}
            title="Archivos Centrales"
            desc="Gestión documental sincronizada en la nube."
          />
          <FeatureCard
            icon={<Shield className="text-white/40 group-hover:text-orange-500 transition-colors" size={20} />}
            title="ACL & Roles"
            desc="Control de acceso y permisos de administración."
          />
          <FeatureCard
            icon={<ExternalLink className="text-white/40 group-hover:text-orange-500 transition-colors" size={20} />}
            title="Data Scraping"
            desc="Sincronización automatizada de inteligencia de mercado."
          />
        </div>
      </section>

      {/* Breathtaking Blog Banner Section */}
      <section className="relative z-10 w-full py-32 overflow-hidden border-t border-b border-orange-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/40 to-purple-900/40"></div>
        <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
        <div className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        {/* Animated Orbs */}
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 text-orange-400 font-black uppercase text-[10px] tracking-[0.3em]">
                    <PenTool size={14} /> Espacio de Conocimiento
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                    Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 italic">Blog.</span>
                </h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-lg">
                    Descubre artículos tecnológicos, guías de operación, y anuncios oficiales redactados en nuestro ecosistema inmersivo.
                </p>
            </div>
            
            <Link 
                href="/web/blogs"
                className="group relative flex items-center justify-center w-full md:w-auto overflow-hidden bg-white/5 backdrop-blur-xl border border-white/20 p-2"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-4 bg-neutral-950 px-12 py-6">
                    <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">Explorar Artículos</span>
                    <ChevronRight size={18} className="text-orange-500 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                </div>
            </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-[#030712] border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-black text-white/50 tracking-[0.3em] uppercase">ATOMIC INDUSTRIES</span>
          </div>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-6">
             <Link href="/register" className="text-[10px] font-black text-orange-500 hover:text-white uppercase tracking-widest transition-colors flex items-center space-x-2">
                <span>Solicitar Acceso</span>
                <ArrowRight size={12} />
             </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:border-orange-500/30 hover:bg-white/10 transition-all group flex flex-col justify-start h-full cursor-default">
      <div className="mb-6">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2 opacity-90">{title}</h3>
        <p className="text-[11px] font-medium text-white/50 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
