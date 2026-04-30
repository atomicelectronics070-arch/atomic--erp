"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Hexagon, Zap, X, Send, Bot, User, Loader2, MessageSquare, Sparkles, Code, Palette, ShoppingCart, GraduationCap } from "lucide-react"
import Link from "next/link"

const demos = [
    {
        title: "Atomic E-Commerce",
        description: "Plataforma de comercio electrónico masivo con integración de pagos globales y gestión logística en tiempo real.",
        type: "Software de Comercio",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop",
        tags: ["Next.js", "Prisma", "Real-time"],
        accent: "#E8341A",
        icon: ShoppingCart,
        chatContext: "e-commerce / tienda en línea"
    },
    {
        title: "SaaS Dashboard Pro",
        description: "Panel administrativo de ultra-rendimiento con analítica predictiva e inteligencia de datos centralizada.",
        type: "Software de Gestión",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
        tags: ["Dashboard", "Big Data", "API"],
        accent: "#2563EB",
        icon: Code,
        chatContext: "sistema de gestión / dashboard / ERP"
    },
    {
        title: "Branding & UI/UX",
        description: "Identidad visual de alto impacto y diseño de interfaces optimizadas para la máxima conversión de usuarios.",
        type: "Diseño Creativo",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop",
        tags: ["Branding", "UI/UX", "Figma"],
        accent: "#F5611A",
        icon: Palette,
        chatContext: "diseño de marca / identidad visual / UI-UX"
    },
    {
        title: "Atomic Academy",
        description: "Ecosistema de aprendizaje digital con gestión de certificaciones y trayectorias de capacitación inteligente.",
        type: "Educación Digital",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop",
        tags: ["LMS", "E-learning", "Mobile"],
        accent: "#00F0FF",
        icon: GraduationCap,
        chatContext: "plataforma educativa / academia en línea / LMS"
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-2xl bg-[#0A0F1E] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col" style={{ height: '600px' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#020617]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center" style={{ background: demo.accent + '20', border: `1px solid ${demo.accent}40` }}>
                            <Bot size={16} style={{ color: demo.accent }} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-white">{demo.title}</p>
                            <p className="text-[9px] uppercase tracking-widest text-white/30">Asistente Atomic · En línea</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <a 
                            href="https://wa.me/593969043453?text=Hola, me interesa un proyecto de " + demo.chatContext
                            target="_blank"
                            className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
                        >
                            WhatsApp
                        </a>
                        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full ${
                                msg.role === 'assistant' 
                                    ? 'bg-[#E8341A]/20 border border-[#E8341A]/30' 
                                    : 'bg-white/10 border border-white/20'
                            }`}>
                                {msg.role === 'assistant' 
                                    ? <Bot size={12} className="text-[#E8341A]" /> 
                                    : <User size={12} className="text-white/60" />
                                }
                            </div>
                            <div className={`max-w-[80%] px-4 py-3 text-[12px] leading-relaxed ${
                                msg.role === 'assistant'
                                    ? 'bg-white/5 border border-white/10 text-white/80'
                                    : 'bg-[#E8341A]/20 border border-[#E8341A]/30 text-white ml-auto'
                            }`}>
                                {msg.content.split('\n').map((line, j) => (
                                    <span key={j}>{line}<br /></span>
                                ))}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-[#E8341A]/20 border border-[#E8341A]/30">
                                <Bot size={12} className="text-[#E8341A]" />
                            </div>
                            <div className="px-4 py-3 bg-white/5 border border-white/10">
                                <Loader2 size={14} className="text-white/30 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-white/10 bg-[#020617]">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Cuéntame sobre tu proyecto..."
                            className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#E8341A]/40 transition-colors"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="px-5 py-3 bg-[#E8341A] text-white hover:bg-[#E8341A]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <p className="text-[9px] text-white/15 uppercase tracking-widest mt-2 text-center">
                        Powered by Atomic AI · Respuesta instantánea
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default function DemosPage() {
    const [activeChat, setActiveChat] = useState<typeof demos[0] | null>(null)

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E8341A]/5 blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#2563EB]/5 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 pt-40 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero */}
                    <header className="mb-32 space-y-8 text-center md:text-left relative">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-6">
                            <Zap size={14} className="text-[#E8341A]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Atomic Digital Showcase</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-none">
                            INGENIERÍA EN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8341A] via-[#F5611A] to-[#2563EB]">DESARROLLO.</span>
                        </h1>
                        <p className="max-w-2xl text-white/40 text-sm md:text-lg uppercase tracking-widest leading-relaxed font-medium">
                            Soluciones tecnológicas de alto impacto. Haz clic en <strong className="text-white/60">DEMO</strong> para hablar con nuestro asistente y comenzar tu proyecto.
                        </p>
                    </header>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
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
                                <div className="relative aspect-[16/10] bg-slate-900 border border-white/10 overflow-hidden shadow-2xl group-hover:border-white/20 transition-all duration-500">
                                    {/* OS Controls */}
                                    <div className="absolute top-0 left-0 right-0 h-8 bg-slate-950/80 border-b border-white/5 flex items-center px-4 gap-2 z-20 backdrop-blur-md">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="ml-4 h-3 w-1/3 bg-white/5 rounded-full" />
                                    </div>

                                    {/* Image */}
                                    <div className="absolute inset-0 pt-8">
                                        <img
                                            src={demo.image}
                                            alt={demo.title}
                                            className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />
                                    </div>

                                    {/* Label */}
                                    <div className="absolute bottom-8 left-8">
                                        <div className="px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-xl mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: demo.accent }}>{demo.type}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">{demo.title}</h3>
                                    </div>

                                    {/* Hover — DEMO BUTTON */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/50 backdrop-blur-sm">
                                        <motion.button
                                            onClick={() => setActiveChat(demo)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex items-center gap-3 px-10 py-5 font-black text-[11px] uppercase tracking-[0.4em] transition-all transform translate-y-4 group-hover:translate-y-0 shadow-2xl"
                                            style={{ background: demo.accent, color: '#fff', boxShadow: `0 20px 50px ${demo.accent}60` }}
                                        >
                                            <MessageSquare size={16} />
                                            DEMO — CREA TU WEB
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Info Below */}
                                <div className="mt-10 space-y-6">
                                    <p className="text-white/40 text-[11px] uppercase tracking-widest leading-relaxed max-w-md">
                                        {demo.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-6">
                                        {demo.tags.map(tag => (
                                            <div key={tag} className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-white/20" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{tag}</span>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setActiveChat(demo)}
                                            className="ml-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors"
                                            style={{ color: demo.accent }}
                                        >
                                            <Sparkles size={12} /> Iniciar Demo
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <footer className="mt-40 p-20 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 text-center relative overflow-hidden">
                        <Hexagon size={300} className="absolute -top-32 -right-32 text-white/[0.02] -rotate-12 pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-8">
                                ¿TIENES UN PROYECTO <span className="text-[#E8341A]">DE ALTO NIVEL?</span>
                            </h2>
                            <p className="text-white/30 text-xs md:text-sm uppercase tracking-[0.5em] mb-12 max-w-2xl mx-auto">
                                Nuestro laboratorio de software está listo para materializar tu visión con tecnología de última generación.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => setActiveChat(demos[0])}
                                    className="inline-flex items-center gap-4 bg-[#E8341A] text-white px-12 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-[#E8341A] transition-all shadow-[0_20px_50px_rgba(232,52,26,0.3)]"
                                >
                                    <MessageSquare size={16} /> Hablar con Asistente
                                </button>
                                <Link
                                    href="/web/contact"
                                    className="inline-flex items-center gap-4 border border-white/20 text-white px-12 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:border-white/60 transition-all"
                                >
                                    Contacto Directo <ArrowRight size={16} />
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
