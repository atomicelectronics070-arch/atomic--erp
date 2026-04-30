"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, Minus, Maximize2, MessageSquare, BrainCircuit, History, Zap, Shield, Cpu, Activity } from "lucide-react"
import { CyberCard, NeonButton, GlassPanel } from "./CyberUI"

type Message = {
    role: "user" | "model"
    content: string
}

export const JarvisAI = () => {
    const [mode, setMode] = useState<'closed' | 'mini' | 'pro'>('pro')
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Sincronización JARVIS PRO finalizada. He procesado las actualizaciones del sistema: Estética Cyberpunk Elegant desplegada, Auditoría de Seguridad R6 confirmada y Laboratorio de Software activo. Estoy listo para la gestión estratégica de Atomic ERP." }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return
        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMsg }])
        setIsLoading(true)

        // Nemotron API connection
        try {
            const res = await fetch("/api/jarvis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Only send last 5 messages to save context limit if needed
                    messages: [...messages.slice(-5), { role: "user", content: userMsg }]
                })
            })
            const data = await res.json()
            setMessages(prev => [...prev, { role: "model", content: data.content || "Fallo de comunicación." }])
        } catch (error) {
            setMessages(prev => [...prev, { role: "model", content: "Error crítico de conexión neuronal." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Toggle Trigger (Mini mode) */}
            {mode === 'closed' && (
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMode('mini')}
                    className="fixed bottom-10 right-10 w-16 h-16 bg-[#00F0FF] text-slate-950 flex items-center justify-center z-[1000] border-2 border-white/20 shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                >
                    <BrainCircuit size={24} />
                </motion.button>
            )}

            <AnimatePresence>
                {mode === 'mini' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-10 right-10 w-[380px] h-[500px] z-[1000]"
                    >
                        <CyberCard className="!p-0 h-full flex flex-col border-[#00F0FF]/30 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                            <div className="bg-[#00F0FF] px-6 py-4 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-3 text-slate-950">
                                    <Zap size={16} fill="currentColor" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">JARVIS // NEMOTRON</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setMode('pro')} className="p-2 text-slate-950/50 hover:text-slate-950">
                                        <Maximize2 size={16} />
                                    </button>
                                    <button onClick={() => setMode('closed')} className="p-2 text-slate-950/50 hover:text-slate-950">
                                        <Minus size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-slate-950/40">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'model' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[85%] p-4 text-[12px] font-bold uppercase tracking-tight italic border ${m.role === 'model' ? 'bg-white/5 text-[#00F0FF] border-[#00F0FF]/20' : 'bg-[#E8341A]/10 text-white border-[#E8341A]/20'}`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={e => setInput(e.target.value.toUpperCase())}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="SYNC CMD..."
                                    className="flex-1 bg-white/5 border border-white/10 p-4 text-[10px] font-black text-white italic outline-none focus:border-[#00F0FF] transition-all"
                                />
                                <button onClick={handleSend} className="bg-[#00F0FF] text-slate-950 px-4 flex items-center justify-center">
                                    <Send size={16} />
                                </button>
                            </div>
                        </CyberCard>
                    </motion.div>
                )}

                {mode === 'pro' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#0F1923]/95 backdrop-blur-3xl flex items-center justify-center p-20"
                    >
                        <div className="absolute top-10 right-10 flex gap-6 z-[2001]">
                            <button onClick={() => setMode('mini')} className="text-white/20 hover:text-white p-4 bg-white/5 transition-all">
                                <Minus size={32} strokeWidth={3} />
                            </button>
                            <button onClick={() => setMode('closed')} className="text-white/20 hover:text-red-500 p-4 bg-white/5 transition-all">
                                <X size={32} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="w-full max-w-[1600px] h-full flex gap-10">
                            {/* Pro Sidebar: History */}
                            <CyberCard className="w-[400px] h-full !p-10 border-white/5 flex flex-col bg-slate-950/60 shrink-0">
                                <div className="flex items-center gap-4 mb-16 text-[#00F0FF] neon-text">
                                    <History size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">HISTORIAL NEURONAL</span>
                                </div>
                                <div className="flex-1 space-y-6 overflow-y-auto pr-4 hide-scrollbar">
                                    {messages.filter(m => m.role === 'user').map((m, i) => (
                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 group hover:border-[#00F0FF]/30 transition-all cursor-pointer">
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2 italic">Prompt Log #{i+1}</p>
                                            <p className="text-[11px] font-black text-white uppercase italic tracking-tighter truncate">{m.content}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-white/20">
                                        <Cpu size={20} />
                                        <span className="text-[10px] font-black uppercase italic tracking-[0.4em]">Nemotron Engine v8.0</span>
                                    </div>
                                </div>
                            </CyberCard>

                            {/* Pro Chat Area */}
                            <CyberCard className="flex-1 h-full !p-0 border-[#00F0FF]/20 bg-slate-950/40 flex flex-col relative overflow-hidden">
                                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center">
                                            <BrainCircuit size={40} className="text-[#00F0FF] neon-text" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">JARVIS <span className="text-[#00F0FF] neon-text">PRO</span></h2>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="w-2 h-2 bg-[#00F0FF] animate-pulse" />
                                                <span className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.5em] italic">Sincronización Total Activa</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-10">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-white/20 uppercase italic tracking-widest">Latencia Nodo</p>
                                            <p className="text-lg font-black text-white italic">0.02ms</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-white/20 uppercase italic">Seguridad Matrix</p>
                                            <p className="text-lg font-black text-emerald-400 italic">Óptima</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-16 space-y-12 hide-scrollbar">
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex ${m.role === 'model' ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`flex gap-8 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-12 h-12 shrink-0 border flex items-center justify-center ${m.role === 'model' ? 'bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF]' : 'bg-[#E8341A]/10 border-[#E8341A]/30 text-[#E8341A]'}`}>
                                                    {m.role === 'model' ? <Activity size={24} /> : <UserIcon size={24} />}
                                                </div>
                                                <div className={`p-8 text-lg font-black uppercase tracking-tight italic leading-relaxed border ${m.role === 'model' ? 'bg-white/5 text-white border-white/5' : 'bg-[#E8341A]/5 text-white border-[#E8341A]/20'}`}>
                                                    {m.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start items-center gap-6">
                                            <div className="w-12 h-12 bg-white/5 animate-pulse" />
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] animate-pulse italic">Nemotron procesando pulso...</span>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="p-12 border-t border-white/5 bg-black/40">
                                    <div className="flex gap-10">
                                        <textarea 
                                            value={input}
                                            onChange={e => setInput(e.target.value.toUpperCase())}
                                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                            placeholder="INICIAR PROTOCOLO DE TRANSMISIÓN..."
                                            className="flex-1 bg-white/5 border border-white/10 p-10 text-xl font-black text-white italic outline-none focus:border-[#00F0FF] transition-all resize-none min-h-[100px]"
                                        />
                                        <button onClick={handleSend} className="bg-[#00F0FF] text-slate-950 px-12 font-black uppercase tracking-widest text-[14px] italic hover:scale-105 transition-all">
                                            SYNC_CMD
                                        </button>
                                    </div>
                                </div>
                            </CyberCard>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

const UserIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)
