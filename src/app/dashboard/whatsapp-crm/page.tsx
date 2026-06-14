"use client"

import { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  MessageSquare, Smartphone, CheckCircle2, Bot, 
  Send, RefreshCw, X, ChevronRight, Search, 
  Zap, BrainCircuit, BarChart3, Shield, Activity,
  Clock, Lock, Unlock, Settings, Terminal,
  Cpu, Sparkles, Filter, FileText, UserPlus,
  Users, Database, Layout, List, Phone, MapPin,
  Mail, Save, History, ExternalLink, MoreVertical
} from 'lucide-react';
import { CyberCard, NeonButton, CyberInput, GlassPanel } from '@/components/ui/CyberUI';

const API_BASE = '/api';
const WHATSAPP_SERVER = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://localhost:3001';
const SOCKET_URL = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://localhost:3001';

export default function WhatsAppCRMDashboard() {
  const { data: session } = useSession();
  const actualUserId = session?.user?.id || 'main';
  const role = session?.user?.role || 'USER';
  
  const [activeTab, setActiveTab] = useState<'chats' | 'crm'>('chats');
  const [status, setStatus] = useState('disconnected');
  const [socketConnected, setSocketConnected] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeInstance, setActiveInstance] = useState('corporate_main');
  const pollingRef = useRef<any>(null);

  // CRM State
  const [crmGroups, setCrmGroups] = useState<Record<string, any[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveFormData, setSaveFormData] = useState({
    whatsappId: '',
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    category: 'CLIENTES_NUEVOS',
    requirement: ''
  });

  useEffect(() => {
    if (!actualUserId) return;
    
    const socket = io(SOCKET_URL, { 
        transports: ['websocket', 'polling'],
        reconnection: true
    });
    
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));
    
    socket.on('qr', (data: any) => { 
        if (data.id === activeInstance || !data.id) { 
            setQr(data.qr); 
            setStatus('initializing'); 
        } 
    });

    socket.on('ready', (data: any) => { 
        if (data.id === activeInstance || !data.id) { 
            setStatus('connected'); 
            setQr(null);
            fetchChats(); 
        } 
    });

    fetchChats();
    fetchCrmGroups();

    return () => { socket.disconnect(); };
  }, [activeInstance, actualUserId]);

  // 🔄 POLLING FALLBACK
  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (status === 'connected') return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${WHATSAPP_SERVER}/api/whatsapp/qr/${activeInstance}`);
        const data = res.data;
        if (data.status === 'qr' && data.qr) {
          setQr(data.qr);
          setStatus('initializing');
        } else if (data.status === 'connected' || data.status === 'ready') {
          setStatus('connected');
          setQr(null);
          clearInterval(pollingRef.current);
          fetchChats();
        }
      } catch (e) { }
    }, 3000);

    return () => clearInterval(pollingRef.current);
  }, [status, activeInstance]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${WHATSAPP_SERVER}/api/whatsapp/chats/${activeInstance}`);
      setChats(res.data); setStatus('connected');
    } catch (e) { setStatus('disconnected'); }
  };

  const initWhatsApp = async () => {
    setLoading(true); setQr(null);
    try { 
        await axios.post(`${WHATSAPP_SERVER}/api/whatsapp/init`, { id: activeInstance }); 
        setStatus('initializing');
    } catch (e) { alert("Falla en el despliegue del nodo."); }
    setLoading(false);
  };

  const resetNode = async () => {
    setLoading(true); setQr(null);
    try {
        await axios.post(`${WHATSAPP_SERVER}/api/whatsapp/reset`, { id: activeInstance });
        setStatus('initializing');
        alert("Nodo reiniciado. Esperando nuevo QR...");
    } catch (e) { alert("Error al reiniciar el nodo."); }
    setLoading(false);
  };

  const fetchCrmGroups = async () => {
    try {
        const res = await axios.get('/api/crm/groups');
        setCrmGroups(res.data);
    } catch (e) { console.error(e); }
  };

  const selectChat = async (chat: any) => {
    setSelectedChat(chat);
    try {
      const res = await axios.get(`${API_BASE}/whatsapp/messages/${activeInstance}/${chat.id}`);
      setMessages(res.data);
      
      // Pre-fill save form
      setSaveFormData(prev => ({
        ...prev,
        whatsappId: chat.id.split('@')[0],
        firstName: chat.name || '',
      }));
    } catch (e) { console.error(e); }
  };

  const sendMessage = async () => {
    if (!messageInput || !selectedChat) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/whatsapp/send/${activeInstance}`, {
        to: selectedChat.id,
        message: messageInput
      });
      setMessages([...messages, { fromMe: true, body: messageInput, timestamp: Math.floor(Date.now() / 1000) }]);
      setMessageInput('');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSaveToCrm = async () => {
    try {
        const res = await axios.post('/api/whatsapp/save-to-crm', saveFormData);
        if (res.status === 200) {
            setIsSaveModalOpen(false);
            fetchCrmGroups();
            alert("CONTACTO SINCRONIZADO CON ÉXITO AL CRM");
        }
    } catch (e) {
        alert("ERROR AL GUARDAR EN CRM");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-[#00F0FF]/30">
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F0FF]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {/* SIDEBAR: NAVIGATOR */}
        <div className="w-[380px] border-r border-white/5 bg-slate-950/50 backdrop-blur-3xl flex flex-col">
            <div className="p-8 border-b border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-pulse" />
                        <h1 className="text-xl font-black uppercase tracking-tighter italic">WHATSAPP <span className="text-[#00F0FF]">CRM</span></h1>
                    </div>
                    <div className="flex bg-slate-900/50 p-1 border border-white/5">
                        <button 
                            onClick={() => setActiveTab('chats')}
                            className={`p-2 transition-all ${activeTab === 'chats' ? 'bg-[#00F0FF] text-slate-950' : 'text-slate-500 hover:text-white'}`}
                        >
                            <MessageSquare size={16} />
                        </button>
                        <button 
                            onClick={() => setActiveTab('crm')}
                            className={`p-2 transition-all ${activeTab === 'crm' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Users size={16} />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                    <input 
                        type="text" 
                        placeholder="BUSCAR FRECUENCIA..." 
                        className="w-full bg-slate-900/50 border border-white/5 pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest italic outline-none focus:border-[#00F0FF]/30 transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'chats' ? (
                        <motion.div key="chats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="divide-y divide-white/5">
                            {chats.map(chat => (
                                <div 
                                    key={chat.id} 
                                    onClick={() => selectChat(chat)}
                                    className={`p-6 cursor-pointer hover:bg-white/[0.02] transition-all group relative ${selectedChat?.id === chat.id ? 'bg-[#00F0FF]/5' : ''}`}
                                >
                                    {selectedChat?.id === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00F0FF]" />}
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-[11px] font-black uppercase tracking-tight italic group-hover:text-[#00F0FF] transition-colors truncate">
                                            {chat.name || chat.id.split('@')[0]}
                                        </h4>
                                        <span className="text-[8px] font-black text-slate-700 uppercase italic">
                                            {chat.t && new Date(chat.t * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-500 truncate italic">
                                        {chat.lastMessage?.body || 'LISTA_EN_ESPERA...'}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="crm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
                            {Object.entries(crmGroups).map(([cat, list]) => (
                                <div key={cat} className="space-y-2">
                                    <button 
                                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                        className={`w-full flex items-center justify-between p-4 border border-white/5 transition-all ${selectedCategory === cat ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900/30 hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Database size={12} className={selectedCategory === cat ? 'text-indigo-400' : 'text-slate-500'} />
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">{cat}</span>
                                        </div>
                                        <span className="text-[9px] font-black opacity-30">{list.length}</span>
                                    </button>
                                    <AnimatePresence>
                                        {selectedCategory === cat && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-1 pl-4">
                                                {list.map(client => (
                                                    <div key={client.id} className="p-4 bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all">
                                                        <p className="text-[10px] font-black uppercase italic">{client.firstName} {client.lastName}</p>
                                                        <p className="text-[8px] font-bold text-slate-500 italic mt-1">{client.phone}</p>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* MAIN AREA: INTERACTION */}
        <div className="flex-1 flex flex-col bg-black/40 relative overflow-hidden">
            {activeTab === 'chats' ? (
                selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl flex justify-between items-center z-20">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-900 border border-white/10 flex items-center justify-center font-black text-xl text-[#00F0FF] italic">
                                    {selectedChat.name?.[0] || selectedChat.id[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic">{selectedChat.name || selectedChat.id.split('@')[0]}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">TRANSMISIÓN_ACTIVA</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setIsSaveModalOpen(true)}
                                    className="flex items-center gap-3 bg-white text-slate-950 px-6 py-3 text-[10px] font-black uppercase tracking-widest italic hover:bg-[#00F0FF] transition-all"
                                >
                                    <Save size={14} />
                                    GUARDAR EN CRM
                                </button>
                                <button className="p-4 bg-slate-900 border border-white/10 text-slate-500 hover:text-white transition-all"><MoreVertical size={16} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {messages.map((m, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-6 max-w-[70%] text-[13px] font-bold uppercase tracking-tight italic relative ${m.fromMe ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30' : 'bg-slate-900/80 text-slate-100 border border-white/5'}`}>
                                            {m.body}
                                            <span className="block mt-2 text-[8px] opacity-30 text-right">
                                                {new Date(m.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Input terminal */}
                        <div className="p-8 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl">
                            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-4">
                                <input 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="ESCRIBIR MENSAJE..."
                                    className="flex-1 bg-slate-900 border border-white/10 p-6 text-sm font-black text-white italic outline-none focus:border-indigo-500/50 transition-all uppercase"
                                />
                                <button className="bg-indigo-600 text-white px-10 hover:bg-indigo-500 transition-all"><Send size={24} /></button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-24 text-center">
                        <AnimatePresence mode="wait">
                            {status === 'disconnected' && !loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <MessageSquare size={80} className="text-white/5 mb-8 mx-auto" />
                                    <p className="text-2xl font-black uppercase tracking-[0.5em] italic text-white/20">SISTEMA_OFFLINE</p>
                                    <button onClick={initWhatsApp} className="bg-[#00F0FF] text-slate-950 px-12 py-5 font-black uppercase tracking-widest italic hover:bg-white transition-all">
                                        INICIAR VINCULACIÓN
                                    </button>
                                </motion.div>
                            )}

                            {(loading || (status === 'initializing' && !qr)) && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="w-20 h-20 border-4 border-t-[#00F0FF] border-[#00F0FF]/20 rounded-full animate-spin mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[#00F0FF] animate-pulse italic">Sincronizando_Núcleo...</p>
                                </motion.div>
                            )}

                            {status === 'initializing' && qr && (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-10">
                                    <div className="bg-white p-6 inline-block shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                                        <QRCodeCanvas value={qr} size={280} level="H" includeMargin />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xl font-black uppercase italic tracking-tighter">ESCANEA PARA VINCULAR</p>
                                        <a href={`${WHATSAPP_SERVER}/api/whatsapp/qr/${activeInstance}/image`} target="_blank" rel="noreferrer" className="block text-[11px] text-[#00F0FF] hover:underline uppercase font-black bg-[#00F0FF]/10 p-3 border border-[#00F0FF]/20">
                                            🚀 ABRIR QR EN PESTAÑA NUEVA (SOLUCIÓN FINAL)
                                        </a>
                                    </div>
                                    <button onClick={resetNode} className="text-[10px] font-black text-white/30 hover:text-[#00F0FF] uppercase tracking-widest transition-all italic">
                                        REINTENTAR / RESET
                                    </button>
                                </motion.div>
                            )}
                            
                            {status === 'connected' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <MessageSquare size={80} className="text-white/5 mb-8 mx-auto" />
                                    <p className="text-2xl font-black uppercase tracking-[0.5em] italic text-white/10">ESPERANDO_FRECUENCIA</p>
                                    <button className="bg-[#25D366] text-white px-12 py-5 font-black uppercase tracking-widest italic hover:bg-[#128C7E] transition-all flex items-center gap-3 mx-auto shadow-[0_0_20px_rgba(37,211,102,0.3)]">
                                        <MessageSquare size={20} />
                                        NUEVA TRANSMISIÓN WA
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            ) : (
                <div className="flex-1 flex flex-col p-12 overflow-hidden">
                    {selectedCategory ? (
                        <div className="space-y-8 h-full flex flex-col">
                            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic mb-2">BASE DE DATOS ACTIVA</p>
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter">{selectedCategory}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase italic">CONTACTOS TOTALES</p>
                                    <p className="text-2xl font-black text-white italic">{crmGroups[selectedCategory]?.length || 0}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {crmGroups[selectedCategory]?.map(client => (
                                        <CyberCard key={client.id} className="!p-8 hover:border-indigo-500/50 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400">
                                                    {client.firstName?.[0]}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-2 bg-white/5 text-slate-500 hover:text-white"><History size={14} /></button>
                                                    <button className="p-2 bg-white/5 text-slate-500 hover:text-white"><ExternalLink size={14} /></button>
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-black uppercase italic tracking-tighter mb-1">{client.firstName} {client.lastName}</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic mb-4">{client.phone}</p>
                                            
                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 italic">
                                                    <Mail size={12} className="text-indigo-500/50" />
                                                    <span>{client.email || 'SIN_EMAIL'}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 italic">
                                                    <MapPin size={12} className="text-indigo-500/50" />
                                                    <span>{client.city || 'SIN_CIUDAD'}</span>
                                                </div>
                                            </div>

                                            {client.requirement && (
                                                <div className="mt-6 p-4 bg-black/40 border-l-2 border-indigo-500 text-[9px] font-bold text-slate-300 italic line-clamp-2">
                                                    {client.requirement}
                                                </div>
                                            )}
                                        </CyberCard>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <Database size={80} className="text-white/5 mb-8" />
                            <p className="text-2xl font-black uppercase tracking-[0.5em] italic text-white/10">SELECCIONAR_BASE_DATOS</p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* SAVE TO CRM MODAL */}
        <AnimatePresence>
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/95 backdrop-blur-3xl">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-white/10 p-12 max-w-2xl w-full space-y-10 shadow-2xl relative">
                        <div className="absolute -top-px -left-px w-12 h-px bg-indigo-500 shadow-[0_0_15px_#6366f1]" />
                        <div className="flex justify-between items-center border-b border-white/5 pb-6">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">SINCRONIZAR <span className="text-indigo-400">CRM</span></h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Actualizaci\u00f3n de Inteligencia Comercial</p>
                            </div>
                            <button onClick={() => setIsSaveModalOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 transition-all"><X size={24} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">NOMBRE</label>
                                <input 
                                    className="w-full bg-slate-800 border border-white/5 p-4 text-[12px] font-black text-white italic outline-none focus:border-indigo-500 uppercase"
                                    value={saveFormData.firstName}
                                    onChange={(e) => setSaveFormData({...saveFormData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">APELLIDO</label>
                                <input 
                                    className="w-full bg-slate-800 border border-white/5 p-4 text-[12px] font-black text-white italic outline-none focus:border-indigo-500 uppercase"
                                    value={saveFormData.lastName}
                                    onChange={(e) => setSaveFormData({...saveFormData, lastName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">EMAIL</label>
                                <input 
                                    className="w-full bg-slate-800 border border-white/5 p-4 text-[12px] font-black text-white italic outline-none focus:border-indigo-500 uppercase"
                                    value={saveFormData.email}
                                    onChange={(e) => setSaveFormData({...saveFormData, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">CIUDAD</label>
                                <input 
                                    className="w-full bg-slate-800 border border-white/5 p-4 text-[12px] font-black text-white italic outline-none focus:border-indigo-500 uppercase"
                                    value={saveFormData.city}
                                    onChange={(e) => setSaveFormData({...saveFormData, city: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">LISTA / CATEGOR?A CUSTOM</label>
                                <input 
                                    className="w-full bg-slate-800 border border-indigo-500/30 p-4 text-[12px] font-black text-indigo-400 italic outline-none focus:border-indigo-400 uppercase"
                                    placeholder="TEMA_01, PROSPECTOS_WEB, ETC..."
                                    value={saveFormData.category}
                                    onChange={(e) => setSaveFormData({...saveFormData, category: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">REQUERIMIENTO / NOTA T%CNICA</label>
                                <textarea 
                                    className="w-full bg-slate-800 border border-white/5 p-4 text-[12px] font-black text-white italic outline-none focus:border-indigo-500 uppercase min-h-[100px] resize-none"
                                    value={saveFormData.requirement}
                                    onChange={(e) => setSaveFormData({...saveFormData, requirement: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSaveToCrm}
                            className="w-full bg-indigo-600 text-white py-6 text-[10px] font-black uppercase tracking-[0.5em] italic hover:bg-white hover:text-indigo-600 transition-all shadow-[0_0_50px_rgba(99,102,241,0.3)]"
                        >
                            CONFIRMAR TRASPASO A CRM
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}
