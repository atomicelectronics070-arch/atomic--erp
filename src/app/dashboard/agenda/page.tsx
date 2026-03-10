"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Clock, Save, Trash2, MapPin } from "lucide-react"
import { getEvents, saveEvent, deleteEvent } from "@/lib/actions/productivity"

export default function AgendaPage() {
    const { data: session } = useSession()
    const [events, setEvents] = useState<any[]>([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<any>(null)

    useEffect(() => {
        if (session?.user?.id) refreshEvents()
    }, [session])

    const refreshEvents = async () => {
        setLoading(true)
        const e = await getEvents(session!.user.id)
        setEvents(e)
        setLoading(false)
    }

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

    const handleSave = async (data: any) => {
        await saveEvent({ ...data, userId: session!.user.id })
        setIsFormOpen(false)
        setEditingEvent(null)
        refreshEvents()
    }

    const handleDelete = async (id: string) => {
        if (confirm("¿Eliminar este evento?")) {
            await deleteEvent(id)
            refreshEvents()
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-100 pb-8 gap-6">
                <div>
                    <div className="flex items-center space-x-2 text-orange-600 mb-2">
                        <CalendarIcon size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Productivity Tool</span>
                    </div>
                    <h1 className="text-4xl font-light text-neutral-800 tracking-tight">Mi Agenda</h1>
                    <p className="text-neutral-500 text-sm mt-2">Organiza tus citas, entregas y reuniones importantes.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-neutral-100 p-1">
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white text-neutral-400 hover:text-neutral-900 transition-all"><ChevronLeft size={16} /></button>
                        <span className="px-6 text-[10px] font-black uppercase tracking-widest text-neutral-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white text-neutral-400 hover:text-neutral-900 transition-all"><ChevronRight size={16} /></button>
                    </div>
                    <button
                        onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
                        className="bg-neutral-900 text-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-neutral-100 flex items-center space-x-2"
                    >
                        <Plus size={16} /> <span>Nuevo Evento</span>
                    </button>
                </div>
            </header>

            <div className="bg-white border border-neutral-100 overflow-hidden shadow-sm">
                <div className="grid grid-cols-7 bg-neutral-50 border-b border-neutral-100">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                        <div key={day} className="py-4 text-center text-[10px] font-black text-neutral-300 uppercase tracking-widest">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 border-collapse">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-40 border-r border-b border-neutral-50 bg-neutral-50/20"></div>
                    ))}
                    {Array.from({ length: daysInMonth(currentDate.getMonth(), currentDate.getFullYear()) }).map((_, i) => {
                        const day = i + 1
                        const dayEvents = events.filter(e => {
                            const d = new Date(e.start)
                            return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
                        })
                        const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear()

                        return (
                            <div key={day} className="h-40 border-r border-b border-neutral-50 p-3 hover:bg-neutral-50/50 transition-all group overflow-hidden">
                                <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-none mb-2 ${isToday ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-neutral-300 group-hover:text-neutral-800'}`}>
                                    {day}
                                </span>
                                <div className="space-y-1">
                                    {dayEvents.map(e => (
                                        <button
                                            key={e.id}
                                            onClick={() => { setEditingEvent(e); setIsFormOpen(true); }}
                                            style={{ borderLeftColor: e.color || '#ea580c' }}
                                            className="w-full text-left bg-neutral-100 px-2 py-1.5 border-l-2 hover:bg-white hover:shadow-sm transition-all truncate"
                                        >
                                            <p className="text-[9px] font-bold text-neutral-800 uppercase tracking-tight truncate">{e.allDay ? '' : new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {e.title}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {isFormOpen && (
                <EventForm
                    initialData={editingEvent}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}

function EventForm({ initialData, onClose, onSave, onDelete }: any) {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        title: initialData?.title || '',
        description: initialData?.description || '',
        start: initialData?.start ? new Date(initialData.start).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        end: initialData?.end ? new Date(initialData.end).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        color: initialData?.color || '#ea580c',
        allDay: initialData?.allDay || false
    })

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <div className="flex items-center space-x-3 text-orange-600">
                        <CalendarIcon size={18} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">{formData.id ? 'Detalles del Evento' : 'Programar Evento'}</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-300 hover:text-neutral-800 transition-colors">
                        <X size={20} />
                    </button>
                </header>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">¿Qué tenemos agendado?</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Reunión de ventas, entrega de equipo..."
                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm font-bold outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Inicia</label>
                            <input
                                type="datetime-local"
                                value={formData.start}
                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                className="w-full bg-neutral-50 border-none px-6 py-4 text-xs font-bold outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Finaliza</label>
                            <input
                                type="datetime-local"
                                value={formData.end}
                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                className="w-full bg-neutral-50 border-none px-6 py-4 text-xs font-bold outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Comentarios adicionales</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalles sobre el lugar, personas o preparativos..."
                            className="w-full bg-neutral-50 border-none px-6 py-4 text-xs outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>
                <footer className="p-8 border-t border-neutral-100 flex justify-between items-center">
                    {formData.id && (
                        <button onClick={() => onDelete(formData.id)} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors flex items-center space-x-2">
                            <Trash2 size={14} /> <span>Eliminar</span>
                        </button>
                    )}
                    <div className="flex space-x-4 ml-auto">
                        <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-colors">Cancelar</button>
                        <button
                            onClick={() => onSave({ ...formData, start: new Date(formData.start), end: new Date(formData.end) })}
                            className="bg-neutral-900 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-neutral-100 flex items-center space-x-2"
                        >
                            <Save size={16} /> <span>Agendar</span>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
}
