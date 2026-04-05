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
                             <div className="flex flex-wrap items-center gap-10">
                    <button className="p-8 glass-panel text-slate-500 hover:text-secondary hover:bg-white/10 transition-all rounded-[1.5rem] group border-white/10 shadow-2xl">
                        <Download size={26} className="group-hover:scale-125 transition-transform duration-500" />
                    </button>
                    <button
                        onClick={openCreatePanel}
                        className="flex items-center space-x-6 bg-secondary text-white px-14 py-6 font-black uppercase tracking-[0.4em] text-[11px] hover:scale-[1.05] transition-all shadow-[0_30px_70px_-15px_rgba(255,99,71,0.6)] rounded-[2.2rem] active:scale-95 group italic skew-x-[-12deg]"
                    >
                        <UserPlus size={24} className="group-hover:rotate-12 transition-transform" />
                        <span>INYECTAR NODO</span>
                    </button>
                </div>
            </div>

            {/* KPI Mastery Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                <StatCard label="Base Maestros" value={totalClients.toString()} icon={<Users size={32} />} color="slate" />
                <StatCard label="Cartera Activa" value={activeClients.toString()} icon={<TrendingUp size={32} />} color="secondary" />
                <StatCard label="Retención Nodo" value={avgPurchases.toString()} icon={<BarChart3 size={32} />} color="azure" />
                <StatCard label="Tasa Conversión" value={`${totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}%`} icon={<CheckCircle2 size={32} />} color="secondary" showPulse />
            </div>

            {/* DATA COMMAND GRID */}
            <div className="flex-1 glass-panel !bg-slate-950/70 border-white/10 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative z-10 rounded-[4rem] ring-1 ring-white/5 backdrop-blur-[40px]">
                {/* Protocol Toolbar */}
                <div className="p-14 border-b border-white/10 bg-white/[0.02] flex flex-col xl:flex-row justify-between items-center gap-14">
                    <div className="relative w-full xl:max-w-3xl group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-secondary group-hover:scale-110 transition-all" size={22} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ESCANEAR ECOSISTEMA DE CLIENTES v4.0..."
                            className="w-full pl-20 pr-10 py-7 bg-slate-900/80 border border-white/5 text-white text-[12px] font-black uppercase tracking-[0.3em] focus:border-secondary/50 focus:ring-4 focus:ring-secondary/5 transition-all outline-none rounded-[2rem] placeholder:text-slate-800 italic"
                        />
                    </div>
                    <div className="flex w-full xl:w-auto items-center gap-10">
                        <div className="flex items-center gap-5">
                            <Filter size={18} className="text-secondary/60" />
                            <span className="text-[11px] uppercase font-black text-slate-500 tracking-[0.4em] italic leading-none">STATUS NODE:</span>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full lg:w-80 px-10 py-6 bg-slate-900 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] focus:border-secondary outline-none rounded-[1.8rem] cursor-pointer hover:bg-slate-800 transition-all shadow-inner italic"
                        >
                            <option value="all">Filtro: Todos los Nodos</option>
                            <option value="activo">Estado: Diseños Activos</option>
                            <option value="prospecto">Estado: Fases Prospecto</option>
                            <option value="inactivo">Estado: Rechazados/Cancelados</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar-hidden">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                        <thead className="text-[10px] text-slate-600 bg-slate-950/80 uppercase font-black tracking-[0.6em] sticky top-0 z-20 backdrop-blur-3xl border-b border-white/10 italic">
                            <tr>
                                <th className="px-14 py-10 border-r border-white/5">Protocolo / Identidad</th>
                                <th className="px-14 py-10 border-r border-white/5">Nodo de Enlace</th>
                                <th className="px-14 py-10 border-r border-white/5">Geolocalización</th>
                                <th className="px-14 py-10 max-w-[350px] border-r border-white/5 text-center">Especificaciones</th>
                                <th className="px-14 py-10 text-center border-r border-white/5">Actividad</th>
                                <th className="px-14 py-10 text-center">Rango</th>
                                <th className="px-14 py-10 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading && clients.length === 0 && (
                                <tr><td colSpan={7} className="p-40 text-center text-[12px] text-secondary font-black uppercase tracking-[1em] animate-pulse italic">SINCRONIZANDO INTELIGENCIA CRM DE ALTO NIVEL...</td></tr>
                            )}
                            {filteredClients.map((client) => (
                                <tr key={client.id}
                                    onClick={() => openEditPanel(client)}
                                    className="hover:bg-white/[0.06] transition-all group relative border-b border-white/[0.02] cursor-pointer"
                                >
                                    <td className="px-14 py-10">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-xl border border-white/10 group-hover:border-secondary transition-all shadow-2xl shadow-black/50 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <span className="relative z-10">{(client.firstName?.[0] || client.name?.[0] || 'U').toUpperCase()}</span>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <span className="font-black text-white text-xl uppercase tracking-tighter group-hover:text-secondary transition-all italic leading-none">
                                                    {client.firstName || client.lastName ? `${client.firstName || ''} ${client.lastName || ''}`.trim() : client.name}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic opacity-70">NÚCLEO: {new Date(client.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-14 py-10">
                                        <div className="flex flex-col space-y-3">
                                            <span className="flex items-center text-[11px] text-slate-400 font-black tracking-widest italic group-hover:text-slate-200 transition-colors"><Mail size={16} className="mr-4 text-secondary/40" /> {client.email || 'NODATA@NULL'}</span>
                                            <span className="flex items-center text-[11px] font-black text-white uppercase tracking-[0.3em] italic leading-none"><Phone size={16} className="mr-4 text-secondary/40" /> {client.phone || 'DISCONNECTED'}</span>
                                        </div>
                                    </td>
                                    <td className="px-14 py-10">
                                        <span className="flex items-center text-[11px] text-slate-500 uppercase tracking-[0.3em] font-black italic group-hover:text-azure-400 transition-colors">
                                            <MapPin size={16} className="mr-4 text-secondary" /> {client.city || 'GLOBAL PROTOCOL'}
                                        </span>
                                    </td>
                                    <td className="px-14 py-10 max-w-[350px]">
                                        <p className="text-[11px] text-slate-600 truncate leading-relaxed font-black italic group-hover:text-slate-300 transition-all border-l-2 border-white/5 pl-6 group-hover:border-secondary/30">
                                            {client.requirement || 'SIN ESPECIFICACIONES TÉCNICAS AUTORIZADAS'}
                                        </p>
                                    </td>
                                    <td className="px-14 py-10">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <span className="text-[10px] font-black px-6 py-2 bg-slate-900/80 text-white border border-white/10 rounded-2xl uppercase tracking-[0.4em] group-hover:border-secondary/40 transition-all shadow-inner italic">
                                                {client.purchaseCount} <span className="text-secondary/60">TX_UID</span>
                                            </span>
                                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] italic">
                                                {client.campaignsSent} Impactos IA
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-14 py-10 text-center">
                                        <span className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.4em] border rounded-[1.2rem] shadow-2xl italic leading-none inline-block ${
                                            client.status === 'ACTIVO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' :
                                            client.status === 'PROSPECTO' ? 'bg-secondary/10 text-secondary border-secondary/20 shadow-secondary/10 ring-1 ring-secondary/20' :
                                            'bg-slate-800/20 text-slate-600 border-white/10'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-14 py-10 text-right">
                                        <div className="flex justify-end gap-5 opacity-0 group-hover:opacity-100 transition-all translate-x-12 group-hover:translate-x-0 duration-500">
                                            <button
                                                onClick={(e) => handleDeleteClient(client.id, e)}
                                                className="p-6 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-2xl border border-red-500/20 shadow-2xl active:scale-90"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                            <button className="p-6 glass-panel !bg-secondary text-white hover:scale-110 transition-all rounded-2xl shadow-3xl shadow-secondary/40 ring-1 ring-white/20 active:scale-95">
                                                <ChevronRight size={28} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SIDE COMMAND PANEL */}
            <AnimatePresence>
                {isPanelOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-end p-0 md:p-12 overflow-hidden">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-[60px]" 
                            onClick={closePanel} 
                        />
                        <motion.div 
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 40, stiffness: 400, mass: 1 }}
                            className="w-full md:w-[800px] h-full glass-panel !bg-slate-950/80 !border-l !border-white/20 z-[210] shadow-[0_0_250px_rgba(0,0,0,1)] flex flex-col md:rounded-l-[6rem] backdrop-blur-[120px]"
                        >
                            <div className="flex items-center justify-between p-16 border-b border-white/20 bg-white/[0.03] shrink-0">
                                <div className="flex items-center gap-10">
                                    <div className="bg-secondary p-7 rounded-[2rem] shadow-2xl shadow-secondary/40 animate-pulse">
                                        <UserPlus size={36} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-5xl font-black uppercase tracking-tighter text-white italic leading-tight">
                                            {editingId ? "EXPEDIENTE <span className='text-secondary'>MAESTRO</span>" : "NUEVO <span className='text-secondary'>NODO</span>"}
                                        </h2>
                                        <p className="text-[11px] font-black text-slate-500 mt-2 uppercase tracking-[0.5em] italic opacity-80">Protocolo de Registro Industrial v4.0</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={closePanel} 
                                    className="text-slate-600 hover:text-white hover:rotate-90 transition-all duration-700 p-6 bg-slate-900/80 border border-white/20 rounded-[1.5rem] shadow-2xl active:scale-90"
                                >
                                    <X size={40} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-20 space-y-20 custom-scrollbar-hidden scroll-smooth">
                                {/* Form sections with enhanced styling */}
                                <div className="space-y-14">
                                    <div className="flex items-center gap-6 border-b border-white/10 pb-8">
                                        <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_15px_rgba(255,99,71,0.8)]" />
                                        <h3 className="text-sm font-black uppercase tracking-[0.6em] text-white italic">01 // Identidad Corporativa</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                                        <div className="space-y-6">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic flex items-center gap-3">
                                                Nombres Maestro <span className="text-secondary/50">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black uppercase tracking-widest focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all outline-none rounded-3xl placeholder:text-slate-800 italic"
                                                placeholder="REGISTRAR CADENA..."
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Apellidos Legales</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black uppercase tracking-widest focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all outline-none rounded-3xl placeholder:text-slate-800 italic"
                                                placeholder="COMPLETAR REGISTRO..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-14">
                                    <div className="flex items-center gap-6 border-b border-white/10 pb-8">
                                        <div className="w-3 h-3 rounded-full bg-azure-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                                        <h3 className="text-sm font-black uppercase tracking-[0.6em] text-white italic">02 // Conectividad Local</h3>
                                    </div>
                                    <div className="space-y-14">
                                        <div className="space-y-6">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4 ml-2 italic group">
                                                <Mail size={16} className="text-secondary group-hover:rotate-12 transition-transform" /> 
                                                Email de Enlace <span className="text-secondary/50">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black tracking-[0.1em] focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none rounded-3xl placeholder:text-slate-800 italic"
                                                placeholder="DIRECCIÓN_MAESTRA@DOMINIO.GLOBAL"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                                            <div className="space-y-6">
                                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4 ml-2 italic group">
                                                    <Phone size={16} className="text-secondary group-hover:scale-125 transition-all" /> 
                                                    Línea Crítica <span className="text-secondary/50">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black tracking-[0.2em] focus:border-secondary outline-none rounded-3xl transition-all"
                                                    placeholder="+52 XXX XXX XXXX"
                                                />
                                            </div>
                                            <div className="space-y-6">
                                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4 ml-2 italic group">
                                                    <MapPin size={16} className="text-secondary group-hover:translate-y-[-4px] transition-transform" /> 
                                                    Coordenada Base
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black uppercase tracking-widest focus:border-secondary outline-none rounded-3xl transition-all"
                                                    placeholder="CIUDAD DE OPERACIÓN"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-14">
                                    <div className="flex items-center gap-6 border-b border-white/10 pb-8">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                                        <h3 className="text-sm font-black uppercase tracking-[0.6em] text-white italic">03 // Análisis Operativo</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic flex items-center gap-4">
                                            Requerimiento Estratégico
                                        </label>
                                        <textarea
                                            rows={5}
                                            value={formData.requirement}
                                            onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                                            className="w-full p-10 bg-slate-900/60 border border-white/10 text-white text-[12px] font-black tracking-widest focus:border-secondary transition-all outline-none rounded-[2.5rem] resize-none placeholder:text-slate-800 leading-relaxed italic custom-scrollbar-hidden"
                                            placeholder="DESGLOSE EL PROTOCOLO DE NECESIDADES INDUSTRIALES..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        <div className="glass-panel !bg-slate-900/40 p-8 rounded-3xl border-white/10 text-center space-y-4 group hover:!bg-slate-900/80 transition-all">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors">Volumen TX</label>
                                            <input
                                                type="number"
                                                value={formData.purchaseCount}
                                                onChange={(e) => setFormData({ ...formData, purchaseCount: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-transparent text-white text-4xl font-black text-center focus:text-secondary outline-none transition-all italic tracking-tighter"
                                                min="0"
                                            />
                                        </div>
                                        <div className="glass-panel !bg-slate-900/40 p-8 rounded-3xl border-white/10 text-center space-y-4 group hover:!bg-slate-900/80 transition-all">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors">Impactos IA</label>
                                            <input
                                                type="number"
                                                value={formData.campaignsSent}
                                                onChange={(e) => setFormData({ ...formData, campaignsSent: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-transparent text-white text-4xl font-black text-center focus:text-secondary outline-none transition-all italic tracking-tighter"
                                                min="0"
                                            />
                                        </div>
                                        <div className="glass-panel !bg-slate-900/40 p-8 rounded-3xl border-white/10 space-y-4 group hover:!bg-slate-900/80 transition-all flex flex-col justify-center">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic text-center group-hover:text-white transition-colors">Nodo Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-transparent text-[11px] font-black uppercase text-white hover:text-secondary focus:text-secondary outline-none cursor-pointer text-center italic"
                                            >
                                                <option value="PROSPECTO">PROSPECTO</option>
                                                <option value="ACTIVO">ACTIVO</option>
                                                <option value="INACTIVO">CANCELADO</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-16 border-t border-white/20 bg-white/[0.04] grid grid-cols-1 md:grid-cols-2 gap-10 shrink-0 backdrop-blur-3xl">
                                <button 
                                    onClick={closePanel} 
                                    className="py-10 text-[11px] font-black uppercase tracking-[0.8em] bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all rounded-[2.5rem] border border-white/10 active:scale-95 shadow-2xl italic skew-x-[-15deg] hover:skew-x-0"
                                >
                                    ABORTAR PROTOCOLO
                                </button>
                                <button 
                                    onClick={handleSaveClient} 
                                    className="py-10 text-[11px] font-black uppercase tracking-[0.8em] bg-secondary text-white hover:scale-105 transition-all shadow-[0_40px_100px_-20px_rgba(255,99,71,0.7)] flex justify-center items-center gap-6 rounded-[2.5rem] active:scale-[0.98] italic skew-x-[-15deg] hover:skew-x-0 group"
                                >
                                    <Save size={24} className="group-hover:rotate-12 transition-transform" /> 
                                    <span>{editingId ? "COMMIT DATA" : "ENCRIPTAR NODO"}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function StatCard({ label, value, icon, color, showPulse = false }: any) {
    const colorClasses: any = {
        secondary: "text-secondary border-secondary/30 bg-secondary/5",
        azure: "text-azure-400 border-azure-500/30 bg-azure-500/5",
        slate: "text-white border-white/10 bg-white/5"
    }

    return (
        <div className={`glass-panel p-12 border rounded-[4rem] flex items-center justify-between group hover:scale-[1.03] transition-all duration-700 relative overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_-25px_rgba(0,0,0,0.8)] ${colorClasses[color]}`}>
            {showPulse && <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-secondary animate-pulse shadow-[0_0_15px_rgba(255,99,71,0.5)]" />}
            <div className="relative z-10 space-y-4">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic group-hover:text-white transition-colors">{label}</p>
                <p className="text-7xl font-black text-white tracking-tighter italic leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">{value}</p>
            </div>
            <div className="p-7 bg-slate-900/80 rounded-[2rem] border border-white/10 shadow-3xl group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-700 text-slate-400 group-hover:text-white">
                {icon}
            </div>
        </div>
    )
}
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
