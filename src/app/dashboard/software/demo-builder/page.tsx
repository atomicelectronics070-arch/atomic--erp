"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    MessageSquare, Send, Globe, Settings, ShoppingBag, 
    X, Check, Layout, Palette, Box, ChevronRight, 
    ArrowLeft, Eye, Monitor, Database, User, RefreshCw
} from "lucide-react"
import { CyberCard, NeonButton, GlassPanel, CyberInput } from "@/components/ui/CyberUI"
import Link from "next/link"

type DemoState = {
    purpose: string
    name: string
    colors: string[]
    productCount: number
    style: string
    changesRemaining: number
}

export default function DemoBuilderPage() {
    const [step, setStep] = useState(0)
    const [chat, setChat] = useState<{ role: 'bot' | 'user', content: string }[]>([
        { role: 'bot', content: "¡Hola! Soy el arquitecto digital de Atomic. Vamos a construir tu demo. ¿Para qué es tu web? (Ej: Tienda de ropa, Servicios de Consultoría, etc.)" }
    ])
    const [inputValue, setInputValue] = useState("")
    const [demoData, setDemoData] = useState<DemoState>({
        purpose: "",
        name: "",
        colors: [],
        productCount: 0,
        style: "",
        changesRemaining: 5
    })
    const [viewMode, setViewMode] = useState<'chat' | 'preview'>('chat')
    const [previewSide, setPreviewSide] = useState<'public' | 'admin'>('public')

    const handleSend = () => {
        if (!inputValue.trim()) return

        const newChat = [...chat, { role: 'user' as const, content: inputValue }]
        setChat(newChat)
        const val = inputValue.trim()
        setInputValue("")

        setTimeout(() => {
            let botMsg = ""
            switch (step) {
                case 0:
                    setDemoData(prev => ({ ...prev, purpose: val }))
                    botMsg = "¿Cómo se va a llamar tu proyecto? Danos un nombre que impacte."
                    setStep(1)
                    break
                case 1:
                    setDemoData(prev => ({ ...prev, name: val }))
                    botMsg = "¡Gran nombre! Ahora elige 4 colores principales (Escríbelos separados por coma, ej: Negro, Rojo Atómico, Blanco, Gris)"
                    setStep(2)
                    break
                case 2:
                    const cols = val.split(",").map(c => c.trim())
                    setDemoData(prev => ({ ...prev, colors: cols }))
                    botMsg = "¿Cuántos productos o servicios vas a manejar inicialmente?"
                    setStep(3)
                    break
                case 3:
                    setDemoData(prev => ({ ...prev, productCount: parseInt(val) || 10 }))
                    botMsg = "Perfecto. Por último, ¿qué estilo prefieres? \n1. Sobrio y Redondo \n2. Sobrio y Elegante Cuadrado \n3. Sobrio Elegante Redondo \n4. Redondo y Casual"
                    setStep(4)
                    break
                case 4:
                    setDemoData(prev => ({ ...prev, style: val }))
                    botMsg = "¡Configuración inicial completada! He generado tu matriz basada en el modelo de Shopify de Atomic. Ya puedes ver tu demo."
                    setStep(5)
                    break
                default:
                    if (demoData.changesRemaining > 0) {
                        setDemoData(prev => ({ ...prev, changesRemaining: prev.changesRemaining - 1 }))
                        botMsg = `Cambio aplicado. Te quedan ${demoData.changesRemaining - 1} cambios. ¿Qué más deseas ajustar?`
                    } else {
                        botMsg = "Has alcanzado el límite de 5 cambios para esta demo. ¡Contáctanos para una versión completa!"
                    }
            }
            setChat(prev => [...prev, { role: 'bot', content: botMsg }])
        }, 800)
    }

    if (viewMode === 'preview') {
        return (
            <div className="fixed inset-0 bg-[#0F1923] z-[2000] flex flex-col overflow-hidden font-sans">
                {/* Switcher Bar */}
                <div className="h-20 bg-slate-950 border-b border-white/5 flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setViewMode('chat')} className="flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest italic transition-all">
                            <ArrowLeft size={16} /> REGRESAR AL CHAT
                        </button>
                        <div className="h-6 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#00F0FF] animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">DEMO: {demoData.name.toUpperCase()}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setPreviewSide('admin')}
                            className={`px-8 py-3 text-[9px] font-black uppercase tracking-widest italic transition-all border ${previewSide === 'admin' ? 'bg-[#00F0FF] text-slate-950 border-[#00F0FF]' : 'text-white/40 border-white/10 hover:border-white/30'}`}
                        >
                            VER INTERFAZ DE GESTIÓN
                        </button>
                        <button 
                            onClick={() => setPreviewSide('public')}
                            className={`px-8 py-3 text-[9px] font-black uppercase tracking-widest italic transition-all border ${previewSide === 'public' ? 'bg-[#E8341A] text-white border-[#E8341A]' : 'text-white/40 border-white/10 hover:border-white/30'}`}
                        >
                            VER PÁGINA PÚBLICA
                        </button>
                    </div>

                    <Link href="/dashboard/software">
                        <button className="p-3 text-white/20 hover:text-red-500 transition-all">
                            <X size={24} />
                        </button>
                    </Link>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto bg-slate-900 relative">
                    {previewSide === 'public' ? (
                        <div className="p-20 space-y-20 max-w-[1400px] mx-auto">
                            <header className="flex justify-between items-center">
                                <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">{demoData.name}</h1>
                                <nav className="flex gap-10">
                                    {['INICIO', 'PRODUCTOS', 'CONTACTO'].map(i => (
                                        <span key={i} className="text-[10px] font-black text-white/40 hover:text-white cursor-pointer tracking-widest">{i}</span>
                                    ))}
                                </nav>
                            </header>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                                <div className="space-y-8">
                                    <h2 className="text-7xl font-black text-white leading-none uppercase italic tracking-tighter">
                                        Tus {demoData.purpose} <br/> 
                                        <span style={{ color: demoData.colors[0] || '#00F0FF' }}>Elevados</span>
                                    </h2>
                                    <p className="text-white/40 font-medium italic max-w-md">Experiencia diseñada para {demoData.name}. Innovación y estilo en cada pixel.</p>
                                    <button className={`px-12 py-5 font-black uppercase tracking-widest text-[11px] italic`} style={{ backgroundColor: demoData.colors[0] || '#00F0FF', color: '#000' }}>COMPRAR AHORA</button>
                                </div>
                                <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundColor: demoData.colors[1] }} />
                                    <ShoppingBag size={120} className="text-white/10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-10">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className={`p-8 bg-white/5 border border-white/5 space-y-4 ${demoData.style.includes('Redondo') ? 'rounded-3xl' : ''}`}>
                                        <div className="aspect-square bg-white/10 mb-6" />
                                        <div className="h-4 w-3/4 bg-white/10" />
                                        <div className="h-3 w-1/2 bg-white/5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full">
                            <aside className="w-64 bg-slate-950 border-r border-white/5 p-8 space-y-10">
                                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-10">ADMIN PANEL</div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Productos', icon: Box },
                                        { label: 'Proveedores', icon: Database },
                                        { label: 'Lista Precios', icon: Settings },
                                        { label: 'Clientes', icon: User }
                                    ].map(i => (
                                        <div key={i.label} className="flex items-center gap-4 text-white/40 hover:text-white cursor-pointer transition-all">
                                            <i.icon size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">{i.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </aside>
                            <main className="flex-1 p-16 space-y-12">
                                <div className="flex justify-between items-end border-b border-white/5 pb-10">
                                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">GESTIÓN DE INVENTARIO</h2>
                                    <button className="bg-[#00F0FF] text-slate-950 px-8 py-3 text-[10px] font-black uppercase italic tracking-widest">SUBIR PRODUCTO</button>
                                </div>
                                <div className="grid grid-cols-3 gap-8">
                                    <CyberCard className="!p-6 flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center"><Box size={20} /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/20 uppercase italic">Stock Total</p>
                                            <p className="text-2xl font-black text-white italic">{demoData.productCount}</p>
                                        </div>
                                    </CyberCard>
                                    <CyberCard className="!p-6 flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center"><RefreshCw size={20} /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/20 uppercase italic">Sincronizaciones</p>
                                            <p className="text-2xl font-black text-[#00F0FF] italic">Activas</p>
                                        </div>
                                    </CyberCard>
                                    <CyberCard className="!p-6 flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center"><Check size={20} /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/20 uppercase italic">Status Matrix</p>
                                            <p className="text-2xl font-black text-emerald-400 italic">Online</p>
                                        </div>
                                    </CyberCard>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 p-1">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                {['SKU', 'PRODUCTO', 'STOCK', 'PRECIO', 'PROVEEDOR'].map(h => (
                                                    <th key={h} className="p-6 text-[10px] font-black text-white/20 uppercase italic">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                                                    <td className="p-6 text-[10px] font-mono text-white/40">AT-00{i+1}</td>
                                                    <td className="p-6 text-[10px] font-black text-white italic uppercase">Demo Product {i+1}</td>
                                                    <td className="p-6 text-[10px] font-black text-white/60 italic">24 Units</td>
                                                    <td className="p-6 text-[10px] font-black text-[#00F0FF] italic">$199.00</td>
                                                    <td className="p-6 text-[10px] font-black text-white/30 italic uppercase">Atomic Matrix</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </main>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-16 pb-32 relative z-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/5 pb-16">
                <div>
                    <div className="flex items-center space-x-4 text-[#00F0FF] neon-text mb-4">
                        <Monitor size={20} />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">DEMO BUILDER // V1.0</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                        CONSTRUCTOR <span className="text-[#00F0FF] neon-text">IA</span>
                    </h1>
                </div>
                {step === 5 && (
                    <NeonButton variant="primary" onClick={() => setViewMode('preview')} className="!px-12">
                        LANZAR PREVIEW
                    </NeonButton>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Chat Section */}
                <div className="lg:col-span-2 space-y-10">
                    <CyberCard className="h-[600px] flex flex-col !p-0 overflow-hidden bg-slate-950/40">
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 hide-scrollbar">
                            <AnimatePresence>
                                {chat.map((m, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: m.role === 'bot' ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[80%] p-6 text-[14px] font-bold uppercase tracking-tight italic ${m.role === 'bot' ? 'bg-white/5 text-[#00F0FF] border border-[#00F0FF]/20' : 'bg-[#E8341A]/10 text-white border border-[#E8341A]/20'}`}>
                                            {m.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="p-8 border-t border-white/5 bg-black/40">
                            <div className="flex gap-4">
                                <input 
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="ESCRIBE TU RESPUESTA..."
                                    className="flex-1 bg-white/5 border border-white/10 p-6 text-xs font-black text-white italic outline-none focus:border-[#00F0FF] transition-all"
                                />
                                <button onClick={handleSend} className="bg-[#00F0FF] text-slate-950 p-6 hover:scale-105 transition-all">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </CyberCard>
                </div>

                {/* Status Section */}
                <div className="space-y-10">
                    <CyberCard className="!p-10 space-y-10">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">ESTADO DE LA MATRIZ</h3>
                        
                        <div className="space-y-8">
                            {[
                                { label: 'Proyecto', value: demoData.name || '---', icon: Layout },
                                { label: 'Estilo', value: demoData.style || '---', icon: Palette },
                                { label: 'Cambios', value: demoData.changesRemaining, icon: RefreshCw }
                            ].map(i => (
                                <div key={i.label} className="flex items-center gap-6">
                                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-[#00F0FF]"><i.icon size={18} /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-white/20 uppercase italic">{i.label}</p>
                                        <p className="text-xs font-black text-white uppercase italic">{i.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[9px] font-black text-white/20 uppercase italic">Progreso Onboarding</span>
                                <span className="text-[9px] font-black text-[#00F0FF] italic">{Math.round((step / 5) * 100)}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[#00F0FF]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step / 5) * 100}%` }}
                                />
                            </div>
                        </div>
                    </CyberCard>

                    <GlassPanel className="p-8 text-center border-white/5 opacity-40">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic leading-relaxed">SISTEMA BASADO EN <br/> MATRIX SHOPIFY // ATOMIC CORE</p>
                    </GlassPanel>
                </div>
            </div>
        </div>
    )
}
