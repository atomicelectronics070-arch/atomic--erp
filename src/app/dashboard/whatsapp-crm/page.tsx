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

  // POLLING FALLBACK
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
    } catch (e) { alert("Falla en la vinculación del nodo."); }
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
            alert("Contacto sincronizado con éxito al CRM.");
        }
    } catch (e) {
        alert("Error al guardar en el CRM.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 font-sans border-t border-slate-200">
        
        {/* SIDEBAR: NAVIGATOR */}
        <div className="w-[380px] bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
            <div className="p-6 border-b border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${status === 'connected' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <h1 className="text-xl font-black text-[#0F172A] tracking-tight">WhatsApp CRM</h1>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button 
                            onClick={() => setActiveTab('chats')}
                            className={`p-2 transition-all rounded-md flex items-center justify-center ${activeTab === 'chats' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <MessageSquare size={16} />
                        </button>
                        <button 
                            onClick={() => setActiveTab('crm')}
                            className={`p-2 transition-all rounded-md flex items-center justify-center ${activeTab === 'crm' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Users size={16} />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar conversaciones..." 
                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                <AnimatePresence mode="wait">
                    {activeTab === 'chats' ? (
                        <motion.div key="chats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="divide-y divide-slate-100">
                            {chats.map(chat => (
                                <div 
                                    key={chat.id} 
                                    onClick={() => selectChat(chat)}
                                    className={`p-5 cursor-pointer hover:bg-slate-100 transition-all group relative ${selectedChat?.id === chat.id ? 'bg-indigo-50/50' : 'bg-white'}`}
                                >
                                    {selectedChat?.id === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r" />}
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-[#0F172A] truncate pr-2">
                                            {chat.name || chat.id.split('@')[0]}
                                        </h4>
                                        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                                            {chat.t && new Date(chat.t * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate font-medium">
                                        {chat.lastMessage?.body || 'Esperando mensajes...'}
                                    </p>
                                </div>
                            ))}
                            {chats.length === 0 && status === 'connected' && (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-slate-500 font-medium">No hay chats recientes</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="crm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-3">
                            {Object.entries(crmGroups).map(([cat, list]) => (
                                <div key={cat} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                        className={`w-full flex items-center justify-between p-4 transition-all ${selectedCategory === cat ? 'bg-indigo-50 border-b border-indigo-100' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Database size={16} className={selectedCategory === cat ? 'text-indigo-600' : 'text-slate-400'} />
                                            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{cat}</span>
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{list.length}</span>
                                    </button>
                                    <AnimatePresence>
                                        {selectedCategory === cat && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50">
                                                <div className="p-2 space-y-1">
                                                {list.map(client => (
                                                    <div key={client.id} className="p-3 bg-white border border-slate-100 rounded-lg hover:border-indigo-200 cursor-pointer transition-all shadow-sm">
                                                        <p className="text-sm font-bold text-[#0F172A]">{client.firstName} {client.lastName}</p>
                                                        <p className="text-xs font-medium text-slate-500 mt-1">{client.phone}</p>
                                                    </div>
                                                ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                            {Object.keys(crmGroups).length === 0 && (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-slate-500 font-medium">No hay grupos en el CRM</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* MAIN AREA: INTERACTION */}
        <div className="flex-1 flex flex-col relative bg-white">
            {activeTab === 'chats' ? (
                selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-8 py-6 border-b border-slate-200 bg-white flex justify-between items-center z-20 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center font-black text-xl text-indigo-600">
                                    {selectedChat.name?.[0] || selectedChat.id[0]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#0F172A]">{selectedChat.name || selectedChat.id.split('@')[0]}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold text-slate-500">Conectado</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsSaveModalOpen(true)}
                                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm"
                                >
                                    <Save size={16} />
                                    Guardar en CRM
                                </button>
                                <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 transition-all"><MoreVertical size={18} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {messages.map((m, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-4 max-w-[75%] text-sm font-medium rounded-2xl relative shadow-sm ${m.fromMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'}`}>
                                            {m.body}
                                            <span className={`block mt-2 text-[10px] text-right font-bold ${m.fromMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                {new Date(m.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-slate-200 bg-white">
                            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-4">
                                <input 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                                <button type="submit" disabled={!messageInput || loading} className="bg-indigo-600 text-white px-8 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
                        <AnimatePresence mode="wait">
                            {status === 'disconnected' && !loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-sm w-full">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare size={32} className="text-slate-400" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#0F172A]">Sistema Desconectado</h2>
                                    <p className="text-sm text-slate-500 font-medium">Vincula tu cuenta de WhatsApp para comenzar a gestionar los chats.</p>
                                    <button onClick={initWhatsApp} className="w-full bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm mt-4">
                                        Iniciar Vinculación
                                    </button>
                                </motion.div>
                            )}

                            {(loading || (status === 'initializing' && !qr)) && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                                    <p className="text-sm font-bold text-slate-600 tracking-wider uppercase">Sincronizando Servicio...</p>
                                </motion.div>
                            )}

                            {status === 'initializing' && qr && (
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8 max-w-sm w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                    <div className="bg-white p-4 border border-slate-100 rounded-xl inline-block shadow-sm">
                                        <QRCodeCanvas value={qr} size={240} level="H" includeMargin />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-black text-[#0F172A]">Escanea para Vincular</h3>
                                        <a href={`${WHATSAPP_SERVER}/api/whatsapp/qr/${activeInstance}/image`} target="_blank" rel="noreferrer" className="block text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline bg-indigo-50 py-3 rounded-lg border border-indigo-100 transition-colors">
                                            Abrir QR en nueva pestaña
                                        </a>
                                    </div>
                                    <button onClick={resetNode} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-wider">
                                        Reintentar Conexión
                                    </button>
                                </motion.div>
                            )}
                            
                            {status === 'connected' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={32} className="text-emerald-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#0F172A]">Conexión Establecida</h2>
                                    <p className="text-sm text-slate-500 font-medium">Selecciona un chat del panel lateral para comenzar a enviar mensajes.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            ) : (
                <div className="flex-1 flex flex-col p-8 bg-slate-50/50 overflow-hidden">
                    {selectedCategory ? (
                        <div className="space-y-8 h-full flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-8">
                            <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Base de Datos Activa</p>
                                    <h3 className="text-3xl font-black text-[#0F172A]">{selectedCategory}</h3>
                                </div>
                                <div className="text-right bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Contactos</p>
                                    <p className="text-2xl font-black text-[#0F172A]">{crmGroups[selectedCategory]?.length || 0}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {crmGroups[selectedCategory]?.map(client => (
                                        <div key={client.id} className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all group relative">
                                            <div className="flex justify-between items-start mb-5">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-lg text-indigo-600 border border-indigo-100">
                                                    {client.firstName?.[0]}
                                                </div>
                                                <div className="flex gap-1">
                                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><History size={16} /></button>
                                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><ExternalLink size={16} /></button>
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-black text-[#0F172A] mb-1">{client.firstName} {client.lastName}</h4>
                                            <p className="text-sm font-bold text-slate-500 mb-4">{client.phone}</p>
                                            
                                            <div className="space-y-2 pt-4 border-t border-slate-100">
                                                <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                                    <Mail size={14} className="text-slate-400" />
                                                    <span className="truncate">{client.email || 'Sin correo electrónico'}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    <span className="truncate">{client.city || 'Ciudad no especificada'}</span>
                                                </div>
                                            </div>

                                            {client.requirement && (
                                                <div className="mt-5 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-medium text-slate-600 line-clamp-2">
                                                    {client.requirement}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {crmGroups[selectedCategory]?.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                                            No hay contactos en esta categoría.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Database size={32} className="text-slate-300" />
                            </div>
                            <h2 className="text-xl font-black text-[#0F172A] mb-2">Selecciona una Categoría</h2>
                            <p className="text-sm text-slate-500 font-medium max-w-sm">Elige una categoría de la barra lateral para ver y gestionar los contactos del CRM.</p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* SAVE TO CRM MODAL */}
        <AnimatePresence>
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSaveModalOpen(false)} />
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-8 max-w-2xl w-full rounded-2xl shadow-xl relative z-10 border border-slate-200">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-3">
                                    <Save className="text-indigo-600" /> Guardar en CRM
                                </h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Registra este contacto para futuras campañas y seguimiento.</p>
                            </div>
                            <button onClick={() => setIsSaveModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><X size={20} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    value={saveFormData.firstName}
                                    onChange={(e) => setSaveFormData({...saveFormData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Apellido</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    value={saveFormData.lastName}
                                    onChange={(e) => setSaveFormData({...saveFormData, lastName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    value={saveFormData.email}
                                    onChange={(e) => setSaveFormData({...saveFormData, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ciudad</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    value={saveFormData.city}
                                    onChange={(e) => setSaveFormData({...saveFormData, city: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Categoría / Grupo</label>
                                <input 
                                    className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-lg text-sm font-bold text-indigo-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                    placeholder="Ej: CLIENTES_NUEVOS, PROSPECTOS"
                                    value={saveFormData.category}
                                    onChange={(e) => setSaveFormData({...saveFormData, category: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Notas / Requerimientos</label>
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px] resize-none"
                                    value={saveFormData.requirement}
                                    onChange={(e) => setSaveFormData({...saveFormData, requirement: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSaveToCrm}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm flex justify-center items-center gap-2"
                        >
                            <Save size={18} />
                            Confirmar y Guardar Contacto
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

    </div>
  );
}
