"use client"

import { useState, useEffect, useCallback } from "react"
import { 
    MessageSquare, Send, Search, User, Phone, CheckCheck, 
    Sparkles, Plus, ExternalLink, ShieldCheck, Tag, RefreshCw, ChevronLeft,
    Settings, Image as ImageIcon, ShoppingBag, Download, Check, Save, X, Globe, Mail, MapPin
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

    // WhatsApp Profile & Catalog Modal State
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [profileSaving, setProfileSaving] = useState(false)
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    
    const [profileData, setProfileData] = useState({
        about: 'Tecnología, Industria y Hogar',
        description: 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
        email: 'ventas@atomic.com.ec',
        websites: 'https://atomiccotizador.shop/web',
        address: 'Quito, Ecuador',
        profile_picture_url: ''
    })

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
                    if (formattedChats.length > 0 && !activeChatId && window.innerWidth >= 768) {
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

    const fetchWhatsAppProfile = async () => {
        try {
            const res = await fetch('/api/whatsapp/profile')
            if (res.ok) {
                const data = await res.json()
                if (data.profile) {
                    setProfileData({
                        about: data.profile.about || 'Tecnología, Industria y Hogar',
                        description: data.profile.description || 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
                        email: data.profile.email || 'ventas@atomic.com.ec',
                        websites: Array.isArray(data.profile.websites) ? data.profile.websites.join(', ') : (data.profile.websites || 'https://atomiccotizador.shop/web'),
                        address: data.profile.address || 'Quito, Ecuador',
                        profile_picture_url: data.profile.profile_picture_url || ''
                    })
                }
            }
        } catch (e) {
            console.error('Error fetching profile:', e)
        }
    }

    useEffect(() => {
        fetchConversations()
        fetchWhatsAppProfile()
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

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileSaving(true)
        setProfileMessage(null)

        try {
            const res = await fetch('/api/whatsapp/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    about: profileData.about,
                    description: profileData.description,
                    email: profileData.email,
                    websites: profileData.websites.split(',').map(s => s.trim()),
                    address: profileData.address,
                    profile_picture_url: profileData.profile_picture_url
                })
            })

            const data = await res.json()
            if (res.ok) {
                setProfileMessage({ type: 'success', text: '¡Perfil de WhatsApp actualizado exitosamente en Meta!' })
            } else {
                setProfileMessage({ type: 'error', text: data.error || 'Error al actualizar perfil' })
            }
        } catch (err: any) {
            setProfileMessage({ type: 'error', text: err.message || 'Error de conexión' })
        } finally {
            setProfileSaving(false)
        }
    }

    const filteredChats = chats.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery)
    )

    return (
        <div className="w-full h-[calc(100vh-4rem)] bg-[#050505] text-white flex flex-col font-sans">
            
            {/* Header */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <div>
                        <h1 className="text-base md:text-xl font-black text-white flex items-center gap-2 tracking-tight">
                            WhatsApp CRM <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">CONECTADO</span>
                        </h1>
                        <p className="text-[11px] md:text-xs text-slate-300 hidden sm:block font-medium">Gestión unificada de clientes y mensajería multicanal en vivo</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-cyan-300 transition-all text-xs flex items-center gap-1.5 font-bold shadow-sm"
                    >
                        <Settings size={14} /> <span>Perfil & Catálogo</span>
                    </button>

                    <button
                        onClick={fetchConversations}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 font-mono"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Actualizar</span>
                    </button>

                    {activeChat && (
                        <a
                            href={`https://wa.me/${activeChat.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 md:px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            <ExternalLink size={14} /> <span className="hidden md:inline">Abrir en WhatsApp Web</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Split Screen / Mobile View Chat Interface */}
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Left Sidebar: Chat List */}
                <div className={`w-full md:w-80 lg:w-96 border-r border-slate-800 bg-slate-900/90 flex-col shrink-0 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                    
                    {/* Search Bar */}
                    <div className="p-3 md:p-4 border-b border-slate-800 bg-slate-950">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por cliente o teléfono..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Chat List Items */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                        {loading && chats.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-xs font-mono">Cargando conversaciones...</div>
                        ) : filteredChats.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-xs">No hay conversaciones registradas.</div>
                        ) : (
                            filteredChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => setActiveChatId(chat.id)}
                                    className={`w-full p-3.5 text-left transition-all flex items-start gap-3 hover:bg-slate-800/50 ${activeChatId === chat.id ? 'bg-slate-800/80 border-l-4 border-emerald-500' : ''}`}
                                >
                                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0 text-sm">
                                        {chat.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-xs text-white truncate">{chat.name}</h3>
                                            <span className="text-[10px] font-mono text-slate-500 shrink-0">{chat.time}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 truncate">{chat.lastMessage}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                </div>

                {/* Right Main Chat Area */}
                <div className={`flex-1 flex-col bg-[#080c14] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
                    
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3.5 md:p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setActiveChatId('')} 
                                        className="md:hidden p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center text-xs">
                                        {activeChat.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-sm text-white">{activeChat.name}</h2>
                                        <p className="text-[10px] font-mono text-slate-400">{activeChat.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                {activeChat.messages.length === 0 ? (
                                    <div className="text-center text-slate-500 text-xs py-10">No hay mensajes en este chat.</div>
                                ) : (
                                    activeChat.messages.map(msg => (
                                        <div 
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                                                msg.sender === 'me'
                                                    ? 'bg-emerald-600 text-white rounded-br-none'
                                                    : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none'
                                            }`}>
                                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                <span className={`text-[9px] font-mono block mt-1 text-right ${msg.sender === 'me' ? 'text-emerald-200' : 'text-slate-400'}`}>
                                                    {msg.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Chat Input Bar */}
                            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Escribe tu mensaje a través de WhatsApp API..."
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputText.trim()}
                                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all shadow-md"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs p-6 text-center">
                            <MessageSquare size={36} className="text-slate-700 mb-2 animate-bounce" />
                            <p className="font-bold text-slate-400">Selecciona una conversación para chatear</p>
                            <p className="text-[11px] text-slate-600 mt-1">Los mensajes enviados se despachan directamente por la API de Meta</p>
                        </div>
                    )}

                </div>

            </div>

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* ⚙️ MODAL: PERFIL & CATÁLOGO DE WHATSAPP BUSINESS               */}
            {/* ═════════════════════════════════════════════════════════════ */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
                    <div 
                        onClick={() => setIsProfileModalOpen(false)} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <div className="relative z-10 w-full max-w-xl bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto space-y-5">
                        
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <Settings size={18} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm md:text-base text-white uppercase">Perfil & Catálogo WhatsApp Business</h3>
                                    <p className="text-[10px] text-slate-400">Configuración directa con la API oficial de Meta Cloud</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {profileMessage && (
                            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                profileMessage.type === 'success' 
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                                    : 'bg-red-950/80 text-red-300 border border-red-500/30'
                            }`}>
                                {profileMessage.type === 'success' ? <Check size={16} /> : <X size={16} />}
                                <span>{profileMessage.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                            
                            {/* SECTION 1: PERFIL DE EMPRESA */}
                            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-tight flex items-center gap-1.5">
                                    <User size={14} /> Información de Perfil de Empresa
                                </h4>

                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Estado / Eslogan Corto:</label>
                                    <input 
                                        type="text"
                                        value={profileData.about}
                                        onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                                        placeholder="Tecnología, Industria y Hogar"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Descripción Completa de la Empresa:</label>
                                    <textarea 
                                        rows={2}
                                        value={profileData.description}
                                        onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                        placeholder="Importación y Comercialización de Equipos Tecnológicos..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">Correo de Ventas:</label>
                                        <input 
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            placeholder="ventas@atomic.com.ec"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">Sitio Web Oficial:</label>
                                        <input 
                                            type="text"
                                            value={profileData.websites}
                                            onChange={(e) => setProfileData({ ...profileData, websites: e.target.value })}
                                            placeholder="https://atomiccotizador.shop/web"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Dirección Física:</label>
                                    <input 
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        placeholder="Quito, Ecuador"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={profileSaving}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                                    >
                                        <Save size={14} /> {profileSaving ? 'Guardando en Meta API...' : 'Guardar Perfil en WhatsApp API'}
                                    </button>
                                </div>

                            </div>

                            {/* SECTION 2: CATÁLOGO DE PRODUCTOS META */}
                            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-xs text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                                    <ShoppingBag size={14} /> Sincronización de Catálogo para WhatsApp
                                </h4>

                                <p className="text-[11px] text-slate-400 leading-snug">
                                    Genera el archivo estándar de catálogo (**Meta Commerce Feed CSV**) con tus 9,676+ productos activos para cargarlo con 1 clic en **Meta Commerce Manager -> Catalog**.
                                </p>

                                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                                    <a
                                        href="/api/whatsapp/catalog?format=csv"
                                        download="whatsapp-catalog-meta-feed.csv"
                                        className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-center shadow-md"
                                    >
                                        <Download size={14} /> Descargar Feed de Catálogo (CSV Meta)
                                    </a>

                                    <a
                                        href="https://business.facebook.com/commerce_manager"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                                    >
                                        <ExternalLink size={14} /> Abrir Meta Commerce Manager
                                    </a>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    )
}
