"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Bot, Send, User, Sparkles, Zap, ChevronRight, 
    Download, Eye, Plus, Layout, History, Cpu, X,
    Loader2, Database, MessageSquare
} from "lucide-react"
import { generateDemoHtml } from "@/lib/demo-generator"

interface ChatMessage {
    role: 'bot' | 'user'
    content: string
}

const demos = [
    {
        id: "ecommerce-premium",
        title: "E-Commerce Luxury",
        description: "Tienda de alta gama con pasarela de pagos integrada y gestión de inventario real.",
        gradient: "from-slate-900 to-slate-800",
        icon: <Layout className="text-white" size={24} />
    },
    {
        id: "crm-biometrics",
        title: "CRM Biométrico",
        description: "Gestión de personal con reconocimiento facial y análisis de productividad por IA.",
        gradient: "from-blue-900 to-indigo-900",
        icon: <Database className="text-white" size={24} />
    }
]

export default function DemosPage() {
    const [isGeneratingMode, setIsGeneratingMode] = useState(false)
    const [activeChat, setActiveChat] = useState<any>(null)

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative selection:bg-blue-600/20 selection:text-blue-600">
            {/* Background FX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[200px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/5 blur-[200px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-24 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest italic rounded-full shadow-[0_5px_15px_rgba(37,99,235,0.3)]">
                                Labs v7.1
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entorno de Pruebas</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-950 leading-none">
                            CENTRO DE <br/><span className="text-blue-600">DEMOSTRACIÓN</span>
                        </h1>
                    </div>
                    <button 
                        onClick={() => setIsGeneratingMode(true)}
                        className="group flex items-center gap-6 bg-slate-950 text-white px-12 py-6 font-black uppercase italic tracking-widest text-xs hover:bg-blue-600 transition-all shadow-2xl"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                        GENERAR NUEVO SISTEMA
                    </button>
                </div>

                <div className="flex flex-wrap gap-12 justify-center">
                    {demos.map((demo) => (
                        <motion.div 
                            key={demo.id}
                            whileHover={{ y: -10 }}
                            className="bg-white border border-slate-100 p-12 shadow-xl relative overflow-hidden group cursor-pointer w-full md:w-[calc(50%-24px)]"
                            onClick={() => setActiveChat(demo)}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${demo.gradient} opacity-5 group-hover:opacity-10 transition-all rounded-bl-full`} />
                            <div className={`w-16 h-16 bg-gradient-to-br ${demo.gradient} flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/20`}>
                                {demo.icon}
                            </div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-950 mb-4">{demo.title}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 uppercase tracking-wide">
                                {demo.description}
                            </p>
                            <div className="flex items-center gap-4 text-blue-600 font-black text-[10px] uppercase tracking-widest italic">
                                INICIAR DEMO INTERACTIVA <ChevronRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* AI Generator Overlay */}
            <AnimatePresence>
                {isGeneratingMode && (
                    <SaaSGeneratorOverlay onClose={() => setIsGeneratingMode(false)} />
                )}
            </AnimatePresence>

            {/* Standard Demo Chat Overlay */}
            <AnimatePresence>
                {activeChat && (
                    <DemoChatOverlay demo={activeChat} onClose={() => setActiveChat(null)} />
                )}
            </AnimatePresence>
        </div>
    )
}

function SaaSGeneratorOverlay({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(0)
    const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'bot', content: "HOLA, SOY EL ASISTENTE DE ATOMIC INDUSTRIES. ¿CUÁL ES TU NOMBRE?" }])
    const [inputValue, setInputValue] = useState("")
    const [userData, setUserData] = useState({ userName: "", businessName: "", productType: "", colors: "" })
    const [isDone, setIsDone] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages])

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return
        const val = inputValue.trim()
        setMessages(prev => [...prev, { role: 'user', content: val }])
        setInputValue("")
        
        if (step === 0) {
            setUserData(p => ({ ...p, userName: val }))
            setStep(1)
            setTimeout(() => {
                setMessages(p => [...p, { role: 'bot', content: `MUCHO GUSTO, ${val.toUpperCase()}. VAMOS A GENERAR TU DEMO.` }])
                setTimeout(() => {
                    setMessages(p => [...p, { role: 'bot', content: "1. ¿CUÁL ES EL NOMBRE DE TU NEGOCIO?" }])
                    setStep(2)
                }, 800)
            }, 500)
        } else if (step === 2) {
            setUserData(p => ({ ...p, businessName: val }))
            setStep(3)
            setTimeout(() => setMessages(p => [...p, { role: 'bot', content: "2. ¿QUÉ PRODUCTOS VENDES?" }]), 500)
        } else if (step === 3) {
            setUserData(p => ({ ...p, productType: val }))
            setStep(4)
            setTimeout(() => setMessages(p => [...p, { role: 'bot', content: "3. ¿QUÉ COLORES USARÁS?" }]), 500)
        } else if (step === 4) {
            setUserData(p => ({ ...p, colors: val }))
            setStep(5)
            setTimeout(() => {
                setMessages(p => [...p, { role: 'bot', content: "SISTEMA COMPILADO. ¿Deseas verlo?" }])
                setIsDone(true)
            }, 500)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white flex flex-col p-8 md:p-24"
        >
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center font-black text-white italic">A</div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">GENERADOR <span className="text-blue-600">AUTÓNOMO</span></h2>
                </div>
                <button onClick={onClose} className="p-4 bg-slate-50 hover:bg-slate-100 transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-10 custom-scrollbar mb-12 max-w-4xl mx-auto w-full">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`p-8 text-sm font-black uppercase italic tracking-tight leading-relaxed max-w-[80%] ${m.role === 'bot' ? 'bg-slate-50 border-l-4 border-black' : 'bg-black text-white'}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isDone && (
                    <div className="flex gap-4">
                        <button 
                            onClick={() => {
                                const html = generateDemoHtml(userData)
                                const w = window.open(); w?.document.write(html); w?.document.close();
                            }}
                            className="bg-blue-600 text-white px-10 py-4 font-black italic uppercase text-[10px] tracking-widest"
                        >
                            VER DEMO
                        </button>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {!isDone && (
                <form onSubmit={handleSend} className="max-w-4xl mx-auto w-full flex gap-4">
                    <input 
                        value={inputValue} onChange={e => setInputValue(e.target.value)}
                        className="flex-1 bg-slate-50 border-none p-6 text-xs font-black uppercase tracking-widest italic outline-none"
                        placeholder="RESPUESTA..."
                    />
                    <button className="bg-black text-white px-12 uppercase font-black italic tracking-widest">ENVIAR</button>
                </form>
            )}
        </motion.div>
    )
}

function DemoChatOverlay({ demo, onClose }: { demo: any, onClose: () => void }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-8"
        >
            <div className="bg-white max-w-2xl w-full h-[600px] flex flex-col p-12 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-black"><X size={24} /></button>
                <div className="mb-12">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950 mb-2">{demo.title}</h2>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">Entorno de Simulación Activo</p>
                </div>
                <div className="flex-1 border-y border-slate-100 py-12 flex flex-col items-center justify-center text-center space-y-8">
                    <Bot size={48} className="text-slate-100" />
                    <p className="text-sm font-bold text-slate-400 uppercase italic max-w-sm">
                        Bienvenido al simulador de {demo.title}. Este entorno permite probar las capacidades de la plataforma sin afectar datos reales.
                    </p>
                </div>
                <div className="pt-12">
                    <button className="w-full bg-slate-950 text-white py-6 font-black uppercase italic tracking-widest text-xs hover:bg-blue-600 transition-all">
                        INICIAR PROTOCOLO DE PRUEBA
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
