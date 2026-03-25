"use client"

import ChatInterface from "@/components/ChatInterface"
import { BrainCircuit, BookOpenCheck } from "lucide-react"

export default function TrainingChatPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full mx-auto relative overflow-hidden">
            {/* Header Global */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">Tutoría Cognitiva</h1>
                <p className="text-xs text-neutral-500 font-medium">Recibe guía y capacitación personalizada con Inteligencia Artificial.</p>
            </div>

            {/* Split Screen Container */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Bot 1: Capacitador */}
                <ChatInterface
                    botType="CAPACITADOR"
                    title="Capacitador Corporativo"
                    subtitle="Sistema IA - Ventas y Procesos"
                    welcomeMessage="¡Hola! Soy el Capacitador en Línea corporativo de ATOMIC INDUSTRIES. ¿En qué te puedo ayudar hoy con respecto a ventas, procesos operativos o conocimientos de la empresa?"
                    IconComponent={BrainCircuit}
                    colorTheme="orange"
                />

                {/* Bot 2: Tutor del Día */}
                <ChatInterface
                    botType="TUTOR"
                    title="Tutor del Día"
                    subtitle="Sistema IA - Guía Personalizada"
                    welcomeMessage="Hola. Soy tu Tutor del Día. Mi objetivo es acompañarte paso a paso en tus interacciones diarias y ayudarte a mejorar tu rendimiento inmediato."
                    IconComponent={BookOpenCheck}
                    colorTheme="purple"
                />
            </div>

            <div className="text-center mt-4">
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">La información generada por IA puede ser inexacta. Verifique las políticas de la empresa.</p>
            </div>
        </div>
    )
}

