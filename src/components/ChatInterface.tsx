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
    colorTheme: "orange" | "purple" | "indigo"
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
                    content: replyText || (qData ? "He generado tu cotización. Puedes descargarla aquí abajo." : "Sincronización completada."),
                    quotationData: qData 
                }])
            } else {
                setMessages(prev => [...prev, { role: "model", content: "Error: El sistema no respondió. Reintentar conexión." }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "model", content: "Error de red: Conexión fallida con el servicio." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden relative font-sans">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm flex items-center justify-center rounded-xl text-indigo-600">
                        <IconComponent size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-[#0F172A] leading-none mb-1.5">{title}</h1>
                        <p className="text-xs font-bold uppercase tracking-wider flex items-center text-slate-500">
                            <span className="w-2 h-2 rounded-full animate-pulse mr-2 bg-emerald-500"></span>
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar relative">
                {/* Static Welcome Message */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <div className="flex flex-row items-start gap-4 max-w-[85%]">
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                            <IconComponent size={20} />
                        </div>
                        <div className="px-6 py-4 text-sm font-medium leading-relaxed bg-slate-50 border border-slate-200 text-[#0F172A] rounded-2xl rounded-tl-sm shadow-sm">
                            {welcomeMessage}
                        </div>
                    </div>
                </motion.div>

                {/* Dynamic Messages */}
                {messages.map((msg, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`flex max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-4`}>
                            <div className={`w-10 h-10 shrink-0 flex items-center justify-center border rounded-xl ${msg.role === "user" ? "bg-indigo-600 border-indigo-700 text-white" : "bg-indigo-50 border-indigo-100 text-indigo-600"}`}>
                                {msg.role === "user" ? <User size={20} /> : <IconComponent size={20} />}
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className={`px-6 py-4 text-sm font-medium leading-relaxed shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white border border-indigo-700 rounded-2xl rounded-tr-sm" : "bg-slate-50 border border-slate-200 text-[#0F172A] rounded-2xl rounded-tl-sm"}`}>
                                    {msg.content.split('\n').map((line, i) => (
                                        <span key={i}>{line}<br /></span>
                                    ))}
                                </div>

                                {msg.quotationData && (
                                    <motion.button
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        onClick={() => generateQuotationPDF(msg.quotationData!, session?.user?.name || "ADMINISTRADOR")}
                                        className="flex items-center justify-between gap-4 p-4 bg-white text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl hover:bg-indigo-50 transition-all shadow-sm group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText size={18} className="text-indigo-600" />
                                            <span>Descargar Cotización (PDF)</span>
                                        </div>
                                        <Download size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex flex-row items-center gap-4">
                            <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-slate-400 animate-pulse">
                                <IconComponent size={20} />
                            </div>
                            <div className="px-5 py-3 bg-white border border-slate-200 shadow-sm flex items-center space-x-3 rounded-2xl rounded-tl-sm">
                                <Loader2 size={16} className="animate-spin text-indigo-600" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generando respuesta...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-200 shrink-0 z-20">
                <div className="flex space-x-4 relative items-end">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-slate-50 border border-slate-200 px-5 py-4 text-sm font-medium text-[#0F172A] rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none min-h-[56px] max-h-[120px] custom-scrollbar placeholder:text-slate-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="bg-indigo-600 h-14 w-14 shrink-0 flex items-center justify-center text-white rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-all shadow-sm group"
                    >
                        <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
                <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sistema de Asistencia IA - Atomic Industries
                </p>
            </div>
        </div>
    )
}
