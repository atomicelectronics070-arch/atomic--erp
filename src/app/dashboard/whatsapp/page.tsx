"use client"

import { useState, useEffect } from "react"
import { MessageSquare, User, Search, Filter, Send, Clock, UserPlus, Info, ExternalLink, CheckCheck } from "lucide-react"

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
            const data = await res.json()
            setConversations(data)
            setLoading(false)
        } catch (err) {
            console.error("Fetch Error:", err)
        }
    }

    const selectChat = (chat: any) => {
        setSelectedChat(chat)
        // In a real app, fetch detailed messages here
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
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-neutral-100 shadow-sm overflow-hidden">
            {/* Sidebar Inbox */}
            <div className="w-80 border-r border-neutral-50 flex flex-col bg-neutral-50/20">
                <div className="p-4 border-b border-neutral-50 bg-white">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900 flex items-center mb-4">
                        <MessageSquare className="mr-2 text-orange-600" size={16} />
                        Bandeja de Entrada
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar chats..."
                            className="w-full pl-9 pr-4 py-2 bg-neutral-100 border-none text-[10px] font-bold focus:ring-1 focus:ring-orange-500 rounded-none outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => selectChat(chat)}
                            className={`p-4 border-b border-neutral-50 cursor-pointer transition-all hover:bg-white ${selectedChat?.id === chat.id ? 'bg-white border-l-4 border-l-orange-600 shadow-sm' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-tight truncate w-32">
                                    {chat.contact.name || chat.contact.whatsappId}
                                </span>
                                <span className="text-[8px] font-bold text-neutral-400">
                                    {chat.status}
                                </span>
                            </div>
                            <p className="text-[10px] text-neutral-400 truncate font-medium">
                                {chat.messages?.[0]?.body || "Sin mensajes"}
                            </p>
                            <div className="mt-2 flex items-center space-x-2">
                                {chat.owner ? (
                                    <div className="flex items-center text-[8px] font-bold text-neutral-500 uppercase bg-neutral-100 px-1.5 py-0.5">
                                        <User size={8} className="mr-1" /> {chat.owner.name}
                                    </div>
                                ) : (
                                    <div className="text-[8px] font-bold text-orange-600 uppercase bg-orange-50 px-1.5 py-0.5">
                                        Sin asignar
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-6 border-b border-neutral-50 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                                    {selectedChat.contact.name?.[0] || "#"}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                                        {selectedChat.contact.name}
                                    </h3>
                                    <p className="text-[9px] font-bold text-neutral-400 tracking-widest">
                                        +{selectedChat.contact.whatsappId}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {!selectedChat.ownerId && (
                                    <button
                                        onClick={handleSelfAssign}
                                        className="px-3 py-1.5 bg-orange-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all"
                                    >
                                        Autoasignarme
                                    </button>
                                )}
                                <button className="p-2 text-neutral-300 hover:text-neutral-600 transition-colors">
                                    <Info size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#fcfcfc]">
                            <div className="flex flex-col items-center mb-8">
                                <div className="px-3 py-1 bg-neutral-100 text-[8px] font-bold text-neutral-400 uppercase tracking-[0.3em]">
                                    Inicio de Conversación
                                </div>
                            </div>

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-3 border ${msg.direction === 'OUTBOUND' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-800 border-neutral-100 shadow-sm'}`}>
                                        <p className="text-[11px] font-medium leading-relaxed">{msg.body}</p>
                                        <div className={`mt-1.5 flex items-center justify-end space-x-1 ${msg.direction === 'OUTBOUND' ? 'text-neutral-500' : 'text-neutral-300'}`}>
                                            <span className="text-[8px] font-bold opacity-60">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.direction === 'OUTBOUND' && <CheckCheck size={10} className={msg.status === 'READ' ? 'text-blue-400' : ''} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-neutral-50 bg-white">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 px-4 py-3 bg-neutral-100 border-none text-[11px] font-medium focus:ring-1 focus:ring-orange-500 rounded-none outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!selectedChat.ownerId}
                                    className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-all disabled:opacity-30"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                            {!selectedChat.ownerId && (
                                <p className="mt-2 text-[8px] font-bold text-orange-600 uppercase text-center tracking-widest animate-pulse">
                                    Debes asignarte el chat para poder responder
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-white">
                        <div className="w-16 h-16 bg-neutral-50 flex items-center justify-center mb-6">
                            <MessageSquare className="text-neutral-200" size={32} />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-2">Selecciona un Chat</h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight max-w-[200px]">
                            Gestiona las comunicaciones de WhatsApp Business desde esta consola centralizada.
                        </p>
                    </div>
                )}
            </div>

            {/* Side Detail Panel (Optional/Place-holder) */}
            <div className="w-72 border-l border-neutral-50 bg-white p-6 hidden xl:block">
                <h3 className="text-[10px] font-bold text-neutral-900 uppercase tracking-[0.2em] mb-6">Detalles del Contacto</h3>
                {selectedChat ? (
                    <div className="space-y-6">
                        <div className="p-4 bg-orange-50 border border-orange-100">
                            <p className="text-[8px] font-bold text-orange-600 uppercase tracking-widest mb-1">Estado del Chat</p>
                            <p className="text-xs font-bold text-neutral-800 uppercase">{selectedChat.status}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Etiquetas</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-0.5 bg-neutral-100 text-[8px] font-bold text-neutral-600 uppercase">Sin Etiquetas</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Historial de Visitas</p>
                            <div className="text-[10px] text-neutral-300 font-bold uppercase italic border-l-2 border-neutral-100 pl-3">
                                No se registran visitas recientes al catálogo
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-neutral-200 uppercase text-[9px] font-bold tracking-widest">
                        Sin selección
                    </div>
                )}
            </div>
        </div>
    )
}
