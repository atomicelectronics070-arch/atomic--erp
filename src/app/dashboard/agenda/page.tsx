"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
    X, Clock, Save, Trash2, MapPin, Sparkles, Target, 
    Zap, ShieldCheck, ArrowRight, LayoutGrid
} from "lucide-react"
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
        try {
            const e = await getEvents(session!.user.id)
            setEvents(e)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]

    const handleSave = async (data: any) => {
        await saveEvent({ ...data, userId: session!.user.id })
        setIsFormOpen(false)
        setEditingEvent(null)
        refreshEvents()
    }

    const handleDelete = async (id: string) => {
        if (confirm("⚠️ Confirmación Crítica: ¿Eliminar este evento permanentemente?")) {
            await deleteEvent(id)
            refreshEvents()
        }
    }

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-16 relative z-10 gap-10">
                <div>
                     <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <CalendarIcon size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Productivity Core v2.0</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                        MI <span className="text-secondary underline decoration-secondary/30 underline-offset-8">AGENDA</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Sincronización táctica de compromisos, entregables y despliegues operativos de alto impacto.
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex items-center glass-panel !bg-slate-950/40 p-2 rounded-2xl border-white/5 shadow-inner ring-1 ring-white/5 backdrop-blur-3xl">
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-4 hover:bg-white hover:text-secondary rounded-xl transition-all text-slate-600"><ChevronLeft size={20} /></button>
                        <span className="px-10 text-[10px] font-black uppercase tracking-[0.4em] text-white italic">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-4 hover:bg-white hover:text-secondary rounded-xl transition-all text-slate-600"><ChevronRight size={20} /></button>
                    </div>
                    <button
                        onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
                        className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-2xl active:scale-95 group italic skew-x-[-12deg]"
                    >
                         <div className="skew-x-[12deg] flex items-center gap-4">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                            <span>Inyectar Evento</span>
                        </div>
                    </button>
                </div>
            </header>

            {/* Calendar Grid Container */}
            <div className="glass-panel border-white/5 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-[4rem] relative z-10 backdrop-blur-3xl">
                <div className="grid grid-cols-7 bg-white/[0.02] border-b border-white/5">
                    {["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"].map(day => (
                        <div key={day} className="py-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.6em] italic border-r border-white/5 last:border-r-0">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-44 border-r border-b border-white/5 bg-slate-950/20 last:border-r-0"></div>
                    ))}
                    {Array.from({ length: daysInMonth(currentDate.getMonth(), currentDate.getFullYear()) }).map((_, i) => {
                        const day = i + 1
                        const dayEvents = events.filter(e => {
                            const d = new Date(e.start)
                            return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
                        })
                        const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear()

                        return (
                            <div key={day} className="h-44 border-r border-b border-white/5 p-5 hover:bg-white/[0.02] transition-all group overflow-hidden relative last:border-r-0">
                                <div className="flex justify-between items-start mb-4">
                                     <span className={`text-[11px] font-black w-8 h-8 flex items-center justify-center rounded-xl italic transition-all group-hover:scale-110 ${isToday ? 'bg-secondary text-white shadow-[0_0_15px_rgba(255,99,71,0.5)] ring-2 ring-secondary/20' : 'text-slate-800 group-hover:text-white border border-transparent group-hover:border-white/10 group-hover:bg-slate-900 shadow-inner'}`}>
                                        {day}
                                    </span>
                                    {dayEvents.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse mt-3 mr-1" />}
                                </div>
                                <div className="space-y-3 relative z-10">
                                    {dayEvents.map(e => (
                                        <button
                                            key={e.id}
                                            onClick={() => { setEditingEvent(e); setIsFormOpen(true); }}
                                            className="w-full text-left bg-slate-900 border border-white/5 px-4 py-2.5 rounded-xl border-l-[3px] hover:border-secondary transition-all truncate group/event relative overflow-hidden"
                                            style={{ borderLeftColor: e.color || '#ff6347' }}
                                        >
                                            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover/event:opacity-100 transition-opacity" />
                                            <p className="text-[10px] font-black text-slate-100 uppercase tracking-tight truncate italic group-hover/event:translate-x-1 transition-transform">
                                                {!e.allDay && <span className="text-secondary/40 mr-2">{new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                                                {e.title}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Event Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" 
                            onClick={() => setIsFormOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-panel !bg-slate-950/60 w-full max-w-2xl shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 overflow-hidden rounded-[4rem] relative z-10 backdrop-blur-3xl p-14 border"
                        >
                            <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center space-x-6">
                                    <div className="p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-2xl shadow-2xl">
                                        <CalendarIcon size={24} className="drop-shadow-[0_0_10px_rgba(255,99,71,0.5)]" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                                            {editingEvent ? 'EDITAR <span className="text-secondary">ACTIVO</span>' : 'REDACTAR <span className="text-secondary">NODO</span>'}
                                        </h2>
                                        <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-[0.4em] italic leading-none">Subsistema de Agendamiento Estratégico</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-2xl">
                                    <X size={28} />
                                </button>
                            </header>
                            
                            <EventForm
                                initialData={editingEvent}
                                onSave={handleSave}
                                onDelete={handleDelete}
                                onClose={() => setIsFormOpen(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
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
        color: initialData?.color || '#ff6347',
        allDay: initialData?.allDay || false
    })

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Identificador del Compromiso</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
                    placeholder="REUNIÓN_VENTAS, ENTREGA_ACTIVOS..."
                    className="w-full bg-slate-950 border border-white/5 p-6 rounded-[2rem] text-[15px] font-black uppercase tracking-widest text-white shadow-inner focus:border-secondary outline-none transition-all italic placeholder:text-slate-900"
                />
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Vector Inicio</label>
                    <input
                        type="datetime-local"
                        value={formData.start}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                        className="w-full bg-slate-950 border border-white/5 p-6 rounded-[2rem] text-xs font-black text-azure-400 outline-none shadow-inner focus:border-azure-500 transition-all italic"
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Vector Término</label>
                    <input
                        type="datetime-local"
                        value={formData.end}
                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                        className="w-full bg-slate-950 border border-white/5 p-6 rounded-[2rem] text-xs font-black text-azure-400 outline-none shadow-inner focus:border-azure-500 transition-all italic"
                    />
                </div>
            </div>
            
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Metadata / Cuerpo Estructurado</label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value.toUpperCase() })}
                    placeholder="DETALLES TÁCTICOS, UBICACIÓN, ACTORES INVOLUCRADOS..."
                    className="w-full bg-slate-950 border border-white/5 p-8 rounded-[2.5rem] text-[12px] font-black text-white shadow-inner focus:border-secondary outline-none resize-none h-40 italic uppercase tracking-widest leading-relaxed placeholder:text-slate-900 custom-scrollbar"
                />
            </div>

            <div className="flex flex-wrap items-center justify-between pt-10 border-t border-white/5 gap-6">
                {formData.id && (
                    <button 
                        onClick={() => onDelete(formData.id)} 
                        className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-red-500 hover:text-white transition-all italic bg-red-500/5 px-6 py-3 rounded-full border border-red-500/10 group"
                    >
                        <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
                        <span>PURGAR_ACTIVO</span>
                    </button>
                )}
                <div className="flex items-center gap-8 ml-auto">
                    <button onClick={onClose} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 hover:text-white transition-all italic">ABORTAR_CMD</button>
                    <button
                        onClick={() => onSave({ ...formData, start: new Date(formData.start), end: new Date(formData.end) })}
                        className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-2xl active:scale-95 group italic skew-x-[-12deg]"
                    >
                         <div className="skew-x-[12deg] flex items-center gap-4">
                            <Save size={20} className="group-hover:scale-110 transition-transform" />
                            <span>SINCRONIZAR_NODO</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
