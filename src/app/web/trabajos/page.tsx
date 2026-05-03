"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Code, Shield, Cpu, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function TrabajosPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24 border-b border-slate-200 pb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-blue-600">
                             <Sparkles size={18} />
                             <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Casos de Éxito y Proyectos</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-[#1E3A8A] uppercase tracking-tighter italic leading-none">
                            NUESTROS <span className="text-blue-600">TRABAJOS</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em] max-w-sm italic text-right leading-relaxed">
                        Ingeniería de alta precisión aplicada a soluciones reales para la industria y el hogar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: "Sistemas de Seguridad 4K", category: "Infraestructura", icon: <Shield /> },
                        { title: "Automatización Industrial", category: "Software & Hardware", icon: <Cpu /> },
                        { title: "Desarrollo Web Enterprise", category: "Digital", icon: <Code /> }
                    ].map((p, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-slate-200 p-12 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all group flex flex-col justify-between h-[400px] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 text-slate-50 group-hover:text-blue-500/5 transition-colors">
                                {p.icon}
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 block italic">{p.category}</span>
                                <h2 className="text-3xl font-black text-[#1E3A8A] uppercase tracking-tighter italic">{p.title}</h2>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Proyecto Finalizado</p>
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                                    <ExternalLink size={18} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Placeholder for more content */}
                <div className="mt-20 py-32 border-2 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-center">
                    <p className="text-slate-400 font-black uppercase tracking-[0.8em] text-[10px] italic">Próximamente más proyectos en carga...</p>
                </div>
            </div>
        </div>
    )
}
