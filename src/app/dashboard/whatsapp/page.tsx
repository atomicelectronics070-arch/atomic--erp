"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  MessageSquare, Smartphone, CheckCircle2, Bot, 
  Send, RefreshCw, X, ChevronRight, Search
} from 'lucide-react';
import { CyberCard, NeonButton, CyberInput, GlassPanel } from '@/components/ui/CyberUI';

const API_BASE = '/api';
const WHATSAPP_SERVER = process.env.NEXT_PUBLIC_WHATSAPP_SERVER || 'http://localhost:3001';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

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
    axios.get(`${WHATSAPP_SERVER}/health`).then(() => setBackendOnline(true)).catch(() => setBackendOnline(false));
    const socket = io(SOCKET_URL);
    socket.on('connect', () => setBackendOnline(true));
    socket.on('qr', (data: any) => { if (data.id === activeInstance) { setQr(data.qr); setStatus('initializing'); } });
    socket.on('ready', (data: any) => { if (data.id === activeInstance) { setStatus('connected'); setQr(null); fetchChats(); } });
    return () => { socket.disconnect(); };
  }, [activeInstance, actualUserId]);

  useEffect(() => {
    setStatus('disconnected'); setQr(null); setChats([]); setSelectedChat(null); setMessages([]);
    if (backendOnline) fetchChats();
  }, [activeInstance, backendOnline]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/whatsapp/chats/${activeInstance}`);
      setChats(res.data); setStatus('connected');
    } catch (e) { setStatus('disconnected'); }
  };

  const selectChat = async (chat: any) => {
    setSelectedChat(chat);
    try {
      const res = await axios.get(`${API_BASE}/whatsapp/messages/${activeInstance}/${chat.id}`);
      setMessages(res.data);
    } catch (e) { console.error(e); }
  };

  const initWhatsApp = async () => {
    setLoading(true);
    try {
      await axios.post(`${WHATSAPP_SERVER}/init`, { id: activeInstance });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const generateVariant = async (v: string) => {
    if (!selectedChat) return;
    setAiLoading(true);
    try {
      const lastMsg = messages[messages.length - 1]?.body || '';
      const res = await axios.post(`${API_BASE}/whatsapp/ai/suggest`, { 
        instanceId: activeInstance,
        chatId: selectedChat.id,
        context: lastMsg,
        variant: v
      });
      // Handle suggestion
    } catch (e) { console.error(e); }
    setAiLoading(false);
  };

  return (
    <div className="w-full min-h-full space-y-12 relative z-10">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#00F0FF]/5 blur-[150px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12 relative z-10"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#00F0FF] neon-text">
            <MessageSquare size={24} />
            <span className="text-[10px] uppercase font-black tracking-[0.5em] italic">CRM INTELIGENTE // SYNC ACTIVO</span>
          </div>
          <h1 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none">WHATS<span className="text-[#00F0FF] neon-text">APP</span></h1>
        </div>

        <div className="flex gap-4">
          <select 
            value={activeInstance} 
            onChange={(e) => setActiveInstance(e.target.value)}
            className="bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest px-6 py-4 text-white outline-none focus:border-[#00F0FF] transition-all italic"
          >
            <option value="corporate_main">Terminal Corporativa</option>
            <option value={actualUserId}>Nodo Personal</option>
          </select>
          <div className="flex bg-white/5 p-1 border border-white/10">
            <button onClick={() => setView('dashboard')} className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-[#00F0FF] text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'text-white/40 hover:text-white'}`}>Config</button>
            <button onClick={() => { setView('chats'); fetchChats(); }} className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${view === 'chats' ? 'bg-[#00F0FF] text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'text-white/40 hover:text-white'}`}>Chats</button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        {view === 'dashboard' ? (
          <>
            <CyberCard className="lg:col-span-1 text-center flex flex-col items-center justify-center min-h-[400px]">
              {status === 'disconnected' && (
                <div className="space-y-10 w-full">
                  <div className="w-24 h-24 bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                    <Smartphone size={32} className="text-white/20" />
                  </div>
                  <NeonButton variant="secondary" className="w-full justify-center" onClick={() => !loading && initWhatsApp()} disabled={loading || backendOnline === false}>
                    {loading ? "Sincronizando..." : "VINCULAR TERMINAL"}
                  </NeonButton>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">Seguridad de Nodo: AES-256 Enabled</p>
                </div>
              )}
              {status === 'initializing' && qr && (
                <div className="space-y-8">
                  <div className="bg-white p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)]"><QRCodeCanvas value={qr} size={200} /></div>
                  <p className="text-[10px] font-black text-[#00F0FF] animate-pulse uppercase tracking-[0.3em] italic">Esperando Escaneo Táctico...</p>
                </div>
              )}
              {status === 'connected' && (
                <div className="space-y-8">
                  <div className="w-20 h-20 bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mx-auto text-[#00F0FF]"><CheckCircle2 size={40} /></div>
                  <p className="text-xl font-black text-white uppercase italic tracking-tighter">NODO ACTIVO</p>
                  <NeonButton variant="outline" className="w-full justify-center" onClick={() => setView('chats')}>ABRIR CRM</NeonButton>
                </div>
              )}
            </CyberCard>
            <CyberCard className="lg:col-span-2">
              <h2 className="text-[10px] font-black text-[#00F0FF] neon-text uppercase tracking-[0.5em] italic mb-10 flex items-center gap-3"><Bot size={16} /> ACTIVIDAD NEURONAL</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto hide-scrollbar">
                {activities.map(a => (
                  <motion.div key={a.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 p-6 border-l-2 border-[#00F0FF] relative group">
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-3">{a.text}</p>
                    <div className="bg-[#00F0FF]/5 p-4 border border-[#00F0FF]/10 italic text-sm text-[#00F0FF]/80">"{a.suggestion}"</div>
                  </motion.div>
                ))}
                {activities.length === 0 && <p className="text-center py-24 text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic">Esperando Eventos de IA...</p>}
              </div>
            </CyberCard>
          </>
        ) : (
          <>
            <GlassPanel className="lg:col-span-1 h-[750px] flex flex-col">
              <div className="p-6 border-b border-white/5 bg-black/20"><p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">Bandeja de Entrada</p></div>
              <div className="flex-1 overflow-y-auto hide-scrollbar p-2 space-y-1">
                {chats.map(c => (
                  <div key={c.id} onClick={() => selectChat(c)} className={`p-5 cursor-pointer transition-all border-l-2 ${selectedChat?.id === c.id ? 'bg-[#00F0FF]/5 border-[#00F0FF]' : 'border-transparent hover:bg-white/5'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-black text-[13px] text-white uppercase tracking-tighter truncate">{c.name}</p>
                      {c.unreadCount > 0 && <span className="w-2 h-2 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-pulse" />}
                    </div>
                    <p className="text-[10px] font-bold text-white/20 truncate italic">{c.lastMessage}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
            <GlassPanel className="lg:col-span-2 h-[750px] flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
              {selectedChat ? (
                <>
                  <div className="p-8 border-b border-white/5 bg-black/40 flex justify-between items-center relative z-10">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedChat.name}</h2>
                      <div className="flex gap-3 mt-2">
                        <span className="text-[8px] font-black text-[#00F0FF] border border-[#00F0FF]/30 px-3 py-1 uppercase italic tracking-widest bg-[#00F0FF]/5">EN NEGOCIACIÓN</span>
                      </div>
                    </div>
                    <NeonButton variant="secondary" className="px-6 py-3" onClick={() => generateVariant('balanced')} disabled={aiLoading}>
                      {aiLoading ? "PROCESANDO..." : "AI SUGGEST"}
                    </NeonButton>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 space-y-6 hide-scrollbar relative z-10">
                    <AnimatePresence mode="popLayout">
                      {messages.map((m, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-6 text-[13px] font-bold uppercase tracking-tight italic ${m.fromMe ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 rounded-l-2xl' : 'bg-white/5 text-white/70 border border-white/10 rounded-r-2xl'}`}>
                            {m.body}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="p-8 border-t border-white/5 bg-black/40 relative z-10">
                    <div className="flex gap-4">
                      <input type="text" placeholder="ENVIAR RESPUESTA TÁCTICA..." className="flex-1 bg-white/5 border border-white/10 p-5 text-xs font-black text-white italic outline-none focus:border-[#00F0FF] transition-all" readOnly />
                      <button className="bg-[#00F0FF] text-slate-950 p-5 hover:scale-105 transition-all opacity-50 cursor-not-allowed"><Send size={20} /></button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-white/10 relative z-10">
                  <MessageSquare size={80} className="mb-6 opacity-5" />
                  <p className="text-[11px] font-black uppercase tracking-[1em] italic animate-pulse">Esperando Selección de Terminal</p>
                </div>
              )}
            </GlassPanel>
          </>
        )}
      </div>
    </div>
  );
}
