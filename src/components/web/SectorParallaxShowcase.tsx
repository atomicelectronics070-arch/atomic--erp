"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Package,
  Smartphone,
  Server,
  Wrench,
  Home,
  Gamepad2,
  Cpu,
  Speaker,
  Camera,
  Sparkles,
  Lightbulb,
  Layers,
  Video,
  Palette,
  TrendingUp
} from "lucide-react"

export default function SectorParallaxShowcase() {
  return (
    <div className="w-full my-8 overflow-hidden relative selection:bg-blue-500/30">
      <style jsx>{`
        .sector-parallax-root {
          background: #070911;
          color: #f8fafc;
          width: 100%;
          position: relative;
        }

        .sector-parallax-band {
          position: relative;
          min-height: 62vh;
          display: grid;
          place-items: center;
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          padding: 4.5rem 1.25rem;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sector-parallax-bg-distribucion {
          background-image: url("/images/repuestos/repuestos-portada.jpg");
        }

        .sector-parallax-bg-electronica {
          background-image: url("/images/promociones/apple-portada.jpg");
        }

        .sector-parallax-bg-ferreteria {
          background-image: url("/images/categories/industria.jpg");
        }

        .sector-parallax-bg-hogar {
          background-image: url("/images/anker-solix/anker-solix-c300-hero-hogar.jpg");
        }

        .sector-parallax-bg-entretenimiento {
          background-image: url("/images/categories/entretenimiento.jpg");
        }

        .sector-parallax-bg-contenido {
          background-image: url("/images/atomic-studio/planes-mensuales-redes-sociales.jpg");
        }

        @media (max-width: 768px) {
          .sector-parallax-band {
            background-attachment: scroll;
            min-height: auto;
            padding: 3.25rem 1rem;
          }
        }
      `}</style>

      <div className="sector-parallax-root border-y border-white/10 shadow-2xl">
        {/* ═══ 1. DISTRIBUCIÓN PARA NEGOCIOS Y MEDIANOS EMPRENDEDORES ═══ */}
        <section className="sector-parallax-band sector-parallax-bg-distribucion" id="parallax-distribucion">
          <div className="absolute inset-0 bg-gradient-to-r from-[#050814]/92 via-[#070b1a]/82 to-[#0b1730]/78 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-10">
            <div className="rounded-[32px] bg-[#080b16]/82 border border-amber-400/35 backdrop-blur-md shadow-[0_30px_80px_rgba(2,6,23,0.85)] p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest">
                    <Package size={14} className="text-amber-300" />
                    <span>Plan de Distribución • Paquetes desde 6 Unidades</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-heading leading-tight">
                    Distribución de Productos para Negocios y Medianos Emprendedores
                  </h2>
                  <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                    Impulsa o escala tu local comercial con nuestro <strong className="text-amber-300">plan de distribución en paquetes de 6 unidades</strong> y <strong className="text-white">asesoría personalizada en cada compra</strong>. Cubrimos desde electrónica económica de consumo masivo hasta repuestos técnicos especializados.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link
                    href="/web/repuestos"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2"
                  >
                    <span>Ver Repuestos & Periféricos</span>
                    <ArrowRight size={14} />
                  </Link>
                  <a
                    href={`https://wa.me/593989476556?text=${encodeURIComponent("Hola ATOMIC! Deseo asesoría para comprar paquetes de distribución desde 6 unidades para mi negocio/emprendimiento.")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Asesoría de Compra (6+ Uds)
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-amber-400/45 transition-all space-y-2">
                  <span className="text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider block">Consumo Masivo</span>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Electrónica Económica & Vitrina</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Línea de distribución de cables, audífonos, drones, mini cámaras espía y electrónica económica chica de alta rotación diaria.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-blue-400/45 transition-all space-y-2">
                  <span className="text-blue-300 font-mono text-[11px] font-bold uppercase tracking-wider block">Servicio Técnico</span>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Repuestos de Laptops & Pantallas</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Pantallas LED, teclados, baterías, cargadores, discos y memoria para talleres y distribuidores de computación.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-cyan-400/45 transition-all space-y-2">
                  <span className="text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider block">Electrónica Técnica</span>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Raspberry, Placas Lógicas & Relés</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Amplia gama de dispositivos periféricos electrónicos, placas lógicas, módulos de control, sensores y relés para proyectos.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-emerald-400/45 transition-all space-y-2">
                  <span className="text-emerald-300 font-mono text-[11px] font-bold uppercase tracking-wider block">Respaldo Comercial</span>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Paquetes de 6 + Asesoría</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Arma tus combos surtidos desde 6 unidades con guía real sobre qué productos dejan mayor margen en tu zona.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 2. ELECTRÓNICA PRO: APPLE, SAMSUNG, LAPTOPS & SERVIDORES ═══ */}
        <section className="sector-parallax-band sector-parallax-bg-electronica" id="parallax-electronica">
          <div className="absolute inset-0 bg-gradient-to-l from-[#040714]/92 via-[#070b1a]/82 to-[#091229]/85 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-10">
            <div className="rounded-[32px] bg-[#080b16]/82 border border-blue-400/35 backdrop-blur-md shadow-[0_30px_80px_rgba(2,6,23,0.85)] p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/40 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest">
                    <Smartphone size={14} className="text-blue-300" />
                    <span>Últimos Lanzamientos • Ecosistemas Apple & Samsung</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-heading leading-tight">
                    Electrónica de Vanguardia: Teléfonos, Laptops & Servidores
                  </h2>
                  <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                    Entérate de los <strong className="text-blue-300">últimos lanzamientos de Apple, Samsung y sus extensiones de productos únicos</strong>. Ponemos a tu alcance teléfonos de última generación, tablets, laptops (incluidas líneas compactas y mínimas), servidores corporativos y hardware de alto nivel.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link
                    href="/web/apple"
                    className="px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <span>Ver Apple & iPhone</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/web/laptops"
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Explorar Laptops
                  </Link>
                  <Link
                    href="/web/servidores"
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Servidores TI
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-blue-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-mono text-xs font-bold uppercase tracking-wider">
                    <Smartphone size={15} />
                    <span>Apple & Samsung Oficial</span>
                  </div>
                  <h4 className="text-white font-bold text-base font-heading">Teléfonos, Tablets & Extensiones</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Series recientes de iPhone, Galaxy, iPad y accesorios originales de ecosistema para mantenerte siempre actualizado.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-cyan-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                    <Cpu size={15} />
                    <span>Cómputo Versátil</span>
                  </div>
                  <h4 className="text-white font-bold text-base font-heading">Laptops, Equipos Compactos & Mínimas</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Desde laptops ejecutivas, estudiantiles y workstations hasta equipos compactos de mínimo formato para escritorio moderno.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-indigo-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider">
                    <Server size={15} />
                    <span>Infraestructura Empresarial</span>
                  </div>
                  <h4 className="text-white font-bold text-base font-heading">Servidores, Racks & Almacenamiento</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Servidores empresariales, almacenamiento sólido, memoria ECC y soluciones de cómputo continuo para operaciones exigentes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3. FERRETERÍA TÉCNICA, HERRAMIENTAS & EQUIPAMIENTO INDUSTRIAL ═══ */}
        <section className="sector-parallax-band sector-parallax-bg-ferreteria" id="parallax-ferreteria">
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080e]/92 via-[#0d1018]/80 to-[#14110b]/82 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-10">
            <div className="rounded-[32px] bg-[#090b12]/84 border border-orange-400/35 backdrop-blur-md shadow-[0_30px_80px_rgba(2,6,23,0.85)] p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/40 text-orange-300 text-xs font-mono font-bold uppercase tracking-widest">
                    <Wrench size={14} className="text-orange-300" />
                    <span>División Ferretería Técnica & Obra Pesada</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-heading leading-tight">
                    Ferretería Industrial, Logística de Carga & Herramienta Pro
                  </h2>
                  <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                    Soluciones de ingeniería práctica para ferreterías, talleres mecánicos, bodegas y constructoras: equipamiento de carga pesada, iluminación táctica de largo alcance, cercos perimetrales, acabados arquitectónicos y maquinaria de producción.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link
                    href="/web/carros-industriales"
                    className="px-5 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
                  >
                    <span>Ver Carros & Carga Pesada</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/web/linterna-potencia"
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Iluminación Táctica
                  </Link>
                  <Link
                    href="/web/blogs/guia-maquinas-de-bloques"
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Maquinaria Industrial
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-orange-400/45 transition-all space-y-2">
                  <span className="text-orange-300 font-mono text-[11px] font-bold uppercase tracking-wider block">Taller & Bodega</span>
                  <h4 className="text-white font-bold text-base font-heading">Carros Porta-Herramientas & Carga</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Carros industriales de acero reforzado (hasta 200 kg), escaladores de gradas y organizadores metálicos de 3 niveles.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-amber-400/45 transition-all space-y-2">
                  <span className="text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider block">Fuerza & Exterior</span>
                  <h4 className="text-white font-bold text-base font-heading">Reflectores Solares, Cables & Cercos</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Luminarias solares de 300W a 800W, bobinas de cableado certificado, barras antipánico e insumos de instalación profesional.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-yellow-400/45 transition-all space-y-2">
                  <span className="text-yellow-300 font-mono text-[11px] font-bold uppercase tracking-wider block">Obra & Producción</span>
                  <h4 className="text-white font-bold text-base font-heading">Construcción, PVC & Plantas de Bloques</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Planchas PVC gran formato, paneles WPC para revestimiento técnico y maquinaria bloquera con respaldo integral.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 4. HOGAR INTELIGENTE, COCINA DE AUTOR & CONFORT ARQUITECTÓNICO ═══ */}
        <section className="sector-parallax-band sector-parallax-bg-hogar" id="parallax-hogar">
          <div className="absolute inset-0 bg-gradient-to-l from-[#040914]/92 via-[#070e1d]/80 to-[#06181c]/82 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-10">
            <div className="rounded-[32px] bg-[#070c16]/82 border border-emerald-400/35 backdrop-blur-md shadow-[0_30px_80px_rgba(2,6,23,0.85)] p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
                    <Home size={14} className="text-emerald-300" />
                    <span>Hogar Contemporáneo • Arquitectura, Cocina & Confort Smart</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-heading leading-tight">
                    Línea Hogar & Diseño Residencial: Estética, Seguridad y Confort
                  </h2>
                  <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                    Equipa y eleva cada rincón de tu casa con la armonía visual de ATOMIC: electrodomésticos de cocina premium, revestimientos mármol y WPC de instalación limpia, luminarias arquitectónicas, accesos sin llave y energía silenciosa.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link
                    href="/web/cocinas"
                    className="px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                  >
                    <span>Explorar Cocina Premium</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/web/paneles-ranurados"
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Mármol PVC & Paneles WPC
                  </Link>
                  <Link
                    href="/web/cerraduras-smart"
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Cerraduras Smart
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-emerald-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles size={14} />
                    <span>Cocina de Autor</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Encimeras, Hornos & Campanas</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Encimeras a gas e inducción de cristal templado, hornos empotrables de acero y campanas extractoras silenciosas.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-cyan-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Layers size={14} />
                    <span>Interiorismo Limpio</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Mármol Calacatta & Muros WPC</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Renueva salas, dormitorios y muebles de TV en horas sin polvo con planchas mármol PVC y listones WPC.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-blue-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Lightbulb size={14} />
                    <span>Iluminación & Hogar</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Luminarias LED & Cuidado Familiar</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Lámparas colgantes de diseño, monitoreo inteligente interior para bebés/mascotas y control climático eficiente.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-teal-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-teal-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Home size={14} />
                    <span>Autonomía Total</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Estaciones Silenciosas Anker SOLIX</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Energía limpia sin combustible ni ruido para respaldar internet, refrigeración y equipos vitales del hogar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 5. ENTRETENIMIENTO, AUDIO PRO & HABITUAL, CONSOLAS DEL AÑO Y DRONES ═══ */}
        <section className="sector-parallax-band sector-parallax-bg-entretenimiento" id="parallax-entretenimiento">
          <div className="absolute inset-0 bg-gradient-to-r from-[#070614]/92 via-[#0d0a1f]/82 to-[#071024]/82 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-10">
            <div className="rounded-[32px] bg-[#0a0818]/82 border border-purple-400/35 backdrop-blur-md shadow-[0_30px_80px_rgba(2,6,23,0.85)] p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-300 text-xs font-mono font-bold uppercase tracking-widest">
                    <Gamepad2 size={14} className="text-purple-300" />
                    <span>Audio, Gaming, Drones & Luces LED</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-heading leading-tight">
                    Entretenimiento Total: Sonido de Alto Rendimiento, Consolas & Drones
                  </h2>
                  <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                    Desde <strong className="text-purple-300">parlantes de alto rendimiento hasta parlantes prácticos de gama habitual para salir de la urgencia</strong>. Descubre además nuestra línea completa de <strong className="text-white">drones, cámaras deportivas, consolas de videojuegos del año, mini consolas, iluminación LED y más</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link
                    href="/web/barra-de-sonido"
                    className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
                  >
                    <span>Ver Parlantes & Barras</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/web/consolas"
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Consolas & Mini Consolas
                  </Link>
                  <Link
                    href="/web/iluminacion"
                    className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Iluminación LED
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-purple-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Speaker size={14} />
                    <span>Toda Gama de Audio</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Parlantes Pro & De Urgencia</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Equipos acústicos de alto rendimiento, barras gamer Bluetooth RGB y parlantes accesibles de gama habitual listos al instante.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-cyan-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Camera size={14} />
                    <span>Aventura & Vuelo</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Drones & Cámaras Deportivas</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Drones con estabilización aérea y cámaras deportivas todoterreno para capturar viajes, ciclismo, motos y creación de contenido.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-indigo-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Gamepad2 size={14} />
                    <span>Gaming Completo</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Consolas del Año & Mini Consolas</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    PlayStation, Nintendo Switch, mandos inalámbricos originales y mini consolas retro listas para conectar y disfrutar.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-pink-400/45 transition-all space-y-2">
                  <div className="flex items-center gap-2 text-pink-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Lightbulb size={14} />
                    <span>Atmósfera LED</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading">Iluminación LED & Ambientes</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Tiras LED inteligentes, iluminación RGB sincronizable para setups gaming, cuartos juveniles, eventos y locales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 6. CREACIÓN DE CONTENIDO, REFINACIÓN DE CATÁLOGOS & ARQUITECTURA DE MARCA ═══ */}
        <section className="sector-parallax-band sector-parallax-bg-contenido" id="parallax-contenido">
          <div className="absolute inset-0 bg-gradient-to-l from-[#080510]/94 via-[#0b0816]/84 to-[#120718]/80 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-10">
            <div className="rounded-[32px] bg-[#090713]/84 border border-rose-400/35 backdrop-blur-md shadow-[0_30px_80px_rgba(2,6,23,0.85)] p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-400/40 text-rose-300 text-xs font-mono font-bold uppercase tracking-widest">
                    <Video size={14} className="text-rose-300" />
                    <span>ATOMIC Studio • Video & Audio, Logotipos & Marca</span>
                  </div>
                  <Link href="/web/creacion-contenido" className="block group">
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white group-hover:text-rose-200 transition-colors uppercase tracking-tight font-heading leading-tight">
                      Creación de Contenido, Remodelación de Logotipos & Estrategia de Marca
                    </h2>
                  </Link>
                  <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                    Planes mensuales para redes sociales con <strong className="text-rose-300">planeación y estrategia en video y audio</strong>, donde además <strong className="text-white">te ayudamos a remodelar o crear tu logotipo</strong>, ejecutamos <strong className="text-rose-200">refinación de imágenes para catálogos</strong> y sostenemos la <strong className="text-white">consistencia estratégica de tu marca en el tiempo</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link
                    href="/web/creacion-contenido"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2"
                  >
                    <span>Explorar Landing & Planes</span>
                    <ArrowRight size={14} />
                  </Link>
                  <a
                    href={`https://wa.me/593969043453?text=${encodeURIComponent("Hola ATOMIC Studio! Quiero asesoría sobre sus planes mensuales de contenido (video/audio), remodelación de logotipo y catálogo.")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
                  >
                    Solicitar Diagnóstico de Marca
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
                <Link
                  href="/web/creacion-contenido#estrategia-video-audio"
                  className="p-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-rose-400/50 transition-all space-y-2 block group"
                >
                  <div className="flex items-center gap-2 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Video size={14} />
                    <span>Planeación Video + Audio</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading group-hover:text-rose-200 transition-colors">
                    Estrategia Mensual Video & Audio
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Guiones, reels, locución comercial, musicalización y diseño sonoro FX planificados mes a mes para retener y vender.
                  </p>
                </Link>

                <Link
                  href="/web/creacion-contenido#remodelacion-logo"
                  className="p-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-fuchsia-400/50 transition-all space-y-2 block group"
                >
                  <div className="flex items-center gap-2 text-fuchsia-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Palette size={14} />
                    <span>Identidad Visual</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading group-hover:text-fuchsia-200 transition-colors">
                    Remodelación & Logotipos
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Modernizamos tu logotipo actual o lo diseñamos desde cero adaptado a avatares digitales, videos y empaques.
                  </p>
                </Link>

                <Link
                  href="/web/creacion-contenido#remodelacion-logo"
                  className="p-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-amber-400/50 transition-all space-y-2 block group"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Camera size={14} />
                    <span>Catálogos Comerciales</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading group-hover:text-amber-200 transition-colors">
                    Refinación de Productos e Imagen
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Limpieza de fondo, balance de luz y presentación uniforme de todo tu portafolio para catálogos y tiendas online.
                  </p>
                </Link>

                <Link
                  href="/web/creacion-contenido#planes-mensuales"
                  className="p-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-cyan-400/50 transition-all space-y-2 block group"
                >
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    <TrendingUp size={14} />
                    <span>Crecimiento Sostenido</span>
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base font-heading group-hover:text-cyan-200 transition-colors">
                    Consistencia & Estrategia Continua
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Acompañamiento estratégico a través del tiempo para sostener una sola voz, estética coherente y alta recordación.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
