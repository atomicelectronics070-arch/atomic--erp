"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Phone, Mail, MoreVertical, UserPlus, Filter, Download, Trash2, Edit2, Globe, Users, Navigation, MapPin, Tag, Briefcase, Calendar, ChevronRight, X, BarChart3, TrendingUp, CheckCircle2, ShieldAlert, Save } from "lucide-react"

export default function AdvancedCRMPage() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Panel/Modal State
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "", city: "",
        requirement: "", status: "PROSPECTO", campaignsSent: 0, purchaseCount: 0
    })

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/crm")
            const data = await res.json()
            setClients(Array.isArray(data) ? data : [])
        } catch (e) {
            console.error("Error loading clients", e)
        } finally {
            setLoading(false)
        }
    }

    const filteredClients = clients.filter(client => {
        const searchStr = `${client.firstName || ''} ${client.lastName || ''} ${client.name || ''} ${client.email || ''} ${client.city || ''} ${client.requirement || ''}`.toLowerCase()
        const matchesSearch = searchStr.includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || (client.status || '').toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    const handleSaveClient = async () => {
        if (!formData.firstName || !formData.email || !formData.phone) {
            alert("Por favor llena los campos obligatorios: Nombres, Correo y Teléfono.");
            return;
        }

        const method = editingId ? "PUT" : "POST"
        const endpoint = editingId ? `/api/crm/${editingId}` : "/api/crm"

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                fetchClients()
                closePanel()
            } else {
                const data = await res.json();
                alert(data.error || "Error al intentar guardar el registro.");
                console.error("Server Error:", data);
            }
        } catch (e) {
            console.error("Error saving client", e)
            alert("Error de conexión con el servidor.");
        }
    }

    const handleDeleteClient = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm("¿Confirmar eliminación crítica del prospecto?")) {
            try {
                const res = await fetch(`/api/crm/${id}`, { method: "DELETE" })
                if (res.ok) fetchClients()
            } catch (e) {
                console.error("Error deleting client", e)
            }
        }
    }

    const openCreatePanel = () => {
        setEditingId(null)
        setFormData({ firstName: "", lastName: "", email: "", phone: "", city: "", requirement: "", status: "PROSPECTO", campaignsSent: 0, purchaseCount: 0 })
        setIsPanelOpen(true)
    }

    const openEditPanel = (client: any) => {
        setEditingId(client.id)
        setFormData({
            firstName: client.firstName || "",
            lastName: client.lastName || "",
            email: client.email || "",
            phone: client.phone || "",
            city: client.city || "",
            requirement: client.requirement || "",
            status: client.status || "PROSPECTO",
            campaignsSent: client.campaignsSent || 0,
            purchaseCount: client.purchaseCount || 0
        })
        setIsPanelOpen(true)
    }

    const closePanel = () => {
        setIsPanelOpen(false)
        setEditingId(null)
    }

    // Stats
    const totalClients = clients.length
    const activeClients = clients.filter(c => c.status === "ACTIVO").length
    const avgPurchases = totalClients > 0 ? (clients.reduce((acc, c) => acc + (c.purchaseCount || 0), 0) / totalClients).toFixed(1) : "0"

    return (
        <div className="space-y-12 lg:min-h-screen flex flex-col relative w-full overflow-hidden pb-32 animate-in fade-in duration-1000">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-azure-500/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] rounded-full bg-tomato-500/5 blur-[100px]" />
            </div>

            {/* HEADERS & METRICS */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <Briefcase size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em]">ECOSISTEMA DE RELACIONES</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Centro <span className="text-secondary">CRM</span></h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-4 max-w-2xl leading-relaxed">Gestión táctica de prospectos, fidelización de nodos activos y análisis de conversión corporativa en tiempo real.</p>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                    <button className="p-5 glass-panel text-slate-500 hover:text-white transition-all rounded-2xl border-white/5 group">
                        <Download size={22} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={openCreatePanel}
                        className="flex items-center space-x-5 bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-secondary transition-all shadow-[0_20px_50px_-10px_rgba(255,99,71,0.4)] rounded-2xl active:scale-[0.98] group"
                    >
                        <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span>Inyectar Registro</span>
                    </button>
                </div>
            </div>

            {/* KPI BAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <StatCard label="Base Maestros" value={totalClients.toString()} icon={<Users size={28} />} color="slate" />
                <StatCard label="Cartera Activa" value={activeClients.toString()} icon={<TrendingUp size={28} />} color="secondary" />
                <StatCard label="Retención Promedio" value={avgPurchases.toString()} icon={<BarChart3 size={28} />} color="azure" />
                <StatCard label="Tasa Conversión" value={`${totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}%`} icon={<CheckCircle2 size={28} />} color="secondary" showPulse />
            </div>

            {/* DATA GRID */}
            <div className="flex-1 glass-panel !bg-slate-950/40 border-white/5 shadow-2xl overflow-hidden flex flex-col relative z-10 rounded-[3rem] border backdrop-blur-3xl">
                {/* Toolbar */}
                <div className="p-10 border-b border-white/5 bg-white/[0.01] flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="relative w-full lg:max-w-2xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-secondary transition-colors" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ESCANEAR ECOSISTEMA DE CLIENTES..."
                            className="w-full pl-16 pr-8 py-5 bg-slate-900 border border-white/5 text-white text-[11px] font-black uppercase tracking-[0.2em] focus:border-secondary transition-all outline-none rounded-2xl placeholder:text-slate-800"
                        />
                    </div>
                    <div className="flex w-full lg:w-auto items-center space-x-6">
                        <div className="flex items-center gap-3">
                            <Filter size={14} className="text-slate-500" />
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest italic">Protocolo Estatus:</span>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full lg:w-72 px-8 py-5 bg-slate-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-secondary outline-none rounded-2xl cursor-pointer hover:bg-slate-800 transition-all shadow-inner"
                        >
                            <option value="all">TODOS LOS NODOS</option>
                            <option value="activo">DISEÑOS ACTIVOS</option>
                            <option value="prospecto">FASES PROSPECTO</option>
                            <option value="inactivo">PROTOCOLOS RECHAZADOS</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                        <thead className="text-[9px] text-slate-500 bg-slate-950/60 uppercase font-black tracking-[0.5em] sticky top-0 z-20 backdrop-blur-xl border-b border-white/5">
                            <tr>
                                <th className="px-10 py-8 italic underline underline-offset-8 decoration-secondary/30">Identificador / Nombre</th>
                                <th className="px-10 py-8">Contacto Central</th>
                                <th className="px-10 py-8">Ubicación Geo</th>
                                <th className="px-10 py-8 max-w-[300px]">Requerimiento Industrial</th>
                                <th className="px-10 py-8 text-center">Protocolos</th>
                                <th className="px-10 py-8 text-center">Estado</th>
                                <th className="px-10 py-8 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading && clients.length === 0 && (
                                <tr><td colSpan={7} className="p-32 text-center text-[11px] text-secondary font-black uppercase tracking-[0.8em] animate-pulse italic">SINCRONIZANDO BASE DE INTELIGENCIA CRM...</td></tr>
                            )}
                            {!loading && filteredClients.length === 0 && (
                                <tr><td colSpan={7} className="p-40 text-center">
                                    <div className="flex flex-col items-center gap-6 grayscale opacity-20">
                                        <Users size={80} />
                                        <p className="text-[11px] text-white font-black uppercase tracking-[0.6em]">Protocolo Cero: Sin Coincidencias</p>
                                    </div>
                                </td></tr>
                            )}
                            {filteredClients.map((client) => (
                                <tr key={client.id}
                                    onClick={() => openEditPanel(client)}
                                    className="hover:bg-white/[0.04] transition-all group relative border-b border-white/[0.02]"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-xs border border-white/5 group-hover:border-secondary/30 transition-all shadow-2xl">
                                                {(client.firstName?.[0] || client.name?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-white text-sm uppercase tracking-tighter group-hover:text-secondary transition-colors italic">
                                                    {client.firstName || client.lastName ? `${client.firstName || ''} ${client.lastName || ''}`.trim() : client.name}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-500 mt-1.5 uppercase tracking-[0.3em]">NÚCLEO: {new Date(client.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col space-y-2">
                                            <span className="flex items-center text-[10px] text-slate-400 font-black tracking-wider"><Mail size={14} className="mr-3 text-secondary/30" /> {client.email || 'N/A'}</span>
                                            <span className="flex items-center text-[10px] font-black text-white uppercase tracking-[0.2em]"><Phone size={14} className="mr-3 text-secondary/30" /> {client.phone || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="flex items-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black italic">
                                            <Navigation size={14} className="mr-3 text-secondary" /> {client.city || 'GLOBAL PROTOCOL'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 max-w-[300px]">
                                        <p className="text-[10px] text-slate-500 truncate leading-relaxed font-bold italic group-hover:text-slate-300 transition-colors">
                                            {client.requirement || 'Sin especificaciones técnicas'}
                                        </p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <span className="text-[9px] font-black px-4 py-1.5 bg-slate-900 text-white border border-white/5 rounded-xl uppercase tracking-widest group-hover:border-secondary/30 transition-all shadow-inner">
                                                {client.purchaseCount} <span className="text-secondary/60 ml-1">TRANSACCIONES</span>
                                            </span>
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">
                                                {client.campaignsSent} Impactos IA
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className={`px-5 py-2 text-[9px] font-black uppercase tracking-[0.3em] border rounded-[0.75rem] shadow-2xl italic ${
                                            client.status === 'ACTIVO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' :
                                            client.status === 'PROSPECTO' ? 'bg-secondary/10 text-secondary border-secondary/20 shadow-secondary/5' :
                                            'bg-slate-800/10 text-slate-500 border-white/5'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
                                            <button
                                                onClick={(e) => handleDeleteClient(client.id, e)}
                                                className="p-4 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl border border-red-500/10"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <button className="p-4 bg-secondary text-white hover:bg-white hover:text-secondary transition-all rounded-xl shadow-2xl shadow-secondary/20">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SIDE PANEL */}
            {isPanelOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 md:p-8">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl transition-opacity animate-in fade-in duration-700" onClick={closePanel} />
                    <div className={`fixed inset-y-0 right-0 w-full md:w-[650px] glass-panel !bg-slate-950/60 !border-l !border-white/10 z-50 shadow-[0_0_150px_rgba(0,0,0,1)] animate-in slide-in-from-right duration-700 flex flex-col md:rounded-l-[4rem]`}>
                        <div className="flex items-center justify-between p-12 border-b border-white/5 bg-white/[0.01] shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="bg-secondary p-4 rounded-2xl shadow-2xl shadow-secondary/30"><UserPlus size={24} className="text-white" /></div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                                        {editingId ? "Expediente Central" : "Nuevo Registro Nodo"}
                                    </h2>
                                    <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-[0.4em]">Protocolo de Identificación Industrial</p>
                                </div>
                            </div>
                            <button onClick={closePanel} className="text-slate-500 hover:text-white hover:rotate-90 transition-all duration-500 p-4 glass-panel !bg-slate-900 border-white/10 rounded-2xl">
                                <X size={28} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-16 space-y-16 custom-scrollbar">
                            <div className="space-y-10 group/sec">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                    <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_currentColor]" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white italic">Identidad Corporativa</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Nombres Maestro</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full p-6 bg-slate-900 border border-white/5 text-white text-[11px] font-black uppercase tracking-widest focus:border-secondary transition-all outline-none rounded-2xl placeholder:text-slate-800"
                                            placeholder="REGISTRAR NOMBRES..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Apellidos Familiares</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full p-6 bg-slate-900 border border-white/5 text-white text-[11px] font-black uppercase tracking-widest focus:border-secondary transition-all outline-none rounded-2xl placeholder:text-slate-800"
                                            placeholder="REGISTRAR APELLIDOS..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                    <div className="w-2 h-2 rounded-full bg-azure-500 shadow-[0_0_8px_currentColor]" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white italic">Conectividad y Nodo</h3>
                                </div>
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-2 italic"><Mail size={14} className="text-secondary" /> Email de Enlace</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full p-6 bg-slate-900 border border-white/5 text-white text-[11px] font-black tracking-[0.2em] focus:border-secondary outline-none rounded-2xl placeholder:text-slate-800"
                                            placeholder="DIRECCIÓN_MAESTRA@DOMINIO.COM"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-2 italic"><Phone size={14} className="text-secondary" /> Telefonía Móvil</label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full p-6 bg-slate-900 border border-white/5 text-white text-[11px] font-black tracking-widest focus:border-secondary outline-none rounded-2xl"
                                                placeholder="+52 XXX XXX XXXX"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-2 italic"><MapPin size={14} className="text-secondary" /> Ciudad Operativa</label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full p-6 bg-slate-900 border border-white/5 text-white text-[11px] font-black uppercase tracking-widest focus:border-secondary outline-none rounded-2xl"
                                                placeholder="METRÓPOLIS BASE"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_currentColor]" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white italic">Inteligencia Operativa</h3>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Análisis de Requerimiento Crítico</label>
                                    <textarea
                                        rows={4}
                                        value={formData.requirement}
                                        onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                                        className="w-full p-8 bg-slate-900 border border-white/5 text-white text-[11px] font-bold tracking-widest focus:border-secondary outline-none rounded-3xl resize-none placeholder:text-slate-800 leading-relaxed italic"
                                        placeholder="DESGLOSE MAESTRO DE NECESIDADES TÉCNICAS E INDUSTRIALES..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] text-center block italic">COMPRAS NETAS</label>
                                        <input
                                            type="number"
                                            value={formData.purchaseCount}
                                            onChange={(e) => setFormData({ ...formData, purchaseCount: parseInt(e.target.value) || 0 })}
                                            className="w-full p-6 bg-slate-900 border border-white/5 text-white text-base font-black text-center focus:border-secondary outline-none rounded-2xl shadow-inner"
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] text-center block italic">CAMPAÑAS IA</label>
                                        <input
                                            type="number"
                                            value={formData.campaignsSent}
                                            onChange={(e) => setFormData({ ...formData, campaignsSent: parseInt(e.target.value) || 0 })}
                                            className="w-full p-6 bg-slate-900 border border-white/5 text-white text-base font-black text-center focus:border-secondary outline-none rounded-2xl shadow-inner"
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] text-center block italic">ETAPA ACTUAL</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full p-6 bg-slate-900 border border-white/5 text-[10px] font-black uppercase text-white focus:border-secondary outline-none rounded-2xl h-[77px] cursor-pointer"
                                        >
                                            <option value="PROSPECTO">PROSPECTO</option>
                                            <option value="ACTIVO">NODO ACTIVO</option>
                                            <option value="INACTIVO">PROTOCOLO INACTIVO</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 border-t border-white/5 bg-white/[0.01] grid grid-cols-1 md:grid-cols-2 gap-8 shrink-0">
                            <button onClick={closePanel} className="py-6 text-[10px] font-black uppercase tracking-[0.5em] bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all rounded-3xl border border-white/5 active:scale-95 shadow-xl">
                                ABORTAR OPERACIÓN
                            </button>
                            <button onClick={handleSaveClient} className="py-6 text-[10px] font-black uppercase tracking-[0.5em] bg-secondary text-white hover:bg-white hover:text-secondary transition-all shadow-[0_20px_50px_-10px_rgba(255,99,71,0.4)] flex justify-center items-center gap-4 rounded-3xl active:scale-[0.98]">
                                <Save size={20} /> {editingId ? "COMPROMETER NODO" : "ENCRIPTAR REGISTRO"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatCard({ label, value, icon, color, showPulse = false }: any) {
    const colorClasses: any = {
        secondary: "text-secondary border-secondary/20 shadow-secondary/5",
        azure: "text-azure-400 border-azure-500/20 shadow-azure-500/5",
        slate: "text-white border-white/5 shadow-white/5"
    }

    return (
        <div className={`glass-panel p-10 border rounded-[2.5rem] flex items-center justify-between group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden ${colorClasses[color]}`}>
            {showPulse && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-secondary animate-ping" />}
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 italic group-hover:text-white transition-colors">{label}</p>
                <p className="text-5xl font-black text-white tracking-tighter italic leading-none">{value}</p>
            </div>
            <div className="p-5 bg-slate-900 rounded-2xl border border-white/5 shadow-2x group-hover:rotate-12 transition-transform duration-500 text-slate-500 group-hover:text-white">
                {icon}
            </div>
        </div>
    )
}
