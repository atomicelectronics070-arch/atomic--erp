"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users, ShieldCheck, Settings, Plus, Trash2, Check, X, Phone,
    MessageSquare, ExternalLink, Sparkles, Monitor, Wrench, Code2,
    Video, Briefcase, Coffee, Search, UserPlus, Crown, Laptop,
    CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react"

interface Props {
    currentModule?: string
    session?: any
    recentQuotes?: any[]
}

interface TeamMember {
    id: string
    name: string
    roleName: string
    category: "ceo" | "supervision" | "coordinacion" | "jefe_tecnico" | "software" | "edicion" | "taller" | "ventas"
    email?: string
    phone?: string
    status: "online" | "busy" | "meeting"
    deskColor: string
    x: number // percentage
    y: number // percentage
    spriteType: "executive" | "tech" | "creative" | "sales" | "taller"
}

interface SystemUser {
    id: string
    name: string
    email: string
    role: string
}

export default function VirtualOfficeWorkspace({ currentModule = "ventas" }: Props) {
    const { data: session } = useSession()
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
    const [isManageModalOpen, setIsManageModalOpen] = useState(false)
    const [systemUsers, setSystemUsers] = useState<SystemUser[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [searchSeller, setSearchSeller] = useState("")

    // Current 3 sales advisors assigned to desks
    const [activeSellers, setActiveSellers] = useState<Array<{ id: string; name: string; email?: string }>>([
        { id: "s1", name: "Ana Jessica López", email: "anitalopez2392@gmail.com" },
        { id: "s2", name: "Vanessa Zurita", email: "vaneshitajaky1694@gmail.com" },
        { id: "s3", name: "Yolanda Chango", email: "yoly91ch@gmail.com" }
    ])

    // Load saved sellers from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("atomic_office_sellers")
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setActiveSellers(parsed)
                }
            }
        } catch (e) {}
    }, [])

    // Fetch real system users when manage modal opens
    const fetchUsers = async () => {
        setLoadingUsers(true)
        try {
            const res = await fetch("/api/users")
            if (res.ok) {
                const data = await res.json()
                if (Array.isArray(data)) {
                    setSystemUsers(data)
                }
            }
        } catch (e) {
            console.error("Error fetching users for office:", e)
        } finally {
            setLoadingUsers(false)
        }
    }

    const openManageModal = () => {
        setIsManageModalOpen(true)
        fetchUsers()
    }

    const handleAddSeller = (user: SystemUser) => {
        if (activeSellers.length >= 3) {
            alert("⚠️ La oficina de ventas tiene un máximo de 3 puestos de asesores. Remueve uno primero para añadir a otro.")
            return
        }
        if (activeSellers.some(s => s.id === user.id || s.name === user.name)) {
            alert("⚠️ Este asesor ya tiene un puesto asignado en la oficina.")
            return
        }
        const updated = [...activeSellers, { id: user.id, name: user.name || user.email, email: user.email }]
        setActiveSellers(updated)
        localStorage.setItem("atomic_office_sellers", JSON.stringify(updated))
    }

    const handleRemoveSeller = (sellerId: string) => {
        const updated = activeSellers.filter(s => s.id !== sellerId)
        setActiveSellers(updated)
        localStorage.setItem("atomic_office_sellers", JSON.stringify(updated))
    }

    // Role verification for management button
    const userRole = session?.user?.role || ""
    const userEmail = session?.user?.email || ""
    const canManageSellers = 
        userRole === "ADMIN" || 
        userRole === "COORDINATOR" || 
        userRole === "MANAGEMENT" || 
        userEmail.includes("supervisor") || 
        userEmail.includes("coordinacion") || 
        userEmail.includes("administrador")

    // The fixed roles required: CEO, TALLER, JEFE TECNICO, SUPERVISOR, COORDINADOR, EDICION, SOFTWARE
    const coreTeam: TeamMember[] = [
        {
            id: "m-ceo",
            name: "Ing. Santiago (CEO)",
            roleName: "Dirección General & Estrategia",
            category: "ceo",
            email: "ceo@atomic.com.ec",
            phone: "+593 96 322 6319",
            status: "online",
            deskColor: "#ef4444",
            x: 62,
            y: 18,
            spriteType: "executive"
        },
        {
            id: "m-supervision",
            name: "Supervisor de Calidad",
            roleName: "Supervisión Operativa & CRM",
            category: "supervision",
            email: "supervisor@atomic.com.ec",
            phone: "+593 96 904 3453",
            status: "online",
            deskColor: "#06b6d4",
            x: 42,
            y: 18,
            spriteType: "executive"
        },
        {
            id: "m-coord",
            name: "Coordinación Operativa",
            roleName: "Coordinación & Despachos",
            category: "coordinacion",
            email: "atomic@industrias.ec",
            phone: "+593 96 322 6319",
            status: "online",
            deskColor: "#10b981",
            x: 82,
            y: 18,
            spriteType: "executive"
        },
        {
            id: "m-edicion",
            name: "Atomic Media",
            roleName: "Edición Audiovisual & Marketing",
            category: "edicion",
            email: "atomic@media.com",
            status: "busy",
            deskColor: "#8b5cf6",
            x: 52,
            y: 52,
            spriteType: "creative"
        },
        {
            id: "m-jefe-tech",
            name: "Tech Man (Jefe Técnico)",
            roleName: "Jefe de Soporte & Laboratorio",
            category: "jefe_tecnico",
            email: "atomic@techman.com",
            status: "online",
            deskColor: "#3b82f6",
            x: 40,
            y: 82,
            spriteType: "tech"
        },
        {
            id: "m-software",
            name: "Soft Man (Software)",
            roleName: "Desarrollo & Arquitectura ERP",
            category: "software",
            email: "atomic@softman.com",
            status: "online",
            deskColor: "#0284c7",
            x: 60,
            y: 82,
            spriteType: "tech"
        },
        {
            id: "m-taller",
            name: "Taller Técnico",
            roleName: "Mantenimiento & Reparación",
            category: "taller",
            email: "taller@atomic.com.ec",
            status: "online",
            deskColor: "#d97706",
            x: 80,
            y: 82,
            spriteType: "taller"
        }
    ]

    // 3 Sales Advisors placed in the central-right sales bullpen
    const salesPositions = [
        { x: 38, y: 52 },
        { x: 68, y: 52 },
        { x: 82, y: 52 }
    ]

    const salesMembers: TeamMember[] = activeSellers.slice(0, 3).map((seller, idx) => ({
        id: `m-ventas-${seller.id || idx}`,
        name: seller.name,
        roleName: `Asesor Comercial ${idx + 1}`,
        category: "ventas",
        email: seller.email,
        status: idx === 0 ? "online" : idx === 1 ? "busy" : "online",
        deskColor: idx === 0 ? "#10b981" : idx === 1 ? "#f59e0b" : "#06b6d4",
        x: salesPositions[idx]?.x || 50,
        y: salesPositions[idx]?.y || 52,
        spriteType: "sales"
    }))

    const allMembers = [...coreTeam, ...salesMembers]

    return (
        <div className="w-full rounded-3xl bg-[#12151d] border border-slate-800 shadow-2xl overflow-hidden font-sans text-white select-none">
            
            {/* ── BARRA SUPERIOR DE CONTROL DE LA OFICINA ─────────────────── */}
            <div className="px-6 py-4 bg-[#0d1017] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                        <Users size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-black text-sm uppercase tracking-wider text-white">
                                Oficina Virtual Remota • ATOMIC HQ
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> EN VIVO
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Puestos de mando corporativo y asesores de ventas activos en tiempo real
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* Botón Exclusivo para Supervisor, Coordinador y CEO */}
                    {canManageSellers && (
                        <button
                            onClick={openManageModal}
                            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40 transition-all active:scale-95"
                            title="Añadir o remover los 3 asesores de ventas en la oficina"
                        >
                            <Settings size={14} />
                            <span>Gestionar Asesores en Oficina ({activeSellers.length}/3)</span>
                        </button>
                    )}

                    <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-400 flex items-center gap-2">
                        <span>👥 {allMembers.length} Personas</span>
                        <span>•</span>
                        <span className="text-emerald-400">8 Roles Oficiales</span>
                    </div>
                </div>
            </div>

            {/* ── ESCENARIO TOP-DOWN 2D (ESTILO GATHER.TOWN / IMAGEN REAL) ─── */}
            <div className="relative w-full h-[620px] overflow-hidden bg-[#b88c5d] select-none">
                
                {/* 1. SUELO: CORREDOR DE BALDOSAS GRISES CHECKERBOARD (A LA IZQUIERDA) */}
                <div 
                    className="absolute left-0 top-0 bottom-0 w-[24%] border-r-4 border-[#5a3e2b]"
                    style={{
                        backgroundColor: "#c5c9d1",
                        backgroundImage: `
                            linear-gradient(45deg, #a0a6b2 25%, transparent 25%), 
                            linear-gradient(-45deg, #a0a6b2 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #a0a6b2 75%), 
                            linear-gradient(-45deg, transparent 75%, #a0a6b2 75%)
                        `,
                        backgroundSize: "28px 28px",
                        backgroundPosition: "0 0, 0 14px, 14px -14px, -14px 0px"
                    }}
                >
                    {/* Comedor / Sala de estar lateral */}
                    <div className="absolute top-10 left-4 right-4 p-3 bg-[#6e462d] rounded-2xl border-2 border-[#422919] shadow-lg flex flex-col items-center gap-3">
                        <span className="text-[9px] font-black uppercase text-[#e9d2b8] tracking-widest flex items-center gap-1">
                            <Coffee size={12} /> Cafetería & Break
                        </span>
                        {/* Mesa de madera con sillas */}
                        <div className="w-16 h-28 bg-[#8d5836] rounded-xl border-2 border-[#4b2f1b] shadow flex flex-col justify-around items-center py-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/80" title="Taza de café" />
                            <div className="w-3 h-3 rounded-full bg-amber-400/90" title="Snack" />
                        </div>
                    </div>

                    {/* Planta decorativa en el pasillo */}
                    <div className="absolute bottom-16 left-6 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-800 shadow-md flex items-center justify-center text-xs">
                            🪴
                        </div>
                        <div className="w-5 h-4 bg-[#8b5a36] rounded-b-md border border-[#52331c] -mt-1" />
                    </div>
                </div>

                {/* 2. SUELO PRINCIPAL: PARQUET DE MADERA CÁLIDA (A LA DERECHA) */}
                <div 
                    className="absolute left-[24%] right-0 top-0 bottom-0"
                    style={{
                        backgroundColor: "#b88c5d",
                        backgroundImage: `
                            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: "80px 30px"
                    }}
                >
                    {/* ALFOMBRA ROJA EJECUTIVA EN DIRECCIÓN (SUPERIOR) */}
                    <div className="absolute top-5 left-[34%] w-[38%] h-24 bg-[#991b1b]/80 rounded-2xl border border-[#7f1d1d] shadow-inner" />

                    {/* ALFOMBRA DE MARKETING EN EL CENTRO */}
                    <div className="absolute top-[44%] left-[28%] w-[42%] h-28 bg-[#1e293b]/40 rounded-2xl border border-dashed border-[#475569]/50" />

                    {/* RÓTULOS DE ÁREAS IMPRESOS EN EL SUELO (IGUAL A LA IMAGEN) */}
                    <div className="absolute top-2 left-6 text-[#523521] font-black text-xs uppercase tracking-widest opacity-80">
                        🏛️ Alta Dirección & Supervisión
                    </div>

                    <div className="absolute top-[38%] left-[45%] text-[#4b3322] font-black text-base uppercase tracking-widest opacity-70">
                        Marketing & Ventas
                    </div>

                    <div className="absolute bottom-4 left-6 text-[#523521] font-black text-xs uppercase tracking-widest opacity-80">
                        🛠️ Ingeniería, Software & Taller Técnico
                    </div>

                    {/* SILLÓN BALÓN DE BALONCESTO (DELUXE - COMO EN LA FOTO DEL CLIENTE) */}
                    <div 
                        className="absolute top-[48%] left-[16%] flex flex-col items-center group cursor-pointer"
                        title="Sillón Balón de Baloncesto ATOMIC Relax"
                    >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 border-2 border-black shadow-xl relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                            {/* Líneas de baloncesto */}
                            <div className="absolute inset-0 border-t-2 border-b-2 border-black/80 my-auto h-0" />
                            <div className="absolute inset-0 border-l-2 border-r-2 border-black/80 mx-auto w-0" />
                            <div className="absolute w-12 h-12 rounded-full border border-black/70" />
                        </div>
                        <span className="text-[8px] font-black text-[#4b301c] bg-[#e4be95] px-1.5 py-0.2 rounded-full mt-1 border border-[#8d5e39]">
                            Lounge
                        </span>
                    </div>

                    {/* PLANTA PALMERA CORPORATIVA EN MACETA BLANCA */}
                    <div className="absolute top-4 left-4 flex flex-col items-center">
                        <div className="text-3xl filter drop-shadow-md select-none">🌴</div>
                        <div className="w-6 h-5 bg-white rounded-b-lg border-2 border-slate-300 shadow -mt-2" />
                    </div>

                    {/* FLORERO ELEGANTE DE MESA */}
                    <div className="absolute top-8 right-8 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-base shadow">
                            💐
                        </div>
                    </div>

                    {/* ── RENDER DE CADA PUESTO DE TRABAJO Y PERSONAJE (2D TOP-DOWN) ── */}
                    {allMembers.map(member => {
                        const isSelected = selectedMember?.id === member.id
                        return (
                            <div
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                                style={{ left: `${member.x}%`, top: `${member.y}%` }}
                            >
                                {/* 🏷️ ETIQUETA FLOTANTE CON ESTADO Y NOMBRE (IGUAL A LA IMAGEN) */}
                                <div className="flex flex-col items-center mb-1 transition-transform group-hover:-translate-y-1">
                                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-lg border flex items-center gap-1.5 whitespace-nowrap ${
                                        member.status === "online" 
                                            ? "bg-slate-950/90 text-white border-emerald-500/60 shadow-emerald-950/40" 
                                            : "bg-slate-950/90 text-white border-amber-500/60 shadow-amber-950/40"
                                    }`}>
                                        <span className={`w-2 h-2 rounded-full ${member.status === "online" ? "bg-emerald-400" : "bg-rose-400"} animate-pulse`} />
                                        <span className="font-bold">{member.name}</span>
                                    </div>
                                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#3d2716] font-mono mt-0.2">
                                        {member.roleName}
                                    </span>
                                </div>

                                {/* 🧑‍💼 SPRITE DEL PERSONAJE Y ESCRITORIO CON MONITORES */}
                                <div className="relative flex flex-col items-center">
                                    
                                    {/* CABEZA / AVATAR DEL PERSONAJE EN SU SILLA */}
                                    <div className="relative z-10 w-9 h-9 rounded-full bg-slate-900 border-2 border-white/80 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                                        {member.spriteType === "executive" ? (
                                            <span className="text-base">🧑‍💼</span>
                                        ) : member.spriteType === "creative" ? (
                                            <span className="text-base">🎨</span>
                                        ) : member.spriteType === "tech" ? (
                                            <span className="text-base">👨‍💻</span>
                                        ) : member.spriteType === "taller" ? (
                                            <span className="text-base">🔧</span>
                                        ) : (
                                            <span className="text-base">💼</span>
                                        )}
                                    </div>

                                    {/* SILLA ERGONÓMICA DE OFICINA DETRÁS */}
                                    <div className="w-10 h-7 rounded-t-xl bg-[#1e293b] border border-slate-700 -mt-6 z-0 shadow" />

                                    {/* 🖥️ ESCRITORIO CORPORATIVO CON PANTALLAS */}
                                    <div 
                                        className="w-20 h-11 rounded-lg border-2 shadow-xl flex items-center justify-around px-1.5 mt-0.5 relative z-10"
                                        style={{ 
                                            backgroundColor: "#222734",
                                            borderColor: member.deskColor
                                        }}
                                    >
                                        {/* Monitor 1 (Glow pantalla encendida) */}
                                        <div className="w-7 h-4 rounded bg-sky-400 border border-white/60 shadow-[0_0_8px_rgba(56,189,248,0.8)] flex items-center justify-center">
                                            <div className="w-4 h-0.5 bg-white/60 rounded-full" />
                                        </div>

                                        {/* Teclado */}
                                        <div className="w-3 h-2 bg-slate-800 rounded-xs border border-slate-600" />

                                        {/* Monitor 2 */}
                                        <div className="w-7 h-4 rounded bg-cyan-300 border border-white/60 shadow-[0_0_8px_rgba(34,211,238,0.8)] flex items-center justify-center">
                                            <div className="w-4 h-0.5 bg-slate-900 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── MODAL: FICHA / CONTACTO RÁPIDO DEL MIEMBRO DE LA OFICINA ── */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-white">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div 
                                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-base shadow"
                                    style={{ backgroundColor: selectedMember.deskColor }}
                                >
                                    {selectedMember.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">{selectedMember.name}</h4>
                                    <p className="text-[10px] text-slate-400 uppercase font-mono">{selectedMember.roleName}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedMember(null)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-[11px]">Estado Operativo:</span>
                                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Conectado en Puesto
                                    </span>
                                </div>
                                {selectedMember.email && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-[11px]">Correo:</span>
                                        <span className="font-mono text-slate-300 truncate max-w-[180px]">{selectedMember.email}</span>
                                    </div>
                                )}
                                {selectedMember.phone && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-[11px]">Teléfono:</span>
                                        <span className="font-mono text-cyan-300">{selectedMember.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            {selectedMember.phone ? (
                                <a
                                    href={`https://wa.me/${selectedMember.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(selectedMember.name)},%20te%20escribo%20desde%20la%20Oficina%20Virtual%20Atomic.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
                                >
                                    <MessageSquare size={14} /> <span>WhatsApp</span>
                                </a>
                            ) : (
                                <button
                                    onClick={() => alert(`Enviando notificación interna a ${selectedMember.name}...`)}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                                >
                                    <Phone size={14} /> <span>Llamar / Notificar</span>
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedMember(null)}
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL EXCLUSIVO (SUPERVISOR, COORDINADOR Y CEO): GESTIONAR VENDEDORES ── */}
            {isManageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
                        
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    <Settings size={18} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-wider text-white">
                                        Gestión de Asesores de Ventas en Oficina
                                    </h3>
                                    <p className="text-[10px] text-slate-400">
                                        Exclusivo para Supervisor, Coordinador y CEO • Máximo 3 asesores visibles
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsManageModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* 1. LOS 3 PUESTOS ACTUALES */}
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                                Puestos de Asesores Ocupados ({activeSellers.length}/3):
                            </label>

                            <div className="grid grid-cols-1 gap-2">
                                {[0, 1, 2].map((idx) => {
                                    const current = activeSellers[idx]
                                    return (
                                        <div 
                                            key={idx}
                                            className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                                    current ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-500 border border-slate-700"
                                                }`}>
                                                    #{idx + 1}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-xs text-white">
                                                        {current ? current.name : "— Puesto Libre / Sin Asignar —"}
                                                    </h5>
                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                        {current?.email || "Disponible para nuevo asesor"}
                                                    </p>
                                                </div>
                                            </div>

                                            {current && (
                                                <button
                                                    onClick={() => handleRemoveSeller(current.id)}
                                                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                                    title="Quitar asesor de la oficina"
                                                >
                                                    <Trash2 size={13} /> <span>Quitar</span>
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 2. SELECCIONAR Y AÑADIR DE LA LISTA DE USUARIOS DEL SISTEMA */}
                        {activeSellers.length < 3 && (
                            <div className="space-y-3 pt-2 border-t border-slate-800">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                        <UserPlus size={14} /> Seleccionar Asesor de la Lista del Sistema:
                                    </label>
                                    <button
                                        onClick={fetchUsers}
                                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                    >
                                        <RefreshCw size={11} className={loadingUsers ? "animate-spin" : ""} /> Recargar
                                    </button>
                                </div>

                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                                    <input 
                                        type="text"
                                        value={searchSeller}
                                        onChange={(e) => setSearchSeller(e.target.value)}
                                        placeholder="Buscar por nombre o correo..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/40">
                                    {loadingUsers ? (
                                        <div className="p-4 text-center text-xs text-slate-500 font-mono">Cargando lista de usuarios...</div>
                                    ) : systemUsers
                                        .filter(u => 
                                            !activeSellers.some(s => s.id === u.id || s.name === u.name) &&
                                            (u.name?.toLowerCase().includes(searchSeller.toLowerCase()) || u.email?.toLowerCase().includes(searchSeller.toLowerCase()))
                                        )
                                        .slice(0, 10)
                                        .map(user => (
                                            <div 
                                                key={user.id}
                                                className="pt-1.5 flex items-center justify-between p-2 hover:bg-slate-800/60 rounded-xl transition-colors"
                                            >
                                                <div>
                                                    <p className="text-xs font-bold text-white">{user.name || user.email}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">{user.email} • {user.role}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAddSeller(user)}
                                                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                                >
                                                    <Plus size={12} /> <span>Añadir a Oficina</span>
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                onClick={() => setIsManageModalOpen(false)}
                                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Listo • Guardar y Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
