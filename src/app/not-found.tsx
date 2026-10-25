import Link from "next/link"
import { ArrowLeft, Sparkles, Home, BookOpen, Download } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8 bg-slate-900/60 border border-slate-800 p-8 sm:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles size={13} className="text-cyan-400" />
          <span>Atomic Systems • Recurso Digital</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-white font-mono">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-200">
            Página o Recurso Reubicado
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            La ruta que buscas está disponible en nuestras secciones oficiales optimizadas. Puedes acceder directamente al estudio de Prompts IA o a la tienda:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/prompts"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all hover:scale-102"
          >
            <Sparkles size={15} />
            <span>Ver Prompts IA & PDF</span>
          </Link>
          <Link
            href="/web"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Home size={15} />
            <span>Tienda Oficial</span>
          </Link>
          <Link
            href="/Atomic-Studio-Prompts.pdf"
            download="Atomic-Studio-Prompts.pdf"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Download size={15} />
            <span>Descargar PDF</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
