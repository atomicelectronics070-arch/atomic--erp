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

interface Node3D {
  id: string;
  name: string;
  category: string;
  color: string;
  glowColor: string;
  x: number; // 3D local coordinates
  y: number;
  z: number;
  baseRadius: number;
  isCore?: boolean;
}

/* ───────────────────────── 3D MANIPULABLE NEURAL GRAPH ───────────────────────── */

function NeuralGraph3DCanvas({ onSelectNode }: { onSelectNode: (nodeName: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // 3D Viewport State
    let rotX = 0.35;
    let rotY = -0.4;
    let targetRotX = 0.35;
    let targetRotY = -0.4;
    let zoom = 1.0;
    let targetZoom = 1.0;

    // Interaction State
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseX = -1;
    let mouseY = -1;
    let currentHoveredId: string | null = null;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // 3D Nodes Definition (Core + 4 Satellites: Afiliados, Vendedor, Miembros Oficiales, Estudiante)
    const nodes: Node3D[] = [
      {
        id: "core",
        name: "ECOSISTEMA ATOMIC",
        category: "NÚCLEO CENTRAL",
        color: "#00f0ff",
        glowColor: "rgba(0, 240, 255, 0.6)",
        x: 0,
        y: 0,
        z: 0,
        baseRadius: 38,
        isCore: true,
      },
      {
        id: "afiliados",
        name: "Afiliados",
        category: "RED DE AFILIACIÓN",
        color: "#10b981",
        glowColor: "rgba(16, 185, 129, 0.6)",
        x: -220,
        y: -50,
        z: 110,
        baseRadius: 20,
      },
      {
        id: "vendedor",
        name: "Vendedor",
        category: "COMERCIAL & VENTAS",
        color: "#f59e0b",
        glowColor: "rgba(245, 158, 11, 0.6)",
        x: 230,
        y: -60,
        z: -90,
        baseRadius: 20,
      },
      {
        id: "miembros",
        name: "Miembros Oficiales",
        category: "COMUNIDAD VIP",
        color: "#a855f7",
        glowColor: "rgba(168, 85, 247, 0.6)",
        x: -80,
        y: 190,
        z: -110,
        baseRadius: 20,
      },
      {
        id: "estudiante",
        name: "Estudiante",
        category: "ACADEMIA & FORMACIÓN",
        color: "#38bdf8",
        glowColor: "rgba(56, 189, 248, 0.6)",
        x: 180,
        y: 160,
        z: 100,
        baseRadius: 20,
      },
    ];

    // Starfield in 3D
    const stars: { x: number; y: number; z: number; r: number }[] = [];
    for (let i = 0; i < 350; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        z: (Math.random() - 0.5) * 3000,
        r: Math.random() * 1.5 + 0.3,
      });
    }

    // Energy particles connecting Core to all 4 satellites
    const connectionParticles: {
      nodeId: string;
      progress: number;
      speed: number;
    }[] = [
      { nodeId: "afiliados", progress: 0.1, speed: 0.005 },
      { nodeId: "afiliados", progress: 0.6, speed: 0.006 },
      { nodeId: "vendedor", progress: 0.3, speed: 0.004 },
      { nodeId: "vendedor", progress: 0.8, speed: 0.005 },
      { nodeId: "miembros", progress: 0.2, speed: 0.006 },
      { nodeId: "miembros", progress: 0.7, speed: 0.004 },
      { nodeId: "estudiante", progress: 0.15, speed: 0.005 },
      { nodeId: "estudiante", progress: 0.65, speed: 0.006 },
    ];

    let timeAngle = 0;

    // 3D Projection Engine
    const project3D = (x: number, y: number, z: number, cx: number, cy: number) => {
      // Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection
      const fov = 700 * zoom;
      const distance = 900;
      const scale = fov / (distance + z2);

      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        scale: Math.max(0.2, scale),
        zDepth: z2,
      };
    };

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      timeAngle += 0.01;

      // Inertia interpolation
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;
      zoom += (targetZoom - zoom) * 0.08;

      // Subtle auto-rotation when idle
      if (!isDragging) {
        targetRotY += 0.0015;
      }

      // Deep space background
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, w, h);

      // Radial energy background
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      bgGrad.addColorStop(0, "rgba(6, 182, 212, 0.08)");
      bgGrad.addColorStop(0.4, "rgba(99, 102, 241, 0.03)");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Render 3D Stars
      stars.forEach((s) => {
        const p = project3D(s.x, s.y, s.z, cx, cy);
        if (p.scale > 0) {
          const alpha = Math.min(0.8, Math.max(0.1, 0.5 + p.zDepth / 1000));
          ctx.beginPath();
          ctx.arc(p.px, p.py, s.r * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.fill();
        }
      });

      // Calculate projected positions for nodes with light 3D orbit sway
      const projectedNodes = nodes.map((node) => {
        let nx = node.x;
        let ny = node.y;
        let nz = node.z;

        if (!node.isCore) {
          const orbitAngle = timeAngle * 0.5 + (node.id === "afiliados" ? 0 : node.id === "vendedor" ? 1.5 : node.id === "miembros" ? 3.0 : 4.5);
          nx += Math.sin(orbitAngle) * 12;
          ny += Math.cos(orbitAngle) * 12;
        }

        const proj = project3D(nx, ny, nz, cx, cy);
        return {
          ...node,
          projX: proj.px,
          projY: proj.py,
          projScale: proj.scale,
          zDepth: proj.zDepth,
          radius: node.baseRadius * proj.scale,
        };
      });

      // Sort nodes by Z-depth (back to front rendering)
      projectedNodes.sort((a, b) => b.zDepth - a.zDepth);

      // Core node projection reference
      const coreProj = projectedNodes.find((n) => n.isCore)!;

      // Mouse Hover Detection
      currentHoveredId = null;
      for (let i = projectedNodes.length - 1; i >= 0; i--) {
        const n = projectedNodes[i];
        const dist = Math.hypot(mouseX - n.projX, mouseY - n.projY);
        if (dist <= n.radius + 12 * n.projScale) {
          currentHoveredId = n.id;
          break;
        }
      }
      setActiveHover(currentHoveredId);

      // Render Connection Lines from Core to 4 Satellites
      projectedNodes.forEach((n) => {
        if (!n.isCore) {
          const isHovered = currentHoveredId === n.id || currentHoveredId === "core";

          ctx.beginPath();
          ctx.moveTo(coreProj.projX, coreProj.projY);
          ctx.lineTo(n.projX, n.projY);
          ctx.strokeStyle = isHovered ? n.color : "rgba(14, 165, 233, 0.3)";
          ctx.lineWidth = (isHovered ? 2.5 : 1.2) * n.projScale;
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Render Energy Particles travelling along connection lines
      connectionParticles.forEach((cp) => {
        cp.progress += cp.speed;
        if (cp.progress > 1) cp.progress = 0;

        const targetNode = projectedNodes.find((n) => n.id === cp.nodeId);
        if (targetNode) {
          const px = coreProj.projX + (targetNode.projX - coreProj.projX) * cp.progress;
          const py = coreProj.projY + (targetNode.projY - coreProj.projY) * cp.progress;
          const pScale = coreProj.projScale + (targetNode.projScale - coreProj.projScale) * cp.progress;

          ctx.beginPath();
          ctx.arc(px, py, 3.5 * pScale, 0, Math.PI * 2);
          ctx.fillStyle = targetNode.color;
          ctx.shadowColor = targetNode.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Render 3D Rotating Orbital Rings for Core Node
      ctx.save();
      ctx.translate(coreProj.projX, coreProj.projY);
      const ringScale = coreProj.projScale;

      ctx.rotate(timeAngle * 0.8);
      ctx.beginPath();
      ctx.ellipse(0, 0, 95 * ringScale, 32 * ringScale, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.lineWidth = 1.5 * ringScale;
      ctx.stroke();

      ctx.rotate(-timeAngle * 1.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, 110 * ringScale, 38 * ringScale, Math.PI / 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
      ctx.lineWidth = 1.5 * ringScale;
      ctx.stroke();

      ctx.restore();

      // Render Nodes (back to front)
      projectedNodes.forEach((n) => {
        const isHovered = currentHoveredId === n.id;
        const r = n.radius * (isHovered ? 1.15 : 1.0);

        // Glow gradient
        const glowGrad = ctx.createRadialGradient(n.projX, n.projY, r * 0.2, n.projX, n.projY, r * 2.2);
        glowGrad.addColorStop(0, n.glowColor);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(n.projX, n.projY, r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Node sphere gradient
        ctx.beginPath();
        ctx.arc(n.projX, n.projY, r, 0, Math.PI * 2);
        const nodeGrad = ctx.createRadialGradient(
          n.projX - r * 0.3,
          n.projY - r * 0.3,
          r * 0.1,
          n.projX,
          n.projY,
          r
        );
        nodeGrad.addColorStop(0, n.color);
        nodeGrad.addColorStop(0.7, "#0f172a");
        nodeGrad.addColorStop(1, "#030712");
        ctx.fillStyle = nodeGrad;
        ctx.strokeStyle = isHovered ? "#ffffff" : n.color;
        ctx.lineWidth = (n.isCore ? 3 : 2) * n.projScale;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = (isHovered ? 25 : 12) * n.projScale;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Core inner white dot
        if (n.isCore) {
          ctx.beginPath();
          ctx.arc(n.projX, n.projY, r * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#00f0ff";
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Title text
        const fontSize = Math.max(9, Math.min(15, 12 * n.projScale));
        ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
        ctx.fillStyle = isHovered ? "#ffffff" : n.isCore ? "#00f0ff" : "#e2e8f0";
        ctx.textAlign = "center";
        ctx.fillText(n.name, n.projX, n.projY + r + fontSize * 1.1);

        // Category sub-label
        ctx.font = `bold ${Math.max(7, fontSize * 0.65)}px 'Courier New', monospace`;
        ctx.fillStyle = n.color;
        ctx.fillText(n.category, n.projX, n.projY + r + fontSize * 2.1);
      });

      // Cursor styling
      canvas.style.cursor = isDragging ? "grabbing" : currentHoveredId ? "pointer" : "grab";

      // HUD Overlay
      ctx.font = "bold 10px 'Courier New', monospace";
      ctx.fillStyle = "rgba(0, 240, 255, 0.7)";
      ctx.textAlign = "left";
      ctx.fillText("◉ GRAFO NEURONAL 3D INTERACTIVO · ECOSISTEMA ATOMIC", 24, 32);
      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
      ctx.fillText("NODOS ACTIVOS: 5 (NÚCLEO + 4 SEGMENTOS)  ·  MODO: 3D MANIPULABLE", 24, 48);

      ctx.textAlign = "center";
      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.fillText("Arrastra con el mouse para rotar en 3D · Rueda para zoom · Clic en un nodo para consultar", w / 2, h - 22);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse Manipulation Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        targetRotY += dx * 0.005;
        targetRotX += dy * 0.005;
        targetRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotX));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoom += e.deltaY * -0.001;
      targetZoom = Math.max(0.4, Math.min(2.5, targetZoom));
    };

    const handleClick = () => {
      if (currentHoveredId) {
        const clickedNode = nodes.find((n) => n.id === currentHoveredId);
        if (clickedNode) onSelectNode(clickedNode.name);
      }
    };

    // Touch Manipulation for Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastMouseX;
        const dy = e.touches[0].clientY - lastMouseY;
        targetRotY += dx * 0.005;
        targetRotX += dy * 0.005;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("click", handleClick);

    canvas.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", updateSize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
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
      text: "### 🧠 ECOSISTEMA ATOMIC · NÚCLEO 3D MANIPULABLE\n\nBienvenido al **Núcleo ECOSISTEMA ATOMIC**.\n\nPuedes arrastrar el mouse para rotar el espacio 3D. Nodos disponibles: **Afiliados**, **Vendedor**, **Miembros Oficiales** y **Estudiante**.",
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
      {/* ── 3D MANIPULABLE NEURAL GRAPH ── */}
      <NeuralGraph3DCanvas
        onSelectNode={(nodeName) => {
          handleSend(`Dame un informe detallado sobre el segmento: ${nodeName}`);
        }}
      />

      {/* ── FLOATING CHAT BUTTON ── */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl relative"
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
                    3D NÚCLEO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-slate-400 font-mono">NÚCLEO ONLINE</span>
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
                      <span className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase font-mono">ATOMIC</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase font-mono">TÚ</span>
                      <User size={10} className="text-slate-500" />
                    </>
                  )}
                  <span className="text-[8px] text-slate-600 font-mono">{m.timestamp}</span>
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
                  <span className="text-[10px] text-cyan-300 animate-pulse tracking-wider font-mono">PROCESANDO...</span>
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
                <Send size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between text-[8px] text-slate-600 px-2 mt-1 font-mono">
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
