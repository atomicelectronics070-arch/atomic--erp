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
    const avgPurchases = totalClients > 0 ? (clients.reduce((acc, c) => acc + (c.purchaseCount || 0), 0) / totalClients).toFixed(1) : 0

    return (
        <div className="space-y-10 lg:min-h-[85vh] flex flex-col relative w-full overflow-hidden pb-10 animate-in fade-in duration-1000">
            {/* HEADERS & METRICS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-4">
                        <div className="glass-panel !bg-slate-900 p-3 text-white rounded-2xl border-white/10">
                            <Briefcase size={24} className="text-secondary" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                            ATOMIC <span className="text-slate-600 font-light">|</span> <span className="text-secondary">PRO CRM</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Enterprise Customer Relationship Management v1.0.8 Stable</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button className="glass-panel border-white/5 text-slate-400 font-black py-3 px-6 text-[10px] uppercase tracking-widest flex items-center hover:text-white hover:bg-white/5 transition-all rounded-xl">
                        <Download size={14} className="mr-2" /> Exportar Inteligencia
                    </button>
                    <button
                        onClick={openCreatePanel}
                        className="bg-secondary hover:bg-white hover:text-secondary text-white font-black py-3 px-8 text-[10px] uppercase tracking-[0.2em] flex items-center transition-all shadow-[0_10px_30px_-5px_rgba(255,99,71,0.4)] rounded-xl active:scale-[0.98]"
                    >
                        <UserPlus size={18} className="mr-3" /> Nuevo Registro
                    </button>
                </div>
            </div>

            {/* HIGH LEVEL KPI BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="glass-panel p-6 border-white/5 flex items-center justify-between rounded-3xl hover:border-white/20 transition-all">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Base de Datos</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{totalClients}</p>
                    </div>
                    <Users className="text-slate-800" size={32} />
                </div>
                <div className="glass-panel p-6 border-secondary/20 flex items-center justify-between border-l-4 border-l-secondary rounded-3xl shadow-[0_10px_40px_-10px_rgba(255,99,71,0.1)]">
                    <div>
                        <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1">Cartera Activa</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{activeClients}</p>
                    </div>
                    <TrendingUp className="text-secondary/20" size={32} />
                </div>
                <div className="glass-panel p-6 border-white/5 flex items-center justify-between rounded-3xl">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ticket Retención</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{avgPurchases}</p>
                    </div>
                    <BarChart3 className="text-slate-800" size={32} />
                </div>
                <div className="glass-panel !bg-slate-950/60 p-6 border-white/5 flex items-center justify-between text-white rounded-3xl ring-1 ring-white/5 shadow-2xl">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tasa Conversión</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}%</p>
                    </div>
                    <CheckCircle2 className="text-secondary" size={32} />
                </div>
            </div>

            {/* DATA GRID */}
            <div className="flex-1 glass-panel border-white/5 shadow-2xl overflow-hidden flex flex-col relative z-10 rounded-[2rem]">
                {/* Grid Toolbar */}
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="relative w-full lg:w-1/2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar en el ecosistema de clientes..."
                            className="w-full pl-11 pr-6 py-3.5 bg-slate-900/40 border border-white/5 text-white text-[11px] font-black uppercase tracking-wider focus:ring-2 focus:ring-secondary/50 outline-none rounded-xl transition-all placeholder:text-slate-700"
                        />
                    </div>
                    <div className="flex w-full lg:w-auto items-center space-x-4">
                        <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Filtrar Estatus:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full lg:w-56 px-5 py-3.5 bg-slate-900/60 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-secondary/50 outline-none rounded-xl cursor-pointer hover:bg-slate-800/80 transition-all"
                        >
                            <option value="all">TODOS LOS REGISTROS</option>
                            <option value="activo">NODOS ACTIVOS</option>
                            <option value="prospecto">PROSPECTOS</option>
                            <option value="inactivo">RECHAZADOS</option>
                        </select>
                    </div>
                </div>

                {/* Desktop Grid View */}
                <div className="flex-1 overflow-auto scrollbar-hide">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                        <thead className="text-[9px] text-slate-500 bg-slate-950/40 uppercase font-black tracking-[0.4em] sticky top-0 z-20 backdrop-blur-md border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5">Identificador / Nombre</th>
                                <th className="px-8 py-5">Contacto Central</th>
                                <th className="px-8 py-5">Ubicación Geo</th>
                                <th className="px-8 py-5 max-w-[250px]">Requerimiento Industrial</th>
                                <th className="px-8 py-5 text-center">Fidelidad</th>
                                <th className="px-8 py-5 text-center">Estado</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading && clients.length === 0 && (
                                <tr><td colSpan={7} className="p-20 text-center text-[10px] text-secondary font-black uppercase tracking-[0.5em] animate-pulse">Sincronizando Base de Inteligencia...</td></tr>
                            )}
                            {!loading && filteredClients.length === 0 && (
                                <tr><td colSpan={7} className="p-32 text-center text-[10px] text-slate-700 font-black uppercase tracking-[0.5em]">Sin registros coincidentes en el sistema.</td></tr>
                            )}
                            {filteredClients.map((client) => (
                                <tr key={client.id}
                                    onClick={() => openEditPanel(client)}
                                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group relative"
                                >
                                    {/* Name & Date */}
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-white text-sm uppercase tracking-tight group-hover:text-secondary transition-colors">
                                                {client.firstName || client.lastName ? `${client.firstName || ''} ${client.lastName || ''}`.trim() : client.name}
                                            </span>
                                            <span className="text-[9px] font-black text-slate-600 mt-1 uppercase tracking-[0.2em]">Registro: {new Date(client.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col space-y-1.5">
                                            <span className="flex items-center text-[10px] text-slate-400 font-black"><Mail size={12} className="mr-3 text-secondary/60" /> {client.email || 'N/A'}</span>
                                            <span className="flex items-center text-[11px] font-black text-white tracking-widest"><Phone size={12} className="mr-3 text-secondary/60" /> {client.phone || 'N/A'}</span>
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-8 py-6">
                                        <span className="flex items-center text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
                                            <MapPin size={14} className="mr-2 text-slate-700" /> {client.city || 'GLOBAL'}
                                        </span>
                                    </td>

                                    {/* Requirement */}
                                    <td className="px-8 py-6 max-w-[250px]">
                                        <p className="text-[10px] text-slate-600 truncate leading-relaxed font-bold italic">
                                            "{client.requirement || 'Sin detalles'}"
                                        </p>
                                    </td>

                                    {/* Metrics */}
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center justify-center space-y-1.5">
                                            <span className="text-[9px] font-black px-3 py-1 bg-white/5 text-slate-400 border border-white/5 rounded-full uppercase tracking-widest group-hover:border-secondary/20 transition-all">
                                                {client.purchaseCount} TRANSACCIONES
                                            </span>
                                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">
                                                {client.campaignsSent} Campañas
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] border rounded-lg shadow-2xl ${
                                            client.status === 'ACTIVO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' :
                                            client.status === 'PROSPECTO' ? 'bg-secondary/10 text-secondary border-secondary/20 shadow-secondary/5' :
                                            'bg-slate-800/10 text-slate-500 border-white/5'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={(e) => handleDeleteClient(client.id, e)}
                                                className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl"
                                                title="Eliminar Registro"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openEditPanel(client); }}
                                                className="p-3 text-white bg-white/5 hover:bg-secondary hover:text-white transition-all rounded-xl border border-white/5 shadow-xl"
                                                title="Analizar Detalles"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SIDE PANEL: ADVANCED EDIT/CREATE */}
            {isPanelOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" onClick={closePanel} />

                    <div className={`fixed inset-y-0 right-0 w-full md:w-[550px] glass-panel !bg-slate-950/80 !border-l !border-white/10 z-50 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 flex flex-col`}>

                        <div className="flex items-center justify-between p-10 border-b border-white/5 bg-white/5 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="bg-secondary p-3 rounded-2xl shadow-[0_5px_20px_rgba(255,99,71,0.4)]"><UserPlus size={20} className="text-white" /></div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">
                                    {editingId ? "Expediente Central" : "Nuevo Registro Nodo"}
                                </h2>
                            </div>
                            <button onClick={closePanel} className="text-slate-500 hover:text-white hover:rotate-90 transition-all duration-300 p-3 glass-panel !bg-slate-900 border-white/10 rounded-xl">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">

                            {/* SECTION 1: Personal Data */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary border-b border-white/5 pb-4">Identidad Corporativa</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Nombres</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full p-4 bg-slate-900/60 border border-white/5 text-white text-xs font-black uppercase tracking-widest focus:border-secondary focus:ring-1 focus:ring-secondary/30 outline-none transition-all rounded-xl placeholder:text-slate-800"
                                            placeholder="JUAN CARLOS"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Apellidos</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full p-4 bg-slate-900/60 border border-white/5 text-white text-xs font-black uppercase tracking-widest focus:border-secondary focus:ring-1 focus:ring-secondary/30 outline-none transition-all rounded-xl placeholder:text-slate-800"
                                            placeholder="PÉREZ"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: Contact & Location */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary border-b border-white/5 pb-4">Conectividad y Nodo</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1"><Mail size={12} /> Email de Red <span className="text-secondary">*</span></label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full p-4 bg-slate-900/60 border border-white/5 text-white text-xs font-black tracking-[0.15em] focus:border-secondary outline-none rounded-xl placeholder:text-slate-800"
                                            placeholder="CORREO@ATOMIC.COM"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1"><Phone size={12} /> Enlace Móvil <span className="text-secondary">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full p-4 bg-slate-900/60 border border-white/5 text-white text-xs font-black tracking-widest focus:border-secondary outline-none rounded-xl"
                                                placeholder="+52 XXX XXX..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1"><MapPin size={12} /> Ciudad Base</label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full p-4 bg-slate-900/60 border border-white/5 text-white text-xs font-black uppercase tracking-widest focus:border-secondary outline-none rounded-xl"
                                                placeholder="MONTERREY"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: Business & Metrics */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary border-b border-white/5 pb-4">Inteligencia Operativa</h3>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Análisis de Requerimiento</label>
                                    <textarea
                                        value={formData.requirement}
                                        onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                                        className="w-full p-5 bg-slate-900/60 border border-white/5 text-white text-[11px] font-bold tracking-wide focus:border-secondary outline-none rounded-2xl resize-none min-h-[120px] placeholder:text-slate-800"
                                        placeholder="ESPECIFICACIONES TÉCNICAS Y NECESIDADES DEL CLIENTE..."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] text-center block">Compras</label>
                                        <input
                                            type="number"
                                            value={formData.purchaseCount}
                                            onChange={(e) => setFormData({ ...formData, purchaseCount: parseInt(e.target.value) || 0 })}
                                            className="w-full p-4 bg-slate-900/60 border border-white/5 text-white text-sm font-black text-center focus:border-secondary outline-none rounded-xl"
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] text-center block">Campañas</label>
                                        <input
                                            type="number"
                                            value={formData.campaignsSent}
                                            onChange={(e) => setFormData({ ...formData, campaignsSent: parseInt(e.target.value) || 0 })}
                                            className="w-full p-4 bg-slate-900/60 border border-white/5 text-white text-sm font-black text-center focus:border-secondary outline-none rounded-xl"
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] text-center block">Estatus</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full p-4 bg-slate-900/60 border border-white/5 text-[10px] font-black uppercase text-white text-center focus:border-secondary outline-none rounded-xl h-[53px] cursor-pointer"
                                        >
                                            <option value="PROSPECTO">PROSPECTO</option>
                                            <option value="ACTIVO">ACTIVO</option>
                                            <option value="INACTIVO">INACTIVO</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-white/5 bg-white/5 grid grid-cols-2 gap-6 shrink-0">
                            <button
                                onClick={closePanel}
                                className="py-5 text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-2xl border border-white/5"
                            >
                                Descartar Cambios
                            </button>
                            <button
                                onClick={handleSaveClient}
                                className="py-5 text-[10px] font-black uppercase tracking-[0.3em] bg-secondary text-white hover:bg-white hover:text-secondary transition-all shadow-[0_10px_40px_-10px_rgba(255,99,71,0.5)] flex justify-center items-center gap-3 rounded-2xl active:scale-[0.98]"
                            >
                                <Save size={18} /> {editingId ? "Actualizar Nodo" : "Finalizar Registro"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}






