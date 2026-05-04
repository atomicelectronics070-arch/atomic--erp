"use client"

import ChatInterface from "@/components/ChatInterface"
import { BrainCircuit, Sparkles, ShieldCheck } from "lucide-react"

export default function SellerCoachPage() {
    return (
        <div className="h-full flex flex-col p-6 lg:p-10 space-y-10 animate-in fade-in duration-700">
            {/* Header / Intro */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-200 pb-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-[#1E3A8A]">
                        <BrainCircuit size={20} className="drop-shadow-[0_0_8px_rgba(30,58,138,0.3)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic text-slate-400">N\u00facleo Cognitivo Individual</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#0F172A] uppercase tracking-tighter leading-none italic">PERSONAL AI <span className="text-[#1E3A8A] underline decoration-[#1E3A8A]/20 underline-offset-8">COACH</span></h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mt-5 italic leading-relaxed max-w-2xl">
                        Tu mentor capacitador con memoria enlazada. Entrenado para guiarte en ventas, documentos y procesos estrat\u00e9gicos de Atomic Solutions.
                    </p>
                </div>
                <div className="flex items-center gap-6 glass-panel !bg-slate-50 border-slate-200 px-8 py-4 shadow-sm">
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Sincronizaci\u00f3n CRM</p>
                        <p className="text-[10px] font-black text-[#1E3A8A] uppercase italic">MEMORIA_ACTIVA</p>
                    </div>
                    <div className="w-10 h-10 bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A]">
                        <ShieldCheck size={20} />
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 min-h-0">
                <ChatInterface 
                    botType="CAPACITADOR"
                    title="CAPACITADOR INDIVIDUAL"
                    subtitle="SISTEMA DE ASISTENCIA T\u00c1CTICA"
                    welcomeMessage="CONEXI\u00d3N ESTABLECIDA. SOY TU COACH PERSONAL DE ATOMIC. TENGO ACCESO A TUS CONVERSACIONES DE WHATSAPP Y COTIZACIONES RECIENTES. \u00bfEN QU\u00c9 PUEDO ASISTIRTE HOY CON TUS CIERRES O DOCUMENTACI\u00d3N?"
                    IconComponent={Sparkles}
                    colorTheme="purple"
                />
            </div>
        </div>
    )
}
