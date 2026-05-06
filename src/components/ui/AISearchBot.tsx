"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bot, Sparkles } from "lucide-react"
import { useCart } from "@/context/CartContext"
import ChatInterface from "@/components/ChatInterface"

export const AISearchBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { totalItems } = useCart()

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(o => !o)}
                className="fixed bottom-8 right-8 z-[1000] flex flex-col items-center gap-1.5 group"
            >
                <div className="relative">
                    <div className="absolute -inset-3 bg-[#E8341A]/15 blur-xl group-hover:bg-[#E8341A]/30 transition-all rounded-full" />
                    <div className="relative w-16 h-16 bg-[#E8341A] text-white flex items-center justify-center rounded-xl shadow-[0_10px_30px_rgba(232,52,26,0.4)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                        {isOpen ? <X size={22} className="relative z-10" /> : <Bot size={26} className="relative z-10 group-hover:scale-110 transition-transform" />}
                        {totalItems > 0 && !isOpen && (
                            <span className="absolute top-0 right-0 w-5 h-5 bg-white text-[#E8341A] text-[9px] font-black flex items-center justify-center rounded-none shadow-lg animate-bounce">
                                {totalItems}
                            </span>
                        )}
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-100" />
                        </span>
                    </div>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-lg shadow-lg">
                    <p className="text-[9px] font-semibold text-white uppercase tracking-widest leading-none">ATOMIC AI</p>
                </div>
            </motion.button>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-32 right-8 w-[400px] h-[600px] z-[1000] flex flex-col bg-slate-900 border border-slate-700/60 rounded-none overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
                    >
                        <div className="absolute top-4 right-4 z-50">
                            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <ChatInterface 
                            botType="PUBLIC_BOT"
                            title="ATOMIC ASSISTANT"
                            subtitle="NÚCLEO DE ASISTENCIA GLOBAL"
                            welcomeMessage="¡HOLA! SOY LA IA DE ATOMIC SOLUTIONS. PUEDO AYUDARTE A ENCONTRAR PRODUCTOS, DARTE SOPORTE TÉCNICO O INCLUSO GENERARTE UNA COTIZACIÓN FORMAL EN PDF SI LO DESEAS. ¿CÓMO TE ASISTO HOY?"
                            IconComponent={Sparkles}
                            colorTheme="orange"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
