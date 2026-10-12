"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Users, Link2, Shield, Plus, Move, Edit3, 
    ArrowUp, ArrowDown, Check, X, Sparkles, 
    Trash2, Eye, Download, Info, ZoomIn, ZoomOut, 
    Maximize2, RotateCcw, Smartphone, Monitor, 
    Layers, ChevronRight, ChevronDown, CheckCircle2,
    Crown, ShieldAlert, Cpu, Wrench, Briefcase, Hand
} from "lucide-react"

export interface ProfileNode {
    id: string
    name: string
    role: string
    category: "admin" | "coordinacion" | "ventas" | "tecnicos" | "growth" | "tech"
    x: number
    y: number
    level: 1 | 2 | 3 // 1: Cúspide/Dirección, 2: Táctico/Supervisión, 3: Operativo
    modules: string[]
    superiorId?: string
}

export interface Connection {
    id: string
    fromId: string
    toId: string
    relationship: "superior" | "inferior"
}

// Initial official team scheme
const INITIAL_NODES: ProfileNode[] = [
    { 
        id: "p1", 
        name: "Santiago Guzmán (CEO)", 
        role: "SUPER ADMIN / GERENCIA GENERAL", 
        category: "admin", 
        x: 420, 
        y: 40, 
        level: 1, 
        modules: ["Todos los Módulos", "Finanzas", "Super Admin", "Cotizador", "Matriz de Precios", "Ruta del Día"] 
    },
    { 
        id: "p2", 
        name: "Coordinación Operativa", 
        role: "COORDINADOR GENERAL DE EQUIPO", 
        category: "coordinacion", 
        x: 220, 
        y: 190, 
        level: 2, 
        superiorId: "p1",
        modules: ["Coordinación", "Asistencia", "CRM WhatsApp", "Cotizador", "Matriz Precios"] 
    },
    { 
        id: "p3", 
        name: "Supervisión Comercial", 
        role: "SUPERVISOR DE VENTAS & PROSPECCIÓN", 
        category: "coordinacion", 
        x: 620, 
        y: 190, 
        level: 2, 
        superiorId: "p1",
        modules: ["Supervisión", "CRM", "Matriz Precios", "Suicide Squad", "Seguimiento"] 
    },
    { 
        id: "p4", 
        name: "Ana Jessica López", 
        role: "ASESOR COMERCIAL SENIOR", 
        category: "ventas", 
        x: 80, 
        y: 350, 
        level: 3, 
        superiorId: "p2",
        modules: ["Cotizador PDF", "CRM WhatsApp", "Matriz Precios", "Tienda"] 
    },
    { 
        id: "p5", 
        name: "Vanessa Zurita", 
        role: "ASESOR COMERCIAL & ATENCIÓN", 
        category: "ventas", 
        x: 300, 
        y: 350, 
        level: 3, 
        superiorId: "p2",
        modules: ["Cotizador PDF", "CRM WhatsApp", "Matriz Precios", "Tienda"] 
    },
    { 
        id: "p6", 
        name: "Téc. Darwin Sánchez", 
        role: "JEFE TÉCNICO & CAMPO", 
        category: "tecnicos", 
        x: 540, 
        y: 350, 
        level: 3, 
        superiorId: "p3",
        modules: ["Portal Técnicos", "Escáner Óptico", "Catálogo", "Despachos"] 
    },
    { 
        id: "p7", 
        name: "Célula Software & IA", 
        role: "INGENIERÍA & SISTEMAS (DEV)", 
        category: "tech", 
        x: 760, 
        y: 350, 
        level: 3, 
        superiorId: "p1",
        modules: ["Software & Logs", "AnyDesk", "Tokens Meta", "Base de Datos"] 
    }
]

const INITIAL_CONNECTIONS: Connection[] = [
    { id: "c1", fromId: "p1", toId: "p2", relationship: "inferior" },
    { id: "c2", fromId: "p1", toId: "p3", relationship: "inferior" },
    { id: "c3", fromId: "p2", toId: "p4", relationship: "inferior" },
    { id: "c4", fromId: "p2", toId: "p5", relationship: "inferior" },
    { id: "c5", fromId: "p3", toId: "p6", relationship: "inferior" },
    { id: "c6", fromId: "p1", toId: "p7", relationship: "inferior" }
]

const AVAILABLE_MODULES = [
    "Cotizador PDF", "Matriz de Precios", "WhatsApp CRM", "Escáner Óptico",
    "Tienda E-Commerce", "Finanzas & Balance", "Super Admin", "Coordinación",
    "Supervisión", "Portal Técnicos", "Software & Logs", "Publicidad Meta Ads"
]

export default function InteractiveHierarchyMap() {
    // Primary Scheme State with LocalStorage persistence
    const [nodes, setNodes] = useState<ProfileNode[]>(INITIAL_NODES)
    const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS)

    // View Mode: 'tree' (ultra mobile responsive) vs 'canvas' (2D interactive canvas)
    const [viewMode, setViewMode] = useState<"tree" | "canvas">("tree")
    const [interactionMode, setInteractionMode] = useState<"pan" | "drag_nodes" | "move_links">("pan")

    // Zoom & Pan state for 2D Canvas
    const [zoom, setZoom] = useState(0.85)
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
    const [isPanning, setIsPanning] = useState(false)
    const [panStart, setPanStart] = useState({ x: 0, y: 0 })

    // Node Dragging State
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
    const [nodeInitialPos, setNodeInitialPos] = useState({ x: 0, y: 0 })

    // Selection & Modals
    const [selectedNode, setSelectedNode] = useState<ProfileNode | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
    const [isPrivilegesModalOpen, setIsPrivilegesModalOpen] = useState(false)

    // Forms
    const [editFormData, setEditFormData] = useState<Partial<ProfileNode>>({})
    const [targetConnectId, setTargetConnectId] = useState<string>("")
    const [connectDirection, setConnectDirection] = useState<"superior" | "inferior">("inferior")

    // Mobile & Tree Navigation Filters
    const [treeSearch, setTreeSearch] = useState("")
    const [treeLevelFilter, setTreeLevelFilter] = useState<"all" | 1 | 2 | 3>("all")
    const lastPinchDistance = useRef<number | null>(null)
    const canvasContainerRef = useRef<HTMLDivElement>(null)

    // Auto-fit calculation for canvas
    const handleAutoFit = useCallback(() => {
        if (!canvasContainerRef.current) return
        const containerWidth = canvasContainerRef.current.clientWidth || 360
        const containerHeight = canvasContainerRef.current.clientHeight || 480

        let minX = 9999, maxX = 0, minY = 9999, maxY = 0
        nodes.forEach(n => {
            if (n.x < minX) minX = n.x
            if (n.x + 200 > maxX) maxX = n.x + 200
            if (n.y < minY) minY = n.y
            if (n.y + 120 > maxY) maxY = n.y + 120
        })
        if (minX === 9999) { minX = 0; maxX = 1000; minY = 0; maxY = 500; }

        const diagramWidth = Math.max(maxX - minX + 40, 600)
        const diagramHeight = Math.max(maxY - minY + 40, 400)

        const scaleX = (containerWidth - 28) / diagramWidth
        const scaleY = (containerHeight - 28) / diagramHeight
        const idealZoom = Math.max(0.32, Math.min(0.9, Number(Math.min(scaleX, scaleY).toFixed(2))))

        const idealOffsetX = Math.round((containerWidth - (maxX + minX) * idealZoom) / 2)
        const idealOffsetY = Math.max(10, Math.round((containerHeight - (maxY + minY) * idealZoom) / 2))

        setZoom(idealZoom)
        setPanOffset({ x: idealOffsetX, y: idealOffsetY })
    }, [nodes])

    // Load from localStorage on mount & auto-detect mobile
    useEffect(() => {
        try {
            const savedNodes = localStorage.getItem("atomic_hierarchy_nodes")
            const savedConns = localStorage.getItem("atomic_hierarchy_connections")
            if (savedNodes) setNodes(JSON.parse(savedNodes))
            if (savedConns) setConnections(JSON.parse(savedConns))
        } catch (e) {}

        // In mobile viewports (< 768px), default to 'tree' view and lower zoom on canvas
        if (typeof window !== "undefined") {
            if (window.innerWidth < 768) {
                setViewMode("tree")
                setZoom(0.42)
                setPanOffset({ x: -20, y: 15 })
            } else {
                setViewMode("canvas")
                setZoom(0.85)
            }
        }
    }, [])

    // Save to localStorage whenever nodes or connections change
    const persistData = (newNodes: ProfileNode[], newConns: Connection[]) => {
        try {
            localStorage.setItem("atomic_hierarchy_nodes", JSON.stringify(newNodes))
            localStorage.setItem("atomic_hierarchy_connections", JSON.stringify(newConns))
        } catch (e) {}
    }

    // Reset to defaults
    const handleResetDefaults = () => {
        if (!confirm("¿Deseas restablecer el organigrama y asignaciones al esquema original oficial?")) return
        setNodes(INITIAL_NODES)
        setConnections(INITIAL_CONNECTIONS)
        setZoom(0.85)
        setPanOffset({ x: 0, y: 0 })
        persistData(INITIAL_NODES, INITIAL_CONNECTIONS)
    }

    // Auto-align hierarchy pyramid layout
    const handleAutoLayout = () => {
        const level1 = nodes.filter(n => n.level === 1)
        const level2 = nodes.filter(n => n.level === 2)
        const level3 = nodes.filter(n => n.level === 3)

        const containerWidth = 960

        const distribute = (items: ProfileNode[], y: number) => {
            const count = items.length
            if (count === 0) return []
            const step = containerWidth / (count + 1)
            return items.map((item, idx) => ({
                ...item,
                x: Math.round(step * (idx + 1) - 90),
                y
            }))
        }

        const newL1 = distribute(level1, 40)
        const newL2 = distribute(level2, 200)
        const newL3 = distribute(level3, 360)

        const allNew = [...newL1, ...newL2, ...newL3]
        setNodes(allNew)
        persistData(allNew, connections)
    }

    // Shift node hierarchy level directly
    const handleShiftLevel = (nodeId: string, newLevel: 1 | 2 | 3) => {
        const updated = nodes.map(n => n.id === nodeId ? { ...n, level: newLevel } : n)
        setNodes(updated)
        persistData(updated, connections)
    }

    // Pan canvas smoothly
    const panBy = (dx: number, dy: number) => {
        setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }))
    }

    // ─────────────────────────────────────────────────────────────
    // CANVAS MOUSE & TOUCH GESTURES (PAN & DRAG)
    // ─────────────────────────────────────────────────────────────
    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (interactionMode === "pan" || e.target === canvasContainerRef.current) {
            setIsPanning(true)
            setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
        }
    }

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            setPanOffset({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            })
            return
        }

        if (draggingNodeId) {
            const dx = (e.clientX - dragStartPos.x) / zoom
            const dy = (e.clientY - dragStartPos.y) / zoom

            setNodes(prev => prev.map(n => {
                if (n.id === draggingNodeId) {
                    return {
                        ...n,
                        x: Math.round(nodeInitialPos.x + dx),
                        y: Math.round(nodeInitialPos.y + dy)
                    }
                }
                return n
            }))
        }
    }

    const handleCanvasMouseUp = () => {
        if (isPanning) setIsPanning(false)
        if (draggingNodeId) {
            setDraggingNodeId(null)
            persistData(nodes, connections)
        }
    }

    // Touch Support for Mobile with 2-Finger Pinch Zoom & 1-Finger Pan
    const handleTouchStart = (e: React.TouchEvent, nodeId?: string) => {
        if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            )
            lastPinchDistance.current = dist
            return
        }

        if (nodeId && interactionMode === "drag_nodes") {
            const touch = e.touches[0]
            const target = nodes.find(n => n.id === nodeId)
            if (target) {
                setDraggingNodeId(nodeId)
                setDragStartPos({ x: touch.clientX, y: touch.clientY })
                setNodeInitialPos({ x: target.x, y: target.y })
            }
        } else {
            const touch = e.touches[0]
            setIsPanning(true)
            setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y })
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        // Pinch-to-zoom on mobile
        if (e.touches.length === 2 && lastPinchDistance.current !== null) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            )
            const factor = dist / lastPinchDistance.current
            lastPinchDistance.current = dist
            setZoom(prev => Math.max(0.28, Math.min(1.8, Number((prev * factor).toFixed(2)))))
            return
        }

        const touch = e.touches[0]
        if (draggingNodeId) {
            const dx = (touch.clientX - dragStartPos.x) / zoom
            const dy = (touch.clientY - dragStartPos.y) / zoom

            setNodes(prev => prev.map(n => {
                if (n.id === draggingNodeId) {
                    return {
                        ...n,
                        x: Math.round(nodeInitialPos.x + dx),
                        y: Math.round(nodeInitialPos.y + dy)
                    }
                }
                return n
            }))
        } else if (isPanning) {
            setPanOffset({
                x: touch.clientX - panStart.x,
                y: touch.clientY - panStart.y
            })
        }
    }

    const handleTouchEnd = () => {
        lastPinchDistance.current = null
        setIsPanning(false)
        if (draggingNodeId) {
            setDraggingNodeId(null)
            persistData(nodes, connections)
        }
    }

    const startDragNode = (e: React.MouseEvent, node: ProfileNode) => {
        e.stopPropagation()
        if (interactionMode === "pan") {
            // In pan mode, selecting node selects it, but let canvas pan
            setSelectedNode(node)
            return
        }
        setDraggingNodeId(node.id)
        setDragStartPos({ x: e.clientX, y: e.clientY })
        setNodeInitialPos({ x: node.x, y: node.y })
    }

    // ─────────────────────────────────────────────────────────────
    // CRUD & CONNECTION HANDLERS
    // ─────────────────────────────────────────────────────────────
    const openCreateModal = () => {
        setEditFormData({
            name: "",
            role: "ASESOR COMERCIAL / OPERATIVO",
            category: "ventas",
            level: 3,
            modules: ["Cotizador PDF", "CRM WhatsApp"],
            superiorId: "p1"
        })
        setIsCreateModalOpen(true)
    }

    const handleSaveNewNode = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editFormData.name?.trim()) return

        const newId = `p_${Date.now()}`
        const newNode: ProfileNode = {
            id: newId,
            name: editFormData.name.trim(),
            role: editFormData.role?.trim() || "MIEMBRO DE EQUIPO",
            category: editFormData.category || "ventas",
            level: editFormData.level || 3,
            modules: editFormData.modules || ["Cotizador PDF"],
            x: 400 + Math.floor(Math.random() * 80),
            y: (editFormData.level || 3) === 1 ? 40 : (editFormData.level === 2 ? 190 : 350),
            superiorId: editFormData.superiorId
        }

        const updatedNodes = [...nodes, newNode]
        let updatedConns = [...connections]

        if (editFormData.superiorId) {
            updatedConns.push({
                id: `c_${Date.now()}`,
                fromId: editFormData.superiorId,
                toId: newId,
                relationship: "inferior"
            })
        }

        setNodes(updatedNodes)
        setConnections(updatedConns)
        persistData(updatedNodes, updatedConns)
        setIsCreateModalOpen(false)
    }

    const openEditModal = (node: ProfileNode) => {
        setSelectedNode(node)
        setEditFormData({ ...node })
        setIsEditModalOpen(true)
    }

    const handleSaveEditNode = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedNode || !editFormData.name?.trim()) return

        const updatedNodes = nodes.map(n => {
            if (n.id === selectedNode.id) {
                return {
                    ...n,
                    name: editFormData.name!.trim(),
                    role: editFormData.role!.trim(),
                    category: editFormData.category!,
                    level: editFormData.level!,
                    superiorId: editFormData.superiorId
                }
            }
            return n
        })

        // Update superior connection if changed
        let updatedConns = connections.filter(c => !(c.toId === selectedNode.id && c.relationship === "inferior"))
        if (editFormData.superiorId && editFormData.superiorId !== selectedNode.id) {
            updatedConns.push({
                id: `c_${Date.now()}`,
                fromId: editFormData.superiorId,
                toId: selectedNode.id,
                relationship: "inferior"
            })
        }

        setNodes(updatedNodes)
        setConnections(updatedConns)
        persistData(updatedNodes, updatedConns)
        setIsEditModalOpen(false)
    }

    const handleDeleteNode = (nodeId: string, nodeName: string) => {
        if (!confirm(`¿Deseas eliminar a "${nodeName}" del esquema jerárquico?`)) return
        const updatedNodes = nodes.filter(n => n.id !== nodeId)
        const updatedConns = connections.filter(c => c.fromId !== nodeId && c.toId !== nodeId)
        setNodes(updatedNodes)
        setConnections(updatedConns)
        persistData(updatedNodes, updatedConns)
        if (selectedNode?.id === nodeId) setSelectedNode(null)
    }

    // Connect Node Flow
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

        const updatedConns = [...connections, newConn]
        setConnections(updatedConns)
        persistData(nodes, updatedConns)
        setIsConnectModalOpen(false)
    }

    // Privileges Toggle
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
        const updatedNodes = nodes.map(n => n.id === selectedNode.id ? { ...n, modules: updatedModules } : n)
        setNodes(updatedNodes)
        persistData(updatedNodes, connections)
    }

    // Helpers for Category styling
    const getCategoryBadge = (category: ProfileNode["category"]) => {
        switch (category) {
            case "admin":
                return { label: "Dirección", bg: "bg-purple-500/20 text-purple-300 border-purple-500/40", icon: Crown }
            case "coordinacion":
                return { label: "Coordinación", bg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40", icon: ShieldAlert }
            case "ventas":
                return { label: "Ventas & B2B", bg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40", icon: Briefcase }
            case "tecnicos":
                return { label: "Técnico Campo", bg: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: Wrench }
            case "tech":
                return { label: "Sistemas & IA", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: Cpu }
            default:
                return { label: "General", bg: "bg-slate-500/20 text-slate-300 border-slate-500/40", icon: Users }
        }
    }

    return (
        <div className="w-full h-full flex flex-col space-y-4 text-white font-sans animate-in fade-in duration-200">
            {/* ── TOP UNIFIED TOOLBAR ── */}
            <div className="bg-slate-900/90 border border-white/10 p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-black flex items-center justify-center font-black shadow-lg shadow-indigo-500/30 shrink-0">
                        <Users size={22} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                <span>Organigrama & Asignaciones</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                    {nodes.length} Miembros
                                </span>
                            </h3>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Esquema jerárquico editable · Niveles de mando, subordinación y permisos modulares
                        </p>
                    </div>
                </div>

                {/* Primary Mode Selector: Celular / Tree vs Lienzo 2D */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
                    {/* View Switcher Pills */}
                    <div className="flex items-center gap-1 p-1 bg-black/60 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setViewMode("tree")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                viewMode === "tree" 
                                    ? "bg-cyan-500 text-black font-extrabold shadow-md scale-102" 
                                    : "text-slate-400 hover:text-white"
                            }`}
                            title="Vista óptima para celular: Árbol vertical por niveles jerárquicos"
                        >
                            <Smartphone size={14} />
                            <span>📱 Árbol Móvil</span>
                        </button>

                        <button
                            onClick={() => setViewMode("canvas")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                viewMode === "canvas" 
                                    ? "bg-indigo-600 text-white font-extrabold shadow-md scale-102" 
                                    : "text-slate-400 hover:text-white"
                            }`}
                            title="Vista gráfica 2D con líneas SVG y zoom interactivo"
                        >
                            <Monitor size={14} />
                            <span>🗺️ Lienzo 2D</span>
                        </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={openCreateModal}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
                        >
                            <Plus size={14} />
                            <span>+ Nuevo Perfil</span>
                        </button>

                        <button
                            onClick={handleAutoLayout}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono cursor-pointer transition-colors"
                            title="Alinear automáticamente en pirámide jerárquica"
                        >
                            <Sparkles size={15} />
                        </button>

                        <button
                            onClick={handleResetDefaults}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs font-mono cursor-pointer transition-colors"
                            title="Restablecer organigrama a configuración de fábrica"
                        >
                            <RotateCcw size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* VIEW 1: ÁRBOL MÓVIL OPTIMIZADO (NUNCA SE CORTA NI DESBORDA) */}
            {/* ═══════════════════════════════════════════════════════ */}
            {viewMode === "tree" && (
                <div className="flex-1 overflow-y-auto space-y-5 pb-6 custom-scrollbar">
                    
                    {/* Barra de Búsqueda y Filtros de Nivel para Celular */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    value={treeSearch}
                                    onChange={(e) => setTreeSearch(e.target.value)}
                                    placeholder="Buscar por colaborador, cargo o función..."
                                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-sans"
                                />
                                {treeSearch && (
                                    <button 
                                        onClick={() => setTreeSearch("")} 
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Level Filter Pills */}
                            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-[10px] font-mono">
                                {[
                                    { id: "all", label: `Todos (${nodes.length})` },
                                    { id: 1, label: "👑 N1 Cúspide" },
                                    { id: 2, label: "🛡️ N2 Táctico" },
                                    { id: 3, label: "⚡ N3 Operativo" }
                                ].map(tab => (
                                    <button
                                        key={String(tab.id)}
                                        onClick={() => setTreeLevelFilter(tab.id as any)}
                                        className={`px-2.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer ${
                                            treeLevelFilter === tab.id
                                                ? "bg-cyan-500 text-black shadow-sm"
                                                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                            <span className="flex items-center gap-1.5 text-cyan-300">
                                <Info size={13} className="shrink-0" />
                                <span>Vista vertical 100% adaptable para celular: Mueve niveles con 1 toque.</span>
                            </span>
                            <button
                                onClick={handleAutoLayout}
                                className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <Sparkles size={11} />
                                <span>Alinear Pirámide</span>
                            </button>
                        </div>
                    </div>

                    {/* Hierarchy Levels */}
                    {[1, 2, 3]
                        .filter(lvl => treeLevelFilter === "all" || treeLevelFilter === lvl)
                        .map((lvl) => {
                            const levelNodes = nodes.filter(n => {
                                const matchLevel = n.level === lvl
                                const matchSearch = !treeSearch || 
                                    n.name.toLowerCase().includes(treeSearch.toLowerCase()) ||
                                    n.role.toLowerCase().includes(treeSearch.toLowerCase()) ||
                                    n.modules.some(m => m.toLowerCase().includes(treeSearch.toLowerCase()))
                                return matchLevel && matchSearch
                            })

                            if (levelNodes.length === 0 && treeSearch) return null

                            const levelTitle = lvl === 1 
                                ? "👑 Nivel 1: Cúspide & Dirección General" 
                                : lvl === 2 
                                    ? "🛡️ Nivel 2: Coordinación & Supervisión Táctica" 
                                    : "⚡ Nivel 3: Operativo, Ventas, Técnicos & Software"

                            return (
                                <div key={lvl} className="space-y-3">
                                    {/* Level Header Badge */}
                                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-200">
                                                {levelTitle}
                                            </h4>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                                                {levelNodes.length} {levelNodes.length === 1 ? "cargo" : "cargos"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cards Grid for this level */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {levelNodes.map(node => {
                                            const badge = getCategoryBadge(node.category)
                                            const BadgeIcon = badge.icon
                                            const superior = nodes.find(n => n.id === node.superiorId)
                                            const subordinates = nodes.filter(n => n.superiorId === node.id)

                                            return (
                                                <div 
                                                    key={node.id}
                                                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-md flex flex-col justify-between space-y-3 relative group"
                                                >
                                                    {/* Card Header */}
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${badge.bg}`}>
                                                                <BadgeIcon size={18} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h5 className="text-xs sm:text-sm font-extrabold text-white truncate">
                                                                    {node.name}
                                                                </h5>
                                                                <p className="text-[10px] text-cyan-300 font-mono truncate">
                                                                    {node.role}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                                                                {badge.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Superior & Subordinates info */}
                                                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-[10px] font-mono">
                                                        {superior && (
                                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                                <ArrowUp size={11} className="text-cyan-400 shrink-0" />
                                                                <span className="text-slate-500">Reporta a:</span>
                                                                <strong className="text-white truncate">{superior.name}</strong>
                                                            </div>
                                                        )}
                                                        {subordinates.length > 0 && (
                                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                                <ArrowDown size={11} className="text-indigo-400 shrink-0" />
                                                                <span className="text-slate-500">Supervisa a:</span>
                                                                <span className="text-indigo-300 truncate">
                                                                    {subordinates.map(s => s.name.split(" ")[0]).join(", ")}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-900">
                                                            <span>Módulos activos:</span>
                                                            <span className="text-emerald-400 font-bold">{node.modules.length} autorizados</span>
                                                        </div>
                                                    </div>

                                                    {/* Level Shift Quick Control (Subir / Bajar nivel directamente) */}
                                                    <div className="flex items-center justify-between bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/60 text-[10px] font-mono">
                                                        <span className="text-slate-400 pl-1">Jerarquía:</span>
                                                        <div className="flex items-center gap-1">
                                                            {node.level > 1 && (
                                                                <button
                                                                    onClick={() => handleShiftLevel(node.id, (node.level - 1) as any)}
                                                                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold cursor-pointer"
                                                                    title="Ascender nivel jerárquico"
                                                                >
                                                                    ▲ Subir N{node.level - 1}
                                                                </button>
                                                            )}
                                                            {node.level < 3 && (
                                                                <button
                                                                    onClick={() => handleShiftLevel(node.id, (node.level + 1) as any)}
                                                                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold cursor-pointer"
                                                                    title="Descender nivel jerárquico"
                                                                >
                                                                    ▼ Bajar N{node.level + 1}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons Toolbar */}
                                                    <div className="flex items-center gap-1.5 pt-1">
                                                        <button
                                                            onClick={() => openEditModal(node)}
                                                            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                                        >
                                                            <Edit3 size={12} />
                                                            <span>Editar</span>
                                                        </button>

                                                        <button
                                                            onClick={() => handleOpenPrivileges(node)}
                                                            className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                                        >
                                                            <Shield size={12} />
                                                            <span>Permisos</span>
                                                        </button>

                                                        <button
                                                            onClick={() => handleStartConnect(node)}
                                                            className="p-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-colors cursor-pointer"
                                                            title="Conectar jerarquía"
                                                        >
                                                            <Link2 size={13} />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteNode(node.id, node.name)}
                                                            className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-mono transition-colors cursor-pointer"
                                                            title="Eliminar de organigrama"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* VIEW 2: LIENZO 2D INTERACTIVO (CON ZOOM & TOUCH PAN)  */}
            {/* ═══════════════════════════════════════════════════════ */}
            {viewMode === "canvas" && (
                <div className="flex-1 flex flex-col space-y-3 min-h-[500px]">
                    {/* Canvas Floating Sub-Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-2.5 rounded-2xl border border-white/10 text-xs font-mono">
                        {/* Interaction Mode Switcher */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setInteractionMode("pan")}
                                className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                                    interactionMode === "pan" 
                                        ? "bg-cyan-500 text-black font-bold shadow-sm" 
                                        : "bg-slate-800 text-slate-300 hover:text-white"
                                }`}
                                title="Arrastra el lienzo para desplazarte con 1 dedo o mouse"
                            >
                                <Hand size={13} />
                                <span>Mover Lienzo</span>
                            </button>

                            <button
                                onClick={() => setInteractionMode("drag_nodes")}
                                className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                                    interactionMode === "drag_nodes" 
                                        ? "bg-indigo-600 text-white font-bold shadow-sm" 
                                        : "bg-slate-800 text-slate-300 hover:text-white"
                                }`}
                                title="Toca y arrastra cualquier nodo de persona"
                            >
                                <Move size={13} />
                                <span>Mover Nodos</span>
                            </button>
                        </div>

                        {/* Zoom Controls & Presets */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setZoom(prev => Math.max(0.28, Number((prev - 0.12).toFixed(2))))}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer font-bold"
                                title="Alejar (Zoom Out)"
                            >
                                <ZoomOut size={13} />
                            </button>

                            <span className="w-11 text-center text-slate-300 font-bold text-[11px]">
                                {Math.round(zoom * 100)}%
                            </span>

                            <button
                                onClick={() => setZoom(prev => Math.min(1.8, Number((prev + 0.12).toFixed(2))))}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer font-bold"
                                title="Acercar (Zoom In)"
                            >
                                <ZoomIn size={13} />
                            </button>

                            <button
                                onClick={handleAutoFit}
                                className="px-2 py-1 rounded-lg bg-cyan-500 text-black text-[10px] font-extrabold cursor-pointer hover:bg-cyan-400 transition-colors shadow-sm"
                                title="Ajustar automáticamente al ancho de la pantalla"
                            >
                                <Maximize2 size={11} className="inline mr-1" />
                                Ajustar Pantalla
                            </button>
                        </div>
                    </div>

                    {/* Interactive Pan & Zoom Canvas Area */}
                    <div
                        ref={canvasContainerRef}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className={`flex-1 min-h-[460px] bg-[#060914] rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden select-none ${
                            isPanning ? "cursor-grabbing" : interactionMode === "pan" ? "cursor-grab" : "cursor-crosshair"
                        }`}
                        style={{
                            backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                            touchAction: "none"
                        }}
                    >
                        {/* Floating Mobile D-Pad Virtual Controller */}
                        <div className="absolute bottom-3 right-3 z-30 flex flex-col items-end gap-1.5 pointer-events-auto select-none">
                            <div className="bg-slate-950/90 border border-cyan-500/40 p-1 rounded-2xl shadow-2xl backdrop-blur-md grid grid-cols-3 gap-1 w-24 text-center">
                                <div></div>
                                <button
                                    type="button"
                                    onClick={() => panBy(0, 60)}
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg active:scale-90 text-[11px] font-bold"
                                    title="Subir Lienzo"
                                >
                                    ▲
                                </button>
                                <div></div>
                                <button
                                    type="button"
                                    onClick={() => panBy(60, 0)}
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg active:scale-90 text-[11px] font-bold"
                                    title="Izquierda"
                                >
                                    ◀
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAutoFit}
                                    className="p-1 bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-200 rounded-lg active:scale-90 text-[8px] font-mono font-bold flex items-center justify-center uppercase"
                                    title="Auto-Ajustar Todo"
                                >
                                    Fit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => panBy(-60, 0)}
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg active:scale-90 text-[11px] font-bold"
                                    title="Derecha"
                                >
                                    ▶
                                </button>
                                <div></div>
                                <button
                                    type="button"
                                    onClick={() => panBy(0, -60)}
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg active:scale-90 text-[11px] font-bold"
                                    title="Bajar Lienzo"
                                >
                                    ▼
                                </button>
                                <div></div>
                            </div>
                        </div>
                        {/* Movable & Scalable Viewport World */}
                        <div
                            style={{
                                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                                transformOrigin: "0 0",
                                transition: isPanning || draggingNodeId ? "none" : "transform 0.15s ease-out",
                                width: "1200px",
                                height: "700px",
                                position: "relative"
                            }}
                        >
                            {/* SVG Connection Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                                <defs>
                                    <linearGradient id="neonConnectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
                                    </linearGradient>
                                </defs>
                                {connections.map(c => {
                                    const from = nodes.find(n => n.id === c.fromId)
                                    const to = nodes.find(n => n.id === c.toId)
                                    if (!from || !to) return null
                                    const x1 = from.x + 95
                                    const y1 = from.y + 45
                                    const x2 = to.x + 95
                                    const y2 = to.y + 45
                                    return (
                                        <g key={c.id}>
                                            <path
                                                d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                                                stroke="url(#neonConnectionGrad)"
                                                strokeWidth="3"
                                                fill="none"
                                                strokeDasharray={c.relationship === "superior" ? "6 6" : "none"}
                                            />
                                            <circle cx={x2} cy={y2} r="5" fill="#06b6d4" className="animate-pulse" />
                                        </g>
                                    )
                                })}
                            </svg>

                            {/* Nodes inside 2D Canvas */}
                            {nodes.map(n => {
                                const badge = getCategoryBadge(n.category)
                                const isDragging = draggingNodeId === n.id
                                const isSelected = selectedNode?.id === n.id

                                return (
                                    <div
                                        key={n.id}
                                        onMouseDown={(e) => startDragNode(e, n)}
                                        onTouchStart={(e) => handleTouchStart(e, n.id)}
                                        style={{ 
                                            transform: `translate(${n.x}px, ${n.y}px)`,
                                            position: "absolute"
                                        }}
                                        className={`z-20 w-[190px] p-3 rounded-2xl bg-[#090d1e]/95 border backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-shadow duration-150 cursor-grab active:cursor-grabbing ${
                                            isDragging || isSelected
                                                ? "border-cyan-400 ring-2 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.5)] scale-102" 
                                                : n.category === "admin" 
                                                    ? "border-purple-500/60" 
                                                    : n.category === "coordinacion"
                                                        ? "border-indigo-500/60"
                                                        : "border-cyan-500/40"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${badge.bg}`}>
                                                Nivel {n.level}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openEditModal(n) }}
                                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                                    title="Editar datos"
                                                >
                                                    <Edit3 size={11} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStartConnect(n) }}
                                                    className="p-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40"
                                                    title="Conectar perfil"
                                                >
                                                    <Link2 size={11} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenPrivileges(n) }}
                                                    className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40"
                                                    title="Privilegios"
                                                >
                                                    <Shield size={11} />
                                                </button>
                                            </div>
                                        </div>

                                        <h5 className="font-extrabold text-white text-xs truncate">{n.name}</h5>
                                        <p className="text-[10px] text-cyan-300 font-mono truncate">{n.role}</p>

                                        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-400">
                                            <span>{n.modules.length} Módulos</span>
                                            <span className="text-emerald-400 font-bold">Activo</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* MODAL 1: NUEVO PERFIL / EDITAR PERFIL                 */}
            {/* ═══════════════════════════════════════════════════════ */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-[#070b18] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2.5">
                                <Users size={18} className="text-cyan-400" />
                                <h4 className="font-black text-white text-base uppercase tracking-tight">
                                    {isCreateModalOpen ? "Nuevo Perfil en Organigrama" : `Editar Perfil: ${selectedNode?.name}`}
                                </h4>
                            </div>
                            <button 
                                onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false) }}
                                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={isCreateModalOpen ? handleSaveNewNode : handleSaveEditNode} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Nombre Completo *</label>
                                <input
                                    type="text"
                                    required
                                    value={editFormData.name || ""}
                                    onChange={e => setEditFormData(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Ej. Darwin Sánchez"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Cargo Oficial *</label>
                                <input
                                    type="text"
                                    required
                                    value={editFormData.role || ""}
                                    onChange={e => setEditFormData(p => ({ ...p, role: e.target.value }))}
                                    placeholder="Ej. JEFE TÉCNICO & CAMPO"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Departamento / Categoría</label>
                                    <select
                                        value={editFormData.category || "ventas"}
                                        onChange={e => setEditFormData(p => ({ ...p, category: e.target.value as any }))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="admin">👑 Dirección / Gerencia General</option>
                                        <option value="coordinacion">🛡️ Coordinación / Supervisión</option>
                                        <option value="ventas">💼 Ventas & Asesoría Comercial</option>
                                        <option value="tecnicos">🔧 Técnico de Campo / Instalaciones</option>
                                        <option value="tech">💻 Software, IA & Sistemas</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Nivel Jerárquico</label>
                                    <select
                                        value={editFormData.level || 3}
                                        onChange={e => setEditFormData(p => ({ ...p, level: Number(e.target.value) as any }))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value={1}>Nivel 1: Cúspide / Alta Dirección</option>
                                        <option value={2}>Nivel 2: Coordinación & Supervisión</option>
                                        <option value={3}>Nivel 3: Operativo & Asesores</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Superior Inmediato (A quién reporta)</label>
                                <select
                                    value={editFormData.superiorId || ""}
                                    onChange={e => setEditFormData(p => ({ ...p, superiorId: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                                >
                                    <option value="">Sin superior directo (Máxima Autoridad)</option>
                                    {nodes
                                        .filter(n => isCreateModalOpen || n.id !== selectedNode?.id)
                                        .map(n => (
                                            <option key={n.id} value={n.id}>
                                                {n.name} — {n.role} (Nivel {n.level})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false) }}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20"
                                >
                                    {isCreateModalOpen ? "Crear Perfil" : "Guardar Cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* MODAL 2: CONECTAR JERARQUÍA                           */}
            {/* ═══════════════════════════════════════════════════════ */}
            {isConnectModalOpen && selectedNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[#070b18] border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
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
                            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2">
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
                                    className="px-5 py-2 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-400 shadow-md"
                                >
                                    Confirmar Conexión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* MODAL 3: PRIVILEGIOS Y MÓDULOS DE ATOMIC ERP          */}
            {/* ═══════════════════════════════════════════════════════ */}
            {isPrivilegesModalOpen && selectedNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-[#070b18] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <Shield size={18} className="text-emerald-400" />
                                <h4 className="font-bold text-white text-sm">
                                    Privilegios de {selectedNode.name}
                                </h4>
                            </div>
                            <button onClick={() => setIsPrivilegesModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <p className="text-xs text-slate-400 font-mono">
                            Activa o desactiva los módulos accesibles para este puesto en ATOMIC ERP:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono max-h-64 overflow-y-auto p-1">
                            {AVAILABLE_MODULES.map(mod => {
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
                                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-black uppercase text-xs hover:bg-emerald-400 shadow-md"
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
