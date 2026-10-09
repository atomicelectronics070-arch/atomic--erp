"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
    Plus, Clock, MapPin, Video, CheckCircle2, AlertCircle, 
    Trash2, User, Filter, Tag
} from "lucide-react"

interface CalendarEvent {
    id: string
    title: string
    date: string // YYYY-MM-DD
    time: string
    type: "visita" | "entrega" | "zoom" | "cobro"
    responsible: string
    location?: string
    notes?: string
}

export default function OperativeCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState<CalendarEvent[]>([
        {
            id: "e1",
            title: "Instalación de Torniquetes ZKTeco",
            date: new Date().toISOString().split("T")[0],
            time: "10:30",
            type: "visita",
            responsible: "Téc. Darwin Sánchez",
            location: "Edificio Diamond, Av. Amazonas, Quito"
        },
        {
            id: "e2",
            title: "Videollamada Zoom con Ing. Rómulo",
            date: new Date().toISOString().split("T")[0],
            time: "15:00",
            type: "zoom",
            responsible: "Santiago (Gerencia)",
            notes: "Revisión de nómina y arquitectura de software"
        },
        {
            id: "e3",
            title: "Despacho de 5 Cerraduras Smart",
            date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            time: "09:00",
            type: "entrega",
            responsible: "Vanessa Zurita",
            location: "Envío Servientrega a Guayaquil"
        },
        {
            id: "e4",
            title: "Cobro Proforma #1042 - Futura Tech",
            date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
            time: "12:00",
            type: "cobro",
            responsible: "Yolanda Chango",
            notes: "$1,450.00 pendiente transferencia Banco Pichincha"
        }
    ])

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [filterType, setFilterType] = useState<string>("all")
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        type: "visita" as const,
        responsible: "Santiago",
        location: "",
        notes: ""
    })

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = new Date(year, month, 1).getDay()

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newEvent.title.trim()) return
        const ev: CalendarEvent = {
            id: Date.now().toString(),
            title: newEvent.title.trim(),
            date: newEvent.date,
            time: newEvent.time,
            type: newEvent.type,
            responsible: newEvent.responsible,
            location: newEvent.location || undefined,
            notes: newEvent.notes || undefined
        }
        setEvents(prev => [...prev, ev])
        setIsAddOpen(false)
        setNewEvent({
            title: "",
            date: new Date().toISOString().split("T")[0],
            time: "10:00",
            type: "visita",
            responsible: "Santiago",
            location: "",
            notes: ""
        })
    }

    const handleDeleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id))
    }

    const filteredEvents = events.filter(e => filterType === "all" || e.type === filterType)

    const getTypeColor = (type: CalendarEvent["type"]) => {
        switch (type) {
            case "visita": return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
            case "zoom": return "bg-purple-500/20 text-purple-300 border-purple-500/40"
            case "entrega": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            case "cobro": return "bg-amber-500/20 text-amber-300 border-amber-500/40"
            default: return "bg-slate-800 text-slate-300 border-slate-700"
        }
    }

    return (
        <div className="w-full h-full flex flex-col space-y-6 text-white font-sans">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Calendario Operativo ATOMIC</h3>
                        <p className="text-xs text-slate-400 font-mono">
                            Planificación de visitas técnicas, entregas de equipos, reuniones Zoom y cobros.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                        <button onClick={handlePrevMonth} className="p-1.5 text-slate-400 hover:text-white">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-white">
                            {monthNames[month]} {year}
                        </span>
                        <button onClick={handleNextMonth} className="p-1.5 text-slate-400 hover:text-white">
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-950/40"
                    >
                        <Plus size={16} />
                        <span>Agendar Evento</span>
                    </button>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 text-xs font-mono overflow-x-auto pb-1">
                {["all", "visita", "zoom", "entrega", "cobro"].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`px-3 py-1.5 rounded-xl border uppercase font-bold transition-all ${
                            filterType === t 
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" 
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                    >
                        {t === "all" ? "Todos los Eventos" : t === "visita" ? "Visitas Técnicas" : t === "zoom" ? "Reuniones Zoom" : t === "entrega" ? "Entregas" : "Cobros"}
                    </button>
                ))}
            </div>

            {/* Grid of Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(ev => (
                    <div key={ev.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md border ${getTypeColor(ev.type)}`}>
                                    {ev.type}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                                    <Clock size={12} className="text-cyan-400" />
                                    <span>{ev.time}</span>
                                </div>
                            </div>
                            <h4 className="font-bold text-white text-sm">{ev.title}</h4>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                <User size={13} className="text-indigo-400" />
                                <span>{ev.responsible}</span>
                            </div>
                            {ev.location && (
                                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <MapPin size={13} className="text-rose-400" />
                                    <span className="truncate">{ev.location}</span>
                                </div>
                            )}
                            {ev.notes && (
                                <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                                    "{ev.notes}"
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs font-mono text-slate-500">
                            <span>Fecha: {ev.date}</span>
                            <button
                                onClick={() => handleDeleteEvent(ev.id)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                                title="Eliminar evento"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for adding event */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-[#090d1e] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h4 className="font-bold text-white text-base">Agendar Nuevo Evento</h4>
                            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleAddEvent} className="space-y-3 font-sans text-xs">
                            <div>
                                <label className="text-slate-400 block mb-1">Título del Evento:</label>
                                <input
                                    type="text"
                                    required
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="Ej: Instalación de cámaras en bodega..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-400 block mb-1">Fecha:</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Hora:</label>
                                    <input
                                        type="time"
                                        required
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-400 block mb-1">Tipo:</label>
                                    <select
                                        value={newEvent.type}
                                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="visita">Visita Técnica</option>
                                        <option value="zoom">Reunión Zoom</option>
                                        <option value="entrega">Entrega de Equipo</option>
                                        <option value="cobro">Cobro / Facturación</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Responsable:</label>
                                    <input
                                        type="text"
                                        value={newEvent.responsible}
                                        onChange={(e) => setNewEvent({ ...newEvent, responsible: e.target.value })}
                                        placeholder="Nombre..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-400 block mb-1">Ubicación / Enlace:</label>
                                <input
                                    type="text"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                    placeholder="Dirección o sala virtual..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div>
                                <label className="text-slate-400 block mb-1">Notas adicionales:</label>
                                <textarea
                                    value={newEvent.notes}
                                    onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                                    rows={2}
                                    placeholder="Observaciones importantes..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-400 resize-none"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
