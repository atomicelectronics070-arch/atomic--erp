"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Cpu, RefreshCw, User, Shield, Activity } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "nucleus";
  text: string;
  timestamp: string;
  provider?: string;
}

interface NodeItem {
  id: string;
  name: string;
  category: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isCore?: boolean;
}

function NeuralGraphCanvas({ onSelectNode }: { onSelectNode: (nodeName: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const updateSize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const width = canvas.width || 600;
    const height = canvas.height || 500;
    const centerX = width / 2;
    const centerY = height / 2;

    const nodes: NodeItem[] = [
      { id: "core", name: "ECOSISTEMA TOMC", category: "NÚCLEO MAESTRO", color: "#00f0ff", x: centerX, y: centerY, vx: 0, vy: 0, radius: 26, isCore: true },
      { id: "matriz", name: "Matriz de Precios", category: "ERP & Costos", color: "#10b981", x: centerX - 180, y: centerY - 100, vx: 0.3, vy: -0.2, radius: 14 },
      { id: "db", name: "DB Postgres & Prisma", category: "Base de Datos", color: "#3b82f6", x: centerX + 180, y: centerY - 110, vx: -0.2, vy: 0.3, radius: 14 },
      { id: "crm", name: "CRM WhatsApp", category: "Atención & Leads", color: "#a855f7", x: centerX + 200, y: centerY + 90, vx: 0.25, vy: -0.25, radius: 14 },
      { id: "scraper", name: "Scraper Competitivo", category: "Inteligencia AI", color: "#ec4899", x: centerX - 190, y: centerY + 100, vx: -0.3, vy: 0.2, radius: 14 },
      { id: "vendedores", name: "Matriz Vendedores", category: "Público Vendedor", color: "#f59e0b", x: centerX - 230, y: centerY + 20, vx: 0.2, vy: 0.3, radius: 13 },
      { id: "contratos", name: "Módulo Contratos", category: "Legal & Admin", color: "#06b6d4", x: centerX + 220, y: centerY - 10, vx: -0.2, vy: -0.3, radius: 13 },
      { id: "academy", name: "Atomic Academy", category: "Formación", color: "#8b5cf6", x: centerX, y: centerY - 170, vx: 0.1, vy: 0.2, radius: 13 },
      { id: "obsidian", name: "Memoria Obsidian", category: "Cerebro Secundario", color: "#6366f1", x: centerX, y: centerY + 180, vx: -0.1, vy: -0.2, radius: 13 },
    ];

    const particles = nodes.filter(n => !n.isCore).map((node, i) => ({
      nodeId: node.id,
      progress: (i * 0.15) % 1,
      speed: 0.004 + (i % 3) * 0.002
    }));

    let angle = 0;

    const render = () => {
      angle += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes[0].x = canvas.width / 2;
      nodes[0].y = canvas.height / 2;

      for (let i = 1; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        const distFromCenter = Math.hypot(n.x - nodes[0].x, n.y - nodes[0].y);
        if (distFromCenter > 240 || distFromCenter < 100) {
          n.vx *= -1;
          n.vy *= -1;
        }
      }

      const coreNode = nodes[0];

      for (let i = 1; i < nodes.length; i++) {
        const n = nodes[i];
        const isHovered = hoveredNode === n.id || hoveredNode === coreNode.id;

        ctx.beginPath();
        ctx.moveTo(coreNode.x, coreNode.y);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = isHovered ? n.color : "rgba(14, 165, 233, 0.25)";
        ctx.lineWidth = isHovered ? 2.5 : 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      particles.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const targetNode = nodes.find(n => n.id === p.nodeId);
        if (targetNode) {
          const px = coreNode.x + (targetNode.x - coreNode.x) * p.progress;
          const py = coreNode.y + (targetNode.y - coreNode.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = targetNode.color;
          ctx.shadowColor = targetNode.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.save();
      ctx.translate(coreNode.x, coreNode.y);

      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 42, 16, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.rotate(-angle * 1.8);
      ctx.beginPath();
      ctx.ellipse(0, 0, 48, 18, -Math.PI / 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      nodes.forEach((n) => {
        const isHovered = hoveredNode === n.id;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + (isHovered ? 12 : 6), 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, n.radius + (isHovered ? 14 : 8));
        glowGradient.addColorStop(0, n.color + "66");
        glowGradient.addColorStop(1, "transparent");
        ctx.fillStyle = glowGradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.isCore ? "#030712" : "#0f172a";
        ctx.strokeStyle = n.color;
        ctx.lineWidth = n.isCore ? 3 : 2;
        ctx.fill();
        ctx.stroke();

        if (n.isCore) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#00f0ff";
          ctx.shadowColor = "#00f0ff";
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.font = n.isCore ? "bold 11px monospace" : "10px monospace";
        ctx.fillStyle = n.isCore ? "#ffffff" : (isHovered ? "#ffffff" : "#cbd5e1");
        ctx.textAlign = "center";
        ctx.fillText(n.name, n.x, n.y + n.radius + 14);

        if (n.category && !n.isCore) {
          ctx.font = "8px monospace";
          ctx.fillStyle = n.color;
          ctx.fillText(n.category.toUpperCase(), n.x, n.y + n.radius + 24);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found: string | null = null;
      for (const n of nodes) {
        const dist = Math.hypot(n.x - mx, n.y - my);
        if (dist <= n.radius + 6) {
          found = n.id;
          break;
        }
      }
      setHoveredNode(found);
      canvas.style.cursor = found ? "pointer" : "default";
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const n of nodes) {
        const dist = Math.hypot(n.x - mx, n.y - my);
        if (dist <= n.radius + 6) {
          onSelectNode(n.name);
          break;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", updateSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onSelectNode]);

  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[500px] bg-slate-950/80 rounded-2xl border border-cyan-900/40 overflow-hidden flex flex-col shadow-2xl">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md shadow-lg">
        <Activity size={14} className="text-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
          GRAFO NEURONAL · ECOSISTEMA TOMC
        </span>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[9px] font-mono text-slate-400">
        <span>NODOS ACTIVOS: 9</span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full flex-1 block" />

      <div className="absolute bottom-3 left-3 right-3 z-20 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          NÚCLEO CENTRAL: <strong className="text-cyan-300">ECOSISTEMA TOMC</strong>
        </span>
        <span className="hidden sm:inline text-slate-500">Haz clic en cualquier nodo para consultarle al Núcleo</span>
      </div>
    </div>
  );
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

export default function DashboardEcosistemaTomcPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "nucleus",
      text: "### 🧠 ECOSISTEMA TOMC · NÚCLEO CENTRAL CONECTADO\n\nBienvenido al **Núcleo ECOSISTEMA TOMC**, la inteligencia central y matriz neuronal de ATOMIC.\n\nEl Grafo Neuronal interactivo está activo a la izquierda. Puedes hacer clic en cualquiera de los nodos conectores o escribir tu consulta directa abajo. ¿Qué instrucción deseas ejecutar?",
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

  const handleSend = async (customText?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryText = (customText || input).trim();
    if (!queryText || isLoading) return;

    if (!customText) setInput("");

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
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
          message: queryText,
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
      
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[160px]" />
      </div>

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
              <span>NÚCLEO CENTRAL & GRAFO NEURONAL OPERATIVO</span>
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

      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden max-w-[1600px] w-full mx-auto">
        
        <div className="lg:col-span-5 flex flex-col h-full min-h-[380px] lg:min-h-[600px]">
          <NeuralGraphCanvas
            onSelectNode={(nodeName) => {
              handleSend(`Dame un informe detallado sobre el nodo: ${nodeName}`);
            }}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col h-full bg-slate-950/80 rounded-2xl border border-cyan-900/40 p-4 md:p-6 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[500px]">
          
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
                  className={`max-w-[92%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-xl ${
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

          <div className="pt-3 pb-2 flex flex-wrap gap-2 overflow-x-auto hide-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleSend(prompt);
                }}
                className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-slate-900/70 border border-cyan-900/30 text-cyan-300/80 hover:text-cyan-200 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-left truncate max-w-[240px]"
              >
                ⚡ {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => handleSend(undefined, e)} className="relative mt-2">
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

        </div>

      </main>
    </div>
  );
}
