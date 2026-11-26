import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, Clock, Play, CheckCircle2, Film, Layers } from "lucide-react"

export const metadata = {
  title: 'Reseña en Clips Resumidos: Las 48 Leyes del Poder (Robert Greene) | Blog ATOMIC',
  description: 'Nuestra postura honesta sobre Las 48 Leyes del Poder de Robert Greene y cómo nuestra serie en clips cortos te permite digerir y absorber el libro en 1 a 2 horas.'
}

export default function Resena48LeyesBlogPage() {
  return (
    <div className="min-h-screen bg-[#060810] text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-[#080c18]/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/web/blogs"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver al Blog</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/web/juan-pablo-guzman"
              className="px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[11px] uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
            >
              <Play size={12} />
              <span>Ir a los 48 Clips</span>
            </Link>
            <Link
              href="/web/nosotros"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-[11px] font-mono font-bold transition-all"
            >
              Nosotros
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Article */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-12">
        {/* Header */}
        <header className="space-y-5 border-b border-stone-800 pb-10">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold uppercase tracking-wider">
              Reseña Editorial &amp; Lectura Práctica
            </span>
            <span className="inline-flex items-center gap-1.5 text-stone-400">
              <Clock size={13} /> Lectura rápida • Absorbe el libro en 1–2 horas
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white leading-tight tracking-tight uppercase">
            Cómo digerir <span className="text-amber-400">«Las 48 Leyes del Poder»</span> en clips cortos resumidos en 1 a 2 horas
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Una aclaración transparente antes de empezar: nosotros no escribimos ni creamos <em>Las 48 Leyes del Poder</em>; esa obra clásica pertenece a <strong>Robert Greene</strong>. Lo que estamos compartiendo aquí es una <strong>reseña audiovisual propia</strong>, dividida ley por ley en clips resumidos, para que cualquier persona pueda asimilar las lecciones centrales del libro de forma directa y práctica.
          </p>
        </header>

        {/* Why Clips Format */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-[#0c111f] border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase font-heading">1 Clip = 1 Ley Concreta</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              Cada ley se condensa en un video vertical de menos de 2 minutos con el caso histórico esencial y la idea central sin paja.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c111f] border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase font-heading">Aprende en 1 a 2 Horas</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              El libro original supera las 500 páginas. Con los 48 clips resumidos puedes recorrer todo el mapa conceptual en una sola tarde.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c111f] border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers size={18} />
            </div>
            <h2 className="text-sm font-bold text-white uppercase font-heading">Criterio Real, Sin Humo</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              No se trata de fórmulas mágicas ni ego empresarial: es psicología humana aplicada al trabajo, al comercio y a saber leer tu entorno.
            </p>
          </div>
        </section>

        {/* Honest Posture Body */}
        <article className="space-y-6 text-sm sm:text-base text-stone-300 leading-relaxed">
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading uppercase flex items-center gap-2">
              <BookOpen size={20} className="text-amber-400" />
              <span>Nuestra postura: lectura crítica, no atribución ni mito</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              En internet abundan perfiles que citan frases sueltas de libros famosos como si fueran propias o prometen poder instantáneo. En <strong>ATOMIC</strong> preferimos ser transparentes: compartimos nuestra reseña personal del libro de <strong>Robert Greene</strong> porque ayuda a desarrollar criterio comercial, detectar intenciones a tiempo y tomar decisiones más serenas.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Cada episodio incluye el <strong>video corto resumido</strong>, su <strong>transcripción completa</strong> y la <strong>conclusión práctica</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Puedes navegar el tablero interactivo de las <strong>48 leyes enumeradas</strong> e ir directo a las leyes ya publicadas (como la Ley #1 y la Ley #2) mientras seguimos subiendo una a una las restantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Pensado como complemento ágil antes o después de leer el libro completo.</span>
              </li>
            </ul>
          </div>
        </article>

        {/* Main CTA Card to the 48 Clips Interface */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#11192e] via-[#0b1020] to-[#080b15] border-2 border-amber-500/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block">
              Interfaz Interactiva • 48 Clips Resumidos
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading uppercase leading-tight">
              Ver las 48 Leyes del Poder en Clips Resumidos
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Entra al tablero interactivo de Juan Pablo Guzmán para reproducir los clips resumidos ley por ley, leer las transcripciones y absorber los conceptos clave del libro en 1 a 2 horas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/web/juan-pablo-guzman"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-105 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 inline-flex items-center justify-center gap-2"
            >
              <Play size={14} />
              <span>Abrir Clips de las 48 Leyes</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
