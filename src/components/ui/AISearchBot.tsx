"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Send, X, ShoppingBag, Zap, MessageCircle, Bot, Sparkles, User, RefreshCw } from "lucide-react"
import { CyberCard } from "./CyberUI"

export const AISearchBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [messages, setMessages] = useState<any[]>([
        { role: 'bot', content: "¡Hola! Soy tu Vendedor Virtual de Atomic. 🤖 Estoy aquí para ayudarte a encontrar exactamente lo que necesitas. ¿Buscas algo específico para tu hogar o negocio? Cuéntame más para recomendarte la mejor opción..." }
    ])
    const [isTyping, setIsTyping] = useState(false)

    // Trigger global search update
    const updateGlobalSearch = (term: string) => {
        const event = new CustomEvent('atomic-search-update', { detail: term });
        window.dispatchEvent(event);
    }

    const handleSend = () => {
        if (!query.trim()) return
        const userMsg = query.trim()
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setQuery("")
        setIsTyping(true)

        // Integrated Recommendation & Pricing Logic
        setTimeout(() => {
            let response = "¡Entiendo! Esa es una gran elección. "
            
            if (userMsg.toLowerCase().includes("camara") || userMsg.toLowerCase().includes("seguridad")) {
                response += "Para seguridad, te recomiendo nuestros sistemas con visión nocturna láser. Tienen un factor de durabilidad industrial y actualmente están con precio preferencial. He actualizado la búsqueda con las mejores opciones para ti. ¿Te gustaría saber más sobre la instalación?"
                updateGlobalSearch("camaras de seguridad")
            } else if (userMsg.toLowerCase().includes("audio") || userMsg.toLowerCase().includes("parlante")) {
                response += "En audio, la fidelidad es clave. Tenemos equipos con 3 años de garantía total. He filtrado los más potentes en el buscador. ¿Buscas algo para interior o exterior? Cuéntame más..."
                updateGlobalSearch("audio profesional")
            } else {
                response += "He sincronizado el catálogo con tu búsqueda. Recuerda que todos nuestros precios ya incluyen los factores de importación y garantía directa. ¿Qué más te gustaría saber para darte una recomendación perfecta?"
                updateGlobalSearch(userMsg)
            }

            setMessages(prev => [...prev, { role: 'bot', content: response }])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <>
            {/* Cute Robot Button */}
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-10 z-[1000] flex flex-col items-center gap-2 group"
            >
                <div className="relative">
                    <div className="absolute -inset-4 bg-[#E8341A]/20 blur-xl group-hover:bg-[#E8341A]/40 transition-all rounded-full" />
                    <div className="relative w-20 h-20 bg-[#E8341A] text-white flex items-center justify-center rounded-2xl shadow-[0_15px_35px_rgba(232,52,26,0.4)] border-b-4 border-black/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                        <Bot size={40} className="relative z-10 group-hover:rotate-12 transition-transform" />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-75" />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-2 shadow-2xl">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic leading-none">ATOMIC BOT</p>
                    <p className="text-[8px] font-bold text-[#E8341A] uppercase tracking-[0.2em] italic mt-1">Vendedor Virtual</p>
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        className="fixed bottom-36 right-10 w-[400px] h-[600px] z-[1000]"
                    >
                        <CyberCard className="!p-0 h-full flex flex-col border-[#E8341A]/30 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]">
                            <div className="bg-[#E8341A] p-6 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4 text-white">
                                    <Sparkles size={20} />
                                    <div>
                                        <p className="text-[11px] font-black uppercase italic tracking-widest leading-none">VENDEDOR VIRTUAL</p>
                                        <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60">Status: Sincronizado</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-950/60 hide-scrollbar">
                                {messages.map((m, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: m.role === 'bot' ? -10 : 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-none border ${m.role === 'bot' ? 'bg-[#E8341A]/10 border-[#E8341A]/30 text-[#E8341A]' : 'bg-white/5 border-white/10 text-white'}`}>
                                                {m.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                            </div>
                                            <div className={`p-5 text-[12px] font-bold leading-relaxed italic uppercase tracking-tight ${m.role === 'bot' ? 'bg-white/[0.03] text-white border-l-2 border-[#E8341A]' : 'bg-[#E8341A] text-white'}`}>
                                                {m.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex items-center gap-4 text-[#E8341A] animate-pulse">
                                        <RefreshCw size={14} className="animate-spin" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Atomic Bot analizando catálogo...</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-black/40 border-t border-white/5">
                                <div className="flex gap-4">
                                    <input 
                                        value={query}
                                        onChange={e => setQuery(e.target.value.toUpperCase())}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        placeholder="CUÉNTAME QUÉ BUSCAS..."
                                        className="flex-1 bg-white/5 border border-white/10 p-5 text-[10px] font-black text-white italic outline-none focus:border-[#E8341A] transition-all"
                                    />
                                    <button onClick={handleSend} className="bg-[#E8341A] text-white px-6 hover:scale-105 transition-all">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </CyberCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
