"use client"

import { useState, useEffect, useCallback } from "react"
import { 
    MessageSquare, Send, Search, User, Phone, CheckCheck, 
    Sparkles, Plus, ExternalLink, ShieldCheck, Tag, RefreshCw
} from "lucide-react"

interface Chat {
    id: string
    name: string
    phone: string
    lastMessage: string
    time: string
    unread: number
    status: "LEAD" | "COTIZANDO" | "CLIENTE" | string
    messages: { id: string; text: string; sender: "me" | "them"; time: string }[]
}

export default function WhatsAppCrmClient() {
    const [chats, setChats] = useState<Chat[]>([])
    const [activeChatId, setActiveChatId] = useState<string>("")
    const [inputText, setInputText] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch('/api/whatsapp/conversations')
            if (res.ok) {
                const data = await res.json()
                if (Array.isArray(data)) {
                    const formattedChats: Chat[] = data.map((conv: any) => {
                        const lastMsg = conv.messages?.[0]
                        return {
                            id: conv.id,
                            name: conv.contact?.name || conv.contact?.whatsappId || 'Cliente WhatsApp',
                            phone: conv.contact?.whatsappId || '',
                            lastMessage: lastMsg?.body || 'Sin mensajes',
                            time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                            unread: 0,
                            status: conv.status || 'NEW',
                            messages: conv.messages ? conv.messages.map((m: any) => ({
                                id: m.id,
                                text: m.body || '',
                                sender: m.direction === 'OUTBOUND' ? 'me' : 'them',
                                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            })).reverse() : []
                        }
                    })
                    setChats(formattedChats)
                    if (formattedChats.length > 0 && !activeChatId) {
                        setActiveChatId(formattedChats[0].id)
                    }
                }
            }
        } catch (e) {
            console.error('Error fetching conversations:', e)
        } finally {
            setLoading(false)
        }
    }, [activeChatId])

    useEffect(() => {
        fetchConversations()
        const interval = setInterval(fetchConversations, 4000)
        return () => clearInterval(interval)
    }, [fetchConversations])

    const activeChat = chats.find(c => c.id === activeChatId) || null

    const handleSendMessage = async () => {
        if (!inputText.trim() || !activeChat) return
        const text = inputText
        setInputText("")

        try {
            const res = await fetch('/api/whatsapp/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId: activeChat.id, text })
            })
            if (res.ok) {
                fetchConversations()
            }
        } catch (e) {
            console.error('Error sending message:', e)
        }
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
                            WhatsApp CRM Cloud Pro <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">CONECTADO</span>
                        </h1>
                        <p className="text-xs text-slate-300 font-medium">Gestión unificada de clientes y mensajería multicanal en vivo</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchConversations}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 font-mono"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
                    </button>
                    {activeChat && (
                        <a
                            href={`https://wa.me/${activeChat.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            <ExternalLink size={14} /> Abrir en WhatsApp Web
                        </a>
                    )}
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
                        {filteredChats.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-xs">
                                No se encontraron conversaciones activas.
                            </div>
                        ) : (
                            filteredChats.map(chat => (
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
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                {activeChat ? (
                    <div className="flex-1 flex flex-col bg-[#080c10]">
                        
                        {/* Active Chat Header */}
                        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                                    <User size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">{activeChat.name}</h3>
                                    <p className="text-xs text-slate-400 font-mono">{activeChat.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {activeChat.messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                                            msg.sender === "me"
                                                ? "bg-emerald-600 text-white rounded-br-none shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
                                                : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-[9px] text-slate-500 mt-1 font-mono px-1">{msg.time}</span>
                                </div>
                            ))}
                        </div>

                        {/* Input Footer */}
                        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
                            <input
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-mono"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#080c10]">
                        <MessageSquare className="w-16 h-16 text-slate-700 mb-4 animate-bounce" />
                        <h3 className="text-lg font-bold text-slate-300 mb-2">Sin conversaciones activas</h3>
                        <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
                            Los mensajes que envíen tus clientes a tu número de WhatsApp Business aparecerán aquí en vivo en tiempo real.
                        </p>
                        <div className="bg-slate-900 border border-slate-800 text-emerald-400 text-[11px] font-mono px-4 py-2 rounded-xl">
                            Estado: CONECTADO · Webhook escuchando en /api/whatsapp/webhook
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
