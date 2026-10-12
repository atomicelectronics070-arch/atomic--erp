"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Truck, Building2, Phone, Mail, MessageSquare, ExternalLink, 
    Search, Plus, Edit3, Trash2, Check, X, Copy, ShieldCheck, 
    Tag, Star, Clock, MapPin, AlertCircle, RefreshCw, Send, 
    CheckCircle2, ChevronRight, Filter, Sparkles, FileText, ArrowLeft
} from "lucide-react"

export interface SupplierItem {
    id: string
    name: string
    contactName: string
    phone: string
    email: string
    city: string
    address?: string
    category: string
    brands: string[]
    discountTerms: string
    creditDays: number
    warrantyNotes: string
    internalNotes?: string
    isPreferred?: boolean
    updatedAt: string
}

export default function SuppliersManager({ onClose }: { onClose?: () => void }) {
    const { data: session } = useSession()
    const userRole = (session?.user as any)?.role?.toUpperCase() || ""
    const isAdminOrStaff = userRole === "ADMIN" || userRole === "SUPERVISOR" || userRole === "COORDINATOR" || userRole === "MANAGEMENT"

    const [suppliers, setSuppliers] = useState<SupplierItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
    
    // "El Cajón" (Drawer de detalle / edición)
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null)
    const [isEditingDrawer, setIsEditingDrawer] = useState(false)
    const [drawerForm, setDrawerForm] = useState<Partial<SupplierItem>>({})
    const [isSaving, setIsSaving] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    // Modal para Nuevo Proveedor
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)
    const [newForm, setNewForm] = useState<Partial<SupplierItem>>({
        name: "",
        contactName: "",
        phone: "",
        email: "",
        city: "Quito / Guayaquil",
        address: "",
        category: "CCTV / Cámaras",
        brands: [],
        discountTerms: "",
        creditDays: 30,
        warrantyNotes: "Garantía estándar 1 año",
        internalNotes: "",
        isPreferred: false
    })
    const [newBrandsInput, setNewBrandsInput] = useState("")

    // Plantilla de mensaje de WhatsApp personalizada
    const [waTemplate, setWaTemplate] = useState<"cotizacion" | "stock" | "rma">("cotizacion")

    const fetchSuppliers = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/suppliers")
            if (res.ok) {
                const data = await res.json()
                if (data.suppliers) {
                    setSuppliers(data.suppliers)
                }
            }
        } catch (err) {
            console.error("Error al cargar proveedores:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSuppliers()
    }, [])

    // Categories list
    const categories = useMemo(() => {
        const set = new Set<string>()
        suppliers.forEach(s => {
            if (s.category) set.add(s.category)
        })
        return ["ALL", ...Array.from(set)]
    }, [suppliers])

    // Filtered suppliers
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(s => {
            const matchesCategory = selectedCategory === "ALL" || s.category === selectedCategory
            const q = searchTerm.toLowerCase().trim()
            if (!q) return matchesCategory
            const matchesText = 
                s.name.toLowerCase().includes(q) ||
                s.contactName.toLowerCase().includes(q) ||
                s.phone.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.city.toLowerCase().includes(q) ||
                (s.brands && s.brands.some(b => b.toLowerCase().includes(q))) ||
                (s.discountTerms && s.discountTerms.toLowerCase().includes(q))
            return matchesCategory && matchesText
        })
    }, [suppliers, selectedCategory, searchTerm])

    // Helper: Normalize phone for WhatsApp wa.me link
    const cleanPhoneForWa = (phoneStr: string) => {
        let clean = phoneStr.replace(/\D/g, "")
        if (clean.startsWith("0")) {
            clean = "593" + clean.substring(1)
        } else if (!clean.startsWith("593") && clean.length === 9) {
            clean = "593" + clean
        }
        return clean
    }

    // Copy to clipboard helper
    const handleCopy = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(fieldName)
        setTimeout(() => setCopiedField(null), 2000)
    }

    // Open Cajón (Drawer)
    const handleOpenDrawer = (supplier: SupplierItem) => {
        setSelectedSupplier(supplier)
        setDrawerForm({ ...supplier })
        setIsEditingDrawer(false)
    }

    // Save changes from Cajón (Drawer)
    const handleSaveDrawer = async () => {
        if (!selectedSupplier || !drawerForm.name || !drawerForm.phone) return
        setIsSaving(true)
        try {
            const res = await fetch("/api/admin/suppliers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedSupplier.id,
                    ...drawerForm
                })
            })
            if (res.ok) {
                const data = await res.json()
                if (data.supplier) {
                    setSuppliers(prev => prev.map(s => s.id === data.supplier.id ? data.supplier : s))
                    setSelectedSupplier(data.supplier)
                    setIsEditingDrawer(false)
                }
            } else {
                alert("Error al guardar cambios del proveedor")
            }
        } catch (e: any) {
            alert(`Error de red: ${e.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    // Delete supplier
    const handleDeleteSupplier = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar al proveedor "${name}"? Esta acción no se puede deshacer.`)) {
            return
        }
        try {
            const res = await fetch(`/api/admin/suppliers?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setSuppliers(prev => prev.filter(s => s.id !== id))
                if (selectedSupplier?.id === id) {
                    setSelectedSupplier(null)
                }
            } else {
                alert("No se pudo eliminar el proveedor")
            }
        } catch (e: any) {
            alert(`Error: ${e.message}`)
        }
    }

    // Create New Supplier
    const handleCreateSupplier = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newForm.name || !newForm.phone) {
            alert("Nombre y teléfono son obligatorios")
            return
        }
        setIsSaving(true)
        try {
            const brandsArray = newBrandsInput
                .split(",")
                .map(b => b.trim())
                .filter(Boolean)

            const res = await fetch("/api/admin/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newForm,
                    brands: brandsArray
                })
            })
            if (res.ok) {
                const data = await res.json()
                if (data.supplier) {
                    setSuppliers(prev => [data.supplier, ...prev])
                    setIsNewModalOpen(false)
                    setNewForm({
                        name: "",
                        contactName: "",
                        phone: "",
                        email: "",
                        city: "Quito / Guayaquil",
                        address: "",
                        category: "CCTV / Cámaras",
                        brands: [],
                        discountTerms: "",
                        creditDays: 30,
                        warrantyNotes: "Garantía estándar 1 año",
                        internalNotes: "",
                        isPreferred: false
                    })
                    setNewBrandsInput("")
                    handleOpenDrawer(data.supplier)
                }
            } else {
                alert("Error al registrar el proveedor")
            }
        } catch (e: any) {
            alert(`Error: ${e.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    // WhatsApp Message Generator
    const getWhatsAppUrl = (supplier: SupplierItem) => {
        const clean = cleanPhoneForWa(supplier.phone)
        let text = ""
        if (waTemplate === "cotizacion") {
            text = `Hola ${supplier.contactName || ""}, un saludo de parte de ATOMIC. Por favor, ¿me ayudas con la disponibilidad de stock y cotización con nuestro descuento de distribuidor pactado? Muchas gracias.`
        } else if (waTemplate === "stock") {
            text = `Hola ${supplier.contactName || ""}, te saludo desde ATOMIC. ¿Tienen entrega inmediata para el siguiente requerimiento urgente?`
        } else {
            text = `Hola ${supplier.contactName || ""}, te escribo de ATOMIC para gestionar el soporte/garantía de un equipo. ¿A qué dirección o con qué código de RMA lo remitimos?`
        }
        return `https://wa.me/${clean}?text=${encodeURIComponent(text.trim())}`
    }

    // Mailto generator
    const getMailtoUrl = (supplier: SupplierItem) => {
        const subject = encodeURIComponent(`Solicitud de Cotización y Pedido - ATOMIC ERP (${supplier.name})`)
        const body = encodeURIComponent(
            `Estimado(a) ${supplier.contactName || "Asesor Comercial"},\n\n` +
            `Junto con saludar cordialmente, solicitamos cotización formal con nuestras condiciones comerciales acordadas (${supplier.discountTerms || "descuento pactado"}).\n\n` +
            `Detalle del requerimiento:\n- [Indicar productos y cantidades]\n\n` +
            `Agradecemos remitir factura proforma o confirmación de stock a la brevedad.\n\n` +
            `Atentamente,\nEquipo de Operaciones & Compras\nATOMIC Ecuador`
        )
        return `mailto:${supplier.email}?subject=${subject}&body=${body}`
    }

    return (
        <div className="w-full h-full flex flex-col font-sans relative">
            
            {/* Top Toolbar */}
            <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-cyan-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 mb-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950">
                        <Truck size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                                Directorio Maestro de Proveedores
                            </h2>
                            <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase">
                                {suppliers.length} Registrados
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Tratos comerciales, contactos directos, botón WhatsApp y correo rápido con cajón interactivo.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={fetchSuppliers}
                        className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Actualizar proveedores"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span className="hidden sm:inline">Recargar</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsNewModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all cursor-pointer"
                    >
                        <Plus size={15} />
                        <span>Nuevo Proveedor</span>
                    </button>
                </div>
            </div>

            {/* Search & Categories Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                    <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por marca, empresa, asesor, ciudad o teléfono..."
                        className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-3 text-slate-400 hover:text-white"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                {/* Categories Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                selectedCategory === cat
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm"
                                    : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80"
                            }`}
                        >
                            {cat === "ALL" ? "Todos los Rubros" : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Cards Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3 text-cyan-400">
                        <RefreshCw size={24} className="animate-spin" />
                        <span className="text-xs font-mono">Cargando directorio de proveedores...</span>
                    </div>
                ) : filteredSuppliers.length === 0 ? (
                    <div className="h-64 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-2">
                        <Building2 size={32} className="text-slate-600" />
                        <p className="text-sm font-bold text-slate-300">No se encontraron proveedores</p>
                        <p className="text-xs text-slate-500">Prueba con otro término de búsqueda o registra un nuevo proveedor.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-6">
                        {filteredSuppliers.map((supplier) => {
                            const isSelected = selectedSupplier?.id === supplier.id
                            return (
                                <motion.div
                                    key={supplier.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group relative ${
                                        isSelected
                                            ? "bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400"
                                            : "bg-slate-950/70 hover:bg-slate-900/80 border-slate-800 hover:border-cyan-500/50"
                                    }`}
                                >
                                    {/* Card Header */}
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                                        {supplier.category || "General"}
                                                    </span>
                                                    {supplier.isPreferred && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                                            <Star size={10} className="fill-amber-400 text-amber-400" /> Preferente
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-sm font-black text-white mt-1.5 group-hover:text-cyan-300 transition-colors leading-snug">
                                                    {supplier.name}
                                                </h3>
                                            </div>

                                            {/* Action to open Cajón */}
                                            <button
                                                type="button"
                                                onClick={() => handleOpenDrawer(supplier)}
                                                className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shrink-0"
                                                title="Abrir cajón con todos los detalles y edición"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>

                                        {/* Contact Person & Location */}
                                        <div className="space-y-1.5 text-xs text-slate-300 my-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500 font-medium">Asesor:</span>
                                                <span className="font-bold text-slate-200">{supplier.contactName || "No asignado"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={13} className="text-slate-500 shrink-0" />
                                                <span className="text-slate-400 truncate text-[11px]">{supplier.city || "Ecuador"}</span>
                                            </div>
                                        </div>

                                        {/* Brands Tags */}
                                        {supplier.brands && supplier.brands.length > 0 && (
                                            <div className="flex flex-wrap gap-1 my-2">
                                                {supplier.brands.slice(0, 4).map((brand, bIdx) => (
                                                    <span 
                                                        key={bIdx}
                                                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                                                    >
                                                        {brand}
                                                    </span>
                                                ))}
                                                {supplier.brands.length > 4 && (
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                                                        +{supplier.brands.length - 4} más
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Terms Snippet */}
                                        {supplier.discountTerms && (
                                            <div className="p-2 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-200/90 my-2">
                                                <span className="font-bold text-cyan-300">Trato: </span>
                                                <span className="line-clamp-2">{supplier.discountTerms}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons: WhatsApp & Correo Rápido */}
                                    <div className="pt-3 border-t border-slate-800/80 mt-2 flex items-center gap-2">
                                        {/* Botón WhatsApp Rápido */}
                                        <a
                                            href={getWhatsAppUrl(supplier)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm group/btn cursor-pointer"
                                            title="Escribir por WhatsApp al asesor"
                                        >
                                            <MessageSquare size={13} className="text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                                            <span>WhatsApp</span>
                                        </a>

                                        {/* Botón Correo Rápido */}
                                        <a
                                            href={getMailtoUrl(supplier)}
                                            className="flex-1 py-2 px-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm group/btn cursor-pointer"
                                            title="Mandar correo rápido con plantilla de cotización"
                                        >
                                            <Mail size={13} className="text-blue-400 group-hover/btn:scale-110 transition-transform" />
                                            <span>Correo</span>
                                        </a>

                                        {/* Botón Abrir Cajón */}
                                        <button
                                            type="button"
                                            onClick={() => handleOpenDrawer(supplier)}
                                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs transition-colors cursor-pointer"
                                            title="Ver expediente completo"
                                        >
                                            <FileText size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* EL CAJÓN (DRAWER LATERAL DESLIZANTE DE INFORMACIÓN Y EDICIÓN COMPLETA)     */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {selectedSupplier && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
                        onClick={() => setSelectedSupplier(null)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="w-full max-w-xl h-full bg-[#070b19] border-l-2 border-cyan-500/40 p-5 sm:p-7 flex flex-col shadow-[-15px_0_40px_rgba(0,0,0,0.9)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Cajón Header */}
                            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSupplier(null)}
                                        className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                                Cajón de Proveedor
                                            </span>
                                            {selectedSupplier.isPreferred && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                    ★ Preferente
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-lg font-black text-white mt-1">
                                            {selectedSupplier.name}
                                        </h2>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedSupplier(null)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Cajón Quick Communication Dock */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-blue-950/40 border border-cyan-500/30 mb-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                                        Acción Inmediata con el Asesor
                                    </span>
                                    <div className="flex gap-1 text-[10px] font-mono">
                                        <button 
                                            onClick={() => setWaTemplate("cotizacion")}
                                            className={`px-2 py-0.5 rounded-md ${waTemplate === "cotizacion" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 bg-slate-900"}`}
                                        >
                                            Cotización
                                        </button>
                                        <button 
                                            onClick={() => setWaTemplate("stock")}
                                            className={`px-2 py-0.5 rounded-md ${waTemplate === "stock" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 bg-slate-900"}`}
                                        >
                                            Stock Urgente
                                        </button>
                                        <button 
                                            onClick={() => setWaTemplate("rma")}
                                            className={`px-2 py-0.5 rounded-md ${waTemplate === "rma" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 bg-slate-900"}`}
                                        >
                                            Garantía
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5">
                                    <a
                                        href={getWhatsAppUrl(selectedSupplier)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-3 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                                    >
                                        <MessageSquare size={16} />
                                        <span>Escribir por WhatsApp</span>
                                    </a>

                                    <a
                                        href={getMailtoUrl(selectedSupplier)}
                                        className="py-3 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
                                    >
                                        <Mail size={16} />
                                        <span>Mandar Correo Rápido</span>
                                    </a>
                                </div>
                            </div>

                            {/* Cajón Content Tabs / Mode */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {isEditingDrawer ? "Modo Edición del Proveedor" : "Ficha Técnica & Tratos Comerciales"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingDrawer(!isEditingDrawer)}
                                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <Edit3 size={13} />
                                    <span>{isEditingDrawer ? "Cancelar Edición" : "Editar Información"}</span>
                                </button>
                            </div>

                            {/* Cajón Scrollable Body */}
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                {!isEditingDrawer ? (
                                    <>
                                        {/* Contact Card */}
                                        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                                <Phone size={13} className="text-cyan-400" />
                                                Datos de Contacto
                                            </h4>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <span className="text-slate-500 block text-[11px]">Asesor Asignado:</span>
                                                    <span className="font-bold text-white text-sm">{selectedSupplier.contactName || "No registrado"}</span>
                                                </div>

                                                <div>
                                                    <span className="text-slate-500 block text-[11px]">Teléfono / Celular:</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-white">{selectedSupplier.phone}</span>
                                                        <button 
                                                            onClick={() => handleCopy(selectedSupplier.phone, "phone")}
                                                            className="text-slate-400 hover:text-white"
                                                            title="Copiar teléfono"
                                                        >
                                                            {copiedField === "phone" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <span className="text-slate-500 block text-[11px]">Correo Electrónico:</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-cyan-300 font-semibold">{selectedSupplier.email || "No registrado"}</span>
                                                        {selectedSupplier.email && (
                                                            <button 
                                                                onClick={() => handleCopy(selectedSupplier.email, "email")}
                                                                className="text-slate-400 hover:text-white"
                                                                title="Copiar correo"
                                                            >
                                                                {copiedField === "email" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <span className="text-slate-500 block text-[11px]">Ubicación / Dirección:</span>
                                                    <span className="text-slate-300">{selectedSupplier.address || selectedSupplier.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Commercial Deals & Terms */}
                                        <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/20 space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                                                <Tag size={13} />
                                                Tratos & Condiciones Comerciales
                                            </h4>

                                            <div className="space-y-2.5 text-xs">
                                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Descuento Pactado</span>
                                                    <p className="text-white font-medium mt-0.5">{selectedSupplier.discountTerms || "Sin descuento acordado"}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2.5">
                                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Plazo de Crédito</span>
                                                        <p className="text-cyan-300 font-bold mt-0.5 flex items-center gap-1">
                                                            <Clock size={13} />
                                                            {selectedSupplier.creditDays > 0 ? `${selectedSupplier.creditDays} días` : "Contado / Anticipado"}
                                                        </p>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Rubro Principal</span>
                                                        <p className="text-white font-bold mt-0.5">{selectedSupplier.category}</p>
                                                    </div>
                                                </div>

                                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Garantías & Políticas RMA</span>
                                                    <p className="text-slate-300 mt-0.5">{selectedSupplier.warrantyNotes || "Garantía estándar según fabricante"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Brands & Lines */}
                                        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                                <ShieldCheck size={13} className="text-emerald-400" />
                                                Marcas Suministradas
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {selectedSupplier.brands && selectedSupplier.brands.length > 0 ? (
                                                    selectedSupplier.brands.map((b, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono">
                                                            {b}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-500 italic">No hay marcas detalladas</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Internal Notes */}
                                        {selectedSupplier.internalNotes && (
                                            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
                                                <span className="font-bold text-amber-300 block uppercase text-[10px] tracking-wider">
                                                    Notas Internas de Dirección
                                                </span>
                                                <p>{selectedSupplier.internalNotes}</p>
                                            </div>
                                        )}

                                        {/* Delete Button for Admin */}
                                        {isAdminOrStaff && (
                                            <div className="pt-2 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSupplier(selectedSupplier.id, selectedSupplier.name)}
                                                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Eliminar Proveedor</span>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* EDIT FORM INSIDE DRAWER */
                                    <div className="space-y-3.5 text-xs">
                                        <div>
                                            <label className="text-slate-400 block mb-1">Nombre / Razón Social *</label>
                                            <input 
                                                type="text"
                                                value={drawerForm.name || ""}
                                                onChange={(e) => setDrawerForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div>
                                                <label className="text-slate-400 block mb-1">Asesor / Contacto</label>
                                                <input 
                                                    type="text"
                                                    value={drawerForm.contactName || ""}
                                                    onChange={(e) => setDrawerForm(prev => ({ ...prev, contactName: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-slate-400 block mb-1">Teléfono / WhatsApp *</label>
                                                <input 
                                                    type="text"
                                                    value={drawerForm.phone || ""}
                                                    onChange={(e) => setDrawerForm(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div>
                                                <label className="text-slate-400 block mb-1">Correo Electrónico</label>
                                                <input 
                                                    type="email"
                                                    value={drawerForm.email || ""}
                                                    onChange={(e) => setDrawerForm(prev => ({ ...prev, email: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-slate-400 block mb-1">Categoría</label>
                                                <input 
                                                    type="text"
                                                    value={drawerForm.category || ""}
                                                    onChange={(e) => setDrawerForm(prev => ({ ...prev, category: e.target.value }))}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-slate-400 block mb-1">Ciudad y Dirección</label>
                                            <input 
                                                type="text"
                                                value={drawerForm.address || ""}
                                                onChange={(e) => setDrawerForm(prev => ({ ...prev, address: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-slate-400 block mb-1">Trato & Descuento Pactado</label>
                                            <textarea 
                                                rows={2}
                                                value={drawerForm.discountTerms || ""}
                                                onChange={(e) => setDrawerForm(prev => ({ ...prev, discountTerms: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div>
                                                <label className="text-slate-400 block mb-1">Días de Crédito</label>
                                                <input 
                                                    type="number"
                                                    value={drawerForm.creditDays || 0}
                                                    onChange={(e) => setDrawerForm(prev => ({ ...prev, creditDays: Number(e.target.value) }))}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 pt-5">
                                                <input 
                                                    type="checkbox"
                                                    id="isPreferredCheck"
                                                    checked={Boolean(drawerForm.isPreferred)}
                                                    onChange={(e) => setDrawerForm(prev => ({ ...prev, isPreferred: e.target.checked }))}
                                                    className="w-4 h-4 rounded text-cyan-500"
                                                />
                                                <label htmlFor="isPreferredCheck" className="text-white font-bold cursor-pointer">
                                                    ★ Proveedor Preferente
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-slate-400 block mb-1">Notas de Garantía y RMA</label>
                                            <textarea 
                                                rows={2}
                                                value={drawerForm.warrantyNotes || ""}
                                                onChange={(e) => setDrawerForm(prev => ({ ...prev, warrantyNotes: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-slate-400 block mb-1">Notas Internas</label>
                                            <textarea 
                                                rows={2}
                                                value={drawerForm.internalNotes || ""}
                                                onChange={(e) => setDrawerForm(prev => ({ ...prev, internalNotes: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>

                                        {/* Action buttons inside edit */}
                                        <div className="flex gap-2.5 pt-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingDrawer(false)}
                                                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold transition-colors cursor-pointer"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSaveDrawer}
                                                disabled={isSaving}
                                                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                                                <span>Guardar Cambios</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* MODAL REGISTRAR NUEVO PROVEEDOR                                            */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {isNewModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
                    <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden">
                        
                        <div className="p-4 md:p-6 bg-slate-900/90 border-b border-cyan-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white">Registrar Nuevo Proveedor</h3>
                                    <p className="text-xs text-slate-400">Ingresa la información comercial y de contacto</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNewModalOpen(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSupplier} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 text-xs">
                            <div>
                                <label className="text-slate-300 font-bold block mb-1">Nombre de la Empresa / Mayorista *</label>
                                <input 
                                    type="text"
                                    required
                                    value={newForm.name}
                                    onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ej: Dahua Ecuador / Nexsys"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-300 font-bold block mb-1">Asesor / Contacto Directo</label>
                                    <input 
                                        type="text"
                                        value={newForm.contactName}
                                        onChange={(e) => setNewForm(prev => ({ ...prev, contactName: e.target.value }))}
                                        placeholder="Ej: Ing. Carlos Morales"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-slate-300 font-bold block mb-1">Teléfono / WhatsApp *</label>
                                    <input 
                                        type="text"
                                        required
                                        value={newForm.phone}
                                        onChange={(e) => setNewForm(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="Ej: 0984567890 o +593984567890"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-300 font-bold block mb-1">Correo Electrónico</label>
                                    <input 
                                        type="email"
                                        value={newForm.email}
                                        onChange={(e) => setNewForm(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="ventas@mayorista.com"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-slate-300 font-bold block mb-1">Categoría / Rubro</label>
                                    <select
                                        value={newForm.category}
                                        onChange={(e) => setNewForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="CCTV / Cámaras">CCTV / Cámaras</option>
                                        <option value="Biometría & Acceso">Biometría & Acceso</option>
                                        <option value="Alarmas & Cercos">Alarmas & Cercos</option>
                                        <option value="Redes & Wi-Fi">Redes & Wi-Fi</option>
                                        <option value="Energía & Respaldo">Energía & Respaldo</option>
                                        <option value="Herramientas & Cables">Herramientas & Cables</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-300 font-bold block mb-1">Marcas Suministradas (separadas por coma)</label>
                                <input 
                                    type="text"
                                    value={newBrandsInput}
                                    onChange={(e) => setNewBrandsInput(e.target.value)}
                                    placeholder="Ej: Dahua, TiOC, WizSense, IMOU"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="text-slate-300 font-bold block mb-1">Trato & Descuento Acordado</label>
                                <input 
                                    type="text"
                                    value={newForm.discountTerms}
                                    onChange={(e) => setNewForm(prev => ({ ...prev, discountTerms: e.target.value }))}
                                    placeholder="Ej: 38% sobre lista base, flete gratis por compras > $500"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-300 font-bold block mb-1">Días de Crédito</label>
                                    <input 
                                        type="number"
                                        value={newForm.creditDays}
                                        onChange={(e) => setNewForm(prev => ({ ...prev, creditDays: Number(e.target.value) }))}
                                        placeholder="30"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-6">
                                    <input 
                                        type="checkbox"
                                        id="newIsPreferred"
                                        checked={Boolean(newForm.isPreferred)}
                                        onChange={(e) => setNewForm(prev => ({ ...prev, isPreferred: e.target.checked }))}
                                        className="w-4 h-4 rounded text-cyan-500"
                                    />
                                    <label htmlFor="newIsPreferred" className="text-white font-bold cursor-pointer">
                                        ★ Marcar como Proveedor Preferente
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsNewModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw size={15} className="animate-spin" /> : <Check size={15} />}
                                    <span>Registrar Proveedor</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
