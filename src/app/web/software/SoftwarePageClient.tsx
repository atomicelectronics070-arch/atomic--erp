"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Code2, Sparkles, Monitor, ChevronRight, ArrowLeft, ArrowRight, 
  CheckCircle2, ShieldCheck, Cpu, Zap, MessageSquare, Phone, 
  Layers, Rocket, Globe, Database, Bot, Terminal, ShoppingBag, 
  BarChart3, Users, ExternalLink, X, Check, Laptop, Smartphone, FileSpreadsheet
} from "lucide-react"

interface PortfolioItem {
  id: number
  title: string
  category: string
  badgeText: string
  description: string
  accent: string
  accentBg: string
  accentBorder: string
  accentGlow: string
  badge: string
  previewUrl?: string
  image?: string
  tags: string[]
  icon: string
  highlights: string[]
}

const PLATAFORMAS_REALES: PortfolioItem[] = [
  {
    id: 1,
    title: "Instituto Sucre • Plataforma EduTech",
    category: "SISTEMA ACADÉMICO INTEGRAL",
    badgeText: "PRODUCCIÓN",
    description: "Sistema centralizado de gestión académica para el Instituto Sucre. Control integral de notas, registro de asistencia docente/alumnos, pasarelas informativas y reportería administrativa.",
    accent: "#6366f1",
    accentBg: "from-indigo-950/70 to-slate-900/90",
    accentBorder: "border-indigo-500/40",
    accentGlow: "shadow-[0_0_35px_rgba(99,102,241,0.2)]",
    badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/40",
    previewUrl: "/instituto_sucre.html",
    tags: ["Laravel", "PHP", "MySQL", "EduTech", "Multi-rol"],
    icon: "🎓",
    highlights: ["Control de notas y actas", "Portal alumnos y docentes", "Reportes PDF automáticos"]
  },
  {
    id: 2,
    title: "Bodegas Logistics & Trazabilidad QR",
    category: "LOGÍSTICA & CONTROL DE STOCK",
    badgeText: "PRODUCCIÓN",
    description: "Plataforma corporativa de gestión de inventarios con lectura y generación instantánea de códigos QR, kardex automatizado en tiempo real y trazabilidad de entradas y salidas.",
    accent: "#10b981",
    accentBg: "from-emerald-950/70 to-slate-900/90",
    accentBorder: "border-emerald-500/40",
    accentGlow: "shadow-[0_0_35px_rgba(16,185,129,0.2)]",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    previewUrl: "/bodegas.html",
    image: "/images/software/sistema-control-qr.jpg",
    tags: ["React", "Node.js", "Kardex QR", "Inventarios", "PWA"],
    icon: "📦",
    highlights: ["Lectura rápida de QR", "Auditoría de despachos", "Stock sincronizado"]
  },
  {
    id: 3,
    title: "SOFT3 Logistics • ERP Empresarial",
    category: "SISTEMA ERP INTEGRAL",
    badgeText: "EMPRESAS",
    description: "ERP modular completo diseñado para distribuidoras y cadenas comerciales. Módulos integrados de compras, ventas, facturación electrónica, contabilidad y almacenes múltiples.",
    accent: "#3b82f6",
    accentBg: "from-blue-950/70 to-slate-900/90",
    accentBorder: "border-blue-500/40",
    accentGlow: "shadow-[0_0_35px_rgba(59,130,246,0.2)]",
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/40",
    previewUrl: "/soft3.html",
    image: "/images/software/facturacion-cotizacion.jpg",
    tags: ["Laravel", "PostgreSQL", "Facturación SRI", "Multi-usuario", "ERP"],
    icon: "🏭",
    highlights: ["Facturación autorizada SRI", "Caja chica y tesorería", "Roles y permisos avanzados"]
  },
  {
    id: 4,
    title: "Scraper Pro • Inteligencia de Mercado",
    category: "AUTOMATIZACIÓN & BIG DATA",
    badgeText: "IA / DATA",
    description: "Motor automatizado de extracción de datos de comercio electrónico y monitoreo de precios de la competencia. Extracción estructurada y análisis de márgenes de rentabilidad.",
    accent: "#a855f7",
    accentBg: "from-purple-950/70 to-slate-900/90",
    accentBorder: "border-purple-500/40",
    accentGlow: "shadow-[0_0_35px_rgba(168,85,247,0.2)]",
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/40",
    previewUrl: "/scraper/index.html",
    tags: ["Python", "Selenium", "IA Predictiva", "Data Pipeline", "APIs"],
    icon: "🕷️",
    highlights: ["Monitoreo de precios 24/7", "Alertas de stock rival", "Exportación automática"]
  },
  {
    id: 5,
    title: "ATOMIC AI Bot & CRM Conversacional",
    category: "INTELIGENCIA ARTIFICIAL & WHATSAPP",
    badgeText: "VENTAS 24/7",
    description: "Agente inteligente de ventas integrado con Meta WhatsApp Cloud API y modelos LLM. Asesora en tiempo real, genera cotizaciones formales y califica prospectos automáticamente.",
    accent: "#06b6d4",
    accentBg: "from-cyan-950/70 to-slate-900/90",
    accentBorder: "border-cyan-500/40",
    accentGlow: "shadow-[0_0_35px_rgba(6,182,212,0.2)]",
    badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/40",
    image: "/images/software/atencion-bot-24-7.jpg",
    tags: ["WhatsApp Cloud API", "LLM", "Auto-Retry", "Cotizador Instantáneo"],
    icon: "🤖",
    highlights: ["Respuesta en 1 segundo", "Cierre comercial consultivo", "Sincronización directa con ERP"]
  },
  {
    id: 6,
    title: "Couple Games & Apps Interactivas",
    category: "APLICACIONES WEB B2C & PWA",
    badgeText: "EXPERIENCIA",
    description: "Plataforma de entretenimiento con dinámicas gamificadas, diseño UI mobile-first y persistencia offline. Alto engagement y tiempos de retención superiores a la media.",
    accent: "#ec4899",
    accentBg: "from-pink-950/70 to-slate-900/90",
    accentBorder: "border-pink-500/40",
    accentGlow: "shadow-[0_0_35px_rgba(236,72,153,0.2)]",
    badge: "bg-pink-500/10 text-pink-300 border-pink-500/40",
    previewUrl: "/couples-game/index.html",
    tags: ["Next.js", "Tailwind CSS", "Gamification", "PWA"],
    icon: "💑",
    highlights: ["Diseño táctil ultra fluido", "100% interactivo", "Optimizado para móviles"]
  }
]

const MODULOS_ESPECIALIZADOS = [
  {
    icon: <Database className="text-blue-400" size={24} />,
    title: "Sistemas ERP & Gestión a Medida",
    desc: "Desarrollamos el núcleo operativo de tu negocio: inventarios, compras, ventas, cuentas por cobrar/pagar, facturación electrónica SRI y reportería gerencial sin pagar licencias mensuales abusivas."
  },
  {
    icon: <Bot className="text-cyan-400" size={24} />,
    title: "Inteligencia Artificial & Bots WhatsApp",
    desc: "Transforma tu canal de ventas con agentes IA entrenados con tu catálogo exacto. Atienden, cotizan y cierran ventas en WhatsApp los 365 días del año sin demoras ni mensajes perdidos."
  },
  {
    icon: <Globe className="text-emerald-400" size={24} />,
    title: "Páginas Web & E-Commerce de Alta Conversión",
    desc: "Sitios web rápidos con carga instantánea, optimizados para tráfico de campañas en Instagram y Facebook. Diseñados con botón directo a WhatsApp y carritos de compra transparentes."
  },
  {
    icon: <Zap className="text-amber-400" size={24} />,
    title: "Automatización & Trazabilidad de Negocios",
    desc: "Sistemas de códigos QR para bodegas, control de asistencia biométrica, pasarelas de pago y sincronización de stock entre múltiples sucursales en tiempo real."
  }
]

const COMERCIOS_TARGET = [
  { name: "Ferreterías & Materiales", icon: "🛠️", desc: "Catálogos de miles de ítems, listas de precios mayoristas y despacho por guías." },
  { name: "Distribuidoras & Mayoristas", icon: "🚛", desc: "Gestión de rutas de vendedores, cotizaciones rápidas y facturación SRI en lote." },
  { name: "Retail & Tiendas de Ropa / Calzado", icon: "👗", desc: "Control de tallas/colores, códigos de barra y tienda en línea sincronizada." },
  { name: "Barberías, Salones & Spas", icon: "✂️", desc: "Tarjetas digitales de fidelización, agenda de citas y bucle de clientes referidos." },
  { name: "Clínicas & Consultorios", icon: "🩺", desc: "Expediente digital, historial de consultas y recordatorios automáticos por WhatsApp." },
  { name: "Restaurantes & Franquicias", icon: "🍔", desc: "Comandas digitales, control de recetas/ingredientes y pedidos para llevar." }
]

export default function SoftwarePageClient() {
  const [activePreview, setActivePreview] = useState<PortfolioItem | null>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const officialWhatsapp = "593980319050"
  const formattedWhatsapp = "098 031 9050"
  const waPreFillMessage = encodeURIComponent("¡Hola ATOMIC! Vi su sección de Software y Desarrollo 2027 en la página web. Deseo cotizar un sistema ERP / página web / automatización con Inteligencia Artificial para mi negocio. Mi requerimiento es:")

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* ── AMBIENT BACKGROUND GLOWS ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[160px]" />
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/10 blur-[180px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[160px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* ── TOP STICKY BAR ── */}
      <header className="sticky top-0 z-40 bg-[#05070e]/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/web" 
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-slate-800/60 border border-slate-800"
            >
              <ArrowLeft size={14} />
              <span>Tienda ATOMIC</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase hidden sm:inline-block">
                DIVISIÓN DE SOFTWARE 2027
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${officialWhatsapp}?text=${waPreFillMessage}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <MessageSquare size={14} />
              <span className="hidden sm:inline">Cotizar por WhatsApp</span>
              <span className="sm:hidden">Cotizar</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10">

        {/* ── HERO SECTION ── */}
        <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* BADGE 2027 */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span>ARQUITECTURA DE SOFTWARE & IA • EDICIÓN 2027</span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-heading leading-tight">
              Desarrollamos Sistemas <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">ERP</span>, Páginas Web e <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-400 to-teal-300">Inteligencia Artificial</span> para Negocios
            </h1>

            {/* DESCRIPTION */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              En ATOMIC somos especialistas en la ingeniería de plataformas personalizadas, sistemas de facturación electrónica SRI, inventarios en tiempo real y agentes autónomos de WhatsApp para todo tipo de comercios.
            </p>

            {/* PILLS */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700">✓ Sistemas ERP a Medida</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700">✓ Agentes de Venta WhatsApp 24/7</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700">✓ Facturación Electrónica SRI</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700">✓ Páginas Web de Alta Conversión</span>
            </div>

            {/* CALL TO ACTION BUTTONS */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${officialWhatsapp}?text=${waPreFillMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider transition-all shadow-[0_10px_35px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 group"
              >
                <MessageSquare size={18} />
                <span>Cuéntanos tu Necesidad por WhatsApp</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#plataformas"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Monitor size={17} className="text-cyan-400" />
                <span>Ver Plataformas & Demos</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── METRICS & GUARANTEE STRIP ── */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-heading">100%</div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">A la Medida</div>
              <p className="text-xs text-slate-400">Sin rentas mensuales fijas forzadas</p>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-heading">24/7</div>
              <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider font-bold">Disponibilidad</div>
              <p className="text-xs text-slate-400">Sistemas en la nube de alta resistencia</p>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-heading">SRI</div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Facturación</div>
              <p className="text-xs text-slate-400">Conexión con WebServices del SRI Ecuador</p>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-heading">IA</div>
              <div className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-bold">Automatización</div>
              <p className="text-xs text-slate-400">Bots y cotizadores conversacionales</p>
            </div>
          </div>
        </section>

        {/* ── SHOWCASE DE PLATAFORMAS DESARROLLADAS (CON DEMOS) ── */}
        <section id="plataformas" className="px-4 sm:px-6 max-w-7xl mx-auto py-12">
          <div className="space-y-3 mb-10 text-center">
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block">
              PLATAFORMAS EN PRODUCCIÓN
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-heading text-white">
              Sistemas y Desarrollos Entregados por Nuestro Equipo
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Haz clic en cualquiera de las plataformas para abrir la demostración interactiva en vivo o conocer sus módulos de ingeniería.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATAFORMAS_REALES.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl border ${item.accentBorder} bg-gradient-to-br ${item.accentBg} p-6 space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${item.badge}`}>
                      {item.badgeText}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-black text-white font-heading group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  {item.previewUrl ? (
                    <button
                      type="button"
                      onClick={() => { setActivePreview(item); setIframeLoaded(false) }}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                    >
                      <Monitor size={14} className="text-cyan-400" />
                      <span>Ver Demo Interactiva</span>
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/${officialWhatsapp}?text=${encodeURIComponent(`Hola ATOMIC! Deseo información y una demo sobre la solución: ${item.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <MessageSquare size={14} />
                      <span>Solicitar Demo Privada</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MÓDULOS DE INGENIERÍA 2027 ── */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto py-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/50 border border-slate-800 relative overflow-hidden">
            <div className="space-y-3 mb-10 text-center max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
                CAPACIDADES TECNOLÓGICAS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-heading text-white">
                ¿Qué tipo de desarrollo necesitas para tu negocio?
              </h2>
              <p className="text-sm text-slate-400">
                Construimos soluciones personalizadas que se adaptan exactamente a tus reglas de negocio y flujos de trabajo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MODULOS_ESPECIALIZADOS.map((mod, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all">
                  <div className="p-3 rounded-xl bg-slate-900 w-fit border border-slate-800">
                    {mod.icon}
                  </div>
                  <h3 className="font-bold text-base text-white font-heading">{mod.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ADAPTABLE A TODO TIPO DE COMERCIOS ── */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto py-12">
          <div className="space-y-3 mb-10 text-center">
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">
              TODO TIPO DE COMERCIOS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-heading text-white">
              Soluciones Especializadas para Tu Industria
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              No importa si tienes una tienda local, una distribuidora o una cadena con sucursales: configuramos la lógica para tu día a día.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMERCIOS_TARGET.map((com, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 transition-all space-y-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{com.icon}</span>
                  <h4 className="font-bold text-sm text-white">{com.name}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-9">
                  {com.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER PRINCIPAL (PARA ADS DE INSTAGRAM / FACEBOOK) ── */}
        <section className="px-4 sm:px-6 max-w-5xl mx-auto py-16">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <span className="text-[10px] font-mono font-black tracking-widest uppercase text-cyan-300 bg-cyan-400/10 px-3.5 py-1.5 rounded-full border border-cyan-400/30 inline-block">
              ASESORÍA DIRECTA & COTIZACIÓN RÁPIDA
            </span>

            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight font-heading text-white max-w-2xl mx-auto">
              ¿Listo para automatizar y escalar tu negocio?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Escríbenos directamente por WhatsApp. Cuéntanos qué problema o proceso deseas resolver y te preparamos una propuesta técnica clara y ajustada a tu presupuesto.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${officialWhatsapp}?text=${waPreFillMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
              >
                <Phone size={17} />
                <span>Escríbenos al {formattedWhatsapp}</span>
                <ArrowRight size={16} />
              </a>

              <Link
                href="/web"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Volver a la Tienda Principal
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── FULL SCREEN DEMO MODAL ── */}
      <AnimatePresence>
        {activePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl"
            onClick={() => setActivePreview(null)}
          >
            {/* Modal Header */}
            <div
              className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0 bg-slate-950/90"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activePreview.icon}</span>
                <div>
                  <h3 className="text-white font-black text-sm">{activePreview.title}</h3>
                  <span className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">{activePreview.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={activePreview.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors text-xs font-bold uppercase tracking-wider"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink size={13} />
                  <span>Abrir en pestaña nueva</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Modal Iframe Content */}
            <div className="flex-1 relative bg-slate-900" onClick={e => e.stopPropagation()}>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Iniciando Demo Interactiva...</span>
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

      {/* ── FOOTER SIMPLE ── */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 font-mono">
        <p>© 2027 ATOMIC Ecuador • Soluciones de Software, ERP & Inteligencia Artificial.</p>
      </footer>
    </div>
  )
}
