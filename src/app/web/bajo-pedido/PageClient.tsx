"use client"

import { motion } from "framer-motion"
import { PackageSearch, Clock, Zap } from "lucide-react"

export default function BajoPedidoPage() {
    return (
        <div className="min-h-[70vh] bg-slate-900/50 backdrop-blur-xl border-slate-700/50 flex flex-col items-center justify-center p-10">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 max-w-2xl"
            >
                <div className="w-24 h-24 bg-blue-50 flex items-center justify-center mx-auto rounded-none border border-blue-100">
                    <PackageSearch size={48} className="text-blue-600 animate-pulse" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">MÓDULO: BAJO PEDIDO</h1>
                    <div className="flex items-center justify-center gap-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all text-white text-[10px] font-black uppercase tracking-widest italic">FASE_ALPHA_01</span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic flex items-center gap-2"><Clock size={12}/> DESPLIEGUE_PRÓXIMO</span>
                    </div>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase tracking-wide italic border-l-2 border-blue-600 pl-6 text-left">
                    ESTAMOS CONFIGURANDO EL CANAL DE IMPORTACIÓN DIRECTA. PRÓXIMAMENTE PODRÁS SOLICITAR EQUIPOS ESPECIALIZADOS Y TECNOLOGÍA DE PUNTA BAJO ESPECIFICACIONES TÁCTICAS DESDE NUESTROS ALMACENES INTERNACIONALES.
                </p>
                <div className="pt-8 grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-1 bg-slate-100 relative overflow-hidden">
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                            />
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
