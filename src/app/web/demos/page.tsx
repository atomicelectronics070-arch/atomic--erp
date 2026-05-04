"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Hexagon, Zap, X, Send, Bot, User, Loader2, MessageSquare, Sparkles, Code, Palette, ShoppingCart, GraduationCap } from "lucide-react"
import Link from "next/link"

const demos = [
    {
        title: "SaaS Dashboard Pro",
        description: "Panel administrativo de ultra-rendimiento con analítica predictiva e inteligencia de datos centralizada.",
        type: "Software de Gestión",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
        tags: ["Dashboard", "Big Data", "API"],
        accent: "#1E3A8A",
        icon: Code,
        chatContext: "sistema de gestión / dashboard / ERP"
    }
]

const SYSTEM_CONTEXT = `Eres el asistente de ventas y desarrollo de Atomic — una empresa tecnológica de élite en Ecuador.
Tu rol: recibir ideas de clientes sobre proyectos web/apps y ayudarles a definir su proyecto paso a paso.
Tono: profesional, directo, entusiasta. Respuestas cortas (máx 3 oraciones).
Siempre ofreces: 1) escuchar su idea, 2) estimar el tipo de proyecto, 3) invitarles a agendar una llamada.
Al final de cada respuesta incluye una pregunta para avanzar la conversación.
Nunca menciones precios exactos — di "cotizamos a medida" y pide más detalles.`

interface Message {
    role: "user" | "assistant"
    content: string
}

function DemoChat({ demo, onClose }: { demo: typeof demos[0], onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: `¡Hola! 👋 Soy el asistente de Atomic. Veo que te interesa un proyecto de **${demo.chatContext}**. 
\n¿Cuéntame — tienes ya una idea clara de lo que necesitas, o estás explorando opciones?`
        }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim() || loading) return
        const userMsg = input.trim()
        setInput("")
        const newMessages: Message[] = [...messages, { role: "user", content: userMsg }]
        setMessages(newMessages)
        setLoading(true)

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: SYSTEM_CONTEXT + `\nEl cliente está interesado en: ${demo.chatContext}` },
                        ...newMessages.map(m => ({ role: m.role, content: m.content }))
                    ]
                })
            })
            const data = await res.json()
            const reply = data.reply || data.content || data.message || "Entendido. ¿Puedes darme más detalles sobre tu proyecto?"
            setMessages(prev => [...prev, { role: "assistant", content: reply }])
        } catch {
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: "Por favor contáctanos directo por WhatsApp para hablar de tu proyecto. ¡Estamos listos! 🚀" 
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden rounded-2xl" style={{ height: '600px' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                            <Bot size={20} className="text-[#1E3A8A]" />
                        </div>
                        <div>
                            <p className="text-[12px] font-bold uppercase tracking-widest text-[#1E3A8A]">{demo.title}</p>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Asistente Virtual en Línea</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <a 
                            href={`https://wa.me/593969043453?text=Hola, me interesa un proyecto de ${demo.chatContext}`}
                            target="_blank"
                            className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors rounded-lg"
                        >
                            WhatsApp
                        </a>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white custom-scrollbar">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${
                                msg.role === 'assistant' 
                                    ? 'bg-blue-50 border border-blue-100' 
                                    : 'bg-slate-100 border border-slate-200'
                            }`}>
                                {msg.role === 'assistant' 
                                    ? <Bot size={14} className="text-[#1E3A8A]" /> 
                                    : <User size={14} className="text-slate-500" />
                                }
                            </div>
                            <div className={`max-w-[85%] px-5 py-4 text-[13px] leading-relaxed shadow-sm ${
                                msg.role === 'assistant'
                                    ? 'bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl rounded-tl-none'
                                    : 'bg-[#1E3A8A] border border-[#1E3A8A] text-white ml-auto rounded-2xl rounded-tr-none'
                            }`}>
                                {msg.content.split('\n').map((line, j) => (
                                    <span key={j}>{line}<br /></span>
                                ))}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                                <Bot size={14} className="text-[#1E3A8A]" />
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none">
                                <Loader2 size={16} className="text-slate-300 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Describe tu idea de proyecto..."
                            className="flex-1 bg-white border border-slate-200 px-6 py-4 text-[13px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1E3A8A]/50 transition-colors rounded-xl shadow-inner"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="px-6 py-4 bg-[#1E3A8A] text-white hover:bg-blue-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-xl shadow-lg"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-4 text-center italic">
                        Desarrollado con Atomic AI v2.0 · Respuesta Prioritaria
                    </p>
                </div>
                            <p className="text-[13px] font-black uppercase tracking-[0.4em] text-white italic leading-none mb-2">{demo.title}</p>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Core_Sincronizado</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-2">
                        <X size={28} />
                    </button>
                </div>

                {/* Terminal Messages */}
                <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-[url('/grid.svg')] bg-[length:40px_40px] bg-fixed">
                    <div className="space-y-10">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className="w-10 h-10 shrink-0 border border-[#00F0FF]/30 flex items-center justify-center bg-[#00F0FF]/5">
                                    {msg.role === 'assistant' ? <Bot size={18} className="text-[#00F0FF]" /> : <User size={18} className="text-white" />}
                                </div>
                                <div className={`max-w-[85%] p-8 text-[14px] font-bold italic uppercase tracking-wider leading-relaxed shadow-2xl ${
                                    msg.role === 'assistant' 
                                    ? 'bg-slate-950 border border-white/5 text-slate-300' 
                                    : 'bg-[#00F0FF] text-slate-950'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-6">
                                <div className="w-10 h-10 shrink-0 border border-[#00F0FF]/30 flex items-center justify-center bg-[#00F0FF]/5"><Bot size={18} className="text-[#00F0FF]" /></div>
                                <div className="p-8 bg-slate-950 border border-white/5"><Loader2 size={18} className="text-[#00F0FF] animate-spin" /></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Command Input */}
                <div className="p-10 bg-slate-950 border-t border-white/5 relative">
                    <div className="flex gap-6">
                        <div className="flex-1 relative group">
                            <input 
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder="INGRESAR_COMANDO_O_IDEA..." 
                                className="w-full bg-slate-900 border border-white/10 p-7 pl-10 text-[11px] font-black text-white italic outline-none focus:border-[#00F0FF] transition-all uppercase tracking-widest shadow-inner"
                            />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00F0FF]/40 group-focus-within:bg-[#00F0FF] transition-colors" />
                        </div>
                        <button onClick={sendMessage} disabled={!input.trim() || loading} className="bg-[#00F0FF] text-slate-950 px-10 hover:bg-white transition-all shadow-[0_0_30px_rgba(0,240,255,0.2)] flex items-center justify-center">
                            <Send size={24} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">PROTOCOLO: SECURE_CHANNEL_v2</span>
                        <div className="flex gap-6">
                            <Sparkles size={14} className="text-[#00F0FF] opacity-40" />
                            <Zap size={14} className="text-[#E8341A] opacity-40" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function DemosPage() {
    const [activeChat, setActiveChat] = useState<typeof demos[0] | null>(null)

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans relative selection:bg-blue-600/20 selection:text-blue-600">
            {/* Dynamic Technical Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[200px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/5 blur-[200px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.05]" />
            </div>

            <div className="relative z-10 pt-44 pb-32 px-8 lg:px-14">
                <div className="max-w-7xl mx-auto">
                    {/* High-Tech Header */}
                    <motion.header 
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-32 space-y-10 text-center md:text-left relative"
                    >
                        <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border border-blue-600/30 shadow-xl mb-8">
                            <div className="w-2 h-2 bg-blue-600 animate-ping" />
                            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-blue-600 italic">NEURAL_DEVELOPMENT_SHOWCASE</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-none text-slate-900">
                            LABORATORIO<br />
                            <span className="text-blue-600 italic">DE_SISTEMAS.</span>
                        </h1>
                        <p className="max-w-3xl text-slate-500 text-sm md:text-xl uppercase tracking-[0.2em] leading-relaxed font-black italic">
                            INFRAESTRUCTURA DIGITAL DE ALTO RENDIMIENTO. EXPLORA NUESTRAS <span className="text-slate-900 border-b-2 border-blue-600">MATRICES INTERACTIVAS</span> Y MATERIALIZA TU VISIÓN.
                        </p>
                    </motion.header>

                    {/* Grid of Command Centers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {demos.map((demo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                            >
                                    {/* Cyber Frame */}
                                    <div className="relative aspect-[16/10] bg-white border-2 border-slate-200 overflow-hidden shadow-[0_30px_60px_-10px_rgba(0,0,0,0.1)] group-hover:border-blue-600/50 transition-all duration-700">
                                        {/* Terminal Top Bar */}
                                        <div className="absolute top-0 left-0 right-0 h-12 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-8 z-20">
                                            <div className="flex gap-3">
                                                <div className="w-3 h-3 rounded-full bg-red-500/10 group-hover:bg-red-500 transition-colors" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500 transition-colors" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500 transition-colors" />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-blue-600 transition-colors">PROTOCOL_0{i+1}</span>
                                                <Code size={14} className="text-slate-300" />
                                            </div>
                                        </div>

                                        {/* Main Content Area */}
                                        <div className="absolute inset-0 pt-12">
                                            <img
                                                src={demo.image}
                                                alt={demo.title}
                                                className="w-full h-full object-cover opacity-80 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-in-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                        </div>

                                        {/* HUD Overlays */}
                                        <div className="absolute top-20 right-10 flex flex-col items-end gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-10 group-hover:translate-x-0">
                                            <div className="p-4 bg-white/80 border border-blue-600/20 backdrop-blur-xl shadow-xl">
                                                <Sparkles size={24} className="text-blue-600" />
                                            </div>
                                            <div className="p-4 bg-white/80 border border-blue-600/20 backdrop-blur-xl shadow-xl">
                                                <Zap size={24} className="text-blue-600" />
                                            </div>
                                        </div>

                                        {/* Branding Info */}
                                        <div className="absolute bottom-12 left-12 space-y-6">
                                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600/5 border border-blue-600/20 backdrop-blur-md">
                                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 italic leading-none">{demo.type}</span>
                                            </div>
                                            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">{demo.title}</h3>
                                        </div>

                                        {/* SCAN_MODE_OVERLAY */}
                                        <div className="absolute inset-0 pointer-events-none bg-[url('/grid.svg')] opacity-[0.03]" />
                                        
                                        {/* ACTION_TRIGGER */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 bg-white/60 backdrop-blur-sm">
                                            <motion.button
                                                onClick={() => setActiveChat(demo)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-6 px-12 py-6 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.5em] italic shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] relative"
                                            >
                                                <MessageSquare size={20} />
                                                INICIAR_DIAGNÓSTICO
                                                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-slate-900" />
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-slate-900" />
                                            </motion.button>
                                        </div>
                                    </div>

                                {/* Technical Specs Below */}
                                <div className="mt-12 space-y-8 px-4">
                                    <p className="text-slate-500 text-[13px] font-bold uppercase tracking-widest leading-relaxed max-w-xl italic">
                                        {demo.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-10">
                                        {demo.tags.map(tag => (
                                            <div key={tag} className="flex items-center gap-4">
                                                <div className="w-1.5 h-1.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
                                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 italic">{tag}</span>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setActiveChat(demo)}
                                            className="ml-auto flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.4em] text-[#00F0FF] hover:text-white transition-all italic group"
                                        >
                                            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> ENTRAR_AL_CORE
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Call to Command */}
                    <motion.footer 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-48 p-20 lg:p-32 bg-white border-2 border-slate-200 text-center relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
                        <Hexagon size={600} className="absolute -top-60 -right-60 text-blue-600/[0.02] -rotate-12 pointer-events-none" strokeWidth={1} />
                        
                        <div className="relative z-10 space-y-12">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-slate-900 leading-tight">
                                ¿PROYECTO_DE_<br />
                                <span className="text-blue-600">ALTO_IMPACTO?</span>
                            </h2>
                            <p className="text-slate-500 text-xs md:text-base font-black uppercase tracking-[0.8em] mb-16 max-w-4xl mx-auto leading-relaxed italic">
                                NUESTRA INFRAESTRUCTURA DE INGENIERÍA ESTÁ LISTA PARA DESPLEGAR SOLUCIONES A ESCALA GLOBAL.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                                <button
                                    onClick={() => setActiveChat(demos[0])}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-6 bg-blue-600 text-white px-16 py-8 text-xs font-black uppercase tracking-[0.5em] hover:bg-slate-900 transition-all shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] italic"
                                >
                                    <MessageSquare size={22} /> HABLAR_CON_INGENIERÍA
                                </button>
                                <Link
                                    href="/web/contact"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-6 border-2 border-slate-200 bg-white text-slate-900 px-16 py-8 text-xs font-black uppercase tracking-[0.5em] hover:border-blue-600 hover:text-blue-600 transition-all italic"
                                >
                                    ENLACE_DIRECTO <ArrowRight size={22} />
                                </Link>
                            </div>
                        </div>
                    </motion.footer>
                </div>
            </div>

            {/* Chat Command Modal */}
            <AnimatePresence>
                {activeChat && (
                    <DemoChat demo={activeChat} onClose={() => setActiveChat(null)} />
                )}
            </AnimatePresence>
        </div>
    )
}
