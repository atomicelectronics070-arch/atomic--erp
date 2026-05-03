import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  MessageSquare, Smartphone, CheckCircle2, Bot, 
  Send, RefreshCw, X, ChevronRight, Search, 
  Zap, BrainCircuit, BarChart3, Shield, Activity,
  Clock, Lock, Unlock, Settings, Terminal,
  Cpu, Sparkles, Filter, FileText
} from 'lucide-react';
import { CyberCard, NeonButton, CyberInput, GlassPanel } from '@/components/ui/CyberUI';

const API_BASE = '/api';
const WHATSAPP_SERVER = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://localhost:3001';
const SOCKET_URL = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://localhost:3001';

export default function WhatsAppDashboard() {
  const { data: session } = useSession();
  const actualUserId = session?.user?.id || 'main';
  const role = session?.user?.role || 'USER';
  
  const [activeInstance, setActiveInstance] = useState(role === 'ADMIN' ? 'corporate_main' : actualUserId);
  const [view, setView] = useState<'dashboard' | 'chats' | 'intelligence'>('dashboard');
  const [status, setStatus] = useState('disconnected');
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);

  // Advanced Config
  const [botPlan, setBotPlan] = useState("Foco en cierre de ventas rápido y amabilidad técnica extrema.");
  const [groupAutomation, setGroupAutomation] = useState(true);
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("18:00");

  useEffect(() => {
    if (!actualUserId) return;
    axios.get(`${WHATSAPP_SERVER}/health`).then(() => setBackendOnline(true)).catch(() => setBackendOnline(false));
    
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    
    // Fetch settings from DB
    axios.get(`/api/whatsapp/config`).then(res => {
        const plan = res.data.find((s: any) => s.key === 'WHATSAPP_BOT_PLAN');
        if (plan) setBotPlan(plan.value);
    }).catch(console.error);

    socket.on('qr', (data: any) => { if (data.id === activeInstance) { setQr(data.qr); setStatus('initializing'); } });
    socket.on('ready', (data: any) => { if (data.id === activeInstance) { setStatus('connected'); setQr(null); fetchChats(); } });
    socket.on('new_activity', (data: any) => {
        // En el futuro podemos manejar notificaciones aqui
    });

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
    setDeepAnalysis(null);
    try {
      const res = await axios.get(`${API_BASE}/whatsapp/messages/${activeInstance}/${chat.id}`);
      setMessages(res.data);
    } catch (e) { console.error(e); }
  };

  const initWhatsApp = async () => {
    setLoading(true);
    try { await axios.post(`${WHATSAPP_SERVER}/init`, { id: activeInstance }); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const generateVariant = async (v: string) => {
    if (!selectedChat) return;
    setAiLoading(true);
    try {
      const lastMsg = messages[messages.length - 1]?.body || '';
      const res = await axios.post(`/api/whatsapp/ai/suggest`, { 
        instanceId: activeInstance,
        chatId: selectedChat.id,
        context: lastMsg,
        variant: v,
        type: 'suggestion'
      });
      if (res.data.suggestion) setMessageInput(res.data.suggestion);
    } catch (e) { console.error(e); }
    setAiLoading(false);
  };

  const runDeepAnalysis = async () => {
    if (!selectedChat) return;
    setAiLoading(true);
    try {
        const history = messages.slice(-15).map(m => `${m.fromMe ? 'YO' : 'CLIENTE'}: ${m.body}`).join('\n');
        const res = await axios.post(`/api/whatsapp/ai/suggest`, { 
          instanceId: activeInstance,
          chatId: selectedChat.id,
          context: history,
          type: 'analysis'
        });
        setDeepAnalysis(res.data.report);
    } catch (e) { console.error(e); }
    setAiLoading(false);
  }

  const saveConfig = async () => {
    try {
        setLoading(true);
        await axios.post(`/api/whatsapp/config`, { key: 'WHATSAPP_BOT_PLAN', value: botPlan });
        alert("Plan Maestro Actualizado en el Núcleo.");
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!selectedChat || !messageInput) return;
    try {
      await axios.post(`${WHATSAPP_SERVER}/api/whatsapp/send`, { id: activeInstance, to: selectedChat.id, message: messageInput });
      setMessageInput('');
      const res = await axios.get(`${API_BASE}/whatsapp/messages/${activeInstance}/${selectedChat.id}`);
      setMessages(res.data);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="w-full min-h-screen space-y-8 pb-20 relative overflow-hidden bg-[#020617]">
      {/* Neural Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-[#00F0FF]/5 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-[#E8341A]/5 blur-[180px]" />
      </div>

      {/* Main Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12 relative z-10 p-6 lg:p-10"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-[#00F0FF] neon-text">
            <div className="p-3 bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-none"><BrainCircuit size={28} /></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-[0.5em] italic leading-none">ATOMIC NEURAL HUB</span>
              <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em] mt-1">Status: Node Active & Synchronized</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">COMMAND<span className="text-[#00F0FF] neon-text italic">CENTER</span></h1>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
            <select 
                value={activeInstance} 
                onChange={(e) => setActiveInstance(e.target.value)}
                className="bg-black/40 border border-white/10 text-[10px] font-black uppercase tracking-widest px-8 py-5 text-white outline-none focus:border-[#00F0FF] transition-all italic backdrop-blur-md"
            >
                <option value="corporate_main">🏢 Terminal Corporativa</option>
                <option value={actualUserId}>👤 Nodo Personal</option>
            </select>
            <div className="flex bg-white/5 p-1.5 border border-white/10 backdrop-blur-xl">
                <button onClick={() => setView('dashboard')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-[#00F0FF] text-slate-950' : 'text-white/40 hover:text-white'}`}>Nodo</button>
                <button onClick={() => setView('intelligence')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'intelligence' ? 'bg-[#E8341A] text-white shadow-[0_0_20px_rgba(232,52,26,0.3)]' : 'text-white/40 hover:text-white'}`}>IA Core</button>
                <button onClick={() => { setView('chats'); fetchChats(); }} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'chats' ? 'bg-[#00F0FF] text-slate-950' : 'text-white/40 hover:text-white'}`}>Chats</button>
            </div>
        </div>
      </motion.div>

      <div className="px-6 lg:px-10 relative z-10">
        <AnimatePresence mode="wait">
            {view === 'dashboard' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <CyberCard className="lg:col-span-1 text-center flex flex-col items-center justify-center min-h-[500px] border-[#00F0FF]/10">
                        {status === 'disconnected' && (
                            <div className="space-y-12 w-full max-w-xs">
                                <div className="w-32 h-32 bg-[#00F0FF]/5 border border-white/5 flex items-center justify-center mx-auto relative group">
                                    <div className="absolute inset-0 bg-[#00F0FF]/10 animate-ping opacity-20" />
                                    <Smartphone size={48} className="text-white/20 group-hover:text-[#00F0FF] transition-colors" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Terminal Offline</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Inicia la secuencia de sincronización para activar el nodo.</p>
                                </div>
                                <NeonButton className="w-full py-6" onClick={() => !loading && initWhatsApp()} disabled={loading || backendOnline === false}>
                                    {loading ? "SINCRONIZANDO..." : "VINCULAR NODO"}
                                </NeonButton>
                            </div>
                        )}
                        {status === 'initializing' && qr && (
                            <div className="space-y-10">
                                <div className="bg-white p-8 shadow-[0_0_60px_rgba(0,240,255,0.3)] skew-x-[-2deg]"><QRCodeCanvas value={qr} size={250} /></div>
                                <div className="space-y-3">
                                    <p className="text-[12px] font-black text-[#00F0FF] animate-pulse uppercase tracking-[0.5em] italic">Secuencia QR Generada</p>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">Escanea con tu terminal para enlazar el cerebro IA.</p>
                                </div>
                            </div>
                        )}
                        {status === 'connected' && (
                            <div className="space-y-10">
                                <div className="w-24 h-24 bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mx-auto text-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.2)]"><CheckCircle2 size={56} /></div>
                                <div className="space-y-3">
                                    <p className="text-3xl font-black text-white uppercase italic tracking-tighter">SISTEMA ONLINE</p>
                                    <p className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.4em] italic">Transmisión Cifrada AES-256</p>
                                </div>
                                <NeonButton variant="outline" className="w-full py-6" onClick={() => setView('chats')}>ABRIR CENTRO DE CHAT</NeonButton>
                            </div>
                        )}
                    </CyberCard>
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <CyberCard className="p-8 space-y-6">
                                <div className="flex items-center gap-4 text-[#00F0FF]">
                                    <Activity size={20} />
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Métricas del Nodo</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Uptime</p>
                                        <p className="text-2xl font-black text-white italic tracking-tighter">99.9%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Latencia IA</p>
                                        <p className="text-2xl font-black text-[#00F0FF] italic tracking-tighter">140ms</p>
                                    </div>
                                </div>
                            </CyberCard>
                            <CyberCard className="p-8 space-y-6 border-[#E8341A]/20">
                                <div className="flex items-center gap-4 text-[#E8341A]">
                                    <Zap size={20} />
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Plan Maestro Activo</h4>
                                </div>
                                <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest italic">{botPlan}</p>
                            </CyberCard>
                        </div>
                        <CyberCard className="p-10 min-h-[250px]">
                            <h2 className="text-[11px] font-black text-[#00F0FF] neon-text uppercase tracking-[0.5em] italic mb-10 flex items-center gap-4"><Terminal size={18} /> Logs de Inteligencia Recientes</h2>
                            <div className="space-y-6 max-h-[300px] overflow-y-auto hide-scrollbar">
                                <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] text-center py-12 italic">Esperando eventos neuronales del bot...</div>
                            </div>
                        </CyberCard>
                    </div>
                </motion.div>
            )}

            {view === 'intelligence' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CyberCard className="p-10 space-y-10">
                        <div className="flex items-center gap-4 text-[#E8341A]">
                            <Settings size={24} />
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Configuración Profunda</h2>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Plan de Comportamiento Maestro</label>
                                <textarea 
                                    value={botPlan}
                                    onChange={(e) => setBotPlan(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-8 text-sm font-bold text-white italic outline-none focus:border-[#E8341A] transition-all min-h-[150px] leading-relaxed uppercase tracking-widest"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6 p-8 bg-white/5 border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-[#00F0FF]">
                                            <Clock size={18} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Ciclo Operativo</span>
                                        </div>
                                        <input type="checkbox" checked={groupAutomation} onChange={() => setGroupAutomation(!groupAutomation)} className="accent-[#00F0FF]" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Apertura</span>
                                            <input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="w-full bg-black/40 border border-white/10 p-3 text-xs text-white outline-none" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Cierre</span>
                                            <input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="w-full bg-black/40 border border-white/10 p-3 text-xs text-white outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 p-8 bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3 text-[#E8341A]">
                                        <Shield size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Protocolo de Grupos</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-white/40 uppercase leading-relaxed italic">
                                        Al cerrar el ciclo, el bot restringirá el envío de mensajes en grupos y enviará un reporte de cierre automático.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <NeonButton 
                            variant="secondary" 
                            className="w-full py-6 uppercase font-black italic tracking-[0.5em]"
                            onClick={saveConfig}
                            disabled={loading}
                        >
                            {loading ? "Sincronizando Núcleo..." : "Guardar Nueva Estrategia"}
                        </NeonButton>
                    </CyberCard>
                    <CyberCard className="p-10 space-y-8 bg-gradient-to-br from-black to-[#00F0FF]/5">
                        <div className="flex items-center gap-4 text-[#00F0FF]">
                            <BarChart3 size={24} />
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Análisis de Nodo (BI)</h2>
                        </div>
                        <div className="space-y-8">
                            <div className="p-8 border border-[#00F0FF]/20 bg-[#00F0FF]/5 space-y-4">
                                <p className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.5em] italic">Resumen de 30 Chats Recientes</p>
                                <p className="text-sm font-bold text-white/60 leading-relaxed italic">
                                    "La tendencia de hoy muestra un alto interés en cotizaciones de software ERP. El 70% de los clientes solicita integración con facturación electrónica. El tono general de las conversaciones es positivo."
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-6 space-y-2">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Leads Calientes</p>
                                    <p className="text-2xl font-black text-white italic tracking-tighter">12</p>
                                </div>
                                <div className="bg-white/5 p-6 space-y-2">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Sentimiento Promedio</p>
                                    <p className="text-2xl font-black text-emerald-500 italic tracking-tighter">Optimista</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-end">
                            <NeonButton variant="outline" className="w-full py-6 text-[#00F0FF] border-[#00F0FF]/30 hover:bg-[#00F0FF]/10 uppercase font-black italic tracking-[0.4em] gap-3">
                                <Sparkles size={18} /> Generar Reporte Completo de Hoy
                            </NeonButton>
                        </div>
                    </CyberCard>
                </motion.div>
            )}

            {view === 'chats' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[800px]">
                    {/* Inbox Sidebar */}
                    <GlassPanel className="lg:col-span-1 flex flex-col border-white/5 bg-black/40">
                        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">Bandeja Activa</p>
                                <Filter size={14} className="text-white/20" />
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                <input type="text" placeholder="BUSCAR TERMINAL..." className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-[10px] font-black text-white italic outline-none focus:border-[#00F0FF] transition-all" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-2">
                            {chats.map(c => (
                                <div key={c.id} onClick={() => selectChat(c)} className={`p-6 cursor-pointer transition-all border-l-4 ${selectedChat?.id === c.id ? 'bg-[#00F0FF]/10 border-[#00F0FF]' : 'border-transparent hover:bg-white/5'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-black text-[13px] text-white uppercase tracking-tighter truncate leading-none">{c.name}</p>
                                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{new Date(c.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/30 truncate italic uppercase tracking-widest leading-none">{c.lastMessage || 'SIN MENSAJES'}</p>
                                </div>
                            ))}
                            {chats.length === 0 && <div className="text-center py-20 text-[9px] font-black text-white/10 uppercase tracking-widest italic">No se detectaron chats activos.</div>}
                        </div>
                    </GlassPanel>

                    {/* Chat Main Area */}
                    <div className="lg:col-span-3 flex flex-col gap-8">
                        <GlassPanel className="flex-1 flex flex-col relative overflow-hidden border-white/5 bg-black/40">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
                            {selectedChat ? (
                                <>
                                    <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center relative z-10 backdrop-blur-md">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center italic text-xl font-black text-[#00F0FF]">{selectedChat.name[0]}</div>
                                            <div>
                                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedChat.name}</h2>
                                                <div className="flex gap-4 mt-2">
                                                    <span className="text-[8px] font-black text-[#00F0FF] border border-[#00F0FF]/20 px-3 py-1 uppercase italic tracking-[0.2em] bg-[#00F0FF]/5">SESIÓN ACTIVA</span>
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] italic">{selectedChat.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={runDeepAnalysis}
                                                disabled={aiLoading}
                                                className="px-8 py-4 bg-[#E8341A] text-white text-[10px] font-black uppercase tracking-[0.3em] italic hover:scale-105 transition-all shadow-lg shadow-[#E8341A]/20 flex items-center gap-3 disabled:opacity-50"
                                            >
                                                <Sparkles size={16} /> {aiLoading ? "PROCESANDO..." : "DEEP ANALYSIS"}
                                            </button>
                                            <div className="flex bg-white/5 p-1 border border-white/10">
                                                <button onClick={() => generateVariant('friendly')} className="p-3 text-white/40 hover:text-white transition-colors" title="Tono Amigable"><Sparkles size={16} /></button>
                                                <button onClick={() => generateVariant('direct')} className="p-3 text-white/40 hover:text-white transition-colors" title="Tono Directo"><Zap size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-12 space-y-10 hide-scrollbar relative z-10">
                                        <AnimatePresence mode="popLayout">
                                            {messages.map((m, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className="flex flex-col max-w-[75%] gap-2">
                                                        <div className={`p-8 text-[13px] font-bold uppercase tracking-tight italic ${m.fromMe ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-l-3xl rounded-tr-3xl shadow-[0_0_20px_rgba(0,240,255,0.05)]' : 'bg-white/5 text-white/80 border border-white/10 rounded-r-3xl rounded-tl-3xl'}`}>
                                                            {m.body}
                                                        </div>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest text-white/10 ${m.fromMe ? 'text-right' : 'text-left'}`}>
                                                            {new Date(m.timestamp * 1000).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        
                                        {deepAnalysis && (
                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 bg-[#E8341A]/5 border border-[#E8341A]/30 space-y-6 relative group">
                                                <div className="absolute top-4 right-6 text-[10px] font-black text-[#E8341A] uppercase tracking-[0.5em] italic">REPORTE IA</div>
                                                <div className="flex items-center gap-4 text-[#E8341A]">
                                                    <FileText size={20} />
                                                    <h4 className="text-[12px] font-black uppercase tracking-widest italic">Análisis Táctico de Cuenta</h4>
                                                </div>
                                                <p className="text-[13px] font-bold text-white/80 leading-relaxed uppercase tracking-wide italic">
                                                    {deepAnalysis}
                                                </p>
                                                <div className="pt-4 flex gap-4">
                                                    <button onClick={() => setDeepAnalysis(null)} className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">Cerrar Análisis</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="p-10 border-t border-white/5 bg-white/[0.02] relative z-10">
                                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-6">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="text" 
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    placeholder="ENVIAR RESPUESTA TÁCTICA..." 
                                                    className="w-full bg-white/5 border border-white/10 p-6 text-xs font-black text-white italic outline-none focus:border-[#00F0FF] transition-all" 
                                                />
                                                <button type="button" onClick={() => generateVariant('balanced')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#00F0FF] hover:scale-110 transition-all"><Sparkles size={18} /></button>
                                            </div>
                                            <button 
                                                type="submit"
                                                className="bg-[#00F0FF] text-slate-950 px-10 py-6 hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] flex items-center justify-center"
                                            >
                                                <Send size={24} />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-white/10 relative z-10 p-20 text-center">
                                    <div className="w-32 h-32 bg-white/5 border border-white/5 flex items-center justify-center mb-10 rotate-45 group-hover:rotate-0 transition-transform duration-700">
                                        <MessageSquare size={48} className="-rotate-45 opacity-10" />
                                    </div>
                                    <p className="text-[12px] font-black uppercase tracking-[1em] italic animate-pulse">Neural Waiting Sequence</p>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-6 max-w-xs">Selecciona un canal de comunicación para iniciar el procesamiento de datos.</p>
                                </div>
                            )}
                        </GlassPanel>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
