"use client"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, ArrowRight, Truck, Gift } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CartBotOverlay() {
    const { showBotPrompt, setShowBotPrompt, lastAction, totalPrice } = useCart()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (showBotPrompt) {
            setVisible(true)
            const timer = setTimeout(() => {
                setShowBotPrompt(false)
            }, 8000)
            return () => clearTimeout(timer)
        }
    }, [showBotPrompt, setShowBotPrompt])

    return (
        <AnimatePresence>
            {visible && showBotPrompt && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-8 right-8 z-[1000] w-[350px]"
                >
                    <div className="bg-slate-950 border border-blue-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                        
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Atomic_Assistant</h4>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sincronización en tiempo real</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowBotPrompt(false)} className="text-slate-700 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-white text-xs font-bold leading-relaxed uppercase tracking-wider italic">
                                    {totalPrice > 100 
                                        ? "¡DETECTADA COMPRA MAYOR A $100! TIENES UN 10% DE DESCUENTO ADICIONAL EN ESTE PEDIDO."
                                        : "¿TE AYUDO A HACER TU PEDIDO? VE A PAGAR TU COMPRA Y TEN ENVÍO GRATIS POR TU PRIMERA COMPRA."
                                    }
                                </p>
                                
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-blue-600/10 border border-blue-500/20 p-3 flex flex-col gap-1">
                                        <Truck size={14} className="text-blue-500" />
                                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Envío Gratis</span>
                                    </div>
                                    <div className="bg-emerald-600/10 border border-emerald-500/20 p-3 flex flex-col gap-1">
                                        <Gift size={14} className="text-emerald-500" />
                                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Regalo Sync</span>
                                    </div>
                                </div>

                                <Link 
                                    href="/web/cart"
                                    onClick={() => setShowBotPrompt(false)}
                                    className="w-full bg-white text-slate-950 py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-blue-600 hover:text-white transition-all group"
                                >
                                    FINALIZAR COMPRA <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
