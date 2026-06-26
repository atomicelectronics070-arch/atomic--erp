"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Store, Package, TrendingUp, DollarSign, Edit3,
    Check, X, ChevronRight, ChevronDown, RefreshCw, Percent,
    Filter, BarChart2, Tag, Save, AlertCircle, Eye, EyeOff,
    ArrowUpDown, Grid, List as ListIcon, Plus, Download, ChevronUp,
    ShieldAlert, Info
} from "lucide-react"

interface Product {
    id: string
    name: string
    sku: string | null
    price: number
    compareAtPrice: number | null
    stock: number
    isActive: boolean
    provider: string | null
    images: string | null
    category: { id: string; name: string } | null
    updatedAt: string
}

interface SupplierStat {
    name: string
    count: number
    minPrice: number | null
    maxPrice: number | null
    avgPrice: number | null
}

interface PriceListManagerProps {
    isAdmin?: boolean
}

const SUPPLIER_COLORS: Record<string, { primary: string; glow: string; text: string; bg: string }> = {
    "Banco del Perno": {
        primary: "#3b82f6",
        glow: "rgba(59, 130, 246, 0.15)",
        text: "text-blue-600",
        bg: "bg-blue-50/50"
    },
    "MultiTecnologia V&V": {
        primary: "#10b981",
        glow: "rgba(16, 185, 129, 0.15)",
        text: "text-emerald-600",
        bg: "bg-emerald-50/50"
    },
    "Cronte Technology": {
        primary: "#8b5cf6",
        glow: "rgba(139, 92, 246, 0.15)",
        text: "text-purple-600",
        bg: "bg-purple-50/50"
    },
    "GEMA": {
        primary: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.15)",
        text: "text-amber-600",
        bg: "bg-amber-50/50"
    },
    "Logicenter": {
        primary: "#ef4444",
        glow: "rgba(239, 68, 68, 0.15)",
        text: "text-rose-600",
        bg: "bg-rose-50/50"
    },
    "Unknown": {
        primary: "#64748b",
        glow: "rgba(100, 116, 139, 0.08)",
        text: "text-slate-600",
        bg: "bg-slate-50/50"
    },
    "Sin Proveedor": {
        primary: "#64748b",
        glow: "rgba(100, 116, 139, 0.08)",
        text: "text-slate-600",
        bg: "bg-slate-50/50"
    },
}

function getSupplierStyles(name: string) {
    if (SUPPLIER_COLORS[name]) return SUPPLIER_COLORS[name];
    
    // Generate deterministic colors for dynamic suppliers
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const hue = hash % 360;
    return {
        primary: `hsl(${hue}, 75%, 45%)`,
        glow: `hsla(${hue}, 75%, 45%, 0.15)`,
        text: `text-[hsl(${hue},75%,45%)]`,
        bg: `bg-[hsla(${hue},75%,45%,0.04)]`
    };
}

function safeParseImages(images: string | null): string | null {
    if (!images) return null
    try {
        const parsed = JSON.parse(images)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]
        return images.split(',')[0].replace(/[\[\]"]/g, '')
    } catch {
        return images.split(',')[0].replace(/[\[\]"]/g, '')
    }
}

function calcMargin(cost: number | null, price: number): number | null {
    if (cost === null || cost <= 0) return null
    return ((price - cost) / cost) * 100
}

function InlineEdit({ value, onSave, prefix = "$", min = 0 }: {
    value: number
    onSave: (val: number) => void
    prefix?: string
    min?: number
}) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value.toFixed(2))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) inputRef.current?.select()
    }, [editing])

    const commit = () => {
        const num = parseFloat(draft)
        if (!isNaN(num) && num >= min) {
            onSave(num)
        } else {
            setDraft(value.toFixed(2))
        }
        setEditing(false)
    }

    if (!editing) return (
        <button
            onClick={() => { setDraft(value.toFixed(2)); setEditing(true) }}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-500/30 hover:bg-blue-500/5 text-slate-800 font-black transition-all duration-300 group rounded"
        >
            <span className="text-slate-400 font-bold text-xs">{prefix}</span>
            <span className="tracking-widest text-xs md:text-sm">{value.toFixed(2)}</span>
            <Edit3 size={11} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
        </button>
    )

    return (
        <div className="flex items-center gap-1 bg-white border border-blue-500 p-1 shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded animate-in zoom-in-95 duration-150">
            <span className="text-blue-600 font-black text-xs px-1">{prefix}</span>
            <input
                ref={inputRef}
                type="number"
                step="0.01"
                min={min}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") commit()
                    if (e.key === "Escape") { setDraft(value.toFixed(2)); setEditing(false) }
                }}
                onBlur={commit}
                className="w-20 bg-slate-50 border-none text-slate-800 text-xs font-black tracking-widest outline-none focus:ring-0 px-1 py-0.5"
                autoFocus
            />
            <button onClick={commit} className="p-1 text-emerald-600 hover:text-emerald-500 hover:bg-emerald-50 rounded transition-colors"><Check size={12} /></button>
            <button onClick={() => { setDraft(value.toFixed(2)); setEditing(false) }} className="p-1 text-rose-600 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"><X size={12} /></button>
        </div>
    )
}

function MarginBadge({ margin }: { margin: number | null }) {
    if (margin === null) return <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider italic">Sin costo</span>
    
    let color = "text-emerald-600 border-emerald-200 bg-emerald-50 shadow-[0_0_10px_rgba(16,185,129,0.08)]";
    let text = "EXCELENTE";
    if (margin < 0) {
        color = "text-rose-600 border-rose-200 bg-rose-50 shadow-[0_0_10px_rgba(239,68,68,0.08)]";
        text = "PÉRDIDA";
    } else if (margin < 10) {
        color = "text-orange-600 border-orange-200 bg-orange-50 shadow-[0_0_10px_rgba(249,115,22,0.08)]";
        text = "CRÍTICO";
    } else if (margin < 20) {
        color = "text-yellow-600 border-yellow-200 bg-yellow-50 shadow-[0_0_10px_rgba(234,179,8,0.08)]";
        text = "REGULAR";
    }

    return (
        <span className={`inline-flex flex-col items-start gap-0.5 px-3 py-1.5 border rounded-none skew-x-[-8deg] ${color}`}>
            <span className="skew-x-[8deg] text-[9px] font-black tracking-[0.2em] opacity-60 leading-none">{text}</span>
            <span className="skew-x-[8deg] flex items-center gap-1 text-[11px] font-black tracking-widest mt-0.5 leading-none">
                <TrendingUp size={10} className="stroke-[3px]" />
                {margin.toFixed(1)}%
            </span>
        </span>
    )
}

export function PriceListManager({ isAdmin = false }: PriceListManagerProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [suppliers, setSuppliers] = useState<SupplierStat[]>([])
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    // Filters
    const [selectedSupplier, setSelectedSupplier] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [page, setPage] = useState(1)
    const [limit] = useState(100)

    // UI state
    const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(new Set())
    const [viewMode, setViewMode] = useState<"grouped" | "table">("grouped")
    const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
    const [marginEditSupplier, setMarginEditSupplier] = useState<string | null>(null)
    const [marginValue, setMarginValue] = useState<string>("")
    const [applyingMargin, setApplyingMargin] = useState(false)

    const loadData = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                provider: selectedSupplier,
                category: selectedCategory,
                search: searchQuery,
                page: page.toString(),
                limit: limit.toString(),
            })
            const res = await fetch(`/api/admin/price-list?${params}`)
            if (!res.ok) throw new Error("API error")
            const data = await res.json()
            setProducts(data.products || [])
            setSuppliers(data.providerStats || [])
            setCategories(data.categories || [])
            setTotal(data.total || 0)
            
            if (expandedSuppliers.size === 0 && data.providerStats?.length > 0) {
                setExpandedSuppliers(new Set([data.providerStats[0].name]))
            }
        } catch (e) {
            console.error("PriceListManager load error:", e)
        } finally {
            setLoading(false)
        }
    }, [selectedSupplier, selectedCategory, searchQuery, page, limit])

    useEffect(() => { loadData() }, [loadData])

    const handlePriceUpdate = async (productId: string, field: "price" | "compareAtPrice", value: number) => {
        setSavingIds(prev => new Set(prev).add(productId))
        try {
            const res = await fetch("/api/admin/price-list", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: productId, [field]: value })
            })
            if (!res.ok) throw new Error("Update failed")
            setProducts(prev => prev.map(p =>
                p.id === productId ? { ...p, [field]: value } : p
            ))
            setSavedIds(prev => { const n = new Set(prev); n.add(productId); return n })
            setTimeout(() => setSavedIds(prev => { const n = new Set(prev); n.delete(productId); return n }), 2000)
        } catch (e) {
            console.error("Price update error:", e)
        } finally {
            setSavingIds(prev => { const n = new Set(prev); n.delete(productId); return n })
        }
    }

    const handleApplyMargin = async (supplier: string) => {
        const margin = parseFloat(marginValue)
        if (isNaN(margin)) return
        setApplyingMargin(true)
        try {
            const res = await fetch("/api/admin/price-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "apply_margin", provider: supplier, marginPercent: margin })
            })
            if (!res.ok) throw new Error("Margin apply failed")
            const data = await res.json()
            alert(`✅ Margen de ${margin}% aplicado a ${data.updated} productos de ${supplier}`)
            setMarginEditSupplier(null)
            setMarginValue("")
            loadData()
        } catch (e) {
            alert("Error al aplicar margen")
        } finally {
            setApplyingMargin(false)
        }
    }

    const toggleSupplier = (name: string) => {
        setExpandedSuppliers(prev => {
            const n = new Set(prev)
            if (n.has(name)) n.delete(name)
            else n.add(name)
            return n
        })
    }

    const totalPages = Math.ceil(total / limit)

    // Group products by supplier
    const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
        const key = p.provider || "Sin Proveedor"
        if (!acc[key]) acc[key] = []
        acc[key].push(p)
        return acc
    }, {})

    return (
        <div className="space-y-10 text-slate-800">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <div className="flex items-center gap-3 text-blue-600 mb-2 font-bold">
                        <BarChart2 size={16} className="animate-pulse stroke-[2.5px]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">CONTROL PANEL PROTOCOL v6.5 // FINANCE</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
                        GESTIÓN DE PRECIOS Y MÁRGENES
                    </h1>
                    <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mt-3 italic font-bold flex items-center gap-2">
                        <Package size={12} />
                        {total} Artículos en cuadrícula · <Store size={12} className="ml-2" /> {suppliers.length} Proveedores Sincronizados
                    </p>
                </div>

                {/* View Toggles & Update */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-none skew-x-[-12deg] shadow-inner">
                        <button
                            onClick={() => setViewMode("grouped")}
                            className={`skew-x-[12deg] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === "grouped"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Grid size={13} className="stroke-[2.5px]" />
                                Proveedores
                            </span>
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`skew-x-[12deg] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === "table"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <ListIcon size={13} className="stroke-[2.5px]" />
                                Listado Plano
                            </span>
                        </button>
                    </div>

                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm disabled:opacity-50 flex items-center gap-2.5 skew-x-[-12deg] group"
                    >
                        <RefreshCw size={13} className={`skew-x-[12deg] stroke-[2.5px] ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} />
                        <span className="skew-x-[12deg]">Actualizar</span>
                    </button>
                </div>
            </div>

            {/* Supplier Stats Cards (Light theme widgets) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {suppliers.slice(0, 4).map((s, i) => {
                    const styles = getSupplierStyles(s.name)
                    const isSelected = selectedSupplier === s.name
                    return (
                        <motion.div
                            key={s.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => {
                                setSelectedSupplier(isSelected ? "" : s.name)
                                setPage(1)
                            }}
                            className={`cursor-pointer relative overflow-hidden bg-white border p-5 group transition-all duration-300 ${
                                isSelected
                                    ? "border-blue-500 shadow-md bg-slate-50/20"
                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                            }`}
                        >
                            {/* Accent indicator line */}
                            <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: styles.primary }} />
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 italic">
                                        ORIGEN_0{i+1}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${styles.text} flex items-center gap-1.5`}>
                                        <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: styles.primary }} />
                                        ACTIVO
                                    </span>
                                </div>
                                
                                <h3 className="text-sm font-black uppercase tracking-wide truncate pr-4 text-slate-800 italic group-hover:text-blue-600 transition-colors">
                                    {s.name}
                                </h3>
                                
                                <div className="mt-3 flex items-end justify-between">
                                    <div>
                                        <span className="text-2xl font-black tracking-tighter italic text-slate-900">
                                            {s.count}
                                        </span>
                                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black italic ml-1.5">UDS</span>
                                    </div>
                                    {s.avgPrice && (
                                        <div className="text-right border-l border-slate-100 pl-3">
                                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block leading-none mb-1">PVP PROM</span>
                                            <span className="text-xs font-black tracking-widest text-slate-700 block leading-none">
                                                ${s.avgPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 p-5 flex flex-col md:flex-row gap-4 items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-blue-600"></div>
                
                {/* Search */}
                <div className="relative w-full flex-1 group">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="BUSCAR ARTÍCULO POR NOMBRE O SKU..."
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
                        className="w-full bg-slate-50 border border-slate-200 pl-14 pr-5 py-4 text-xs font-black uppercase tracking-widest text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all italic placeholder:text-slate-300"
                    />
                </div>

                {/* Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={selectedSupplier}
                            onChange={e => { setSelectedSupplier(e.target.value); setPage(1) }}
                            className="w-full sm:w-52 bg-slate-50 border border-slate-200 px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer italic appearance-none pr-10"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\' stroke-width=\'2.5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem center', backgroundSize: '0.8em' }}
                        >
                            <option value="">TODOS LOS PROVEEDORES</option>
                            {suppliers.map(s => (
                                <option key={s.name} value={s.name}>{s.name.toUpperCase()} ({s.count})</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={e => { setSelectedCategory(e.target.value); setPage(1) }}
                            className="w-full sm:w-52 bg-slate-50 border border-slate-200 px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer italic appearance-none pr-10"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\' stroke-width=\'2.5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem center', backgroundSize: '0.8em' }}
                        >
                            <option value="">TODAS LAS CATEGORÍAS</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid Content / Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 border border-slate-200 bg-slate-50/20 rounded gap-4">
                    <RefreshCw size={40} className="animate-spin text-blue-600 stroke-[2.5px]" />
                    <p className="text-xs uppercase tracking-[0.4em] font-black text-slate-400 italic">Sincronizando registros...</p>
                </div>
            ) : viewMode === "grouped" ? (
                /* GROUPED ACCORDION VIEW */
                <div className="space-y-6">
                    {Object.entries(grouped).length === 0 ? (
                        <div className="text-center py-32 border border-slate-200 bg-slate-50/20 rounded">
                            <Package size={56} className="mx-auto mb-4 opacity-10 stroke-[1.5px]" />
                            <p className="text-xs uppercase tracking-[0.4em] font-black text-slate-400 italic">No se encontraron artículos</p>
                        </div>
                    ) : Object.entries(grouped).map(([supplierName, prods]) => {
                        const styles = getSupplierStyles(supplierName)
                        const isExpanded = expandedSuppliers.has(supplierName)
                        const stat = suppliers.find(s => s.name === supplierName)
                        
                        const avgMargin = prods
                            .map(p => calcMargin(p.compareAtPrice, p.price))
                            .filter((m): m is number => m !== null)
                        const avgM = avgMargin.length > 0
                            ? avgMargin.reduce((a, b) => a + b, 0) / avgMargin.length
                            : null

                        return (
                            <motion.div
                                key={supplierName}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-slate-200 bg-white overflow-hidden relative"
                            >
                                {/* Signature indicator bar */}
                                <div className="absolute top-0 left-0 w-full h-[2.5px]" style={{ backgroundColor: styles.primary }} />

                                {/* Supplier Header */}
                                <div
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 cursor-pointer hover:bg-slate-50/40 transition-all gap-4"
                                    onClick={() => toggleSupplier(supplierName)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 rounded-none flex-shrink-0" style={{ backgroundColor: styles.primary }} />
                                        <div>
                                            <h3 className="text-base font-black text-slate-800 uppercase tracking-wider italic leading-none">{supplierName}</h3>
                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{prods.length} artículos</span>
                                                {avgM !== null && (
                                                    <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: styles.primary }}>
                                                        <TrendingUp size={11} className="stroke-[2.5px]" />
                                                        Margen prom: {avgM.toFixed(1)}%
                                                    </span>
                                                )}
                                                {stat?.avgPrice && (
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                                                        PVP PROM: ${stat.avgPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-slate-100 sm:border-none pt-3 sm:pt-0">
                                        {isAdmin && (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    setMarginEditSupplier(marginEditSupplier === supplierName ? null : supplierName)
                                                    setMarginValue("")
                                                }}
                                                className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-750 hover:text-white bg-white border border-slate-200 hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 italic rounded skew-x-[-8deg] group/btn shadow-sm"
                                            >
                                                <Percent size={12} className="stroke-[2.5px] text-blue-500 group-hover/btn:text-white" />
                                                <span className="skew-x-[8deg]">Aplicar Margen</span>
                                            </button>
                                        )}
                                        <div className="p-1.5 bg-slate-50 border border-slate-200 rounded">
                                            <ChevronDown
                                                size={15}
                                                className={`text-slate-400 transition-transform duration-500 stroke-[3px] ${isExpanded ? "rotate-180 text-slate-700" : ""}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Margin Apply Panel */}
                                <AnimatePresence>
                                    {isAdmin && marginEditSupplier === supplierName && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-slate-200 bg-blue-50/10"
                                        >
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 px-6 py-4 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 text-blue-600 border border-blue-200 rounded">
                                                        <Info size={15} className="stroke-[2.5px]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">Consola de Margen Inteligente</p>
                                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Recalcula dinámicamente PVP de todos los productos partiendo del costo.</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:ml-auto">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={marginValue}
                                                            onChange={e => setMarginValue(e.target.value)}
                                                            placeholder="EJ: 25"
                                                            className="w-28 bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-black tracking-widest text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all italic rounded"
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black">%</span>
                                                    </div>

                                                    <button
                                                        onClick={() => handleApplyMargin(supplierName)}
                                                        disabled={applyingMargin || !marginValue}
                                                        className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-40 shadow skew-x-[-12deg]"
                                                    >
                                                        <span className="skew-x-[12deg] flex items-center gap-1.5">
                                                            <Check size={11} className="stroke-[3px]" />
                                                            {applyingMargin ? "APLICANDO..." : "APLICAR"}
                                                        </span>
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => setMarginEditSupplier(null)}
                                                        className="p-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-500 transition-all rounded"
                                                    >
                                                        <X size={14} className="stroke-[2.5px]" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Products Table */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-slate-200"
                                        >
                                            <div className="overflow-x-auto custom-scrollbar">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200/80 bg-slate-50/80 italic">
                                                            <th className="px-5 py-4.5">Identificador de Artículo</th>
                                                            <th className="px-5 py-4.5 w-32">SKU</th>
                                                            <th className="px-5 py-4.5 w-36">Segmento</th>
                                                            <th className="px-5 py-4.5 w-28">Inventario</th>
                                                            {isAdmin && <th className="px-5 py-4.5 w-44">Costo Suministro</th>}
                                                            <th className="px-5 py-4.5 w-44">Precio PVP (Venta)</th>
                                                            <th className="px-5 py-4.5 w-32">Margen (ROI)</th>
                                                            <th className="px-5 py-4.5 w-20 text-center">Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 bg-white">
                                                        {prods.map((p) => {
                                                            const margin = calcMargin(p.compareAtPrice, p.price)
                                                            const isSaving = savingIds.has(p.id)
                                                            const isSaved = savedIds.has(p.id)
                                                            const img = safeParseImages(p.images)

                                                            return (
                                                                <tr
                                                                    key={p.id}
                                                                    className={`hover:bg-slate-50/40 transition-colors duration-300 group/row ${
                                                                        isSaving ? "opacity-50" : ""
                                                                    } ${isSaved ? "bg-emerald-500/5" : ""}`}
                                                                >
                                                                    <td className="px-5 py-3.5">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center relative group-hover/row:border-blue-500/40 transition-all shadow-sm">
                                                                                {img ? (
                                                                                    <img src={img} alt="" className="w-full h-full object-cover group-hover/row:scale-110 transition-transform duration-700" />
                                                                                ) : (
                                                                                    <Package size={16} className="text-slate-400" />
                                                                                )}
                                                                            </div>
                                                                            <span className="text-slate-700 font-bold text-xs line-clamp-2 max-w-[280px] group-hover/row:text-slate-900 transition-colors uppercase tracking-tight">{p.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className="text-slate-500 font-mono text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2 py-1 border border-slate-200 rounded shadow-sm">{p.sku || "N/A"}</span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">{p.category?.name || "SIN CAT"}</span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <span className={`text-xs font-black tracking-widest ${
                                                                                p.stock > 10 ? "text-emerald-600" :
                                                                                p.stock > 0 ? "text-amber-600" :
                                                                                "text-rose-600"
                                                                            }`}>
                                                                                {p.stock > 0 ? `${p.stock} UDS` : "AGOTADO"}
                                                                            </span>
                                                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">STOCK_LIVE</span>
                                                                        </div>
                                                                    </td>
                                                                    {isAdmin && (
                                                                        <td className="px-5 py-3.5">
                                                                            <InlineEdit
                                                                                value={p.compareAtPrice || 0}
                                                                                onSave={val => handlePriceUpdate(p.id, "compareAtPrice", val)}
                                                                            />
                                                                        </td>
                                                                    )}
                                                                    <td className="px-5 py-3.5">
                                                                        <InlineEdit
                                                                            value={p.price}
                                                                            onSave={val => handlePriceUpdate(p.id, "price", val)}
                                                                        />
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <MarginBadge margin={margin} />
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-center">
                                                                        <div className="flex items-center justify-center">
                                                                            <div 
                                                                                className={`w-2 h-2 rounded-none skew-x-[-12deg] ${
                                                                                    p.isActive 
                                                                                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                                                                                        : "bg-slate-300"
                                                                                }`} 
                                                                                title={p.isActive ? "Visible" : "Oculto"} 
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            ) : (
                /* FLAT LIST TABLE VIEW */
                <div className="border border-slate-200 bg-white overflow-hidden relative shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200/80 bg-slate-50/80 italic">
                                    <th className="px-5 py-5">Identificador de Artículo</th>
                                    <th className="px-5 py-5 w-44">Origen</th>
                                    <th className="px-5 py-5 w-32">SKU</th>
                                    <th className="px-5 py-5 w-36">Segmento</th>
                                    <th className="px-5 py-5 w-24">Inventario</th>
                                    {isAdmin && <th className="px-5 py-5 w-40">Costo</th>}
                                    <th className="px-5 py-5 w-40">PVP (P. Venta)</th>
                                    <th className="px-5 py-5 w-32">Margen (ROI)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {products.map((p) => {
                                    const margin = calcMargin(p.compareAtPrice, p.price)
                                    const isSaving = savingIds.has(p.id)
                                    const isSaved = savedIds.has(p.id)
                                    const img = safeParseImages(p.images)
                                    const styles = getSupplierStyles(p.provider || "Sin Proveedor")

                                    return (
                                        <tr
                                            key={p.id}
                                            className={`hover:bg-slate-50/40 transition-colors duration-300 group/flatrow ${isSaving ? "opacity-50" : ""} ${isSaved ? "bg-emerald-500/5" : ""}`}
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center relative group-hover/flatrow:border-blue-500/40 transition-all shadow-sm">
                                                        {img ? <img src={img} alt="" className="w-full h-full object-cover group-hover/flatrow:scale-110 transition-transform duration-700" /> : <Package size={16} className="text-slate-400" />}
                                                    </div>
                                                    <span className="text-slate-750 text-xs font-bold line-clamp-1 max-w-[280px] group-hover/flatrow:text-slate-900 transition-colors uppercase tracking-tight">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span 
                                                    className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border rounded-none italic skew-x-[-12deg]"
                                                    style={{ 
                                                        color: styles.primary, 
                                                        borderColor: `${styles.primary}20`, 
                                                        backgroundColor: `${styles.primary}04` 
                                                    }}
                                                >
                                                    <span className="skew-x-[12deg] inline-block">{p.provider || "Sin Proveedor"}</span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-slate-500 font-mono text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2 py-1 border border-slate-200 rounded shadow-sm">{p.sku || "N/A"}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">{p.category?.name || "SIN CAT"}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-black tracking-widest ${p.stock > 10 ? "text-emerald-600" : p.stock > 0 ? "text-amber-600" : "text-rose-600"}`}>
                                                    {p.stock > 0 ? `${p.stock} UDS` : "0 UDS"}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-5 py-3.5">
                                                    <InlineEdit
                                                        value={p.compareAtPrice || 0}
                                                        onSave={val => handlePriceUpdate(p.id, "compareAtPrice", val)}
                                                    />
                                                </td>
                                            )}
                                            <td className="px-5 py-3.5">
                                                <InlineEdit
                                                    value={p.price}
                                                    onSave={val => handlePriceUpdate(p.id, "price", val)}
                                                />
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <MarginBadge margin={margin} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 bg-slate-50/50 p-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                        PÁGINA {page} DE {totalPages} · {total} ARTÍCULOS TOTALES EN PROTOCOLO
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 skew-x-[-12deg]"
                        >
                            <span className="skew-x-[12deg] block">ANTERIOR</span>
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 skew-x-[-12deg]"
                        >
                            <span className="skew-x-[12deg] block">SIGUIENTE</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
