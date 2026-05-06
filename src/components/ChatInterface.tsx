"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, Loader2, Sparkles, Cpu, ShieldCheck, BrainCircuit, BookOpenCheck, FileText, Download } from "lucide-react"
import { useSession } from "next-auth/react"
import { generateQuotationPDF, QuotationData } from "@/lib/utils/QuotationPDF"

type Message = {
    role: "user" | "model"
    content: string
    quotationData?: QuotationData
}

interface ChatInterfaceProps {
    botType: "CAPACITADOR" | "TUTOR" | "PUBLIC_BOT"
    title: string
    subtitle: string
    welcomeMessage: string
    IconComponent: any
    colorTheme: "orange" | "purple"
}

export default function ChatInterface({ botType, title, subtitle, welcomeMessage, IconComponent, colorTheme }: ChatInterfaceProps) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
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

        try {
            const apiMessages = [...messages, { role: "user", content: userMsg }].map(m => ({
                role: m.role,
                content: m.content
            }))
            
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages, botType })
            })

            if (res.ok) {
                const data = await res.json()
                let replyText = data.text
                let qData: QuotationData | undefined

                // Interceptar tag de cotización
                const qMatch = replyText.match(/\[\[QUOTATION_JSON:(.*?)\]\]/)
                if (qMatch) {
                    try {
                        qData = JSON.parse(qMatch[1])
                        replyText = replyText.replace(/\[\[QUOTATION_JSON:.*?\]\]/g, "").trim()
                    } catch (e) {
                        console.error("Error parsing quotation JSON", e)
                    }
                }

                setMessages(prev => [...prev, { 
                    role: "model", 
                    content: replyText || (qData ? "HE GENERADO TU COTIZACIÓN. PUEDES DESCARGARLA AQUÍ ABAJO." : "SINCROIZACIÓN COMPLETADA."),
                    quotationData: qData 
                }])
            } else {
                setMessages(prev => [...prev, { role: "model", content: "ERROR DE PROTOCOLO: El sistema neuronal no respondió. Reintentar conexión." }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "model", content: "ERROR DE RED: Sincronización fallida con el núcleo de IA Central." }])
        } finally {
            setIsLoading(false)
        }
    }

    // Color Theme Logic
    const isOrange = colorTheme === 'orange'
    const accentColor = isOrange ? 'secondary' : 'azure-400'
    const accentHex = isOrange ? '#ff6347' : '#2dd4bf'

    return (
        <div className="flex flex-col h-full glass-panel !bg-slate-950/40 border-white/5 relative overflow-hidden rounded-none backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
            {/* Header */}
            <div className="bg-white/[0.02] border-b border-white/5 px-10 py-8 flex items-center justify-between shrink-0 relative z-20">
                <div className="flex items-center space-x-6">
                    <div className={`w-14 h-14 glass-panel border shadow-2xl flex items-center justify-center text-white italic ${isOrange ? 'border-secondary/20 bg-secondary/10' : 'border-azure-500/20 bg-azure-500/10'}`}>
                        <IconComponent size={28} className={isOrange ? 'text-secondary' : 'text-azure-400'} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">{title}</h1>
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center italic ${isOrange ? 'text-secondary' : 'text-azure-400'}`}>
                            <span className={`w-2 h-2 rounded-none animate-pulse mr-3 ${isOrange ? 'bg-secondary' : 'bg-azure-500'}`}></span>
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-950/20 custom-scrollbar relative">
                {/* Static Welcome Message */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <div className="flex flex-row items-start gap-6 max-w-[85%]">
                        <div className={`w-10 h-10 shrink-0 flex items-center justify-center glass-panel border rounded-none italic ${isOrange ? 'border-secondary/20 bg-secondary/10 text-secondary' : 'border-azure-500/20 bg-azure-500/10 text-azure-400'}`}>
                            <IconComponent size={20} />
                        </div>
                        <div className="p-8 text-[14px] font-black leading-relaxed bg-slate-900/60 border border-white/5 text-slate-100 shadow-2xl rounded-none italic uppercase tracking-tight backdrop-blur-xl">
                            {welcomeMessage}
                        </div>
                    </div>
                </motion.div>

                {/* Dynamic Messages */}
                {messages.map((msg, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`flex max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-6`}>
                            <div className={`w-10 h-10 shrink-0 flex items-center justify-center glass-panel border rounded-none italic ${msg.role === "user" ? "bg-secondary/10 border-secondary/20 text-secondary" : `bg-white/5 border-white/10 text-slate-500`}`}>
                                {msg.role === "user" ? <User size={20} /> : <IconComponent size={20} />}
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className={`p-8 text-[14px] font-black leading-relaxed shadow-2xl rounded-none italic uppercase tracking-tight backdrop-blur-3xl ${msg.role === "user" ? "bg-secondary text-white border-secondary/20" : "bg-slate-900/60 border border-white/5 text-slate-100"}`}>
                                    {msg.content.split('\n').map((line, i) => (
                                        <span key={i}>{line}<br /></span>
                                    ))}
                                </div>

                                {msg.quotationData && (
                                    <motion.button
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        onClick={() => generateQuotationPDF(msg.quotationData!, session?.user?.name || "ADMINISTRADOR")}
                                        className="flex items-center justify-between gap-6 p-6 bg-white text-[#1E3A8A] border-2 border-[#1E3A8A] font-black uppercase italic tracking-widest text-[11px] hover:bg-[#1E3A8A] hover:text-white transition-all shadow-xl group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <FileText size={20} />
                                            <span>Descargar Cotización Formal PDF</span>
                                        </div>
                                        <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex flex-row items-center gap-6">
                            <div className={`w-10 h-10 shrink-0 flex items-center justify-center glass-panel border rounded-none border-white/10 bg-white/5 text-slate-700 animate-pulse`}>
                                <IconComponent size={20} />
                            </div>
                            <div className={`px-8 py-4 bg-slate-900/60 border border-white/5 shadow-inner flex items-center space-x-5 rounded-none backdrop-blur-xl`}>
                                <Loader2 size={18} className="animate-spin text-secondary" />
                                <span className="text-[10px] uppercase font-black tracking-[0.5em] text-slate-600 italic">Procesando Pulso Neuronal...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 bg-slate-950/60 border-t border-white/5 shrink-0 relative z-20 backdrop-blur-3xl">
                <div className="flex space-x-6 relative items-end">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder="INICIAR TRANSMISIÓN..."
                        className={`flex-1 bg-slate-900 border border-white/5 p-6 text-[12px] font-black uppercase tracking-widest text-white shadow-inner focus:border-secondary outline-none transition-all resize-none min-h-[70px] max-h-[150px] italic custom-scrollbar placeholder:text-slate-800`}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`bg-secondary h-16 w-16 shrink-0 flex items-center justify-center text-white disabled:opacity-10 hover:bg-white hover:text-secondary transition-all shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] rounded-none active:scale-95 group italic`}
                    >
                        <Send size={24} className="group-hover:translate-x-1 group-hover:rotate-6 transition-transform" />
                    </button>
                </div>
                <p className="mt-6 text-center text-[9px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">
                    Gestión de Sincronización IA v2.6.0 - Núcleo <span className="text-secondary/40">Atomic Solutions</span>
                </p>
            </div>
        </div>
    )
}


