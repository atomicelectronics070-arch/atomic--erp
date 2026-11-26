"use client"

import React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ShieldCheck, ArrowUpRight, Phone,
  Sparkles, Globe, Building2, Zap, CheckCircle2,
  MessageSquare, Users, ArrowRight, Video,
  Play, ExternalLink, BadgeCheck
} from "lucide-react"

export default function EquipoClient() {
  const { data: session } = useSession()
  const isRegistered = Boolean(session?.user)

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white pb-28">

      {/* ── TOP HEADER BAR ── */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/web" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center shadow-inner group-hover:border-cyan-500/50 transition-colors">
                <span className="text-white font-mono font-bold text-xs tracking-tight">AT</span>
              </div>
              <div>
                <span className="text-sm font-semibold tracking-tight text-white group-hover:text-cyan-300 transition-colors">ATOMIC</span>
                <span className="text-xs text-zinc-500 font-mono ml-1.5">/ EQUIPO</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/web/precios-vendedor"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>Portal Vendedores</span>
              <ArrowUpRight size={13} className="text-zinc-500" />
            </Link>
            <Link
              href="/web"
              className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-xs font-medium text-cyan-300 transition-all flex items-center gap-1.5"
            >
              <Globe size={13} />
              <span>Tienda Web</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-12 sm:space-y-16">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold tracking-wider uppercase shadow-sm">
            <ShieldCheck size={13} className="text-cyan-400" />
            Dirección Ejecutiva &amp; Respaldo Institucional
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Conoce al Equipo Directivo de <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">ATOMIC Ecuador</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Detrás de cada producto, proforma y despacho nacional se encuentra un equipo con visión tecnológica, dirección comercial comprobada e importación directa sin intermediarios.
          </p>
        </div>

        {/* ── EXECUTIVE CARDS GRID ── */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">

          {/* PERFIL 1: SANTIAGO GUZMÁN */}
          <div className="rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header Profile Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-cyan-500/20 border border-cyan-400/40">
                    SG
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Santiago Guzmán</h2>
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mt-0.5">
                      Fundador · Propietario · CEO &amp; Director Técnico (CTO)
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Dirección General
                </span>
              </div>

              {/* Bio & Responsibilities */}
              <div className="space-y-3 text-zinc-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  Lidera la <strong>estrategia general, arquitectura tecnológica e importación</strong> de ATOMIC. Creador y arquitecto del motor ERP multi-tenant de alta concurrencia, integración nativa de facturación electrónica con el SRI y la plataforma central de precios públicos y cotizaciones automáticas.
                </p>
                <p>
                  Supervisa la red logística nacional desde Quito, garantizando despachos diarios por Servientrega y encomiendas con respaldo de garantía escrita de 1 año directamente con fábrica.
                </p>
              </div>

              {/* Executive Specialization & Direct Contact */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
                  <span className="text-[10px] uppercase text-zinc-400">Especialidad</span>
                  <span className="text-zinc-200 font-bold text-right">Software a Medida, IA &amp; Operaciones</span>
                </div>

                <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
                  <span className="text-[10px] uppercase text-zinc-400">Sede &amp; Cobertura</span>
                  <span className="text-cyan-300 font-bold text-right">Quito Norte · 24 Provincias</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase text-zinc-400">Línea Directa</span>
                  <span className="text-emerald-300 font-bold">+593 98 031 9050</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Social Links */}
            <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-3 relative z-10">
              <Link
                href="/web/santiago-guzman"
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
              >
                <span>Ver Perfil Detallado de Santiago</span>
                <ArrowRight size={14} />
              </Link>

              <div className={isRegistered ? "grid grid-cols-2 gap-2 text-xs font-mono" : "flex flex-col gap-2 text-xs font-mono"}>
                {isRegistered && (
                  <a
                    href="https://www.tiktok.com/@santiagoguzman216"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Video size={13} className="text-cyan-400" />
                    <span>TikTok @santiagoguzman216</span>
                  </a>
                )}
                <a
                  href="https://wa.me/593980319050?text=Hola%20Santiago%2C%20le%C3%AD%20tu%20perfil%20en%20el%20equipo%20ATOMIC%20y%20deseo%20comunicarme%20contigo."
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 transition-colors flex items-center justify-center gap-1.5 font-bold"
                >
                  <Phone size={13} />
                  <span>WhatsApp 098 031 9050</span>
                </a>
              </div>
            </div>
          </div>

          {/* PERFIL 2: ING. JUAN PABLO GUZMÁN */}
          <div className="rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-amber-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header Profile Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-yellow-500 flex items-center justify-center text-stone-950 font-black text-2xl shadow-xl shadow-amber-500/20 border border-amber-400/40">
                    JPG
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Ing. Juan Pablo Guzmán</h2>
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mt-0.5">
                      Cofundador · Director de Ventas &amp; Jefe de Laboratorio I+D
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Dirección Comercial
                </span>
              </div>

              {/* Bio & Responsibilities */}
              <div className="space-y-3 text-zinc-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  Dirige la <strong>estrategia comercial nacional, canales de distribución B2B y laboratorios de pruebas</strong> de hardware en ATOMIC. Responsable de la homologación técnica de productos, benchmarks de rendimiento bajo estrés y control de calidad.
                </p>
                <p>
                  Creador del contenido estratégico audiovisual de la empresa y la serie <strong>'Las 48 Leyes del Poder y Crecimiento Viral'</strong>, orientada a liderazgo comercial, psicología de negocios y fidelización de clientes locales.
                </p>
              </div>

              {/* Executive Specialization & Commercial Channel */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
                  <span className="text-[10px] uppercase text-zinc-400">Especialidad</span>
                  <span className="text-zinc-200 font-bold text-right">Importación Directa &amp; I+D Hardware</span>
                </div>

                <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
                  <span className="text-[10px] uppercase text-zinc-400">División</span>
                  <span className="text-amber-300 font-bold text-right">Canales B2B &amp; Laboratorio Técnico</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase text-zinc-400">Canal Comercial CRM</span>
                  <span className="text-emerald-300 font-bold">+593 98 947 6556</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Social Links */}
            <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-3 relative z-10">
              <Link
                href="/web/juan-pablo-guzman"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>Ver Serie 48 Leyes &amp; Bio de Juan Pablo</span>
                <ArrowRight size={14} />
              </Link>

              <div className={isRegistered ? "grid grid-cols-2 gap-2 text-xs font-mono" : "flex flex-col gap-2 text-xs font-mono"}>
                {isRegistered && (
                  <a
                    href="https://www.tiktok.com/@juanguzman35886"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Video size={13} className="text-amber-400" />
                    <span>TikTok @juanguzman35886</span>
                  </a>
                )}
                <a
                  href="https://wa.me/593989476556?text=Hola%20Director%20Juan%20Pablo%20Guzm%C3%A1n%2C%20deseo%20asesor%C3%ADa%20comercial%20o%20de%20laboratorio%20I%2BD."
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 transition-colors flex items-center justify-center gap-1.5 font-bold"
                >
                  <Phone size={13} />
                  <span>WhatsApp 098 947 6556</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ── CONTENIDO PERSONAL & FORMACIÓN COMERCIAL ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 font-bold">
                Contenido Audiovisual &amp; Formación
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
                Serie Oficial: Las 48 Leyes del Poder en los Negocios
              </h3>
            </div>
            <Link
              href="/web/juan-pablo-guzman"
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-zinc-200 hover:text-white transition-all flex items-center gap-1.5 w-fit"
            >
              <span>Ver todos los episodios</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/web/juan-pablo-guzman"
              className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.06] hover:border-amber-400/50 transition-all group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Play size={16} />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Ley 1: Nunca le hagas sombra a tu amo
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Análisis estratégico de psicología aplicada y equilibrio de poder en organizaciones y jerarquías comerciales.
              </p>
            </Link>

            <Link
              href="/web/juan-pablo-guzman"
              className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.06] hover:border-amber-400/50 transition-all group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Play size={16} />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Ley 2: Nunca confíes demasiado en los amigos
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Aprende a contratar y medir por resultados reales, objetivos y métricas verificables en empresas.
              </p>
            </Link>

            <Link
              href="/web/juan-pablo-guzman"
              className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.06] hover:border-cyan-400/50 transition-all group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Sparkles size={16} />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Crecimiento Viral &amp; Fidelización Local
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Estrategias de retención de clientes con tarjetas digitales inteligentes y marketing relacional para negocios ecuatorianos.
              </p>
            </Link>
          </div>
        </div>

        {/* ── PILARES DE SEGURIDAD & CONFIANZA ── */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.06] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Garantía Escrita de 1 Año</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Respaldo directo de fábrica y servicio técnico especializado en Quito. Sin intermediarios ni trabas de terceros.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.06] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Building2 size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Dirección &amp; Respaldo Institucional</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Atención directa por los fundadores y equipo de ingeniería en cada proyecto, con facturación electrónica SRI y asesoría continua.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.06] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Despachos Asegurados a Nivel Nacional</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Envíos diarios por Servientrega y cooperativas con número de guía inmediato y seguro de carga en tránsito.
            </p>
          </div>
        </div>

        {/* ── FOOTER CALL TO ACTION ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-white/10 text-center space-y-4 shadow-xl">
          <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30">
            Convocatoria Abierta 2026
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ¿Deseas formarte y trabajar en nuestro equipo comercial?
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Revisa los planes de remuneración, comisiones del 20%, sistema de puntos en dólares y postula para ingresar al equipo de ventas de ATOMIC.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/web/empleo"
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-600/20"
            >
              Postular en Bolsa de Empleo
            </Link>
            <Link
              href="/web/precios-vendedor"
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
            >
              Consultar Catálogo PVP
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
