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
    const [botName, setBotName] = useState<string | null>(null)
    const [isCheckingName, setIsCheckingName] = useState(true)
    const [baptismInput, setBaptismInput] = useState("")
    const [isSavingName, setIsSavingName] = useState(false)

    useEffect(() => {
        if (session?.user?.id) {
            fetch('/api/bot-name').then(r => r.json()).then(d => {
                setBotName(d.name)
                setIsCheckingName(false)
            }).catch(() => setIsCheckingName(false))
        } else {
            setIsCheckingName(false)
        }
    }, [session])

    useEffect(() => {
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

    const handleSaveName = async () => {
        if (!baptismInput.trim()) return;
        setIsSavingName(true);
        try {
            const res = await fetch('/api/bot-name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: baptismInput.trim() })
            });
            if (res.ok) {
                setBotName(baptismInput.trim().toUpperCase());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSavingName(false);
        }
    }

    const welcomeMsg = `¡HOLA ${session.user.name?.toUpperCase()}! SOY ${botName}, TU ASISTENTE IA.\n\n` +
                       `ESTOY DISEÑADO PARA AYUDARTE A CERRAR VENTAS, ARMAR COTIZACIONES Y RESPONDER TUS DUDAS.\n\n` +
                       `SI QUIERES QUE HAGA UNA COTIZACIÓN RÁPIDA, SÓLO ESCRIBE ALGO COMO: "Cotízame 2 cámaras IP y 1 disco duro para Juan Pérez en Quito al número 0999". ¡YO ME ENCARGO DEL RESTO!`;

    return (
        <>
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
                        {isOpen ? <X size={22} className="relative z-10" /> : <Sparkles size={26} className="relative z-10 group-hover:scale-110 transition-transform" />}
                    </div>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-lg shadow-lg">
                    <p className="text-[9px] font-semibold text-white uppercase tracking-widest leading-none">{botName || "ASISTENTE"}</p>
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-32 right-8 w-[400px] h-[600px] z-[100] flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]"
                    >
                        <div className="absolute top-4 right-4 z-50">
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-[#0F172A] transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {isCheckingName ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                            </div>
                        ) : !botName ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <Sparkles size={32} />
                                </div>
                                <h3 className="text-xl font-black text-[#0F172A] mb-2 uppercase">¡Hola {session.user.name?.split(' ')[0]}!</h3>
                                <p className="text-sm text-slate-600 font-medium mb-8">Soy tu nuevo asistente de inteligencia artificial exclusivo para ventas. Aún no tengo nombre, ¿cómo te gustaría bautizarme?</p>
                                
                                <div className="w-full space-y-4">
                                    <input 
                                        autoFocus
                                        value={baptismInput}
                                        onChange={e => setBaptismInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                                        placeholder="Ej: Jarvis, Cortana, Asistente..."
                                        className="w-full bg-white border border-slate-300 p-4 rounded-xl text-center font-bold text-[#0F172A] uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                                    />
                                    <button 
                                        onClick={handleSaveName}
                                        disabled={isSavingName || !baptismInput.trim()}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-md transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                                    >
                                        {isSavingName ? "GUARDANDO..." : "BAUTIZAR ASISTENTE"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ChatInterface 
                                botType="TUTOR"
                                title={botName}
                                subtitle="SOPORTE PARA VENTAS Y COTIZACIONES IA"
                                welcomeMessage={welcomeMsg}
                                IconComponent={Sparkles}
                                colorTheme="purple"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
