"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Phone, Mail, MoreVertical, UserPlus, Filter, Download, Trash2, Edit2, Globe, Users, Navigation, MapPin, Tag, Briefcase, Calendar, ChevronRight, X, BarChart3, TrendingUp, CheckCircle2, ShieldAlert, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
                <div className="absolute top-[10%] right-[-10%] w-[35%] h-[35%] rounded-none bg-indigo-500/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] rounded-none bg-pink-500/5 blur-[100px]" />
            </div>

            {/* HEADERS & METRICS */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 border-b border-white/5 pb-8 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-primary">
                        <Briefcase size={20} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em]">ECOSISTEMA DE RELACIONES</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Centro <span className="text-primary">CRM</span></h1>
                    <p className="text-slate-400 font-medium text-xs uppercase tracking-[0.3em] mt-4 max-w-2xl leading-relaxed">Gestión táctica de prospectos, fidelización de Elementos activos y análisis de conversión corporativa en tiempo real.</p>
                             <div className="flex flex-wrap items-center gap-4">
                    <button className="p-4 glass-panel text-slate-500 hover:text-primary hover:bg-white/10 transition-all rounded-none-[1.5rem] group border-white/10 shadow-2xl">
                        <Download size={26} className="group-hover:scale-125 transition-transform duration-500" />
                    </button>
                    <button
                        onClick={openCreatePanel}
                        className="flex items-center space-x-6 bg-primary text-white px-8 py-4 font-black uppercase tracking-[0.4em] text-[11px] hover:scale-[1.05] transition-all shadow-[0_30px_70px_-15px_rgba(99,102,241,0.6)] rounded-none-[2.2rem] active:scale-95 group italic skew-x-[-12deg]"
                    >
                        <UserPlus size={24} className="group-hover:rotate-12 transition-transform" />
                        <span>Subir Elemento</span>
                    </button>
                    </div>
                </div>
            </div>

            {/* KPI Mastery Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <StatCard label="Base Maestros" value={totalClients.toString()} icon={<Users size={32} />} color="slate" />
                <StatCard label="Cartera Activa" value={activeClients.toString()} icon={<TrendingUp size={32} />} color="secondary" />
                <StatCard label="Retención Elemento" value={avgPurchases.toString()} icon={<BarChart3 size={32} />} color="primary" />
                <StatCard label="Tasa Conversión" value={`${totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}%`} icon={<CheckCircle2 size={32} />} color="secondary" showPulse />
            </div>

            {/* DATA COMMAND GRID */}
            <div className="flex-1 glass-panel !bg-slate-950/70 border-white/10 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative z-10 rounded-none-[4rem] ring-1 ring-white/5 backdrop-blur-[40px]">
                {/* Protocol Toolbar */}
                <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col xl:flex-row justify-between items-center gap-8">
                    <div className="relative w-full xl:max-w-2xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary group-hover:scale-110 transition-all" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="BUSCAR CLIENTE..."
                            className="w-full pl-16 pr-8 py-5 bg-slate-900/80 border border-white/5 text-white text-[11px] font-black uppercase tracking-[0.2em] focus:border-primary/50 outline-none rounded-none placeholder:text-slate-800 italic"
                        />
                    </div>
                    <div className="flex w-full xl:w-auto items-center gap-8">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full lg:w-60 px-8 py-5 bg-slate-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] outline-none rounded-none cursor-pointer hover:bg-slate-800 transition-all italic"
                        >
                            <option value="all">TODOS LOS ElementoS</option>
                            <option value="activo">ACTIVOS</option>
                            <option value="prospecto">PROSPECTOS</option>
                            <option value="inactivo">INACTIVOS</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar-hidden">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                        <thead className="text-[8px] text-slate-500 bg-slate-900/80 uppercase font-black tracking-[0.3em] sticky top-0 z-20 backdrop-blur-3xl border-b border-slate-200 italic">
                            <tr>
                                <th className="px-3 py-1 border-r border-white/5">CLIENTE / ID</th>
                                <th className="px-3 py-1 border-r border-white/5">CONTACTO</th>
                                <th className="px-3 py-1 border-r border-white/5">CIUDAD</th>
                                <th className="px-3 py-1 max-w-[200px] border-r border-white/5">REQUERIMIENTO</th>
                                <th className="px-3 py-1 text-center border-r border-white/5">TX</th>
                                <th className="px-3 py-1 text-center">ESTADO</th>
                                <th className="px-3 py-1 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                            {loading && clients.length === 0 && (
                                <tr><td colSpan={7} className="p-10 text-center text-[9px] text-secondary font-black uppercase tracking-[0.4em] italic">SINCRONIZANDO...</td></tr>
                            )}
                            {filteredClients.map((client) => (
                                <tr key={client.id}
                                    onClick={() => openEditPanel(client)}
                                    className="hover:bg-slate-50 transition-all group relative cursor-pointer text-[11px]"
                                >
                                    <td className="px-3 py-1">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 uppercase italic">
                                                {client.firstName || client.lastName ? `${client.firstName || ''} ${client.lastName || ''}`.trim() : client.name}
                                            </span>
                                            <span className="text-[7px] text-slate-400 uppercase italic">ID: {client.id.slice(0,8)}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-1">
                                        <div className="flex flex-col">
                                            <span className="text-slate-400 font-medium italic">{client.email || 'S/E'}</span>
                                            <span className="text-slate-800 font-black italic">{client.phone || 'S/T'}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-1">
                                        <span className="text-slate-500 uppercase font-black italic">{client.city || 'GLOBAL'}</span>
                                    </td>
                                    <td className="px-3 py-1 max-w-[200px]">
                                        <p className="text-slate-400 truncate italic">
                                            {client.requirement || 'SIN DATOS'}
                                        </p>
                                    </td>
                                    <td className="px-3 py-1 text-center">
                                        <span className="font-black text-slate-700">{client.purchaseCount || 0}</span>
                                    </td>
                                    <td className="px-3 py-1 text-center">
                                        <span className={`px-3 py-1 text-[7px] font-black uppercase border rounded-none italic ${
                                            client.status === 'ACTIVO' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                            client.status === 'PROSPECTO' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                            'bg-slate-100 text-slate-400 border-slate-200'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-1 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={(e) => handleDeleteClient(client.id, e)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
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
                            className="w-full md:w-[800px] h-full glass-panel !bg-slate-950/80 !border-l !border-white/20 z-[210] shadow-[0_0_250px_rgba(0,0,0,1)] flex flex-col md:rounded-none-[6rem] backdrop-blur-[120px]"
                        >
                            <div className="flex items-center justify-between p-16 border-b border-white/20 bg-white/[0.03] shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="bg-secondary p-7 rounded-none-[2rem] shadow-2xl shadow-secondary/40 animate-pulse">
                                        <UserPlus size={36} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-5xl font-black uppercase tracking-tighter text-white italic leading-tight">
                                            {editingId ? "EXPEDIENTE <span className='text-primary'>MAESTRO</span>" : "NUEVO <span className='text-primary'>Elemento</span>"}
                                        </h2>
                                        <p className="text-[11px] font-black text-slate-500 mt-2 uppercase tracking-[0.5em] italic opacity-80">Gesti�n de Registro Corporativo v4.0</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={closePanel} 
                                    className="text-slate-600 hover:text-white hover:rotate-90 transition-all duration-700 p-6 bg-slate-900/80 border border-white/20 rounded-none-[1.5rem] shadow-2xl active:scale-90"
                                >
                                    <X size={40} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-20 space-y-20 custom-scrollbar-hidden scroll-smooth">
                                {/* Form sections with enhanced styling */}
                                <div className="space-y-14">
                                    <div className="flex items-center gap-6 border-b border-white/10 pb-8">
                                        <div className="w-3 h-3 rounded-none bg-secondary shadow-[0_0_15px_rgba(255,99,71,0.8)]" />
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
                                                className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black uppercase tracking-widest focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none rounded-none placeholder:text-slate-800 italic"
                                                placeholder="REGISTRAR CADENA..."
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Apellidos Legales</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black uppercase tracking-widest focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none rounded-none placeholder:text-slate-800 italic"
                                                placeholder="COMPLETAR REGISTRO..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-14">
                                    <div className="flex items-center gap-6 border-b border-white/10 pb-8">
                                        <div className="w-3 h-3 rounded-none bg-primary shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
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
                                                className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black tracking-[0.1em] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none rounded-none placeholder:text-slate-800 italic"
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
                                                    className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black tracking-[0.2em] focus:border-secondary outline-none rounded-none transition-all"
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
                                                    className="w-full p-8 bg-slate-900/60 border border-white/10 text-white text-[13px] font-black uppercase tracking-widest focus:border-secondary outline-none rounded-none transition-all"
                                                    placeholder="CIUDAD DE OPERACIÓN"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-14">
                                    <div className="flex items-center gap-6 border-b border-white/10 pb-8">
                                        <div className="w-3 h-3 rounded-none bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
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
                                            className="w-full p-10 bg-slate-900/60 border border-white/10 text-white text-[12px] font-black tracking-widest focus:border-primary transition-all outline-none rounded-none-[2.5rem] resize-none placeholder:text-slate-800 leading-relaxed italic custom-scrollbar-hidden"
                                            placeholder="DESGLOSE EL Gesti�n de NECESIDADES CorporativoES..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="glass-panel !bg-slate-900/40 p-8 rounded-none border-white/10 text-center space-y-4 group hover:!bg-slate-900/80 transition-all">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors">Volumen TX</label>
                                            <input
                                                type="number"
                                                value={formData.purchaseCount}
                                                onChange={(e) => setFormData({ ...formData, purchaseCount: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-transparent text-white text-4xl font-black text-center focus:text-secondary outline-none transition-all italic tracking-tighter"
                                                min="0"
                                            />
                                        </div>
                                        <div className="glass-panel !bg-slate-900/40 p-8 rounded-none border-white/10 text-center space-y-4 group hover:!bg-slate-900/80 transition-all">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors">Impactos IA</label>
                                            <input
                                                type="number"
                                                value={formData.campaignsSent}
                                                onChange={(e) => setFormData({ ...formData, campaignsSent: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-transparent text-white text-4xl font-black text-center focus:text-secondary outline-none transition-all italic tracking-tighter"
                                                min="0"
                                            />
                                        </div>
                                        <div className="glass-panel !bg-slate-900/40 p-8 rounded-none border-white/10 space-y-4 group hover:!bg-slate-900/80 transition-all flex flex-col justify-center">
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic text-center group-hover:text-white transition-colors">Elemento Status</label>
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

                            <div className="p-16 border-t border-white/20 bg-white/[0.04] grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 backdrop-blur-3xl">
                                <button 
                                    onClick={closePanel} 
                                    className="py-10 text-[11px] font-black uppercase tracking-[0.8em] bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all rounded-none-[2.5rem] border border-white/10 active:scale-95 shadow-2xl italic skew-x-[-15deg] hover:skew-x-0"
                                >
                                    ABORTAR PROTOCOLO
                                </button>
                                <button 
                                    onClick={handleSaveClient} 
                                    className="py-10 text-[11px] font-black uppercase tracking-[0.8em] bg-primary text-white hover:scale-105 transition-all shadow-[0_40px_100px_-20px_rgba(99,102,241,0.7)] flex justify-center items-center gap-6 rounded-none-[2.5rem] active:scale-[0.98] italic skew-x-[-15deg] hover:skew-x-0 group"
                                >
                                    <Save size={24} className="group-hover:rotate-12 transition-transform" /> 
                                    <span>{editingId ? "COMMIT DATA" : "ENCRIPTAR Elemento"}</span>
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
        primary: "text-primary border-primary/30 bg-primary/5",
        slate: "text-white border-white/10 bg-white/5"
    }

    return (
        <div className={`glass-panel p-12 border rounded-none-[4rem] flex items-center justify-between group hover:scale-[1.03] transition-all duration-700 relative overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_-25px_rgba(0,0,0,0.8)] ${colorClasses[color]}`}>
            {showPulse && <div className="absolute top-6 right-6 w-3 h-3 rounded-none bg-secondary animate-pulse shadow-[0_0_15px_rgba(255,99,71,0.5)]" />}
            <div className="relative z-10 space-y-4">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic group-hover:text-white transition-colors">{label}</p>
                <p className="text-7xl font-black text-white tracking-tighter italic leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">{value}</p>
            </div>
            <div className="p-7 bg-slate-900/80 rounded-none-[2rem] border border-white/10 shadow-3xl group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-700 text-slate-400 group-hover:text-white">
                {icon}
            </div>
        </div>
    )
}



