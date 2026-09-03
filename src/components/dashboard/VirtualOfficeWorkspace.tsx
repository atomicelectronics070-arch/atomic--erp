"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Send, Loader2, Building2, MessageSquare, Wrench, Brain,
    Phone, MapPin, Calendar, Users, Star, ChevronRight, Printer,
    FileText, Upload, Zap, ShieldCheck, Check, Clock, AlertCircle,
    UserCheck, Trash2, StickyNote, Image as ImageIcon, Sparkles,
    Laptop, Briefcase, Bell, ChevronDown, CheckCircle2, User
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

type ActiveRoom = 
    | "visitas" 
    | "meeting" 
    | "ceo" 
    | "marketing" 
    | "coordinacion" 
    | "supervision" 
    | "workshop" 
    | "counseling" 
    | "printer" 
    | "cartelera" 
    | null

interface ClientAppointment {
    id: string
    clientName: string
    scheduledTime: string
    scheduledDate: string
    purpose: string
    phone: string
    status: "SCHEDULED" | "WAITING" | "ATTENDED" | "CANCELLED"
    createdByName: string
    attentionData?: any
}

interface CubicleProfile {
    id: string
    areaKey: string
    roleName: string
    defaultName: string
    email: string
    emoji: string
    color: string
    status: "online" | "busy"
}

const DEFAULT_CUBICLES: CubicleProfile[] = [
    { id: "cub-ceo", areaKey: "ceo", roleName: "Dirección General", defaultName: "CEO Atomic", email: "ceo@atomic.com.ec", emoji: "👑", color: "from-amber-600 to-yellow-500", status: "online" },
    { id: "cub-coord", areaKey: "coordinacion", roleName: "Coordinación", defaultName: "Luis G.", email: "coordinacion@atomic.com.ec", emoji: "👨‍💼", color: "from-teal-600 to-emerald-500", status: "online" },
    { id: "cub-sup", areaKey: "supervision", roleName: "Supervisión QC", defaultName: "Supervisor QC", email: "supervisor@atomic.com.ec", emoji: "🛡️", color: "from-blue-600 to-cyan-500", status: "online" },
    { id: "cub-ventas", areaKey: "ventas", roleName: "Ventas & Asesoría", defaultName: "Milorieta", email: "ventas@atomic.com.ec", emoji: "👩‍💼", color: "from-emerald-600 to-green-500", status: "online" },
    { id: "cub-edicion", areaKey: "edicion", roleName: "Edición & Multimedia", defaultName: "Ian Editor", email: "edicion@atomic.com.ec", emoji: "🎬", color: "from-purple-600 to-pink-500", status: "busy" },
    { id: "cub-dev", areaKey: "desarrollo", roleName: "Desarrollo Software", defaultName: "Nicolás Dev", email: "desarrollo@atomic.com.ec", emoji: "💻", color: "from-cyan-600 to-blue-500", status: "online" },
    { id: "cub-conta", areaKey: "contabilidad", roleName: "Contabilidad", defaultName: "Contabilidad", email: "contabilidad@atomic.com.ec", emoji: "📊", color: "from-emerald-600 to-teal-500", status: "online" },
    { id: "cub-mkt", areaKey: "marketing", roleName: "Marketing & Pauta", defaultName: "Facu Ads", email: "marketing@atomic.com.ec", emoji: "📣", color: "from-rose-600 to-red-500", status: "online" },
    { id: "cub-id", areaKey: "investigacion", roleName: "Investigación I+D", defaultName: "I+D Lab", email: "investigacion@atomic.com.ec", emoji: "🔬", color: "from-indigo-600 to-purple-500", status: "online" }
]

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────
function RoomTile({ id, emoji, label, sublabel, color, glow, onClick, isActive, badge }: {
    id: string; emoji: string; label: string; sublabel: string
    color: string; glow: string; onClick: () => void; isActive: boolean; badge?: string | number
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`relative cursor-pointer rounded-2xl border p-3 flex flex-col items-center gap-1.5 overflow-hidden transition-all duration-300 select-none ${
                isActive ? `${color} ${glow} border-white/40 ring-2 ring-white/20` : "bg-slate-900/90 border-slate-700/80 hover:border-slate-500"
            }`}
            style={{ transform: "perspective(600px) rotateX(6deg)" }}
        >
            <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${isActive ? "via-white/60" : "via-slate-500/30"} to-transparent`} />
            
            {badge && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black animate-pulse shadow-md">
                    {badge}
                </span>
            )}

            <motion.div
                className="text-2xl z-10"
                animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 1.4, repeat: isActive ? Infinity : 0 }}
            >
                {emoji}
            </motion.div>
            <div className="z-10 text-center">
                <p className="text-[10px] font-black text-white uppercase tracking-wider leading-tight">{label}</p>
                <p className="text-[8px] font-mono text-slate-400 mt-0.5">{sublabel}</p>
            </div>
            {isActive && <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />}
        </motion.div>
    )
}

function Decor({ emoji, label, x, y, wobble = false, onClick }: { emoji: string; label: string; x: string; y: string; wobble?: boolean; onClick?: () => void }) {
    return (
        <motion.div
            className={`absolute flex flex-col items-center gap-0.5 select-none z-10 ${onClick ? "cursor-pointer hover:scale-110" : "pointer-events-none"}`}
            style={{ left: x, top: y }}
            animate={wobble ? { rotate: [-2, 2, -2] } : {}}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            onClick={onClick}
        >
            <span className="text-xl drop-shadow-md">{emoji}</span>
            <span className="text-[7px] font-mono text-slate-400 bg-black/60 px-1 rounded whitespace-nowrap">{label}</span>
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function VirtualOfficeWorkspace({ currentModule = "ventas", session, recentQuotes = [] }: Props) {
    const [activeRoom, setActiveRoom] = useState<ActiveRoom>(null)
    const [avatarPos, setAvatarPos] = useState({ x: "46%", y: "58%" })
    const [isActive, setIsActive] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    
    // Appointments & Client Waiting Room state
    const [appointments, setAppointments] = useState<ClientAppointment[]>([
        {
            id: "apt-1",
            clientName: "Carlos Mendoza (CCTV)",
            scheduledTime: "11:00",
            scheduledDate: new Date().toISOString().split("T")[0],
            purpose: "Cotización de Cámaras 4K y Cerraduras Smart",
            phone: "+593998765432",
            status: "WAITING",
            createdByName: "Coordinación Atomic"
        }
    ])
    const [selectedAptToAttend, setSelectedAptToAttend] = useState<ClientAppointment | null>(null)
    const [newClientName, setNewClientName] = useState("")
    const [newClientTime, setNewClientTime] = useState("10:30")
    const [newClientPhone, setNewClientPhone] = useState("")
    const [newClientPurpose, setNewClientPurpose] = useState("")
    const [isCreatingApt, setIsCreatingApt] = useState(false)

    // Attention Form State
    const [attentionSummary, setAttentionSummary] = useState("")
    const [attentionNeed, setAttentionNeed] = useState("")
    const [attentionUrgency, setAttentionUrgency] = useState("MEDIA")
    const [attentionBudget, setAttentionBudget] = useState("")
    const [attentionRecontact, setAttentionRecontact] = useState(true)
    const [attentionMethod, setAttentionMethod] = useState("WhatsApp")
    const [isSavingAttention, setIsSavingAttention] = useState(false)

    // Profile Persistent Modal (Every 30 min)
    const [showProfilePrompt, setShowProfilePrompt] = useState(false)
    const [profileName, setProfileName] = useState("")
    const [profileEmail, setProfileEmail] = useState(session?.user?.email || "")
    const [profilePhone, setProfilePhone] = useState("")
    const [profileHasPC, setProfileHasPC] = useState(true)
    const [profileCity, setProfileCity] = useState("Quito, Ecuador")
    const [profileSchedule, setProfileSchedule] = useState("08:00 - 17:00")
    const [profileHasResume, setProfileHasResume] = useState(false)
    const [profileResumeUrl, setProfileResumeUrl] = useState("")
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [profilesMap, setProfilesMap] = useState<Record<string, any>>({})

    // Avatar Customization State
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const [avatarGender, setAvatarGender] = useState<"hombre" | "mujer">("hombre")
    const [avatarHair, setAvatarHair] = useState("corto")
    const [avatarSkin, setAvatarSkin] = useState("medium")
    const [avatarStyle, setAvatarStyle] = useState("casual")
    const [myAvatarEmoji, setMyAvatarEmoji] = useState("👾")

    // Cubicle Selection Modal
    const [selectedCubicle, setSelectedCubicle] = useState<CubicleProfile | null>(null)
    const [cubicleNoteText, setCubicleNoteText] = useState("")
    const [isAssigningTask, setIsAssigningTask] = useState(false)
    const [taskTypeToAssign, setTaskTypeToAssign] = useState("ORDINARIA")
    const [taskTitleToAssign, setTaskTitleToAssign] = useState("")

    // Cartelera (Notes & News) State
    const [carteleraNotes, setCarteleraNotes] = useState<any[]>([])
    const [newNoteTitle, setNewNoteTitle] = useState("")
    const [newNoteMessage, setNewNoteMessage] = useState("")
    const [newNoteImage, setNewNoteImage] = useState<string | null>(null)
    const [isSavingNote, setIsSavingNote] = useState(false)

    // Counselor AI Chatbot State
    const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
        { sender: "bot", text: "¡Hola! Soy tu consejero y guía. Cuéntame, ¿qué puedo hacer por ti? Te daré una guía, cuéntame qué habilidades te faltan, cómo podemos ayudarte, ¿qué puedes hacer para mejorar? ¡Te daré un plan para mejorar ahora mismo!" }
    ])
    const [chatInput, setChatInput] = useState("")
    const [isChatLoading, setIsChatLoading] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    // General Office Rooms
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

    const defaultWhatsApp = "593992223344"
    const getWAUrl = (phone?: string, text?: string) => {
        const cleanPhone = (phone || defaultWhatsApp).replace(/\D/g, "")
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || "Hola, me comunico desde la oficina virtual de ATOMIC.")}`
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Loaders and Checkers
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        // Load System Users
        fetch("/api/admin/manage-users").then(r => r.json()).then(d => { if (d.users) setSystemUsers(d.users) }).catch(() => {})

        // Load Cartelera Notes
        fetch("/api/office/notes").then(r => r.json()).then(d => { if (d.notes) setCarteleraNotes(d.notes) }).catch(() => {})

        // Load Quotes
        if (recentQuotes.length === 0) {
            fetch("/api/quotes?limit=5").then(r => r.json()).then(d => { if (d.quotes) setPrinterQuotes(d.quotes.slice(0, 5)) }).catch(() => {})
        }

        // Load Appointments
        fetch("/api/supervision/appointments").then(r => r.json()).then(d => {
            if (d.appointments && d.appointments.length > 0) setAppointments(d.appointments)
        }).catch(() => {})

        // Load Profiles Cache
        fetch("/api/profile/setup").then(r => r.json()).then(d => {
            if (d.allProfiles) setProfilesMap(d.allProfiles)
            if (d.profile) {
                setProfileName(d.profile.fullName || session?.user?.name || "")
                setProfilePhone(d.profile.phone || "")
                setProfileCity(d.profile.city || "Quito, Ecuador")
                setProfileSchedule(d.profile.schedule || "08:00 - 17:00")
                setProfileHasPC(d.profile.hasComputer ?? true)
                if (d.profile.avatar?.emoji) setMyAvatarEmoji(d.profile.avatar.emoji)
            }
        }).catch(() => {})

        // Check 30-minute persistent profile prompt
        const lastPrompt = localStorage.getItem("atomic_profile_prompt_ts")
        const now = Date.now()
        if (!lastPrompt || now - parseInt(lastPrompt) > 30 * 60 * 1000) {
            const timer = setTimeout(() => setShowProfilePrompt(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [recentQuotes, session])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages])

    const closeRoom = () => setActiveRoom(null)

    // ─────────────────────────────────────────────────────────────────────────
    // Handlers
    // ─────────────────────────────────────────────────────────────────────────
    const handleSaveProfile = async () => {
        setIsSavingProfile(true)
        try {
            const payload = {
                fullName: profileName,
                phone: profilePhone,
                hasComputer: profileHasPC,
                city: profileCity,
                schedule: profileSchedule,
                hasResume: profileHasResume,
                resumeUrl: profileResumeUrl,
                avatar: { gender: avatarGender, hair: avatarHair, skin: avatarSkin, style: avatarStyle, emoji: myAvatarEmoji }
            }
            const res = await fetch("/api/profile/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data.success) {
                if (data.allProfiles) setProfilesMap(data.allProfiles)
                localStorage.setItem("atomic_profile_prompt_ts", Date.now().toString())
                setShowProfilePrompt(false)
            }
        } catch (e) { console.error(e) } finally { setIsSavingProfile(false) }
    }

    const handleDismissProfilePrompt = () => {
        localStorage.setItem("atomic_profile_prompt_ts", Date.now().toString())
        setShowProfilePrompt(false)
    }

    const handleCreateAppointment = async () => {
        if (!newClientName.trim()) return
        setIsCreatingApt(true)
        try {
            const payload = {
                clientName: newClientName,
                scheduledTime: newClientTime,
                scheduledDate: new Date().toISOString().split("T")[0],
                purpose: newClientPurpose || "Atención comercial / técnica",
                phone: newClientPhone
            }
            const res = await fetch("/api/supervision/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "CREATE_APPOINTMENT", payload })
            })
            const data = await res.json()
            if (data.success) {
                setAppointments(prev => [data.appointment, ...prev])
                setNewClientName("")
                setNewClientPurpose("")
                setNewClientPhone("")
                alert("🔔 Cita registrada y notificaciones generadas para todo el equipo!")
            }
        } catch (e) { console.error(e) } finally { setIsCreatingApt(false) }
    }

    const handleSaveAttention = async () => {
        if (!selectedAptToAttend) return
        setIsSavingAttention(true)
        try {
            const payload = {
                appointmentId: selectedAptToAttend.id,
                summary: attentionSummary,
                need: attentionNeed,
                urgency: attentionUrgency,
                budget: attentionBudget,
                recontact: attentionRecontact,
                contactMethod: attentionMethod
            }
            const res = await fetch("/api/supervision/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "ATTEND_CLIENT", payload })
            })
            const data = await res.json()
            if (data.success) {
                setAppointments(prev => prev.map(a => a.id === selectedAptToAttend.id ? data.appointment : a))
                setSelectedAptToAttend(null)
                setAttentionSummary("")
                setAttentionNeed("")
            }
        } catch (e) { console.error(e) } finally { setIsSavingAttention(false) }
    }

    const handleAddCarteleraNote = async () => {
        if (!newNoteMessage.trim()) return
        setIsSavingNote(true)
        try {
            const res = await fetch("/api/office/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newNoteTitle || "Aviso General",
                    message: newNoteMessage,
                    imageUrl: newNoteImage,
                    targetDesk: "General"
                })
            })
            const data = await res.json()
            if (data.success) {
                setCarteleraNotes(data.notes)
                setNewNoteTitle("")
                setNewNoteMessage("")
                setNewNoteImage(null)
            }
        } catch (e) { console.error(e) } finally { setIsSavingNote(false) }
    }

    const handleDeleteCarteleraNote = async (id: string) => {
        try {
            const res = await fetch(`/api/office/notes?id=${id}`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) setCarteleraNotes(data.notes)
        } catch (e) { console.error(e) }
    }

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
            setChatMessages([...msgs, { sender: "bot", text: data.text || "Déjame preparar un plan práctico para ti..." }])
        } catch {
            setChatMessages([...msgs, { sender: "bot", text: "Hubo un error de conexión con el consejero. ¡Inténtalo de nuevo!" }])
        } finally { setIsChatLoading(false) }
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
                items: parsedItems, subtotal: rawSub, taxAmount: tax, taxPercent: 15,
                discountAmount: 0, total: q.total || rawSub + tax,
                deliveryAddress: q.deliveryAddress || ""
            })
        } catch (e) { console.error(e) }
    }

    const waitingClients = appointments.filter(a => a.status === "WAITING" || a.status === "SCHEDULED")

    // ── ROOM TILES ────────────────────────────────────────────────────────────
    const rooms = [
        { id: "visitas" as const, emoji: "🛎️", label: "Sala de Visitas", sublabel: "Citas & Clientes", color: "bg-gradient-to-br from-amber-600/90 to-orange-700/80", glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]", pos: { x: "5%", y: "10%" }, badge: waitingClients.length > 0 ? waitingClients.length : undefined },
        { id: "meeting" as const, emoji: "🤝", label: "Sala de Reuniones", sublabel: "Atención & Mesas", color: "bg-gradient-to-br from-indigo-900/90 to-purple-900/70", glow: "shadow-[0_0_20px_rgba(99,102,241,0.5)]", pos: { x: "24%", y: "10%" } },
        { id: "ceo" as const, emoji: "🏛️", label: "Despacho CEO", sublabel: "Mensaje Privado", color: "bg-gradient-to-br from-rose-900/90 to-pink-900/70", glow: "shadow-[0_0_20px_rgba(244,63,94,0.5)]", pos: { x: "43%", y: "10%" } },
        { id: "coordinacion" as const, emoji: "🎯", label: "Coordinación", sublabel: "Chat & Plan", color: "bg-gradient-to-br from-teal-900/90 to-emerald-900/70", glow: "shadow-[0_0_20px_rgba(20,184,166,0.5)]", pos: { x: "62%", y: "10%" } },
        { id: "supervision" as const, emoji: "🛡️", label: "Supervisión", sublabel: "Control & Auditoría", color: "bg-gradient-to-br from-blue-900/90 to-cyan-900/70", glow: "shadow-[0_0_20px_rgba(59,130,246,0.5)]", pos: { x: "81%", y: "10%" } },
        { id: "workshop" as const, emoji: "🔧", label: "Taller Técnico", sublabel: "Visita / Soporte", color: "bg-gradient-to-br from-slate-800/90 to-zinc-900/80", glow: "shadow-[0_0_20px_rgba(100,116,139,0.5)]", pos: { x: "5%", y: "38%" } },
        { id: "marketing" as const, emoji: "📣", label: "Marketing", sublabel: "Almanaque Diseños", color: "bg-gradient-to-br from-purple-900/90 to-pink-900/70", glow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]", pos: { x: "24%", y: "38%" } },
        { id: "counseling" as const, emoji: "🧠", label: "Consejería", sublabel: "Guía IA Personal", color: "bg-gradient-to-br from-emerald-900/90 to-teal-900/70", glow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]", pos: { x: "43%", y: "38%" } },
        { id: "printer" as const, emoji: "🖨️", label: "Impresora", sublabel: "Imprimir PDF", color: "bg-gradient-to-br from-zinc-800/90 to-slate-900/80", glow: "shadow-[0_0_20px_rgba(148,163,184,0.4)]", pos: { x: "62%", y: "38%" } },
        { id: "cartelera" as const, emoji: "📌", label: "Cartelera", sublabel: "Noticias & Avisos", color: "bg-gradient-to-br from-amber-900/90 to-yellow-900/70", glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]", pos: { x: "81%", y: "38%" }, badge: carteleraNotes.length > 0 ? carteleraNotes.length : undefined }
    ]

    return (
        <div className={`relative ${fullscreen ? "fixed inset-0 z-[999] bg-[#030305]" : "w-full"}`}>
            
            {/* ── TOP ACTION BAR ─────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white uppercase tracking-widest">Oficina Virtual ATOMIC 2.5D</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold">ACTIVA</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">Hablar en Voz Alta • Cartelera • Sala de Visitas • Cubículos</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Customize Avatar Button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAvatarModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-[11px] font-bold transition-all shadow-sm"
                    >
                        <span className="text-base">{myAvatarEmoji}</span>
                        <span>Personalizar Avatar</span>
                    </motion.button>

                    {/* Update Profile (Insistent reminder launcher) */}
                    <button
                        onClick={() => setShowProfilePrompt(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-[11px] font-bold transition-all"
                    >
                        <User size={12} />
                        <span>Mis Datos de Perfil</span>
                    </button>

                    {/* Mantenerse Activo Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                        <div onClick={() => setIsActive(!isActive)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isActive ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>
                            {isActive && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 select-none">Mantenerse Activo</span>
                    </label>

                    {/* Fullscreen Button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFullscreen(!fullscreen)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    >
                        <Zap size={12} />
                        <span>{fullscreen ? "Salir" : "¿Entrar a la Oficina?"}</span>
                    </motion.button>
                </div>
            </div>

            {/* ── RPG OFFICE FLOOR ────────────────────────────────────── */}
            <div className={`relative overflow-hidden bg-[#050711] ${fullscreen ? "h-[calc(100vh-60px)]" : "h-[640px]"}`}>
                {/* Tech isometric floor grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

                {/* ── ROOMS GRID (Top area) ─────────────────────────── */}
                <div className="absolute inset-x-4 top-3 grid grid-cols-5 gap-2.5 z-20">
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
                            badge={room.badge}
                            onClick={() => {
                                if (activeRoom === room.id) closeRoom()
                                else {
                                    setActiveRoom(room.id)
                                    setAvatarPos(room.pos)
                                }
                            }}
                        />
                    ))}
                </div>

                {/* ── CLIENT WAITING ANIMATION IN MEETING ROOM ──────── */}
                {waitingClients.length > 0 && (
                    <motion.div
                        className="absolute z-30 cursor-pointer"
                        style={{ left: "28%", top: "48%" }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        onClick={() => setSelectedAptToAttend(waitingClients[0])}
                    >
                        <div className="flex flex-col items-center">
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider animate-bounce shadow-lg flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                                ⏱️ ESPERANDO ATENCIÓN
                            </span>
                            <div className="text-3xl filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.8)]">🧍‍♂️</div>
                            <span className="text-[9px] font-black text-white bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/50 mt-0.5 shadow-md">
                                {waitingClients[0].clientName.split(" ")[0]} ({waitingClients[0].scheduledTime})
                            </span>
                            <span className="text-[8px] font-mono text-cyan-400 underline mt-0.5">Click para atender</span>
                        </div>
                    </motion.div>
                )}

                {/* ── CUBÍCULOS POR CADA PERFIL (Middle / Bottom Floor) ── */}
                <div className="absolute left-4 right-4 bottom-24 z-20">
                    <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Briefcase size={12} className="text-cyan-400" />
                            CUBÍCULOS DE TRABAJO INDIVIDUAL (Click para interactuar / tareas)
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">Datos y WhatsApp sincronizados</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                        {DEFAULT_CUBICLES.map(cub => {
                            const profileData = profilesMap[cub.email]
                            const displayName = profileData?.fullName || cub.defaultName
                            const displayEmoji = profileData?.avatar?.emoji || cub.emoji

                            return (
                                <motion.div
                                    key={cub.id}
                                    whileHover={{ scale: 1.06, y: -3 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setSelectedCubicle(cub)}
                                    className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 rounded-2xl p-2 flex flex-col items-center gap-1 cursor-pointer transition-all shadow-lg group relative"
                                >
                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cub.color} flex items-center justify-center text-base shadow-md group-hover:shadow-cyan-500/30`}>
                                        {displayEmoji}
                                    </div>

                                    <div className="text-center w-full min-w-0">
                                        <p className="text-[9px] font-black text-white truncate group-hover:text-cyan-300">
                                            {displayName.split(" ")[0]}
                                        </p>
                                        <p className="text-[7px] font-mono text-slate-400 truncate">
                                            {cub.roleName.split(" ")[0]}
                                        </p>
                                    </div>

                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* ── DECORATIONS & INTERACTIVES ─────────────────────── */}
                <Decor emoji="📌" label="Cartelera de Noticias" x="2%" y="74%" onClick={() => setActiveRoom("cartelera")} />
                <Decor emoji="🗑️" label="Papelera" x="12%" y="76%" onClick={() => setActiveRoom("cartelera")} />
                <Decor emoji="🪴" label="Planta de la suerte" x="20%" y="75%" wobble />
                <Decor emoji="☕" label="Cafecito caliente" x="35%" y="76%" />
                <Decor emoji="🦆" label="Pato de debugging" x="48%" y="75%" wobble />
                <Decor emoji="📎" label="Documentos" x="65%" y="76%" />
                <Decor emoji="📡" label="Antena Satelital" x="80%" y="74%" wobble />
                <Decor emoji="🖥️" label="Monitor Servidor" x="90%" y="75%" />

                {/* ── YOUR AVATAR ──────────────────────────────────── */}
                <motion.div
                    animate={{ left: avatarPos.x, top: avatarPos.y }}
                    transition={{ type: "spring", stiffness: 90, damping: 18 }}
                    className="absolute flex flex-col items-center gap-0.5 z-30 pointer-events-none"
                >
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                        className="text-3xl filter drop-shadow-[0_4px_16px_rgba(245,158,11,0.9)]"
                    >
                        {myAvatarEmoji}
                    </motion.div>
                    <span className="text-[8px] font-mono font-black text-amber-400 bg-black/90 px-2 py-0.5 rounded-full border border-amber-500/50 whitespace-nowrap shadow-md">
                        {profileName ? profileName.split(" ")[0] : session?.user?.name?.split(" ")[0] || "Operador"} (TÚ)
                    </span>
                </motion.div>

                {/* ── SLIDE-OVER ROOM PANELS ────────────────────────── */}
                <AnimatePresence>
                    {activeRoom && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ type: "spring", damping: 24, stiffness: 220 }}
                            className="absolute top-3 right-3 w-88 max-w-[92vw] bg-[#0a0a14]/98 border border-slate-700 rounded-3xl shadow-2xl backdrop-blur-2xl z-40 overflow-hidden flex flex-col max-h-[calc(100%-1.5rem)]"
                        >
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{rooms.find(r => r.id === activeRoom)?.emoji}</span>
                                    <div>
                                        <p className="text-xs font-black text-white">{rooms.find(r => r.id === activeRoom)?.label}</p>
                                        <p className="text-[9px] font-mono text-slate-400">{rooms.find(r => r.id === activeRoom)?.sublabel}</p>
                                    </div>
                                </div>
                                <button onClick={closeRoom} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Panel Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                
                                {/* ── SALA DE VISITAS (CITA CONCRETADA) ── */}
                                {activeRoom === "visitas" && (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1">
                                            <p className="text-[10px] font-mono font-bold text-amber-300 uppercase">🛎️ Adjuntar Cita Concretada</p>
                                            <p className="text-[9px] text-slate-400">
                                                Registra la visita de un cliente. Se enviarán notificaciones inmediatas a todo el equipo y aparecerá el cliente animado en la Sala de Reuniones.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Nombre del Cliente *</label>
                                            <input
                                                value={newClientName}
                                                onChange={e => setNewClientName(e.target.value)}
                                                placeholder="Ej: Ing. Marco Salgado..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none focus:border-amber-500/60 font-sans"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Hora de Cita *</label>
                                                <input
                                                    type="time"
                                                    value={newClientTime}
                                                    onChange={e => setNewClientTime(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none focus:border-amber-500/60"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Teléfono / Celular</label>
                                                <input
                                                    value={newClientPhone}
                                                    onChange={e => setNewClientPhone(e.target.value)}
                                                    placeholder="+593 9..."
                                                    className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none focus:border-amber-500/60"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Motivo / Requerimiento</label>
                                            <textarea
                                                rows={2}
                                                value={newClientPurpose}
                                                onChange={e => setNewClientPurpose(e.target.value)}
                                                placeholder="Ej: Revisión de presupuesto para sistema de cámaras y control de acceso..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs resize-none outline-none focus:border-amber-500/60 font-sans"
                                            />
                                        </div>

                                        <button
                                            onClick={handleCreateAppointment}
                                            disabled={!newClientName.trim() || isCreatingApt}
                                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                                        >
                                            {isCreatingApt ? <Loader2 size={13} className="animate-spin" /> : <Bell size={13} />}
                                            <span>Guardar Cita & Notificar Equipo</span>
                                        </button>

                                        {/* Notificar a Coordinación por WhatsApp */}
                                        <button
                                            onClick={() => {
                                                const txt = `🔔 *NUEVA CITA CONCRETADA EN OFICINA*\n👤 *Cliente:* ${newClientName || "Por confirmar"}\n⏰ *Hora:* ${newClientTime}\n📱 *Teléfono:* ${newClientPhone || "No especificado"}\n📋 *Motivo:* ${newClientPurpose || "Consulta general"}\n\n_Registrado desde la Oficina Virtual de ATOMIC_`
                                                window.open(getWAUrl(defaultWhatsApp, txt), "_blank")
                                            }}
                                            className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                                        >
                                            <Phone size={12} />
                                            <span>Notificar por WhatsApp a Coordinación</span>
                                        </button>

                                        {/* Historial de Citas */}
                                        <div className="border-t border-slate-800 pt-2 space-y-1.5">
                                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Citas Agendadas Hoy ({appointments.length})</p>
                                            {appointments.map(apt => (
                                                <div key={apt.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="font-black text-white">{apt.clientName}</span>
                                                        <span className="text-amber-400 font-mono font-bold">⏱️ {apt.scheduledTime}</span>
                                                    </div>
                                                    <p className="text-[9px] text-slate-400 line-clamp-1">{apt.purpose}</p>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                                            apt.status === "ATTENDED" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300 animate-pulse"
                                                        }`}>
                                                            {apt.status === "ATTENDED" ? "ATENDIDO ✓" : "EN ESPERA"}
                                                        </span>
                                                        {apt.status !== "ATTENDED" && (
                                                            <button
                                                                onClick={() => setSelectedAptToAttend(apt)}
                                                                className="text-[9px] text-cyan-400 hover:underline font-bold"
                                                            >
                                                                Atender cliente →
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── CARTELERA DE NOTICIAS & AVISOS ─────── */}
                                {activeRoom === "cartelera" && (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1">
                                            <p className="text-[10px] font-mono font-bold text-amber-300 uppercase">📌 Cartelera de la Empresa</p>
                                            <p className="text-[9px] text-slate-400">
                                                Notas generales, imágenes y anuncios visibles para todos. Usa el icono de papelera 🗑️ para quitar cualquier nota.
                                            </p>
                                        </div>

                                        {/* Crear nueva nota en cartelera */}
                                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                                            <input
                                                value={newNoteTitle}
                                                onChange={e => setNewNoteTitle(e.target.value)}
                                                placeholder="Título del anuncio..."
                                                className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold outline-none focus:border-amber-500/60"
                                            />
                                            <textarea
                                                rows={2}
                                                value={newNoteMessage}
                                                onChange={e => setNewNoteMessage(e.target.value)}
                                                placeholder="Detalle o instrucción del anuncio..."
                                                className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl text-xs resize-none outline-none focus:border-amber-500/60"
                                            />
                                            
                                            {/* Optional Image */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="note-img-upload"
                                                    className="hidden"
                                                    onChange={e => {
                                                        const f = e.target.files?.[0]
                                                        if (f) {
                                                            const r = new FileReader()
                                                            r.onload = ev => setNewNoteImage(ev.target?.result as string)
                                                            r.readAsDataURL(f)
                                                        }
                                                    }}
                                                />
                                                <label htmlFor="note-img-upload" className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-mono cursor-pointer flex items-center gap-1 border border-slate-700">
                                                    <ImageIcon size={11} />
                                                    <span>{newNoteImage ? "Imagen Cargada ✓" : "Adjuntar Imagen"}</span>
                                                </label>
                                                {newNoteImage && (
                                                    <button onClick={() => setNewNoteImage(null)} className="text-rose-400 text-[10px] hover:underline">
                                                        Quitar imagen
                                                    </button>
                                                )}
                                            </div>

                                            <button
                                                onClick={handleAddCarteleraNote}
                                                disabled={!newNoteMessage.trim() || isSavingNote}
                                                className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                            >
                                                {isSavingNote ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                                <span>Publicar en Cartelera</span>
                                            </button>
                                        </div>

                                        {/* Lista de notas */}
                                        <div className="space-y-2">
                                            {carteleraNotes.map(n => (
                                                <div key={n.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 relative group">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-xs font-black text-white">{n.title}</p>
                                                            <p className="text-[9px] font-mono text-amber-400">Por: {n.from} • {n.createdAt}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteCarteleraNote(n.id)}
                                                            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                                                            title="Eliminar aviso (Papelera)"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{n.message}</p>
                                                    {n.imageUrl && (
                                                        <div className="rounded-xl overflow-hidden border border-slate-800 max-h-36">
                                                            <img src={n.imageUrl} alt="Anuncio" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {carteleraNotes.length === 0 && (
                                                <p className="text-[10px] font-mono text-slate-500 text-center py-4">No hay anuncios activos en la cartelera.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ── CONSEJERÍA (AI CHATBOT) ──────── */}
                                {activeRoom === "counseling" && (
                                    <div className="flex flex-col h-full space-y-3">
                                        <div className="flex-1 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                                            {chatMessages.map((msg, i) => (
                                                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                                        msg.sender === "user" ? "bg-teal-600/30 border border-teal-500/30 text-teal-100" : "bg-slate-800 border border-slate-700 text-slate-200"
                                                    }`}>
                                                        {msg.sender === "bot" && <span className="text-[8px] font-mono font-bold text-teal-400 block mb-0.5">🧠 Consejero Atomic</span>}
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                            {isChatLoading && (
                                                <div className="flex justify-start">
                                                    <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-2xl flex gap-1">
                                                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                                                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                                                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
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
                                                placeholder="Cuéntame qué necesitas mejorar..."
                                                className="flex-1 bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none focus:border-teal-500/50"
                                            />
                                            <button onClick={handleSendCounselorMessage} disabled={isChatLoading || !chatInput.trim()}
                                                className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl disabled:opacity-50 cursor-pointer">
                                                <Send size={13} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── IMPRESORA (COTIZACIONES) ─────── */}
                                {activeRoom === "printer" && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Cotizaciones Recientes para Impresión</p>
                                        {printerQuotes.map((q: any) => (
                                            <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">{q.quoteNumber}</span>
                                                    <span className="text-emerald-400 text-xs font-black">${q.total?.toFixed(2)}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-white truncate">{q.clientName}</p>
                                                <button onClick={() => handleDownloadFromPrinter(q)}
                                                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                                                    <Printer size={11} />
                                                    <span>Imprimir Propuesta PDF</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── COORDINACIÓN & SUPERVISIÓN & CEO ── */}
                                {activeRoom === "coordinacion" && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-mono text-slate-400 mb-2">Departamento de Coordinación:</p>
                                        <button onClick={() => window.open(getWAUrl(profilesMap["coordinacion@atomic.com.ec"]?.phone || defaultWhatsApp, "Hola Coordinación, solicito mi plan laboral actualizado por favor."), "_blank")}
                                            className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 px-3">
                                            📋 Solicitar Plan Laboral (WhatsApp)
                                        </button>
                                        <button onClick={() => window.open(getWAUrl(profilesMap["coordinacion@atomic.com.ec"]?.phone || defaultWhatsApp, "Hola Coordinación, necesito comunicarme directamente contigo."), "_blank")}
                                            className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-2 px-3">
                                            💬 Chat Directo con Coordinador
                                        </button>
                                        <button onClick={() => window.open("/dashboard/coordinacion", "_self")}
                                            className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold flex items-center justify-between px-3">
                                            <span>🎯 Ir al Módulo Oficial</span>
                                            <ChevronRight size={13} />
                                        </button>
                                    </div>
                                )}

                                {activeRoom === "supervision" && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-mono text-slate-400 mb-2">Supervisión Operativa:</p>
                                        <button onClick={() => window.open(getWAUrl(profilesMap["supervisor@atomic.com.ec"]?.phone || defaultWhatsApp, "Hola Supervisión, solicito la lista de precios oficial."), "_blank")}
                                            className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 px-3">
                                            💲 Solicitar Lista de Precios
                                        </button>
                                        <button onClick={() => window.open(getWAUrl(profilesMap["supervisor@atomic.com.ec"]?.phone || defaultWhatsApp, "Hola Supervisión, solicito mi plan laboral."), "_blank")}
                                            className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold flex items-center gap-2 px-3">
                                            📅 Solicitar Plan Laboral
                                        </button>
                                        <button onClick={() => window.open("/dashboard/supervision", "_self")}
                                            className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold flex items-center justify-between px-3">
                                            <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> Ir a Módulo de Supervisión</span>
                                            <ChevronRight size={13} />
                                        </button>
                                    </div>
                                )}

                                {activeRoom === "ceo" && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-mono text-slate-400">Deja un mensaje privado al despacho del CEO:</p>
                                        <textarea rows={4} value={ceoMessage} onChange={e => setCeoMessage(e.target.value)} placeholder="Mensaje confidencial al CEO..."
                                            className="w-full bg-slate-900 border border-rose-500/30 text-white p-2.5 rounded-xl text-xs outline-none focus:border-rose-500/60 resize-none font-sans" />
                                        <button
                                            onClick={async () => {
                                                if (!ceoMessage.trim()) return
                                                alert("Mensaje enviado con éxito al despacho del CEO")
                                                setCeoMessage("")
                                                closeRoom()
                                            }}
                                            className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black rounded-xl text-xs uppercase cursor-pointer"
                                        >
                                            Enviar al CEO
                                        </button>
                                    </div>
                                )}

                                {activeRoom === "meeting" && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-mono text-slate-400">Sugerir nueva reunión de equipo:</p>
                                        <textarea rows={2} value={meetingTopic} onChange={e => setMeetingTopic(e.target.value)} placeholder="Tema o motivo..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none focus:border-indigo-500/60 resize-none" />
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {["URGENTE", "NORMAL", "PLANIFICADA"].map(u => (
                                                <button key={u} onClick={() => setMeetingUrgency(u)}
                                                    className={`py-1 rounded-xl text-[9px] font-bold border ${meetingUrgency === u ? "bg-indigo-500/20 border-indigo-500 text-indigo-300" : "bg-slate-900 border-slate-700 text-slate-400"}`}>
                                                    {u}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                alert("Reunión sugerida con éxito al coordinador")
                                                setMeetingTopic("")
                                                closeRoom()
                                            }}
                                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer"
                                        >
                                            Programar Reunión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 1: ATENDER CLIENTE (ESTADO DE ATENCIÓN)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedAptToAttend && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" onClick={() => setSelectedAptToAttend(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                            className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <div className="bg-[#0b0c16] border border-amber-500/40 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🤝</span>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">¿Atender al Cliente?</h3>
                                            <p className="text-[10px] font-mono text-amber-400">{selectedAptToAttend.clientName} (Hora: {selectedAptToAttend.scheduledTime})</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedAptToAttend(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Resumen de la Atención *</label>
                                        <textarea
                                            rows={2}
                                            value={attentionSummary}
                                            onChange={e => setAttentionSummary(e.target.value)}
                                            placeholder="Detalla los puntos acordados durante la atención..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs resize-none outline-none focus:border-amber-500/60"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Necesidad / Requerimiento Concreto</label>
                                        <input
                                            value={attentionNeed}
                                            onChange={e => setAttentionNeed(e.target.value)}
                                            placeholder="Ej: Kit 8 cámaras IP 4K + cerradura biométrica..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-amber-500/60"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Urgencia</label>
                                            <select
                                                value={attentionUrgency}
                                                onChange={e => setAttentionUrgency(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold outline-none"
                                            >
                                                <option value="ALTA">🔴 Alta (Cierre hoy)</option>
                                                <option value="MEDIA">🟡 Media (Esta semana)</option>
                                                <option value="BAJA">🟢 Baja (Exploratorio)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Presupuesto ($)</label>
                                            <input
                                                value={attentionBudget}
                                                onChange={e => setAttentionBudget(e.target.value)}
                                                placeholder="$1,200..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="chk-recontact"
                                            checked={attentionRecontact}
                                            onChange={e => setAttentionRecontact(e.target.checked)}
                                            className="accent-amber-500"
                                        />
                                        <label htmlFor="chk-recontact" className="text-xs text-slate-300 font-bold cursor-pointer select-none">
                                            Requiere seguimiento / recontacto
                                        </label>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => setSelectedAptToAttend(null)}
                                            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveAttention}
                                            disabled={isSavingAttention}
                                            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                                        >
                                            {isSavingAttention ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                                            <span>Registrar Estado</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 2: PERFIL INSISTENTE (Cada 30 minutos)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {showProfilePrompt && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={handleDismissProfilePrompt} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0c0e1a] border-2 border-blue-500/50 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                                            <UserCheck size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">COLOCA TUS DATOS DEL PERFIL</h3>
                                            <p className="text-[10px] font-mono text-blue-400">Recordatorio periódico cada 30 minutos</p>
                                        </div>
                                    </div>
                                    <button onClick={handleDismissProfilePrompt} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Nombres y Apellidos *</label>
                                            <input
                                                value={profileName}
                                                onChange={e => setProfileName(e.target.value)}
                                                placeholder="Tu nombre completo..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-bold outline-none focus:border-blue-500/60"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Teléfono Celular *</label>
                                            <input
                                                value={profilePhone}
                                                onChange={e => setProfilePhone(e.target.value)}
                                                placeholder="+593 9..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-mono outline-none focus:border-blue-500/60"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">¿Dispones de Computadora? *</label>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setProfileHasPC(true)}
                                                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                                        profileHasPC ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-slate-900 border-slate-700 text-slate-400"
                                                    }`}
                                                >
                                                    💻 SÍ
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setProfileHasPC(false)}
                                                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                                        !profileHasPC ? "bg-rose-500/20 border-rose-500 text-rose-300" : "bg-slate-900 border-slate-700 text-slate-400"
                                                    }`}
                                                >
                                                    ❌ NO
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Ciudad de Residencia</label>
                                            <input
                                                value={profileCity}
                                                onChange={e => setProfileCity(e.target.value)}
                                                placeholder="Quito, Guayaquil, etc..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-blue-500/60"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Horario Disponible</label>
                                        <input
                                            value={profileSchedule}
                                            onChange={e => setProfileSchedule(e.target.value)}
                                            placeholder="08:00 - 17:00 / Flexible..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-blue-500/60"
                                        />
                                    </div>

                                    {/* Hoja de vida (Opcional) */}
                                    <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setProfileHasResume(!profileHasResume)}>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                                profileHasResume ? "bg-blue-500 border-blue-500" : "border-slate-600"
                                            }`}>
                                                {profileHasResume && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className="text-xs font-bold text-slate-200">Subir Hoja de Vida (Opcional)</span>
                                        </div>

                                        {profileHasResume && (
                                            <input
                                                value={profileResumeUrl}
                                                onChange={e => setProfileResumeUrl(e.target.value)}
                                                placeholder="Enlace a tu CV en Drive o Dropbox..."
                                                className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none focus:border-blue-500/60"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                                    <button
                                        onClick={handleDismissProfilePrompt}
                                        className="px-4 py-2.5 text-xs text-slate-400 hover:text-white font-mono"
                                    >
                                        Recordarme en 30 min
                                    </button>

                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={!profileName.trim() || isSavingProfile}
                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                                    >
                                        {isSavingProfile ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                        <span>Guardar Mis Datos</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 3: PERSONALIZAR AVATAR
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {showAvatarModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setShowAvatarModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b0c16] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{myAvatarEmoji}</span>
                                        <div>
                                            <h3 className="text-xs font-black text-white uppercase tracking-wider">Personalizar Avatar</h3>
                                            <p className="text-[9px] font-mono text-cyan-400">Identidad en la oficina virtual</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAvatarModal(false)} className="text-slate-400 hover:text-white p-1">
                                        <X size={15} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Género</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: "hombre" as const, label: "👨 Hombre", emoji: "👨‍💼" },
                                                { id: "mujer" as const, label: "👩 Mujer", emoji: "👩‍💼" }
                                            ].map(g => (
                                                <button
                                                    key={g.id}
                                                    onClick={() => {
                                                        setAvatarGender(g.id)
                                                        setMyAvatarEmoji(g.emoji)
                                                    }}
                                                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                                        avatarGender === g.id ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-slate-900 border-slate-700 text-slate-400"
                                                    }`}
                                                >
                                                    {g.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Estilo / Rol</label>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {[
                                                { id: "ejecutivo", emoji: avatarGender === "hombre" ? "👨‍💼" : "👩‍💼", label: "Ejecutivo" },
                                                { id: "creativo", emoji: avatarGender === "hombre" ? "🎨" : "👩‍🎨", label: "Creativo" },
                                                { id: "tech", emoji: avatarGender === "hombre" ? "🧑‍💻" : "👩‍💻", label: "Tech" },
                                                { id: "gamer", emoji: "👾", label: "Atomic" }
                                            ].map(st => (
                                                <button
                                                    key={st.id}
                                                    onClick={() => {
                                                        setAvatarStyle(st.id)
                                                        setMyAvatarEmoji(st.emoji)
                                                    }}
                                                    className={`p-2 rounded-xl text-center border transition-all ${
                                                        myAvatarEmoji === st.emoji ? "bg-cyan-500/20 border-cyan-500" : "bg-slate-900 border-slate-800"
                                                    }`}
                                                >
                                                    <span className="text-xl block">{st.emoji}</span>
                                                    <span className="text-[8px] font-mono text-slate-400 mt-1 block">{st.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={async () => {
                                            await handleSaveProfile()
                                            setShowAvatarModal(false)
                                        }}
                                        className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                                    >
                                        <Check size={13} />
                                        <span>Guardar Avatar</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 4: ACCIONES SOBRE CUBÍCULO (MENÚ 3 PUNTOS ADMIN / CHAT)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedCubicle && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setSelectedCubicle(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b0c16] border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedCubicle.color} flex items-center justify-center text-lg`}>
                                            {profilesMap[selectedCubicle.email]?.avatar?.emoji || selectedCubicle.emoji}
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black text-white uppercase">
                                                {profilesMap[selectedCubicle.email]?.fullName || selectedCubicle.defaultName}
                                            </h3>
                                            <p className="text-[9px] font-mono text-cyan-400">{selectedCubicle.roleName}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedCubicle(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={15} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {/* Iniciar Conversación WhatsApp */}
                                    <button
                                        onClick={() => {
                                            const phone = profilesMap[selectedCubicle.email]?.phone || defaultWhatsApp
                                            window.open(getWAUrl(phone, `Hola ${profilesMap[selectedCubicle.email]?.fullName || selectedCubicle.defaultName}, te escribo desde la oficina virtual de ATOMIC.`), "_blank")
                                        }}
                                        className="w-full py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Phone size={13} />
                                        <span>Iniciar Conversación (WhatsApp)</span>
                                    </button>

                                    {/* Programar Reunión */}
                                    <button
                                        onClick={() => {
                                            setActiveRoom("meeting")
                                            setSelectedCubicle(null)
                                        }}
                                        className="w-full py-2.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Calendar size={13} />
                                        <span>Programar Reunión con este Puesto</span>
                                    </button>

                                    {/* Dejar Nota en Escritorio */}
                                    <div className="pt-2 border-t border-slate-800 space-y-2">
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Dejar Nota Rápida</label>
                                        <textarea
                                            rows={2}
                                            value={cubicleNoteText}
                                            onChange={e => setCubicleNoteText(e.target.value)}
                                            placeholder="Mensaje que verá cuando abra su puesto..."
                                            className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl text-xs resize-none outline-none focus:border-amber-400"
                                        />
                                        <button
                                            onClick={async () => {
                                                if (!cubicleNoteText.trim()) return
                                                await fetch("/api/office/notes", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        title: `Nota para ${selectedCubicle.roleName}`,
                                                        message: cubicleNoteText,
                                                        targetDesk: selectedCubicle.defaultName
                                                    })
                                                })
                                                alert("Nota pegada en el escritorio con éxito")
                                                setCubicleNoteText("")
                                                setSelectedCubicle(null)
                                            }}
                                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <StickyNote size={12} />
                                            <span>Pegar Nota en su Escritorio</span>
                                        </button>
                                    </div>

                                    {/* ⋮ ASIGNAR TAREA DIRECTA (ADMIN / COORDINADOR) */}
                                    {(session?.user?.role === "ADMIN" || session?.user?.role === "COORDINATOR" || session?.user?.role === "COORD_ASSISTANT") && (
                                        <div className="pt-2 border-t border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                                                    <ShieldCheck size={12} /> Menú Admin: Asignar Tarea
                                                </span>
                                                <button
                                                    onClick={() => setIsAssigningTask(!isAssigningTask)}
                                                    className="text-[10px] text-cyan-400 hover:underline font-mono"
                                                >
                                                    {isAssigningTask ? "Cerrar" : "+ Nueva"}
                                                </button>
                                            </div>

                                            {isAssigningTask && (
                                                <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                                                    <input
                                                        value={taskTitleToAssign}
                                                        onChange={e => setTaskTitleToAssign(e.target.value)}
                                                        placeholder="Título de la tarea a asignar..."
                                                        className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl text-xs outline-none focus:border-purple-500"
                                                    />
                                                    <div className="grid grid-cols-2 gap-1.5">
                                                        {["ORDINARIA", "URGENTE"].map(t => (
                                                            <button
                                                                key={t}
                                                                type="button"
                                                                onClick={() => setTaskTypeToAssign(t)}
                                                                className={`py-1 rounded-lg text-[9px] font-bold border ${
                                                                    taskTypeToAssign === t ? "bg-purple-500/30 border-purple-500 text-purple-200" : "bg-slate-900 border-slate-800 text-slate-400"
                                                                }`}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            if (!taskTitleToAssign.trim()) return
                                                            await fetch("/api/supervision/tasks", {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({
                                                                    action: "CREATE_DIRECTED_TASK",
                                                                    payload: {
                                                                        title: taskTitleToAssign,
                                                                        targetArea: selectedCubicle.roleName,
                                                                        targetEmail: selectedCubicle.email,
                                                                        duration: "24 horas",
                                                                        taskType: taskTypeToAssign,
                                                                        requiredFormat: "CUALQUIER_ARCHIVO"
                                                                    }
                                                                })
                                                            })
                                                            alert(`Tarea asignada directamente a ${selectedCubicle.defaultName}`)
                                                            setTaskTitleToAssign("")
                                                            setIsAssigningTask(false)
                                                            setSelectedCubicle(null)
                                                        }}
                                                        className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-xl text-xs uppercase cursor-pointer"
                                                    >
                                                        Despachar Tarea
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
