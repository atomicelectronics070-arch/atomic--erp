"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Cpu, Sparkles, Terminal, RefreshCw, Bot, User, Zap, Shield, ChevronRight } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "nucleus";
  text: string;
  timestamp: string;
  provider?: string;
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        let trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base font-black text-cyan-300 tracking-wide mt-2 mb-1">
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-lg font-black text-cyan-400 tracking-wider mt-3 mb-1">
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-xl font-black text-white tracking-widest mt-4 mb-2">
              {trimmed.replace(/^#\s+/, '')}
            </h1>
          );
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemContent = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 ml-2 my-0.5">
              <span className="text-cyan-400 font-bold text-xs mt-0.5">•</span>
              <span className="text-slate-200 text-xs md:text-sm">
                {renderBold(itemContent)}
              </span>
            </div>
          );
        }
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }
        return (
          <p key={idx} className="text-xs md:text-sm text-slate-200 leading-relaxed">
            {renderBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-cyan-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function EcosistemaTomcPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "nucleus",
      text: "### 🧠 ECOSISTEMA TOMC · NÚCLEO CENTRAL CONECTADO\n\nBienvenido. Soy el **Núcleo ECOSISTEMA TOMC**, la inteligencia central unificada del ecosistema ATOMIC. \n\nEstoy listo para asistir en arquitectura de software, gestión operativa, inventario, ventas y desarrollo. ¿Qué instrucción o consulta deseas procesar?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: "Núcleo ECOSISTEMA TOMC"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgText = input.trim();
    setInput("");

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));

      const res = await fetch("/api/ecosistema-tomc/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          history: historyPayload
        })
      });

      const data = await res.json();

      if (data.success) {
        const nucleusMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "nucleus",
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: data.provider || "Núcleo ECOSISTEMA TOMC"
        };
        setMessages((prev) => [...prev, nucleusMessage]);
      } else {
        throw new Error(data.error || "Falló respuesta del Núcleo");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "nucleus",
        text: `⚠️ **Error de Comunicación:** No se pudo establecer conexión directa con el Núcleo ECOSISTEMA TOMC. Detalle: ${err.message || 'Error desconocido'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: "Sistema de Emergencia"
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "nucleus",
        text: "### 🧠 NÚCLEO ECOSISTEMA TOMC REINICIALIZADO\n\nMemoria de chat despejada. Núcleo operando al 100% de capacidad. ¿En qué te ayudo?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: "Núcleo ECOSISTEMA TOMC"
      }
    ]);
  };

  const quickPrompts = [
    "Estado del Ecosistema TOMC",
    "Resumen de productos y matriz de precios",
    "Arquitectura del sistema multi-tenant",
    "Estrategia de ventas y automatización"
  ];

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-hidden">
      
      {/* Dynamic Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.2) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />
      </div>

      {/* HEADER TOPBAR */}
      <header className="relative z-10 border-b border-cyan-900/40 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-cyan-400 font-black">
              <Cpu size={20} className="animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black uppercase tracking-wider text-white">
                ECOSISTEMA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">TOMC</span>
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                BRAIN V1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>NÚCLEO PRINCIPAL ACTIVO Y OPERATIVO</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
            title="Reiniciar chat"
          >
            <RefreshCw size={13} />
            <span>LIMPIAR</span>
          </button>
        </div>
      </header>

      {/* CHAT CONTAINER */}
      <main className="relative z-10 flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 md:p-6 overflow-hidden">
        
        {/* MESSAGES LIST */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} animate-in fade-in duration-300`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                {m.sender === "nucleus" ? (
                  <>
                    <span className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[10px] font-black">
                      ⚡
                    </span>
                    <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-wider uppercase">
                      ECOSISTEMA TOMC
                    </span>
                    {m.provider && (
                      <span className="text-[9px] font-mono text-slate-500 border border-slate-800 rounded px-1.5 py-0.2 bg-slate-900">
                        {m.provider}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                      USUARIO
                    </span>
                    <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 text-[10px] font-black">
                      <User size={12} />
                    </span>
                  </>
                )}
                <span className="text-[10px] font-mono text-slate-600">{m.timestamp}</span>
              </div>

              <div
                className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-xl ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium"
                    : "bg-slate-900/90 border border-cyan-900/40 text-slate-200 rounded-tl-none backdrop-blur-md"
                }`}
              >
                {m.sender === "nucleus" ? (
                  <SimpleMarkdown content={m.text} />
                ) : (
                  <p className="whitespace-pre-wrap">{m.text}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[10px] font-black">
                  ⚡
                </span>
                <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-wider uppercase">
                  ECOSISTEMA TOMC
                </span>
              </div>
              <div className="bg-slate-900/90 border border-cyan-900/40 rounded-2xl rounded-tl-none px-5 py-4 backdrop-blur-md flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-cyan-300 animate-pulse tracking-wider">
                  PROCESANDO EN NÚCLEO TOMC...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK PROMPTS BAR */}
        <div className="pt-3 pb-2 flex flex-wrap gap-2 overflow-x-auto hide-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(prompt);
              }}
              className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-slate-900/70 border border-cyan-900/30 text-cyan-300/80 hover:text-cyan-200 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-left truncate max-w-[240px]"
            >
              ⚡ {prompt}
            </button>
          ))}
        </div>

        {/* CHAT INPUT FORM */}
        <form onSubmit={handleSend} className="relative mt-2">
          <div className="relative flex items-center rounded-2xl border border-cyan-900/50 bg-slate-950/90 shadow-2xl backdrop-blur-xl focus-within:border-cyan-400 transition-all p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escribe una orden o consulta para el Núcleo Ecosistema TOMC..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none px-3 py-2 max-h-32 min-h-[44px] custom-scrollbar"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`shrink-0 p-3 rounded-xl font-bold transition-all flex items-center justify-center ${
                input.trim() && !isLoading
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105"
                  : "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-3 mt-1.5">
            <span>Presiona [Enter] para enviar, [Shift + Enter] para salto de línea</span>
            <span className="flex items-center gap-1">
              <Shield size={10} className="text-emerald-400" /> NÚCLEO SEGURO
            </span>
          </div>
        </form>

      </main>
    </div>
  );
}
