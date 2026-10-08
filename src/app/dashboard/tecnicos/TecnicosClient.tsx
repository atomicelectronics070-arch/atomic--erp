"use client"

import React, { useState } from "react"
import { 
    Wrench, Calendar, MapPin, CheckCircle2, Clock, AlertTriangle, 
    FileText, Shield, Sparkles, Plus, Search, Phone, User, 
    Cpu, Download, Camera, CheckSquare, Zap, ExternalLink
} from "lucide-react"

interface TechnicalVisit {
    id: string
    clientName: string
    phone: string
    address: string
    city: string
    equipmentType: string
    status: "PENDIENTE" | "EN_PROCESO" | "COMPLETADO" | "CANCELADO"
    date: string
    time: string
    technicianName: string
    notes: string
    checklistCompleted: number
    checklistTotal: number
}

const SAMPLE_VISITS: TechnicalVisit[] = [
    {
        id: "VIS-2026-001",
        clientName: "Condominio Los Cerezos",
        phone: "0998765432",
        address: "Av. Brasil y Edmundo Carvajal",
        city: "Quito",
        equipmentType: "Central Intelbras Collective 16i + Citofonía",
        status: "EN_PROCESO",
        date: "2026-10-09",
        time: "10:00 AM",
        technicianName: "Ing. Carlos Mendoza (Techman)",
        notes: "Revisión de cableado de 2 hilos existente en torre 1 y cambio de fuente 12V.",
        checklistCompleted: 3,
        checklistTotal: 5
    },
    {
        id: "VIS-2026-002",
        clientName: "Gimnasio PowerFit Centro",
        phone: "0981234567",
        address: "Av. 10 de Agosto y Orellana",
        city: "Quito",
        equipmentType: "Torniquete Trípode ZKTeco TS1000 Pro + Biométrico SenseFace",
        status: "PENDIENTE",
        date: "2026-10-09",
        time: "02:30 PM",
        technicianName: "Téc. Roberto Salazar",
        notes: "Instalación y anclaje a piso de concreto con pernos expansivos. Conexión a red Ethernet.",
        checklistCompleted: 1,
        checklistTotal: 5
    },
    {
        id: "VIS-2026-003",
        clientName: "Boutique Glamour Plaza",
        phone: "0976543210",
        address: "C.C. El Bosque, Local 42",
        city: "Quito",
        equipmentType: "Par de Antenas Antihurto RF Dahua Mercury",
        status: "COMPLETADO",
        date: "2026-10-08",
        time: "09:00 AM",
        technicianName: "Ing. Carlos Mendoza (Techman)",
        notes: "Calibración de sensibilidad a 90cm con tags duros y 70cm etiquetas blandas. Funcionamiento 100% OK.",
        checklistCompleted: 5,
        checklistTotal: 5
    }
]

const PROTOCOLS = [
    {
        title: "Torniquetes Peatonales ZKTeco (TS1000 / FBL4000)",
        steps: [
            "Verificar nivelación y resistencia del piso (cemento mínimo 10cm).",
            "Fijar con pernos expansivos M12 de alta resistencia.",
            "Conectar alimentación AC 110V/220V con tierra física obligatoria.",
            "Conectar pulso de apertura NO/COM desde el biométrico o control de acceso.",
            "Probar paso bidireccional y mecanismo anti-pánico por corte eléctrico."
        ]
    },
    {
        title: "Central Colectiva Intelbras (Collective 4i a 24i)",
        steps: [
            "Medir voltaje de fuente conmutada (debe marcar 12V a 13.8V DC estable).",
            "Comprobar cableado UTP o telefónico hacia cada citófono CT-A1 o TDMI.",
            "Programar numeración de departamentos en teclado alfanumérico.",
            "Configurar apertura de cerradura eléctrica de 12V (tiempo 1 a 3 segundos).",
            "Realizar llamada de prueba de audio bidireccional a cada piso."
        ]
    },
    {
        title: "Cercos Eléctricos de Alto Voltaje (JFL / Hagroy)",
        steps: [
            "Instalar postes templadores e intermedios con aisladores de alto impacto.",
            "Tender líneas de alambre de aluminio o acerado con distancia de 15cm a 20cm.",
            "Instalar jabalina/varilla de cobre Copperweld para tierra dedicada (no conectar a tierra de casa).",
            "Conectar electrificador con retorno de alto voltaje y batería 12V 4Ah de respaldo.",
            "Medir voltaje con voltímetro digital de cercos (debe marcar > 8,000 Voltios)."
        ]
    }
]

export default function TecnicosClient() {
    const [visits, setVisits] = useState<TechnicalVisit[]>(SAMPLE_VISITS)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [activeTab, setActiveTab] = useState<"agenda" | "protocols" | "new_visit">("agenda")

    // New Visit Form
    const [newVisit, setNewVisit] = useState({
        clientName: "",
        phone: "",
        address: "",
        city: "Quito",
        equipmentType: "Torniquete ZKTeco",
        date: new Date().toISOString().split("T")[0],
        time: "09:00 AM",
        technicianName: "Equipo Técnico ATOMIC",
        notes: ""
    })

    const handleCreateVisit = (e: React.FormEvent) => {
        e.preventDefault()
        const visitItem: TechnicalVisit = {
            id: `VIS-2026-${Math.floor(100 + Math.random() * 900)}`,
            ...newVisit,
            status: "PENDIENTE",
            checklistCompleted: 0,
            checklistTotal: 5
        }
        setVisits(prev => [visitItem, ...prev])
        setActiveTab("agenda")
        setNewVisit({
            clientName: "",
            phone: "",
            address: "",
            city: "Quito",
            equipmentType: "Torniquete ZKTeco",
            date: new Date().toISOString().split("T")[0],
            time: "09:00 AM",
            technicianName: "Equipo Técnico ATOMIC",
            notes: ""
        })
    }

    const filteredVisits = visits.filter(v => {
        const matchesSearch = `${v.clientName} ${v.address} ${v.equipmentType} ${v.technicianName}`.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = filterStatus === "ALL" || v.status === filterStatus
        return matchesSearch && matchesStatus
    })

    return (
        <div className="min-h-screen bg-[#050914] text-white p-4 md:p-8 space-y-8">
            
            {/* Header */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                        <Wrench size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            Plataforma de Técnicos & Operaciones en Campo
                        </h1>
                        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mt-1">
                            Instalaciones · Levantamientos Técnicos · Protocolos de Calidad ATOMIC
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab("new_visit")}
                        className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Agendar Visita Técnica</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-3">
                <button
                    onClick={() => setActiveTab("agenda")}
                    className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                        activeTab === "agenda"
                            ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Calendar size={15} />
                    <span>Agenda de Visitas ({visits.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab("protocols")}
                    className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                        activeTab === "protocols"
                            ? "bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Shield size={15} />
                    <span>Protocolos de Instalación</span>
                </button>

                <button
                    onClick={() => setActiveTab("new_visit")}
                    className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                        activeTab === "new_visit"
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Plus size={15} />
                    <span>Nueva Hoja de Visita</span>
                </button>
            </div>

            {/* TAB 1: AGENDA DE VISITAS */}
            {activeTab === "agenda" && (
                <div className="space-y-6">
                    {/* Filters bar */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-3 text-slate-500" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por cliente, dirección o equipo..."
                                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-cyan-500/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {["ALL", "PENDIENTE", "EN_PROCESO", "COMPLETADO"].map(st => (
                                <button
                                    key={st}
                                    onClick={() => setFilterStatus(st)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                                        filterStatus === st 
                                            ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300" 
                                            : "text-slate-400 bg-slate-950 border border-slate-800 hover:text-white"
                                    }`}
                                >
                                    {st === "ALL" ? "Todos" : st.replace("_", " ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVisits.map(visit => {
                            const isDone = visit.status === "COMPLETADO"
                            const isInProgress = visit.status === "EN_PROCESO"
                            return (
                                <div
                                    key={visit.id}
                                    className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl shadow-xl space-y-4 transition-all hover:scale-[1.01]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-slate-950 text-cyan-400 border border-cyan-500/30">
                                            {visit.id}
                                        </span>
                                        <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                                            isDone ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                                            isInProgress ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                                            "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                        }`}>
                                            {visit.status.replace("_", " ")}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-white">{visit.clientName}</h3>
                                        <p className="text-xs font-mono text-cyan-300 mt-0.5">{visit.equipmentType}</p>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-slate-300 font-sans border-t border-slate-800/80 pt-3">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin size={14} className="text-cyan-400 shrink-0" />
                                            <span className="truncate">{visit.address}, {visit.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Phone size={14} className="text-emerald-400 shrink-0" />
                                            <span>{visit.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={14} className="text-amber-400 shrink-0" />
                                            <span>{visit.date} a las {visit.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <User size={14} className="text-purple-400 shrink-0" />
                                            <span className="truncate">Técnico: {visit.technicianName}</span>
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-slate-400 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
                                        {visit.notes}
                                    </p>

                                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                                        <span className="text-slate-400">Checklist Calidad:</span>
                                        <span className="font-bold text-emerald-400">
                                            {visit.checklistCompleted} / {visit.checklistTotal} pasos OK
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* TAB 2: PROTOCOLOS DE INSTALACIÓN */}
            {activeTab === "protocols" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PROTOCOLS.map((proto, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                                        <CheckSquare size={18} />
                                    </div>
                                    <h3 className="font-bold text-sm text-white">{proto.title}</h3>
                                </div>

                                <ol className="space-y-2.5 text-xs text-slate-300 list-decimal pl-4">
                                    {proto.steps.map((st, i) => (
                                        <li key={i} className="leading-relaxed">
                                            {st}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: NUEVA VISITA TÉCNICA */}
            {activeTab === "new_visit" && (
                <form onSubmit={handleCreateVisit} className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 max-w-2xl mx-auto space-y-6 shadow-2xl">
                    <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-lg font-black text-white">Registro de Nueva Visita Técnica</h2>
                        <p className="text-xs font-mono text-cyan-400 mt-1">Ingresa los datos para asignar al equipo de campo</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Nombre del Cliente / Empresa *</label>
                            <input
                                type="text"
                                required
                                value={newVisit.clientName}
                                onChange={e => setNewVisit(p => ({ ...p, clientName: e.target.value }))}
                                placeholder="Ej: Condominio Torres del Sol"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Teléfono WhatsApp *</label>
                            <input
                                type="text"
                                required
                                value={newVisit.phone}
                                onChange={e => setNewVisit(p => ({ ...p, phone: e.target.value }))}
                                placeholder="099..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Dirección Exacta *</label>
                            <input
                                type="text"
                                required
                                value={newVisit.address}
                                onChange={e => setNewVisit(p => ({ ...p, address: e.target.value }))}
                                placeholder="Calle y número"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Ciudad *</label>
                            <input
                                type="text"
                                required
                                value={newVisit.city}
                                onChange={e => setNewVisit(p => ({ ...p, city: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Equipo a Instalar / Revisar *</label>
                            <input
                                type="text"
                                required
                                value={newVisit.equipmentType}
                                onChange={e => setNewVisit(p => ({ ...p, equipmentType: e.target.value }))}
                                placeholder="Ej: Torniquete TS1000 Pro"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Técnico Asignado</label>
                            <input
                                type="text"
                                value={newVisit.technicianName}
                                onChange={e => setNewVisit(p => ({ ...p, technicianName: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Fecha Programada *</label>
                            <input
                                type="date"
                                required
                                value={newVisit.date}
                                onChange={e => setNewVisit(p => ({ ...p, date: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Hora Estimada *</label>
                            <input
                                type="text"
                                required
                                value={newVisit.time}
                                onChange={e => setNewVisit(p => ({ ...p, time: e.target.value }))}
                                placeholder="10:00 AM"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="text-slate-400 uppercase text-[10px] block mb-1">Notas / Observaciones Técnicas</label>
                            <textarea
                                rows={3}
                                value={newVisit.notes}
                                onChange={e => setNewVisit(p => ({ ...p, notes: e.target.value }))}
                                placeholder="Herramientas requeridas, tipo de pared o piso, contacto en sitio..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => setActiveTab("agenda")}
                            className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
                        >
                            Guardar Visita en Agenda
                        </button>
                    </div>
                </form>
            )}

        </div>
    )
}
