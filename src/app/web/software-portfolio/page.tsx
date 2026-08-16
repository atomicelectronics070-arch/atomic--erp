
export const dynamic = 'force-dynamic'
export const revalidate = 0
"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Code2, Sparkles, Monitor, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Instituto Sucre",
    category: "Plataforma EduTech",
    description: "Sistema integral de gestión académica desarrollado para el Instituto Sucre. Control de notas, asistencia, comunicación docente-estudiante y módulo administrativo centralizado.",
    accent: "#6366f1",
    accentBg: "from-indigo-950/60 to-violet-950/40",
    accentBorder: "border-indigo-500/30",
    accentGlow: "shadow-[0_0_40px_rgba(99,102,241,0.15)]",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    previewUrl: "/instituto_sucre.html",
    tags: ["Laravel", "PHP", "MySQL", "EduTech"],
    icon: "🎓"
  },
  {
    id: 2,
    title: "Bodegas Logistics",
    category: "Logística Corporativo",
    description: "Sistema corporativo de control de inventario con soporte para códigos QR, trazabilidad de movimientos, reportes de stock en tiempo real y gestión de entradas/salidas.",
    accent: "#10b981",
    accentBg: "from-emerald-950/60 to-teal-950/40",
    accentBorder: "border-emerald-500/30",
    accentGlow: "shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    previewUrl: "/bodegas.html",
    tags: ["React", "Node.js", "QR", "Inventario"],
    icon: "📦"
  },
  {
    id: 3,
    title: "Scraper Pro",
    category: "Inteligencia Competitiva",
    description: "Motor automatizado de extracción de datos y análisis de mercado. Monitoreo de precios competencia, extracción estructurada de catálogos y generación de reportes automatizados.",
    accent: "#a855f7",
    accentBg: "from-purple-950/60 to-violet-950/40",
    accentBorder: "border-purple-500/30",
    accentGlow: "shadow-[0_0_40px_rgba(168,85,247,0.15)]",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    previewUrl: "/scraper/index.html",
    tags: ["Python", "Selenium", "IA", "Data"],
    icon: "🕷️"
  },
  {
    id: 4,
    title: "Couple Games",
    category: "Entretenimiento B2C",
    description: "Aplicación web interactiva de entretenimiento para parejas. Juegos de preguntas, retos dinámicos y actividades diseñadas para fortalecer la conexión y el engagement.",
    accent: "#ec4899",
    accentBg: "from-pink-950/60 to-rose-950/40",
    accentBorder: "border-pink-500/30",
    accentGlow: "shadow-[0_0_40px_rgba(236,72,153,0.15)]",
    badge: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    previewUrl: "/couples-game/index.html",
    tags: ["React", "Gamification", "PWA", "UX"],
    icon: "💑"
  },
  {
    id: 5,
    title: "SOFT3 Logistics",
    category: "ERP de Logística",
    description: "Sistema ERP completo de gestión logística desarrollado en Laravel. Módulos de compras, ventas, inventario, reportes contables y panel de administración multi-usuario.",
    accent: "#3b82f6",
    accentBg: "from-blue-950/60 to-cyan-950/40",
    accentBorder: "border-blue-500/30",
    accentGlow: "shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    previewUrl: "/soft3.html",
    tags: ["Laravel", "ERP", "Multi-usuario", "Contabilidad"],
    icon: "🏭"
  }
]

export default function SoftwarePortfolioPage() {
  const [activePreview, setActivePreview] = useState<typeof PORTFOLIO_ITEMS[0] | null>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  return (
    <div className="min-h-screen bg-[#060610] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[55%] h-[55%] rounded-full bg-indigo-900/20 blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-blue-800/15 blur-[180px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-violet-900/10 blur-[150px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <main className="relative z-10">

        {/* HEADER NAV */}
        <nav className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-slate-800/50 backdrop-blur-sm">
          <Link href="/web" className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Volver a Atomic
          </Link>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10">
            <Code2 size={14} className="text-indigo-400" />
            <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Software Lab</span>
          </div>
        </nav>

        {/* HERO */}
        <section className="px-6 md:px-12 pt-20 pb-16 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles size={16} className="text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-indigo-400">Atomic Industries · Desarrollo a Medida</span>
              <Sparkles size={16} className="text-indigo-400" />
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[1] mb-6">
              SOFTWARE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400">
                PORTFOLIO
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
              Sistemas reales construidos para empresas reales. Desde plataformas educativas hasta ERPs completos — cada proyecto es un reto de ingeniería resuelto con precisión.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-bold uppercase tracking-widest">
              {["Laravel", "React", "Next.js", "Python", "Node.js", "MySQL", "IA"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full border border-slate-700 text-slate-400 bg-slate-800/40">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* STATS BAR */}
        <section className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 border border-slate-800 rounded-2xl p-6 bg-slate-900/30 backdrop-blur-sm">
            {[
              { n: "5+", label: "Proyectos Entregados" },
              { n: "3", label: "ERPs Desarrollados" },
              { n: "100%", label: "A Medida" },
              { n: "∞", label: "Escalabilidad" },
              { n: "24/7", label: "Soporte Técnico" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{s.n}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PORTFOLIO GRID */}
        <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PORTFOLIO_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group cursor-pointer rounded-2xl border ${item.accentBorder} bg-gradient-to-br ${item.accentBg} backdrop-blur-sm ${item.accentGlow} overflow-hidden transition-all duration-300 hover:border-opacity-60`}
                onClick={() => { setActivePreview(item); setIframeLoaded(false) }}
              >
                {/* Preview iframe thumbnail */}
                <div className="relative h-48 bg-slate-950/80 overflow-hidden">
                  <iframe
                    src={item.previewUrl}
                    title={item.title}
                    className="w-[500%] h-[500%] origin-top-left scale-[0.2] pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90" />
                  <div className="absolute top-4 left-4">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                      <Monitor size={14} />
                      Ver Demo Completa
                    </div>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-full border ${item.badge}`}>
                      {item.category}
                    </span>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto text-center">
          <div className="border border-indigo-500/20 rounded-3xl p-12 bg-gradient-to-br from-indigo-950/40 to-violet-950/20 shadow-[0_0_80px_rgba(99,102,241,0.1)]">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">¿Tienes un proyecto en mente?</h2>
            <p className="text-slate-400 mb-8 text-lg leading-relaxed max-w-xl mx-auto">
              Desarrollamos software a medida para empresas. Desde MVPs hasta sistemas empresariales completos.
            </p>
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC%2C%20quiero%20desarrollar%20un%20software%20a%20medida"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] hover:scale-105 transition-all"
            >
              <span>💬</span>
              Cotizar mi Proyecto
              <ChevronRight size={18} />
            </a>
          </div>
        </section>

      </main>

      {/* FULL SCREEN DEMO MODAL */}
      <AnimatePresence>
        {activePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-slate-950/95 backdrop-blur-2xl"
            onClick={() => setActivePreview(null)}
          >
            {/* Modal Header */}
            <div
              className="h-14 flex items-center justify-between px-6 border-b border-slate-800 shrink-0 bg-slate-950/80"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{activePreview.icon}</span>
                <div>
                  <span className="text-white font-black text-sm">{activePreview.title}</span>
                  <span className="text-slate-500 text-xs ml-2 uppercase tracking-widest">{activePreview.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={activePreview.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors text-xs font-bold uppercase tracking-wider"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink size={13} />
                  Abrir en nueva pestaña
                </a>
                <button
                  onClick={() => setActivePreview(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal iframe */}
            <div className="flex-1 relative" onClick={e => e.stopPropagation()}>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Cargando demo...</span>
                  </div>
                </div>
              )}
              <iframe
                src={activePreview.previewUrl}
                title={activePreview.title}
                className="w-full h-full border-0"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
