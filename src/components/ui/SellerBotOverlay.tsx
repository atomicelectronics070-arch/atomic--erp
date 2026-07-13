"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bot, Sparkles, TrendingUp } from "lucide-react"
import ChatInterface from "@/components/ChatInterface"
import { useSession } from "next-auth/react"

export const SellerBotOverlay = () => {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [hasOpened, setHasOpened] = useState(false)

    useEffect(() => {
        // Auto-open after a short delay if it's a seller and hasn't opened yet
        if (session?.user?.role === "SALESPERSON" || session?.user?.role === "ADMIN" || session?.user?.role === "AFILIADO") {
            const timer = setTimeout(() => {
                if (!hasOpened) {
                    setIsOpen(true)
                    setHasOpened(true)
                }
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [session, hasOpened])

    if (!session || (session.user.role !== "SALESPERSON" && session.user.role !== "ADMIN" && session.user.role !== "AFILIADO")) {
        return null;
    }

    const welcomeMsg = `¡HOLA ${session.user.name?.toUpperCase()}! COMO VENDEDOR DE LA EMPRESA, TIENES ACCESO A UN MARGEN DE GANANCIA SÚPER BUENO EN LOS DIFERENTES APARTADOS.\n\n` +
                       `DESDE LA BARRA SUPERIOR YA PUEDES HACER TUS BÚSQUEDAS DE LOS PRODUCTOS EXACTOS QUE DESEAS ENCONTRAR.\n\n` +
                       `TIENES ACCESO A UN DESCUENTO DEL 20% EN TODOS LOS ARTÍCULOS EXISTENTES SIEMPRE. ADEMÁS, SI REALIZAS VENTAS CONTINUAS, PODRÁS ACCEDER A MEJORES PRECIOS Y COMISIONES.\n\n` +
                       `👉 [VER LISTADO DE PRECIOS CON DESCUENTO](/dashboard/precios-vendedor)`;

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(o => !o)}
                className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-1.5 group"
            >
                <div className="relative">
                    <div className="absolute -inset-3 bg-[#10b981]/15 blur-xl group-hover:bg-[#10b981]/30 transition-all rounded-full" />
                    <div className="relative w-16 h-16 bg-[#10b981] text-white flex items-center justify-center rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                        {isOpen ? <X size={22} className="relative z-10" /> : <TrendingUp size={26} className="relative z-10 group-hover:scale-110 transition-transform" />}
                    </div>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-lg shadow-lg">
                    <p className="text-[9px] font-semibold text-white uppercase tracking-widest leading-none">GUÍA DE VENTAS</p>
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
                        className="fixed bottom-32 right-8 w-[400px] h-[600px] z-[100] flex flex-col bg-slate-900 border border-slate-700/60 rounded-none overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
                    >
                        <div className="absolute top-4 right-4 z-50">
                            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <ChatInterface 
                            botType="TUTOR"
                            title="GUÍA DE VENTAS"
                            subtitle="SOPORTE PARA DISTRIBUIDORES"
                            welcomeMessage={welcomeMsg}
                            IconComponent={Sparkles}
                            colorTheme="purple"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
