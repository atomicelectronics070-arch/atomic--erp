"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Building2, Users, Calendar, Phone, MapPin, Briefcase,
    ShieldCheck, Clock, Send, Printer, UserCheck, Trash2,
    X, Check, AlertCircle, Sparkles, MessageSquare, ChevronRight,
    Search, ZoomIn, ZoomOut, Maximize2, Minimize2, CheckCircle2,
    Sliders, Radio, Laptop, Bell, Plus, FileText, ArrowUpRight
} from "lucide-react"
import { generateAtomicUnifiedProposalPDF } from "@/lib/pdf/quotePdfGenerator"

interface Props {
    currentModule?: string
    session?: any
    recentQuotes?: any[]
}

interface Hotspot {
    id: string
    title: string
    subtitle: string
    category: "visitas" | "reuniones" | "ceo" | "ventas" | "coordinacion" | "supervision" | "impresora" | "cartelera"
    x: number // percentage
    y: number // percentage
    person?: {
        name: string
        role: string
        image: string
        status: "waiting" | "online" | "busy"
        phone: string
        note: string
    }
}

const OFFICE_HOTSPOTS: Hotspot[] = [
    {
        id: "hs-visitas",
        title: "Sala de Visitas VIP",
        subtitle: "Carlos Mendoza en espera",
        category: "visitas",
        x: 77,
        y: 42,
        person: {
            name: "Carlos Mendoza",
            role: "Cliente VIP (CCTV & Smart Locks)",
            image: "/images/office/carlos.jpg",
            status: "waiting",
            phone: "+593998765432",
            note: "Esperando atención para propuesta de 16 Cámaras 4K y 4 Cerraduras Biométricas."
        }
    },
    {
        id: "hs-reuniones",
        title: "Sala de Reuniones Ejecutiva",
        subtitle: "Mesa de juntas y proyector 4K",
        category: "reuniones",
        x: 52,
        y: 34
    },
    {
        id: "hs-ceo",
        title: "Despacho Presidencial CEO",
        subtitle: "Ing. Santiago • Dirección General",
        category: "ceo",
        x: 23,
        y: 29,
        person: {
            name: "Ing. Santiago",
            role: "Director General & Fundador",
            image: "/images/office/ceo.jpg",
            status: "online",
            phone: "+593991112233",
            note: "Supervisando estrategia nacional de ventas y expansión 2026."
        }
    },
    {
        id: "hs-recepcion",
        title: "Recepción Atomic Electronics",
        subtitle: "Mostrador corporativo oficial",
        category: "coordinacion",
        x: 39,
        y: 72
    },
    {
        id: "hs-milorieta",
        title: "Estación de Asesoría Comercial",
        subtitle: "Milorieta en atención de propuestas",
        category: "ventas",
        x: 65,
        y: 81,
        person: {
            name: "Milorieta",
            role: "Asesora Senior de Ventas",
            image: "/images/office/milorieta.jpg",
            status: "online",
            phone: "+593993334455",
            note: "Estructurando cotizaciones de barreras vehiculares y control de acceso."
        }
    },
    {
        id: "hs-luis",
        title: "Coordinación Operativa & Despachos",
        subtitle: "Luis G. • Rutas y Logística",
        category: "coordinacion",
        x: 76,
        y: 76,
        person: {
            name: "Luis G.",
            role: "Coordinador de Operaciones",
            image: "/images/office/luis.jpg",
            status: "online",
            phone: "+593992223344",
            note: "Asignando cuadrillas técnicas y despachos a clientes en Quito y Guayaquil."
        }
    },
    {
        id: "hs-printer",
        title: "Centro de Impresión Rápida",
        subtitle: "Emisión de propuestas PDF",
        category: "impresora",
        x: 88,
        y: 78
    },
    {
        id: "hs-cartelera",
        title: "Cartelera Digital de la Empresa",
        subtitle: "Avisos generales y metas",
        category: "cartelera",
        x: 47,
        y: 62
    }
]

export default function VirtualOfficeWorkspace({ currentModule = "ventas", session, recentQuotes = [] }: Props) {
    const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
    const [fullscreen, setFullscreen] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)

    // Modals
    const [activeModal, setActiveModal] = useState<"atender_carlos" | "nueva_cita" | "reunion" | "perfil_prompt" | "impresora" | "cartelera" | null>(null)

    // Attention State for Carlos Mendoza
    const [attentionSummary, setAttentionSummary] = useState("")
    const [attentionNeed, setAttentionNeed] = useState("16 Cámaras IP 4K Dahua + 4 Cerraduras Biométricas con App Móvil")
    const [attentionUrgency, setAttentionUrgency] = useState("ALTA")
    const [attentionBudget, setAttentionBudget] = useState("3800")
    const [attentionRecontact, setAttentionRecontact] = useState(true)
    const [isSavingAttention, setIsSavingAttention] = useState(false)
    const [carlosAttended, setCarlosAttended] = useState(false)

    // New Client Appointment
    const [newClientName, setNewClientName] = useState("")
    const [newClientTime, setNewClientTime] = useState("12:30")
    const [newClientPhone, setNewClientPhone] = useState("")
    const [newClientPurpose, setNewClientPurpose] = useState("")
    const [isCreatingApt, setIsCreatingApt] = useState(false)

    // Meeting Room Suggestion
    const [meetingTopic, setMeetingTopic] = useState("")
    const [meetingUrgency, setMeetingUrgency] = useState("NORMAL")
    const [meetingLeader, setMeetingLeader] = useState("Luis G. (Coordinación)")

    // Hablar en Voz Alta (Chat en vivo)
    const [chatMessages, setChatMessages] = useState<any[]>([
        { id: "1", from: "Luis G.", role: "Coordinador", text: "¡Buenos días equipo! Carlos Mendoza ya se encuentra en la Sala de Visitas VIP esperando la propuesta de CCTV 4K.", time: "09:00" },
        { id: "2", from: "Milorieta", role: "Ventas", text: "Excelente Luis, ya tengo los precios actualizados de las cerraduras biométricas listos para el cierre.", time: "09:05" },
        { id: "3", from: "Supervisor QC", role: "Supervisión", text: "Asistencias registradas puntualmente a las 6:00 AM. Piso de ventas completamente operativo.", time: "09:12" }
    ])
    const [chatInput, setChatInput] = useState("")
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Cartelera Notes
    const [carteleraNotes, setCarteleraNotes] = useState<any[]>([
        { id: "cn-1", title: "Meta de Cierres de Hoy", message: "Prioridad número 1: Concretar la propuesta corporativa de Carlos Mendoza ($3,800) antes del corte de las 18:00.", from: "Luis G.", time: "09:15 AM" },
        { id: "cn-2", title: "Control de Calidad 6:00 AM", message: "Calificación de puntualidad de supervisión: 10/10 en el plano cartesiano por ingreso anticipado.", from: "Supervisor QC", time: "06:05 AM" }
    ])
    const [newNoteTitle, setNewNoteTitle] = useState("")
    const [newNoteMessage, setNewNoteMessage] = useState("")

    // Quotes for printer
    const [printerQuotes, setPrinterQuotes] = useState<any[]>(recentQuotes)

    // Profile Setup (Insistent every 30m)
    const [profileName, setProfileName] = useState(session?.user?.name || "Asesor Comercial")
    const [profilePhone, setProfilePhone] = useState("")
    const [profileCity, setProfileCity] = useState("Quito, Ecuador")
    const [profileSchedule, setProfileSchedule] = useState("08:00 - 17:00")
    const [profileHasPC, setProfileHasPC] = useState(true)
    const [profileHasResume, setProfileHasResume] = useState(false)
    const [profileResumeUrl, setProfileResumeUrl] = useState("")
    const [isSavingProfile, setIsSavingProfile] = useState(false)

    const defaultWhatsApp = "593992223344"
    const getWAUrl = (phone?: string, text?: string) => {
        const clean = (phone || defaultWhatsApp).replace(/\D/g, "")
        return `https://wa.me/${clean}?text=${encodeURIComponent(text || "Hola, me comunico desde la oficina de ATOMIC.")}`
    }

    // Lifecycle
    useEffect(() => {
        fetch("/api/office/notes").then(r => r.json()).then(d => { if (d.notes) setCarteleraNotes(d.notes) }).catch(() => {})
        if (recentQuotes.length === 0) {
            fetch("/api/quotes?limit=5").then(r => r.json()).then(d => { if (d.quotes) setPrinterQuotes(d.quotes.slice(0, 5)) }).catch(() => {})
        }
        fetch("/api/profile/setup").then(r => r.json()).then(d => {
            if (d.profile) {
                setProfileName(d.profile.fullName || session?.user?.name || "")
                setProfilePhone(d.profile.phone || "")
                setProfileCity(d.profile.city || "Quito, Ecuador")
                setProfileSchedule(d.profile.schedule || "08:00 - 17:00")
            }
        }).catch(() => {})

        const lastPrompt = localStorage.getItem("atomic_profile_prompt_ts")
        const now = Date.now()
        if (!lastPrompt || now - parseInt(lastPrompt) > 30 * 60 * 1000) {
            const timer = setTimeout(() => setActiveModal("perfil_prompt"), 2500)
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
            from: profileName.split(" ")[0] || "Tú",
            role: "Ventas",
            text: chatInput.trim(),
            time: timeStr
        }])
        setChatInput("")
    }

    const handleSaveAttention = async () => {
        setIsSavingAttention(true)
        try {
            await fetch("/api/supervision/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "ATTEND_CLIENT",
                    payload: {
                        appointmentId: "apt-carlos",
                        summary: attentionSummary || "Atención presencial exitosa en la Sala de Visitas VIP.",
                        need: attentionNeed,
                        urgency: attentionUrgency,
                        budget: attentionBudget,
                        recontact: attentionRecontact
                    }
                })
            })
            setCarlosAttended(true)
            setActiveModal(null)
            setSelectedHotspot(null)
            alert("✅ ESTADO DE ATENCIÓN GUARDADO: Carlos Mendoza registrado como atendido y propuesta registrada en el ERP.")
        } catch (e) {
            console.error(e)
        } finally {
            setIsSavingAttention(false)
        }
    }

    const handleCreateAppointment = async () => {
        if (!newClientName.trim()) return
        setIsCreatingApt(true)
        try {
            await fetch("/api/supervision/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "CREATE_APPOINTMENT",
                    payload: {
                        clientName: newClientName,
                        scheduledTime: newClientTime,
                        scheduledDate: new Date().toISOString().split("T")[0],
                        purpose: newClientPurpose || "Cotización de seguridad electrónica",
                        phone: newClientPhone
                    }
                })
            })
            alert(`🔔 Cita de ${newClientName} agendada exitosamente. Campanazo de notificación enviado a todos.`)
            setNewClientName("")
            setNewClientPurpose("")
            setNewClientPhone("")
            setActiveModal(null)
        } catch (e) {
            console.error(e)
        } finally {
            setIsCreatingApt(false)
        }
    }

    const handleSaveProfile = async () => {
        setIsSavingProfile(true)
        try {
            await fetch("/api/profile/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: profileName,
                    phone: profilePhone,
                    hasComputer: profileHasPC,
                    city: profileCity,
                    schedule: profileSchedule,
                    hasResume: profileHasResume,
                    resumeUrl: profileResumeUrl
                })
            })
            localStorage.setItem("atomic_profile_prompt_ts", Date.now().toString())
            setActiveModal(null)
        } catch (e) {
            console.error(e)
        } finally {
            setIsSavingProfile(false)
        }
    }

    const handleDownloadProposal = async (q: any) => {
        try {
            const safeParseArray = (str: any) => { try { return Array.isArray(str) ? str : JSON.parse(str || "[]") } catch { return [] } }
            const parsedItems = safeParseArray(q.items)
            const rawSub = parsedItems.reduce((a: number, i: any) => a + i.quantity * i.unitPrice, 0)
            const tax = rawSub * 0.15
            await generateAtomicUnifiedProposalPDF({
                quoteNumber: q.quoteNumber, clientName: q.clientName || "Carlos Mendoza",
                clientPhone: q.clientPhone || "", clientCity: q.city || "Quito",
                clientEmail: q.clientEmail || "", quoteSubject: q.quoteSubject || "Propuesta CCTV 4K & Seguridad",
                advisorName: session?.user?.name?.toUpperCase() || "ATOMIC",
                items: parsedItems, subtotal: rawSub, taxAmount: tax, taxPercent: 15,
                discountAmount: 0, total: q.total || rawSub + tax,
                deliveryAddress: q.deliveryAddress || ""
            })
        } catch (e) { console.error(e) }
    }

    return (
        <div className={`relative ${fullscreen ? "fixed inset-0 z-[999] bg-[#020409]" : "w-full"} select-none font-sans text-slate-100`}>
            
            {/* ── BARRA SUPERIOR EJECUTIVA ───────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#080d1a]/95 border-b border-slate-800 backdrop-blur-xl shadow-2xl relative z-30">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-black tracking-wider text-white uppercase">
                                SEDE CORPORATIVA ATOMIC ELECTRONICS
                            </h1>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                PISO DE VENTAS EN VIVO
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">
                            Render arquitectónico 3D fotorrealista • Departamentos independientes y avatares reales
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* Botón Agendar Cita */}
                    <button
                        onClick={() => setActiveModal("nueva_cita")}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                        <Plus size={13} />
                        <span>Agendar Cita</span>
                    </button>

                    {/* Botón Ficha Perfil (30 min) */}
                    <button
                        onClick={() => setActiveModal("perfil_prompt")}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                        <UserCheck size={13} className="text-blue-400" />
                        <span>Ficha Perfil (30m)</span>
                    </button>

                    {/* Controles de Zoom */}
                    <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1">
                        <button
                            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Reducir vista"
                        >
                            <ZoomOut size={13} />
                        </button>
                        <span className="text-[9px] font-mono text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
                        <button
                            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Aumentar vista"
                        >
                            <ZoomIn size={13} />
                        </button>
                    </div>

                    {/* Pantalla Completa */}
                    <button
                        onClick={() => setFullscreen(!fullscreen)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"
                        title="Alternar Pantalla Completa"
                    >
                        {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                </div>
            </div>

            {/* ── ESCENARIO ARQUITECTÓNICO 3D FOTORREALISTA ───────────── */}
            <div
                className="relative overflow-hidden bg-[#040711]"
                style={{ height: fullscreen ? "calc(100vh - 125px)" : "680px" }}
            >
                {/* Contenedor con Zoom suave */}
                <div
                    className="w-full h-full relative transition-transform duration-300 origin-center"
                    style={{ transform: `scale(${zoomLevel})` }}
                >
                    {/* Render Fotorrealista de la Sede Moderna de Atomic */}
                    <img
                        src="/images/office/modern_hq.jpg"
                        alt="Sede Corporativa Moderna de Atomic Electronics"
                        className="w-full h-full object-cover object-center pointer-events-none select-none"
                    />

                    {/* Gradiente sutil para integración */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040711]/50 via-transparent to-transparent pointer-events-none" />

                    {/* ── HOTSPOTS ARQUITECTÓNICOS INTERACTIVOS ──────── */}
                    {OFFICE_HOTSPOTS.map(hs => {
                        const isCarlos = hs.id === "hs-visitas"
                        const isSelected = selectedHotspot?.id === hs.id

                        return (
                            <div
                                key={hs.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                            >
                                {/* Marcador / Pin arquitectónico */}
                                <motion.div
                                    whileHover={{ scale: 1.12 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedHotspot(hs)
                                        if (hs.category === "impresora") setActiveModal("impresora")
                                        else if (hs.category === "cartelera") setActiveModal("cartelera")
                                        else if (hs.category === "reuniones") setActiveModal("reunion")
                                        else if (isCarlos) setActiveModal("atender_carlos")
                                    }}
                                    className="cursor-pointer group flex flex-col items-center"
                                >
                                    {/* Carlos Mendoza esperando con badge pulsante */}
                                    {isCarlos && !carlosAttended && (
                                        <div className="mb-1 flex flex-col items-center animate-bounce">
                                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.8)] border border-amber-200 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                                                ⏱️ Carlos Mendoza (11:00 AM)
                                            </span>
                                        </div>
                                    )}

                                    {/* Icono / Avatar del punto de interés */}
                                    <div className="relative">
                                        {hs.person ? (
                                            <div className={`w-11 h-11 rounded-full p-0.5 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all ${
                                                isCarlos && !carlosAttended
                                                    ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950"
                                                    : "ring-2 ring-blue-400"
                                            }`}>
                                                <img
                                                    src={hs.person.image}
                                                    alt={hs.person.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-slate-950 ${
                                                    hs.person.status === "waiting" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                                                }`} />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-2xl bg-slate-950/90 border-2 border-blue-400/80 flex items-center justify-center text-lg shadow-[0_0_18px_rgba(59,130,246,0.6)] backdrop-blur-md group-hover:border-white">
                                                {hs.category === "reuniones" ? "🤝" : hs.category === "impresora" ? "🖨️" : hs.category === "cartelera" ? "📌" : "🏢"}
                                            </div>
                                        )}
                                    </div>

                                    {/* Etiqueta flotante con nombre de la sala */}
                                    <div className="mt-1 px-2.5 py-0.5 rounded-lg bg-slate-950/95 border border-slate-700/80 text-[9px] font-bold text-white shadow-xl whitespace-nowrap group-hover:border-blue-400 transition-colors">
                                        {hs.title}
                                    </div>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>

                {/* ── WIDGET INFERIOR: INTERCOMUNICADOR "HABLAR EN VOZ ALTA" ── */}
                <div className="absolute bottom-3 left-4 w-92 max-w-[44vw] bg-[#090e1d]/90 border border-slate-800 rounded-2xl p-3 backdrop-blur-xl shadow-2xl z-20 flex flex-col h-44">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-cyan-400">📢</span>
                            <span className="text-xs font-black text-white uppercase tracking-wider">HABLAR EN VOZ ALTA</span>
                            <span className="text-[9px] font-mono text-slate-400">(Intercomunicador general)</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1 text-[11px]">
                        {chatMessages.map(m => (
                            <div key={m.id} className="leading-snug">
                                <span className="font-bold text-cyan-300 mr-1.5">{m.from}:</span>
                                <span className="text-slate-200">{m.text}</span>
                                <span className="text-[8.5px] font-mono text-slate-500 ml-1.5">{m.time}</span>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="flex gap-1.5 pt-1.5 border-t border-slate-800">
                        <input
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSendPublicChat()}
                            placeholder="Escribe para hablar en voz alta a toda la oficina..."
                            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-1 text-xs outline-none focus:border-cyan-400 font-sans"
                        />
                        <button
                            onClick={handleSendPublicChat}
                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
                        >
                            <Send size={12} />
                        </button>
                    </div>
                </div>

                {/* ── WIDGET INFERIOR DERECHO: ACCIONES RÁPIDAS ─────────── */}
                <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-[#090e1d]/90 border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl z-20">
                    <button
                        onClick={() => setActiveModal("atender_carlos")}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <span>🛎️</span>
                        <span>{carlosAttended ? "Cita Atendida ✓" : "Atender a Carlos"}</span>
                    </button>

                    <button
                        onClick={() => setActiveModal("impresora")}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <span>🖨️</span>
                        <span>Imprimir PDF</span>
                    </button>

                    <button
                        onClick={() => setActiveModal("cartelera")}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <span>📌</span>
                        <span>Cartelera</span>
                    </button>

                    <button
                        onClick={() => setActiveModal("reunion")}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-400 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <span>🤝</span>
                        <span>Reunión</span>
                    </button>
                </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 1: ATENDER A CARLOS MENDOZA (FORMULARIO DE ATENCIÓN)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "atender_carlos" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.93 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4">
                                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-full ring-2 ring-amber-400 overflow-hidden shadow-lg">
                                            <img src="/images/office/carlos.jpg" alt="Carlos Mendoza" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded uppercase">
                                                Cliente VIP • Sala de Visitas
                                            </span>
                                            <h3 className="text-base font-black text-white mt-0.5">Carlos Mendoza</h3>
                                            <p className="text-[10px] font-mono text-slate-400">Hora de Cita: 11:00 AM • Cel: +593 99 876 5432</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Resumen de la Atención *</label>
                                        <textarea
                                            rows={2}
                                            value={attentionSummary}
                                            onChange={e => setAttentionSummary(e.target.value)}
                                            placeholder="Detalla qué se acordó durante la sesión presencial con Carlos..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs resize-none outline-none focus:border-amber-400 font-sans"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Requerimiento Concreto</label>
                                        <input
                                            value={attentionNeed}
                                            onChange={e => setAttentionNeed(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-amber-400"
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
                                                <option value="ALTA">🔴 Alta (Cierre hoy)</option>
                                                <option value="MEDIA">🟡 Media (Esta semana)</option>
                                                <option value="BAJA">🟢 Baja (Exploratorio)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Presupuesto Estimado ($)</label>
                                            <input
                                                value={attentionBudget}
                                                onChange={e => setAttentionBudget(e.target.value)}
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

                                    <div className="space-y-2 pt-2">
                                        <button
                                            onClick={handleSaveAttention}
                                            disabled={isSavingAttention}
                                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                                        >
                                            {isSavingAttention ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                            <span>Guardar Estado de Atención & Cerrar Cita</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                const txt = `🔔 *ATENCIÓN CARLOS MENDOZA*\nSe concretó reunión presencial en la Sala de Visitas VIP.\nPresupuesto: $${attentionBudget}\nRequerimiento: ${attentionNeed}`
                                                window.open(getWAUrl(defaultWhatsApp, txt), "_blank")
                                            }}
                                            className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Phone size={13} />
                                            <span>Notificar Acuerdo a Coordinación por WhatsApp</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 2: AGENDAR NUEVA CITA DE CLIENTE
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "nueva_cita" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-slate-700 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-blue-400" />
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider">AGENDAR VISITA DE CLIENTE</h3>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        value={newClientName}
                                        onChange={e => setNewClientName(e.target.value)}
                                        placeholder="Nombre del Cliente..."
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs outline-none focus:border-blue-500"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="time"
                                            value={newClientTime}
                                            onChange={e => setNewClientTime(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs font-mono outline-none"
                                        />
                                        <input
                                            value={newClientPhone}
                                            onChange={e => setNewClientPhone(e.target.value)}
                                            placeholder="Celular..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs font-mono outline-none"
                                        />
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={newClientPurpose}
                                        onChange={e => setNewClientPurpose(e.target.value)}
                                        placeholder="Motivo de la visita..."
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs outline-none resize-none"
                                    />
                                    <button
                                        onClick={handleCreateAppointment}
                                        disabled={isCreatingApt || !newClientName.trim()}
                                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl text-xs uppercase cursor-pointer"
                                    >
                                        {isCreatingApt ? "Guardando..." : "Confirmar Cita & Notificar Equipo"}
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
                {activeModal === "perfil_prompt" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-blue-500/50 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <UserCheck size={20} className="text-blue-400" />
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">FICHA DE DATOS DEL PERFIL</h3>
                                            <p className="text-[10px] font-mono text-blue-400">Recordatorio periódico cada 30 minutos</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
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
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Horario Disponible</label>
                                        <input
                                            value={profileSchedule}
                                            onChange={e => setProfileSchedule(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                                    <button
                                        onClick={() => {
                                            localStorage.setItem("atomic_profile_prompt_ts", Date.now().toString())
                                            setActiveModal(null)
                                        }}
                                        className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                                    >
                                        Recordarme en 30 min
                                    </button>

                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSavingProfile || !profileName.trim()}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs uppercase"
                                    >
                                        {isSavingProfile ? "Guardando..." : "Guardar en el Sistema"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 4: IMPRESORA DE COTIZACIONES
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "impresora" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-cyan-500/50 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Printer size={18} className="text-cyan-400" />
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider">CENTRO DE IMPRESIÓN DE PROPUESTAS</h3>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                                    {printerQuotes.map(q => (
                                        <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">{q.quoteNumber}</span>
                                                <span className="text-emerald-400 font-black">${q.total?.toFixed(2)}</span>
                                            </div>
                                            <p className="text-[11px] font-bold text-white truncate">{q.clientName}</p>
                                            <button
                                                onClick={() => handleDownloadProposal(q)}
                                                className="w-full py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow"
                                            >
                                                <FileText size={12} />
                                                <span>Imprimir / Descargar Propuesta PDF</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 5: CARTELERA DE LA EMPRESA
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "cartelera" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-slate-700 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 text-lg">📌</span>
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider">CARTELERA OFICIAL DE ATOMIC</h3>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                                    {carteleraNotes.map(n => (
                                        <div key={n.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 relative group">
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="font-bold text-amber-300">{n.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 font-mono">{n.time}</span>
                                                    <button
                                                        onClick={() => setCarteleraNotes(prev => prev.filter(x => x.id !== n.id))}
                                                        className="text-slate-600 hover:text-rose-400 transition-colors"
                                                        title="Eliminar aviso (Papelera)"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-200">{n.message}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                                    <input
                                        value={newNoteTitle}
                                        onChange={e => setNewNoteTitle(e.target.value)}
                                        placeholder="Título del anuncio..."
                                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 text-xs outline-none focus:border-amber-400"
                                    />
                                    <textarea
                                        rows={2}
                                        value={newNoteMessage}
                                        onChange={e => setNewNoteMessage(e.target.value)}
                                        placeholder="Detalle del anuncio..."
                                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 text-xs outline-none resize-none"
                                    />
                                    <button
                                        onClick={() => {
                                            if (!newNoteMessage.trim()) return
                                            setCarteleraNotes(prev => [{
                                                id: Date.now().toString(),
                                                title: newNoteTitle || "Aviso Oficial",
                                                message: newNoteMessage,
                                                time: "Justo ahora"
                                            }, ...prev])
                                            setNewNoteTitle("")
                                            setNewNoteMessage("")
                                        }}
                                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase"
                                    >
                                        Publicar Anuncio en Cartelera
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 6: PROGRAMAR REUNIÓN EN LA SALA DE JUNTAS
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "reunion" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Users size={18} className="text-indigo-400" />
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider">SALA DE REUNIONES EJECUTIVA</h3>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        value={meetingTopic}
                                        onChange={e => setMeetingTopic(e.target.value)}
                                        placeholder="Tema o asunto de la reunión..."
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs outline-none focus:border-indigo-400"
                                    />
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {["URGENTE", "NORMAL", "PLANIFICADA"].map(u => (
                                            <button
                                                key={u}
                                                type="button"
                                                onClick={() => setMeetingUrgency(u)}
                                                className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                                    meetingUrgency === u ? "bg-indigo-500/20 border-indigo-500 text-indigo-300" : "bg-slate-900 border-slate-800 text-slate-400"
                                                }`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => {
                                            alert(`🔔 Reunión sobre "${meetingTopic || 'Estrategia Comercial'}" convocada exitosamente en la Sala de Juntas.`)
                                            setActiveModal(null)
                                        }}
                                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl text-xs uppercase"
                                    >
                                        Convocar a Sala de Reuniones
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    )
}
