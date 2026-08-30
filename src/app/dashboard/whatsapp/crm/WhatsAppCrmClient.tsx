"use client"

import { useState, useEffect, useCallback } from "react"
import { 
    MessageSquare, Send, Search, User, Phone, CheckCheck, 
    Sparkles, Plus, ExternalLink, ShieldCheck, Tag, RefreshCw, ChevronLeft,
    Settings, Image as ImageIcon, ShoppingBag, Download, Check, Save, X, Globe, Mail, MapPin,
    Volume2, Mic, Film, FileText, Megaphone, Eye, Key, AlertCircle, Copy
} from "lucide-react"

interface ReferralData {
    sourceUrl?: string
    sourceType?: string
    sourceId?: string
    headline?: string
    body?: string
    mediaType?: string
    imageUrl?: string
    videoUrl?: string
    thumbnailUrl?: string
    ctwaClid?: string
}

interface MessageItem {
    id: string
    text: string
    sender: "me" | "them"
    time: string
    type: string
    mediaUrl?: string | null
    referral?: ReferralData | null
    status?: string
}

interface Chat {
    id: string
    name: string
    phone: string
    lastMessage: string
    time: string
    unread: number
    status: string
    isFromAd?: boolean
    adHeadline?: string
    messages: MessageItem[]
}

function parseMessageBody(rawBody: string = '', rawMediaUrl?: string | null, rawType: string = 'text') {
    let cleanText = rawBody || '';
    let referral: ReferralData | null = null;

    if (cleanText.includes('[PAUTA_META:')) {
        const match = cleanText.match(/\[PAUTA_META:([\s\S]*?)\]\n?/);
        if (match && match[1]) {
            try {
                referral = JSON.parse(match[1]);
                cleanText = cleanText.replace(match[0], '').trim();
            } catch (e) {
                // Ignore JSON parse error
            }
        }
    }

    return { cleanText, referral, mediaUrl: rawMediaUrl, type: rawType };
}

export default function WhatsAppCrmClient() {
    const [chats, setChats] = useState<Chat[]>([])
    const [activeChatId, setActiveChatId] = useState<string>("")
    const [inputText, setInputText] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    // Image Zoom / Lightbox State
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

    // WhatsApp Settings & Profile Modal State
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'credentials' | 'manual'>('credentials')
    const [settingsSaving, setSettingsSaving] = useState(false)
    const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    
    // Credentials State
    const [credPhoneId, setCredPhoneId] = useState('')
    const [credToken, setCredToken] = useState('')
    const [credStatus, setCredStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE')
    const [credTestResult, setCredTestResult] = useState<string | null>(null)

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
                        const rawMessages = conv.messages || [];
                        let isFromAd = false;
                        let adHeadline = '';

                        const parsedMessages: MessageItem[] = rawMessages.map((m: any) => {
                            const { cleanText, referral, mediaUrl, type } = parseMessageBody(m.body, m.mediaUrl, m.type);
                            if (referral) {
                                isFromAd = true;
                                if (referral.headline) adHeadline = referral.headline;
                            }
                            return {
                                id: m.id,
                                text: cleanText,
                                sender: m.direction === 'OUTBOUND' ? 'me' : 'them',
                                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                type: type || 'text',
                                mediaUrl: mediaUrl,
                                referral: referral,
                                status: m.status
                            };
                        }).reverse();

                        const lastMsg = rawMessages[0];
                        const lastParsed = lastMsg ? parseMessageBody(lastMsg.body, lastMsg.mediaUrl, lastMsg.type) : null;
                        
                        let lastMessageDisplay = 'Sin mensajes';
                        if (lastParsed) {
                            if (lastParsed.type === 'image') lastMessageDisplay = '📷 Imagen' + (lastParsed.cleanText ? ': ' + lastParsed.cleanText : '');
                            else if (lastParsed.type === 'audio') lastMessageDisplay = '🎤 Nota de voz';
                            else if (lastParsed.type === 'video') lastMessageDisplay = '🎬 Video';
                            else if (lastParsed.type === 'document') lastMessageDisplay = '📄 Documento';
                            else lastMessageDisplay = lastParsed.cleanText || 'Mensaje';
                        }

                        return {
                            id: conv.id,
                            name: conv.contact?.name || conv.contact?.whatsappId || 'Cliente WhatsApp',
                            phone: conv.contact?.whatsappId || '',
                            lastMessage: lastMessageDisplay,
                            time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                            unread: 0,
                            status: conv.status || 'NEW',
                            isFromAd: isFromAd || conv.status === 'LEAD_PAUTA',
                            adHeadline: adHeadline,
                            messages: parsedMessages
                        };
                    });

                    setChats(formattedChats);
                    if (formattedChats.length > 0 && !activeChatId && window.innerWidth >= 768) {
                        setActiveChatId(formattedChats[0].id);
                    }
                }
            }
        } catch (e) {
            console.error('Error fetching conversations:', e);
        } finally {
            setLoading(false);
        }
    }, [activeChatId]);

    const fetchWhatsAppProfile = async () => {
        try {
            const res = await fetch('/api/whatsapp/profile');
            if (res.ok) {
                const data = await res.json();
                if (data.profile) {
                    setProfileData({
                        about: data.profile.about || 'Tecnología, Industria y Hogar',
                        description: data.profile.description || 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
                        email: data.profile.email || 'ventas@atomic.com.ec',
                        websites: Array.isArray(data.profile.websites) ? data.profile.websites.join(', ') : (data.profile.websites || 'https://atomiccotizador.shop/web'),
                        address: data.profile.address || 'Quito, Ecuador',
                        profile_picture_url: data.profile.profile_picture_url || ''
                    });
                }
            }
        } catch (e) {
            console.error('Error fetching profile:', e);
        }
    };

    const fetchCredentials = async () => {
        try {
            const res = await fetch('/api/whatsapp/config');
            if (res.ok) {
                const settings = await res.json();
                if (Array.isArray(settings)) {
                    const tokenObj = settings.find((s: any) => s.key === 'WHATSAPP_TOKEN');
                    const phoneIdObj = settings.find((s: any) => s.key === 'WHATSAPP_PHONE_NUMBER_ID');
                    if (tokenObj?.value) setCredToken(tokenObj.value);
                    if (phoneIdObj?.value) setCredPhoneId(phoneIdObj.value);
                }
            }
        } catch (e) {
            console.error('Error fetching credentials:', e);
        }
    };

    useEffect(() => {
        fetchConversations();
        fetchWhatsAppProfile();
        fetchCredentials();
        const interval = setInterval(fetchConversations, 3500);
        return () => clearInterval(interval);
    }, [fetchConversations]);

    const activeChat = chats.find(c => c.id === activeChatId) || null;

    const handleSendMessage = async () => {
        if (!inputText.trim() || !activeChat) return;
        const text = inputText;
        setInputText("");

        try {
            const res = await fetch('/api/whatsapp/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId: activeChat.id, text })
            });
            if (res.ok) {
                fetchConversations();
            } else {
                const errorData = await res.json();
                alert(`⚠️ Error de entrega de Meta WhatsApp API:\n\n${errorData.error || 'No se pudo despachar el mensaje. Verifica que el Token de WhatsApp esté activo.'}`);
            }
        } catch (e: any) {
            console.error('Error sending message:', e);
            alert(`⚠️ Error de red al enviar mensaje: ${e.message}`);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsSaving(true);
        setSettingsMessage(null);

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
            });

            const data = await res.json();
            if (res.ok) {
                setSettingsMessage({ type: 'success', text: '¡Perfil de WhatsApp actualizado exitosamente en Meta!' });
            } else {
                setSettingsMessage({ type: 'error', text: data.error || 'Error al actualizar perfil' });
            }
        } catch (err: any) {
            setSettingsMessage({ type: 'error', text: err.message || 'Error de conexión' });
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleSaveCredentials = async () => {
        setSettingsSaving(true);
        setSettingsMessage(null);
        try {
            if (credToken.trim()) {
                await fetch('/api/whatsapp/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'WHATSAPP_TOKEN', value: credToken.trim() })
                });
            }
            if (credPhoneId.trim()) {
                await fetch('/api/whatsapp/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'WHATSAPP_PHONE_NUMBER_ID', value: credPhoneId.trim() })
                });
            }
            setSettingsMessage({ type: 'success', text: '¡Token y Phone ID guardados correctamente en la base de datos!' });
        } catch (e: any) {
            setSettingsMessage({ type: 'error', text: e.message || 'Error guardando credenciales' });
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleTestConnection = async () => {
        setCredStatus('TESTING');
        setCredTestResult(null);
        try {
            const res = await fetch('/api/whatsapp-test');
            const data = await res.json();
            if (res.ok && data.success) {
                setCredStatus('SUCCESS');
                setCredTestResult('✅ Conexión exitosa con Meta Cloud API. El token y el número están activos.');
            } else {
                setCredStatus('ERROR');
                setCredTestResult(`❌ Error de validación Meta: ${data.error || 'Token inválido o expirado'}`);
            }
        } catch (e: any) {
            setCredStatus('ERROR');
            setCredTestResult(`❌ Error de red: ${e.message}`);
        }
    };

    const filteredChats = chats.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery) ||
        (c.adHeadline && c.adHeadline.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="w-full h-[calc(100vh-4rem)] bg-[#050505] text-white flex flex-col font-sans">
            
            {/* Header */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <div>
                        <h1 className="text-base md:text-xl font-black text-white flex items-center gap-2 tracking-tight">
                            WhatsApp CRM <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">EN VIVO</span>
                        </h1>
                        <p className="text-[11px] md:text-xs text-slate-300 hidden sm:block font-medium">Recepción de imágenes, audios, videos y atribución de Pautas Facebook Ads</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-cyan-300 transition-all text-xs flex items-center gap-1.5 font-bold shadow-sm cursor-pointer"
                    >
                        <Settings size={14} /> <span>Ajustes & Token</span>
                    </button>

                    <button
                        onClick={fetchConversations}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Actualizar</span>
                    </button>

                    {activeChat && (
                        <a
                            href={`https://wa.me/${activeChat.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 md:px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                            <ExternalLink size={14} /> <span className="hidden md:inline">Abrir en WhatsApp Web</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Main Chat Interface */}
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Left Sidebar: Chat List */}
                <div className={`w-full md:w-80 lg:w-96 border-r border-slate-800 bg-slate-900/90 flex flex-col shrink-0 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                    
                    {/* Search Bar */}
                    <div className="p-3 md:p-4 border-b border-slate-800 bg-slate-950">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por cliente, teléfono o pauta..."
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
                                    className={`w-full p-3.5 text-left transition-all flex items-start gap-3 hover:bg-slate-800/50 cursor-pointer ${activeChatId === chat.id ? 'bg-slate-800/80 border-l-4 border-emerald-500' : ''}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">
                                            {chat.name.charAt(0).toUpperCase()}
                                        </div>
                                        {chat.isFromAd && (
                                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 border border-slate-900 flex items-center justify-center text-[8px]" title="Lead de Pauta Facebook Ads">
                                                📢
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-xs text-white truncate">{chat.name}</h3>
                                            <span className="text-[10px] font-mono text-slate-400 shrink-0">{chat.time}</span>
                                        </div>

                                        {chat.isFromAd && (
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/40 truncate max-w-[200px]">
                                                    📢 {chat.adHeadline || 'Pauta FB Ads'}
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-[11px] text-slate-400 truncate">{chat.lastMessage}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Main Chat Area */}
                <div className={`flex-1 flex flex-col bg-[#080c14] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
                    
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3.5 md:p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setActiveChatId('')} 
                                        className="md:hidden p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center text-sm">
                                        {activeChat.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold text-sm text-white">{activeChat.name}</h2>
                                            {activeChat.isFromAd && (
                                                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Megaphone size={10} /> Lead de Anuncio
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-mono text-slate-400">{activeChat.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {activeChat.messages.length === 0 ? (
                                    <div className="text-center text-slate-500 text-xs py-10">No hay mensajes en este chat.</div>
                                ) : (
                                    activeChat.messages.map(msg => (
                                        <div 
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs space-y-2 ${
                                                msg.sender === 'me'
                                                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-950/40'
                                                    : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none shadow-md shadow-black/40'
                                            }`}>
                                                
                                                {/* 📢 PREVIEW CARD: ATRIBUCIÓN DE ANUNCIO FACEBOOK ADS (CLICK TO WHATSAPP) */}
                                                {msg.referral && (
                                                    <div className="p-3 bg-gradient-to-r from-blue-950/90 to-indigo-950/90 border-2 border-blue-500/50 rounded-xl space-y-2 text-white">
                                                        <div className="flex items-center justify-between border-b border-blue-500/30 pb-1.5">
                                                            <span className="flex items-center gap-1 text-[10px] font-black tracking-wider text-cyan-300 uppercase">
                                                                <Megaphone size={12} className="text-cyan-400" /> ANUNCIO DE ORIGEN · {msg.referral.sourceType === 'ad' ? 'FACEBOOK ADS' : 'POST META'}
                                                            </span>
                                                            {msg.referral.sourceId && (
                                                                <span className="text-[9px] font-mono text-blue-300 opacity-80">
                                                                    ID: {msg.referral.sourceId}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2.5 items-start">
                                                            {(msg.referral.thumbnailUrl || msg.referral.imageUrl) && (
                                                                <img 
                                                                    src={msg.referral.thumbnailUrl || msg.referral.imageUrl} 
                                                                    alt="Miniatura del Anuncio" 
                                                                    className="w-16 h-16 rounded-lg object-cover border border-blue-400/40 shrink-0 bg-slate-900"
                                                                />
                                                            )}
                                                            <div className="min-w-0 flex-1">
                                                                {msg.referral.headline && (
                                                                    <h4 className="font-black text-xs text-white leading-snug">
                                                                        {msg.referral.headline}
                                                                    </h4>
                                                                )}
                                                                {msg.referral.body && (
                                                                    <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5">
                                                                        {msg.referral.body}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {msg.referral.sourceUrl && (
                                                            <a 
                                                                href={msg.referral.sourceUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 hover:text-cyan-100 hover:underline pt-1"
                                                            >
                                                                <span>🔗 Ver Anuncio en Facebook</span> <ExternalLink size={10} />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 📷 IMAGEN ADJUNTA */}
                                                {msg.type === 'image' && msg.mediaUrl && (
                                                    <div className="space-y-1.5">
                                                        <div 
                                                            onClick={() => setPreviewImageUrl(msg.mediaUrl || null)}
                                                            className="relative rounded-xl overflow-hidden cursor-pointer group bg-black/40 border border-white/10"
                                                        >
                                                            <img 
                                                                src={msg.mediaUrl} 
                                                                alt="Imagen enviada por cliente" 
                                                                className="max-h-72 w-full object-contain group-hover:scale-102 transition-transform duration-300"
                                                                loading="lazy"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <span className="bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                                                                    <Eye size={12} /> Ver en grande
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 🎤 AUDIO / NOTA DE VOZ */}
                                                {msg.type === 'audio' && msg.mediaUrl && (
                                                    <div className="p-2.5 bg-black/40 border border-white/10 rounded-xl space-y-1.5">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                            <Mic size={14} />
                                                            <span>Nota de Voz / Audio de WhatsApp</span>
                                                        </div>
                                                        <audio 
                                                            controls 
                                                            src={msg.mediaUrl} 
                                                            className="w-full h-8 rounded-lg accent-emerald-500"
                                                            preload="metadata"
                                                        />
                                                    </div>
                                                )}

                                                {/* 🎬 VIDEO */}
                                                {msg.type === 'video' && msg.mediaUrl && (
                                                    <div className="space-y-1.5">
                                                        <video 
                                                            controls 
                                                            src={msg.mediaUrl} 
                                                            className="max-h-72 w-full rounded-xl border border-white/10 bg-black"
                                                            preload="metadata"
                                                        />
                                                    </div>
                                                )}

                                                {/* 📄 DOCUMENTO */}
                                                {msg.type === 'document' && msg.mediaUrl && (
                                                    <a 
                                                        href={msg.mediaUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-black/40 hover:bg-black/60 border border-white/15 rounded-xl flex items-center justify-between gap-3 transition-colors text-white"
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <FileText size={20} className="text-cyan-400 shrink-0" />
                                                            <div className="min-w-0">
                                                                <span className="font-bold text-xs truncate block">{msg.text || 'Documento adjunto'}</span>
                                                                <span className="text-[10px] text-slate-400">Clic para descargar / abrir</span>
                                                            </div>
                                                        </div>
                                                        <Download size={16} className="text-slate-400 shrink-0" />
                                                    </a>
                                                )}

                                                {/* TEXTO DEL MENSAJE (O CAPTION) */}
                                                {msg.text && msg.type !== 'document' && (
                                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                )}

                                                {/* TIMESTAMP & STATUS */}
                                                <div className={`text-[9px] font-mono flex items-center justify-end gap-1 ${msg.sender === 'me' ? 'text-emerald-200' : 'text-slate-400'}`}>
                                                    <span>{msg.time}</span>
                                                    {msg.sender === 'me' && <CheckCheck size={12} />}
                                                </div>

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
                                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all shadow-md cursor-pointer"
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
            {/* 🔍 MODAL: LIGHTBOX / ZOOM DE IMAGEN                           */}
            {/* ═════════════════════════════════════════════════════════════ */}
            {previewImageUrl && (
                <div 
                    onClick={() => setPreviewImageUrl(null)}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center">
                        <button
                            onClick={() => setPreviewImageUrl(null)}
                            className="absolute -top-10 right-0 text-white hover:text-rose-400 font-bold text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                            <X size={16} /> Cerrar vista previa
                        </button>
                        <img 
                            src={previewImageUrl} 
                            alt="Vista previa en alta resolución" 
                            className="max-h-[85vh] w-auto object-contain rounded-xl border border-white/20 shadow-2xl"
                        />
                        <a 
                            href={previewImageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
                        >
                            <Download size={14} /> Descargar Imagen Original
                        </a>
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* ⚙️ MODAL: AJUSTES, TOKEN & PERFIL DE WHATSAPP BUSINESS       */}
            {/* ═════════════════════════════════════════════════════════════ */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
                    <div 
                        onClick={() => setIsSettingsModalOpen(false)} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <div className="relative z-10 w-full max-w-2xl bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto space-y-4">
                        
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <Settings size={18} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm md:text-base text-white uppercase">Ajustes & Configuración WhatsApp Cloud API</h3>
                                    <p className="text-[10px] text-slate-400">Tokens de acceso, identificadores de Meta y perfil comercial</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSettingsModalOpen(false)}
                                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* TABS SELECTOR */}
                        <div className="flex border-b border-slate-800 gap-2">
                            <button
                                onClick={() => setActiveSettingsTab('profile')}
                                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                    activeSettingsTab === 'profile'
                                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                🏢 Perfil Comercial
                            </button>
                            <button
                                onClick={() => setActiveSettingsTab('credentials')}
                                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                    activeSettingsTab === 'credentials'
                                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                🔑 Token & Conexión Meta
                            </button>
                            <button
                                onClick={() => setActiveSettingsTab('manual')}
                                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                    activeSettingsTab === 'manual'
                                        ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                📖 Guía Token Permanente (Meta)
                            </button>
                        </div>

                        {settingsMessage && (
                            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                settingsMessage.type === 'success' 
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                                    : 'bg-red-950/80 text-red-300 border border-red-500/30'
                            }`}>
                                {settingsMessage.type === 'success' ? <Check size={16} /> : <X size={16} />}
                                <span>{settingsMessage.text}</span>
                            </div>
                        )}

                        {/* TAB 1: PERFIL */}
                        {activeSettingsTab === 'profile' && (
                            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
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
                                            disabled={settingsSaving}
                                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Save size={14} /> <span>Guardar en Meta WhatsApp</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* TAB 2: CREDENCIALES & TOKEN */}
                        {activeSettingsTab === 'credentials' && (
                            <div className="space-y-4 text-xs">
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                        <Key size={16} />
                                        <span>Configuración de Tokens & Identificador Meta</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Pega aquí tu <strong>Token Temporal (24 horas)</strong> o tu <strong>Token Permanente de Usuario del Sistema</strong>.
                                    </p>

                                    <div>
                                        <label className="block text-[11px] text-slate-300 font-bold mb-1">
                                            📱 WHATSAPP PHONE NUMBER ID:
                                        </label>
                                        <input 
                                            type="text"
                                            value={credPhoneId}
                                            onChange={(e) => setCredPhoneId(e.target.value)}
                                            placeholder="Ej. 1215685301622222"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-slate-300 font-bold mb-1">
                                            🔑 WHATSAPP ACCESS TOKEN (Bearer Token):
                                        </label>
                                        <textarea 
                                            rows={3}
                                            value={credToken}
                                            onChange={(e) => setCredToken(e.target.value)}
                                            placeholder="EAA..."
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300"
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveCredentials}
                                            disabled={settingsSaving}
                                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Save size={14} /> <span>Guardar Credenciales</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleTestConnection}
                                            disabled={credStatus === 'TESTING'}
                                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <RefreshCw size={14} className={credStatus === 'TESTING' ? 'animate-spin' : ''} />
                                            <span>Probar Conexión</span>
                                        </button>
                                    </div>

                                    {credTestResult && (
                                        <div className={`p-3 rounded-xl text-xs font-mono font-bold ${
                                            credStatus === 'SUCCESS' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                                        }`}>
                                            {credTestResult}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: GUÍA PASO A PASO PARA TOKEN PERMANENTE */}
                        {activeSettingsTab === 'manual' && (
                            <div className="space-y-4 text-xs">
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                                    <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800 pb-2">
                                        <Megaphone size={16} />
                                        <span>Manual Paso a Paso: Cómo Generar el Token Permanente (Sin Expiración) en Meta</span>
                                    </div>

                                    <div className="space-y-3 text-slate-300">
                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">1</span>
                                                <span>Ingresar a Meta for Developers</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Abre <a href="https://business.facebook.com/settings/system-users" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-bold">Meta Business Suite &gt; Configuración del Negocio &gt; Usuarios del Sistema</a>.
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">2</span>
                                                <span>Crear un Usuario del Sistema</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Haz clic en <strong>Agregar</strong>, ponle de nombre <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">Atomic ERP Bot</code> y asígnale el rol de <strong>Administrador</strong>.
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">3</span>
                                                <span>Asignar Activos a la App de WhatsApp</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Haz clic en <strong>Asignar activos</strong>, selecciona <strong>Apps</strong> &gt; tu App de WhatsApp Cloud &gt; activa <strong>Control Total / Administrar App</strong> y guarda.
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">4</span>
                                                <span>Generar Token Permanente</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Haz clic en el botón <strong>Generar nuevo token</strong>, selecciona tu App y marca estrictamente los siguientes permisos:
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 pl-7 pt-1">
                                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono text-[10px]">whatsapp_business_management</span>
                                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono text-[10px]">whatsapp_business_messaging</span>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">5</span>
                                                <span>Copiar y Pegar en la pestaña Token</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Copia el token generado (<code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono">EAA...</code>) y pégalo en la pestaña <strong>Token & Conexión Meta</strong>. Este token nunca caduca y mantendrá activas todas las fotos, videos, audios y atribución de pautas de forma permanente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    )
}
