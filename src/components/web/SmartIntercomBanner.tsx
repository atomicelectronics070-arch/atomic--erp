"use client"

import { motion } from "framer-motion"
import { Smartphone, Shield, Zap, Bell, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

export default function SmartIntercomBanner() {
    return (
        <section className="relative w-full h-[380px] overflow-hidden group bg-slate-50 border-y border-slate-100">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-l from-white via-white/40 to-transparent z-10" />
                <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden opacity-10">
                    <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100 to-transparent opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[500px] h-[500px] border border-blue-600/10 skew-x-12 animate-pulse" />
                        <div className="absolute w-[300px] h-[300px] border border-blue-600/5 -skew-x-12 animate-pulse delay-75" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-end text-right">
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 max-w-2xl"
                >
                    <div className="flex items-center justify-end gap-3 text-primary font-black italic">
                        <span className="text-[10px] uppercase tracking-[0.5em]">ECOSISTEMA RESIDENCIAL SMART</span>
                        <Smartphone size={20} className="drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
                    </div>
                    
                    <h2 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                        PORTERO <span className="text-primary drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]">ELECTRÓNICO</span> <br />
                        <span className="text-slate-200">SMART SYSTEM</span>
                    </h2>
                    
                    <p className="text-slate-400 text-sm md:text-base font-bold uppercase tracking-widest italic leading-relaxed max-w-lg border-r-2 border-primary pr-6 ml-auto">
                        Control total desde tu smartphone. Audio bidireccional, visión nocturna y apertura remota. Sincronización inmediata con el núcleo Atomic.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-6 justify-end">
                        <div className="flex items-center gap-8 px-6 border border-slate-200 bg-white/50 backdrop-blur-md">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-900 italic">APP</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest">Control</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-900 italic">FHD</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest">Video</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-primary italic">IOT</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest">Ready</span>
                            </div>
                        </div>
                        <Link href="/web/category/domotica-y-automatizacion">
                            <button className="bg-primary text-white px-10 py-5 font-black uppercase tracking-widest text-[11px] italic hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group shadow-xl shadow-primary/20">
                                VER TECNOLOGÍA <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Grid Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('/grid.svg')] z-20" />
        </section>
    )
}
