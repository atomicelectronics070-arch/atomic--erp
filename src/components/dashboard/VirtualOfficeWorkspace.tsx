"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Send, Loader2, Building2, MessageSquare, Wrench, Brain,
    Phone, MapPin, Calendar, Users, Star, ChevronRight, Printer,
    FileText, Upload, Zap, ShieldCheck, Check, Clock, AlertCircle,
    UserCheck, Trash2, StickyNote, Image as ImageIcon, Sparkles,
    Laptop, Briefcase, Bell, ChevronDown, CheckCircle2, User, Eye,
    Share2, Compass, Radio, Activity, Award
} from "lucide-react"
import { generateAtomicUnifiedProposalPDF } from "@/lib/pdf/quotePdfGenerator"
import { RealisticAvatar } from "@/components/office/RealisticAvatars"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
    currentModule?: string
    session?: any
    recentQuotes?: any[]
}

type ActiveDepartment = 
    | "ventas"
    | "visitas" 
    | "reuniones" 
    | "ceo" 
    | "coordinacion" 
    | "supervision" 
    | "taller" 
    | "multimedia" 
    | "marketing"
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

interface TeamMember {
    id: string
    name: string
    role: string
    department: string
    email: string
    avatarType: "carlos" | "ceo" | "coordinador" | "ventas" | "desarrollo" | "edicion" | "supervisor" | "contabilidad" | "marketing" | "investigacion" | "custom"
    status: "online" | "busy" | "calling" | "waiting"
    deskNote?: string
    phone?: string
}

const REAL_TEAM: TeamMember[] = [
    { id: "tm-carlos", name: "Carlos Mendoza", role: "Cliente VIP", department: "Recepción / Visitas", email: "cliente.carlos@vip.com", avatarType: "carlos", status: "waiting", deskNote: "Esperando atención para propuesta de CCTV 4K", phone: "+593998765432" },
    { id: "tm-ceo", name: "Ing. Santiago (CEO)", role: "Director General", department: "Dirección", email: "ceo@atomic.com.ec", avatarType: "ceo", status: "online", deskNote: "Estrategia de expansión nacional 2026", phone: "+593991112233" },
    { id: "tm-coord", name: "Luis G.", role: "Coordinador General", department: "Coordinación & Logística", email: "coordinacion@atomic.com.ec", avatarType: "coordinador", status: "online", deskNote: "Despachos y asignación de prospectos", phone: "+593992223344" },
    { id: "tm-ventas", name: "Milorieta", role: "Asesora Senior", department: "Piso de Ventas", email: "ventas@atomic.com.ec", avatarType: "ventas", status: "online", deskNote: "Cerrando cotización de cerraduras inteligentes", phone: "+593993334455" },
    { id: "tm-sup", name: "Supervisor QC", role: "Auditor de Operaciones", department: "Supervisión 6:00 AM", email: "supervisor@atomic.com.ec", avatarType: "supervisor", status: "online", deskNote: "Calificación de asistencia y finanzas", phone: "+593994445566" },
    { id: "tm-edicion", name: "Ian Editor", role: "Creativo Multimedia", department: "Estudio de Edición", email: "edicion@atomic.com.ec", avatarType: "edicion", status: "busy", deskNote: "Renderizando reels comerciales en 4K", phone: "+593995556677" },
    { id: "tm-dev", name: "Nicolás", role: "Ingeniero de Software", department: "Desarrollo & Sistemas", email: "desarrollo@atomic.com.ec", avatarType: "desarrollo", status: "online", deskNote: "Optimizando arquitectura de Atomic ERP", phone: "+593996667788" },
    { id: "tm-mkt", name: "Facu Marketing", role: "Traffic Manager", department: "Marketing Digital", email: "marketing@atomic.com.ec", avatarType: "marketing", status: "online", deskNote: "Escalando pauta en Meta Ads & TikTok", phone: "+593997778899" },
    { id: "tm-conta", name: "Contabilidad", role: "Finanzas Corporativas", department: "Contabilidad", email: "contabilidad@atomic.com.ec", avatarType: "contabilidad", status: "online", deskNote: "Conciliación bancaria y comisiones", phone: "+593998889900" }
]

export default function VirtualOfficeWorkspace({ currentModule = "ventas", session, recentQuotes = [] }: Props) {
    const [activeDept, setActiveDept] = useState<ActiveDepartment>(null)
    const [fullscreen, setFullscreen] = useState(false)
    const [isActive, setIsActive] = useState(true)
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

    // Appointments & Client Waiting Room state
    const [appointments, setAppointments] = useState<ClientAppointment[]>([
        {
            id: "apt-carlos",
            clientName: "Carlos Mendoza (CCTV & Smart Locks)",
            scheduledTime: "11:00",
            scheduledDate: new Date().toISOString().split("T")[0],
            purpose: "Cotización de 16 Cámaras 4K y 4 Cerraduras Biométricas para Edificio",
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
    const [attentionUrgency, setAttentionUrgency] = useState("ALTA")
    const [attentionBudget, setAttentionBudget] = useState("3500")
    const [attentionRecontact, setAttentionRecontact] = useState(true)
    const [isSavingAttention, setIsSavingAttention] = useState(false)

    // Profile Persistent Modal (Every 30 min)
    const [showProfilePrompt, setShowProfilePrompt] = useState(false)
    const [profileName, setProfileName] = useState("")
    const [profilePhone, setProfilePhone] = useState("")
    const [profileHasPC, setProfileHasPC] = useState(true)
    const [profileCity, setProfileCity] = useState("Quito, Ecuador")
    const [profileSchedule, setProfileSchedule] = useState("08:00 - 17:00")
    const [profileHasResume, setProfileHasResume] = useState(false)
    const [profileResumeUrl, setProfileResumeUrl] = useState("")
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [profilesMap, setProfilesMap] = useState<Record<string, any>>({})

    // Avatar Customizer
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const [avatarGender, setAvatarGender] = useState<"hombre" | "mujer">("hombre")
    const [myAvatarType, setMyAvatarType] = useState<any>("ceo")

    // Cartelera (Notes & News) State
    const [carteleraNotes, setCarteleraNotes] = useState<any[]>([])
    const [newNoteTitle, setNewNoteTitle] = useState("")
    const [newNoteMessage, setNewNoteMessage] = useState("")
    const [newNoteImage, setNewNoteImage] = useState<string | null>(null)
    const [isSavingNote, setIsSavingNote] = useState(false)

    // Public Chat (Hablar en Voz Alta)
    const [chatMessages, setChatMessages] = useState<any[]>([
        { id: "1", from: "Luis G.", text: "¡Hola a todos! El piso de ventas está 100% activo hoy. Tenemos a Carlos Mendoza en recepción.", time: "09:00" },
        { id: "2", from: "Milorieta", text: "Listo, ya preparo la propuesta unificada de cámaras IP para presentársela en la Sala de Reuniones.", time: "09:05" }
    ])
    const [chatInput, setChatInput] = useState("")
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Counselor AI
    const [counselorMsgs, setCounselorMsgs] = useState([
        { sender: "bot", text: "¡Hola! Soy tu consejero y guía de ATOMIC. Cuéntame, ¿qué habilidad deseas reforzar hoy o qué meta de ventas tienes? Te daré un plan paso a paso ahora mismo." }
    ])
    const [counselorInput, setCounselorInput] = useState("")
    const [isCounselorLoading, setIsCounselorLoading] = useState(false)

    // Quotes for Printer
    const [printerQuotes, setPrinterQuotes] = useState<any[]>(recentQuotes)

    const defaultWhatsApp = "593992223344"
    const getWAUrl = (phone?: string, text?: string) => {
        const cleanPhone = (phone || defaultWhatsApp).replace(/\D/g, "")
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || "Hola, me comunico desde la oficina virtual de ATOMIC.")}`
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Lifecycle
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        fetch("/api/office/notes").then(r => r.json()).then(d => { if (d.notes) setCarteleraNotes(d.notes) }).catch(() => {})
        fetch("/api/supervision/appointments").then(r => r.json()).then(d => { if (d.appointments?.length) setAppointments(d.appointments) }).catch(() => {})
        fetch("/api/profile/setup").then(r => r.json()).then(d => {
            if (d.allProfiles) setProfilesMap(d.allProfiles)
            if (d.profile) {
                setProfileName(d.profile.fullName || session?.user?.name || "")
                setProfilePhone(d.profile.phone || "")
                setProfileCity(d.profile.city || "Quito, Ecuador")
                setProfileSchedule(d.profile.schedule || "08:00 - 17:00")
            }
        }).catch(() => {})

        if (recentQuotes.length === 0) {
            fetch("/api/quotes?limit=5").then(r => r.json()).then(d => { if (d.quotes) setPrinterQuotes(d.quotes.slice(0, 5)) }).catch(() => {})
        }

        const lastPrompt = localStorage.getItem("atomic_profile_prompt_ts")
        const now = Date.now()
        if (!lastPrompt || now - parseInt(lastPrompt) > 30 * 60 * 1000) {
            const timer = setTimeout(() => setShowProfilePrompt(true), 2000)
            return () => clearTimeout(timer)
        }
    }, [recentQuotes, session])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages])

    // Handlers
    const handleSendPublicChat = () => {
        if (!chatInput.trim()) return
        const now = new Date()
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
        setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            from: session?.user?.name?.split(" ")[0] || "Tú",
            text: chatInput.trim(),
            time: timeStr
        }])
        setChatInput("")
    }

    const handleCreateAppointment = async () => {
        if (!newClientName.trim()) return
        setIsCreatingApt(true)
        try {
            const payload = {
                clientName: newClientName,
                scheduledTime: newClientTime,
                scheduledDate: new Date().toISOString().split("T")[0],
                purpose: newClientPurpose || "Atención comercial de sistemas de seguridad",
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
                alert("🔔 Cita registrada exitosamente. Notificación con campanazo enviada a todos!")
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
                recontact: attentionRecontact
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
                resumeUrl: profileResumeUrl
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

    const handleSendCounselor = async () => {
        const text = counselorInput.trim()
        if (!text || isCounselorLoading) return
        const msgs = [...counselorMsgs, { sender: "user", text }]
        setCounselorMsgs(msgs)
        setCounselorInput("")
        setIsCounselorLoading(true)
        try {
            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, roleOverride: "COUNSELOR", botNameOverride: "Consejero Atomic" })
            })
            const data = await res.json()
            setCounselorMsgs([...msgs, { sender: "bot", text: data.text || "Aquí tienes las pautas para tu plan de mejora..." }])
        } catch {
            setCounselorMsgs([...msgs, { sender: "bot", text: "Conexión lista. Cuéntame qué aspecto comercial o técnico deseas repasar." }])
        } finally { setIsCounselorLoading(false) }
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

    return (
        <div className={`relative ${fullscreen ? "fixed inset-0 z-[999] bg-[#02040a]" : "w-full"}`}>
            
            {/* ── HEADER DE CONTROL ARQUITECTÓNICO ──────────────────── */}
            <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#080d1a]/95 backdrop-blur-xl gap-3">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">PISO DE VENTAS & INFRAESTRUCTURA REAL</h2>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                OPERATIVO EN VIVO
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">Arquitectura comercial dividida por departamentos reales • Avatares realistas estilo Carlos</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Botón Mi Perfil & Avatar */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAvatarModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                        <RealisticAvatar type={myAvatarType} size={22} showBadge={false} />
                        <span>Mi Avatar & Perfil</span>
                    </motion.button>

                    {/* Botón Datos Insistentes */}
                    <button
                        onClick={() => setShowProfilePrompt(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold transition-all"
                    >
                        <UserCheck size={13} />
                        <span>Completar Ficha (30 min)</span>
                    </button>

                    {/* Checkbox Mantenerse Activo */}
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                        <div onClick={() => setIsActive(!isActive)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isActive ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>
                            {isActive && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 select-none">En Turno Activo</span>
                    </label>

                    {/* Botón Pantalla Completa */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFullscreen(!fullscreen)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                        <Zap size={13} />
                        <span>{fullscreen ? "Salir de Pantalla Completa" : "¿Entrar al Piso de Ventas?"}</span>
                    </motion.button>
                </div>
            </div>

            {/* ── PLANO ARQUITECTÓNICO DEL PISO DE VENTAS REAL ─────────── */}
            <div className={`relative overflow-hidden bg-[#040814] ${fullscreen ? "h-[calc(100vh-65px)]" : "h-[740px]"}`}>
                
                {/* Patrón de piso tecnológico de parqué oscuro & rejilla estructural */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.06),transparent_60%)]" />

                {/* ── CONTENEDOR DE SALAS & PAREDES ARQUITECTÓNICAS ──── */}
                <div className="absolute inset-4 overflow-auto custom-scrollbar p-2">
                    <div className="min-w-[960px] grid grid-cols-12 gap-3 h-full">

                        {/* ─────────────────────────────────────────────────────────────
                            FILA SUPERIOR: SALA DE VISITAS (CARLOS) + SALA DE REUNIONES + CEO
                        ───────────────────────────────────────────────────────────── */}
                        
                        {/* 1. SALA DE VISITAS & RECEPCIÓN VIP (DONDE ESTÁ CARLOS) */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setActiveDept("visitas")}
                            className="col-span-4 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-amber-950/30 border-2 border-amber-500/40 rounded-3xl p-4 relative shadow-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                        >
                            {/* Fachada de cristal y marco arquitectónico */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-sm">🛎️</span>
                                    <div>
                                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Sala de Visitas & Recepción</h3>
                                        <p className="text-[9px] font-mono text-amber-400">Atención a Clientes & Citas</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-mono font-bold">
                                    {waitingClients.length} en espera
                                </span>
                            </div>

                            {/* Escena realista de espera de Carlos Mendoza */}
                            <div className="my-3 p-3 bg-slate-950/80 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
                                <div className="flex items-center gap-3">
                                    <RealisticAvatar type="carlos" size={48} status="waiting" />
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-xs font-black text-white">Carlos Mendoza</p>
                                            <span className="text-[8px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1 rounded">VIP</span>
                                        </div>
                                        <p className="text-[10px] font-mono text-amber-300">⏱️ Cita: 11:00 AM • Esperando</p>
                                        <p className="text-[9px] text-slate-400 line-clamp-1">Revisión de Cámaras 4K & Cerraduras Smart</p>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedAptToAttend(appointments[0])
                                    }}
                                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black rounded-xl text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1 shrink-0 animate-pulse"
                                >
                                    <span>Atender</span>
                                    <ChevronRight size={12} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                                <span>🛋️ Sillón de espera VIP</span>
                                <span className="text-amber-400 underline font-bold group-hover:text-amber-300">+ Registrar nueva cita</span>
                            </div>
                        </motion.div>

                        {/* 2. SALA DE REUNIONES & NEGOCIACIÓN CORPORATIVA (BOARDROOM) */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setActiveDept("reuniones")}
                            className="col-span-5 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-indigo-950/30 border-2 border-indigo-500/40 rounded-3xl p-4 relative shadow-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-400 to-purple-600" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm">🤝</span>
                                    <div>
                                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Sala de Reuniones Ejecutiva</h3>
                                        <p className="text-[9px] font-mono text-indigo-400">Mesa de Negociación & Pantalla 4K</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                                    Proyector Activo
                                </span>
                            </div>

                            {/* Representación realista de la gran mesa de juntas con participantes */}
                            <div className="my-2 p-3 bg-slate-950/90 border border-slate-800 rounded-2xl relative flex flex-col items-center justify-center">
                                {/* Pantalla 4K en pared */}
                                <div className="w-full py-1 px-3 bg-indigo-950/60 border border-indigo-500/30 rounded-lg text-center mb-2">
                                    <span className="text-[9px] font-mono text-indigo-300 font-bold flex items-center justify-center gap-1.5">
                                        <Activity size={11} className="animate-pulse" />
                                        PROPUESTA COMERCIAL UNIFICADA • ATOMIC 2026
                                    </span>
                                </div>

                                {/* Gran mesa ovalada con sillas y avatares realistas */}
                                <div className="w-full h-16 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-full border border-slate-600 shadow-xl flex items-center justify-around px-4 relative">
                                    <RealisticAvatar type="ventas" size={32} showBadge={false} />
                                    <div className="text-center">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">MESA DE CIERRE</span>
                                        <span className="text-[8px] font-mono text-emerald-400">Atendiendo clientes</span>
                                    </div>
                                    <RealisticAvatar type="coordinador" size={32} showBadge={false} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                                <span>📺 Pantalla 4K con Dashboard</span>
                                <span className="text-indigo-400 underline font-bold group-hover:text-indigo-300">Sugerir nueva reunión →</span>
                            </div>
                        </motion.div>

                        {/* 3. DESPACHO PRESIDENCIAL CEO */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setActiveDept("ceo")}
                            className="col-span-3 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-rose-950/30 border-2 border-rose-500/40 rounded-3xl p-4 relative shadow-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-400 to-red-600" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-sm">👑</span>
                                    <div>
                                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Despacho CEO</h3>
                                        <p className="text-[9px] font-mono text-rose-400">Gerencia General</p>
                                    </div>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                            </div>

                            <div className="my-2 p-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
                                <RealisticAvatar type="ceo" size={44} status="online" />
                                <div>
                                    <p className="text-xs font-black text-white">Ing. Santiago</p>
                                    <p className="text-[9px] font-mono text-rose-300">CEO & Fundador</p>
                                    <p className="text-[8px] text-slate-400">Despacho Ejecutivo</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                                <span>🔒 Línea Confidencial</span>
                                <span className="text-rose-400 underline font-bold group-hover:text-rose-300">Dejar mensaje</span>
                            </div>
                        </motion.div>

                        {/* ─────────────────────────────────────────────────────────────
                            FILA INTERMEDIA: PISO PRINCIPAL DE VENTAS & SHOWROOM (GRAN ÁREA)
                        ───────────────────────────────────────────────────────────── */}
                        <div className="col-span-8 bg-gradient-to-br from-slate-900/90 to-emerald-950/20 border-2 border-emerald-500/30 rounded-3xl p-4 relative shadow-2xl flex flex-col justify-between">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                        <Briefcase size={15} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Showroom Comercial & Estaciones de Venta</h3>
                                        <p className="text-[9px] font-mono text-slate-400">Exhibición física de cámaras, cerraduras smart y puestos de asesoras</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setActiveDept("printer")}
                                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                                    >
                                        <Printer size={11} className="text-cyan-400" />
                                        <span>🖨️ Impresora de Cotizaciones</span>
                                    </button>
                                </div>
                            </div>

                            {/* Puestos de asesoría con avatares realistas */}
                            <div className="grid grid-cols-4 gap-2.5 mb-3">
                                {[
                                    { member: REAL_TEAM[3], title: "Showroom Cámaras 4K", desc: "Milorieta en asesoría", icon: "📹" },
                                    { member: REAL_TEAM[2], title: "Despachos & Rutas", desc: "Luis G. Coordinación", icon: "📦" },
                                    { member: REAL_TEAM[4], title: "Auditoría en Vivo", desc: "Supervisor Calidad", icon: "📊" },
                                    { member: REAL_TEAM[6], title: "Sistemas & Cotizador", desc: "Nicolás Soporte IT", icon: "💻" }
                                ].map((station, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedMember(station.member)}
                                        className="p-2.5 bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl cursor-pointer transition-all hover:scale-105 shadow-md group"
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <RealisticAvatar type={station.member.avatarType} size={34} status={station.member.status} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-black text-white truncate group-hover:text-emerald-300">{station.member.name}</p>
                                                <p className="text-[8px] font-mono text-slate-400 truncate">{station.member.role}</p>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 bg-slate-900 rounded-xl border border-slate-800/80 text-[8px] font-mono text-slate-300 truncate">
                                            {station.icon} {station.title}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stands de exhibición de productos reales */}
                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[9px] font-mono text-slate-400">
                                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center gap-2">
                                    <span className="text-base">📹</span>
                                    <div>
                                        <p className="text-white font-bold">Stand CCTV & Alarmas</p>
                                        <p className="text-slate-500 text-[8px]">Hikvision / Dahua 4K</p>
                                    </div>
                                </div>
                                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center gap-2">
                                    <span className="text-base">🔐</span>
                                    <div>
                                        <p className="text-white font-bold">Display Cerraduras Smart</p>
                                        <p className="text-slate-500 text-[8px]">Biometría & App Tuya</p>
                                    </div>
                                </div>
                                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center gap-2">
                                    <span className="text-base">🚧</span>
                                    <div>
                                        <p className="text-white font-bold">Barreras Vehiculares</p>
                                        <p className="text-slate-500 text-[8px]">Control RFID / Tags</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                            COLUMNA DERECHA: SUPERVISIÓN & COORDINACIÓN & CONSEJERÍA
                        ───────────────────────────────────────────────────────────── */}
                        <div className="col-span-4 space-y-3">
                            {/* Supervisión y Calidad */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setActiveDept("supervision")}
                                className="p-3.5 bg-gradient-to-br from-slate-900/95 to-blue-950/30 border-2 border-blue-500/40 rounded-3xl shadow-xl cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <RealisticAvatar type="supervisor" size={32} status="online" />
                                        <div>
                                            <h4 className="text-xs font-black text-white uppercase">Supervisión Operativa</h4>
                                            <p className="text-[9px] font-mono text-blue-400">Ingreso 6:00 AM • Plano Cartesiano</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">10/10</span>
                                </div>
                                <p className="text-[9px] text-slate-400 leading-snug">Auditoría de asistencia, finanzas empresa, tareas dirigidas y ciclos laborales.</p>
                            </motion.div>

                            {/* Estudio Multimedia & Marketing */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setActiveDept("multimedia")}
                                className="p-3.5 bg-gradient-to-br from-slate-900/95 to-purple-950/30 border-2 border-purple-500/40 rounded-3xl shadow-xl cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <RealisticAvatar type="edicion" size={32} status="busy" />
                                        <div>
                                            <h4 className="text-xs font-black text-white uppercase">Estudio Multimedia 4K</h4>
                                            <p className="text-[9px] font-mono text-purple-400">Ian Editor • Almanaque</p>
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Render</span>
                                </div>
                                <p className="text-[9px] text-slate-400 leading-snug">Producción de videos comerciales, reels y banco de creatividades para campañas.</p>
                            </motion.div>

                            {/* Consejería IA */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setActiveDept("counseling")}
                                className="p-3.5 bg-gradient-to-br from-slate-900/95 to-teal-950/30 border-2 border-teal-500/40 rounded-3xl shadow-xl cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-2xl">🧠</span>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase">Consejero Atomic IA</h4>
                                        <p className="text-[9px] font-mono text-teal-400">Plan de mejora personalizado en vivo</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-teal-400" />
                            </motion.div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                            FILA INFERIOR: CARTELERA DE AVISOS + HABLAR EN VOZ ALTA + TALLER
                        ───────────────────────────────────────────────────────────── */}
                        
                        {/* Cartelera con papelera interactiva */}
                        <div className="col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-3.5 shadow-xl flex flex-col justify-between">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-400">📌</span>
                                    <span className="text-xs font-black text-white uppercase tracking-wider">Cartelera del Piso de Ventas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setActiveDept("cartelera")}
                                        className="text-[9px] font-mono text-amber-400 hover:underline font-bold"
                                    >
                                        + Publicar aviso
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-1">
                                    <div className="flex items-center justify-between text-[9px] font-mono text-amber-300">
                                        <span>📍 Meta del Día</span>
                                        <span>09:00 AM</span>
                                    </div>
                                    <p className="text-slate-200 text-[11px] font-medium leading-snug">"Priorizar cierre de propuesta CCTV de Carlos Mendoza hoy."</p>
                                </div>

                                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                                        <span>🛡️ Supervisión</span>
                                        <span>06:00 AM</span>
                                    </div>
                                    <p className="text-slate-300 text-[11px] leading-snug">"Registro puntual completado. Asesoras en sus estaciones."</p>
                                </div>
                            </div>
                        </div>

                        {/* Canal Hablar en Voz Alta (Chat en vivo del piso) */}
                        <div className="col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-3.5 shadow-xl flex flex-col justify-between">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-400">📢</span>
                                    <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">Hablar en Voz Alta</span>
                                    <span className="text-[9px] font-mono text-slate-400">(Intercomunicador general)</span>
                                </div>
                            </div>

                            <div className="space-y-1.5 max-h-16 overflow-y-auto custom-scrollbar mb-2 text-xs">
                                {chatMessages.slice(-2).map(m => (
                                    <div key={m.id} className="p-1.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-cyan-300 mr-2">{m.from}:</span>
                                            <span className="text-slate-200">{m.text}</span>
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-500 shrink-0 ml-2">{m.time}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSendPublicChat()}
                                    placeholder="Escribe para hablar en voz alta a todo el piso..."
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-sans"
                                />
                                <button
                                    onClick={handleSendPublicChat}
                                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                    <Send size={12} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 1: ATENDER A CARLOS MENDOZA O CUALQUIER CLIENTE (ESTADO DE ATENCIÓN)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedAptToAttend && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setSelectedAptToAttend(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.93 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b0f19] border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-3">
                                        <RealisticAvatar type="carlos" size={46} status="waiting" />
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">¿Atender al Cliente?</h3>
                                            <p className="text-[11px] font-mono text-amber-400 font-bold">{selectedAptToAttend.clientName}</p>
                                            <p className="text-[9px] font-mono text-slate-400">Hora de Cita: {selectedAptToAttend.scheduledTime}</p>
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
                                            placeholder="Detalla qué se acordó con Carlos en la Sala de Reuniones..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs resize-none outline-none focus:border-amber-500/60 font-sans"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Requerimiento Concreto</label>
                                        <input
                                            value={attentionNeed}
                                            onChange={e => setAttentionNeed(e.target.value)}
                                            placeholder="Ej: 16 Cámaras IP 4K Dahua + 4 Cerraduras Smart..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-amber-500/60"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Nivel de Urgencia</label>
                                            <select
                                                value={attentionUrgency}
                                                onChange={e => setAttentionUrgency(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold outline-none"
                                            >
                                                <option value="ALTA">🔴 Alta (Cierre inmediato)</option>
                                                <option value="MEDIA">🟡 Media (Esta semana)</option>
                                                <option value="BAJA">🟢 Baja (En análisis)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Presupuesto ($)</label>
                                            <input
                                                value={attentionBudget}
                                                onChange={e => setAttentionBudget(e.target.value)}
                                                placeholder="$3,500"
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
                                            Requiere llamada de seguimiento de Coordinación
                                        </label>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => setSelectedAptToAttend(null)}
                                            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                                        >
                                            Cerrar
                                        </button>
                                        <button
                                            onClick={handleSaveAttention}
                                            disabled={isSavingAttention}
                                            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                                        >
                                            {isSavingAttention ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                                            <span>Guardar Estado de Atención</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 2: DETALLES DE UN COLABORADOR (AVATAR REALISTA & ACCIONES)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedMember && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setSelectedMember(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.93 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0c101d] border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-3">
                                        <RealisticAvatar type={selectedMember.avatarType} size={48} status={selectedMember.status} />
                                        <div>
                                            <h3 className="text-xs font-black text-white uppercase">{selectedMember.name}</h3>
                                            <p className="text-[9px] font-mono text-emerald-400">{selectedMember.role}</p>
                                            <p className="text-[8px] font-mono text-slate-400">{selectedMember.department}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={15} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                                        <span className="text-[9px] font-mono text-slate-400 block uppercase">Estado en Puesto de Ventas</span>
                                        <p className="text-slate-200 font-medium">"{selectedMember.deskNote}"</p>
                                    </div>

                                    {/* Iniciar WhatsApp */}
                                    <button
                                        onClick={() => window.open(getWAUrl(selectedMember.phone, `Hola ${selectedMember.name}, me comunico contigo desde el piso de ventas de ATOMIC.`), "_blank")}
                                        className="w-full py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Phone size={13} />
                                        <span>Llamar / Chat WhatsApp ({selectedMember.phone})</span>
                                    </button>

                                    {/* Programar Reunión */}
                                    <button
                                        onClick={() => {
                                            setActiveDept("reuniones")
                                            setSelectedMember(null)
                                        }}
                                        className="w-full py-2.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Calendar size={13} />
                                        <span>Convocar a Sala de Reuniones</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 3: FICHA DE PERFIL INSISTENTE (Cada 30 min)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {showProfilePrompt && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setShowProfilePrompt(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b0f1a] border-2 border-blue-500/50 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-3">
                                        <RealisticAvatar type="supervisor" size={40} showBadge={false} />
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">REGISTRO DE DATOS DEL PERFIL</h3>
                                            <p className="text-[10px] font-mono text-blue-400">Insistente cada 30 min • Piso de Ventas ATOMIC</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowProfilePrompt(false)} className="text-slate-400 hover:text-white p-1">
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
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Teléfono Celular *</label>
                                            <input
                                                value={profilePhone}
                                                onChange={e => setProfilePhone(e.target.value)}
                                                placeholder="+593 9..."
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-mono outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">¿Disponibilidad de Computadora? *</label>
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
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Horario Disponible en Ventas</label>
                                        <input
                                            value={profileSchedule}
                                            onChange={e => setProfileSchedule(e.target.value)}
                                            placeholder="08:00 - 17:00 / Horario Completo..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setProfileHasResume(!profileHasResume)}>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                                profileHasResume ? "bg-blue-500 border-blue-500" : "border-slate-600"
                                            }`}>
                                                {profileHasResume && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className="text-xs font-bold text-slate-200">Adjuntar Hoja de Vida (Opcional)</span>
                                        </div>

                                        {profileHasResume && (
                                            <input
                                                value={profileResumeUrl}
                                                onChange={e => setProfileResumeUrl(e.target.value)}
                                                placeholder="Enlace a tu CV en Drive o PDF..."
                                                className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                                    <button
                                        onClick={() => {
                                            localStorage.setItem("atomic_profile_prompt_ts", Date.now().toString())
                                            setShowProfilePrompt(false)
                                        }}
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
                                        <span>Guardar en el Sistema</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 4: PERSONALIZACIÓN DE AVATAR (ESTILO CARLOS)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {showAvatarModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setShowAvatarModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b0f1a] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-3">
                                        <RealisticAvatar type={myAvatarType} size={44} showBadge={false} />
                                        <div>
                                            <h3 className="text-xs font-black text-white uppercase tracking-wider">Tu Avatar Realista</h3>
                                            <p className="text-[9px] font-mono text-cyan-400">Identidad en el piso de ventas</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAvatarModal(false)} className="text-slate-400 hover:text-white p-1">
                                        <X size={15} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Seleccionar Tipo de Personaje</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: "carlos", label: "Carlos (Ejecutivo VIP)", type: "carlos" as const },
                                                { id: "ceo", label: "Dirección (CEO)", type: "ceo" as const },
                                                { id: "ventas", label: "Asesora Comercial", type: "ventas" as const },
                                                { id: "coordinador", label: "Coordinador", type: "coordinador" as const },
                                                { id: "supervisor", label: "Supervisor QC", type: "supervisor" as const },
                                                { id: "edicion", label: "Multimedia 4K", type: "edicion" as const }
                                            ].map(av => (
                                                <button
                                                    key={av.id}
                                                    onClick={() => setMyAvatarType(av.type)}
                                                    className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                                                        myAvatarType === av.type ? "bg-cyan-500/20 border-cyan-500 text-cyan-200" : "bg-slate-900 border-slate-800 text-slate-400"
                                                    }`}
                                                >
                                                    <RealisticAvatar type={av.type} size={28} showBadge={false} />
                                                    <span className="text-[10px] font-bold leading-tight">{av.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowAvatarModal(false)}
                                        className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                                    >
                                        <Check size={13} />
                                        <span>Guardar Avatar Realista</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                PANEL DESLIZANTE PARA DETALLES DE CADA SALA / DEPARTAMENTO
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeDept && (
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        transition={{ type: "spring", damping: 24, stiffness: 220 }}
                        className="absolute top-3 right-3 w-92 max-w-[94vw] bg-[#090d1a]/98 border border-slate-700 rounded-3xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden flex flex-col max-h-[calc(100%-1.5rem)]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">
                                    {activeDept === "visitas" ? "🛎️" : activeDept === "reuniones" ? "🤝" : activeDept === "ceo" ? "👑" : activeDept === "printer" ? "🖨️" : activeDept === "counseling" ? "🧠" : "🏢"}
                                </span>
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase">
                                        {activeDept === "visitas" ? "Sala de Visitas & Citas" : activeDept === "reuniones" ? "Sala de Reuniones Ejecutiva" : activeDept === "ceo" ? "Despacho Presidencial CEO" : activeDept === "printer" ? "Impresora de Cotizaciones" : activeDept === "counseling" ? "Consejero IA" : "Departamento Comercial"}
                                    </h4>
                                    <p className="text-[9px] font-mono text-slate-400">Piso de Ventas ATOMIC</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveDept(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                                <X size={15} />
                            </button>
                        </div>

                        {/* Contenido según el departamento */}
                        <div className="p-4 overflow-y-auto custom-scrollbar space-y-3 flex-1 text-xs">
                            
                            {/* SALA DE VISITAS */}
                            {activeDept === "visitas" && (
                                <div className="space-y-3">
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                                        <p className="font-bold text-amber-300 mb-1">🛎️ Adjuntar Cita Concretada</p>
                                        <p className="text-[10px] text-slate-400">Registra una visita para que el cliente aparezca esperando en recepción con notificación instantánea al equipo.</p>
                                    </div>

                                    <input
                                        value={newClientName}
                                        onChange={e => setNewClientName(e.target.value)}
                                        placeholder="Nombre del cliente..."
                                        className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-amber-500"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="time"
                                            value={newClientTime}
                                            onChange={e => setNewClientTime(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none"
                                        />
                                        <input
                                            value={newClientPhone}
                                            onChange={e => setNewClientPhone(e.target.value)}
                                            placeholder="Celular..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none"
                                        />
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={newClientPurpose}
                                        onChange={e => setNewClientPurpose(e.target.value)}
                                        placeholder="Motivo de la cita..."
                                        className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none resize-none"
                                    />

                                    <button
                                        onClick={handleCreateAppointment}
                                        disabled={!newClientName.trim() || isCreatingApt}
                                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-xl text-xs uppercase cursor-pointer"
                                    >
                                        {isCreatingApt ? "Guardando..." : "Guardar Cita & Notificar"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            const txt = `🔔 *CITA CONCRETADA EN OFICINA*\nCliente: ${newClientName || "Carlos Mendoza"}\nHora: ${newClientTime}\nMotivo: ${newClientPurpose || "Consulta de sistemas"}`
                                            window.open(getWAUrl(defaultWhatsApp, txt), "_blank")
                                        }}
                                        className="w-full py-2 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                                    >
                                        <Phone size={12} />
                                        <span>Notificar a Coordinación por WhatsApp</span>
                                    </button>
                                </div>
                            )}

                            {/* IMPRESORA */}
                            {activeDept === "printer" && (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Cotizaciones Recientes</p>
                                    {printerQuotes.map(q => (
                                        <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">{q.quoteNumber}</span>
                                                <span className="text-emerald-400 font-black">${q.total?.toFixed(2)}</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-white truncate">{q.clientName}</p>
                                            <button
                                                onClick={() => handleDownloadFromPrinter(q)}
                                                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5"
                                            >
                                                <Printer size={11} />
                                                <span>Imprimir Propuesta PDF</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CONSEJERO IA */}
                            {activeDept === "counseling" && (
                                <div className="space-y-3 flex flex-col h-full">
                                    <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                                        {counselorMsgs.map((m, i) => (
                                            <div key={i} className={`p-2.5 rounded-2xl text-xs ${m.sender === "user" ? "bg-teal-600/30 text-teal-100 ml-6" : "bg-slate-900 text-slate-200 mr-6 border border-slate-800"}`}>
                                                {m.text}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            value={counselorInput}
                                            onChange={e => setCounselorInput(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && handleSendCounselor()}
                                            placeholder="Escribe tu consulta..."
                                            className="flex-1 bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none"
                                        />
                                        <button onClick={handleSendCounselor} className="p-2 bg-teal-600 text-white rounded-xl">
                                            <Send size={13} />
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
