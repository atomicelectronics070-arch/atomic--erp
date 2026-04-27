"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import { useSession } from 'next-auth/react';
import { 
  MessageSquare, 
  Settings, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Copy,
  Bot,
  WifiOff,
  Send,
  Zap,
  Tag,
  Users,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

export default function WhatsAppDashboard() {
  const { data: session } = useSession();
  const actualUserId = session?.user?.id || 'main';
  const role = session?.user?.role || 'USER';
  
  const [activeInstance, setActiveInstance] = useState(role === 'ADMIN' ? 'corporate_main' : actualUserId);
  const [view, setView] = useState<'dashboard' | 'chats'>('dashboard');
  const [status, setStatus] = useState('disconnected');
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (!actualUserId) return;

    axios.get('http://localhost:5000/health').then(() => setBackendOnline(true)).catch(() => setBackendOnline(false));

    const socket = io(SOCKET_URL);

    socket.on('connect', () => setBackendOnline(true));
    socket.on('disconnect', () => setBackendOnline(false));

    socket.on('qr', (data) => {
      if (data.id === activeInstance) {
        setQr(data.qr);
        setStatus('initializing');
      }
    });

    socket.on('ready', (data) => {
      if (data.id === activeInstance) {
        setStatus('connected');
        setQr(null);
        fetchChats();
      }
    });

    socket.on('new_activity', (data) => {
      if (data.accountId === activeInstance) {
        setActivities(prev => [{
          id: Date.now(),
          type: 'ai',
          chatId: data.chatId,
          text: `NVIDIA AI sugirió respuesta para ${data.chatId.split('@')[0]}`,
          suggestion: data.suggestion,
          original: data.message,
          time: 'Recién'
        }, ...prev]);
      }
    });

    return () => { socket.disconnect(); };
  }, [activeInstance, actualUserId]);

  useEffect(() => {
    // When instance changes, check its status and fetch its chats
    setStatus('disconnected');
    setQr(null);
    setChats([]);
    setSelectedChat(null);
    setMessages([]);
    
    if (backendOnline) {
      // Intentar fetchear chats, si falla es porque no está conectado
      fetchChats();
    }
  }, [activeInstance, backendOnline]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/whatsapp/chats/${activeInstance}`);
      setChats(res.data);
      setStatus('connected'); // If it succeeds, it's connected
    } catch (e) {
      console.log("Instancia no iniciada o no conectada");
      setStatus('disconnected');
    }
  };

  const selectChat = async (chat: any) => {
    setSelectedChat(chat);
    try {
      const res = await axios.get(`${API_BASE}/whatsapp/messages/${activeInstance}/${chat.id}`);
      setMessages(res.data);
    } catch (e) {
      console.error("Error fetching messages", e);
    }
  };

  const generateVariant = async (tone: string) => {
    if (!selectedChat || messages.length === 0) return;
    setAiLoading(true);
    try {
      const lastMsg = [...messages].reverse().find(m => !m.fromMe);
      await axios.post(`${API_BASE}/ai/variant`, {
        accountId: activeInstance,
        chatId: selectedChat.id,
        message: lastMsg ? lastMsg.body : "Genera un saludo inicial comercial.",
        tone
      });
    } catch (e) {
      console.error("Error generating variant", e);
    } finally {
      setAiLoading(false);
    }
  };

  const initWhatsApp = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/whatsapp/init`, { id: activeInstance });
      setStatus('initializing');
    } catch (err) {
      console.error("Error initializing WhatsApp", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full min-h-full p-8 text-white">
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-none">
            <MessageSquare size={18} className="text-green-400" />
          </div>
          <div>
            <span className="text-[11px] font-black text-slate-200 uppercase tracking-[0.2em] block">Mensajería CRM Integrada</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">NVIDIA Sync · {activeInstance === 'corporate_main' ? 'Línea Corporativa' : 'Línea Personal'}</span>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-none flex items-center gap-1 ${backendOnline === true ? 'bg-green-500/10 text-green-400 border-green-500/20' : backendOnline === false ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-none ${backendOnline === true ? 'bg-green-400 animate-pulse' : backendOnline === false ? 'bg-red-500' : 'bg-slate-600'}`} />
            {backendOnline === true ? 'ONLINE' : backendOnline === false ? 'OFFLINE' : '...'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={activeInstance} 
            onChange={(e) => setActiveInstance(e.target.value)}
            className="bg-black/50 border border-white/10 text-xs font-bold uppercase tracking-widest px-4 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="corporate_main">WhatsApp Corporativo (Compartido)</option>
            <option value={actualUserId}>Mi WhatsApp Personal</option>
          </select>

          <div className="flex bg-slate-900/60 p-1 rounded-none border border-white/5">
              <button onClick={() => setView('dashboard')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-green-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Ajustes</button>
              <button onClick={() => { setView('chats'); fetchChats(); }} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${view === 'chats' ? 'bg-green-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>CRM Chats</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {backendOnline === false && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="mb-6 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-6 py-4 rounded-none flex items-start gap-3 overflow-hidden"
            >
                <WifiOff size={18} className="mt-0.5 shrink-0" />
                <div>
                    <p className="font-bold text-sm">El motor de IA de WhatsApp no está iniciado.</p>
                    <p className="text-xs text-orange-400/70 mt-1">Por favor inicia el servidor Node.js en el puerto 5000.</p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {view === 'dashboard' ? (
          <>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-none">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Settings size={14} /> Gestión de Instancia
                </h2>
                <div className="flex flex-col items-center text-center">
                    {status === 'disconnected' && (
                        <>
                            <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                                {activeInstance === 'corporate_main' ? <Users size={32} className="text-slate-500" /> : <Smartphone size={32} className="text-slate-500" />}
                            </div>
                            <button onClick={initWhatsApp} disabled={loading || backendOnline === false}
                                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 px-4 font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2">
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                {loading ? 'Iniciando Servicio...' : 'Vincular Escaneando QR'}
                            </button>
                            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                                {activeInstance === 'corporate_main' 
                                  ? 'Al conectar esta línea, todos los agentes autorizados podrán ver y gestionar los chats desde su propio panel.'
                                  : 'Conecta tu línea personal para usar la IA de análisis de ventas exclusivamente para tus clientes.'}
                            </p>
                        </>
                    )}
                    {status === 'initializing' && qr && (
                        <div className="bg-white p-4 rounded-none mb-4 inline-block shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <QRCodeCanvas value={qr} size={200} />
                        </div>
                    )}
                    {status === 'initializing' && !qr && (
                        <div className="py-12 flex flex-col items-center">
                            <Loader2 size={32} className="text-green-500 animate-spin mb-4" />
                            <p className="text-xs text-slate-400 uppercase tracking-widest animate-pulse">Generando Código QR...</p>
                        </div>
                    )}
                    {status === 'connected' && (
                        <div className="py-8 flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                            <p className="text-sm font-bold text-green-400 uppercase tracking-widest">Línea Conectada</p>
                            <button onClick={() => { setView('chats'); fetchChats(); }} className="mt-6 text-xs text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase font-bold">Abrir CRM</button>
                        </div>
                    )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-none min-h-[500px]">
                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                    <Bot size={14} /> Actividad IA Reciente ({activeInstance === 'corporate_main' ? 'Global' : 'Personal'})
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {activities.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 text-xs font-bold uppercase tracking-widest">No hay actividad reciente de IA en esta instancia.</div>
                  ) : activities.map(a => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={a.id} className="bg-slate-950 border border-white/5 p-4 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                        <p className="text-xs font-bold text-slate-300 mb-2">{a.text}</p>
                        {a.type === 'ai' && (
                            <div className="bg-indigo-900/20 border border-indigo-500/20 p-3 mt-2">
                                <p className="text-sm text-indigo-200 italic mb-3">"{a.suggestion}"</p>
                                <button onClick={() => copyToClipboard(a.suggestion)} className="text-[10px] bg-indigo-500/20 text-indigo-300 px-3 py-1.5 uppercase font-bold tracking-widest hover:bg-indigo-500 hover:text-white transition-colors flex items-center gap-1.5">
                                    <Copy size={10} /> Copiar Sugerencia
                                </button>
                            </div>
                        )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="lg:col-span-1 bg-slate-900/40 border border-white/5 h-[700px] flex flex-col">
              <div className="p-4 border-b border-white/5 bg-slate-950">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bandeja de Entrada</h3>
              </div>
              <div className="overflow-y-auto flex-1 p-2">
                {chats.length === 0 ? (
                    <div className="text-center py-10 text-slate-600 text-xs uppercase tracking-widest">No hay chats en esta instancia</div>
                ) : chats.map(c => (
                  <div key={c.id} className={`p-3 mb-1 cursor-pointer transition-colors border-l-2 ${selectedChat?.id === c.id ? 'bg-white/5 border-green-500' : 'border-transparent hover:bg-white/[0.02]'}`} onClick={() => selectChat(c)}>
                    <div className="flex justify-between items-start">
                        <p className="font-bold text-sm text-slate-200 truncate pr-2">{c.name}</p>
                        {/* Placeholder for tags */}
                        {c.unreadCount > 0 && <span className="bg-green-500 text-white text-[9px] px-1.5 py-0.5 font-bold rounded-full">{c.unreadCount}</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-1">{c.lastMessage}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 h-[700px] flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b border-white/5 bg-slate-950 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold">{selectedChat.name}</h2>
                        <div className="flex gap-2">
                        <button className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-indigo-500 hover:text-white transition-colors" onClick={() => generateVariant('balanced')} disabled={aiLoading}>
                            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                            Sugerir Respuesta
                        </button>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                        <Tag size={12} className="text-slate-500" />
                        {/* Static tags for demonstration - would be wired to a DB in prod */}
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20">Cotizando</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 cursor-pointer hover:bg-blue-500/20">Nuevo</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-dashed border-white/20 text-white/40 cursor-pointer hover:bg-white/5">+ Etiqueta</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 text-sm shadow-md ${m.fromMe ? 'bg-green-700/90 text-white rounded-l-lg rounded-tr-lg' : 'bg-slate-800 text-slate-200 rounded-r-lg rounded-tl-lg'}`}>
                          {m.body}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-white/5 bg-slate-950 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button className="text-[9px] font-bold uppercase tracking-widest bg-slate-900 px-3 py-1 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5 transition-colors" onClick={() => generateVariant('friendly')}>Tono Amable</button>
                        <button className="text-[9px] font-bold uppercase tracking-widest bg-slate-900 px-3 py-1 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5 transition-colors" onClick={() => generateVariant('direct')}>Tono Directo</button>
                      </div>
                      <div className="flex gap-3">
                        <input type="text" placeholder="Responde al cliente... (Sugerencias aparecerán arriba)" className="flex-1 bg-black/50 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-green-500" disabled />
                        <button className="bg-green-600 text-white px-5 hover:bg-green-500 disabled:opacity-50 transition-colors" disabled><Send size={18} /></button>
                      </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-[url('/chat-bg.png')] bg-opacity-5">
                    <MessageSquare size={48} className="mb-4 opacity-20" />
                    <p className="text-xs uppercase tracking-widest">Selecciona un chat del panel lateral</p>
                    <p className="text-[10px] mt-2 opacity-50 text-center max-w-xs">Puedes leer el historial completo y usar la IA para cerrar más ventas.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
