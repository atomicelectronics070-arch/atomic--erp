"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Phone, Mail, UserPlus, Filter, Download, Trash2, Edit2, Briefcase, ChevronRight, X, BarChart3, TrendingUp, CheckCircle2, Save, MoreVertical, GripVertical, AlertCircle, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// --- CONSTANTES DE ESTADOS (COLUMNAS) ---
const COLUMNS = [
    { id: 'PROSPECTO', title: 'Nuevo Lead', color: 'border-slate-500/30', bg: 'bg-slate-500/5', icon: <UserPlus size={16}/> },
    { id: 'COTIZANDO', title: 'Cotizando', color: 'border-amber-500/30', bg: 'bg-amber-500/5', icon: <Clock size={16}/> },
    { id: 'NEGOCIACION', title: 'Negociación', color: 'border-indigo-500/30', bg: 'bg-indigo-500/5', icon: <BarChart3 size={16}/> },
    { id: 'ACTIVO', title: 'Cierre Ganado', color: 'border-emerald-500/30', bg: 'bg-emerald-500/5', icon: <CheckCircle2 size={16}/> },
    { id: 'INACTIVO', title: 'Perdido', color: 'border-rose-500/30', bg: 'bg-rose-500/5', icon: <ShieldAlert size={16}/> }
]

export default function AdvancedCRMPage() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeId, setActiveId] = useState<string | null>(null)

    // Form/Panel state
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<any>(null)
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "", city: "",
        requirement: "", status: "PROSPECTO", purchaseCount: 0
    })

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    useEffect(() => { fetchClients() }, [])

    const fetchClients = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/crm")
            const data = await res.json()
            setClients(Array.isArray(data) ? data : [])
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const updateClientStatus = async (id: string, newStatus: string) => {
        const client = clients.find(c => c.id === id)
        if (!client) return

        try {
            const res = await fetch(`/api/crm/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...client, status: newStatus })
            })
            if (!res.ok) throw new Error("Fail")
            setClients(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
        } catch (e) { fetchClients() }
    }

    const handleDragStart = (event: any) => setActiveId(event.active.id)

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        setActiveId(null)
        if (!over) return

        const activeClient = clients.find(c => c.id === active.id)
        const overId = over.id as string

        // Si se soltó sobre una columna (id de columna)
        if (COLUMNS.some(col => col.id === overId)) {
            if (activeClient.status !== overId) {
                updateClientStatus(active.id, overId)
            }
        } else {
            // Si se soltó sobre otro cliente, tomar el status de ese cliente
            const overClient = clients.find(c => c.id === overId)
            if (overClient && activeClient.status !== overClient.status) {
                updateClientStatus(active.id, overClient.status)
            }
        }
    }

    const openEdit = (client: any) => {
        setEditingClient(client)
        setFormData({ ...client })
        setIsPanelOpen(true)
    }

    const filteredClients = clients.filter(c => 
        `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-transparent text-white p-4 lg:p-8 space-y-10 relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400">
                        <Briefcase size={20} className="neon-glow" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">CRM ESTRATÉGICO // v5.0</span>
                    </div>
                    <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">Atomic <span className="text-indigo-500">Pipeline</span></h1>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="FILTRAR ELEMENTOS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-500/50 transition-all italic"
                        />
                    </div>
                    <button onClick={() => { setEditingClient(null); setFormData({ firstName: "", lastName: "", email: "", phone: "", city: "", requirement: "", status: "PROSPECTO", purchaseCount: 0 }); setIsPanelOpen(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 px-8 text-[10px] font-black uppercase tracking-widest italic skew-x-[-12deg] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                        <UserPlus size={18} />
                        <span>NUEVO LEAD</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatBox label="Prospectos" value={clients.filter(c => c.status === 'PROSPECTO').length} color="slate" />
                <StatBox label="En Cierre" value={clients.filter(c => c.status === 'NEGOCIACION').length} color="indigo" />
                <StatBox label="Garantizados" value={clients.filter(c => c.status === 'ACTIVO').length} color="emerald" />
                <StatBox label="Tasa Conversión" value={`${clients.length > 0 ? Math.round((clients.filter(c => c.status === 'ACTIVO').length / clients.length) * 100) : 0}%`} color="indigo" />
            </div>

            {/* Kanban Board */}
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 h-[calc(100vh-350px)] min-h-[600px]">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="flex flex-col gap-4 h-full group">
                            <div className={`p-4 border-b-2 ${col.color} bg-white/[0.02] flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <div className="text-white/40">{col.icon}</div>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] italic">{col.title}</h3>
                                </div>
                                <span className="text-[9px] font-black bg-white/5 px-2 py-1 border border-white/10 opacity-40">{filteredClients.filter(c => c.status === col.id).length}</span>
                            </div>
                            
                            <div className={`flex-1 overflow-y-auto p-2 space-y-4 rounded-none border border-transparent transition-all group-hover:border-white/5 custom-scrollbar-hidden`}>
                                <SortableContext items={filteredClients.filter(c => c.status === col.id).map(c => c.id)} strategy={verticalListSortingStrategy}>
                                    {filteredClients.filter(c => c.status === col.id).map(client => (
                                        <SortableClientCard key={client.id} client={client} onClick={() => openEdit(client)} />
                                    ))}
                                    {/* Placeholder para soltar en columna vacía */}
                                    <div className="h-20 border-2 border-dashed border-white/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[10px] font-black uppercase italic text-white/10">SOLTAR AQUÍ</div>
                                </SortableContext>
                            </div>
                        </div>
                    ))}
                </div>
                <DragOverlay>
                    {activeId ? (
                        <div className="bg-slate-900/90 border border-indigo-500/50 p-6 shadow-2xl scale-105 opacity-90 cursor-grabbing">
                            <p className="text-[12px] font-black uppercase italic">{clients.find(c => c.id === activeId)?.firstName} {clients.find(c => c.id === activeId)?.lastName}</p>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Modal de Edición (Panel Lateral) */}
            <AnimatePresence>
                {isPanelOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" onClick={() => setIsPanelOpen(false)} />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-slate-950 border-l border-white/10 z-[110] p-10 flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter">{editingClient ? 'EDITAR' : 'NUEVO'} <span className="text-indigo-500">LEAD</span></h2>
                                <button onClick={() => setIsPanelOpen(false)} className="text-white/20 hover:text-white transition-all"><X size={32}/></button>
                            </div>
                            
                            <div className="flex-1 space-y-8 overflow-y-auto pr-4 custom-scrollbar-hidden">
                                <div className="grid grid-cols-2 gap-6">
                                    <InputBlock label="Nombres" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                                    <InputBlock label="Apellidos" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                                </div>
                                <InputBlock label="Email Corporativo" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                                <div className="grid grid-cols-2 gap-6">
                                    <InputBlock label="Línea Crítica" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                                    <InputBlock label="Coordenada (Ciudad)" value={formData.city} onChange={(v) => setFormData({...formData, city: v})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Requerimiento Táctico</label>
                                    <textarea 
                                        value={formData.requirement} 
                                        onChange={(e) => setFormData({...formData, requirement: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 p-6 text-[12px] font-bold text-white italic outline-none focus:border-indigo-500/40 min-h-[150px] resize-none"
                                        placeholder="DESGLOSE DE NECESIDADES..."
                                    />
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-4">
                                <button onClick={() => setIsPanelOpen(false)} className="p-4 text-[10px] font-black uppercase italic border border-white/10 hover:bg-white/5">ABORTAR</button>
                                <button onClick={async () => {
                                    const method = editingClient ? 'PUT' : 'POST'
                                    const url = editingClient ? `/api/crm/${editingClient.id}` : '/api/crm'
                                    const res = await fetch(url, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData) })
                                    if(res.ok) { fetchClients(); setIsPanelOpen(false); }
                                }} className="p-4 text-[10px] font-black uppercase italic bg-indigo-600 shadow-xl shadow-indigo-500/20">GUARDAR CAMBIOS</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function SortableClientCard({ client, onClick }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: client.id })
    const style = { transform: CSS.Transform.toString(transform), transition }

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`group relative bg-white/[0.03] border border-white/5 p-6 space-y-4 cursor-pointer hover:border-indigo-500/30 transition-all ${isDragging ? 'opacity-30' : ''}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-[12px] font-black uppercase tracking-tight italic text-white group-hover:text-indigo-400 transition-colors truncate max-w-[150px]">
                        {client.firstName} {client.lastName}
                    </h4>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1 italic">ID: {client.id.slice(0, 8)}</p>
                </div>
                <div {...attributes} {...listeners} className="text-white/10 hover:text-indigo-400 cursor-grab active:cursor-grabbing p-1">
                    <GripVertical size={16} />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 italic">
                    <Phone size={10} className="text-indigo-500/50" />
                    <span>{client.phone || 'S/T'}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 italic">
                    <MapPin size={10} className="text-indigo-500/50" />
                    <span className="truncate">{client.city || 'GLOBAL'}</span>
                </div>
            </div>

            {client.requirement && (
                <p className="text-[9px] text-white/30 italic line-clamp-2 bg-black/20 p-2 border-l border-indigo-500/20">{client.requirement}</p>
            )}

            <div className="pt-2 flex justify-between items-center border-t border-white/5">
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-none ${i < (client.purchaseCount || 1) ? 'bg-indigo-500' : 'bg-white/10'}`} />
                    ))}
                </div>
                <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">{new Date(client.updatedAt).toLocaleDateString()}</span>
            </div>
        </div>
    )
}

function StatBox({ label, value, color }: any) {
    const colors: any = {
        slate: 'text-white/40',
        indigo: 'text-indigo-500 neon-text',
        emerald: 'text-emerald-500'
    }
    return (
        <div className="bg-white/[0.02] border border-white/5 p-8 flex flex-col items-center justify-center space-y-2 group hover:bg-white/[0.04] transition-all">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">{label}</span>
            <span className={`text-5xl font-black italic tracking-tighter ${colors[color]}`}>{value}</span>
        </div>
    )
}

function InputBlock({ label, value, onChange, placeholder = "..." }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic ml-2">{label}</label>
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 p-5 text-[12px] font-bold text-white italic outline-none focus:border-indigo-500/40 transition-all"
            />
        </div>
    )
}

function StatCard({ label, value, icon, color, showPulse = false }: any) {
    return null; // Legacy replacement
}



