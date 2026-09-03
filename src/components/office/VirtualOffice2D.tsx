"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Users, MessageSquare, Phone, PhoneOff, Mic, MicOff, 
    StickyNote, Sparkles, Send, X, Shield, Plus, Check,
    Coffee, Monitor, Award, Radio, MapPin, Volume2, Info,
    Trash2, Megaphone, Bell, Image as ImageIcon
} from "lucide-react"

interface AvatarUser {
    id: string
    name: string
    role: string
    department: string
    areaKey: string
    x: number
    y: number
    status: "online" | "busy" | "calling"
    color: string
    avatarEmoji: string
    deskNote?: string
}

interface DeskNote {
    id: string
    targetDesk: string
    from: string
    message: string
    createdAt: string
}

interface OfficeArea {
    key: string
    name: string
    subtitle: string
    emoji: string
    x: number
    y: number
    width: number
    height: number
    colorBorder: string
    colorBg: string
    spawnX: number
    spawnY: number
}

const OFFICE_AREAS: OfficeArea[] = [
    { key: "edicion", name: "Edición & Multimedia", subtitle: "Render & Video", emoji: "🎬", x: 30, y: 20, width: 250, height: 140, colorBorder: "border-purple-500/40", colorBg: "bg-purple-950/20", spawnX: 155, spawnY: 90 },
    { key: "desarrollo", name: "Desarrollo & Software", subtitle: "Sistemas & Devs", emoji: "💻", x: 300, y: 20, width: 250, height: 140, colorBorder: "border-cyan-500/40", colorBg: "bg-cyan-950/20", spawnX: 425, spawnY: 90 },
    { key: "ventas", name: "Ventas & Asesoría", subtitle: "Comercial & Clientes", emoji: "💼", x: 570, y: 20, width: 250, height: 140, colorBorder: "border-emerald-500/40", colorBg: "bg-emerald-950/20", spawnX: 695, spawnY: 90 },

    { key: "supervisor", name: "Supervisión & Calidad", subtitle: "Auditoría & Soporte", emoji: "🛡️", x: 30, y: 180, width: 250, height: 140, colorBorder: "border-blue-500/40", colorBg: "bg-blue-950/20", spawnX: 155, spawnY: 250 },
    { key: "ceo", name: "CEO & Dirección", subtitle: "Gerencia General", emoji: "👑", x: 300, y: 180, width: 250, height: 140, colorBorder: "border-amber-500/50", colorBg: "bg-amber-950/25", spawnX: 425, spawnY: 250 },
    { key: "coordinacion", name: "Coordinación", subtitle: "Operaciones & Team", emoji: "👥", x: 570, y: 180, width: 250, height: 140, colorBorder: "border-teal-500/40", colorBg: "bg-teal-950/20", spawnX: 695, spawnY: 250 },

    { key: "contabilidad", name: "Contabilidad & Finanzas", subtitle: "Facturación & Pagos", emoji: "📊", x: 30, y: 340, width: 250, height: 140, colorBorder: "border-emerald-500/40", colorBg: "bg-emerald-950/20", spawnX: 155, spawnY: 410 },
    { key: "marketing", name: "Marketing & Pautas", subtitle: "Campañas Ads", emoji: "📣", x: 300, y: 340, width: 250, height: 140, colorBorder: "border-rose-500/40", colorBg: "bg-rose-950/20", spawnX: 425, spawnY: 410 },
    { key: "investigacion", name: "Investigación & I+D", subtitle: "Nuevas Tecnologías", emoji: "🔬", x: 570, y: 340, width: 250, height: 140, colorBorder: "border-indigo-500/40", colorBg: "bg-indigo-950/20", spawnX: 695, spawnY: 410 },

    { key: "lounge", name: "Café & Lounge", subtitle: "Área de Descanso", emoji: "☕", x: 30, y: 500, width: 380, height: 110, colorBorder: "border-amber-500/20", colorBg: "bg-amber-950/15", spawnX: 220, spawnY: 550 },
    { key: "recreacion", name: "Cancha Recreativa", subtitle: "Deportes & Relax", emoji: "🏀", x: 440, y: 500, width: 380, height: 110, colorBorder: "border-indigo-500/20", colorBg: "bg-indigo-950/15", spawnX: 630, spawnY: 550 }
]

const INITIAL_COLLEAGUES: AvatarUser[] = [
    { id: "col-ceo", name: "CEO Atomic", role: "GERENTE", department: "Dirección", areaKey: "ceo", x: 425, y: 250, status: "online", color: "#F59E0B", avatarEmoji: "👑", deskNote: "Plan estratégico y expansión 2026" },
    { id: "col-coord", name: "Luis G.", role: "COORDINADOR", department: "Coordinación", areaKey: "coordinacion", x: 695, y: 250, status: "online", color: "#10B981", avatarEmoji: "👨‍💼", deskNote: "Asignando prospectos y coordinando despachos" },
    { id: "col-ventas", name: "Milorieta", role: "ASESORA", department: "Ventas", areaKey: "ventas", x: 695, y: 90, status: "online", color: "#34D399", avatarEmoji: "👩‍💼", deskNote: "Cerrando propuesta de barreras vehiculares" },
    { id: "col-dev", name: "Nicolás", role: "SISTEMAS", department: "Desarrollo", areaKey: "desarrollo", x: 425, y: 90, status: "online", color: "#06B6D4", avatarEmoji: "💻", deskNote: "Optimizando base de datos y APIs del ERP" },
    { id: "col-edicion", name: "Ian Editor", role: "CREATIVO", department: "Edición", areaKey: "edicion", x: 155, y: 90, status: "busy", color: "#A855F7", avatarEmoji: "🎧", deskNote: "Renderizando video promocional 4K" },
    { id: "col-sup", name: "Supervisor QC", role: "SUPERVISOR", department: "Supervisión", areaKey: "supervisor", x: 155, y: 250, status: "online", color: "#3B82F6", avatarEmoji: "🛡️", deskNote: "Revisando calidad de atención en WhatsApp" },
    { id: "col-conta", name: "Contabilidad", role: "FINANZAS", department: "Contabilidad", areaKey: "contabilidad", x: 155, y: 410, status: "online", color: "#10B981", avatarEmoji: "📊", deskNote: "Liquidación de comisiones quincenales" },
    { id: "col-mkt", name: "Facu Marketing", role: "ADS", department: "Marketing", areaKey: "marketing", x: 425, y: 410, status: "online", color: "#F43F5E", avatarEmoji: "📣", deskNote: "Optimizando pautas en Meta Ads" },
    { id: "col-id", name: "I+D Lab", role: "INVESTIGADOR", department: "Investigación", areaKey: "investigacion", x: 695, y: 410, status: "online", color: "#6366F1", avatarEmoji: "🔬", deskNote: "Evaluando nuevos sensores y cerraduras smart" }
]

export default function VirtualOffice2D() {
    const { data: session } = useSession()
    const userEmail = session?.user?.email?.toLowerCase() || ""
    const userRole = (session?.user as any)?.role || "SALESPERSON"
    
    // Determine player initial spawn based on email / role
    const getInitialSpawn = () => {
        if (userEmail.includes("ceo") || userRole === "ADMIN") return { x: 400, y: 230 }
        if (userEmail.includes("coordinacion") || userRole === "COORDINATOR") return { x: 670, y: 230 }
        if (userEmail.includes("ventas") || userRole === "SALESPERSON") return { x: 670, y: 70 }
        if (userEmail.includes("desarrollo") || userRole === "MANAGEMENT") return { x: 400, y: 70 }
        if (userEmail.includes("edicion")) return { x: 130, y: 70 }
        if (userEmail.includes("supervisor") || userRole === "COORD_ASSISTANT") return { x: 130, y: 230 }
        if (userEmail.includes("contabilidad")) return { x: 130, y: 390 }
        if (userEmail.includes("marketing")) return { x: 400, y: 390 }
        if (userEmail.includes("investigacion")) return { x: 670, y: 390 }
        return { x: 425, y: 250 }
    }

    const [playerPos, setPlayerPos] = useState(getInitialSpawn())
    const [colleagues, setColleagues] = useState<AvatarUser[]>(INITIAL_COLLEAGUES)
    const [activeProximityUser, setActiveProximityUser] = useState<AvatarUser | null>(null)
    const [currentArea, setCurrentArea] = useState<OfficeArea | null>(null)
    
    // In-App Direct Call State (Sin Zoom)
    const [inCallWith, setInCallWith] = useState<AvatarUser | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    
    // Desk Note Modal
    const [selectedDeskUser, setSelectedDeskUser] = useState<AvatarUser | null>(null)
    const [noteText, setNoteText] = useState("")
    const [deskNotes, setDeskNotes] = useState<DeskNote[]>([
        { id: "n1", targetDesk: "Ian Editor", from: "Dirección", message: "Finalizar promo para mañana 9am.", createdAt: "Hace 15 min" },
        { id: "n2", targetDesk: "Luis G.", from: "CEO", message: "Revisión quincenal de cotizaciones aprobadas.", createdAt: "Hace 1 hora" }
    ])

    // Proximity Chat Messages
    const [chatMessages, setChatMessages] = useState<{ from: string; text: string; time: string }[]>([
        { from: "Luis G.", text: "¡Hola equipo! Bienvenidos a la oficina virtual de ATOMIC.", time: "09:00" }
    ])
    const [chatInput, setChatInput] = useState("")
    
    const canvasRef = useRef<HTMLDivElement>(null)

    // Player Movement Handler (Keyboard WASD / Arrows)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return

            const step = 14
            setPlayerPos(prev => {
                let newX = prev.x
                let newY = prev.y

                if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") newY = Math.max(30, prev.y - step)
                if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") newY = Math.min(590, prev.y + step)
                if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") newX = Math.max(30, prev.x - step)
                if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") newX = Math.min(820, prev.x + step)

                return { x: newX, y: newY }
            })
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    // Proximity & Area Detection Loop
    useEffect(() => {
        const PROXIMITY_RADIUS = 65
        let nearest: AvatarUser | null = null

        for (const c of colleagues) {
            const dist = Math.hypot(playerPos.x - c.x, playerPos.y - c.y)
            if (dist < PROXIMITY_RADIUS) {
                nearest = c
                break
            }
        }

        setActiveProximityUser(nearest)

        // Check active area
        const matchedArea = OFFICE_AREAS.find(a => 
            playerPos.x >= a.x && playerPos.x <= a.x + a.width &&
            playerPos.y >= a.y && playerPos.y <= a.y + a.height
        ) || null

        setCurrentArea(matchedArea)
    }, [playerPos, colleagues])

    useEffect(() => {
        let interval: any = null
        if (inCallWith) {
            interval = setInterval(() => setCallDuration(d => d + 1), 1000)
        } else {
            setCallDuration(0)
        }
        return () => clearInterval(interval)
    }, [inCallWith])

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const clickY = e.clientY - rect.top
        setPlayerPos({
            x: Math.max(30, Math.min(820, clickX)),
            y: Math.max(30, Math.min(590, clickY))
        })
    }

    const teleportToArea = (area: OfficeArea) => {
        setPlayerPos({ x: area.spawnX, y: area.spawnY })
    }

    const startDirectCall = (target: AvatarUser) => {
        setInCallWith(target)
        setChatMessages(prev => [
            ...prev,
            { from: "SISTEMA", text: `📞 Conectando audio directo con ${target.name} (${target.department})...`, time: new Date().toLocaleTimeString().slice(0, 5) }
        ])
    }

    const endDirectCall = () => {
        setInCallWith(null)
    }

    const sendChatMessage = () => {
        if (!chatInput.trim()) return
        setChatMessages(prev => [
            ...prev,
            { from: session?.user?.name || "Tú", text: chatInput.trim(), time: new Date().toLocaleTimeString().slice(0, 5) }
        ])
        setChatInput("")
    }

    const saveDeskNote = () => {
        if (!selectedDeskUser || !noteText.trim()) return
        const newNote: DeskNote = {
            id: Date.now().toString(),
            targetDesk: selectedDeskUser.name,
            from: session?.user?.name || "Asesor",
            message: noteText.trim(),
            createdAt: "Ahora mismo"
        }
        setDeskNotes(prev => [newNote, ...prev])
        setNoteText("")
        setSelectedDeskUser(null)
    }

    const formatDuration = (s: number) => {
        const mins = Math.floor(s / 60)
        const secs = s % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
                <div>
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>OFICINA VIRTUAL 2.5D · ATOMIC HQ</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <span>Sede Virtual de Equipos</span>
                        <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
                            9 ÁREAS INTEGRADAS
                        </span>
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-2 text-xs">
                        <Users size={14} className="text-cyan-400" />
                        <span className="text-slate-300 font-bold">{colleagues.length + 1} Conectados</span>
                    </div>
                    <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-black rounded-2xl flex items-center gap-2">
                        <span>🎮 WASD / Flechas / Clic</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 px-1">
                    Ir a tu área:
                </span>
                {OFFICE_AREAS.slice(0, 9).map((area) => (
                    <button
                        key={area.key}
                        onClick={() => teleportToArea(area)}
                        className={`px-3 py-1 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            currentArea?.key === area.key
                                ? "bg-cyan-500 text-black border-cyan-400 shadow-md scale-105"
                                : "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                        }`}
                    >
                        <span>{area.emoji}</span>
                        <span>{area.name.split(" ")[0]}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                <div className="lg:col-span-3 space-y-4">
                    <div 
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="relative w-full h-[640px] bg-[#0A0F1D] border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl cursor-crosshair select-none"
                        style={{
                            backgroundImage: "radial-gradient(#1E293B 1.2px, transparent 1.2px)",
                            backgroundSize: "24px 24px"
                        }}
                    >
                        {OFFICE_AREAS.map((area) => (
                            <div
                                key={area.key}
                                className={`absolute ${area.colorBg} border-2 border-dashed ${area.colorBorder} rounded-2xl p-2.5 flex flex-col justify-between transition-all pointer-events-none ${
                                    currentArea?.key === area.key ? "ring-2 ring-cyan-400/50 shadow-lg" : ""
                                }`}
                                style={{
                                    left: `${area.x}px`,
                                    top: `${area.y}px`,
                                    width: `${area.width}px`,
                                    height: `${area.height}px`
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm">{area.emoji}</span>
                                        <span className="text-[10px] font-mono font-black text-slate-200 uppercase tracking-wider">
                                            {area.name}
                                        </span>
                                    </div>
                                    <span className="text-[8px] font-mono text-slate-400 uppercase">
                                        {area.subtitle}
                                    </span>
                                </div>

                                {area.key === "lounge" && (
                                    <div className="flex items-center gap-3 text-xl pl-2">
                                        <span>🛋️</span>
                                        <span>🪴</span>
                                        <span>☕</span>
                                        <span>🍩</span>
                                    </div>
                                )}

                                {area.key === "recreacion" && (
                                    <div className="flex items-center justify-center text-2xl h-full">
                                        🏀 🎯 🏓
                                    </div>
                                )}
                            </div>
                        ))}

                        {colleagues.map((c) => (
                            <div
                                key={c.id}
                                className="absolute transition-all duration-300 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
                                style={{ left: `${c.x}px`, top: `${c.y}px` }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedDeskUser(c)
                                }}
                            >
                                <div className="w-14 h-8 bg-slate-900/90 border border-slate-700 rounded-lg flex items-center justify-around shadow-md relative cursor-pointer hover:border-cyan-400 hover:scale-105 transition-all">
                                    <Monitor size={12} className="text-slate-400" />
                                    <span className="text-[10px]">{c.avatarEmoji}</span>
                                    {c.status === "busy" && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
                                    )}
                                    {c.status === "online" && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                                    )}
                                </div>

                                <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[9px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1 shadow-md">
                                    <span>{c.name}</span>
                                </div>
                            </div>
                        ))}

                        <motion.div
                            animate={{ left: `${playerPos.x}px`, top: `${playerPos.y}px` }}
                            transition={{ type: "spring", damping: 26, stiffness: 240 }}
                            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                        >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 border-2 border-white flex items-center justify-center text-sm shadow-[0_0_18px_rgba(6,182,212,0.8)] relative">
                                <span>🚀</span>
                                <div className="absolute -bottom-1 w-4 h-1 bg-cyan-400 rounded-full blur-xs" />
                            </div>

                            <div className="mt-1 px-2 py-0.5 rounded-full bg-cyan-400 text-black text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                                <span>{session?.user?.name?.split(" ")[0] || "Tú"} (Tú)</span>
                            </div>
                        </motion.div>

                        {currentArea && (
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-[11px] font-mono font-bold flex items-center gap-2 backdrop-blur-md shadow-xl">
                                <span>{currentArea.emoji}</span>
                                <span>Área Activa: <strong>{currentArea.name}</strong></span>
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {activeProximityUser && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center text-lg">
                                        {activeProximityUser.avatarEmoji}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase flex items-center gap-2">
                                            <span>{activeProximityUser.name}</span>
                                            <span className="px-2 py-0.5 rounded-md text-[8px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                                {activeProximityUser.department}
                                            </span>
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {activeProximityUser.deskNote || "En su puesto de trabajo"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {inCallWith?.id === activeProximityUser.id ? (
                                        <button
                                            onClick={endDirectCall}
                                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer"
                                        >
                                            <PhoneOff size={13} />
                                            <span>Colgar ({formatDuration(callDuration)})</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startDirectCall(activeProximityUser)}
                                            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
                                        >
                                            <Phone size={13} />
                                            <span>Audio Directo</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setSelectedDeskUser(activeProximityUser)}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                                    >
                                        <StickyNote size={13} className="text-amber-400" />
                                        <span>Dejar Nota</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-6">
                    {inCallWith && (
                        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-3">
                            <div className="flex items-center justify-between text-emerald-300 text-xs font-bold font-mono">
                                <div className="flex items-center gap-2">
                                    <Radio size={14} className="animate-pulse" />
                                    <span>EN LLAMADA DIRECTA</span>
                                </div>
                                <span>{formatDuration(callDuration)}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-black text-white">{inCallWith.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className={`p-2 rounded-xl border text-xs ${
                                            isMuted ? "bg-rose-500/20 border-rose-500 text-rose-300" : "bg-slate-800 border-slate-700 text-slate-300"
                                        }`}
                                    >
                                        {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                                    </button>
                                    <button
                                        onClick={endDirectCall}
                                        className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500"
                                    >
                                        <PhoneOff size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Proximity Instant Chat - HABLAR EN VOZ ALTA */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 flex flex-col h-[340px] shadow-xl">
                        <div className="pb-2.5 border-b border-slate-800">
                            <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-wider">
                                <MessageSquare size={16} />
                                <span>HABLAR EN VOZ ALTA</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-snug font-sans">
                                📢 Canal público en vivo: Escribe aquí para comunicarte en voz alta con todos los compañeros conectados.
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs custom-scrollbar">
                            {chatMessages.map((m, i) => (
                                <div key={i} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                        <span className="font-black text-cyan-300">{m.from}</span>
                                        <span>{m.time}</span>
                                    </div>
                                    <p className="text-slate-200 leading-relaxed">{m.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && sendChatMessage()}
                                placeholder="Escribe para hablar en voz alta..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                            />
                            <button
                                onClick={sendChatMessage}
                                className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl cursor-pointer"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Desk Notes List - CARTELERA */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
                        <div className="flex items-center justify-between text-xs font-black text-amber-400 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <StickyNote size={16} />
                                <span>CARTELERA</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono">
                                {deskNotes.length} avisos
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug font-sans">
                            Notas generales y anuncios de la empresa. Puedes descartar notas usando la papelera 🗑️.
                        </p>

                        <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                            {deskNotes.map((n) => (
                                <div key={n.id} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1 relative group">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                                        <span>📌 Para: {n.targetDesk}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500">{n.createdAt}</span>
                                            <button
                                                onClick={() => setDeskNotes(prev => prev.filter(x => x.id !== n.id))}
                                                className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 p-1 transition-all"
                                                title="Quitar / Mover a papelera"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-slate-200 italic font-medium">"{n.message}"</p>
                                </div>
                            ))}
                            {deskNotes.length === 0 && (
                                <p className="text-[10px] font-mono text-slate-500 text-center py-2">
                                    Cartelera limpia. No hay notas pendientes.
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal: Dejar Nota en Escritorio */}
            <AnimatePresence>
                {selectedDeskUser && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm uppercase">
                                    <StickyNote size={18} />
                                    <span>Dejar Nota a {selectedDeskUser.name}</span>
                                </div>
                                <button onClick={() => setSelectedDeskUser(null)} className="text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                                Deja un mensaje o tarea pegada en el escritorio virtual de <strong>{selectedDeskUser.name}</strong> para cuando se conecte.
                            </p>

                            <textarea
                                rows={4}
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                placeholder="Ej: Hola, por favor ayúdame con la cotización de cámaras para el cliente de Quito..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white outline-none focus:border-amber-400 font-sans leading-relaxed"
                            />

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setSelectedDeskUser(null)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveDeskNote}
                                    disabled={!noteText.trim()}
                                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-black uppercase rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Check size={14} />
                                    <span>Pegar en Escritorio</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
