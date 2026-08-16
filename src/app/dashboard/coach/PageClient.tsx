"use client"

import ChatInterface from "@/components/ChatInterface"
import { BrainCircuit, Sparkles, ShieldCheck } from "lucide-react"

export default function SellerCoachPage() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col font-sans bg-slate-50">
            {/* Header / Intro */}
            <div className="px-8 py-8 border-b border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                        <BrainCircuit className="text-indigo-600" /> Personal AI Coach
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 max-w-2xl">
                        Tu mentor capacitador con memoria enlazada. Entrenado para guiarte en ventas, documentos y procesos estratégicos de Atomic Industries.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 px-6 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sincronización CRM</p>
                        <p className="text-sm font-black text-indigo-600">Memoria Activa</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-lg flex items-center justify-center text-indigo-600 shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-indigo-100">
                        <ShieldCheck size={20} />
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 min-h-0 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                <ChatInterface 
                    botType="CAPACITADOR"
                    title="CAPACITADOR INDIVIDUAL"
                    subtitle="SISTEMA DE ASISTENCIA TÁCTICA"
                    welcomeMessage="Conexión establecida. Soy tu coach personal de Atomic Industries. Tengo acceso a tus conversaciones de WhatsApp y cotizaciones recientes. ¿En qué puedo asistirte hoy con tus cierres o documentación?"
                    IconComponent={Sparkles}
                    colorTheme="indigo"
                />
            </div>
        </div>
    )
}
