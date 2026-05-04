"use client"
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
  
  const [view, setView] = useState<'dashboard' | 'chats' | 'intelligence' | 'training'>('dashboard');
  const [activeInstance, setActiveInstance] = useState('corporate_main');
  const [status, setStatus] = useState('disconnected');
  const [socketConnected, setSocketConnected] = useState(false);
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
    
    const socket = io(SOCKET_URL, { 
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10
    });
    
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    // Fetch settings from DB
    axios.get(`/api/whatsapp/config`).then(res => {
        const plan = res.data.find((s: any) => s.key === 'WHATSAPP_BOT_PLAN');
        if (plan) setBotPlan(plan.value);
    }).catch(console.error);

    socket.on('qr', (data: any) => { 
        console.log("QR RECEIVED:", data);
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
    setQr(null);
    try { 
        await axios.post(`${WHATSAPP_SERVER}/init`, { id: activeInstance }); 
        setStatus('initializing');
    } catch (e) { 
        console.error(e); 
        alert("Falla en el despliegue del nodo. Verifique el servidor de WhatsApp.");
    }
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
    <div className="w-full min-h-screen pb-20 relative overflow-hidden bg-[#020617] selection:bg-[#00F0FF]/20 selection:text-[#00F0FF]">
      {/* Dynamic Cyber Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00F0FF]/10 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#E8341A]/10 blur-[200px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.05]" />
      </div>

      {/* High-Tech Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 px-8 py-10 lg:px-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-white/5 bg-slate-950/20 backdrop-blur-3xl"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
                <div className="absolute inset-0 bg-[#00F0FF] blur-xl opacity-20 animate-pulse" />
                <div className="relative w-16 h-16 bg-slate-950 border-2 border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                    <Smartphone size={32} />
                </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] uppercase font-black tracking-[0.8em] text-[#00F0FF] italic leading-none mb-2">NEURAL_SYNC_PROTOCOL</span>
              <h1 className="text-5xl lg:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">WHATSAPP<span className="text-[#00F0FF] italic">.CORE</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-[#00F0FF] animate-pulse' : 'bg-red-500'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">SOCKET_STATUS: {socketConnected ? 'VINCULADO' : 'BUSCANDO_FRECUENCIA'}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full lg:w-auto items-center">
            <div className="relative group w-full md:w-80">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00F0FF] to-[#E8341A] opacity-20 group-hover:opacity-50 blur transition duration-500" />
                <select 
                    value={activeInstance} 
                    onChange={(e) => setActiveInstance(e.target.value)}
                    className="relative w-full bg-slate-950 border border-white/10 text-[11px] font-black uppercase tracking-widest px-8 py-5 text-white outline-none focus:border-[#00F0FF] transition-all italic appearance-none cursor-pointer"
                >
                    <option value="corporate_main">TERMINAL_CORPORATIVA_01</option>
                    <option value={actualUserId}>NODO_INDIVIDUAL_${actualUserId.substring(0,6)}</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#00F0FF]"><ChevronRight size={16} className="rotate-90" /></div>
            </div>
            
            <div className="flex bg-slate-950/80 p-1.5 border border-white/10 shadow-2xl">
                <button onClick={() => setView('dashboard')} className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest transition-all skew-x-[-12deg] ${view === 'dashboard' ? 'bg-[#00F0FF] text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]' : 'text-white/40 hover:text-white'}`}>
                    <span className="skew-x-[12deg] block">SINCRONIZACIÓN</span>
                </button>
                <button onClick={() => setView('training')} className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest transition-all skew-x-[-12deg] ${view === 'training' ? 'bg-indigo-600 text-white shadow-[0_0_25px_rgba(79,70,229,0.4)]' : 'text-white/40 hover:text-white'}`}>
                    <span className="skew-x-[12deg] block">NEURAL_TRAINER</span>
                </button>
                <button onClick={() => setView('intelligence')} className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest transition-all skew-x-[-12deg] ${view === 'intelligence' ? 'bg-[#E8341A] text-white shadow-[0_0_25px_rgba(232,52,26,0.4)]' : 'text-white/40 hover:text-white'}`}>
                    <span className="skew-x-[12deg] block">IA_PLANNER</span>
                </button>
                <button onClick={() => { setView('chats'); fetchChats(); }} className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest transition-all skew-x-[-12deg] ${view === 'chats' ? 'bg-white text-slate-950' : 'text-white/40 hover:text-white'}`}>
                    <span className="skew-x-[12deg] block">RADAR_CHATS</span>
                </button>
            </div>
        </div>
      </motion.div>

      <div className="px-8 lg:px-14 pt-12 relative z-10">
        <AnimatePresence mode="wait">
            {view === 'dashboard' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Connection Matrix Area */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-b from-[#00F0FF]/20 to-transparent opacity-50 blur-2xl pointer-events-none" />
                            <CyberCard className="relative overflow-hidden min-h-[600px] flex flex-col items-center justify-center border-white/5 !bg-slate-950/40 backdrop-blur-2xl p-12">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-40" />
                                
                                {status === 'disconnected' && !loading && (
                                    <div className="text-center space-y-12 w-full">
                                        <div className="w-40 h-40 border border-white/5 bg-white/[0.02] flex items-center justify-center mx-auto relative">
                                            <div className="absolute inset-0 border border-[#00F0FF]/20 animate-pulse" />
                                            <Smartphone size={64} className="text-white/10 group-hover:text-[#00F0FF] transition-all duration-700 group-hover:scale-110" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">NODO_OFFLINE</h3>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-relaxed">Secuencia de enlace requerida para activar transmisi\u00f3n.</p>
                                        </div>
                                        <button 
                                            onClick={initWhatsApp}
                                            className="w-full bg-white text-slate-950 py-6 font-black uppercase italic tracking-[0.5em] text-xs hover:bg-[#00F0FF] transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] active:scale-95"
                                        >
                                            INICIAR VINCULACI\u00d3N
                                        </button>
                                    </div>
                                )}

                                {(loading || (status === 'initializing' && !qr)) && (
                                    <div className="text-center space-y-12">
                                        <div className="w-32 h-32 flex items-center justify-center mx-auto relative">
                                            <div className="absolute inset-0 border-4 border-[#00F0FF]/20 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-t-[#00F0FF] rounded-full animate-spin" />
                                            <Cpu size={40} className="text-[#00F0FF] animate-pulse" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[12px] font-black text-[#00F0FF] uppercase tracking-[0.8em] animate-pulse italic">Cargando_Núcleo</p>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">Sincronizando protocolos de enlace...</p>
                                        </div>
                                    </div>
                                )}

                                {status === 'initializing' && qr && (
                                    <div className="text-center space-y-10 animate-in zoom-in duration-500">
                                        <div className="relative p-1 bg-gradient-to-br from-[#00F0FF] to-[#E8341A] shadow-[0_0_70px_rgba(0,240,255,0.2)]">
                                            <div className="bg-white p-6">
                                                <QRCodeCanvas value={qr} size={280} level="H" includeMargin />
                                            </div>
                                            <div className="absolute -top-4 -left-4 bg-slate-950 border border-[#00F0FF] p-2 text-[#00F0FF]"><Lock size={16}/></div>
                                            <div className="absolute -bottom-4 -right-4 bg-slate-950 border border-[#E8341A] p-2 text-[#E8341A]"><RefreshCw size={16} onClick={initWhatsApp} className="cursor-pointer hover:rotate-180 transition-all"/></div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[14px] font-black text-white uppercase tracking-[0.4em] italic">ESCANEA PARA CONECTAR</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic max-w-[250px] mx-auto leading-relaxed">Abre WhatsApp en tu terminal {'>'} Dispositivos vinculados {'>'} Vincular dispositivo.</p>
                                        </div>
                                        <button onClick={initWhatsApp} className="text-[10px] font-black text-[#00F0FF] uppercase tracking-widest hover:underline flex items-center gap-3 mx-auto opacity-60 hover:opacity-100 transition-all">
                                            <RefreshCw size={14} /> FORZAR REGENERACI\u00d3N
                                        </button>
                                    </div>
                                )}

                                {status === 'connected' && (
                                    <div className="text-center space-y-12 animate-in fade-in duration-700">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-[#00F0FF] blur-3xl opacity-20 animate-pulse" />
                                            <div className="w-48 h-48 bg-[#00F0FF]/10 border-2 border-[#00F0FF] flex items-center justify-center mx-auto text-[#00F0FF] shadow-[0_0_50px_rgba(0,240,255,0.3)]">
                                                <CheckCircle2 size={80} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">NODO_ONLINE</h3>
                                            <div className="flex items-center justify-center gap-3">
                                                <span className="w-2 h-2 bg-[#00F0FF] animate-ping" />
                                                <p className="text-[11px] font-black text-[#00F0FF] uppercase tracking-[0.6em] italic leading-none">Canal de Datos Activo</p>
                                            </div>
                                        </div>
                                        <div className="pt-8 border-t border-white/5 space-y-4">
                                             <button onClick={() => setView('chats')} className="w-full bg-[#00F0FF] text-slate-950 py-5 font-black uppercase italic tracking-[0.4em] text-xs hover:bg-white transition-all shadow-[0_20px_40px_-10px_rgba(0,240,255,0.2)]">
                                                ACCEDER AL RADAR
                                            </button>
                                            <button onClick={initWhatsApp} className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all italic">REINICIAR_TRANSMISI\u00d3N</button>
                                        </div>
                                    </div>
                                )}
                            </CyberCard>
                        </div>
                    </div>

                    {/* Operational Metrics & Logs */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <CyberCard className="p-10 border-white/5 !bg-slate-950/40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all duration-700">
                                    <Activity size={80} className="text-[#00F0FF]" />
                                </div>
                                <div className="flex items-center gap-4 text-[#00F0FF] mb-10">
                                    <Activity size={20} />
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] italic leading-none">Rendimiento Neuronal</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Disponibilidad</p>
                                        <p className="text-4xl font-black text-white italic tracking-tighter leading-none">100<span className="text-[14px] text-slate-700 ml-1">%</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Respuesta IA</p>
                                        <p className="text-4xl font-black text-[#00F0FF] italic tracking-tighter leading-none">0.8<span className="text-[14px] text-slate-700 ml-1">S</span></p>
                                    </div>
                                </div>
                                <div className="mt-10 h-1 w-full bg-white/5">
                                    <div className="h-full bg-gradient-to-r from-[#00F0FF] to-transparent w-[85%] animate-pulse" />
                                </div>
                            </CyberCard>

                            <CyberCard className="p-10 border-white/5 !bg-slate-950/40 border-l-[#E8341A]/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all duration-700">
                                    <Bot size={80} className="text-[#E8341A]" />
                                </div>
                                <div className="flex items-center gap-4 text-[#E8341A] mb-8">
                                    <Zap size={20} />
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] italic leading-none">Estrategia Activa</h4>
                                </div>
                                <p className="text-[12px] font-bold text-white/70 leading-relaxed uppercase tracking-wider italic mb-8 h-12 overflow-hidden line-clamp-2">
                                    {botPlan}
                                </p>
                                <button onClick={() => setView('intelligence')} className="text-[10px] font-black text-[#E8341A] uppercase tracking-[0.3em] italic hover:underline flex items-center gap-3">
                                    RECALIBRAR N\u00daCLEO <ChevronRight size={14} />
                                </button>
                            </CyberCard>
                        </div>

                        <CyberCard className="p-12 border-white/5 !bg-slate-950/40 relative overflow-hidden">
                             <div className="flex items-center justify-between mb-12">
                                <h2 className="text-[12px] font-black text-[#00F0FF] uppercase tracking-[0.6em] italic flex items-center gap-4">
                                    <Terminal size={20} /> LOGS_DE_OPERACI\u00d3N_NATIVA
                                </h2>
                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic animate-pulse">SISTEMA_ESCUCHANDO...</span>
                             </div>
                             <div className="space-y-6 font-mono text-[11px] h-[250px] overflow-y-auto hide-scrollbar">
                                <div className="flex gap-6 border-l-2 border-[#00F0FF]/20 pl-6 py-1">
                                    <span className="text-[#00F0FF]/40">[18:29:37]</span>
                                    <span className="text-white/60">INICIALIZANDO SUBSISTEMA DE COMUNICACIONES...</span>
                                </div>
                                <div className="flex gap-6 border-l-2 border-white/5 pl-6 py-1">
                                    <span className="text-white/10">[18:29:38]</span>
                                    <span className="text-white/30">CONECTANDO AL SERVIDOR DE WHATSAPP: {WHATSAPP_SERVER}</span>
                                </div>
                                <div className="flex gap-6 border-l-2 border-[#E8341A]/20 pl-6 py-1">
                                    <span className="text-[#E8341A]/40">[18:29:40]</span>
                                    <span className="text-white/60">PROTOCOLO DE SEGURIDAD AES ACTIVADO PARA EL NODO {activeInstance}</span>
                                </div>
                                {status === 'connected' && (
                                     <div className="flex gap-6 border-l-2 border-emerald-500/20 pl-6 py-1">
                                        <span className="text-emerald-500/40">[SINC]</span>
                                        <span className="text-emerald-400">ENLACE ESTABLECIDO CON ÉXITO. NODO OPERATIVO.</span>
                                    </div>
                                )}
                                <div className="py-10 text-center opacity-10 italic uppercase font-black tracking-[1em]">Fin de Transmisi\u00f3n Actual</div>
                             </div>
                        </CyberCard>
                    </div>
                </motion.div>
            )}

            {view === 'training' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-10">
                        <CyberCard className="p-12 !bg-indigo-600/5 border-indigo-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-all duration-700">
                                <BrainCircuit size={80} className="text-indigo-400" />
                            </div>
                            <div className="flex items-center gap-6 text-indigo-400 mb-10">
                                <Sparkles size={28} />
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">PROTOCOLO_GUÍA</h2>
                            </div>
                            <p className="text-[12px] font-bold text-white/60 leading-relaxed uppercase tracking-wider italic mb-8">
                                "SISTEMA DE CAPACITACIÓN ACTIVO. ESTOY VINCULADO A TU MEMORIA DE VENTAS Y AL CEREBRO CENTRAL DE ATOMIC PARA ASISTIRTE EN CADA MOVIMIENTO TÁCTICO."
                            </p>
                            <div className="space-y-4">
                                <div className="p-6 bg-black/40 border border-indigo-500/10 flex items-center justify-between group/item hover:border-indigo-500 transition-all cursor-pointer">
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic">Simular Objeción de Precio</span>
                                    <ChevronRight size={14} className="group-hover/item:translate-x-2 transition-transform" />
                                </div>
                                <div className="p-6 bg-black/40 border border-indigo-500/10 flex items-center justify-between group/item hover:border-indigo-500 transition-all cursor-pointer">
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic">Generar Cotización Express</span>
                                    <FileText size={14} className="group-hover/item:translate-x-2 transition-transform" />
                                </div>
                                <div className="p-6 bg-black/40 border border-indigo-500/10 flex items-center justify-between group/item hover:border-indigo-500 transition-all cursor-pointer">
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic">Resumen de Cuenta del Cliente</span>
                                    <Search size={14} className="group-hover/item:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </CyberCard>

                        <div className="glass-panel p-10 border-white/5 !bg-slate-950/40 space-y-8">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Capacidades de Memoria</h4>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase italic">HISTORIAL_CRM</span>
                                <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase italic">CATALOGO_PRO</span>
                                <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase italic">SCRIPT_VENTAS</span>
                                <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase italic">ESTADO: ONLINE</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 glass-panel border-white/5 bg-slate-950/60 flex flex-col h-[750px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
                        
                        {/* Trainer Header */}
                        <div className="p-10 border-b border-white/5 bg-indigo-600/5 backdrop-blur-3xl flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 bg-slate-950 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 italic font-black text-2xl shadow-[0_0_30px_rgba(79,70,229,0.3)]">NT</div>
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">NEURAL_TRAINER.v1</h2>
                                <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.4em] italic">Cerebro de Apoyo Individualizado</p>
                            </div>
                        </div>

                        {/* Trainer Chat Area */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar relative z-10">
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-8 bg-indigo-600/10 border border-indigo-500/20 text-white italic font-medium uppercase tracking-wider text-sm leading-relaxed rounded-none rounded-tr-[2rem]">
                                    Hola elemento {session?.user?.name || 'operativo'}. Estoy listo para tu sesión de hoy. ¿En qué frente de batalla necesitas apoyo? Puedo ayudarte a pulir una oferta, practicar una venta difícil o buscar datos en tu CRM.
                                </div>
                            </div>
                        </div>

                        {/* Trainer Input */}
                        <div className="p-10 border-t border-white/5 bg-slate-950 relative z-10">
                            <div className="flex gap-6 items-center">
                                <input 
                                    type="text" 
                                    placeholder="CONSULTAR AL CAPACITADOR..." 
                                    className="flex-1 bg-black/60 border border-white/10 p-6 text-[12px] font-black text-white italic outline-none focus:border-indigo-500 transition-all uppercase tracking-widest"
                                />
                                <button className="bg-indigo-600 text-white p-6 hover:bg-white hover:text-indigo-600 transition-all shadow-2xl group active:scale-95">
                                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {view === 'intelligence' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <CyberCard className="p-12 space-y-12 !bg-slate-950/60 border-white/5">
                        <div className="flex items-center gap-6 text-[#E8341A]">
                            <div className="p-4 bg-[#E8341A]/10 border border-[#E8341A]/20"><Settings size={32} /></div>
                            <div>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter">RECALIBRACI\u00d3N</h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Configuraci\u00f3n del Cerebro IA</p>
                            </div>
                        </div>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-[#E8341A] uppercase tracking-[0.5em] ml-1 italic">Plan Maestro de Comportamiento</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-white/5 opacity-20 blur transition duration-500" />
                                    <textarea 
                                        value={botPlan}
                                        onChange={(e) => setBotPlan(e.target.value)}
                                        className="relative w-full bg-slate-900/80 border border-white/10 p-10 text-base font-bold text-white italic outline-none focus:border-[#E8341A] transition-all min-h-[220px] leading-relaxed uppercase tracking-wider custom-scrollbar"
                                        placeholder="DEFINE AQU\u00cd LA PERSONALIDAD Y OBJETIVOS DEL BOT..."
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8 p-10 bg-white/[0.02] border border-white/5 backdrop-blur-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-[#00F0FF]">
                                            <Clock size={20} />
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">CICLO_HORARIO</span>
                                        </div>
                                        <input type="checkbox" checked={groupAutomation} onChange={() => setGroupAutomation(!groupAutomation)} className="w-5 h-5 accent-[#00F0FF] cursor-pointer" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Ignici\u00f3n</span>
                                            <input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-xs text-[#00F0FF] font-black outline-none focus:border-[#00F0FF]" />
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Hibernaci\u00f3n</span>
                                            <input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-xs text-[#00F0FF] font-black outline-none focus:border-[#00F0FF]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 p-10 bg-[#E8341A]/5 border border-[#E8341A]/10 backdrop-blur-md">
                                    <div className="flex items-center gap-4 text-[#E8341A]">
                                        <Shield size={20} />
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">ESCUDO_GRUPOS</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-white/50 uppercase leading-relaxed italic tracking-wide">
                                        Al cerrar el ciclo operativo, el bot restringir\u00e1 el env\u00edo de mensajes en grupos y generar\u00e1 un reporte de cierre cifrado.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={saveConfig}
                            disabled={loading}
                            className="w-full bg-[#E8341A] text-white py-7 text-sm font-black uppercase tracking-[0.6em] italic shadow-[0_25px_50px_-15px_rgba(232,52,26,0.5)] hover:bg-white hover:text-[#E8341A] transition-all active:scale-95"
                        >
                            {loading ? "SINCRONIZANDO N\u00daCLEO..." : "GUARDAR ESTRATEGIA MAESTRA"}
                        </button>
                    </CyberCard>
                    
                    <div className="space-y-10">
                        <CyberCard className="p-12 space-y-10 !bg-slate-950/40 border-white/5 border-r-[#00F0FF]/30">
                            <div className="flex items-center gap-4 text-[#00F0FF]">
                                <BarChart3 size={28} />
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">AN\u00c1LISIS_BI</h2>
                            </div>
                            <div className="space-y-8">
                                <div className="p-10 border border-[#00F0FF]/20 bg-[#00F0FF]/5 relative">
                                    <div className="absolute top-4 right-6 text-[9px] font-black text-[#00F0FF]/40 uppercase italic tracking-widest">NEMOTRON_INSIGHT</div>
                                    <p className="text-[11px] font-black text-[#00F0FF] uppercase tracking-[0.5em] italic mb-6">Resumen Cognitivo de Hoy</p>
                                    <p className="text-base font-bold text-white/70 leading-relaxed italic uppercase tracking-wide">
                                        "FLUJO DE LEADS EN AUMENTO. INTER\u00c9S CR\u00cdTICO EN SISTEMAS ERP Y AUTOMATIZACI\u00d3N. SENTIMIENTO GENERAL DE LA RED: ALTA DISPOSICI\u00d3N DE COMPRA."
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="bg-slate-900 border border-white/5 p-8 space-y-3">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Leads Calientes</p>
                                        <p className="text-5xl font-black text-white italic tracking-tighter leading-none">24</p>
                                    </div>
                                    <div className="bg-slate-900 border border-white/5 p-8 space-y-3">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Tono de Red</p>
                                        <p className="text-3xl font-black text-emerald-500 italic tracking-tighter leading-none uppercase">POSITIVO</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full border-2 border-[#00F0FF]/30 text-[#00F0FF] py-6 text-xs font-black uppercase tracking-[0.4em] italic hover:bg-[#00F0FF]/10 transition-all flex items-center justify-center gap-4 group">
                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" /> GENERAR REPORTE_PROFUNDO_PDF
                            </button>
                        </CyberCard>
                        
                        <div className="glass-panel p-10 border-white/5 !bg-indigo-500/5 flex flex-col items-center justify-center text-center space-y-6">
                             <Shield size={40} className="text-indigo-400 opacity-20" />
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-relaxed">
                                Todos los datos procesados por la IA son anonimizados y cifrados antes de la transmisi\u00f3n al núcleo central de Atomic Solutions.
                             </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {view === 'chats' && (
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[850px]">
                    
                    {/* Inbox Terminal */}
                    <div className="lg:col-span-4 flex flex-col glass-panel border-white/5 bg-slate-950/40 overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-white/5 bg-white/[0.02] space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[12px] font-black text-[#00F0FF] uppercase tracking-[0.6em] italic leading-none">RADAR_OPERATIVO</h3>
                                <div className="flex gap-4">
                                    <button onClick={fetchChats} className="text-slate-600 hover:text-[#00F0FF] transition-colors"><RefreshCw size={16} /></button>
                                    <Filter size={16} className="text-slate-700" />
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#00F0FF]/10 opacity-0 group-focus-within:opacity-100 blur-xl transition-all" />
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="BUSCAR FRECUENCIA..." 
                                    className="relative w-full bg-black/60 border border-white/10 p-6 pl-16 text-[11px] font-black text-white italic outline-none focus:border-[#00F0FF] transition-all uppercase tracking-widest" 
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                            {chats.length === 0 && (
                                <div className="py-40 text-center space-y-6 opacity-20">
                                    <Activity size={60} className="mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Sin Actividad en Red</p>
                                </div>
                            )}
                            {chats.map(c => (
                                <motion.div 
                                    whileHover={{ x: 10 }}
                                    key={c.id} 
                                    onClick={() => selectChat(c)} 
                                    className={`p-8 cursor-pointer transition-all border-l-4 relative group ${selectedChat?.id === c.id ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-inner' : 'border-transparent hover:bg-white/5'}`}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="font-black text-sm text-white uppercase tracking-tighter truncate leading-none italic">{c.name}</p>
                                        <span className="text-[9px] font-black text-slate-700 uppercase italic tracking-widest">{new Date(c.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 truncate italic uppercase tracking-widest leading-none group-hover:text-slate-300 transition-colors">{c.lastMessage || 'CANAL_VAC\u00cdO'}</p>
                                    {selectedChat?.id === c.id && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Command Area */}
                    <div className="lg:col-span-8 flex flex-col glass-panel border-white/5 bg-slate-950/60 relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
                        
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-10 border-b border-white/5 bg-white/[0.03] flex justify-between items-center relative z-10 backdrop-blur-3xl">
                                    <div className="flex items-center gap-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-[#00F0FF] blur-xl opacity-20" />
                                            <div className="relative w-20 h-20 bg-slate-950 border-2 border-[#00F0FF] flex items-center justify-center italic text-3xl font-black text-[#00F0FF] shadow-2xl">{selectedChat.name[0]}</div>
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">{selectedChat.name}</h2>
                                            <div className="flex gap-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase italic tracking-[0.3em]">Cifrado_Seguro</span>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">{selectedChat.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <button 
                                            onClick={runDeepAnalysis}
                                            disabled={aiLoading}
                                            className="px-10 py-5 bg-[#E8341A] text-white text-[11px] font-black uppercase tracking-[0.4em] italic hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(232,52,26,0.3)] flex items-center gap-4 disabled:opacity-50"
                                        >
                                            <Sparkles size={20} className={aiLoading ? 'animate-spin' : ''} /> {aiLoading ? "PROCESANDO..." : "DEEP_AN\u00c1LISIS"}
                                        </button>
                                        <div className="flex bg-slate-900 p-1.5 border border-white/10">
                                            <button onClick={() => generateVariant('friendly')} className="p-4 text-slate-600 hover:text-[#00F0FF] transition-all" title="IA_AMABLE"><Sparkles size={20} /></button>
                                            <button onClick={() => generateVariant('direct')} className="p-4 text-slate-600 hover:text-[#E8341A] transition-all" title="IA_DIRECTA"><Zap size={20} /></button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Messages Radar Area */}
                                <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar relative z-10 bg-black/20">
                                    <AnimatePresence mode="popLayout">
                                        {messages.map((m, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, x: m.fromMe ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className="flex flex-col max-w-[80%] gap-3">
                                                    <div className={`p-10 text-[15px] font-bold uppercase tracking-tight italic relative shadow-2xl ${m.fromMe ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-none rounded-tl-[3rem]' : 'bg-slate-900/80 text-white/90 border border-white/10 rounded-none rounded-tr-[3rem]'}`}>
                                                        {m.body}
                                                        {m.fromMe && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />}
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic ${m.fromMe ? 'text-right' : 'text-left'}`}>
                                                        T_STAMP: {new Date(m.timestamp * 1000).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    {deepAnalysis && (
                                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="p-12 bg-[#E8341A]/10 border-2 border-[#E8341A]/30 relative group shadow-2xl backdrop-blur-xl">
                                            <div className="absolute top-6 right-8 text-[11px] font-black text-[#E8341A] uppercase tracking-[0.6em] italic">REPORTE_TACTICO_IA</div>
                                            <div className="flex items-center gap-6 text-[#E8341A] mb-8">
                                                <div className="p-3 bg-[#E8341A]/20 border border-[#E8341A]/30"><FileText size={24} /></div>
                                                <h4 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Inteligencia de Cuenta</h4>
                                            </div>
                                            <p className="text-lg font-bold text-white leading-relaxed uppercase tracking-wide italic mb-10">
                                                {deepAnalysis}
                                            </p>
                                            <button onClick={() => setDeepAnalysis(null)} className="text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-[0.5em] transition-all italic flex items-center gap-3">
                                                <X size={16} /> FINALIZAR_LECTURA
                                            </button>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Tactical Input Terminal */}
                                <div className="p-12 border-t border-white/5 bg-slate-950 relative z-10">
                                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-8 items-end">
                                        <div className="flex-1 relative group">
                                            <div className="absolute -inset-0.5 bg-[#00F0FF]/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-all" />
                                            <textarea 
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                placeholder="INICIAR TRANSMISI\u00d3N DE DATOS..." 
                                                className="relative w-full bg-slate-900 border border-white/10 p-8 text-sm font-black text-white italic outline-none focus:border-[#00F0FF] transition-all uppercase tracking-widest min-h-[100px] resize-none custom-scrollbar" 
                                            />
                                            <button type="button" onClick={() => generateVariant('balanced')} className="absolute right-6 bottom-6 p-3 text-[#00F0FF] hover:scale-125 transition-all animate-pulse" title="SUGERIR_IA"><Sparkles size={24} /></button>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={!messageInput || loading}
                                            className="bg-[#00F0FF] text-slate-950 h-[100px] px-14 hover:bg-white transition-all shadow-[0_25px_50px_-15px_rgba(0,240,255,0.4)] flex items-center justify-center active:scale-95 group"
                                        >
                                            <Send size={32} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                    </form>
                                    <p className="mt-8 text-center text-[10px] font-black text-slate-800 uppercase tracking-[0.8em] italic leading-none">Protocolo de Salida: Sincronizaci\u00f3n End-to-End Nativa</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-24 text-center">
                                <div className="w-48 h-48 border-2 border-dashed border-white/10 flex items-center justify-center mb-12 rotate-45 group-hover:rotate-0 transition-all duration-1000 relative">
                                    <div className="absolute inset-0 bg-white/5 blur-3xl opacity-20" />
                                    <MessageSquare size={80} className="-rotate-45 opacity-5" />
                                </div>
                                <p className="text-2xl font-black uppercase tracking-[1em] italic text-white/10 animate-pulse">RADAR_EN_ESPERA</p>
                                <p className="text-[12px] font-bold text-white/5 uppercase tracking-widest mt-10 max-w-sm leading-relaxed italic">Selecciona una frecuencia de transmisi\u00f3n para iniciar el procesamiento de inteligencia en tiempo real.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
