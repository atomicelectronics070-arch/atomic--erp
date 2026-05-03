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
            </div>
        </motion.div>
    )
}

export default function DemosPage() {
    const [activeChat, setActiveChat] = useState<typeof demos[0] | null>(null)

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 pt-40 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero */}
                    <header className="mb-24 space-y-8 text-center md:text-left relative">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm mb-6">
                            <Zap size={16} className="text-[#1E3A8A]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Atomic Digital Showcase</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none text-[#1E3A8A]">
                            INGENIERÍA EN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-800 to-indigo-900">DESARROLLO.</span>
                        </h1>
                        <p className="max-w-2xl text-slate-400 text-sm md:text-lg uppercase tracking-widest leading-relaxed font-semibold">
                            Sistemas de software de alto impacto corporativo. Inicia una conversación interactiva con nuestro <strong className="text-[#1E3A8A]">ASISTENTE</strong> para cotizar tu visión.
                        </p>
                    </header>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        {demos.map((demo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="group relative"
                            >
                                {/* Browser Frame */}
                                <div className="relative aspect-[16/10] bg-white border border-slate-200 overflow-hidden shadow-2xl group-hover:border-blue-200 transition-all duration-500 rounded-2xl">
                                    {/* OS Controls */}
                                    <div className="absolute top-0 left-0 right-0 h-10 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-2 z-20">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        </div>
                                        <div className="ml-6 h-4 w-1/3 bg-white border border-slate-100 rounded-lg" />
                                    </div>

                                    {/* Image */}
                                    <div className="absolute inset-0 pt-10">
                                        <img
                                            src={demo.image}
                                            alt={demo.title}
                                            className="w-full h-full object-cover grayscale-[0.5] opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                                    </div>

                                    {/* Label */}
                                    <div className="absolute bottom-10 left-10">
                                        <div className="px-4 py-2 bg-white/80 border border-slate-200 backdrop-blur-md mb-4 inline-block rounded-lg shadow-sm">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1E3A8A]">{demo.type}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-[#1E3A8A]">{demo.title}</h3>
                                    </div>

                                    {/* Hover — DEMO BUTTON */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/60 backdrop-blur-sm">
                                        <motion.button
                                            onClick={() => setActiveChat(demo)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex items-center gap-4 px-10 py-5 font-black text-[12px] uppercase tracking-[0.4em] transition-all transform translate-y-4 group-hover:translate-y-0 shadow-2xl bg-[#1E3A8A] text-white rounded-xl"
                                        >
                                            <MessageSquare size={18} />
                                            DEMO — HABLAR AHORA
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Info Below */}
                                <div className="mt-10 space-y-6 px-4">
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-md">
                                        {demo.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-8">
                                        {demo.tags.map(tag => (
                                            <div key={tag} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tag}</span>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setActiveChat(demo)}
                                            className="ml-auto flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#1E3A8A] hover:text-blue-800 transition-colors"
                                        >
                                            <Sparkles size={14} /> Iniciar Consulta
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <footer className="mt-40 p-16 md:p-24 bg-white border border-slate-200 text-center relative overflow-hidden rounded-[3rem] shadow-xl">
                        <Hexagon size={400} className="absolute -top-40 -right-40 text-blue-500/[0.03] -rotate-12 pointer-events-none" strokeWidth={1} />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-10 text-[#1E3A8A]">
                                ¿TIENES UN PROYECTO <span className="text-blue-600 underline decoration-blue-100 underline-offset-[12px]">DE ALTO NIVEL?</span>
                            </h2>
                            <p className="text-slate-400 text-xs md:text-base font-bold uppercase tracking-[0.5em] mb-14 max-w-3xl mx-auto leading-relaxed">
                                Nuestro laboratorio de ingeniería está listo para materializar infraestructuras digitales con escalabilidad global.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button
                                    onClick={() => setActiveChat(demos[0])}
                                    className="inline-flex items-center gap-5 bg-[#1E3A8A] text-white px-12 py-7 text-[12px] font-black uppercase tracking-[0.4em] hover:bg-blue-800 transition-all shadow-2xl rounded-2xl"
                                >
                                    <MessageSquare size={20} /> Hablar con Laboratorio
                                </button>
                                <Link
                                    href="/web/contact"
                                    className="inline-flex items-center gap-5 border border-slate-200 bg-slate-50 text-slate-600 px-12 py-7 text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white hover:border-[#1E3A8A] transition-all rounded-2xl"
                                >
                                    Contacto Directo <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            {/* Chat Modal */}
            <AnimatePresence>
                {activeChat && (
                    <DemoChat demo={activeChat} onClose={() => setActiveChat(null)} />
                )}
            </AnimatePresence>
        </div>
    )
}
