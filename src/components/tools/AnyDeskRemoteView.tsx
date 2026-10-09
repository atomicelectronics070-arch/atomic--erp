"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Monitor, Bot, Sparkles, Send, Play, CheckCircle2, 
    AlertCircle, RefreshCw, Layers, ShieldCheck, Terminal, 
    MousePointer2, Keyboard, Maximize2, Minimize2, Cpu, 
    Power, Globe, FileText, Check, Settings, ArrowRight, X
} from "lucide-react"

interface AutomationLog {
    id: string
    timestamp: string
    action: string
    type: "vision" | "mouse" | "keyboard" | "system" | "success"
}

interface Message {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    timestamp: string
}

export default function AnyDeskRemoteView() {
    const [remoteId] = useState("ATOMIC-PC-892-411")
    const [monitorMode, setMonitorMode] = useState<"mon1" | "mon2" | "both">("both")
    const [isConnected, setIsConnected] = useState(true)
    const [latency, setLatency] = useState(12)
    const [fps, setFps] = useState(60)
    const [isAiScanning, setIsAiScanning] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 })
    const [isClicking, setIsClicking] = useState(false)

    // Bridge Status to SUITE_AUTOMATIZACION_ATOMIC
    const [bridgeStatus, setBridgeStatus] = useState<"connected" | "standby" | "busy">("connected")

    // Input & Messages
    const [inputCommand, setInputCommand] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "m1",
            role: "assistant",
            content: "Hola Santiago, soy tu Copiloto AnyDesk con Visión Artificial. Estoy monitoreando tus 2 pantallas en tiempo real. ¿Qué tarea deseas que ejecute por ti con el mouse y teclado físico?",
            timestamp: "02:45"
        }
    ])

    const [logs, setLogs] = useState<AutomationLog[]>([
        { id: "l1", timestamp: "02:40:11", action: "Stream AnyDesk P2P inicializado (Doble Monitor)", type: "system" },
        { id: "l2", timestamp: "02:40:15", action: "Bridge local SUITE_AUTOMATIZACION_ATOMIC activo en puerto 8000", type: "system" },
        { id: "l3", timestamp: "02:42:00", action: "Módulo Auto-Allow en escucha de diálogos de Antigravity", type: "system" }
    ])

    const chatEndRef = useRef<HTMLDivElement>(null)

    // Jitter latency slightly for realism
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(10 + Math.random() * 5))
            setFps(Math.floor(58 + Math.random() * 3))
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, logs])

    // Execute physical simulation command
    const handleRunCommand = async (e: React.FormEvent) => {
        e.preventDefault()
        const cmd = inputCommand.trim()
        if (!cmd) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: cmd,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }

        setMessages(prev => [...prev, userMsg])
        setInputCommand("")
        setIsAiScanning(true)
        setBridgeStatus("busy")

        // 1. Log Vision Analysis
        addLog(`Analizando pantalla con Vision AI para la orden: "${cmd}"`, "vision")

        // Step by step simulation / execution
        setTimeout(() => {
            // Animate mouse cursor to target
            setCursorPos({ x: 35, y: 70 })
            addLog("Moviendo mouse a coordenadas de ventana objetivo (35%, 70%)", "mouse")
            setIsClicking(true)

            setTimeout(() => {
                setIsClicking(false)
                addLog("Clic físico ejecutado. Enfocando ventana de Antigravity / Navegador", "mouse")

                setTimeout(() => {
                    // Type requirements
                    addLog(`Escribiendo requerimientos y activando auto-allow en Antigravity...`, "keyboard")

                    setTimeout(() => {
                        setCursorPos({ x: 42, y: 88 })
                        setIsClicking(true)
                        addLog("Pulsando botón 'Proceed' / Enter en la conversación...", "mouse")

                        setTimeout(() => {
                            setIsClicking(false)
                            setIsAiScanning(false)
                            setBridgeStatus("connected")
                            addLog("Operación completada con éxito. Monitoreando respuesta del sistema.", "success")

                            const botMsg: Message = {
                                id: (Date.now() + 1).toString(),
                                role: "assistant",
                                content: `Listo, Santiago. He detectado la pantalla, moví el cursor físicamente, ingresé tu instrucción: "${cmd}" y pulsé enviar/proceed en Antigravity. Estoy observando los dos monitores y te avisaré apenas termine de responder o si requiere otra acción.`,
                                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            }
                            setMessages(prev => [...prev, botMsg])
                        }, 1200)
                    }, 1400)
                }, 1000)
            }, 800)
        }, 1200)
    }

    const addLog = (action: string, type: AutomationLog["type"]) => {
        const newLog: AutomationLog = {
            id: Math.random().toString(),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            action,
            type
        }
        setLogs(prev => [newLog, ...prev.slice(0, 15)])
    }

    return (
        <div className="w-full h-full flex flex-col bg-[#050813] text-white rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl relative">
            {/* AnyDesk Top Address Bar */}
            <div className="bg-[#0b0f20] px-4 py-2.5 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                {/* Left: Remote ID & Status */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 font-bold">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>AnyDesk ATOMIC</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300">
                        <span className="text-slate-400">ID Remoto:</span>
                        <span className="font-bold tracking-wider">{remoteId}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">DIRECTO</span>
                    </div>
                </div>

                {/* Center: Monitor Selector */}
                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setMonitorMode("mon1")}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            monitorMode === "mon1" ? "bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Monitor size={13} />
                        <span>Monitor 1 (IDE)</span>
                    </button>
                    <button
                        onClick={() => setMonitorMode("mon2")}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            monitorMode === "mon2" ? "bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Monitor size={13} />
                        <span>Monitor 2 (CRM)</span>
                    </button>
                    <button
                        onClick={() => setMonitorMode("both")}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            monitorMode === "both" ? "bg-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Layers size={13} />
                        <span>Doble Monitor (Paralelo)</span>
                    </button>
                </div>

                {/* Right: Telemetry & Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>Ping: <strong className="text-emerald-400">{latency}ms</strong></span>
                        <span>•</span>
                        <span>FPS: <strong className="text-cyan-400">{fps}</strong></span>
                        <span>•</span>
                        <span>Bridge: <strong className="text-emerald-400">Activo :8000</strong></span>
                    </div>
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`p-1.5 rounded-xl border transition-all ${
                            isChatOpen ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                        title="Alternar Copiloto Flotante"
                    >
                        <Bot size={16} />
                    </button>
                </div>
            </div>

            {/* Desktop Screen Area */}
            <div className="flex-1 relative bg-[#04060d] overflow-hidden flex flex-col justify-center items-center p-3 select-none">
                {/* Simulated Mouse Cursor Controlled by Copilot */}
                <motion.div
                    animate={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    className="absolute z-40 pointer-events-none -translate-x-1 -translate-y-1"
                >
                    <div className="relative">
                        <MousePointer2 size={24} className="text-cyan-400 fill-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]" />
                        {isClicking && (
                            <span className="absolute -top-1 -left-1 w-8 h-8 rounded-full border-2 border-cyan-300 animate-ping" />
                        )}
                        <span className="absolute left-6 top-1 text-[9px] font-mono bg-cyan-950/90 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 whitespace-nowrap">
                            Copiloto ATOMIC
                        </span>
                    </div>
                </motion.div>

                {/* Scanning Laser Line if Vision AI is active */}
                {isAiScanning && (
                    <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4] z-30 pointer-events-none"
                    />
                )}

                {/* Screens Layout */}
                <div className={`w-full h-full grid gap-4 transition-all duration-300 ${
                    monitorMode === "both" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                }`}>
                    {/* Monitor 1: Antigravity IDE & Code Workspace */}
                    {(monitorMode === "mon1" || monitorMode === "both") && (
                        <div className="relative rounded-2xl bg-[#090d1e] border border-cyan-500/30 overflow-hidden flex flex-col shadow-2xl">
                            {/* Screen Header */}
                            <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                                    <span className="text-white font-bold">MONITOR 1 · Antigravity IDE & Terminal</span>
                                </div>
                                <span className="text-slate-400 text-[10px]">1920x1080 @ 60Hz</span>
                            </div>

                            {/* Screen Contents Mock (Antigravity Code & Prompt) */}
                            <div className="flex-1 p-4 font-mono text-xs text-slate-300 space-y-3 bg-[#070b18] overflow-y-auto">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                    <span className="text-cyan-400 font-bold">📂 scratch/atomic--erp · Antigravity Assistant</span>
                                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Auto-Allow: LISTO</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                                    <p className="text-purple-400 font-bold">&gt; Session: Softres / ATOMIC Enterprise</p>
                                    <p className="text-slate-400">Requerimientos de Rómulo: Integración de nómina y módulos multi-rol.</p>
                                    <p className="text-slate-500">// Monitoreando ejecución por hardware físico...</p>
                                </div>

                                <div className="p-3 rounded-xl bg-[#0b1329] border border-cyan-500/40 text-[11px]">
                                    <span className="text-xs text-cyan-300 font-bold block mb-1">🤖 Antigravity Chat Input Area</span>
                                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 flex items-center justify-between">
                                        <span>Escribe un mensaje para Antigravity...</span>
                                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">PROCEED DISPONIBLE</span>
                                    </div>
                                </div>

                                <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-slate-400">
                                    <span className="text-slate-500 block mb-1">TERMINAL POWERSHELL EN VIVO:</span>
                                    <p className="text-emerald-400 font-bold">PS C:\Users\SANTIAGO\Desktop\SUITE_AUTOMATIZACION_ATOMIC&gt; python server.py</p>
                                    <p className="text-slate-400">[Uvicorn] Servidor de automatización corriendo en http://0.0.0.0:8000</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Monitor 2: Secondary Desktop (WhatsApp CRM & Browsing) */}
                    {(monitorMode === "mon2" || monitorMode === "both") && (
                        <div className="relative rounded-2xl bg-[#090d1e] border border-indigo-500/30 overflow-hidden flex flex-col shadow-2xl">
                            {/* Screen Header */}
                            <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                                    <span className="text-white font-bold">MONITOR 2 · WhatsApp Cloud & Navegador Operativo</span>
                                </div>
                                <span className="text-slate-400 text-[10px]">1920x1080 @ 60Hz</span>
                            </div>

                            {/* Screen Contents Mock (CRM & Social) */}
                            <div className="flex-1 p-4 font-mono text-xs text-slate-300 space-y-3 bg-[#070b18] overflow-y-auto">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                    <span className="text-indigo-400 font-bold">📱 WhatsApp Web & Drive Sync</span>
                                    <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-[10px]">Meta API: Online</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                        <span className="text-slate-500 block font-bold">ÚLTIMO CONTACTO</span>
                                        <span className="text-white font-bold">Ing. Rómulo (Guayaquil)</span>
                                        <span className="text-emerald-400 block mt-1">✓ Mensaje entregado</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                        <span className="text-slate-500 block font-bold">GOOGLE DRIVE</span>
                                        <span className="text-white font-bold">Cotizacion_ATOMIC_441.pdf</span>
                                        <span className="text-cyan-400 block mt-1">Sincronizado 100%</span>
                                    </div>
                                </div>

                                {/* Live Activity Monitor */}
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Registro de Eventos Físicos de Mouse:</span>
                                    <div className="space-y-1 text-[10px]">
                                        {logs.slice(0, 4).map((log) => (
                                            <div key={log.id} className="flex items-center gap-2 text-slate-400">
                                                <span className="text-cyan-400 font-bold">{log.timestamp}</span>
                                                <span className={log.type === "success" ? "text-emerald-400 font-bold" : log.type === "vision" ? "text-purple-300" : "text-slate-300"}>
                                                    {log.action}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating AI Copilot Chat Button & Window */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="absolute bottom-6 right-6 w-96 max-w-[92vw] h-[460px] bg-[#080d22]/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col z-50 overflow-hidden"
                        >
                            {/* Copilot Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border-b border-cyan-500/30 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                                        <Bot size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-xs tracking-tight flex items-center gap-1.5">
                                            Copiloto AnyDesk
                                            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-black text-[9px] font-black uppercase">IA</span>
                                        </h4>
                                        <p className="text-[10px] font-mono text-cyan-300">Control Físico & Visión Artificial</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setIsChatOpen(false)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`p-3 rounded-2xl ${
                                            m.role === "user"
                                                ? "bg-cyan-500 text-black font-semibold ml-6 shadow-md"
                                                : "bg-slate-900/90 border border-slate-800 text-slate-200 mr-4"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center text-[9px] mb-1 opacity-70">
                                            <span>{m.role === "user" ? "Tú" : "Copiloto AnyDesk"}</span>
                                            <span>{m.timestamp}</span>
                                        </div>
                                        <p className="leading-relaxed">{m.content}</p>
                                    </div>
                                ))}
                                {isAiScanning && (
                                    <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-cyan-300 flex items-center gap-2 animate-pulse text-xs">
                                        <Sparkles size={14} className="text-cyan-400 animate-spin" />
                                        <span>Analizando pantalla con visión y moviendo cursor...</span>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Quick Action Chips */}
                            <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px] font-mono scrollbar-none">
                                <button
                                    onClick={() => setInputCommand("Ejecuta estos requerimientos de Rómulo y ponlos en Antigravity")}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap cursor-pointer"
                                >
                                    ⚡ Requerimientos Rómulo
                                </button>
                                <button
                                    onClick={() => setInputCommand("Sube la última cotización a Google Drive y avisa a WhatsApp")}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap cursor-pointer"
                                >
                                    📂 Subir a Drive
                                </button>
                                <button
                                    onClick={() => setInputCommand("Pulsar Proceed en Antigravity y monitorear")}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap cursor-pointer"
                                >
                                    🖱️ Auto-Allow
                                </button>
                            </div>

                            {/* Input Field */}
                            <form onSubmit={handleRunCommand} className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2">
                                <input
                                    type="text"
                                    value={inputCommand}
                                    onChange={(e) => setInputCommand(e.target.value)}
                                    placeholder="Ordena al copiloto (ej: 'pon en antigravity los reqs')..."
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isAiScanning || !inputCommand.trim()}
                                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
