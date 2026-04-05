"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    MessageSquare, User, Search, Filter, Send, Clock, UserPlus, 
    Info, ExternalLink, CheckCheck, ShieldCheck, Target, 
    ArrowRight, MessageCircle, MoreVertical, Paperclip, Smile
} from "lucide-react"

export default function WhatsAppInbox() {
    const [conversations, setConversations] = useState<any[]>([])
    const [selectedChat, setSelectedChat] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        fetchConversations()
        const interval = setInterval(fetchConversations, 10000) // Polling fallback
        return () => clearInterval(interval)
    }, [])

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/whatsapp/conversations")
            if (res.ok) {
                const data = await res.json()
                setConversations(data)
                setLoading(false)
            }
        } catch (err) {
            console.error("Fetch Error:", err)
        }
    }

    const selectChat = (chat: any) => {
        setSelectedChat(chat)
        setMessages(chat.messages || [])
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim() || !selectedChat) return

        try {
            const res = await fetch("/api/whatsapp/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: selectedChat.id,
                    text: inputValue
                })
            })
            if (res.ok) {
                const newMsg = await res.json()
                setMessages([...messages, newMsg])
                setInputValue("")
                fetchConversations()
            }
        } catch (err) {
            console.error("Send Error:", err)
        }
    }

    const handleSelfAssign = async () => {
        if (!selectedChat) return
        try {
            const res = await fetch("/api/whatsapp/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: selectedChat.id,
                    action: "SELF_ASSIGN"
                })
            })
            if (res.ok) fetchConversations()
        } catch (err) {
            console.error("Assign Error:", err)
        }
    }

    return (
        <div className="flex h-[calc(100vh-14rem)] glass-panel border-white/10 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] overflow-hidden rounded-[4rem] relative z-10 backdrop-blur-[40px] animate-in fade-in duration-1000 ring-1 ring-white/5">
            {/* Sidebar Inbox - Redefined */}
            <div className="w-[420px] border-r border-white/10 flex flex-col bg-slate-950/60 relative">
                <div className="p-12 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary flex items-center italic">
                            <MessageSquare className="mr-5 drop-shadow-[0_0_12px_rgba(255,99,71,0.6)]" size={20} />
                            BANDEJA CENTRAL v4
                        </h2>
                        <button className="text-slate-700 hover:text-white hover:rotate-90 transition-all duration-500">
                            <Filter size={20} />
                        </button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary group-hover:scale-110 transition-all font-black" size={18} />
                        <input
                            type="text"
                            placeholder="ESCANEAR CONVERSACIONES..."
                            className="w-full pl-16 pr-8 py-6 bg-slate-900 border border-white/5 text-white text-[11px] font-black uppercase tracking-widest focus:border-secondary transition-all outline-none rounded-2xl placeholder:text-slate-800 italic"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar-hidden p-4 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-5 opacity-20">
                            <div className="w-10 h-10 border-4 border-azure-500/20 border-t-azure-500 rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Sincronizando Nodo...</p>
                        </div>
                    ) : conversations.map((chat: any) => (
                        <div 
                            key={chat.id}
                            onClick={() => selectChat(chat)}
                            className={`p-10 border border-transparent cursor-pointer transition-all hover:bg-white/[0.04] group relative rounded-3xl ${selectedChat?.id === chat.id ? 'bg-white/[0.06] border-white/5 shadow-inner' : ''}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center font-black text-xl group-hover:border-secondary/30 transition-all shadow-2xl relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative z-10">{(chat.contact?.name?.[0] || chat.customerName?.[0] || 'U').toUpperCase()}</span>
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-black text-white uppercase tracking-tighter italic group-hover:text-secondary transition-colors truncate pr-4">{chat.contact?.name || chat.customerName || 'NODO DESCONOCIDO'}</p>
                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] text-slate-500 uppercase tracking-widest truncate max-w-[180px] italic group-hover:text-slate-300 transition-colors">
                                            {chat.owner ? `[ASIGNADO: ${chat.owner.name}]` : "SIN ASIGNACIÓN TÁCTICA"}
                                        </p>
                                        <div className={`px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest italic ${
                                            chat.status === 'ACTIVE' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-slate-600 border-white/10 bg-white/5'
                                        }`}>
                                            {chat.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {selectedChat?.id === chat.id && <div className="absolute left-2 top-10 bottom-10 w-1.5 bg-secondary rounded-full shadow-[0_0_12px_rgba(255,99,71,0.6)]" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View - Redefined */}
            <div className="flex-1 flex flex-col bg-slate-950/20 relative">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-32 p-12 border-b border-white/10 flex items-center justify-between bg-white/[0.03] shrink-0 relative z-20 backdrop-blur-xl">
                            <div className="flex items-center gap-10">
                                <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-2xl relative">
                                    <div className="absolute top-[-4px] right-[-4px] w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse" />
                                    {selectedChat.contact?.name?.[0] || selectedChat.customerName?.[0]}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{selectedChat.contact?.name || selectedChat.customerName}</h3>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-[10px] font-black text-secondary tracking-[0.4em] uppercase italic bg-secondary/10 px-4 py-1.5 rounded-xl border border-secondary/20 shadow-inner">WA_NODE_ACTIVE</span>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">+{selectedChat.contact?.whatsappId || selectedChat.customerPhone}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                {!selectedChat.ownerId && (
                                    <button
                                        onClick={handleSelfAssign}
                                        className="px-10 py-4 bg-secondary/80 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.05] hover:bg-secondary hover:text-white transition-all shadow-[0_30px_70px_-15px_rgba(255,99,71,0.6)] rounded-[1.5rem] active:scale-95 italic skew-x-[-15deg] group border border-white/10"
                                    >
                                        <span className="relative z-10 flex items-center gap-4">
                                            <Target size={18} className="group-hover:rotate-45 transition-transform" />
                                            AUTO_ASIGNACIÓN
                                        </span>
                                    </button>
                                )}
                                <button className="p-5 bg-slate-900/80 border border-white/10 text-slate-500 hover:text-white rounded-[1.2rem] shadow-2xl transition-all">
                                    <MoreVertical size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-16 space-y-12 bg-white/[0.01] custom-scrollbar-hidden scroll-smooth relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 blur-[150px] pointer-events-none" />
                            
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id || idx}
                                    className={`flex w-full ${msg.direction === 'OUTBOUND' || msg.fromMe ? 'justify-end' : 'justify-start'} relative z-10`}
                                >
                                    <div className={`max-w-[70%] p-10 rounded-[2.5rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] border relative ${
                                        msg.direction === 'OUTBOUND' || msg.fromMe 
                                        ? 'bg-secondary text-white border-white/10 rounded-tr-none italic' 
                                        : 'bg-slate-900 text-slate-200 border-white/5 rounded-tl-none font-bold'
                                    }`}>
                                        <p className="text-[13px] leading-relaxed tracking-wide px-4 font-black uppercase italic">{msg.body || msg.text}</p>
                                        <div className={`mt-6 px-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest ${msg.direction === 'OUTBOUND' || msg.fromMe ? 'text-white/60' : 'text-slate-500'}`}>
                                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {(msg.direction === 'OUTBOUND' || msg.fromMe) && <CheckCheck size={14} className={msg.status === 'READ' ? 'text-azure-400' : 'text-white/40'} />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-12 border-t border-white/10 bg-white/[0.03] shrink-0 backdrop-blur-2xl">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-8 glass-panel !bg-slate-950/60 p-4 border-white/10 rounded-[3.5rem] ring-1 ring-white/10 shadow-3xl">
                                <button type="button" className="p-6 text-slate-600 hover:text-secondary hover:bg-white/5 transition-all rounded-full group">
                                    <Paperclip size={24} className="group-hover:rotate-45 transition-transform" />
                                </button>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="MODULO DE RESPUESTA OPERATIVA..."
                                    className="flex-1 bg-transparent border-none text-white text-[12px] font-black uppercase tracking-widest placeholder:text-slate-800 outline-none px-6 italic"
                                />
                                <button type="button" className="p-6 text-slate-600 hover:text-emerald-400 hover:bg-white/5 transition-all rounded-full">
                                    <Smile size={24} />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="w-20 h-20 bg-secondary/80 text-white flex items-center justify-center hover:scale-110 hover:bg-secondary hover:text-white transition-all shadow-[0_30px_60px_-15px_rgba(255,99,71,0.6)] rounded-[2.5rem] disabled:opacity-10 active:scale-95 group italic ring-1 ring-white/20"
                                >
                                    <Send size={28} className="group-hover:rotate-12 group-active:-translate-y-4 group-active:translate-x-4 transition-all" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-10 group">
                        <div className="p-16 glass-panel !bg-slate-900 border-white/10 rounded-[5rem] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] ring-1 ring-white/5">
                            <MessageCircle size={100} className="text-secondary drop-shadow-[0_0_30px_rgba(255,99,71,0.5)]" />
                        </div>
                        <div className="text-center space-y-4">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white italic">Protocolo de Enlace Inactivo</h3>
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] italic">Seleccione un nodo encriptado para iniciar auditoría</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Side Detail Panel */}
            <div className="w-[380px] border-l border-white/10 bg-slate-950/60 p-12 hidden 2xl:flex flex-col relative z-20">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.6em] mb-12 italic border-b border-white/10 pb-8 flex items-center gap-6">
                    <Info size={20} className="text-secondary shadow-[0_0_10px_currentColor]" /> DETALLES DEL NODO
                </h3>
                {selectedChat ? (
                    <div className="space-y-16 animate-in slide-in-from-right duration-700">
                        <div className="p-10 glass-panel !bg-secondary/5 border border-secondary/20 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                <ShieldCheck size={100} />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] mb-6 italic leading-none">STATUS DEL CANAL</p>
                            <p className="text-3xl font-black text-white uppercase tracking-tighter italic drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{selectedChat.status || 'READY'}</p>
                        </div>
                        
                        <div className="space-y-8">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.8em] mb-8 italic">ETIQUETAS_AUDIT</p>
                            <div className="flex flex-wrap gap-5">
                                <span className="px-6 py-3 bg-slate-900/60 border border-white/10 text-[10px] font-black text-slate-500 uppercase rounded-2xl italic shadow-inner hover:text-white hover:border-secondary/30 transition-all cursor-crosshair">#WHATSAPP_BUSINESS</span>
                                <span className="px-6 py-3 bg-slate-900/60 border border-white/10 text-[10px] font-black text-slate-500 uppercase rounded-2xl italic shadow-inner hover:text-white hover:border-azure-400/30 transition-all cursor-crosshair">#PRIORITY_A</span>
                            </div>
                        </div>

                        <div className="space-y-8 pt-12 border-t border-white/10">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.8em] mb-8 italic">AUDITORÍA VISITAS</p>
                            <div className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] italic border-l-4 border-secondary/40 pl-8 py-6 bg-slate-900/40 rounded-r-3xl ring-1 ring-white/5">
                                <span className="text-secondary/60">SYSTEM:</span> SIN REGISTROS DE NAVEGACIÓN RECIENTE DETECTADOS POR IA
                            </div>
                        </div>

                        <button className="w-full mt-12 py-7 bg-slate-900 border border-white/10 text-slate-500 hover:text-azure-400 transition-all rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] italic flex items-center justify-center gap-6 shadow-3xl group active:scale-95">
                            <ExternalLink size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                            <span>VER PERFIL CORPORATIVO</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-800 uppercase text-[10px] font-black tracking-[1em] italic animate-pulse">
                        <div className="w-1 h-32 bg-slate-900/60 rounded-full mb-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
                        NODATA
                    </div>
                )}
            </div>
        </div>
    )
}
