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
        <div className="space-y-6 lg:min-h-[85vh] flex flex-col relative w-full overflow-hidden pb-10">
            {/* HEADERS & METRICS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="bg-neutral-900 p-2 text-white"><Briefcase size={20} className="text-orange-500" /></div>
                        <h1 className="text-3xl font-black tracking-tighter text-neutral-900 uppercase">
                            ATOMIC <span className="text-neutral-400 font-light">|</span> <span className="text-orange-600 border-b-4 border-orange-600">PRO CRM</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mt-2">Enterprise Customer Relationship Management v1.0.5</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="bg-white border text-neutral-600 border-neutral-300 font-bold py-2 px-4 text-xs uppercase tracking-widest flex items-center shadow-sm">
                        <Download size={14} className="mr-2" /> Exportar CSV
                    </button>
                    <button
                        onClick={openCreatePanel}
                        className="bg-neutral-900 hover:bg-orange-600 text-white font-bold py-2 px-6 text-xs uppercase tracking-widest flex items-center transition-colors shadow-lg shadow-neutral-900/20"
                    >
                        <UserPlus size={16} className="mr-2" /> Nuevo Registro
                    </button>
                </div>
            </div>

            {/* HIGH LEVEL KPI BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                <div className="bg-white p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Base de Datos</p>
                        <p className="text-2xl font-black text-neutral-900">{totalClients}</p>
                    </div>
                    <Users className="text-neutral-200" size={32} />
                </div>
                <div className="bg-white p-5 border border-neutral-200 shadow-sm flex items-center justify-between border-l-4 border-l-orange-500">
                    <div>
                        <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Cartera Activa</p>
                        <p className="text-2xl font-black text-orange-600">{activeClients}</p>
                    </div>
                    <TrendingUp className="text-orange-200" size={32} />
                </div>
                <div className="bg-white p-5 border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Ticket Retención</p>
                        <p className="text-2xl font-black text-neutral-900">{avgPurchases}</p>
                    </div>
                    <BarChart3 className="text-neutral-200" size={32} />
                </div>
                <div className="bg-white p-5 border border-neutral-200 shadow-sm flex items-center justify-between bg-neutral-900 text-white">
                    <div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Tasa Conversión</p>
                        <p className="text-2xl font-black text-white">{totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}%</p>
                    </div>
                    <CheckCircle2 className="text-orange-500" size={32} />
                </div>
            </div>

            {/* DATA GRID */}
            <div className="flex-1 bg-white border border-neutral-200 shadow-xl overflow-hidden flex flex-col relative z-10">
                {/* Grid Toolbar */}
                <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="relative w-full lg:w-1/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre, email, ciudad o requerimiento..."
                            className="w-full pl-9 pr-4 py-2 border border-neutral-300 bg-white text-xs font-mono focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <div className="flex w-full lg:w-auto items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Filtrar Estado:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full lg:w-48 px-3 py-2 border border-neutral-300 bg-white text-xs font-bold uppercase tracking-wider text-neutral-700 focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="all">TODOS LOS ESTADOS</option>
                            <option value="activo">ACTIVOS</option>
                            <option value="prospecto">PROSPECTOS</option>
                            <option value="inactivo">INACTIVOS</option>
                        </select>
                    </div>
                </div>

                {/* Desktop Grid View */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                        <thead className="text-[9px] text-neutral-400 bg-neutral-900 uppercase font-black tracking-widest sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">ID / Nombre Cliente</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4">Ubicación</th>
                                <th className="px-6 py-4 max-w-[200px]">Requerimiento Industrial</th>
                                <th className="px-6 py-4 text-center">Fidelidad</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading && clients.length === 0 && (
                                <tr><td colSpan={7} className="p-10 text-center text-xs text-neutral-400 uppercase font-bold animate-pulse">Analizando base de datos...</td></tr>
                            )}
                            {!loading && filteredClients.length === 0 && (
                                <tr><td colSpan={7} className="p-20 text-center text-xs text-neutral-400 uppercase font-bold">Sin resultados.</td></tr>
                            )}
                            {filteredClients.map((client) => (
                                <tr key={client.id}
                                    onClick={() => openEditPanel(client)}
                                    className="hover:bg-orange-50/50 transition-colors cursor-pointer group"
                                >
                                    {/* Name & Date */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-neutral-900 text-sm">
                                                {client.firstName || client.lastName ? `${client.firstName || ''} ${client.lastName || ''}`.trim() : client.name}
                                            </span>
                                            <span className="text-[9px] font-mono text-neutral-400 mt-1 uppercase">Ingreso: {new Date(client.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <span className="flex items-center text-xs text-neutral-600 font-mono"><Mail size={10} className="mr-2 text-orange-400" /> {client.email || 'N/A'}</span>
                                            <span className="flex items-center text-[11px] font-bold text-neutral-800"><Phone size={10} className="mr-2 text-orange-400" /> {client.phone || 'N/A'}</span>
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-6 py-4">
                                        <span className="flex items-center text-xs text-neutral-500 uppercase tracking-wider font-bold">
                                            <MapPin size={12} className="mr-1 text-neutral-300" /> {client.city || 'NO ESPECIFICADA'}
                                        </span>
                                    </td>

                                    {/* Requirement */}
                                    <td className="px-6 py-4 max-w-[200px]">
                                        <p className="text-[10px] text-neutral-500 truncate leading-relaxed">
                                            {client.requirement || '-'}
                                        </p>
                                    </td>

                                    {/* Metrics */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center justify-center space-y-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                {client.purchaseCount} <span className="text-neutral-400 font-normal">COMPRAS</span>
                                            </span>
                                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                                                {client.campaignsSent} Campañas
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border ${client.status === 'ACTIVO' ? 'bg-green-500 text-white border-green-600 shadow-sm shadow-green-500/20' :
                                            client.status === 'PROSPECTO' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                'bg-neutral-100 text-neutral-500 border-neutral-200'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleDeleteClient(client.id, e)}
                                                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openEditPanel(client); }}
                                                className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white transition-colors"
                                                title="Ver Detalles"
                                            >
                                                <ChevronRight size={16} />
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
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={closePanel} />

                    {/* Sliding Panel */}
                    <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col border-l border-neutral-200 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-900 text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-600 p-2"><UserPlus size={16} /></div>
                                <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                                    {editingId ? "Expediente del Cliente" : "Nuevo Ingreso CRM"}
                                </h2>
                            </div>
                            <button onClick={closePanel} className="text-neutral-400 hover:text-white transition-colors p-2">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-neutral-50">

                            {/* SECTION 1: Personal Data */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 border-b border-orange-200 pb-2">Información Personal</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Nombres</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full p-3 bg-white border border-neutral-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="Ej. Juan Carlos"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Apellidos</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full p-3 bg-white border border-neutral-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="Ej. Pérez"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: Contact & Location */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 border-b border-orange-200 pb-2">Contacto y Ubicación</h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1"><Mail size={10} /> Correo Electrónico <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full p-3 bg-white border border-neutral-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all font-mono"
                                            placeholder="correo@empresa.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1"><Phone size={10} /> Teléfono/WA <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full p-3 bg-white border border-neutral-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all font-mono"
                                                placeholder="+52 123 456..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1"><MapPin size={10} /> Ciudad Base</label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full p-3 bg-white border border-neutral-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all uppercase"
                                                placeholder="Ej. Monterrey"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: Business & Metrics */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 border-b border-orange-200 pb-2">Inteligencia de Negocios</h3>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Requerimiento de Ingreso</label>
                                    <textarea
                                        value={formData.requirement}
                                        onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                                        className="w-full p-3 bg-white border border-neutral-200 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
                                        rows={3}
                                        placeholder="Escriba las necesidades exactas reportadas por el cliente..."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Compras</label>
                                        <input
                                            type="number"
                                            value={formData.purchaseCount}
                                            onChange={(e) => setFormData({ ...formData, purchaseCount: parseInt(e.target.value) || 0 })}
                                            className="w-full p-3 bg-white border border-neutral-200 text-xs font-bold text-center focus:border-orange-500 outline-none"
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Campañas</label>
                                        <input
                                            type="number"
                                            value={formData.campaignsSent}
                                            onChange={(e) => setFormData({ ...formData, campaignsSent: parseInt(e.target.value) || 0 })}
                                            className="w-full p-3 bg-white border border-neutral-200 text-xs font-bold text-center focus:border-orange-500 outline-none"
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Estado</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full p-3 bg-white border border-neutral-200 text-[10px] font-black uppercase text-center focus:border-orange-500 outline-none h-[42px]"
                                        >
                                            <option value="PROSPECTO">PROSPECTO</option>
                                            <option value="ACTIVO">ACTIVO</option>
                                            <option value="INACTIVO">INACTIVO</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-neutral-200 bg-white grid grid-cols-2 gap-4 shrink-0">
                            <button
                                onClick={closePanel}
                                className="py-4 text-xs font-black uppercase tracking-widest bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                            >
                                Descartar
                            </button>
                            <button
                                onClick={handleSaveClient}
                                className="py-4 text-xs font-black uppercase tracking-[0.2em] bg-orange-600 text-white hover:bg-neutral-900 transition-colors shadow-lg shadow-orange-500/30 flex justify-center items-center gap-2"
                            >
                                <Save size={14} /> {editingId ? "Actualizar" : "Registrar"}
                            </button>
                        </div>

                    </div>
                </>
            )}

        </div>
    )
}






