"use client"

import { useState } from "react"
import ChatInterface from "@/components/ChatInterface"
import { BrainCircuit, BookOpenCheck, Sparkles, Cpu } from "lucide-react"

export default function TrainingChatPage() {
    const [activeTab, setActiveTab] = useState<"CAPACITADOR" | "TUTOR">("CAPACITADOR")

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full mx-auto relative overflow-hidden">
            {/* Header Global */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-orange-500" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Atomic Cognitive Services</span>
                    </div>
                    <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter leading-none">Cerebro <span className="text-orange-600">IA</span></h1>
                    <p className="text-xs text-neutral-500 font-medium mt-2">Sincronización neuronal con modelos G-Series de Gemini.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 shadow-inner">
                    <button
                        onClick={() => setActiveTab("CAPACITADOR")}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            activeTab === "CAPACITADOR" 
                            ? 'bg-white text-orange-600 shadow-sm border border-neutral-200' 
                            : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                    >
                        <BrainCircuit size={14} /> Capacitador
                    </button>
                    <button
                        onClick={() => setActiveTab("TUTOR")}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            activeTab === "TUTOR" 
                            ? 'bg-white text-purple-600 shadow-sm border border-neutral-200' 
                            : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                    >
                        <BookOpenCheck size={14} /> Tutor del día
                    </button>
                </div>
            </div>

            {/* Chat Container with Tabs logic */}
            <div className="flex-1 bg-white border border-neutral-200 shadow-2xl rounded-2xl overflow-hidden relative min-h-0">
                {activeTab === "CAPACITADOR" ? (
                    <div className="h-full animate-in fade-in slide-in-from-left-4 duration-500">
                        <ChatInterface
                            botType="CAPACITADOR"
                            title="Capacitador Corporativo"
                            subtitle="Sistema IA - Ventas y Procesos"
                            welcomeMessage="¡Hola! Soy el Capacitador en Línea corporativo de ATOMIC INDUSTRIES. ¿En qué te puedo ayudar hoy con respecto a ventas, procesos operativos o conocimientos de la empresa?"
                            IconComponent={BrainCircuit}
                            colorTheme="orange"
                        />
                    </div>
                ) : (
                    <div className="h-full animate-in fade-in slide-in-from-right-4 duration-500">
                        <ChatInterface
                            botType="TUTOR"
                            title="Tutor del Día"
                            subtitle="Sistema IA - Guía Personalizada"
                            welcomeMessage="Hola. Soy tu Tutor del Día. Mi objetivo es acompañarte paso a paso en tus interacciones diarias y ayudarte a mejorar tu rendimiento inmediato."
                            IconComponent={BookOpenCheck}
                            colorTheme="purple"
                        />
                    </div>
                )}
            </div>

            <div className="text-center mt-6 flex items-center justify-center gap-4 opacity-50">
                <div className="h-px w-12 bg-neutral-200"></div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Cpu size={10} /> Neuronal Process Active
                </p>
                <div className="h-px w-12 bg-neutral-200"></div>
            </div>
        </div>
    )
}


