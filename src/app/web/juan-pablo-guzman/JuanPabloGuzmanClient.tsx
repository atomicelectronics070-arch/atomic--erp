"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Crown, Play, Lock, Unlock, Sparkles, Phone, ArrowRight, 
  CheckCircle2, Share2, BookOpen, Users, TrendingUp, ShieldAlert, 
  Flame, Award, Eye, Clock, MessageSquare, ChevronRight, User, ExternalLink
} from "lucide-react"

// Las 48 Leyes del Poder canónicas de Robert Greene
const LAWS_OF_POWER = [
  {
    number: 1,
    title: "Nunca eclipses a tu maestro",
    unlocked: true,
    videoSrc: "/videos/juan-pablo-guzman/ley-1-nunca-eclipses-a-tu-maestro.mp4",
    poster: "/videos/juan-pablo-guzman/poster-ley-1.jpg",
    duration: "1:28",
    historicalFigure: "Nicolás Fouquet & Luis XIV (Francia, 1661)",
    tagline: "El peligro no es brillar; el peligro es olvidar delante de quién brillas.",
    transcript: `Ley número 1 del poder: Nunca eclipses a tu maestro. Un hombre lo hizo en una sola noche y lo pagó con el resto de su vida. Francia, 1661. El rey es Luis XIV, al que todos llaman el Rey Sol. Y su ministro del dinero, Nicolás Fouquet, es el hombre más rico del país. En su escudo lleva una ardilla y su lema dice: "¿Hasta dónde no subiré?". Con su dinero levanta un palacio como no hay otro en Francia (Vaux-le-Vicomte). Y una noche de verano invita al rey a una fiesta para enseñárselo: cena en platos de oro, una obra de Molière estrenada para la ocasión y fuegos artificiales sobre los jardines. Fouquet quería impresionar al rey; lo que consiguió fue humillarlo. Porque esa noche, el que más brillaba no era el Rey Sol. 19 días después, D'Artagnan, el de los mosqueteros, lo detiene. Le quitan todo y lo encierran en una fortaleza de los Alpes de la que ya no sale vivo. ¿Y su palacio? El rey se queda con su arquitecto, su pintor y su jardinero, y con ellos construye Versalles. Haz que quien esté por encima de ti se sienta brillante, nunca amenazado. Porque brillar no es el peligro. El peligro es olvidar delante de quién brillas.`,
    lesson: "Haz que tus superiores siempre parezcan más brillantes de lo que son. El deseo de agradar no debe cegarte: si haces sentir inseguro o eclipsado a quien ostenta el poder, desatarás su venganza silenciosa."
  },
  {
    number: 2,
    title: "Nunca confíes demasiado en tus amigos; aprende a usar a tus enemigos",
    unlocked: true,
    videoSrc: "/videos/juan-pablo-guzman/ley-2-nunca-confies-en-tus-amigos.mp4",
    poster: "/videos/juan-pablo-guzman/poster-ley-2.jpg",
    duration: "1:38",
    historicalFigure: "Emperador Miguel III & Basilio el Macedonio (Bizancio)",
    tagline: "Un enemigo tiene algo que demostrar; un amigo al que se lo das todo acaba queriéndolo todo.",
    transcript: `Ley número 2 del poder: Nunca confíes demasiado en tus amigos; aprende a usar a tus enemigos. Un emperador se lo dio todo a su mejor amigo, y su amigo lo mató. En Bizancio, el emperador Miguel III es un joven al que le pierden las fiestas y los caballos. Un día, un campesino doma a su caballo más salvaje, y Miguel lo quiere a su lado: se llama Basilio. Era mozo de cuadras, y el emperador lo convierte en su mejor amigo. Lo saca del establo, lo viste de seda, y lo pone a dormir junto a su puerta. Hasta lo casa con su amante favorita. Basilio le susurra que su tío quiere el trono, y el emperador le deja matarlo. Y como premio, Miguel lo corona emperador a su lado. Pero Miguel empieza a favorecer a otro amigo, y Basilio teme perderlo todo. Una noche, después de un banquete, el emperador cae borracho en su cama. Las cerraduras están rotas y no hay guardias. Basilio entra con sus hombres. A Miguel le cortan las dos manos y lo apuñalan en el corazón. Tenía 27 años. Basilio se queda solo en el trono, y su familia reina casi 200 años. Un enemigo que ganas tiene algo que demostrar. Un amigo al que se lo das todo, acaba queriéndolo todo, porque la gratitud pesa. Y hay quien prefiere matarte antes que deberte algo.`,
    lesson: "Ten cuidado con los amigos: te traicionarán más rápido movidos por la envidia oculta. Un antiguo enemigo al que contratas o incorporas a tu causa te será más leal, porque tiene mucho más que demostrar."
  },
  { number: 3, title: "Oculte sus intenciones", unlocked: false },
  { number: 4, title: "Diga siempre menos de lo necesario", unlocked: false },
  { number: 5, title: "Casi todo depende de su prestigio; defiéndalo a muerte", unlocked: false },
  { number: 6, title: "Busque llamar la atención a cualquier precio", unlocked: false },
  { number: 7, title: "Logre que otros trabajen por usted, pero no deje nunca de llevarse los laureles", unlocked: false },
  { number: 8, title: "Haga que la gente vaya hacia usted y utilice la carnada más adecuada", unlocked: false },
  { number: 9, title: "Gane a través de sus acciones, nunca por medio de argumentos", unlocked: false },
  { number: 10, title: "Peligro de contagio: evite a los perdedores y desdichados", unlocked: false },
  { number: 11, title: "Haga que la gente dependa de usted", unlocked: false },
  { number: 12, title: "Para desarmar a su víctima, utilice la franqueza y la generosidad selectivas", unlocked: false },
  { number: 13, title: "Cuando pida ayuda, no apele a la compasión sino al interés ajeno", unlocked: false },
  { number: 14, title: "Muéstrese como un amigo pero actúe como un espía", unlocked: false },
  { number: 15, title: "Aplaste por completo a su enemigo", unlocked: false },
  { number: 16, title: "Utilice la ausencia para incrementar el respeto y el honor", unlocked: false },
  { number: 17, title: "Mantenga el suspenso y cultive un aire de imprevisibilidad", unlocked: false },
  { number: 18, title: "No construya fortalezas para protegerse: el aislamiento es peligroso", unlocked: false },
  { number: 19, title: "Sepa con quién está tratando: no ofenda a la persona equivocada", unlocked: false },
  { number: 20, title: "No se comprometa con nadie", unlocked: false },
  { number: 21, title: "Finja candidez para atrapar a los incautos: muéstrese más tonto que su víctima", unlocked: false },
  { number: 22, title: "Utilice la táctica de la capitulación: transforme la debilidad en poder", unlocked: false },
  { number: 23, title: "Concentre sus fuerzas", unlocked: false },
  { number: 24, title: "Desempeñe el papel de cortesano perfecto", unlocked: false },
  { number: 25, title: "Procure recrearse constantemente", unlocked: false },
  { number: 26, title: "Mantenga las manos limpias", unlocked: false },
  { number: 27, title: "Juegue con la necesidad de la gente de creer en algo", unlocked: false },
  { number: 28, title: "Sea audaz al entrar en acción", unlocked: false },
  { number: 29, title: "Planifique sus acciones de principio a fin", unlocked: false },
  { number: 30, title: "Haga que sus logros parezcan no requerir esfuerzo", unlocked: false },
  { number: 31, title: "Controle las opciones: haga que otros jueguen con sus cartas", unlocked: false },
  { number: 32, title: "Juegue con las fantasías de la gente", unlocked: false },
  { number: 33, title: "Descubra el talón de Aquiles de los demás", unlocked: false },
  { number: 34, title: "Sea real en sus maneras: actúe como un rey para ser tratado como tal", unlocked: false },
  { number: 35, title: "Domine el arte de la oportunidad", unlocked: false },
  { number: 36, title: "Menosprecie las cosas que no puede obtener: ignorarlas es la mejor venganza", unlocked: false },
  { number: 37, title: "Arme espectáculos imponentes", unlocked: false },
  { number: 38, title: "Piense como quiera, pero compórtese como los demás", unlocked: false },
  { number: 39, title: "Revuelva las aguas para asegurarse una buena pesca", unlocked: false },
  { number: 40, title: "Menosprecie el almuerzo gratuito", unlocked: false },
  { number: 41, title: "Evite calzarse los zapatos de un gran hombre", unlocked: false },
  { number: 42, title: "Muerto el perro, se acabó la rabia", unlocked: false },
  { number: 43, title: "Trabaje sobre el corazón y la mente de los demás", unlocked: false },
  { number: 44, title: "Desarme y enfurezca con el efecto espejo", unlocked: false },
  { number: 45, title: "Predique la necesidad de cambios, pero nunca modifique demasiado a la vez", unlocked: false },
  { number: 46, title: "Nunca se muestre demasiado perfecto", unlocked: false },
  { number: 47, title: "No vaya más allá de su objetivo original; al triunfar aprenda a detenerse", unlocked: false },
  { number: 48, title: "Sea cambiante en su forma", unlocked: false }
]

export default function JuanPabloGuzmanClient() {
  const [selectedLaw, setSelectedLaw] = useState<number>(1)
  const officialPhone = "593980319050"

  const activeLawData = LAWS_OF_POWER.find(l => l.number === selectedLaw) || LAWS_OF_POWER[0]

  return (
    <div className="min-h-screen bg-[#060810] text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 px-4 py-2 text-center text-xs font-mono font-black tracking-widest uppercase shadow-md flex items-center justify-center gap-2 flex-wrap">
        <span>⚡ MARCA PERSONAL // JUAN PABLO GUZMÁN • ESTRATEGIA DE PODER, CONTENIDO & NEGOCIOS</span>
        <span className="hidden sm:inline bg-black text-amber-300 px-2 py-0.5 rounded text-[10px]">
          ATOMIC MEDIA
        </span>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#080c18]/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/web" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              JG
            </div>
            <div>
              <span className="font-heading font-black text-base sm:text-lg text-white tracking-wider">
                JUAN PABLO GUZMÁN
              </span>
              <span className="block text-[9px] font-mono text-amber-400 tracking-widest uppercase">
                CO-FUNDADOR // MARCA PERSONAL
              </span>
            </div>
          </Link>

          {/* Sibling navigation to Santiago Guzmán */}
          <div className="flex items-center gap-3">
            <Link
              href="/web/santiago-guzman"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-mono font-bold transition-all"
            >
              <User size={13} className="text-amber-400" />
              <span>Ver Santiago Guzmán</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/web"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all"
            >
              <span>Tienda ATOMIC</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER: BRAND PRESENTATION ── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-8 border-b border-stone-800 bg-radial from-[#131b31] via-[#090e1c] to-[#04060d]">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
            <Crown size={14} className="text-amber-400" />
            <span>Serie Exclusiva de Videos & Análisis Estratégico</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight uppercase leading-[1.08] max-w-4xl mx-auto">
            Dominio, Psicología & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Las 48 Leyes del Poder
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Exploramos las dinámicas reales del poder, la influencia histórica y las estrategias de crecimiento viral para negocios. 
            Bienvenido al espacio personal de <strong>Juan Pablo Guzmán</strong> en ATOMIC.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-mono">
            <div className="px-4 py-2 rounded-2xl bg-[#0b1222] border border-amber-500/30 text-amber-300 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span>48 Leyes del Poder: <strong>2 Desbloqueadas</strong></span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-[#0b1222] border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
              <TrendingUp size={14} className="text-cyan-400" />
              <span>Blog Growth: <strong>Fidelización Viral (Barberías)</strong></span>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          SECCIÓN 1: LAS 48 LEYES DEL PODER (REJILLA DE 48 CUADRADOS)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-widest flex items-center gap-1.5">
              <Crown size={14} /> SERIE PRINCIPAL
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase">
              Las 48 Leyes del Poder
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-xl">
              Haz clic en cualquiera de los cuadros para inspeccionar la ley. Las leyes grabadas y desbloqueadas cuentan con video completo, análisis histórico y aplicación táctica.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5">
              <Unlock size={13} /> 2 Desbloqueadas
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-stone-900 text-stone-400 border border-stone-800 flex items-center gap-1.5">
              <Lock size={13} /> 46 En Grabación
            </span>
          </div>
        </div>

        {/* ── SPOTLIGHT DEL EPISODIO SELECCIONADO (SI ESTÁ DESBLOQUEADO) ── */}
        {activeLawData.unlocked ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1426] via-[#090e1c] to-[#050812] border-2 border-amber-500/60 shadow-2xl space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
              <div>
                <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider">
                  LEY #{activeLawData.number} DESBLOQUEADA • EPISODIO EN VIDEO
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase mt-1">
                  {activeLawData.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-300/80 font-mono italic mt-0.5">
                  &ldquo;{activeLawData.tagline}&rdquo;
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold shrink-0">
                Caso Histórico: {activeLawData.historicalFigure}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* VIDEO PLAYER VERTICAL 9:16 */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-black">
                  <video
                    src={activeLawData.videoSrc}
                    poster={activeLawData.poster}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    Tu navegador no soporta reproducción de video HTML5.
                  </video>
                </div>
              </div>

              {/* TRANSCRIPT & LESSON ANALYSIS */}
              <div className="lg:col-span-7 space-y-5">
                
                <div className="p-5 rounded-2xl bg-[#060a14] border border-stone-800 space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} /> Transcripción Oficial del Video:
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed whitespace-pre-line">
                    {activeLawData.transcript}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <Crown size={14} /> Conclusión Estratégica:
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-200 font-sans leading-relaxed">
                    {activeLawData.lesson}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/${officialPhone}?text=${encodeURIComponent(`¡Hola Juan Pablo! Vi tu análisis de la Ley #${activeLawData.number} ("${activeLawData.title}") y me pareció brutal.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-mono font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>Comentar con Juan Pablo en WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-[#080d1a] border border-stone-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-700 text-stone-400 flex items-center justify-center mx-auto">
              <Lock size={22} />
            </div>
            <h3 className="font-heading font-black text-xl text-white uppercase">
              Ley #{activeLawData.number}: {activeLawData.title}
            </h3>
            <p className="text-xs font-mono text-stone-400 max-w-md mx-auto">
              Este episodio se encuentra actualmente en producción y grabación por Juan Pablo Guzmán. Haz clic en las Leyes #1 o #2 para ver los episodios ya publicados.
            </p>
          </div>
        )}

        {/* ── GRID DE LOS 48 CUADRADOS ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold uppercase text-stone-400 tracking-wider">
              Mapa Completo de las 48 Leyes (Haz clic en cualquier número):
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {LAWS_OF_POWER.map(law => {
              const isSelected = selectedLaw === law.number

              return (
                <button
                  key={law.number}
                  type="button"
                  onClick={() => setSelectedLaw(law.number)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between aspect-square group cursor-pointer ${
                    law.unlocked 
                      ? isSelected
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-stone-950 border-white shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                        : 'bg-[#101b33] border-amber-500/80 hover:border-amber-400 text-amber-200 shadow-md'
                      : isSelected
                        ? 'bg-stone-800 border-stone-500 text-white'
                        : 'bg-[#070b14] border-stone-800/80 hover:border-stone-700 text-stone-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-base font-heading font-black ${
                      law.unlocked 
                        ? isSelected ? 'text-stone-950' : 'text-amber-400' 
                        : 'text-stone-500'
                    }`}>
                      #{law.number}
                    </span>
                    {law.unlocked ? (
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-stone-950' : 'bg-emerald-400 animate-pulse'}`} />
                    ) : (
                      <Lock size={12} className="text-stone-600" />
                    )}
                  </div>

                  <p className={`text-[10px] font-sans font-bold leading-tight line-clamp-3 ${
                    law.unlocked 
                      ? isSelected ? 'text-stone-950' : 'text-stone-200' 
                      : 'text-stone-500'
                  }`}>
                    {law.title}
                  </p>

                  <span className={`text-[8px] font-mono uppercase font-black tracking-wider ${
                    law.unlocked 
                      ? isSelected ? 'text-stone-950 underline' : 'text-emerald-400' 
                      : 'text-stone-600'
                  }`}>
                    {law.unlocked ? "▶ VER VIDEO" : "BLOQUEADA"}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          SECCIÓN 2: SEGUNDO BLOG • CRECIMIENTO VIRAL & SISTEMAS DE REFERIDOS
          (Basado en el video de la Barbería / Estrategia de Retención)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-stone-800 space-y-10">
        
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-widest flex items-center gap-1.5">
            <TrendingUp size={14} /> BLOG ESTRATÉGICO DE CRECIMIENTO
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase">
            El Efecto Multiplicador: Cómo 1 Cliente te Trae 4 Clientes Nuevos Sin Gastar en Anuncios
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-2xl">
            Caso práctico para barberías, salones, tiendas y negocios locales utilizando tarjetas de puntos en el celular y bucles de recomendación.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#071324] via-[#050e1a] to-[#03060c] border border-cyan-500/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* VIDEO PLAYER VERTICAL 9:16 */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl bg-black">
                <video
                  src="/videos/juan-pablo-guzman/fidelizacion-referidos-barberia.mp4"
                  poster="/videos/juan-pablo-guzman/poster-fidelizacion.jpg"
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                >
                  Tu navegador no soporta reproducción de video.
                </video>
              </div>
            </div>

            {/* CASE ANALYSIS */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-3">
                <h3 className="font-heading font-black text-xl text-white uppercase">
                  La Historia de Tony vs. La Barbería de Leo
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                  En la barbería tradicional de Tony, un cliente llamado Alex se corta el cabello, paga en efectivo y se retira. Si alguien le pregunta dónde se cortó, ni siquiera recuerda el nombre del local. <strong>Un cliente que entra y sale sin dejar rastro ni retorno.</strong>
                </p>
                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                  En la barbería de Leo la regla es diferente: al momento de pagar, el cajero le dice: <br />
                  <strong className="text-cyan-300 font-mono">&ldquo;Tráeme a un amigo y te regalo 100 puntos en tu tarjeta digital&rdquo;.</strong>
                </p>
              </div>

              {/* Bucle Viral Breakdown */}
              <div className="p-5 rounded-2xl bg-[#040914] border border-cyan-500/30 space-y-3 font-mono text-xs">
                <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider block">
                  El Bucle Viral Paso a Paso:
                </span>
                <div className="space-y-1.5 text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">1</span>
                    <span>Alex invita a <strong>Marco</strong> y a <strong>Hugo</strong>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">2</span>
                    <span>Marco invita a <strong>Dani</strong>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">3</span>
                    <span>Hugo invita a su <strong>primo</strong>.</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-800 text-emerald-400 font-black">
                  = 4 clientes nuevos en tu negocio, cada uno con su tarjeta en el móvil, sin pagar anuncios en Meta y con costo de adquisición $0.
                </div>
              </div>

              {/* Call to action "CARN" */}
              <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <h4 className="text-xs font-mono font-black uppercase text-cyan-300 tracking-wider">
                    Solicita una Demostración para tu Negocio:
                  </h4>
                </div>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  Si tienes una barbería, peluquería, clínica o restaurante y deseas implementar este sistema automatizado de tarjetas y referidos, envía la palabra clave <strong className="text-white bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/50 font-mono">CARN</strong> a nuestro WhatsApp y te mostraremos una demo funcional personalizada.
                </p>

                <a
                  href={`https://wa.me/${officialPhone}?text=${encodeURIComponent("CARN - Deseo ver una demostración del sistema de tarjetas de fidelización y referidos para mi negocio.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  <Phone size={14} />
                  <span>Enviar palabra &quot;CARN&quot; a WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ── FOOTER & CROSS LINK TO SANTIAGO GUZMÁN ── */}
      <footer className="mt-20 border-t border-stone-800 bg-[#04060c] py-12 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/web/santiago-guzman"
              className="px-5 py-2.5 rounded-full bg-[#0a1224] hover:bg-[#101b36] border border-amber-500/40 text-amber-300 font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <User size={14} />
              <span>Conoce el perfil de Santiago Guzmán (Fundador & CEO)</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/web"
              className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 transition-all"
            >
              Volver a la Tienda ATOMIC
            </Link>
          </div>

          <p>© {new Date().getFullYear()} ATOMIC • Ecosistema Digital & Contenido Estratégico.</p>
        </div>
      </footer>

    </div>
  )
}
