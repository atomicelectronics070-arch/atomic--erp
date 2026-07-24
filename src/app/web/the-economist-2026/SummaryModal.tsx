'use client'

import React, { useState } from 'react'
import { X, FileText, ChevronRight } from 'lucide-react'

export function SummaryModal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-red-600 hover:bg-red-600/10 text-red-500 hover:text-red-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                <FileText size={18} /> Versión en Español (Resumen)
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-red-900/50 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(220,38,38,0.2)]">
                        
                        <div className="flex items-center justify-between p-6 border-b border-red-900/30 bg-[#0a0a0a]">
                            <h3 className="text-xl font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={20} /> Resumen Confidencial 2026
                            </h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 md:p-8 overflow-y-auto !text-gray-300 prose prose-invert max-w-none custom-scrollbar">
                            <h2 className="text-2xl font-black !text-white mt-0">Decodificando The World Ahead 2026</h2>
                            
                            <p className="lead !text-gray-400 font-medium">
                                El análisis predictivo de The Economist no es casualidad. Es el resultado de la agregación masiva de datos geopolíticos, económicos y sociales. A continuación, el resumen de las 4 advertencias principales para este año.
                            </p>
                            
                            <div className="space-y-6 mt-8">
                                <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-xl">
                                    <h4 className="!text-red-400 font-bold flex items-center gap-2 mt-0">
                                        <ChevronRight size={16} /> 1. Sincronía del Desastre y Distracción
                                    </h4>
                                    <p className="text-sm mb-0">
                                        Mientras el mundo es hipnotizado por mega-eventos de entretenimiento (como la Copa Mundial), se ejecutarán movimientos tectónicos en la geopolítica mundial. La revista alude a intervenciones estructurales durante estos periodos de "ceguera mediática".
                                    </p>
                                </div>
                                
                                <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-xl">
                                    <h4 className="!text-red-400 font-bold flex items-center gap-2 mt-0">
                                        <ChevronRight size={16} /> 2. La IA como Eje de Poder y Guerra
                                    </h4>
                                    <p className="text-sm mb-0">
                                        Ya no se trata de chatbots. El 2026 marca el punto donde la Inteligencia Artificial toma decisiones logísticas militares y define los mercados bursátiles de forma autónoma. Quien controle los centros de datos, controlará el flujo del poder global.
                                    </p>
                                </div>
                                
                                <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-xl">
                                    <h4 className="!text-red-400 font-bold flex items-center gap-2 mt-0">
                                        <ChevronRight size={16} /> 3. Fracturas Territoriales Programadas
                                    </h4>
                                    <p className="text-sm mb-0">
                                        Las advertencias sobre crisis humanas y "terremotos" (tanto literales como metafóricos, mencionando a Venezuela y otras regiones inestables) sugieren que los colapsos económicos no son accidentes, sino purgas necesarias para resetear la deuda.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-6 bg-[#0a0a0a] rounded-xl border border-gray-800 text-center">
                                <p className="text-sm !text-slate-400 italic mb-0">
                                    "El futuro ya está escrito en sus oficinas antes de que nosotros lo vivamos." Para el análisis completo de datos duros, se recomienda leer la versión íntegra en inglés.
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            )}
        </>
    )
}
