"use client"
import { motion } from "framer-motion"
import { Briefcase, ShieldCheck, Sparkles } from "lucide-react"

export default function TrabajosPage() {
    return (
        <div className="min-h-[70vh] bg-slate-950 flex flex-col items-center justify-center p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-10 max-w-2xl relative z-10"
            >
                <div className="w-24 h-24 bg-white/5 flex items-center justify-center mx-auto border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                    <Briefcase size={40} className="text-white animate-pulse" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">PORTAFOLIO_TÁCTICO</h1>
                    <div className="flex items-center justify-center gap-4">
                        <span className="px-4 py-1.5 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest italic">HISTORIAL_OPERACIONES</span>
                        <span className="text-white/30 font-bold text-[10px] uppercase tracking-widest italic flex items-center gap-2"><ShieldCheck size={14}/> REGISTRO_EN_PROCESO</span>
                    </div>
                </div>
                <p className="text-white/40 text-sm font-medium leading-relaxed uppercase tracking-widest italic border-r-2 border-white/20 pr-6 text-right">
                    ESTAMOS RECOPILANDO NUESTROS ÚLTIMOS DESPLIEGUES DE INFRAESTRUCTURA Y DESARROLLO DE SOFTWARE A MEDIDA. PRÓXIMAMENTE PODRÁS EXPLORAR EL REGISTRO VISUAL DE LA INGENIERÍA ATOMIC EN ACCIÓN.
                </p>
                
                <div className="flex justify-center gap-10 pt-10 border-t border-white/5">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl font-black text-white italic tracking-tighter">+150</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">PROYECTOS_SYNC</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl font-black text-white italic tracking-tighter">100%</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">EFICIENCIA_DOC</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
