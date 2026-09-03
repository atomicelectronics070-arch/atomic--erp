"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Send, Loader2, Building2, MessageSquare, Wrench, Brain,
    Phone, MapPin, Calendar, Users, Star, ChevronRight, Printer,
    FileText, Upload, Zap, ShieldCheck
} from "lucide-react"
import { generateAtomicUnifiedProposalPDF } from "@/lib/pdf/quotePdfGenerator"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
    currentModule?: string
    session?: any
    recentQuotes?: any[]
}

type ActiveRoom = "printer" | "meeting" | "ceo" | "marketing" | "coordinacion" | "supervision" | "workshop" | "counseling" | null

// ─────────────────────────────────────────────────────────────────────────────
// NPC Avatar component — bounces gently
// ─────────────────────────────────────────────────────────────────────────────
function NPC({ emoji, label, x, y, delay = 0 }: { emoji: string; label: string; x: string; y: string; delay?: number }) {
    return (
        <motion.div
            className="absolute flex flex-col items-center gap-0.5 pointer-events-none select-none"
            style={{ left: x, top: y }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay, ease: "easeInOut" }}
        >
            <div className="text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{emoji}</div>
            <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-slate-800 whitespace-nowrap">{label}</span>
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Room Tile component
// ─────────────────────────────────────────────────────────────────────────────
function RoomTile({ id, emoji, label, sublabel, color, glow, onClick, isActive }: {
    id: string; emoji: string; label: string; sublabel: string
    color: string; glow: string; onClick: () => void; isActive: boolean
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`relative cursor-pointer rounded-2xl border p-4 flex flex-col items-center gap-2 overflow-hidden transition-all duration-300 ${
                isActive ? `${color} ${glow} border-white/20` : "bg-slate-900/90 border-slate-700/80 hover:border-slate-500"
            }`}
            style={{ transform: "perspective(600px) rotateX(8deg)" }}
        >
            {/* Shimmer line on top */}
            <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${isActive ? "via-white/50" : "via-slate-500/30"} to-transparent`} />
            {/* Floor reflection */}
            <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-t from-black/30 to-transparent" />

            <motion.div
                className="text-3xl z-10"
                animate={{ scale: isActive ? [1, 1.12, 1] : 1 }}
                transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
            >
                {emoji}
            </motion.div>
            <div className="z-10 text-center">
                <p className="text-[10px] font-black text-white uppercase tracking-wider leading-tight">{label}</p>
                <p className="text-[8px] font-mono text-slate-400 mt-0.5">{sublabel}</p>
            </div>
            {isActive && (
                <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
            )}
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Decorative element
// ─────────────────────────────────────────────────────────────────────────────
function Decor({ emoji, label, x, y, wobble = false }: { emoji: string; label: string; x: string; y: string; wobble?: boolean }) {
    return (
        <motion.div
            className="absolute flex flex-col items-center gap-0.5 pointer-events-none select-none z-10"
            style={{ left: x, top: y }}
            animate={wobble ? { rotate: [-2, 2, -2] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
            <span className="text-xl drop-shadow-md">{emoji}</span>
            <span className="text-[7px] font-mono text-slate-600 whitespace-nowrap">{label}</span>
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function VirtualOfficeWorkspace({ currentModule = "ventas", session, recentQuotes = [] }: Props) {
    const [activeRoom, setActiveRoom] = useState<ActiveRoom>(null)
    const [avatarPos, setAvatarPos] = useState({ x: "45%", y: "60%" })
    const [isActive, setIsActive] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
        { sender: "bot", text: "¡Hola! Soy tu consejero y guía. Cuéntame, ¿qué puedo hacer por ti? Te daré una guía, cuéntame qué habilidades te faltan, cómo podemos ayudarte, ¿qué puedes hacer para mejorar? ¡Te daré un plan para mejorar ahora mismo!" }
    ])
    const [chatInput, setChatInput] = useState("")
    const [isChatLoading, setIsChatLoading] = useState(false)
    const [ceoMessage, setCeoMessage] = useState("")
    const [meetingTopic, setMeetingTopic] = useState("")
    const [meetingUrgency, setMeetingUrgency] = useState("NORMAL")
    const [meetingLead, setMeetingLead] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [printerQuotes, setPrinterQuotes] = useState<any[]>(recentQuotes)
    const [designFiles, setDesignFiles] = useState<string[]>([])
    const [techVisitForm, setTechVisitForm] = useState({ client: "", address: "", description: "" })
    const [techConsult, setTechConsult] = useState("")
    const [systemUsers, setSystemUsers] = useState<any[]>([])
    const chatEndRef = useRef<HTMLDivElement>(null)

    const WA_NUMBER = "593999000000"
    const WA_BASE = `https://wa.me/${WA_NUMBER}?text=`

    useEffect(() => {
        fetch("/api/admin/manage-users").then(r => r.json()).then(d => { if (d.users) setSystemUsers(d.users) }).catch(() => {})
        if (recentQuotes.length === 0) {
            fetch("/api/quotes?limit=5").then(r => r.json()).then(d => { if (d.quotes) setPrinterQuotes(d.quotes.slice(0, 5)) }).catch(() => {})
        }
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages])

    const openRoom = (room: ActiveRoom, pos: { x: string; y: string }) => {
        setActiveRoom(room)
        setAvatarPos(pos)
    }

    const closeRoom = () => setActiveRoom(null)

    const handleSendCounselorMessage = async () => {
        const text = chatInput.trim()
        if (!text || isChatLoading) return
        const msgs = [...chatMessages, { sender: "user" as const, text }]
        setChatMessages(msgs)
        setChatInput("")
        setIsChatLoading(true)
        try {
            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, roleOverride: "COUNSELOR", botNameOverride: "Consejero Atomic", isNamingBot: false, currentPath: "/dashboard" })
            })
            const data = await res.json()
            setChatMessages([...msgs, { sender: "bot", text: data.text || "Déjame pensar en eso un momento..." }])
        } catch {
            setChatMessages([...msgs, { sender: "bot", text: "Hubo un error al conectar con el consejero. ¡Intenta de nuevo!" }])
        } finally { setIsChatLoading(false) }
    }

    const handleSendCEOMessage = async () => {
        if (!ceoMessage.trim() || isSending) return
        setIsSending(true)
        try {
            const ceo = systemUsers.find(u => u.role === "ADMIN")
            if (ceo) {
                await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ receiverId: ceo.id, content: `📩 Mensaje para CEO desde la Oficina Virtual:\n\n${ceoMessage}` }) })
            }
            setCeoMessage("")
            closeRoom()
        } catch (e) { console.error(e) } finally { setIsSending(false) }
    }

    const handleSuggestMeeting = async () => {
        if (!meetingTopic.trim() || isSending) return
        setIsSending(true)
        try {
            await fetch("/api/supervision", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "DELEGATE_CLIENT", payload: {
                    clientName: `[REUNIÓN] ${meetingTopic}`,
                    phone: "—", assignedTo: meetingLead || "coordinacion@atomic.com.ec",
                    objective: `Urgencia: ${meetingUrgency}`, requirementText: meetingTopic
                }})
            })
            setMeetingTopic(""); setMeetingUrgency("NORMAL"); setMeetingLead("")
            closeRoom()
        } catch (e) { console.error(e) } finally { setIsSending(false) }
    }

    const handleDownloadFromPrinter = async (q: any) => {
        try {
            const safeParseArray = (str: any) => { try { return Array.isArray(str) ? str : JSON.parse(str || "[]") } catch { return [] } }
            const parsedItems = safeParseArray(q.items)
            const rawSub = parsedItems.reduce((a: number, i: any) => a + i.quantity * i.unitPrice, 0)
            const tax = rawSub * 0.15
            await generateAtomicUnifiedProposalPDF({
                quoteNumber: q.quoteNumber, clientName: q.clientName || "",
                clientPhone: q.clientPhone || "", clientCity: q.city || "",
                clientEmail: q.clientEmail || "", quoteSubject: q.quoteSubject || "",
                advisorName: session?.user?.name?.toUpperCase() || "ATOMIC",
                items: parsedItems, subtotal: rawSub, tax, total: q.total || rawSub + tax,
                discountPercent: q.discountPercent || 0, totalDiscountAmount: 0,
                status: q.status || "PENDIENTE", deliveryAddress: q.deliveryAddress || ""
            })
        } catch (e) { console.error(e) }
    }

    const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = ev => { if (ev.target?.result) setDesignFiles(prev => [...prev, ev.target!.result as string]) }
            reader.readAsDataURL(file)
        })
    }

    // ── ROOMS CONFIG ──────────────────────────────────────────────────────────
    const rooms = [
        { id: "ceo" as const, emoji: "🏛️", label: "Despacho CEO", sublabel: "Dejar mensaje", color: "bg-gradient-to-br from-rose-900/80 to-pink-900/60", glow: "shadow-[0_0_20px_rgba(244,63,94,0.4)]", pos: { x: "5%", y: "12%" } },
        { id: "coordinacion" as const, emoji: "🎯", label: "Coordinación", sublabel: "Chat & Plan", color: "bg-gradient-to-br from-amber-900/80 to-orange-900/60", glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]", pos: { x: "24%", y: "12%" } },
        { id: "supervision" as const, emoji: "🛡️", label: "Supervisión", sublabel: "Lista de precios", color: "bg-gradient-to-br from-emerald-900/80 to-teal-900/60", glow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]", pos: { x: "43%", y: "12%" } },
        { id: "workshop" as const, emoji: "🔧", label: "Taller Técnico", sublabel: "Visita / Consulta", color: "bg-gradient-to-br from-blue-900/80 to-cyan-900/60", glow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]", pos: { x: "62%", y: "12%" } },
        { id: "meeting" as const, emoji: "🤝", label: "Sala de Reuniones", sublabel: "Sugerir reunión", color: "bg-gradient-to-br from-indigo-900/80 to-purple-900/60", glow: "shadow-[0_0_20px_rgba(99,102,241,0.4)]", pos: { x: "81%", y: "12%" } },
        { id: "marketing" as const, emoji: "📣", label: "Marketing", sublabel: "Almanaque Diseños", color: "bg-gradient-to-br from-purple-900/80 to-pink-900/60", glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]", pos: { x: "5%", y: "55%" } },
        { id: "counseling" as const, emoji: "🧠", label: "Consejería", sublabel: "Chat con consejero IA", color: "bg-gradient-to-br from-teal-900/80 to-cyan-900/60", glow: "shadow-[0_0_20px_rgba(20,184,166,0.4)]", pos: { x: "43%", y: "55%" } },
        { id: "printer" as const, emoji: "🖨️", label: "Impresora", sublabel: "Imprimir cotizaciones", color: "bg-gradient-to-br from-slate-800/80 to-slate-700/60", glow: "shadow-[0_0_20px_rgba(148,163,184,0.3)]", pos: { x: "81%", y: "55%" } },
    ]

    return (
        <div className={`relative ${fullscreen ? "fixed inset-0 z-[999] bg-[#030305]" : "w-full"}`}>
            {/* ── OFFICE HEADER ──────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">🎮 Oficina Virtual Atomic</span>
                    <span className="text-[9px] font-mono text-slate-500">RPG-Mode 2.5D</span>
                </div>
                <div className="flex items-center gap-3">
                    {/* Mantenerse Activo */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <div onClick={() => setIsActive(!isActive)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isActive ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>
                            {isActive && <span className="text-white text-[10px] font-black">✓</span>}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 select-none">Mantenerse Activo</span>
                    </label>
                    {/* Entrar a la Oficina */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFullscreen(!fullscreen)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    >
                        <Zap size={12} />
                        {fullscreen ? "Salir" : "¿Entrar a la Oficina?"}
                    </motion.button>
                </div>
            </div>

            {/* ── OFFICE FLOOR ───────────────────────────────────────── */}
            <div className={`relative overflow-hidden bg-[#070710] ${fullscreen ? "h-[calc(100vh-56px)]" : "h-[560px]"}`}>
                {/* Graph paper grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
                {/* Corner ambient glow */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-600/8 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-600/8 rounded-full blur-[80px] pointer-events-none" />

                {/* ── ROOM TILES GRID ──────────────────────────────── */}
                <div className="absolute inset-x-4 top-4 grid grid-cols-5 gap-3" style={{ maxWidth: "calc(100% - 2rem)" }}>
                    {rooms.map(room => (
                        <RoomTile
                            key={room.id}
                            id={room.id}
                            emoji={room.emoji}
                            label={room.label}
                            sublabel={room.sublabel}
                            color={room.color}
                            glow={room.glow}
                            isActive={activeRoom === room.id}
                            onClick={() => {
                                if (activeRoom === room.id) closeRoom()
                                else openRoom(room.id, room.pos)
                            }}
                        />
                    ))}
                </div>

                {/* ── DECORATIONS ──────────────────────────────────── */}
                <Decor emoji="🪴" label="Planta de la suerte" x="2%" y="78%" wobble />
                <Decor emoji="☕" label="Cafecito caliente" x="16%" y="82%" />
                <Decor emoji="🦆" label="Pato de debugging" x="35%" y="80%" wobble />
                <Decor emoji="📎" label="Papers perdidos" x="55%" y="78%" />
                <Decor emoji="💾" label="Floppy antiguo" x="70%" y="82%" />
                <Decor emoji="📡" label="Antena" x="88%" y="75%" wobble />
                <Decor emoji="🖥️" label="Monitor activo" x="78%" y="80%" />
                <Decor emoji="🃏" label="Tarjeta NFC" x="45%" y="83%" />

                {/* ── NPCS ──────────────────────────────────────────── */}
                <NPC emoji="👨‍💼" label="Asesor" x="28%" y="72%" delay={0} />
                <NPC emoji="👩‍🎨" label="Editora" x="52%" y="74%" delay={0.8} />
                <NPC emoji="🧑‍💻" label="Dev" x="67%" y="70%" delay={1.4} />

                {/* ── YOUR AVATAR ──────────────────────────────────── */}
                <motion.div
                    animate={{ left: avatarPos.x, top: avatarPos.y }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    className="absolute flex flex-col items-center gap-0.5 z-30 pointer-events-none"
                >
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-3xl drop-shadow-[0_4px_16px_rgba(245,158,11,0.9)]"
                    >
                        👾
                    </motion.div>
                    <span className="text-[8px] font-mono font-bold text-amber-400 bg-black/80 px-2 py-0.5 rounded-full border border-amber-500/40 whitespace-nowrap shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                        TÚ ({session?.user?.name?.split(" ")[0] || "Operador"})
                    </span>
                </motion.div>

                {/* ── ROOM PANEL (right side) ───────────────────────── */}
                <AnimatePresence>
                    {activeRoom && (
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ type: "spring", damping: 22, stiffness: 200 }}
                            className="absolute top-4 right-4 w-80 bg-[#0a0a14]/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-xl z-40 overflow-hidden flex flex-col max-h-[calc(100%-2rem)]"
                        >
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{rooms.find(r => r.id === activeRoom)?.emoji}</span>
                                    <div>
                                        <p className="text-xs font-black text-white">{rooms.find(r => r.id === activeRoom)?.label}</p>
                                        <p className="text-[9px] font-mono text-slate-400">{rooms.find(r => r.id === activeRoom)?.sublabel}</p>
                                    </div>
                                </div>
                                <button onClick={closeRoom} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Panel Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">

                                {/* ── PRINTER ──────────────────────── */}
                                {activeRoom === "printer" && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Cotizaciones Recientes</p>
                                        {printerQuotes.length === 0 && (
                                            <p className="text-[10px] font-mono text-slate-500 text-center py-4">Sin cotizaciones disponibles</p>
                                        )}
                                        {printerQuotes.map((q: any) => (
                                            <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">{q.quoteNumber}</span>
                                                    <span className="text-emerald-400 text-xs font-black">${q.total?.toFixed(2)}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-white truncate mb-2">{q.clientName}</p>
                                                <button onClick={() => handleDownloadFromPrinter(q)}
                                                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                                                    <Printer size={10} /> Imprimir PDF
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── MEETING ROOM ─────────────────── */}
                                {activeRoom === "meeting" && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Tema de la Reunión *</label>
                                            <textarea value={meetingTopic} onChange={e => setMeetingTopic(e.target.value)} rows={2} placeholder="¿De qué trata la reunión?"
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs resize-none outline-none focus:border-indigo-500/50" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Urgencia</label>
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {["URGENTE", "NORMAL", "PLANIFICADA"].map(u => (
                                                    <button key={u} onClick={() => setMeetingUrgency(u)}
                                                        className={`py-1.5 rounded-xl text-[9px] font-bold border transition-all ${meetingUrgency === u ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-slate-900 border-slate-700 text-slate-400"}`}>
                                                        {u === "URGENTE" ? "🔴" : u === "NORMAL" ? "🟡" : "🟢"} {u}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">¿Quién debería llevarla?</label>
                                            <select value={meetingLead} onChange={e => setMeetingLead(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold outline-none">
                                                <option value="">Seleccionar responsable...</option>
                                                {systemUsers.map((u: any) => <option key={u.id} value={u.email}>{u.name || u.email}</option>)}
                                            </select>
                                        </div>
                                        <button onClick={handleSuggestMeeting} disabled={!meetingTopic || isSending}
                                            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-50">
                                            {isSending ? <Loader2 size={12} className="animate-spin" /> : <Calendar size={12} />}
                                            Sugerir Reunión
                                        </button>
                                    </div>
                                )}

                                {/* ── CEO OFFICE ───────────────────── */}
                                {activeRoom === "ceo" && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-mono text-slate-400">Deja un mensaje privado al CEO. Recibirá una notificación interna.</p>
                                        <textarea value={ceoMessage} onChange={e => setCeoMessage(e.target.value)} rows={4} placeholder="Escribe tu mensaje al CEO..."
                                            className="w-full bg-slate-900 border border-rose-500/20 text-white p-2.5 rounded-xl text-xs resize-none outline-none focus:border-rose-500/40" />
                                        <button onClick={handleSendCEOMessage} disabled={!ceoMessage.trim() || isSending}
                                            className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-50">
                                            {isSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                            Enviar al CEO
                                        </button>
                                    </div>
                                )}

                                {/* ── MARKETING ROOM ───────────────── */}
                                {activeRoom === "marketing" && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-2">📅 Almanaque de Diseños</label>
                                            {(session?.user?.role === "ADMIN" || session?.user?.role === "USER") && (
                                                <label className="w-full py-2 bg-purple-500/10 border border-dashed border-purple-500/40 text-purple-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-purple-500/15 transition-colors">
                                                    <Upload size={12} /> Subir Diseños
                                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleDesignUpload} />
                                                </label>
                                            )}
                                        </div>
                                        {designFiles.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {designFiles.map((src, i) => (
                                                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-700">
                                                        <img src={src} alt={`Diseño ${i + 1}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 text-center">
                                                <p className="text-3xl mb-2">🎨</p>
                                                <p className="text-[9px] font-mono text-slate-500">El equipo de edición sube los diseños aquí</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── COORDINACIÓN ──────────────────── */}
                                {activeRoom === "coordinacion" && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-mono text-slate-400 mb-3">Departamento de Coordinación — opciones rápidas:</p>
                                        <button
                                            onClick={() => window.open(`${WA_BASE}${encodeURIComponent("Hola Coordinación, solicito mi plan laboral actualizado por favor.")}`, "_blank")}
                                            className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 rounded-xl text-xs font-bold flex items-center gap-2 px-3 transition-colors">
                                            📋 Solicitar Plan Laboral (WhatsApp)
                                        </button>
                                        <button
                                            onClick={() => window.open(`${WA_BASE}${encodeURIComponent("Hola Coordinación, necesito hablar contigo directamente.")}`, "_blank")}
                                            className="w-full py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-2 px-3 transition-colors">
                                            💬 Chat Directo (WhatsApp)
                                        </button>
                                        <button
                                            onClick={() => window.open(`/dashboard/coordinacion`, "_self")}
                                            className="w-full py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 rounded-xl text-xs font-bold flex items-center gap-2 px-3 transition-colors">
                                            🎯 Ir al Módulo de Coordinación
                                            <ChevronRight size={12} className="ml-auto" />
                                        </button>
                                    </div>
                                )}

                                {/* ── SUPERVISIÓN ──────────────────── */}
                                {activeRoom === "supervision" && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-mono text-slate-400 mb-3">Supervisión Operativa — acciones rápidas:</p>
                                        <button
                                            onClick={() => window.open(`${WA_BASE}${encodeURIComponent("Hola Supervisión, solicito la lista de precios actualizada.")}`, "_blank")}
                                            className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 rounded-xl text-xs font-bold flex items-center gap-2 px-3 transition-colors">
                                            💲 Solicitar Lista de Precios (WhatsApp)
                                        </button>
                                        <button
                                            onClick={() => window.open(`${WA_BASE}${encodeURIComponent("Hola Supervisión, solicito mi plan laboral.")}`, "_blank")}
                                            className="w-full py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 rounded-xl text-xs font-bold flex items-center gap-2 px-3 transition-colors">
                                            📅 Solicitar Plan Laboral (WhatsApp)
                                        </button>
                                        <button
                                            onClick={() => window.open(`${WA_BASE}${encodeURIComponent("Hola, necesito hablar contigo directamente.")}`, "_blank")}
                                            className="w-full py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-2 px-3 transition-colors">
                                            💬 Chat Directo (WhatsApp)
                                        </button>
                                        <button
                                            onClick={() => window.open(`/dashboard/supervision`, "_self")}
                                            className="w-full py-2.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 rounded-xl text-xs font-bold flex items-center gap-2 px-3 transition-colors">
                                            <ShieldCheck size={12} /> Ir al Módulo de Supervisión
                                            <ChevronRight size={12} className="ml-auto" />
                                        </button>
                                    </div>
                                )}

                                {/* ── TECHNICAL WORKSHOP ───────────── */}
                                {activeRoom === "workshop" && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-mono text-slate-400">Taller Técnico — elige una opción:</p>
                                        {/* Visita Técnica */}
                                        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-2">
                                            <p className="text-[9px] font-mono font-bold text-blue-400 uppercase">📍 Adjuntar Visita Técnica</p>
                                            <input value={techVisitForm.client} onChange={e => setTechVisitForm(p => ({ ...p, client: e.target.value }))} placeholder="Nombre del cliente"
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none focus:border-blue-500/50" />
                                            <input value={techVisitForm.address} onChange={e => setTechVisitForm(p => ({ ...p, address: e.target.value }))} placeholder="Dirección / Sector"
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none focus:border-blue-500/50" />
                                            <textarea value={techVisitForm.description} onChange={e => setTechVisitForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Descripción técnica del requerimiento..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs resize-none outline-none focus:border-blue-500/50" />
                                            <button
                                                onClick={() => window.open(`${WA_BASE}${encodeURIComponent(`🔧 VISITA TÉCNICA\nCliente: ${techVisitForm.client}\nDirección: ${techVisitForm.address}\nDetalle: ${techVisitForm.description}`)}`, "_blank")}
                                                className="w-full py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1">
                                                <MapPin size={10} /> Enviar por WhatsApp
                                            </button>
                                        </div>
                                        {/* Consulta Técnica */}
                                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-2">
                                            <p className="text-[9px] font-mono font-bold text-emerald-400 uppercase">💡 Consulta Técnica</p>
                                            <textarea value={techConsult} onChange={e => setTechConsult(e.target.value)} rows={2} placeholder="Describe la consulta técnica..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs resize-none outline-none focus:border-emerald-500/50" />
                                            <button
                                                onClick={() => window.open(`${WA_BASE}${encodeURIComponent(`💡 CONSULTA TÉCNICA:\n${techConsult}`)}`, "_blank")}
                                                className="w-full py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1">
                                                <Send size={10} /> Enviar Consulta
                                            </button>
                                        </div>
                                        {/* Llamada Técnica */}
                                        <button
                                            onClick={() => window.open(`${WA_BASE}${encodeURIComponent("Hola, necesito una llamada técnica urgente.")}`, "_blank")}
                                            className="w-full py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                                            <Phone size={12} /> Solicitar Llamada Técnica (WhatsApp)
                                        </button>
                                    </div>
                                )}

                                {/* ── COUNSELING (AI CHATBOT) ──────── */}
                                {activeRoom === "counseling" && (
                                    <div className="flex flex-col h-full space-y-3">
                                        <div className="flex-1 space-y-2 max-h-72 overflow-y-auto">
                                            {chatMessages.map((msg, i) => (
                                                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                                        msg.sender === "user"
                                                            ? "bg-teal-600/30 border border-teal-500/30 text-teal-100"
                                                            : "bg-slate-800 border border-slate-700 text-slate-200"
                                                    }`}>
                                                        {msg.sender === "bot" && <span className="text-[8px] font-mono font-bold text-teal-400 block mb-0.5">🧠 Consejero Atomic</span>}
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                            {isChatLoading && (
                                                <div className="flex justify-start">
                                                    <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-2xl">
                                                        <div className="flex gap-1">
                                                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                                                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                                                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                value={chatInput}
                                                onChange={e => setChatInput(e.target.value)}
                                                onKeyDown={e => e.key === "Enter" && handleSendCounselorMessage()}
                                                placeholder="Cuéntame algo..."
                                                className="flex-1 bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none focus:border-teal-500/50"
                                            />
                                            <button onClick={handleSendCounselorMessage} disabled={isChatLoading || !chatInput.trim()}
                                                className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl disabled:opacity-50 transition-colors">
                                                <Send size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── STEAM over coffee ──────────────────────────────── */}
                <motion.div
                    className="absolute pointer-events-none"
                    style={{ left: "16.5%", top: "76%" }}
                    animate={{ opacity: [0, 0.6, 0], y: [-4, -12, -4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <span className="text-[8px] text-slate-500">~</span>
                </motion.div>

                {/* Click anywhere on floor hint */}
                {!activeRoom && (
                    <motion.div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        <p className="text-[9px] font-mono text-slate-600">← Haz clic en una habitación para interactuar →</p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
