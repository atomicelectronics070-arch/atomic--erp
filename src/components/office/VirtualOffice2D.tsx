"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Users, MessageSquare, Phone, PhoneOff, Mic, MicOff, 
    StickyNote, Sparkles, Send, X, Shield, Plus, Check,
    Coffee, Monitor, Award, Radio, MapPin, Volume2, Info
} from "lucide-react"

interface AvatarUser {
    id: string
    name: string
    role: string
    department: "Marketing" | "Ventas" | "Edicion" | "Sistemas" | "Gerencia"
    x: number
    y: number
    targetX?: number
    targetY?: number
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

const INITIAL_COLLEAGUES: AvatarUser[] = [
    { id: "col-1", name: "Luis G.", role: "COORDINADOR", department: "Marketing", x: 260, y: 220, status: "online", color: "#10B981", avatarEmoji: "👨‍💼", deskNote: "Revisando métricas de campaña B2B" },
    { id: "col-2", name: "Ian Editor", role: "CREATIVO", department: "Edicion", x: 420, y: 320, status: "busy", color: "#8B5CF6", avatarEmoji: "🎧", deskNote: "Renderizando video promocional de consolas" },
    { id: "col-3", name: "Facu Editor", role: "MEDIA", department: "Edicion", x: 340, y: 320, status: "online", color: "#EC4899", avatarEmoji: "🎬", deskNote: "Terminando miniaturas de YouTube" },
    { id: "col-4", name: "Milorieta", role: "ASESORA", department: "Ventas", x: 180, y: 150, status: "online", color: "#F59E0B", avatarEmoji: "👩‍💼", deskNote: "Llamando a cliente de Guayaquil" },
    { id: "col-5", name: "Nicolás", role: "SISTEMAS", department: "Sistemas", x: 500, y: 180, status: "online", color: "#06B6D4", avatarEmoji: "💻", deskNote: "Monitoreando base de datos" }
]

export default function VirtualOffice2D() {
    const { data: session } = useSession()
    
    // Player Position & Movement
    const [playerPos, setPlayerPos] = useState({ x: 300, y: 200 })
    const [colleagues, setColleagues] = useState<AvatarUser[]>(INITIAL_COLLEAGUES)
    const [activeProximityUser, setActiveProximityUser] = useState<AvatarUser | null>(null)
    const [isPrivateArea, setIsPrivateArea] = useState(false)
    
    // In-App Direct Call State (Sin Zoom)
    const [inCallWith, setInCallWith] = useState<AvatarUser | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    
    // Desk Note Modal
    const [selectedDeskUser, setSelectedDeskUser] = useState<AvatarUser | null>(null)
    const [noteText, setNoteText] = useState("")
    const [deskNotes, setDeskNotes] = useState<DeskNote[]>([
        { id: "n1", targetDesk: "Ian Editor", from: "Dirección", message: "Finalizar promo para mañana 9am.", createdAt: "Hace 15 min" }
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

                if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") newY = Math.max(40, prev.y - step)
                if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") newY = Math.min(500, prev.y + step)
                if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") newX = Math.max(40, prev.x - step)
                if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") newX = Math.min(760, prev.x + step)

                return { x: newX, y: newY }
            })
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    // Proximity Detection Loop
    useEffect(() => {
        const PROXIMITY_RADIUS = 75
        let nearest: AvatarUser | null = null

        for (const c of colleagues) {
            const dist = Math.hypot(playerPos.x - c.x, playerPos.y - c.y)
            if (dist < PROXIMITY_RADIUS) {
                nearest = c
                break
            }
        }

        setActiveProximityUser(nearest)

        // Check if in private carpet area (X: 140-360, Y: 120-280 or X: 440-660, Y: 120-280)
        const inPrivate = (playerPos.x >= 140 && playerPos.x <= 360 && playerPos.y >= 120 && playerPos.y <= 280) ||
                          (playerPos.x >= 440 && playerPos.x <= 660 && playerPos.y >= 120 && playerPos.y <= 280)
        setIsPrivateArea(inPrivate)
    }, [playerPos, colleagues])

    // Call Timer
    useEffect(() => {
        let interval: any = null
        if (inCallWith) {
            interval = setInterval(() => setCallDuration(d => d + 1), 1000)
        } else {
            setCallDuration(0)
        }
        return () => clearInterval(interval)
    }, [inCallWith])

    // Click to Walk Handler
    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const clickY = e.clientY - rect.top
        setPlayerPos({
            x: Math.max(40, Math.min(760, clickX)),
            y: Math.max(40, Math.min(500, clickY))
        })
    }

    // Direct Call Actions
    const startDirectCall = (target: AvatarUser) => {
        setInCallWith(target)
        setChatMessages(prev => [
            ...prev,
            { from: "SISTEMA", text: `📞 Conectando llamada de audio P2P directa con ${target.name} (Sin intermediarios)...`, time: new Date().toLocaleTimeString().slice(0, 5) }
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
                <div>
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>OFICINA VIRTUAL 2.5D · ATOMIC HQ</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <span>Espacio de Trabajo Remoto</span>
                        <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
                            AUDIO P2P DIRECTO
                        </span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3 text-xs">
                        <Users size={16} className="text-cyan-400" />
                        <span className="text-slate-300 font-bold">{colleagues.length + 1} Conectados</span>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-black rounded-2xl flex items-center gap-2">
                        <span>🎮 WASD / Flechas / Clic</span>
                    </div>
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* 2D Canvas Area (Cols 1-3) */}
                <div className="lg:col-span-3 space-y-4">
                    <div 
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="relative w-full h-[560px] bg-[#0E1526] border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl cursor-crosshair select-none"
                        style={{
                            backgroundImage: "radial-gradient(#1E293B 1.2px, transparent 1.2px)",
                            backgroundSize: "24px 24px"
                        }}
                    >
                        {/* Private Area Rug: Marketing & Ventas */}
                        <div className="absolute top-[110px] left-[130px] w-[240px] h-[180px] bg-emerald-950/20 border-2 border-dashed border-emerald-500/30 rounded-3xl flex flex-col items-center justify-start pt-2 pointer-events-none">
                            <span className="text-[10px] font-mono font-black text-emerald-400/60 uppercase tracking-widest">
                                ÁREA PRIVADA · MARKETING & VENTAS
                            </span>
                        </div>

                        {/* Private Area Rug: Edición & Media */}
                        <div className="absolute top-[110px] left-[430px] w-[240px] h-[180px] bg-purple-950/20 border-2 border-dashed border-purple-500/30 rounded-3xl flex flex-col items-center justify-start pt-2 pointer-events-none">
                            <span className="text-[10px] font-mono font-black text-purple-400/60 uppercase tracking-widest">
                                ÁREA PRIVADA · EDICIÓN & SISTEMAS
                            </span>
                        </div>

                        {/* Lounge & Coffee Corner */}
                        <div className="absolute bottom-[30px] left-[60px] w-[180px] h-[120px] bg-amber-950/20 border border-amber-500/20 rounded-2xl p-2 flex flex-col justify-between pointer-events-none">
                            <span className="text-[9px] font-mono font-bold text-amber-400/70 uppercase">☕ Café & Lounge</span>
                            <div className="flex gap-2">
                                <span className="p-2 bg-slate-900 rounded-lg text-lg">🛋️</span>
                                <span className="p-2 bg-slate-900 rounded-lg text-lg">🪴</span>
                                <span className="p-2 bg-slate-900 rounded-lg text-lg">☕</span>
                            </div>
                        </div>

                        {/* Basketball Recreation Zone */}
                        <div className="absolute bottom-[30px] right-[60px] w-[180px] h-[120px] bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-2 flex flex-col justify-between pointer-events-none">
                            <span className="text-[9px] font-mono font-bold text-indigo-400/70 uppercase">🏀 Cancha Recreativa</span>
                            <div className="flex justify-center items-center h-full text-3xl">
                                🏀
                            </div>
                        </div>

                        {/* Colleagues Desks & Avatars */}
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
                                {/* Desk Object */}
                                <div className="w-16 h-10 bg-slate-800/90 border border-slate-700 rounded-xl flex items-center justify-around shadow-lg relative cursor-pointer hover:border-cyan-400 transition-colors">
                                    <Monitor size={14} className="text-slate-400" />
                                    <span className="text-[10px]">{c.avatarEmoji}</span>
                                    {c.status === "busy" && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                                    )}
                                    {c.status === "online" && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                                    )}
                                </div>

                                {/* Colleague Name Tag */}
                                <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1 shadow-md">
                                    <span>{c.name}</span>
                                </div>
                            </div>
                        ))}

                        {/* Player Character */}
                        <motion.div
                            animate={{ left: `${playerPos.x}px`, top: `${playerPos.y}px` }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 border-2 border-white flex items-center justify-center text-xl shadow-[0_0_25px_rgba(6,182,212,0.6)] relative">
                                <span>🚀</span>
                                <div className="absolute -bottom-1 w-6 h-1 bg-cyan-400 rounded-full blur-xs" />
                            </div>

                            {/* Player Name Pill */}
                            <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                                <span>{session?.user?.name?.split(" ")[0] || "Tú"} (Tú)</span>
                            </div>
                        </motion.div>

                        {/* Private Area Alert Overlay */}
                        {isPrivateArea && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md shadow-lg animate-pulse">
                                <Shield size={14} />
                                <span>Estás dentro de una zona privada de reunión</span>
                            </div>
                        )}
                    </div>

                    {/* Proximity Interaction Bar */}
                    <AnimatePresence>
                        {activeProximityUser && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center text-xl">
                                        {activeProximityUser.avatarEmoji}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
                                            <span>{activeProximityUser.name}</span>
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                                {activeProximityUser.role}
                                            </span>
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {activeProximityUser.deskNote || "En su puesto de trabajo"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {inCallWith?.id === activeProximityUser.id ? (
                                        <button
                                            onClick={endDirectCall}
                                            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer"
                                        >
                                            <PhoneOff size={15} />
                                            <span>Colgar ({formatDuration(callDuration)})</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startDirectCall(activeProximityUser)}
                                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
                                        >
                                            <Phone size={15} />
                                            <span>Llamada Directa P2P</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setSelectedDeskUser(activeProximityUser)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
                                    >
                                        <StickyNote size={15} className="text-amber-400" />
                                        <span>Dejar Nota</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Sidebar: Direct Proximity Chat & Desk Notes (Col 4) */}
                <div className="space-y-6">
                    
                    {/* Active In-App Call Monitor */}
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

                    {/* Proximity Instant Chat */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 flex flex-col h-[340px] shadow-xl">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-black text-cyan-400 uppercase tracking-wider">
                            <MessageSquare size={16} />
                            <span>Canal de Oficina</span>
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
                                placeholder="Escribe al canal..."
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

                    {/* Desk Notes List */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
                        <div className="flex items-center justify-between text-xs font-black text-amber-400 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <StickyNote size={16} />
                                <span>Notas en Escritorios</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono">
                                {deskNotes.length}
                            </span>
                        </div>

                        <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                            {deskNotes.map((n) => (
                                <div key={n.id} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                                        <span>📍 Para: {n.targetDesk}</span>
                                        <span className="text-slate-500">{n.createdAt}</span>
                                    </div>
                                    <p className="text-slate-200 italic font-medium">"{n.message}"</p>
                                </div>
                            ))}
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
