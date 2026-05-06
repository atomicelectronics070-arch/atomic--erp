"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Eye, Video, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function SpyCameraBanner() {
    return (
        <section className="relative w-full h-[380px] overflow-hidden group bg-white border-y border-slate-100">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white/80 to-transparent z-10" />
                <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden opacity-10">
                    <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
                    {/* Visual representation of a high-tech camera lens or grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100 to-transparent opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[400px] h-[400px] rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
                        <div className="absolute w-[300px] h-[300px] rounded-full border border-primary/5 animate-[spin_15s_linear_infinite_reverse]" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 max-w-2xl"
                >
                    <div className="flex items-center gap-3 text-primary font-black italic">
                        <Eye size={20} className="drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
                        <span className="text-[10px] uppercase tracking-[0.5em]">LÍNEA DE INTELIGENCIA TÁCTICA</span>
                    </div>
                    
                    <h2 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                        GAMA DE <span className="text-primary drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]">CÁMARAS</span> <br />
                        <span className="text-slate-200">ESPÍA PROFESIONALES</span>
                    </h2>
                    
                    <p className="text-slate-400 text-sm md:text-base font-bold uppercase tracking-widest italic leading-relaxed max-w-lg border-l-2 border-primary pl-6">
                        Sistemas de vigilancia invisible con resolución 4K y transmisión en tiempo real. Tecnología de grado militar para operaciones de seguridad avanzada.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-6">
                        <Link href="/web/category/camaras-espia">
                            <button className="bg-primary text-white px-10 py-5 font-black uppercase tracking-widest text-[11px] italic hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group shadow-xl shadow-primary/20">
                                EXPLORAR CATÁLOGO <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </Link>
                        <div className="flex items-center gap-8 px-6 border border-slate-100 bg-slate-50/50 backdrop-blur-md">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-900 italic">4K</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest">UltraHD</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-900 italic">IP</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest">Connect</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-primary italic">24/7</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest">Runtime</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-[length:100%_4px,3px_100%]" />
        </section>
    )
}
