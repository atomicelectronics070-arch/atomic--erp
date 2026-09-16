"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, 
    Filter, 
    Phone, 
    Mail, 
    MapPin, 
    Building, 
    Plus, 
    X, 
    MessageSquare, 
    Download, 
    Calendar, 
    User, 
    Briefcase, 
    Sparkles, 
    CheckCircle2, 
    AlertCircle, 
    RefreshCw, 
    ArrowUpDown, 
    ChevronRight,
    Users,
    FileText,
    ExternalLink
} from "lucide-react"

interface ClientContact {
    id: string
    name: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    city?: string
    requirement?: string
    status: string
    tags?: string
    source?: string
    createdAt: string
    salesperson?: {
        id: string
        name: string
        email: string
    }
}

const STATUS_OPTIONS = [
    "TODOS",
    "PROSPECTO",
    "COTIZADO",
    "EN NEGOCIACIÓN",
    "CERRADO",
    "PENDIENTE"
]

export default function ContactsHistoricalClient() {
    const [contacts, setContacts] = useState<ClientContact[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("TODOS")
    const [selectedCity, setSelectedCity] = useState("TODAS")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // Form fields (7 exact fields)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        requirement: "",
        status: "PROSPECTO",
        phone: "",
        city: ""
    })

    const showToast = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 4000)
    }

    // Fetch contacts from API
    const fetchContacts = async () => {
        setLoading(true)
        try {
            // First attempt: fetch from attendance API with allContacts flag
            let res = await fetch("/api/attendance?allContacts=true")
            let data = await res.json()
            
            if (data?.clients && Array.isArray(data.clients)) {
                setContacts(data.clients)
            } else {
                // Fallback to formularios API if available
                res = await fetch("/api/admin/formularios")
                data = await res.json()
                if (data?.leads && Array.isArray(data.leads)) {
                    setContacts(data.leads)
                }
            }
        } catch (error) {
            console.error("Error fetching historical contacts:", error)
            showToast("error", "No se pudo cargar la lista de contactos.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    // Extract dynamic cities for filter
    const citiesList = useMemo(() => {
        const set = new Set<string>()
        contacts.forEach(c => {
            if (c.city && c.city.trim()) set.add(c.city.trim())
        })
        return Array.from(set).sort()
    }, [contacts])

    // Filtered contacts
    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            // Text search
            const query = searchTerm.toLowerCase().trim()
            const matchesSearch = !query || (
                (contact.name && contact.name.toLowerCase().includes(query)) ||
                (contact.firstName && contact.firstName.toLowerCase().includes(query)) ||
                (contact.lastName && contact.lastName.toLowerCase().includes(query)) ||
                (contact.phone && contact.phone.includes(query)) ||
                (contact.city && contact.city.toLowerCase().includes(query)) ||
                (contact.tags && contact.tags.toLowerCase().includes(query)) ||
                (contact.requirement && contact.requirement.toLowerCase().includes(query))
            )

            // Status filter
            const normContactStatus = (contact.status || "PROSPECTO").toUpperCase()
            const matchesStatus = selectedStatus === "TODOS" || normContactStatus.includes(selectedStatus) || (selectedStatus === "EN NEGOCIACIÓN" && normContactStatus.includes("NEGOCIAC"))

            // City filter
            const matchesCity = selectedCity === "TODAS" || (contact.city && contact.city.trim().toLowerCase() === selectedCity.toLowerCase())

            return matchesSearch && matchesStatus && matchesCity
        })
    }, [contacts, searchTerm, selectedStatus, selectedCity])

    // Add contact submission
    const handleCreateContact = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.phone && !formData.firstName && !formData.company) {
            showToast("error", "Ingresa al menos el nombre, empresa o teléfono del contacto.")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "add_contact",
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    company: formData.company,
                    requirement: formData.requirement,
                    status: formData.status,
                    phone: formData.phone,
                    city: formData.city
                })
            })
            const result = await res.json()
            if (result.success) {
                if (result.client) {
                    setContacts(prev => [result.client, ...prev])
                }
                setFormData({
                    firstName: "",
                    lastName: "",
                    company: "",
                    requirement: "",
                    status: "PROSPECTO",
                    phone: "",
                    city: ""
                })
                setIsAddModalOpen(false)
                showToast("success", "Contacto registrado exitosamente.")
            } else {
                showToast("error", result.error || "Error al registrar el contacto.")
            }
        } catch (e) {
            showToast("error", "Error de red al guardar el contacto.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Export to CSV
    const handleExportCSV = () => {
        if (filteredContacts.length === 0) return
        const headers = ["Nombre", "Apellido", "Organización", "Teléfono", "Ciudad", "Requerimiento", "Estado", "Fecha"]
        const rows = filteredContacts.map(c => [
            `"${c.firstName || ''}"`,
            `"${c.lastName || ''}"`,
            `"${c.tags || ''}"`,
            `"${c.phone || ''}"`,
            `"${c.city || ''}"`,
            `"${(c.requirement || '').replace(/"/g, '""')}"`,
            `"${c.status || 'PROSPECTO'}"`,
            `"${new Date(c.createdAt).toLocaleDateString('es-EC')}"`
        ])
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `contactos_historicos_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Status badge styling
    const getStatusBadge = (statusStr: string = "PROSPECTO") => {
        const s = statusStr.toUpperCase()
        if (s.includes("CERRADO") || s.includes("GANADO") || s.includes("ACTIVO")) {
            return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        }
        if (s.includes("NEGOCIAC") || s.includes("COTIZ")) {
            return "bg-amber-500/20 text-amber-300 border-amber-500/30"
        }
        if (s.includes("INTERESADO") || s.includes("PROSPECTO")) {
            return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
        }
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
            {/* Toast Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
                            notification.type === 'success' 
                                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
                                : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                        }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                        <span className="text-sm font-medium">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/40 border border-slate-800/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-emerald-400" /> CRM Central de Prospección
                            </span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                {contacts.length} Contactos Totales
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-3 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                            Historial de Contactos y Prospección
                        </h1>
                        <p className="text-sm md:text-base text-slate-400 mt-1 max-w-2xl">
                            Directorio completo de clientes, requerimientos, estados de negociación y enlace directo a WhatsApp.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-md"
                        >
                            <Download className="w-4 h-4" /> Exportar CSV
                        </button>
                        <button
                            onClick={fetchContacts}
                            disabled={loading}
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-md"
                            title="Actualizar listado"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs md:text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[3]" /> Añadir Contacto
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl">
                    <span className="text-xs text-slate-400">Total Contactos</span>
                    <p className="text-2xl md:text-3xl font-bold font-mono text-white mt-1">{contacts.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl">
                    <span className="text-xs text-slate-400">Filtrados</span>
                    <p className="text-2xl md:text-3xl font-bold font-mono text-emerald-400 mt-1">{filteredContacts.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl">
                    <span className="text-xs text-slate-400">Ciudades Cubiertas</span>
                    <p className="text-2xl md:text-3xl font-bold font-mono text-indigo-400 mt-1">{citiesList.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-xl">
                    <span className="text-xs text-slate-400">Con Teléfono Activo</span>
                    <p className="text-2xl md:text-3xl font-bold font-mono text-cyan-400 mt-1">
                        {contacts.filter(c => c.phone).length}
                    </p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 md:p-6 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por cliente, organización, teléfono, ciudad o requerimiento..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* City Selector */}
                    <div className="w-full md:w-64">
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
                        >
                            <option value="TODAS">Todas las Ciudades ({citiesList.length})</option>
                            {citiesList.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Status Badges Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="text-slate-400 font-semibold shrink-0 mr-1">Estado:</span>
                    {STATUS_OPTIONS.map(status => {
                        const isSelected = selectedStatus === status
                        return (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`px-3 py-1.5 rounded-lg border font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
                                    isSelected 
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20' 
                                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                }`}
                            >
                                {status}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Contacts Table & Responsive Cards */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950/80 uppercase text-[11px] text-slate-400 tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="p-4">Cliente / Organización</th>
                                <th className="p-4">Teléfono & WhatsApp</th>
                                <th className="p-4">Ciudad / Sector</th>
                                <th className="p-4">Requerimiento</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4">Fecha de Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-normal">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                                        Cargando directorio de prospectos...
                                    </td>
                                </tr>
                            ) : filteredContacts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400">
                                        No se encontraron contactos que coincidan con la búsqueda o filtros seleccionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredContacts.map((contact) => {
                                    const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : ""
                                    const waNumber = cleanPhone.startsWith("0") ? `593${cleanPhone.slice(1)}` : cleanPhone

                                    return (
                                        <tr key={contact.id} className="hover:bg-slate-850/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-white text-sm">
                                                    {contact.name || [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "Sin Nombre"}
                                                </div>
                                                {contact.tags && (
                                                    <div className="text-[11px] text-indigo-300 font-medium flex items-center gap-1 mt-0.5">
                                                        <Building className="w-3 h-3" /> {contact.tags}
                                                    </div>
                                                )}
                                                {contact.email && (
                                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-2.5 h-2.5" /> {contact.email}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-4">
                                                {contact.phone ? (
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={`tel:${contact.phone}`}
                                                            className="font-mono text-slate-200 hover:text-white flex items-center gap-1 hover:underline"
                                                        >
                                                            <Phone className="w-3 h-3 text-slate-400" /> {contact.phone}
                                                        </a>
                                                        <a
                                                            href={`https://wa.me/${waNumber}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-all"
                                                        >
                                                            <MessageSquare className="w-3 h-3" /> WhatsApp
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-slate-200">
                                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                    <span>{contact.city || "No registrada"}</span>
                                                </div>
                                            </td>

                                            <td className="p-4 max-w-xs">
                                                <p className="text-slate-300 line-clamp-2 text-xs">
                                                    {contact.requirement || "Sin requerimiento especificado"}
                                                </p>
                                            </td>

                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(contact.status)}`}>
                                                    {contact.status || "PROSPECTO"}
                                                </span>
                                            </td>

                                            <td className="p-4 text-slate-400 text-xs font-mono">
                                                {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString("es-EC", {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                }) : "-"}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: AÑADIR CONTACTO (7 EXACT FIELDS) */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <Plus className="w-6 h-6 stroke-[3]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Añadir Nuevo Contacto</h3>
                                    <p className="text-xs text-slate-400">Registra directamente en la base de datos de prospectos</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreateContact} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 1. Nombre */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">1. Nombre *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder="Ej. Roberto"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    {/* 2. Apellido */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">2. Apellido</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            placeholder="Ej. Gomez"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* 3. Nombre o Organización */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-300">3. Nombre o Organización</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Ej. Inmobiliaria del Valle"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* 4. Requerimiento */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-300">4. Requerimiento</label>
                                    <textarea
                                        rows={2}
                                        value={formData.requirement}
                                        onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                                        placeholder="Ej. Cotización de cámaras de seguridad y cerraduras biométricas"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 5. Estado de atención */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">5. Estado de Atención</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="Interesado">Interesado</option>
                                            <option value="Cotizado">Cotizado</option>
                                            <option value="En Negociación">En Negociación</option>
                                            <option value="Cerrado">Cerrado</option>
                                            <option value="Pendiente">Pendiente</option>
                                        </select>
                                    </div>

                                    {/* 6. Número de teléfono */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">6. Número de Teléfono *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Ej. 0987654321"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                                        />
                                    </div>
                                </div>

                                {/* 7. Ciudad o sector de residencia */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-300">7. Ciudad o Sector de Residencia</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="Ej. Guayaquil / Samborondón"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Guardando..." : "Guardar Contacto"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
