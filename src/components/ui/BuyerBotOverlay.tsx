"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, ShoppingBag } from "lucide-react"
import ChatInterface from "@/components/ChatInterface"
import { useSession } from "next-auth/react"

export const BuyerBotOverlay = () => {
    const { status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [hasOpened, setHasOpened] = useState(false)

    useEffect(() => {
        // Auto-open after a short delay if user is unauthenticated and hasn't opened yet
        if (status === "unauthenticated") {
            const timer = setTimeout(() => {
                if (!hasOpened) {
                    setIsOpen(true)
                    setHasOpened(true)
                }
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [status, hasOpened])

    if (status !== "unauthenticated") {
        return null;
    }

    const welcomeMsg = `¡HOLA! VEO QUE ESTÁS NAVEGANDO COMO INVITADO.\n\n` +
                       `SI INICIAS SESIÓN PUEDES CONTAR COMO UN COMPRADOR AFILIADO Y TENER EXCELENTES DESCUENTOS EN TODAS TUS COMPRAS (HASTA UN 15% MENOS).\n\n` +
                       `¿TE GUSTARÍA REGISTRARTE O INICIAR SESIÓN AHORA?\n\n` +
                       `👉 [¡QUIERO REGISTRARME Y OBTENER DESCUENTOS!](/register?role=CONSUMIDOR)`;

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(o => !o)}
                className="fixed bottom-8 left-8 z-[100] flex flex-col items-center gap-1.5 group"
            >
                <div className="relative">
                    <div className="absolute -inset-3 bg-[#E8341A]/15 blur-xl group-hover:bg-[#E8341A]/30 transition-all rounded-full" />
                    <div className="relative w-16 h-16 bg-[#E8341A] text-white flex items-center justify-center rounded-xl shadow-[0_10px_30px_rgba(232,52,26,0.4)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                        {isOpen ? <X size={22} className="relative z-10" /> : <ShoppingBag size={26} className="relative z-10 group-hover:scale-110 transition-transform" />}
                    </div>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-lg shadow-lg">
                    <p className="text-[9px] font-semibold text-white uppercase tracking-widest leading-none">CLUB ATOMIC</p>
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
                        className="fixed bottom-32 left-8 w-[400px] h-[600px] z-[100] flex flex-col bg-slate-900 border border-slate-700/60 rounded-none overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
                    >
                        <div className="absolute top-4 right-4 z-50">
                            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <ChatInterface 
                            botType="PUBLIC_BOT"
                            title="ATOMIC AFILIADOS"
                            subtitle="SISTEMA DE BENEFICIOS"
                            welcomeMessage={welcomeMsg}
                            IconComponent={Sparkles}
                            colorTheme="orange"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
