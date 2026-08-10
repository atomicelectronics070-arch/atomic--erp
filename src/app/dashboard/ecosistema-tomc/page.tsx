"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageCircle, Cpu, RefreshCw, User, Shield, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "nucleus";
  text: string;
  timestamp: string;
  provider?: string;
}

/* ───────────────────────── FULLSCREEN NEURAL GRAPH (SINGLE CORE ONLY) ───────────────────────── */

function NeuralGraphCanvas({ onSelectNode }: { onSelectNode: (nodeName: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1;
    let mouseY = -1;
    let isHovered = false;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    /* ---- starfield background ---- */
    const stars: { x: number; y: number; r: number; a: number; speed: number }[] = [];
    for (let i = 0; i < 250; i++) {
      stars.push({
        x: Math.random() * 3000,
        y: Math.random() * 2000,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.002,
      });
    }

    /* ---- floating energy particles ---- */
    const energyParticles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string }[] = [];
    const spawnEnergyParticle = (cx: number, cy: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.9 + 0.3;
      energyParticles.push({
        x: cx + (Math.random() - 0.5) * 160,
        y: cy + (Math.random() - 0.5) * 160,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 150 + Math.random() * 250,
        color: Math.random() > 0.5 ? "#00f0ff" : "#a855f7",
      });
    };

    let angle = 0;
    let pulsePhase = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      angle += 0.008;
      pulsePhase += 0.025;

      // Deep space background
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, w, h);

      // Radial energy background from nucleus
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.65);
      bgGrad.addColorStop(0, "rgba(6, 182, 212, 0.08)");
      bgGrad.addColorStop(0.35, "rgba(99, 102, 241, 0.04)");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      stars.forEach((s) => {
        s.a += s.speed;
        const alpha = 0.25 + Math.sin(s.a) * 0.35;
        ctx.beginPath();
        ctx.arc(s.x % w, s.y % h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
        ctx.fill();
      });

      // Spawn particles
      if (Math.random() < 0.2) spawnEnergyParticle(cx, cy);

      // Render energy particles
      for (let i = energyParticles.length - 1; i >= 0; i--) {
        const p = energyParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife) {
          energyParticles.splice(i, 1);
          continue;
        }
        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 99).toString(16).padStart(2, "0");
        ctx.fill();
      }

      // ── SINGLE NUCLEUS: ECOSISTEMA ATOMIC ──
      const coreRadius = Math.min(w, h) * 0.085;
      const pulse = Math.sin(pulsePhase) * 0.12 + 1;

      // Mouse hover check
      const distToCenter = Math.hypot(mouseX - cx, mouseY - cy);
      isHovered = distToCenter <= coreRadius + 20;

      // Outer wave rings
      for (let ring = 4; ring >= 0; ring--) {
        const r = coreRadius * (1.6 + ring * 0.45) * pulse;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.03 + ring * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Rotating 3D orbital rings
      ctx.save();
      ctx.translate(cx, cy);

      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 2.3, coreRadius * 0.75, 0, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? "rgba(0, 240, 255, 0.7)" : "rgba(0, 240, 255, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.rotate(-angle * 2.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 2.5, coreRadius * 0.85, Math.PI / 3, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? "rgba(168, 85, 247, 0.6)" : "rgba(168, 85, 247, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.rotate(angle * 1.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 2.0, coreRadius * 0.65, -Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? "rgba(59, 130, 246, 0.6)" : "rgba(59, 130, 246, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();

      // Nucleus ambient radial glow
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 1.8);
      coreGlow.addColorStop(0, isHovered ? "rgba(0, 240, 255, 0.4)" : "rgba(0, 240, 255, 0.22)");
      coreGlow.addColorStop(0.6, "rgba(0, 240, 255, 0.05)");
      coreGlow.addColorStop(1, "transparent");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Main core body
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * (isHovered ? 1.05 : 1.0), 0, Math.PI * 2);
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      coreGrad.addColorStop(0, "#0c1a2e");
      coreGrad.addColorStop(1, "#030712");
      ctx.fillStyle = coreGrad;
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = isHovered ? 4 : 3;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = isHovered ? 35 : 22;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glowing center core dot
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Nucleus Labels
      const coreFontSize = Math.max(12, Math.min(18, w * 0.013));
      ctx.font = `bold ${coreFontSize}px 'Courier New', monospace`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ECOSISTEMA", cx, cy - coreFontSize * 0.7);
      ctx.fillText("ATOMIC", cx, cy + coreFontSize * 0.7);

      // Sub-label
      ctx.font = `bold ${Math.max(9, coreFontSize * 0.55)}px 'Courier New', monospace`;
      ctx.fillStyle = "#00f0ff";
      ctx.fillText("NÚCLEO ÚNICO", cx, cy + coreRadius + coreFontSize * 1.3);

      // Cursor
      canvas.style.cursor = isHovered ? "pointer" : "default";

      // ── HUD Overlays ──
      ctx.font = "bold 10px 'Courier New', monospace";
      ctx.fillStyle = "rgba(0, 240, 255, 0.7)";
      ctx.textAlign = "left";
      ctx.fillText("◉ NÚCLEO AUTÓNOMO · ECOSISTEMA ATOMIC", 24, 32);
      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
      ctx.fillText("NÚCLEO PRINCIPAL: OPERATIVO  ·  ESTADO: ONLINE", 24, 48);

      ctx.textAlign = "center";
      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.fillText("Haz clic en el Núcleo para abrir el chat de comandos", w / 2, h - 22);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleClick = () => {
      if (isHovered) onSelectNode("ECOSISTEMA ATOMIC");
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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}

/* ───────────────────────── SIMPLE MARKDOWN ───────────────────────── */

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("### "))
          return <h3 key={idx} className="text-sm font-black text-cyan-300 tracking-wide mt-2 mb-1">{trimmed.replace(/^###\s+/, "")}</h3>;
        if (trimmed.startsWith("## "))
          return <h2 key={idx} className="text-base font-black text-cyan-400 tracking-wider mt-2 mb-1">{trimmed.replace(/^##\s+/, "")}</h2>;
        if (trimmed.startsWith("# "))
          return <h1 key={idx} className="text-lg font-black text-white tracking-widest mt-3 mb-1">{trimmed.replace(/^#\s+/, "")}</h1>;
        if (trimmed.startsWith("- ") || trimmed.startsWith("* "))
          return (
            <div key={idx} className="flex items-start gap-2 ml-2 my-0.5">
              <span className="text-cyan-400 font-bold text-xs mt-0.5">•</span>
              <span className="text-slate-200 text-xs">{renderBold(trimmed.substring(2))}</span>
            </div>
          );
        if (!trimmed) return <div key={idx} className="h-1" />;
        return <p key={idx} className="text-xs text-slate-200 leading-relaxed">{renderBold(trimmed)}</p>;
      })}
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-bold text-cyan-300">{part.slice(2, -2)}</strong>;
    return part;
  });
}

/* ───────────────────────── MAIN PAGE ───────────────────────── */

export default function DashboardEcosistemaTomcPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "nucleus",
      text: "### 🧠 ECOSISTEMA ATOMIC · NÚCLEO CONECTADO\n\nBienvenido al **Núcleo ECOSISTEMA ATOMIC**, la inteligencia única central.\n\nEscribe tu consulta o haz clic en el núcleo.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      provider: "Núcleo ECOSISTEMA ATOMIC",
    },
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

  const handleSend = useCallback(
    async (customText?: string, e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const queryText = (customText || input).trim();
      if (!queryText || isLoading) return;

      if (!customText) setInput("");
      setChatOpen(true);

      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        text: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const historyPayload = messages.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

        const res = await fetch("/api/ecosistema-tomc/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: queryText, history: historyPayload }),
        });

        const data = await res.json();

        if (data.success) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: "nucleus",
              text: data.response,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              provider: data.provider || "Núcleo ECOSISTEMA ATOMIC",
            },
          ]);
        } else {
          throw new Error(data.error || "Falló respuesta del Núcleo");
        }
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "nucleus",
            text: `⚠️ **Error:** ${err.message || "Error desconocido"}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            provider: "Sistema",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "nucleus",
        text: "### 🧠 NÚCLEO ECOSISTEMA ATOMIC REINICIALIZADO\n\nMemoria despejada. ¿En qué te ayudo?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        provider: "Núcleo ECOSISTEMA ATOMIC",
      },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-[#030712] overflow-hidden" style={{ fontFamily: "'Courier New', monospace" }}>
      {/* ── FULLSCREEN NEURAL GRAPH ── */}
      <NeuralGraphCanvas
        onSelectNode={(nodeName) => {
          handleSend(`Dame un informe de estado del núcleo ${nodeName}`);
        }}
      />

      {/* ── FLOATING CHAT BUTTON ── */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            boxShadow: "0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.2)",
          }}
          title="Abrir chat con Ecosistema ATOMIC"
        >
          <MessageCircle size={24} className="text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400" />
        </button>
      )}

      {/* ── MINIMIZABLE CHAT PANEL ── */}
      {chatOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden"
          style={{
            width: "min(420px, calc(100vw - 48px))",
            height: "min(600px, calc(100vh - 48px))",
            borderRadius: "20px",
            background: "rgba(3, 7, 18, 0.95)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 40px rgba(6, 182, 212, 0.15), 0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-900/40 bg-slate-950/90 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                  boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)",
                }}
              >
                <Cpu size={16} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    ECOSISTEMA <span className="text-cyan-400">ATOMIC</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    NÚCLEO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-slate-400">NÚCLEO ONLINE</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Limpiar chat"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Minimizar"
              >
                <Minimize2 size={14} />
              </button>
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-1.5 mb-0.5 px-0.5">
                  {m.sender === "nucleus" ? (
                    <>
                      <span className="w-4 h-4 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[8px] font-black">
                        ⚡
                      </span>
                      <span className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase">ATOMIC</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">TÚ</span>
                      <User size={10} className="text-slate-500" />
                    </>
                  )}
                  <span className="text-[8px] text-slate-600">{m.timestamp}</span>
                </div>
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-lg ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                      : "bg-slate-900/90 border border-cyan-900/30 text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {m.sender === "nucleus" ? <SimpleMarkdown content={m.text} /> : <p className="whitespace-pre-wrap">{m.text}</p>}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-slate-900/90 border border-cyan-900/30 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-cyan-300 animate-pulse tracking-wider">PROCESANDO...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* input */}
          <form onSubmit={(e) => handleSend(undefined, e)} className="p-3 pt-0 shrink-0">
            <div
              className="flex items-center gap-2 rounded-xl p-2"
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(6, 182, 212, 0.25)",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta al Núcleo..."
                className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none px-2 py-1.5"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-lg transition-all ${
                  input.trim() && !isLoading
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:scale-105"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Send size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between text-[8px] text-slate-600 px-2 mt-1">
              <span>[Enter] enviar</span>
              <span className="flex items-center gap-1">
                <Shield size={8} className="text-emerald-500" /> SEGURO
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
