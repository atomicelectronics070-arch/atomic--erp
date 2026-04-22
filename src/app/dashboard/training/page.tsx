"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ChatInterface from "@/components/ChatInterface"
import { BrainCircuit, BookOpenCheck, Sparkles, Cpu, Zap, Target, ShieldCheck } from "lucide-react"

export default function TrainingChatPage() {
    const [activeTab, setActiveTab] = useState<"CAPACITADOR" | "TUTOR">("CAPACITADOR")

    return (
        <div className="flex flex-col h-[calc(100vh-14rem)] w-full mx-auto relative overflow-hidden animate-in fade-in duration-1000 pb-16">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-none bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] rounded-none bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header Global */}
            <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 border-b border-white/5 pb-12 relative z-10">
                <div>
                    <div className="flex items-center gap-4 mb-4 text-secondary">
                        <Sparkles className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Atomic Cognitive Ecosystem</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">NÚCLEO <span className="text-secondary underline decoration-secondary/30 underline-offset-8">IA</span></h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mt-5 italic leading-relaxed max-w-xl">
                        Sincronización neuronal con modelos de vanguardia G-SERIES. <br />Optimización de procesos operativos mediante inteligencia predictiva.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex glass-panel !bg-slate-950/40 p-2 rounded-none-[2rem] border-white/5 shadow-inner ring-1 ring-white/5 backdrop-blur-3xl">
                    <button
                        onClick={() => setActiveTab("CAPACITADOR")}
                        className={`px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-4 italic skew-x-[-12deg] ${
                            activeTab === "CAPACITADOR" 
                            ? 'bg-secondary text-white shadow-2xl shadow-secondary/20' 
                            : 'text-slate-600 hover:text-white'
                        }`}
                    >
                        <div className="skew-x-[12deg] flex items-center gap-4">
                            <BrainCircuit size={18} /> Capacitador
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("TUTOR")}
                        className={`px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-4 italic skew-x-[-12deg] ${
                            activeTab === "TUTOR" 
                            ? 'bg-azure-500 text-white shadow-2xl shadow-azure-500/20' 
                            : 'text-slate-600 hover:text-white'
                        }`}
                    >
                        <div className="skew-x-[12deg] flex items-center gap-4">
                            <BookOpenCheck size={18} /> Tutor del día
                        </div>
                    </button>
                </div>
            </div>

            {/* Chat Container with Tabs logic */}
            <div className="flex-1 relative z-10 min-h-0">
                <AnimatePresence mode="wait">
                    {activeTab === "CAPACITADOR" ? (
                        <motion.div 
                            key="capacitador"
                            initial={{ opacity: 0, x: -30, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 30, scale: 0.98 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full"
                        >
                            <ChatInterface
                                botType="CAPACITADOR"
                                title="Capacitador Industrial"
                                subtitle="SISTEMA NEURONAL - VENTAS Y LOGÍSTICA"
                                welcomeMessage="PROTOCOLO INICIADO. SOY EL CAPACITADOR CORPORATIVO DE ATOMIC INDUSTRIES. ESTOY LISTO PARA OPTIMIZAR TU RENDIMIENTO EN VENTAS, ESTRATEGIA OPERATIVA Y PROCESOS DE ALTO IMPACTO. ¿EN QUÉ NODO DESEAS PROFUNDIZAR HOY?"
                                IconComponent={Zap}
                                colorTheme="orange"
                            />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="tutor"
                            initial={{ opacity: 0, x: 30, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -30, scale: 0.98 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full"
                        >
                            <ChatInterface
                                botType="TUTOR"
                                title="Mentor del Ciclo"
                                subtitle="SISTEMA IA - AUDITORÍA Y GUÍA PERSONALIZADA"
                                welcomeMessage="AUTENTICACIÓN EXITOSA. SOY TU MENTOR DEL CICLO. MI OBJETIVO ES MONITOREAR TUS INTERACCIONES DIARIAS Y GARANTIZAR LA EXCELENCIA EN TU DESEMPEÑO INMEDIATO. DEFINE TUS OBJETIVOS DE LA SESIÓN."
                                IconComponent={ShieldCheck}
                                colorTheme="purple"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-6 opacity-30 relative z-10">
                <div className="flex items-center gap-10">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent to-slate-500"></div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.6em] font-black flex items-center gap-4 italic group">
                        <Cpu size={14} className="group-hover:rotate-90 transition-transform duration-700" /> 
                        NEURONAL SYNC ACTIVE
                    </p>
                    <div className="h-px w-24 bg-gradient-to-l from-transparent to-slate-500"></div>
                </div>
                <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-none bg-secondary animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-none bg-azure-500 animate-pulse delay-75" />
                    <span className="w-1.5 h-1.5 rounded-none bg-slate-800 animate-pulse delay-150" />
                </div>
            </div>
        </div>
    )
}
