"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, Plus, UserPlus, FileText, Database, User, Calendar, 
    MessageSquare, Clock, MapPin, Phone, Mail, Edit2, 
    Save, X, Filter, BarChart3, ChevronRight, Zap, Target,
    List, MoreHorizontal, LayoutGrid, CheckCircle2, AlertCircle,
    PlayCircle, Folders, PhoneCall, Tag, Trash2, ArrowRight, ShoppingBag, Copy, ExternalLink, Check,
    TrendingUp, MessageCircle, Share, RefreshCw
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
    const [activeGroup, setActiveGroup] = useState<string>("TODOS")
    const [customGroups, setCustomGroups] = useState<string[]>([])
    const [isCreatingGroup, setIsCreatingGroup] = useState(false)
    const [newGroupName, setNewGroupName] = useState("")
    const [selectedSalespersonFilter, setSelectedSalespersonFilter] = useState<string>("TODOS")
    
    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [editForm, setEditForm] = useState<any>({})
    const [activeTab, setActiveTab] = useState<"RESUMEN" | "BITACORA" | "COTIZACIONES">("RESUMEN")
    const [newObservation, setNewObservation] = useState("")
    const [evidenceImageUrl, setEvidenceImageUrl] = useState("")

    // Pendientes State
    const [isAddingPendiente, setIsAddingPendiente] = useState(false)
    const [pendienteForm, setPendienteForm] = useState({ type: "Nota de venta", description: "" })
    const [expandedPendientes, setExpandedPendientes] = useState<Record<string, boolean>>({})

    useEffect(() => {
        fetchClients()
        fetchGroups()
        fetchUsers()
    }, [])

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

    const fetchGroups = async () => {
        try {
            const res = await fetch("/api/crm/groups")
            const data = await res.json()
            if (data && data.groups) {
                setCustomGroups(data.groups)
            }
        } catch (e) {
            console.error("Error fetching contact groups:", e)
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
        setEditForm({ ...client, category: client.category || "GENERAL" })
        setActiveTab("RESUMEN")
        setIsDrawerOpen(true)
    }

    const handleCreateNew = () => {
        setSelectedClient(null)
        setEditForm({ status: "PROSPECTO", source: "MANUAL", purchaseCount: 0, category: "GENERAL" })
        setActiveTab("RESUMEN")
        setIsDrawerOpen(true)
    }

    const handleAddPromotion = async () => {
        if (!selectedClient) return
        try {
            const updatedClient = {
                ...selectedClient,
                campaignsSent: (selectedClient.campaignsSent || 0) + 1,
                lastPromotion: new Date().toISOString()
            }
            const res = await fetch(`/api/crm/${selectedClient.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedClient)
            })
            if (res.ok) {
                const data = await res.json()
                setSelectedClient(data)
                setEditForm({ ...editForm, campaignsSent: data.campaignsSent, lastPromotion: data.lastPromotion })
                fetchClients()
            }
        } catch(e) {
            console.error(e)
        }
    }

    const handleDuplicateQuote = async (quote: any) => {
        if (!confirm("¿Deseas duplicar esta cotización?")) return;
        
        try {
            const newQuoteData = {
                quoteNumber: quote.quoteNumber + "-COPY-" + Math.floor(Math.random() * 1000),
                globalQuoteNumber: quote.globalQuoteNumber,
                clientName: selectedClient.name,
                clientEmail: selectedClient.email,
                clientPhone: selectedClient.phone,
                city: selectedClient.city,
                subtotal: quote.subtotal,
                tax: quote.tax,
                discountPercent: quote.discountPercent || 0,
                total: quote.total,
                items: JSON.parse(quote.itemsData || "[]"),
                deliveryAddress: quote.deliveryAddress,
                warrantyComments: quote.warrantyComments,
                advisorName: quote.advisorName,
                status: "DRAFT",
                quoteSubject: "Copia de " + quote.quoteNumber
            };

            const res = await fetch("/api/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQuoteData)
            });

            if (res.ok) {
                // Refresh client data to fetch the new quote
                fetchClients();
                alert("Cotización duplicada con éxito. Revisa el listado.");
            }
        } catch(e) {
            console.error(e)
        }
    }

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
            const newTag = e.currentTarget.value.trim().toUpperCase()
            const currentTags = editForm.tags ? editForm.tags.split(',').map((t: string) => t.trim()) : []
            if (!currentTags.includes(newTag)) {
                setEditForm({ ...editForm, tags: [...currentTags, newTag].join(', ') })
            }
            e.currentTarget.value = ''
        }
    }

    const handleAddPendiente = async () => {
        if (!pendienteForm.description.trim()) return;
        const newPendiente = {
            id: Math.random().toString(36).substr(2, 9),
            type: pendienteForm.type,
            description: pendienteForm.description,
            date: new Date().toISOString(),
            done: false
        }
        
        let currentPendientes = []
        if (editForm.pendientes) {
            try { currentPendientes = JSON.parse(editForm.pendientes) } catch(e) {}
        }
        
        const updatedPendientes = JSON.stringify([...currentPendientes, newPendiente])
        const updatedClient = { ...editForm, pendientes: updatedPendientes }
        setEditForm(updatedClient)
        
        if (selectedClient?.id) {
            fetch(`/api/crm/${selectedClient.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedClient)
            }).then(() => fetchClients())
        }
        
        setIsAddingPendiente(false)
        setPendienteForm({ type: "Nota de venta", description: "" })
    }

    const handleCompletePendiente = async (idToComplete: string, e: any) => {
        e.stopPropagation();
        let currentPendientes = []
        if (editForm.pendientes) {
            try { currentPendientes = JSON.parse(editForm.pendientes) } catch(e) {}
        }
        
        const updated = currentPendientes.map((p: any) => {
            if (p.id === idToComplete) {
                return { ...p, done: true, completedAt: new Date().toISOString() }
            }
            return p
        })
        const updatedPendientes = JSON.stringify(updated)
        const updatedClient = { ...editForm, pendientes: updatedPendientes }
        setEditForm(updatedClient)
        
        if (selectedClient?.id) {
            fetch(`/api/crm/${selectedClient.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedClient)
            }).then(() => fetchClients())
        }
    }

    const handleSaveClient = async () => {
        try {
            const isAdding = !selectedClient?.id
            let payload = { ...editForm }
            if (isAdding) {
                const tagsList = payload.tags ? payload.tags.split(',').map((t: string) => t.trim()) : []
                if (!tagsList.includes("NUEVO_LEAD")) {
                    tagsList.push("NUEVO_LEAD")
                }
                payload.tags = tagsList.filter(Boolean).join(", ")
            }
            const method = isAdding ? "POST" : "PUT"
            const url = isAdding ? "/api/crm" : `/api/crm/${selectedClient.id}`
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
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
        let obsContent = newObservation.trim()
        if (evidenceImageUrl.trim()) {
            obsContent += ` ![Evidencia](${evidenceImageUrl.trim()})`
        }
        const formattedObs = `\n[${timestamp}] ${author}: ${obsContent}`
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
                setEvidenceImageUrl("")
                fetchClients()
            }
        } catch (e) {
            console.error(e)
        }
    }

    const createGroup = async () => {
        const name = newGroupName.trim().toUpperCase()
        if (!name) return
        try {
            const res = await fetch("/api/crm/groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupName: name })
            })
            if (res.ok) {
                const data = await res.json()
                setCustomGroups(data.groups)
                fetchClients()
            } else {
                const err = await res.json()
                alert(err.error || "Error al crear grupo")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setNewGroupName("")
            setIsCreatingGroup(false)
        }
    }

    const deleteGroup = async (groupName: string) => {
        if (!confirm(`¿Estás seguro de eliminar el grupo "${groupName}"? Todos los contactos pertenecientes a este grupo serán reasignados al grupo "GENERAL".`)) return
        try {
            const res = await fetch("/api/crm/groups", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupName })
            })
            if (res.ok) {
                const data = await res.json()
                setCustomGroups(data.groups)
                if (activeGroup === groupName) {
                    setActiveGroup("TODOS")
                }
                fetchClients()
            } else {
                const err = await res.json()
                alert(err.error || "Error al eliminar grupo")
            }
        } catch (e) {
            console.error(e)
        }
    }

    // Filters & Groups logic
    const filteredClients = useMemo(() => {
        let result = clients.filter(c => {
            const matchesSearch = `${c.firstName || ""} ${c.lastName || ""} ${c.name || ""} ${c.email || ""} ${c.phone || ""} ${c.cedula || ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            if (!isAdmin && c.salesperson?.id !== currentUserId) return false
            return matchesSearch
        })

        // Apply Advisor/Salesperson filter (For Admin Matrix view)
        if (isAdmin && selectedSalespersonFilter !== "TODOS") {
            if (selectedSalespersonFilter === "UNASSIGNED") {
                result = result.filter(c => !c.salesperson)
            } else {
                result = result.filter(c => c.salesperson?.id === selectedSalespersonFilter)
            }
        }

        if (activeGroup !== "TODOS") {
            if (activeGroup === "MIS CLIENTES") {
                result = result.filter(c => c.salesperson?.id === currentUserId)
            } else if (activeGroup === "NUEVOS LEADS") {
                result = result.filter(c => c.status === "PROSPECTO")
            } else if (activeGroup === "CIERRES GANADOS") {
                result = result.filter(c => c.status === "ACTIVO")
            } else {
                // Custom contact group -> Match exact category
                result = result.filter(c => (c.category || "GENERAL").toUpperCase() === activeGroup.toUpperCase())
            }
        }

        return result
    }, [clients, searchTerm, activeGroup, isAdmin, currentUserId, selectedSalespersonFilter])

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
            
            {/* SUB-SIDEBAR: CONTACT GROUPS & FOLDERS */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-80px)] shrink-0 z-10">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                        <Database size={14} /> CRM Vistas
                    </h2>
                    <div className="space-y-1">
                        <PlaylistButton active={activeGroup === "TODOS"} onClick={() => setActiveGroup("TODOS")} icon={<LayoutGrid size={16}/>} label="Directorio Global" count={clients.length} />
                        <PlaylistButton active={activeGroup === "MIS CLIENTES"} onClick={() => setActiveGroup("MIS CLIENTES")} icon={<User size={16}/>} label="Mis Asignados" />
                        <PlaylistButton active={activeGroup === "NUEVOS LEADS"} onClick={() => setActiveGroup("NUEVOS LEADS")} icon={<Zap size={16}/>} label="Nuevos Leads" />
                        <PlaylistButton active={activeGroup === "CIERRES GANADOS"} onClick={() => setActiveGroup("CIERRES GANADOS")} icon={<CheckCircle2 size={16}/>} label="Cierres Ganados" />
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Folders size={14} /> Grupos de Contactos
                        </h2>
                        <button onClick={() => setIsCreatingGroup(true)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>

                    {isCreatingGroup && (
                        <div className="mb-4 animate-in fade-in zoom-in duration-200">
                            <input 
                                autoFocus
                                type="text"
                                placeholder="NOMBRE DE GRUPO..."
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && createGroup()}
                                className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 uppercase rounded"
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={createGroup} className="flex-1 bg-indigo-600 text-white text-[10px] font-bold py-1.5 rounded hover:bg-indigo-700">CREAR</button>
                                <button onClick={() => setIsCreatingGroup(false)} className="flex-1 bg-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded hover:bg-slate-300">CANCELAR</button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        {customGroups.map(pl => (
                            <PlaylistButton 
                                key={pl} 
                                active={activeGroup === pl} 
                                onClick={() => setActiveGroup(pl)} 
                                icon={<List size={16}/>} 
                                label={pl} 
                                onDelete={() => deleteGroup(pl)}
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
                        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">{activeGroup}</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">{filteredClients.length} registros en esta vista</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Asesor:</span>
                                <select
                                    value={selectedSalespersonFilter}
                                    onChange={(e) => setSelectedSalespersonFilter(e.target.value)}
                                    className="bg-transparent border-none text-xs font-black text-indigo-600 outline-none cursor-pointer uppercase"
                                >
                                    <option value="TODOS">TODOS LOS ASESORES</option>
                                    <option value="UNASSIGNED">SIN ASIGNAR</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
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
                        {!(activeGroup === "NUEVOS LEADS" && !isAdmin) && (
                            <button 
                                onClick={handleCreateNew}
                                className="bg-[#0F172A] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:bg-[#1E293B] transition-all flex items-center gap-2"
                            >
                                <UserPlus size={16} /> NUEVO CLIENTE
                            </button>
                        )}
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
                                        <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Grupo de Contactos</th>
                                        <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Asesor Asignado</th>
                                        <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Etiquetas</th>
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
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-bold text-[#0F172A]">{client.name}</p>
                                                            {client.tags?.split(',').map((t: string) => t.trim().toUpperCase()).includes("NUEVO_LEAD") && (
                                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 text-[8px] font-black uppercase tracking-wider rounded-md animate-pulse">
                                                                    ★ NUEVO
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-0.5">{client.cedula ? `C.I. ${client.cedula}` : 'Sin identificación'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 group/item">
                                                        <Mail size={12} className="text-slate-400" /> 
                                                        <span className="truncate max-w-[150px]">{client.email || '—'}</span>
                                                        {client.email && (
                                                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(client.email) }} className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-400 transition-all">
                                                                <Copy size={10} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 group/item">
                                                        <Phone size={12} className="text-slate-400" /> 
                                                        {client.phone || '—'}
                                                        {client.phone && (
                                                            <>
                                                                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(client.phone) }} className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-400 transition-all">
                                                                    <Copy size={10} />
                                                                </button>
                                                                <a href={`https://wa.me/${client.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-emerald-100 hover:text-emerald-600 rounded text-slate-400 transition-all">
                                                                    <MessageCircle size={10} />
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${statusColors[client.status] || statusColors['PROSPECTO']}`}>
                                                    {client.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black tracking-wide rounded-lg flex items-center gap-1.5 w-max">
                                                    <Folders size={12} className="text-indigo-500" />
                                                    {client.category || "GENERAL"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border rounded-lg flex items-center gap-1.5 w-max ${
                                                    client.salesperson
                                                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                                                    : 'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>
                                                    <User size={12} className={client.salesperson ? 'text-slate-500' : 'text-rose-400'} />
                                                    {client.salesperson?.name || 'GENERAL (SIN ASIGNAR)'}
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
                                            <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                                                 {client.tags?.split(',').map((t: string) => t.trim().toUpperCase()).includes("NUEVO_LEAD") && (
                                                     <button 
                                                         onClick={async (e) => {
                                                             e.stopPropagation();
                                                             const tArr = client.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.toUpperCase() !== "NUEVO_LEAD");
                                                             const updated = { ...client, tags: tArr.join(', ') };
                                                             try {
                                                                 const res = await fetch(`/api/crm/${client.id}`, {
                                                                     method: "PUT",
                                                                     headers: { "Content-Type": "application/json" },
                                                                     body: JSON.stringify(updated)
                                                                 });
                                                                 if (res.ok) {
                                                                     fetchClients();
                                                                 }
                                                             } catch (err) {
                                                                 console.error(err);
                                                             }
                                                         }}
                                                         className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition-all shrink-0"
                                                     >
                                                         ★ Aceptar
                                                     </button>
                                                 )}
                                                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0">
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
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div className="space-y-2">
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
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Grupo de Contactos</label>
                                                <select 
                                                    value={editForm.category || "GENERAL"}
                                                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                                    className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase"
                                                >
                                                    <option value="GENERAL">GENERAL</option>
                                                    {customGroups.map(g => (
                                                        <option key={g} value={g}>{g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Asesor Asignado</label>
                                                <select 
                                                    value={editForm.salespersonId || editForm.salesperson?.id || ""}
                                                    onChange={(e) => setEditForm({...editForm, salespersonId: e.target.value})}
                                                    className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase"
                                                >
                                                    <option value="">SIN ASIGNAR (GENERAL)</option>
                                                    {users.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Etiquetas Dinámicas</label>
                                                <div className="flex flex-wrap gap-2 mb-2 min-h-[32px] bg-slate-50 border border-slate-200 p-2 rounded-lg">
                                                    {editForm.tags ? editForm.tags.split(',').filter(Boolean).map((tag: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded flex items-center gap-1 group">
                                                            {tag.trim().toUpperCase()}
                                                            <button 
                                                                onClick={() => {
                                                                    const tArr = editForm.tags.split(',').map((t: string) => t.trim())
                                                                    tArr.splice(i, 1)
                                                                    setEditForm({...editForm, tags: tArr.join(', ')})
                                                                }} 
                                                                className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-500"
                                                            ><X size={10}/></button>
                                                        </span>
                                                    )) : <span className="text-xs text-slate-400 italic py-1">Sin etiquetas</span>}
                                                </div>
                                                <input 
                                                    type="text"
                                                    placeholder="Escribe y presiona Enter para añadir..."
                                                    onKeyDown={handleAddTag}
                                                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-indigo-500 transition-all uppercase placeholder:normal-case placeholder:text-slate-400 placeholder:font-normal"
                                                />
                                            </div>
                                        </div>

                                        {/* PENDIENTES SECTION */}
                                        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                                                    <AlertCircle size={16} className="text-amber-500" /> Tareas Pendientes
                                                </h3>
                                                <button onClick={() => setIsAddingPendiente(true)} className="text-xs font-bold bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                                    <Plus size={14} /> Añadir Pendiente
                                                </button>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-3">
                                                {(() => {
                                                    let parsedPendientes = [];
                                                    try { parsedPendientes = editForm.pendientes ? JSON.parse(editForm.pendientes) : []; } catch(e) {}
                                                    
                                                    if (parsedPendientes.length === 0) {
                                                        return <p className="text-sm text-slate-400 italic w-full text-center py-4">No hay tareas pendientes asociadas a este cliente.</p>
                                                    }

                                                    return parsedPendientes.map((p: any) => (
                                                        <div key={p.id} className={`relative group border rounded-lg p-3 w-full sm:w-[calc(50%-6px)] shadow-sm transition-all ${p.done ? 'bg-slate-50/70 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'}`}>
                                                            <div className="flex justify-between items-start">
                                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded shadow-xs mb-2 inline-block ${p.done ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                                    {p.type}
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    <button 
                                                                        onClick={() => setExpandedPendientes({...expandedPendientes, [p.id]: !expandedPendientes[p.id]})}
                                                                        className="p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded transition-colors"
                                                                        title="Ver descripción"
                                                                    >
                                                                        <MoreHorizontal size={14} />
                                                                    </button>
                                                                    {!p.done && (
                                                                        <button 
                                                                            onClick={(e) => handleCompletePendiente(p.id, e)}
                                                                            className="px-2.5 py-1 text-[10px] font-black uppercase bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1"
                                                                            title="Marcar como realizado"
                                                                        >
                                                                            <Check size={11} /> Realizado
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className={`text-xs text-slate-700 font-bold transition-all overflow-hidden ${p.done ? 'line-through decoration-slate-300 text-slate-400' : ''} ${expandedPendientes[p.id] ? '' : 'line-clamp-2'}`}>
                                                                {p.description}
                                                            </p>
                                                            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-100">
                                                                <span className="text-[9px] font-black text-slate-400 uppercase">
                                                                    Creado: {new Date(p.date).toLocaleDateString()}
                                                                </span>
                                                                {p.done && p.completedAt && (
                                                                    <span className="text-[9px] font-black text-slate-400 uppercase">
                                                                        Resuelto: {new Date(p.completedAt).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}
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
                                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 relative group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2"><Calendar size={18} className="text-indigo-500" /> <span className="text-[10px] font-black uppercase text-slate-500">Última Promo</span></div>
                                                            <button onClick={handleAddPromotion} title="Registrar Promoción Hoy" className="p-1.5 bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100 shadow-sm">
                                                                <Zap size={14} />
                                                            </button>
                                                        </div>
                                                        <p className="text-lg font-bold text-[#0F172A]">{editForm.lastPromotion ? new Date(editForm.lastPromotion).toLocaleDateString() : 'Ninguna'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end pt-6 border-t border-slate-200 mt-8">
                                            <button onClick={handleSaveClient} className="px-8 py-4 bg-[#0F172A] text-white hover:bg-[#1E293B] font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-3">
                                                <Save size={18} /> GUARDAR CLIENTE
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "BITACORA" && (
                                    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                                <Edit2 size={16} />
                                            </div>
                                            <div className="flex-1 flex flex-col gap-3">
                                                <textarea 
                                                    value={newObservation}
                                                    onChange={(e) => setNewObservation(e.target.value)}
                                                    placeholder="Registra una nueva llamada, reunión, o nota de seguimiento para este cliente..."
                                                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 min-h-[80px] resize-none shadow-sm"
                                                />
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 relative">
                                                        <input 
                                                            type="text"
                                                            placeholder="URL de imagen de evidencia (opcional, ej. https://ejemplo.com/evidencia.jpg)..."
                                                            value={evidenceImageUrl}
                                                            onChange={(e) => setEvidenceImageUrl(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-4 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-500 transition-all shadow-sm"
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={handleAddObservation}
                                                        className="bg-indigo-600 text-white px-6 py-2 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-indigo-700 transition-colors shadow-sm h-[32px] flex items-center gap-1 shrink-0"
                                                    >
                                                        Publicar Nota
                                                    </button>
                                                </div>
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
                                                                        {(() => {
                                                                            const rawContent = match[3];
                                                                            const imgMatch = rawContent.match(/!\[.*?\]\((.*?)\)/) || rawContent.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i);
                                                                            const cleanText = rawContent.replace(/!\[.*?\]\((.*?)\)/g, '').trim();
                                                                            return (
                                                                                <>
                                                                                    <p className="text-slate-600 text-sm leading-relaxed">{cleanText}</p>
                                                                                    {imgMatch && (
                                                                                        <div className="mt-3 relative group/img max-w-sm rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                                                                                            <img 
                                                                                                src={imgMatch[1]} 
                                                                                                alt="Evidencia" 
                                                                                                className="object-contain w-full max-h-48 cursor-zoom-in hover:scale-[1.02] transition-transform"
                                                                                                onClick={() => window.open(imgMatch[1], '_blank')}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        })()}
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
                                                    <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between relative">
                                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleDuplicateQuote(q)} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 rounded transition-colors" title="Duplicar Cotización">
                                                                <Copy size={14} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                    <FileText size={20} />
                                                                </div>
                                                                <span className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md uppercase mr-6">{q.status}</span>
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
                        
                        {/* PENDIENTES MODAL */}
                        {isAddingPendiente && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                                    onClick={() => setIsAddingPendiente(false)}
                                />
                                <motion.div 
                                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                                    className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-200"
                                >
                                    <h3 className="text-lg font-black text-[#0F172A] mb-4 flex items-center gap-2">
                                        <AlertCircle size={20} className="text-amber-500" /> Añadir Nuevo Pendiente
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tipo de Pendiente</label>
                                            <select 
                                                value={pendienteForm.type}
                                                onChange={(e) => setPendienteForm({...pendienteForm, type: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            >
                                                <option value="Nota de venta">Nota de Venta</option>
                                                <option value="Devolución">Devolución</option>
                                                <option value="Cancelación de pedido">Cancelación de Pedido</option>
                                                <option value="Garantía">Garantía</option>
                                                <option value="Otro">Otro Asunto</option>
                                            </select>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Descripción del Problema/Pendiente</label>
                                            <textarea 
                                                value={pendienteForm.description}
                                                onChange={(e) => setPendienteForm({...pendienteForm, description: e.target.value})}
                                                placeholder="Describe el problema, número de orden asociado o situación actual..."
                                                className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-medium text-[#0F172A] rounded-lg outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all min-h-[120px] resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button 
                                            onClick={() => setIsAddingPendiente(false)}
                                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={handleAddPendiente}
                                            className="flex-1 px-4 py-2.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
                                        >
                                            Guardar Pendiente
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function PlaylistButton({ active, onClick, icon, label, count, onDelete }: any) {
    return (
        <div className="group/btn relative">
            <button 
                onClick={onClick}
                className={`w-full flex items-center justify-between pl-4 pr-10 py-2.5 rounded-lg transition-all text-sm font-bold ${
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
            {onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete() }} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-red-100 hover:text-red-600 text-slate-400 opacity-0 group-hover/btn:opacity-100 transition-all z-20"
                    title="Eliminar grupo"
                >
                    <Trash2 size={13} />
                </button>
            )}
        </div>
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
