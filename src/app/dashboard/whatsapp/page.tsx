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
        <div className="flex h-[calc(100vh-14rem)] glass-panel border-white/5 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-[3.5rem] relative z-10 backdrop-blur-3xl animate-in fade-in duration-1000">
            {/* Sidebar Inbox */}
            <div className="w-[380px] border-r border-white/5 flex flex-col bg-slate-950/40 relative">
                <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary flex items-center italic">
                            <MessageSquare className="mr-3 drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" size={18} />
                            Bandeja Central
                        </h2>
                        <button className="text-slate-700 hover:text-white transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="FILTRAR CANALES..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-900 border border-white/5 text-[11px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all placeholder:text-slate-800 rounded-2xl shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => selectChat(chat)}
                            className={`p-8 border-b border-white/[0.02] cursor-pointer transition-all hover:bg-white/[0.03] group relative ${selectedChat?.id === chat.id ? 'bg-white/[0.05] border-l-4 border-l-secondary shadow-inner' : ''}`}
                        >
                            {selectedChat?.id === chat.id && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,99,71,1)] animate-pulse" />}
                            
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[12px] font-black text-white uppercase tracking-tighter truncate w-44 italic group-hover:text-secondary transition-colors">
                                    {chat.contact.name || chat.contact.whatsappId}
                                </span>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                    chat.status === 'ACTIVE' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-slate-600 border-white/5 bg-white/5'
                                }`}>
                                    {chat.status}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate font-black uppercase tracking-tight italic opacity-60">
                                {chat.messages?.[0]?.body || "SIN ACTIVIDAD RECIENTE"}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                {chat.owner ? (
                                    <div className="flex items-center text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
                                        <User size={10} className="mr-2 text-azure-400" /> {chat.owner.name}
                                    </div>
                                ) : (
                                    <div className="text-[8px] font-black text-secondary uppercase bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20 shadow-2xl animate-pulse italic">
                                        DESVINCULADO
                                    </div>
                                )}
                                <span className="text-[8px] font-black text-slate-700 tracking-widest uppercase italic">
                                    {chat.messages?.[0] ? new Date(chat.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                </span>
                            </div>
                        </div>
                    ))}
                    {conversations.length === 0 && !loading && (
                        <div className="p-20 text-center text-slate-800 flex flex-col items-center">
                            <MessageCircle size={40} className="mb-6 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Vacio: Nodo de comunicación inactivo</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col bg-slate-950/20 relative">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-24 px-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01] shrink-0 relative z-20">
                            <div className="flex items-center space-x-6">
                                <div className="w-14 h-14 bg-slate-900 border border-white/10 text-white flex items-center justify-center font-black text-xl shadow-2xl rounded-2xl italic group hover:scale-105 transition-transform">
                                    {selectedChat.contact.name?.[0] || "#"}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tighter italic leading-none mb-1">
                                        {selectedChat.contact.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                        <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase italic">
                                            +{selectedChat.contact.whatsappId} <span className="mx-2 text-slate-800">|</span> <span className="text-secondary opacity-60">EN_LÍNEA</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {!selectedChat.ownerId && (
                                    <button
                                        onClick={handleSelfAssign}
                                        className="px-8 py-3 bg-secondary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-secondary transition-all shadow-2xl shadow-secondary/30 rounded-xl active:scale-95 italic skew-x-[-12deg]"
                                    >
                                        <div className="skew-x-[12deg]">Autoasignarme</div>
                                    </button>
                                )}
                                <button className="p-4 glass-panel !bg-slate-900 text-slate-600 hover:text-white transition-all rounded-xl border-white/5 shadow-2xl">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-10 overflow-y-auto space-y-10 bg-slate-950/40 custom-scrollbar relative">
                            {/* Inner Orb Overlay for Depth */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/5 blur-[120px] pointer-events-none" />
                            
                            <div className="flex flex-col items-center mb-16 relative z-10">
                                <div className="px-10 py-2.5 glass-panel !bg-slate-900/60 border-white/5 text-[9px] font-black text-slate-600 uppercase tracking-[0.6em] rounded-full shadow-2xl italic">
                                    INICIO DEL PROTOCOLO DE CONVERSACIÓN
                                </div>
                            </div>

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'} relative z-10`}
                                >
                                    <div className={`max-w-[65%] p-8 rounded-[2.5rem] border shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${msg.direction === 'OUTBOUND' ? 'bg-[#ff6347]/10 text-white border-[#ff6347]/20 rounded-tr-none' : 'bg-slate-900/60 text-slate-100 border-white/5 rounded-tl-none backdrop-blur-xl'}`}>
                                        <p className="text-[13px] font-black leading-relaxed tracking-tight italic uppercase">{msg.body}</p>
                                        <div className={`mt-6 flex items-center justify-end gap-3 ${msg.direction === 'OUTBOUND' ? 'text-secondary/50' : 'text-slate-700'}`}>
                                            <span className="text-[9px] font-black uppercase tracking-widest italic">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.direction === 'OUTBOUND' && <CheckCheck size={14} className={msg.status === 'READ' ? 'text-azure-400' : ''} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-10 border-t border-white/5 bg-slate-950/60 shrink-0 relative z-20 backdrop-blur-3xl">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-6">
                                <button type="button" className="p-5 glass-panel !bg-slate-900 text-slate-700 hover:text-secondary transition-all rounded-2xl border-white/5 shadow-2xl">
                                    <Paperclip size={24} />
                                </button>
                                <div className="relative flex-1 group">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="INICIAR TRANSMISIÓN..."
                                        className="w-full px-10 py-6 bg-slate-900 border border-white/5 text-[12px] font-black uppercase tracking-widest focus:border-secondary outline-none transition-all placeholder:text-slate-800 rounded-[2.5rem] shadow-inner text-white italic"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                        <Smile className="text-slate-800 hover:text-white cursor-pointer transition-colors" size={24} />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!selectedChat.ownerId}
                                    className="w-16 h-16 bg-secondary text-white flex items-center justify-center hover:bg-white hover:text-secondary transition-all shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] rounded-2xl disabled:opacity-10 active:scale-95 group italic"
                                >
                                    <Send size={28} className="group-hover:translate-x-1 group-hover:rotate-6 transition-transform" />
                                </button>
                            </form>
                            {!selectedChat.ownerId && (
                                <p className="mt-8 text-[9px] font-black text-secondary uppercase text-center tracking-[0.5em] animate-pulse italic">
                                    ERROR: DEBE VINCULAR EL NODO PARA HABILITAR LA RESPUESTA
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-slate-950/40 relative overflow-hidden">
                         {/* Large Background Icon */}
                        <MessageSquare className="absolute opacity-[0.02] text-white pointer-events-none" size={600} />
                        
                        <div className="w-24 h-24 bg-slate-900/60 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/5 shadow-inner">
                            <MessageSquare className="text-slate-800" size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-6 italic">SELECCIONAR CANAL</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] max-w-sm leading-loose italic">
                            Consola centralizada para la gestión estratégica de comunicaciones vía WhatsApp Business.
                        </p>
                        <div className="mt-16 flex items-center gap-4 text-slate-700 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                        </div>
                    </div>
                )}
            </div>

            {/* Side Detail Panel (Optional/Place-holder) */}
            <div className="w-[320px] border-l border-white/5 bg-slate-950/60 p-10 hidden xl:block relative z-10 shadow-2xl">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] mb-12 italic border-b border-white/5 pb-6 flex items-center gap-4">
                    <Info size={16} className="text-secondary" /> DETALLES DEL NODO
                </h3>
                {selectedChat ? (
                    <div className="space-y-12 animate-in slide-in-from-right duration-700">
                        <div className="p-8 glass-panel !bg-secondary/10 border border-secondary/20 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck size={60} />
                            </div>
                            <p className="text-[9px] font-black text-secondary uppercase tracking-[0.5em] mb-4 italic leading-none">STATUS DEL CANAL</p>
                            <p className="text-xl font-black text-white uppercase tracking-tighter italic">{selectedChat.status}</p>
                        </div>
                        
                        <div className="space-y-6">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.6em] mb-6 italic">ETIQUETAS_REG</p>
                            <div className="flex flex-wrap gap-4">
                                <span className="px-5 py-2.5 bg-slate-900 border border-white/5 text-[10px] font-black text-slate-500 uppercase rounded-xl italic shadow-inner">#NODO_NUEVO</span>
                                <span className="px-5 py-2.5 bg-slate-900 border border-white/5 text-[10px] font-black text-slate-500 uppercase rounded-xl italic shadow-inner">#WHATSAPP</span>
                            </div>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-white/5">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.6em] mb-6 italic">AUDITORÍA VISITAS</p>
                            <div className="text-[10px] text-slate-800 font-black uppercase tracking-[0.4em] italic border-l-4 border-slate-900 pl-6 py-4 bg-slate-900/20 rounded-r-2xl">
                                SIN REGISTROS DE NAVEGACIÓN RECIENTE EN CATÁLOGO_ERP
                            </div>
                        </div>

                        <button className="w-full mt-10 py-5 bg-slate-900 text-slate-500 hover:text-azure-400 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all italic flex items-center justify-center gap-4 shadow-2xl group">
                            <ExternalLink size={16} />
                            <span>VER PERFIL COMPLETO</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 text-slate-900 uppercase text-[10px] font-black tracking-[0.6em] italic animate-pulse">
                        <div className="w-1.5 h-20 bg-slate-900 rounded-full mb-6" />
                        SIN SELECCIÓN
                    </div>
                )}
            </div>
        </div>
    )
}
