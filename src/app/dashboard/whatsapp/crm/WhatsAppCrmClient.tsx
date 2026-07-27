"use client"

import { useState } from "react"
import { 
    MessageSquare, Send, Search, User, Phone, CheckCheck, 
    Sparkles, Plus, ExternalLink, ShieldCheck, Tag
} from "lucide-react"

interface Chat {
    id: string
    name: string
    phone: string
    lastMessage: string
    time: string
    unread: number
    status: "LEAD" | "COTIZANDO" | "CLIENTE"
    messages: { id: string; text: string; sender: "me" | "them"; time: string }[]
}

export default function WhatsAppCrmClient() {
    const [chats, setChats] = useState<Chat[]>([])

    const [activeChatId, setActiveChatId] = useState<string>("")
    const [inputText, setInputText] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    const activeChat = chats.find(c => c.id === activeChatId) || null

    const handleSendMessage = () => {
        if (!inputText.trim() || !activeChat) return
        const newMsg = {
            id: `msg-${Date.now()}`,
            text: inputText,
            sender: "me" as const,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        
        setChats(prev => prev.map(c => {
            if (c.id === activeChat.id) {
                return {
                    ...c,
                    lastMessage: inputText,
                    time: newMsg.time,
                    messages: [...c.messages, newMsg]
                }
            }
            return c
        }))
        setInputText("")
    }

    const filteredChats = chats.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery)
    )

    return (
        <div className="w-full h-[calc(100vh-4rem)] bg-[#050505] text-white flex flex-col font-sans">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <div>
                        <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                            WhatsApp CRM Cloud Pro <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">SIN LOGIN</span>
                        </h1>
                        <p className="text-xs text-slate-300 font-medium">Gestión unificada de clientes y mensajería multicanal en vivo</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={`https://wa.me/${activeChat?.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                        <ExternalLink size={14} /> Abrir en WhatsApp Web
                    </a>
                </div>
            </div>

            {/* Split Screen Chat Interface */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Left Sidebar: Chat List */}
                <div className="w-80 lg:w-96 border-r border-slate-800 bg-slate-900/90 flex flex-col shrink-0">
                    
                    {/* Search Bar */}
                    <div className="p-4 border-b border-slate-800 bg-slate-950">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Buscar prospecto o teléfono..."
                                className="w-full bg-slate-900 border border-slate-800 p-2.5 pl-9 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-mono"
                            />
                        </div>
                    </div>

                    {/* Chats List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
                        {filteredChats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                                className={`w-full p-4 text-left flex items-start justify-between transition-all ${activeChatId === chat.id ? 'bg-emerald-950/40 border-l-4 border-emerald-400' : 'hover:bg-slate-800/40'}`}
                            >
                                <div className="space-y-1 min-w-0 pr-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-xs text-white truncate">{chat.name}</h4>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-mono">{chat.phone}</p>
                                    <p className="text-xs text-slate-300 truncate">{chat.lastMessage}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[10px] font-mono text-slate-400 block mb-1">{chat.time}</span>
                                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${chat.status === 'COTIZANDO' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : chat.status === 'CLIENTE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                                        {chat.status}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                </div>

                {/* Right Area: Chat Window */}
                <div className="flex-1 flex flex-col bg-[#050505] relative">
                    {!activeChat ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
                            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                                <MessageSquare size={36} className="text-slate-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-400">Sin conversaciones activas</h3>
                                <p className="text-xs text-slate-600 font-mono mt-1 max-w-xs">
                                    Conecta tu WhatsApp Business para ver los chats en tiempo real.<br />
                                    El módulo estará activo una vez configurada la API.
                                </p>
                            </div>
                            <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-500">
                                SIN LOGIN • WhatsApp API no conectada
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white">{activeChat.name}</h3>
                                        <p className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                                            <Phone size={12} /> {activeChat.phone}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                                        Estado: <strong className="text-cyan-300">{activeChat.status}</strong>
                                    </span>
                                </div>
                            </div>

                            {/* Messages Scroll View */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/40">
                                {activeChat.messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-md p-4 rounded-2xl text-xs space-y-1 ${msg.sender === 'me' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'}`}>
                                            <p className="leading-relaxed font-medium">{msg.text}</p>
                                            <p className="text-[9px] font-mono text-right opacity-70">{msg.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input Box */}
                            <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3 items-center">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                                    placeholder="Escribe una respuesta para WhatsApp..."
                                    className="flex-1 bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-sans"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-2xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>

        </div>
    )
}
