"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, Plus, UserPlus, FileText, Database, User, Calendar, 
    MessageSquare, Clock, MapPin, Phone, Mail, Edit2, 
    Save, X, Filter, BarChart3, ChevronRight, Zap, Target,
    List, MoreHorizontal, LayoutGrid, CheckCircle2, AlertCircle,
    PlayCircle, Folders, PhoneCall, Tag, Trash2, ArrowRight
} from "lucide-react"

export default function CRMHistoricosPage() {
    const { data: session } = useSession()
    const role = session?.user?.role || "USER"
    const isAdmin = role === "ADMIN" || role === "MANAGEMENT"
    const currentUserId = session?.user?.id

    const [clients, setClients] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    // UI State
    const [searchTerm, setSearchTerm] = useState("")
    const [viewMode, setViewMode] = useState<"TABLE" | "KANBAN">("TABLE")
    const [activePlaylist, setActivePlaylist] = useState<string>("TODOS")
    const [customPlaylists, setCustomPlaylists] = useState<string[]>(["CLIENTES VIP", "SEGUIMIENTO URGENTE", "ZONA NORTE"])
    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
    const [newPlaylistName, setNewPlaylistName] = useState("")
    
    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [editForm, setEditForm] = useState<any>({})
    const [activeTab, setActiveTab] = useState<"RESUMEN" | "BITACORA" | "COTIZACIONES">("RESUMEN")
    const [newObservation, setNewObservation] = useState("")

    useEffect(() => {
        fetchClients()
        if (isAdmin) fetchUsers()
    }, [isAdmin])

    const fetchClients = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/crm")
            const data = await res.json()
            setClients(Array.isArray(data) ? data : [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users")
            const data = await res.json()
            setUsers(Array.isArray(data) ? data : [])
        } catch (e) {
            console.error(e)
        }
    }

    const handleOpenClient = (client: any) => {
        setSelectedClient(client)
        setEditForm({ ...client })
        setActiveTab("RESUMEN")
        setIsDrawerOpen(true)
    }

    const handleCreateNew = () => {
        setSelectedClient(null)
        setEditForm({ status: "PROSPECTO", source: "MANUAL", purchaseCount: 0 })
        setActiveTab("RESUMEN")
        setIsDrawerOpen(true)
    }

    const handleSaveClient = async () => {
        try {
            const isAdding = !selectedClient?.id
            const method = isAdding ? "POST" : "PUT"
            const url = isAdding ? "/api/crm" : `/api/crm/${selectedClient.id}`
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            })
            if (res.ok) {
                fetchClients()
                setIsDrawerOpen(false)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleAddObservation = async () => {
        if (!newObservation.trim() || !selectedClient) return
        const timestamp = new Date().toLocaleString()
        const author = session?.user?.name || "Asesor"
        const formattedObs = `\n[${timestamp}] ${author}: ${newObservation}`
        const updatedRequirement = (selectedClient.requirement || "") + formattedObs
        
        try {
            const res = await fetch(`/api/crm/${selectedClient.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...selectedClient, requirement: updatedRequirement })
            })
            if (res.ok) {
                const updated = await res.json()
                setSelectedClient(updated)
                setEditForm({ ...editForm, requirement: updatedRequirement })
                setNewObservation("")
                fetchClients()
            }
        } catch (e) {
            console.error(e)
        }
    }

    const createPlaylist = () => {
        if (newPlaylistName.trim() && !customPlaylists.includes(newPlaylistName.toUpperCase())) {
            setCustomPlaylists([...customPlaylists, newPlaylistName.toUpperCase()])
        }
        setNewPlaylistName("")
        setIsCreatingPlaylist(false)
    }

    // Filters & Playlists logic
    const filteredClients = useMemo(() => {
        let result = clients.filter(c => {
            const matchesSearch = `${c.firstName || ""} ${c.lastName || ""} ${c.name || ""} ${c.email || ""} ${c.phone || ""} ${c.cedula || ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            if (!isAdmin && c.salesperson?.id !== currentUserId) return false
            return matchesSearch
        })

        if (activePlaylist !== "TODOS") {
            if (activePlaylist === "MIS CLIENTES") {
                result = result.filter(c => c.salesperson?.id === currentUserId)
            } else if (activePlaylist === "NUEVOS LEADS") {
                result = result.filter(c => c.status === "PROSPECTO")
            } else if (activePlaylist === "CIERRES GANADOS") {
                result = result.filter(c => c.status === "ACTIVO")
            } else {
                // Custom playlist -> Match tags
                result = result.filter(c => c.tags?.toUpperCase().includes(activePlaylist))
            }
        }

        return result
    }, [clients, searchTerm, activePlaylist, isAdmin, currentUserId])

    // Standard Industrial Colors
    const statusColors: any = {
        "PROSPECTO": "bg-blue-500/10 text-blue-500 border-blue-500/20",
        "COTIZANDO": "bg-amber-500/10 text-amber-500 border-amber-500/20",
        "NEGOCIACION": "bg-purple-500/10 text-purple-500 border-purple-500/20",
        "ACTIVO": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        "INACTIVO": "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex overflow-hidden selection:bg-indigo-500/20 selection:text-indigo-900">
            
            {/* SUB-SIDEBAR: PLAYLISTS & FOLDERS */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-80px)] shrink-0 z-10">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                        <Database size={14} /> CRM Vistas
                    </h2>
                    <div className="space-y-1">
                        <PlaylistButton active={activePlaylist === "TODOS"} onClick={() => setActivePlaylist("TODOS")} icon={<LayoutGrid size={16}/>} label="Directorio Global" count={clients.length} />
                        <PlaylistButton active={activePlaylist === "MIS CLIENTES"} onClick={() => setActivePlaylist("MIS CLIENTES")} icon={<User size={16}/>} label="Mis Asignados" />
                        <PlaylistButton active={activePlaylist === "NUEVOS LEADS"} onClick={() => setActivePlaylist("NUEVOS LEADS")} icon={<Zap size={16}/>} label="Nuevos Leads" />
                        <PlaylistButton active={activePlaylist === "CIERRES GANADOS"} onClick={() => setActivePlaylist("CIERRES GANADOS")} icon={<CheckCircle2 size={16}/>} label="Cierres Ganados" />
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <PlayCircle size={14} /> Listas de Rep.
                        </h2>
                        <button onClick={() => setIsCreatingPlaylist(true)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>

                    {isCreatingPlaylist && (
                        <div className="mb-4 animate-in fade-in zoom-in duration-200">
                            <input 
                                autoFocus
                                type="text"
                                placeholder="NOMBRE DE LISTA..."
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && createPlaylist()}
                                className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 uppercase rounded"
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={createPlaylist} className="flex-1 bg-indigo-600 text-white text-[10px] font-bold py-1.5 rounded hover:bg-indigo-700">CREAR</button>
                                <button onClick={() => setIsCreatingPlaylist(false)} className="flex-1 bg-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded hover:bg-slate-300">CANCELAR</button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        {customPlaylists.map(pl => (
                            <PlaylistButton 
                                key={pl} 
                                active={activePlaylist === pl} 
                                onClick={() => setActivePlaylist(pl)} 
                                icon={<List size={16}/>} 
                                label={pl} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN DATA AREA */}
            <div className="flex-1 flex flex-col h-[calc(100vh-80px)] bg-[#F8FAFC] relative">
                {/* Header Actions */}
                <div className="px-8 py-6 flex justify-between items-end border-b border-slate-200 bg-white">
                    <div>
                        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">{activePlaylist}</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">{filteredClients.length} registros en esta vista</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Buscar nombre, cédula, correo..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-80 bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                            />
                        </div>
                        <button 
                            onClick={handleCreateNew}
                            className="bg-[#0F172A] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:bg-[#1E293B] transition-all flex items-center gap-2"
                        >
                            <UserPlus size={16} /> NUEVO CLIENTE
                        </button>
                    </div>
                </div>

                {/* Data View */}
                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="animate-spin text-indigo-600"><Zap size={32} /></div>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <Folders size={64} className="text-slate-200" />
                            <h3 className="text-xl font-bold text-slate-600">No hay clientes en esta lista</h3>
                            <p className="text-sm">Ajusta tus filtros o crea un nuevo registro.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Cliente</th>
                                        <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Contacto</th>
                                        <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Estado</th>
                                        <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Etiquetas / Playlists</th>
                                        <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map(client => (
                                        <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleOpenClient(client)}>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                                                        {client.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#0F172A]">{client.name}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{client.cedula ? `C.I. ${client.cedula}` : 'Sin identificación'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600"><Mail size={12} className="text-slate-400" /> {client.email || '—'}</div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600"><Phone size={12} className="text-slate-400" /> {client.phone || '—'}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${statusColors[client.status] || statusColors['PROSPECTO']}`}>
                                                    {client.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {client.tags ? client.tags.split(',').map((tag: string, i: number) => (
                                                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded flex items-center gap-1 border border-slate-200">
                                                            <Tag size={10} /> {tag.trim().toUpperCase()}
                                                        </span>
                                                    )) : <span className="text-xs text-slate-400 italic">—</span>}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                    <ArrowRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* SLIDE-OVER DRAWER FOR CLIENT DETAILS */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                            onClick={() => setIsDrawerOpen(false)}
                        />
                        <motion.div 
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
                        >
                            {/* Drawer Header */}
                            <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                                        {editForm.name?.[0]?.toUpperCase() || <UserPlus size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">{selectedClient ? selectedClient.name : 'Nuevo Registro'}</h2>
                                        {selectedClient && <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">Registrado el {new Date(selectedClient.createdAt).toLocaleDateString()}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {selectedClient && (
                                        <button 
                                            onClick={() => window.location.href=`/dashboard/quotes?clientId=${selectedClient.id}`}
                                            className="px-5 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold text-sm rounded-lg transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <FileText size={16} /> CREAR COTIZACIÓN
                                        </button>
                                    )}
                                    <button onClick={handleSaveClient} className="px-5 py-2.5 bg-[#0F172A] text-white hover:bg-[#1E293B] font-bold text-sm rounded-lg transition-all flex items-center gap-2 shadow-sm">
                                        <Save size={16} /> GUARDAR
                                    </button>
                                    <button onClick={() => setIsDrawerOpen(false)} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Tabs */}
                            <div className="flex px-8 border-b border-slate-200 bg-white">
                                <DrawerTab active={activeTab === "RESUMEN"} onClick={() => setActiveTab("RESUMEN")} label="Perfil del Cliente" />
                                <DrawerTab active={activeTab === "BITACORA"} onClick={() => setActiveTab("BITACORA")} label="Bitácora y Notas" />
                                {selectedClient && <DrawerTab active={activeTab === "COTIZACIONES"} onClick={() => setActiveTab("COTIZACIONES")} label="Historial de Cotizaciones" />}
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] custom-scrollbar">
                                {activeTab === "RESUMEN" && (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        {/* Status & Category Strip */}
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-8">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Estado Actual</label>
                                                <select 
                                                    value={editForm.status || "PROSPECTO"}
                                                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                                    className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                >
                                                    <option value="PROSPECTO">PROSPECTO (NUEVO)</option>
                                                    <option value="COTIZANDO">COTIZANDO (EN ATENCIÓN)</option>
                                                    <option value="NEGOCIACION">EN NEGOCIACIÓN</option>
                                                    <option value="ACTIVO">CIERRE GANADO (CLIENTE)</option>
                                                    <option value="INACTIVO">PERDIDO / INACTIVO</option>
                                                </select>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Asignación en Playlists (Etiquetas)</label>
                                                <input 
                                                    type="text"
                                                    placeholder="Ej: VIP, Navidad, Corporativo..."
                                                    value={editForm.tags || ""}
                                                    onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                                                    className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                            <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                                <User size={16} className="text-indigo-600" /> Información Principal
                                            </h3>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                                <ProInput label="Nombres" value={editForm.firstName || ""} onChange={(v: string) => setEditForm({...editForm, firstName: v})} />
                                                <ProInput label="Apellidos" value={editForm.lastName || ""} onChange={(v: string) => setEditForm({...editForm, lastName: v})} />
                                                <ProInput label="Cédula / RUC" value={editForm.cedula || ""} onChange={(v: string) => setEditForm({...editForm, cedula: v})} />
                                                <ProInput label="Correo Electrónico" value={editForm.email || ""} onChange={(v: string) => setEditForm({...editForm, email: v})} type="email" />
                                                <ProInput label="Teléfono / WhatsApp" value={editForm.phone || ""} onChange={(v: string) => setEditForm({...editForm, phone: v})} />
                                                <ProInput label="Ciudad / Dirección" value={editForm.city || ""} onChange={(v: string) => setEditForm({...editForm, city: v})} />
                                            </div>
                                        </div>

                                        {selectedClient && (
                                            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                                    <BarChart3 size={16} className="text-indigo-600" /> Métricas de Relación
                                                </h3>
                                                <div className="grid grid-cols-4 gap-6">
                                                    <MetricCard label="Compras" value={editForm.purchaseCount || 0} icon={<ShoppingBag size={18} className="text-emerald-500" />} />
                                                    <MetricCard label="Cotizaciones" value={editForm.quotes?.length || 0} icon={<FileText size={18} className="text-blue-500" />} />
                                                    <MetricCard label="Promociones" value={editForm.campaignsSent || 0} icon={<Zap size={18} className="text-amber-500" />} />
                                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-2"><Calendar size={18} className="text-indigo-500" /> <span className="text-[10px] font-black uppercase text-slate-500">Última Promo</span></div>
                                                        <p className="text-lg font-bold text-[#0F172A]">{editForm.lastPromotion ? new Date(editForm.lastPromotion).toLocaleDateString() : 'Ninguna'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "BITACORA" && (
                                    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                                <Edit2 size={16} />
                                            </div>
                                            <div className="flex-1 flex gap-3">
                                                <textarea 
                                                    value={newObservation}
                                                    onChange={(e) => setNewObservation(e.target.value)}
                                                    placeholder="Registra una nueva llamada, reunión, o nota de seguimiento para este cliente..."
                                                    className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 min-h-[80px] resize-none shadow-sm"
                                                />
                                                <button 
                                                    onClick={handleAddObservation}
                                                    className="bg-indigo-600 text-white px-6 font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm self-end h-[42px]"
                                                >
                                                    Publicar
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
                                            {/* Timeline Line */}
                                            <div className="absolute left-12 top-8 bottom-8 w-px bg-slate-200 z-0"></div>
                                            
                                            <div className="space-y-8 relative z-10">
                                                {(!editForm.requirement || editForm.requirement.trim() === "") ? (
                                                    <div className="text-center py-10 text-slate-400 font-medium">No hay registros en la bitácora todavía.</div>
                                                ) : (
                                                    editForm.requirement.split('\n').filter((l: string) => l.trim() !== "").reverse().map((line: string, i: number) => {
                                                        const match = line.match(/\[(.*?)\] (.*?): (.*)/);
                                                        if (match) {
                                                            return (
                                                                <div key={i} className="flex gap-6 group">
                                                                    <div className="w-8 h-8 rounded-full bg-white border-4 border-slate-100 shadow-sm flex items-center justify-center shrink-0 z-10 group-hover:border-indigo-100 transition-colors">
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors"></div>
                                                                    </div>
                                                                    <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm group-hover:shadow-md group-hover:border-indigo-200 transition-all">
                                                                        <div className="flex justify-between items-center mb-2">
                                                                            <span className="text-sm font-bold text-[#0F172A]">{match[2]}</span>
                                                                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{match[1]}</span>
                                                                        </div>
                                                                        <p className="text-slate-600 text-sm leading-relaxed">{match[3]}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        return (
                                                            <div key={i} className="flex gap-6 pl-14 text-sm text-slate-500 italic">
                                                                {line}
                                                            </div>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "COTIZACIONES" && selectedClient && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        {!selectedClient.quotes || selectedClient.quotes.length === 0 ? (
                                            <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-slate-400 space-y-4">
                                                <FileText size={48} className="text-slate-300" />
                                                <p className="text-sm font-medium">Este cliente aún no tiene cotizaciones generadas.</p>
                                                <button onClick={() => window.location.href=`/dashboard/quotes?clientId=${selectedClient.id}`} className="mt-2 text-indigo-600 font-bold hover:underline">Crear primera cotización</button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-6">
                                                {selectedClient.quotes.map((q: any) => (
                                                    <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                    <FileText size={20} />
                                                                </div>
                                                                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md uppercase">{q.status}</span>
                                                            </div>
                                                            <h4 className="text-lg font-black text-[#0F172A] mb-1">{q.quoteNumber}</h4>
                                                            <p className="text-xs font-medium text-slate-500 mb-6">{new Date(q.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <p className="text-2xl font-black text-emerald-600">${q.total.toFixed(2)}</p>
                                                            {q.pdfUrl && (
                                                                <a href={q.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors">
                                                                    Ver PDF
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function PlaylistButton({ active, onClick, icon, label, count }: any) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-sm font-bold ${
                active 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
            <div className="flex items-center gap-3">
                <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</span>
                <span className="truncate max-w-[140px] text-left">{label}</span>
            </div>
            {count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                    {count}
                </span>
            )}
        </button>
    )
}

function DrawerTab({ active, onClick, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`px-6 py-4 border-b-2 transition-all font-bold text-sm ${
                active 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
        >
            {label}
        </button>
    )
}

function ProInput({ label, value, onChange, type = "text" }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{label}</label>
            <input 
                type={type}
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase"
            />
        </div>
    )
}

function MetricCard({ label, value, icon }: any) {
    return (
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
                {icon} <span className="text-[10px] font-black uppercase text-slate-500">{label}</span>
            </div>
            <p className="text-2xl font-black text-[#0F172A]">{value}</p>
        </div>
    )
}
