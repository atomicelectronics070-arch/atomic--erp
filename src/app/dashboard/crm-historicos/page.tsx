"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, Plus, UserPlus, FileText, Database, User, Calendar, 
    MessageSquare, Clock, MapPin, Phone, Mail, Edit2, 
    Save, X, Filter, BarChart3, ChevronRight, Zap, Target
} from "lucide-react"

export default function CRMHistoricosPage() {
    const { data: session } = useSession()
    const role = session?.user?.role || "USER"
    const isAdmin = role === "ADMIN" || role === "MANAGEMENT"
    const currentUserId = session?.user?.id

    const [clients, setClients] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSalesperson, setSelectedSalesperson] = useState<string>("ALL")
    
    // Selection
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<"DATOS" | "HISTORIAL" | "COTIZACIONES">("DATOS")
    
    // Forms
    const [isAddingClient, setIsAddingClient] = useState(false)
    const [editForm, setEditForm] = useState<any>({})
    const [newObservation, setNewObservation] = useState("")

    useEffect(() => {
        fetchClients()
        if (isAdmin) {
            fetchUsers()
        }
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

    const handleSelectClient = (client: any) => {
        setSelectedClient(client)
        setEditForm({ ...client })
        setActiveTab("DATOS")
    }

    const handleSaveClient = async () => {
        try {
            const method = isAddingClient ? "POST" : "PUT"
            const url = isAddingClient ? "/api/crm" : `/api/crm/${selectedClient.id}`
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            })
            if (res.ok) {
                fetchClients()
                setIsAddingClient(false)
                if (isAddingClient) {
                    const newClient = await res.json()
                    handleSelectClient(newClient)
                } else {
                    const updated = await res.json()
                    setSelectedClient(updated)
                }
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

    // Filter Logic
    let filteredClients = clients.filter(c => {
        const matchesSearch = `${c.firstName || ""} ${c.lastName || ""} ${c.name || ""} ${c.email || ""} ${c.phone || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        
        const matchesUser = selectedSalesperson === "ALL" 
            ? true 
            : c.salesperson?.id === selectedSalesperson
            
        // If not admin, strictly force filter to own clients unless assigned otherwise
        if (!isAdmin && c.salesperson?.id !== currentUserId) {
             return false;
        }

        return matchesSearch && matchesUser
    })

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-[#00F0FF]/30 p-4 lg:p-8 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00F0FF]/20 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[150px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 h-[calc(100vh-100px)] flex gap-6">
                
                {/* LEFT PANEL: DATABASE EXPLORER */}
                <div className="w-[400px] flex flex-col bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="p-6 border-b border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-pulse" />
                                <h1 className="text-xl font-black uppercase tracking-tighter italic">CRM <span className="text-[#00F0FF]">HISTÓRICOS</span></h1>
                            </div>
                            <button 
                                onClick={() => { setIsAddingClient(true); setSelectedClient(null); setEditForm({ status: "PROSPECTO", source: "MANUAL", purchaseCount: 0 }); }}
                                className="w-8 h-8 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 hover:bg-[#00F0FF] hover:text-slate-950 transition-all flex items-center justify-center"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="BUSCAR CLIENTE O LEAD..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/5 pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest italic outline-none focus:border-[#00F0FF]/30 transition-all text-white"
                                />
                            </div>
                            {isAdmin && (
                                <div className="flex items-center gap-2">
                                    <Filter size={14} className="text-slate-500" />
                                    <select 
                                        value={selectedSalesperson}
                                        onChange={(e) => setSelectedSalesperson(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/5 p-3 text-[9px] font-black uppercase tracking-widest italic outline-none focus:border-indigo-500/30 text-white"
                                    >
                                        <option value="ALL">TODOS LOS ASESORES (GLOBAL)</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {loading ? (
                            <div className="p-8 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] italic animate-pulse">Cargando Base de Datos...</div>
                        ) : (
                            filteredClients.map(client => (
                                <div 
                                    key={client.id}
                                    onClick={() => handleSelectClient(client)}
                                    className={`p-5 cursor-pointer transition-all border-l-2 group ${selectedClient?.id === client.id ? 'bg-[#00F0FF]/5 border-[#00F0FF]' : 'border-transparent hover:bg-white/[0.02]'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-[12px] font-black uppercase tracking-tight italic group-hover:text-[#00F0FF] transition-colors truncate w-[200px]">
                                            {client.name}
                                        </h4>
                                        <span className={`text-[8px] font-black px-2 py-0.5 italic ${client.status === 'ACTIVO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {client.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1 text-[9px] font-bold italic text-slate-500">
                                            <div className="flex items-center gap-1"><User size={10} className="text-[#00F0FF]/50" /> {client.salesperson?.name || 'SISTEMA'}</div>
                                            <div className="flex items-center gap-1"><Clock size={10} className="text-indigo-400/50" /> {new Date(client.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="text-[8px] text-white/20 uppercase tracking-widest">{client.source}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: MEGA PROFESSIONAL CLIENT INTERFACE */}
                <div className="flex-1 bg-slate-950/60 backdrop-blur-xl border border-white/10 flex flex-col relative overflow-hidden">
                    {isAddingClient ? (
                        <div className="p-12 h-full overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-8 border-b border-white/10 pb-6 flex items-center gap-4">
                                <UserPlus className="text-[#00F0FF]" /> NUEVO INGRESO A BASE DE DATOS
                            </h2>
                            <div className="grid grid-cols-2 gap-8 max-w-4xl">
                                <InputField label="Nombres" value={editForm.firstName || ""} onChange={(v: string) => setEditForm({...editForm, firstName: v})} />
                                <InputField label="Apellidos" value={editForm.lastName || ""} onChange={(v: string) => setEditForm({...editForm, lastName: v})} />
                                <InputField label="Cédula / Identidad" value={editForm.cedula || ""} onChange={(v: string) => setEditForm({...editForm, cedula: v})} />
                                <InputField label="Email" value={editForm.email || ""} onChange={(v: string) => setEditForm({...editForm, email: v})} />
                                <InputField label="Teléfono (WA)" value={editForm.phone || ""} onChange={(v: string) => setEditForm({...editForm, phone: v})} />
                                <InputField label="Ciudad / Sede" value={editForm.city || ""} onChange={(v: string) => setEditForm({...editForm, city: v})} />
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Origen / Campaña</label>
                                    <select 
                                        value={editForm.source || "MANUAL"}
                                        onChange={(e) => setEditForm({...editForm, source: e.target.value})}
                                        className="w-full bg-slate-900 border border-white/5 p-4 text-[12px] font-bold text-white italic outline-none focus:border-[#00F0FF]/40"
                                    >
                                        <option value="MANUAL">REGISTRO MANUAL</option>
                                        <option value="META_ADS">META ADS</option>
                                        <option value="GOOGLE_ADS">GOOGLE ADS</option>
                                        <option value="REFERIDO">REFERIDO</option>
                                        <option value="WEB">PÁGINA WEB</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Requerimiento Inicial</label>
                                    <textarea 
                                        value={editForm.requirement || ""}
                                        onChange={(e) => setEditForm({...editForm, requirement: e.target.value})}
                                        className="w-full bg-slate-900 border border-white/5 p-4 text-[12px] font-bold text-white italic outline-none focus:border-[#00F0FF]/40 min-h-[120px] resize-none"
                                    />
                                </div>
                            </div>
                            <div className="mt-12 flex gap-4">
                                <button onClick={handleSaveClient} className="bg-[#00F0FF] text-slate-950 px-10 py-4 font-black uppercase tracking-widest italic hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                                    REGISTRAR CLIENTE
                                </button>
                                <button onClick={() => setIsAddingClient(false)} className="bg-slate-900 border border-white/10 text-white px-10 py-4 font-black uppercase tracking-widest italic hover:bg-white/5 transition-all">
                                    CANCELAR
                                </button>
                            </div>
                        </div>
                    ) : selectedClient ? (
                        <>
                            {/* Client Header */}
                            <div className="p-10 border-b border-white/5 bg-gradient-to-r from-slate-950 to-slate-900/50">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 bg-slate-900 border-2 border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] flex items-center justify-center text-3xl font-black text-[#00F0FF] italic">
                                            {selectedClient.name?.[0]}
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
                                                {selectedClient.name}
                                                <span className={`text-[10px] font-black px-3 py-1 tracking-widest ${selectedClient.status === 'ACTIVO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'}`}>
                                                    {selectedClient.status}
                                                </span>
                                            </h2>
                                            <div className="flex gap-6 mt-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                                    <Target size={14} className="text-indigo-400" /> ORIGEN: {selectedClient.source}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                                    <User size={14} className="text-[#00F0FF]" /> ASIGNADO A: {selectedClient.salesperson?.name || 'SISTEMA'}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                                    <Calendar size={14} className="text-amber-400" /> ENTRADA: {new Date(selectedClient.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => window.location.href=`/dashboard/quotes?clientId=${selectedClient.id}`}
                                            className="bg-indigo-600/20 border border-indigo-500/50 hover:bg-indigo-600 text-white px-6 py-3 font-black uppercase tracking-widest italic transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                                        >
                                            <FileText size={14} /> COTIZACIÓN FORMAL
                                        </button>
                                        <button onClick={handleSaveClient} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 font-black uppercase tracking-widest italic transition-all flex items-center gap-2">
                                            <Save size={14} /> GUARDAR CAMBIOS
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-white/5 bg-slate-950/80 px-10">
                                <TabButton active={activeTab === "DATOS"} onClick={() => setActiveTab("DATOS")} icon={<Database size={14}/>} label="Perfil & Datos" />
                                <TabButton active={activeTab === "HISTORIAL"} onClick={() => setActiveTab("HISTORIAL")} icon={<MessageSquare size={14}/>} label="Historial de Observaciones" />
                                <TabButton active={activeTab === "COTIZACIONES"} onClick={() => setActiveTab("COTIZACIONES")} icon={<FileText size={14}/>} label="Playlist Cotizaciones" badge={selectedClient.quotes?.length || 0} />
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                                {activeTab === "DATOS" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {/* Metrics Row */}
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="bg-slate-900 border border-white/5 p-4 border-l-4 border-l-emerald-500 flex flex-col justify-between">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic mb-1">VENTAS CERRADAS</p>
                                                <p className="text-3xl font-black text-white italic">{selectedClient.purchaseCount || 0}</p>
                                            </div>
                                            <div className="bg-slate-900 border border-white/5 p-4 border-l-4 border-l-[#00F0FF] flex flex-col justify-between">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic mb-1">COTIZACIONES (PLAYLIST)</p>
                                                <p className="text-3xl font-black text-white italic">{selectedClient.quotes?.length || 0}</p>
                                            </div>
                                            <div className="bg-slate-900 border border-white/5 p-4 border-l-4 border-l-indigo-500 flex flex-col justify-between">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic mb-1">PROMOCIONES ENVIADAS</p>
                                                <p className="text-3xl font-black text-white italic">{selectedClient.campaignsSent || 0}</p>
                                            </div>
                                            <div className="bg-slate-900 border border-white/5 p-4 border-l-4 border-l-amber-500 flex flex-col justify-between">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic mb-1">ÚLTIMA PROMOCIÓN</p>
                                                <p className="text-[12px] font-black text-white italic mt-2">
                                                    {selectedClient.lastPromotion ? new Date(selectedClient.lastPromotion).toLocaleDateString() : 'NUNCA'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <InputField label="Nombres" value={editForm.firstName || ""} onChange={(v: string) => setEditForm({...editForm, firstName: v})} />
                                            <InputField label="Apellidos" value={editForm.lastName || ""} onChange={(v: string) => setEditForm({...editForm, lastName: v})} />
                                            <InputField label="Cédula / Identidad" value={editForm.cedula || ""} onChange={(v: string) => setEditForm({...editForm, cedula: v})} />
                                            <InputField label="Email Corporativo / Personal" value={editForm.email || ""} onChange={(v: string) => setEditForm({...editForm, email: v})} />
                                            <InputField label="Línea Directa (WhatsApp)" value={editForm.phone || ""} onChange={(v: string) => setEditForm({...editForm, phone: v})} />
                                            <InputField label="Ubicación Geográfica" value={editForm.city || ""} onChange={(v: string) => setEditForm({...editForm, city: v})} />
                                            <InputField label="Etiquetas (Atención al Cliente)" value={editForm.tags || ""} onChange={(v: string) => setEditForm({...editForm, tags: v})} />
                                            
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Estado de Proceso</label>
                                                <select 
                                                    value={editForm.status || "PROSPECTO"}
                                                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                                    className="w-full bg-slate-900 border border-white/5 p-4 text-[12px] font-bold text-[#00F0FF] italic outline-none focus:border-[#00F0FF]/40"
                                                >
                                                    <option value="PROSPECTO">PROSPECTO (NUEVO)</option>
                                                    <option value="COTIZANDO">COTIZANDO (EN ATENCIÓN)</option>
                                                    <option value="NEGOCIACION">EN NEGOCIACIÓN</option>
                                                    <option value="ACTIVO">CIERRE GANADO (CLIENTE)</option>
                                                    <option value="INACTIVO">PERDIDO / INACTIVO</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "HISTORIAL" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
                                        <div className="flex-1 bg-slate-900/80 border border-white/5 overflow-hidden flex flex-col shadow-inner">
                                            <div className="bg-slate-950 p-4 border-b border-white/10 flex items-center justify-between">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00F0FF] italic flex items-center gap-2">
                                                    <Database size={12}/> BITÁCORA DE OBSERVACIONES DE CLIENTE
                                                </h3>
                                            </div>
                                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                                <table className="w-full text-left text-[11px] text-slate-300">
                                                    <thead className="bg-slate-900 border-b border-white/10 text-[9px] uppercase tracking-widest text-slate-500 font-black italic sticky top-0 backdrop-blur-xl">
                                                        <tr>
                                                            <th className="p-4 border-r border-white/5">Fecha y Hora</th>
                                                            <th className="p-4 border-r border-white/5">Autor</th>
                                                            <th className="p-4">Observación Registrada</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(!editForm.requirement || editForm.requirement.trim() === "") ? (
                                                            <tr>
                                                                <td colSpan={3} className="p-8 text-center text-slate-500 font-mono italic">NO HAY REGISTROS HISTÓRICOS AÚN. INICIA LA BITÁCORA.</td>
                                                            </tr>
                                                        ) : (
                                                            editForm.requirement.split('\n').filter((l: string) => l.trim() !== "").reverse().map((line: string, i: number) => {
                                                                // Parse format: [timestamp] Author: Note
                                                                const match = line.match(/\[(.*?)\] (.*?): (.*)/);
                                                                if (match) {
                                                                    return (
                                                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors font-mono group">
                                                                            <td className="p-4 border-r border-white/5 whitespace-nowrap text-indigo-400 group-hover:text-indigo-300">{match[1]}</td>
                                                                            <td className="p-4 border-r border-white/5 whitespace-nowrap text-[#00F0FF]/80 group-hover:text-[#00F0FF] font-bold">{match[2]}</td>
                                                                            <td className="p-4 text-white/80 group-hover:text-white">{match[3]}</td>
                                                                        </tr>
                                                                    );
                                                                }
                                                                return (
                                                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors font-mono">
                                                                        <td colSpan={3} className="p-4 text-white/80">{line}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 border border-white/10 p-6 shadow-2xl">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00F0FF] italic mb-4 flex items-center gap-2">
                                                <Edit2 size={12}/> AÑADIR OBSERVACIÓN AL HISTORIAL
                                            </h3>
                                            <div className="flex gap-4">
                                                <textarea 
                                                    value={newObservation}
                                                    onChange={(e) => setNewObservation(e.target.value)}
                                                    placeholder="REDACTA UNA NOTA, REUNIÓN O EVENTO RELEVANTE..."
                                                    className="flex-1 bg-slate-950 border border-white/5 p-4 text-[12px] text-white italic outline-none focus:border-[#00F0FF]/50 min-h-[80px] resize-none"
                                                />
                                                <button 
                                                    onClick={handleAddObservation}
                                                    className="bg-indigo-600 text-white px-8 font-black uppercase tracking-widest italic hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                                                >
                                                    REGISTRAR
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "COTIZACIONES" && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex justify-between items-center bg-slate-900/50 p-6 border border-[#00F0FF]/10">
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">PLAYLIST DE COTIZACIONES</h3>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">HISTÓRICO EXCLUSIVO DE OFERTAS</p>
                                            </div>
                                            <button 
                                                onClick={() => window.location.href='/dashboard/quotes'}
                                                className="bg-white text-slate-950 px-6 py-3 text-[10px] font-black uppercase tracking-widest italic hover:bg-[#00F0FF] transition-all flex items-center gap-2"
                                            >
                                                <Plus size={14} /> GENERAR NUEVA
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {!selectedClient.quotes || selectedClient.quotes.length === 0 ? (
                                                <div className="text-center py-20 border border-dashed border-white/10 bg-white/[0.01]">
                                                    <FileText size={40} className="text-slate-600 mx-auto mb-4" />
                                                    <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-500 italic">SIN COTIZACIONES EMITIDAS</p>
                                                </div>
                                            ) : (
                                                selectedClient.quotes.map((q: any) => (
                                                    <div key={q.id} className="bg-slate-900 border border-white/5 p-6 flex justify-between items-center hover:border-indigo-500/50 transition-all group">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-lg font-black uppercase tracking-tighter italic text-white group-hover:text-indigo-400 transition-colors">{q.quoteNumber}</p>
                                                                <div className="flex items-center gap-4 mt-1 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">
                                                                    <span>FECHA: {new Date(q.createdAt).toLocaleDateString()}</span>
                                                                    <span>STATUS: <span className="text-white">{q.status}</span></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-black italic text-emerald-400">${q.total.toFixed(2)}</p>
                                                            {q.pdfUrl ? (
                                                                <a href={q.pdfUrl} target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF] hover:underline mt-1 block italic">
                                                                    VER PDF TÁCTICO
                                                                </a>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/5 bg-[url('/globe.svg')] bg-center bg-no-repeat bg-contain opacity-20">
                            <Database size={100} className="mb-8 drop-shadow-[0_0_30px_rgba(0,240,255,0.2)]" />
                            <p className="text-3xl font-black uppercase tracking-[0.5em] italic">CRM_HISTÓRICOS</p>
                            <p className="text-[12px] font-bold tracking-widest uppercase mt-4 text-[#00F0FF]/50">SELECCIONE O CREE UN REGISTRO EN LA BASE DE DATOS</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function TabButton({ active, onClick, icon, label, badge }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 px-8 py-5 border-b-2 transition-all ${active ? 'border-[#00F0FF] bg-[#00F0FF]/5 text-[#00F0FF]' : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
            {icon}
            <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
            {badge !== undefined && (
                <span className={`px-2 py-0.5 text-[9px] font-black italic ${active ? 'bg-[#00F0FF] text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {badge}
                </span>
            )}
        </button>
    )
}

function InputField({ label, value, onChange, type = "text" }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">{label}</label>
            <input 
                type={type}
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 p-4 text-[12px] font-bold text-white italic outline-none focus:border-[#00F0FF]/40 transition-all uppercase"
            />
        </div>
    )
}
