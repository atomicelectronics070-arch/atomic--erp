"use client"

import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { 
    Users, Link2, Shield, Plus, Move, Edit3, 
    ArrowUp, ArrowDown, Check, X, Sparkles, 
    Trash2, Eye, Download, Info
} from "lucide-react"

interface ProfileNode {
    id: string
    name: string
    role: string
    category: "admin" | "coordinacion" | "ventas" | "tecnicos" | "growth" | "tech"
    x: number
    y: number
    level: number // 1: Cúspide, 2: Táctico, 3: Operativo
    modules: string[]
}

interface Connection {
    id: string
    fromId: string
    toId: string
    relationship: "superior" | "inferior"
}

export default function InteractiveHierarchyMap() {
    const [nodes, setNodes] = useState<ProfileNode[]>([
        { id: "p1", name: "Santiago (CEO)", role: "SUPER ADMIN / GERENCIA", category: "admin", x: 450, y: 50, level: 1, modules: ["Todos los Módulos", "Finanzas", "Super Admin", "Cotizador"] },
        { id: "p2", name: "Coordinación Operativa", role: "COORDINADOR GENERAL", category: "coordinacion", x: 260, y: 170, level: 2, modules: ["Coordinación", "Asistencia", "CRM", "Cotizador"] },
        { id: "p3", name: "Supervisión Comercial", role: "SUPERVISOR DE VENTAS", category: "coordinacion", x: 640, y: 170, level: 2, modules: ["Supervisión", "CRM", "Matriz Precios"] },
        { id: "p4", name: "Ana Jessica López", role: "ASESOR COMERCIAL SENIOR", category: "ventas", x: 120, y: 310, level: 3, modules: ["Cotizador", "CRM", "Matriz Precios", "Tienda"] },
        { id: "p5", name: "Vanessa Zurita", role: "ASESOR COMERCIAL", category: "ventas", x: 340, y: 310, level: 3, modules: ["Cotizador", "CRM", "Matriz Precios", "Tienda"] },
        { id: "p6", name: "Téc. Darwin Sánchez", role: "JEFE TÉCNICO & CAMPO", category: "tecnicos", x: 560, y: 310, level: 3, modules: ["Portal Técnicos", "Escáner", "Catálogo"] },
        { id: "p7", name: "Célula de Software & IA", role: "INGENIERÍA & SISTEMAS", category: "tech", x: 780, y: 310, level: 3, modules: ["Software", "Infraestructura", "AnyDesk", "Logs"] }
    ])

    const [connections, setConnections] = useState<Connection[]>([
        { id: "c1", fromId: "p1", toId: "p2", relationship: "inferior" },
        { id: "c2", fromId: "p1", toId: "p3", relationship: "inferior" },
        { id: "c3", fromId: "p2", toId: "p4", relationship: "inferior" },
        { id: "c4", fromId: "p2", toId: "p5", relationship: "inferior" },
        { id: "c5", fromId: "p3", toId: "p6", relationship: "inferior" },
        { id: "c6", fromId: "p1", toId: "p7", relationship: "inferior" }
    ])

    const [interactionMode, setInteractionMode] = useState<"drag_nodes" | "move_links" | "privileges">("drag_nodes")
    const [selectedNode, setSelectedNode] = useState<ProfileNode | null>(null)
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
    const [isPrivilegesModalOpen, setIsPrivilegesModalOpen] = useState(false)
    const [targetConnectId, setTargetConnectId] = useState<string>("")
    const [connectDirection, setConnectDirection] = useState<"superior" | "inferior">("inferior")

    // Dragging state
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

    const handleMouseDown = (nodeId: string) => {
        if (interactionMode === "drag_nodes") {
            setDraggingNodeId(nodeId)
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingNodeId || !canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()
        const x = Math.max(20, Math.min(rect.width - 180, e.clientX - rect.left - 80))
        const y = Math.max(20, Math.min(rect.height - 80, e.clientY - rect.top - 30))

        setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x, y } : n))
    }

    const handleMouseUp = () => {
        setDraggingNodeId(null)
    }

    const handleStartConnect = (node: ProfileNode) => {
        setSelectedNode(node)
        const others = nodes.filter(n => n.id !== node.id)
        if (others.length > 0) setTargetConnectId(others[0].id)
        setIsConnectModalOpen(true)
    }

    const handleConfirmConnect = () => {
        if (!selectedNode || !targetConnectId) return
        const newConn: Connection = {
            id: `c_${Date.now()}`,
            fromId: selectedNode.id,
            toId: targetConnectId,
            relationship: connectDirection
        }

        // Adjust coordinates visually according to level
        const targetNode = nodes.find(n => n.id === targetConnectId)
        if (targetNode) {
            setNodes(prev => prev.map(n => {
                if (n.id === selectedNode.id) {
                    const newY = connectDirection === "superior" ? Math.max(30, targetNode.y - 120) : targetNode.y + 120
                    return { ...n, y: newY }
                }
                return n
            }))
        }

        setConnections(prev => [...prev, newConn])
        setIsConnectModalOpen(false)
    }

    const handleOpenPrivileges = (node: ProfileNode) => {
        setSelectedNode(node)
        setIsPrivilegesModalOpen(true)
    }

    const toggleModule = (mod: string) => {
        if (!selectedNode) return
        const has = selectedNode.modules.includes(mod)
        const updatedModules = has 
            ? selectedNode.modules.filter(m => m !== mod)
            : [...selectedNode.modules, mod]

        setSelectedNode({ ...selectedNode, modules: updatedModules })
        setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, modules: updatedModules } : n))
    }

    const availableModules = [
        "Cotizador PDF", "Matriz de Precios", "WhatsApp CRM", "Escáner Óptico",
        "Tienda E-Commerce", "Finanzas & Balance", "Super Admin", "Coordinación",
        "Supervisión", "Portal Técnicos", "Software & Logs", "Publicidad Meta Ads"
    ]

    return (
        <div className="w-full h-full flex flex-col space-y-4 text-white font-sans">
            {/* Top Bar with Mode Toggles */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Asignaciones & Organigrama Jerárquico</h3>
                        <p className="text-xs text-slate-400 font-mono">
                            Espacio 2D interactivo con sombras, conexiones de jerarquía superior/inferior y privilegios por rol.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setInteractionMode("drag_nodes")}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            interactionMode === "drag_nodes" ? "bg-cyan-500 text-black border-cyan-400" : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                    >
                        <Move size={13} />
                        <span>Arrastrar Nodos</span>
                    </button>
                    <button
                        onClick={() => setInteractionMode("move_links")}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            interactionMode === "move_links" ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                    >
                        <Link2 size={13} />
                        <span>Mover Enlaces</span>
                    </button>
                    <button
                        onClick={() => setInteractionMode("privileges")}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            interactionMode === "privileges" ? "bg-emerald-500 text-black border-emerald-400" : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                    >
                        <Shield size={13} />
                        <span>Elegir Privilegios</span>
                    </button>
                </div>
            </div>

            {/* Interactive 2D Canvas */}
            <div
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="w-full h-[520px] bg-[#060914] rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden select-none cursor-crosshair"
                style={{
                    backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                }}
            >
                {/* SVG Connections Canvas */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                    {connections.map(c => {
                        const from = nodes.find(n => n.id === c.fromId)
                        const to = nodes.find(n => n.id === c.toId)
                        if (!from || !to) return null
                        const x1 = from.x + 90
                        const y1 = from.y + 35
                        const x2 = to.x + 90
                        const y2 = to.y + 35
                        return (
                            <g key={c.id}>
                                <path
                                    d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                                    stroke="url(#lineGrad)"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeDasharray={c.relationship === "superior" ? "5 5" : "none"}
                                />
                                <circle cx={x2} cy={y2} r="4" fill="#06b6d4" />
                            </g>
                        )
                    })}
                </svg>

                {/* Draggable Profile Nodes */}
                {nodes.map(n => (
                    <div
                        key={n.id}
                        onMouseDown={() => handleMouseDown(n.id)}
                        style={{ transform: `translate(${n.x}px, ${n.y}px)` }}
                        className={`absolute z-20 w-[185px] p-3 rounded-2xl bg-[#090d1e]/95 border backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-shadow duration-200 cursor-grab active:cursor-grabbing ${
                            draggingNodeId === n.id 
                                ? "border-cyan-400 ring-2 ring-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.4)]" 
                                : n.category === "admin" 
                                    ? "border-purple-500/50" 
                                    : n.category === "coordinacion"
                                        ? "border-indigo-500/50"
                                        : "border-cyan-500/30"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                                Nivel {n.level}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleStartConnect(n) }}
                                    className="p-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40"
                                    title="Conectar con otro perfil"
                                >
                                    <Link2 size={11} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleOpenPrivileges(n) }}
                                    className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40"
                                    title="Configurar Privilegios"
                                >
                                    <Shield size={11} />
                                </button>
                            </div>
                        </div>

                        <h5 className="font-bold text-white text-xs truncate">{n.name}</h5>
                        <p className="text-[10px] text-cyan-300 font-mono truncate">{n.role}</p>

                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                            <span>{n.modules.length} Módulos</span>
                            <span className="text-emerald-400 font-bold">Activo</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal: Conectar con... (Pregunta Condicionante Nivel Superior / Inferior) */}
            {isConnectModalOpen && selectedNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-[#090d1e] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Link2 size={16} className="text-cyan-400" />
                                <h4 className="font-bold text-white text-sm">Conectar Jerarquía de Perfil</h4>
                            </div>
                            <button onClick={() => setIsConnectModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <div className="text-xs space-y-3 font-sans">
                            <p className="text-slate-300">
                                Conectando a <strong className="text-cyan-300">{selectedNode.name}</strong> ({selectedNode.role}) con:
                            </p>

                            <div>
                                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Seleccionar Perfil Destino:</label>
                                <select
                                    value={targetConnectId}
                                    onChange={(e) => setTargetConnectId(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                                >
                                    {nodes.filter(n => n.id !== selectedNode.id).map(n => (
                                        <option key={n.id} value={n.id}>{n.name} — {n.role}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Pregunta Condicionante */}
                            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                                <label className="text-white font-bold block text-xs">
                                    ¿Cómo deseas ubicar la conexión en el mapa conceptual?
                                </label>
                                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setConnectDirection("superior")}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                            connectDirection === "superior"
                                                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                                                : "bg-slate-900 border-slate-800 text-slate-400"
                                        }`}
                                    >
                                        <ArrowUp size={16} className="text-cyan-400" />
                                        <span>NIVEL SUPERIOR</span>
                                        <span className="text-[9px] text-slate-400">(Ubicar Arriba)</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setConnectDirection("inferior")}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                            connectDirection === "inferior"
                                                ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold"
                                                : "bg-slate-900 border-slate-800 text-slate-400"
                                        }`}
                                    >
                                        <ArrowDown size={16} className="text-indigo-400" />
                                        <span>NIVEL INFERIOR</span>
                                        <span className="text-[9px] text-slate-400">(Ubicar Abajo)</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsConnectModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmConnect}
                                    className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 shadow-md"
                                >
                                    Confirmar Conexión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Privilegios y Módulos */}
            {isPrivilegesModalOpen && selectedNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-lg bg-[#090d1e] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-emerald-400" />
                                <h4 className="font-bold text-white text-sm">
                                    Privilegios de {selectedNode.name}
                                </h4>
                            </div>
                            <button onClick={() => setIsPrivilegesModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <p className="text-xs text-slate-400 font-mono">
                            Activa o desactiva los módulos accesibles para este puesto en ATOMIC ERP:
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono max-h-60 overflow-y-auto p-1">
                            {availableModules.map(mod => {
                                const isAllowed = selectedNode.modules.includes(mod)
                                return (
                                    <button
                                        key={mod}
                                        type="button"
                                        onClick={() => toggleModule(mod)}
                                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                            isAllowed
                                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold"
                                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        <span className="truncate">{mod}</span>
                                        {isAllowed ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-slate-600" />}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsPrivilegesModalOpen(false)}
                                className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 shadow-md"
                            >
                                Guardar Privilegios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
