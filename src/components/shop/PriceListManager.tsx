"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Store, Package, TrendingUp, DollarSign, Edit3,
    Check, X, ChevronRight, ChevronDown, RefreshCw, Percent,
    Filter, BarChart2, Tag, Save, AlertCircle, Eye, EyeOff,
    ArrowUpDown, Grid, List as ListIcon, Plus, Download, ChevronUp,
    ShieldAlert, Info, Square, CheckSquare
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
    description: string | null
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

function safeParseImagesArray(images: string | null): string[] {
    if (!images) return []
    try {
        const parsed = JSON.parse(images)
        if (Array.isArray(parsed)) return parsed.filter(Boolean)
        return [images]
    } catch {
        if (images.startsWith('http') || images.includes('/')) return [images]
        return []
    }
}

function calcMargin(cost: number | null, price: number): number | null {
    if (cost === null || cost <= 0) return null
    return ((price - cost) / cost) * 100
}

function InlineEdit({ value, onSave, prefix = "$", min = 0, decimals = 2, step = "0.01" }: {
    value: number
    onSave: (val: number) => void
    prefix?: string | null
    min?: number
    decimals?: number
    step?: string
}) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(decimals === 0 ? value.toString() : value.toFixed(decimals))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) inputRef.current?.select()
    }, [editing])

    const commit = () => {
        const num = decimals === 0 ? parseInt(draft) : parseFloat(draft)
        if (!isNaN(num) && num >= min) {
            onSave(num)
        } else {
            setDraft(decimals === 0 ? value.toString() : value.toFixed(decimals))
        }
        setEditing(false)
    }

    if (!editing) return (
        <button
            onClick={() => { setDraft(decimals === 0 ? value.toString() : value.toFixed(decimals)); setEditing(true) }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-800 font-semibold transition-all duration-300 group rounded-lg"
        >
            {prefix && <span className="text-slate-400 font-medium text-xs">{prefix}</span>}
            <span className="text-xs md:text-sm font-semibold tracking-tight">
                {decimals === 0 ? value.toString() : value.toFixed(decimals)}
                {decimals === 0 && <span className="text-[10px] text-slate-400 font-normal ml-0.5"> uds</span>}
            </span>
            <Edit3 size={11} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
        </button>
    )

    return (
        <div className="flex items-center gap-1 bg-white border border-slate-900 p-1 shadow-sm rounded-lg animate-in zoom-in-95 duration-150">
            {prefix && <span className="text-slate-800 font-semibold text-xs px-1">{prefix}</span>}
            <input
                ref={inputRef}
                type="number"
                step={step}
                min={min}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter") commit()
                    if (e.key === "Escape") { setDraft(decimals === 0 ? value.toString() : value.toFixed(decimals)); setEditing(false) }
                }}
                onBlur={commit}
                className="w-20 bg-slate-50 border-none text-slate-800 text-xs font-semibold tracking-tight outline-none focus:ring-0 px-1 py-0.5 rounded"
                autoFocus
            />
            <button onClick={commit} className="p-1 text-slate-800 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Check size={12} /></button>
            <button onClick={() => { setDraft(decimals === 0 ? value.toString() : value.toFixed(decimals)); setEditing(false) }} className="p-1 text-red-500 hover:text-red-650 hover:bg-red-50 rounded transition-colors"><X size={12} /></button>
        </div>
    )
}

function MarginBadge({ margin }: { margin: number | null }) {
    if (margin === null) return <span className="text-slate-400 text-xs italic">Sin costo</span>
    
    let color = "text-emerald-600 border-emerald-100 bg-emerald-50/60";
    let text = "Excelente";
    if (margin < 0) {
        color = "text-rose-600 border-rose-100 bg-rose-50/60";
        text = "Pérdida";
    } else if (margin < 10) {
        color = "text-orange-600 border-orange-100 bg-orange-50/60";
        text = "Crítico";
    } else if (margin < 20) {
        color = "text-yellow-700 border-yellow-200 bg-yellow-50/60";
        text = "Regular";
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)] ${color}`}>
            <TrendingUp size={12} />
            <span>{margin.toFixed(1)}%</span>
            <span className="text-[10px] opacity-75 font-normal">({text})</span>
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
    const [viewMode, setViewMode] = useState<"grouped" | "table">("table")
    const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
    const [marginEditSupplier, setMarginEditSupplier] = useState<string | null>(null)
    const [marginValue, setMarginValue] = useState<string>("")
    const [applyingMargin, setApplyingMargin] = useState(false)

    // Selection & Bulk Updates
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [bulkMarginValue, setBulkMarginValue] = useState<string>("")
    const [bulkStockValue, setBulkStockValue] = useState<string>("")
    const [updatingBulk, setUpdatingBulk] = useState(false)

    // Preview modals state
    const [previewImages, setPreviewImages] = useState<{ urls: string[]; title: string } | null>(null)
    const [previewDescription, setPreviewDescription] = useState<{ title: string; description: string; sku: string } | null>(null)

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
        } catch (e) {
            console.error("PriceListManager load error:", e)
        } finally {
            setLoading(false)
        }
    }, [selectedSupplier, selectedCategory, searchQuery, page, limit])

    useEffect(() => { loadData() }, [loadData])

    const handlePriceUpdate = async (productId: string, field: "price" | "compareAtPrice" | "stock", value: number) => {
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

    const handleBulkPriceUpdate = async (updateFields: { price?: number; compareAtPrice?: number; stock?: number; isActive?: boolean }) => {
        if (selectedProducts.length === 0) return
        setUpdatingBulk(true)
        try {
            const res = await fetch("/api/admin/price-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "bulk_price_update",
                    ids: selectedProducts,
                    ...updateFields
                })
            })
            if (!res.ok) throw new Error("Bulk update failed")
            alert(`✅ ${selectedProducts.length} productos actualizados correctamente`)
            setSelectedProducts([])
            setBulkStockValue("")
            loadData()
        } catch (e) {
            alert("Error al actualizar productos en lote")
        } finally {
            setUpdatingBulk(false)
        }
    }

    const handleBulkMarginApply = async () => {
        const margin = parseFloat(bulkMarginValue)
        if (isNaN(margin) || selectedProducts.length === 0) return
        setUpdatingBulk(true)
        try {
            const res = await fetch("/api/admin/price-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "bulk_apply_margin",
                    ids: selectedProducts,
                    marginPercent: margin
                })
            })
            if (!res.ok) throw new Error("Bulk margin failed")
            const data = await res.json()
            alert(`✅ Margen de ${margin}% aplicado a ${data.updated} productos seleccionados`)
            setSelectedProducts([])
            setBulkMarginValue("")
            loadData()
        } catch (e) {
            alert("Error al aplicar margen en lote")
        } finally {
            setUpdatingBulk(false)
        }
    }

    const toggleProductSelection = (id: string) => {
        setSelectedProducts(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const toggleAllProducts = (productList: Product[]) => {
        const ids = productList.map(p => p.id)
        const allSelected = ids.every(id => selectedProducts.includes(id))
        if (allSelected) {
            setSelectedProducts(prev => prev.filter(id => !ids.includes(id)))
        } else {
            setSelectedProducts(prev => Array.from(new Set([...prev, ...ids])))
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
        <div className="space-y-8 text-slate-800">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200/80 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2 font-semibold">
                        <BarChart2 size={15} className="animate-pulse stroke-[2px]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">PANEL DE CONTROL // FINANZAS</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Gestión de Precios y Márgenes
                    </h1>
                    <p className="text-slate-500 text-xs mt-3 font-medium flex items-center gap-2">
                        <Package size={14} className="text-slate-400" />
                        <span>{total} artículos en catálogo</span>
                        <span className="text-slate-300">•</span>
                        <Store size={14} className="text-slate-400" />
                        <span>{suppliers.length} proveedores conectados</span>
                    </p>
                </div>

                {/* View Toggles & Update */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-slate-100 border border-slate-200/60 p-1 rounded-xl shadow-inner">
                        <button
                            onClick={() => setViewMode("grouped")}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                viewMode === "grouped"
                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <Grid size={14} />
                                Proveedores
                            </span>
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                viewMode === "table"
                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <ListIcon size={14} />
                                Listado Plano
                            </span>
                        </button>
                    </div>

                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm disabled:opacity-50 flex items-center gap-2 group"
                    >
                        <RefreshCw size={14} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} />
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            {/* Supplier Stats Cards (Light theme widgets) */}
            <div className="flex overflow-x-auto gap-5 pb-4 snap-x custom-scrollbar w-full">
                {suppliers.map((s, i) => {
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
                            className={`flex-none w-[280px] sm:w-[320px] snap-center cursor-pointer relative overflow-hidden bg-white border p-5 rounded-2xl group transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 ${
                                isSelected
                                    ? "border-blue-500 ring-2 ring-blue-500/10 bg-slate-50/10"
                                    : "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/30"
                            }`}
                        >
                            {/* Accent indicator line */}
                            <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: styles.primary }} />
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 border border-slate-200/60 text-slate-500 rounded">
                                        ORIGEN 0{i+1}
                                    </span>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${styles.text} flex items-center gap-1.5`}>
                                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: styles.primary }} />
                                        ACTIVO
                                    </span>
                                </div>
                                
                                <h3 className="text-sm font-bold truncate pr-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                                    {s.name}
                                </h3>
                                
                                <div className="mt-4 flex items-end justify-between">
                                    <div>
                                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                                            {s.count}
                                        </span>
                                        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold ml-1">unidades</span>
                                    </div>
                                    {s.avgPrice && (
                                        <div className="text-right border-l border-slate-100 pl-3">
                                            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block leading-none mb-1">PVP PROM</span>
                                            <span className="text-xs font-semibold tracking-tight text-slate-700 block leading-none">
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
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-[4px] h-full bg-blue-500"></div>
                
                {/* Search */}
                <div className="relative w-full flex-1 group">
                    <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar artículo por nombre o SKU..."
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={selectedSupplier}
                            onChange={e => { setSelectedSupplier(e.target.value); setPage(1) }}
                            className="w-full sm:w-52 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none pr-10"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\' stroke-width=\'2.5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.8em' }}
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
                            className="w-full sm:w-52 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none pr-10"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\' stroke-width=\'2.5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.8em' }}
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
                <div className="flex flex-col items-center justify-center py-24 border border-slate-200/60 bg-slate-50/50 rounded-2xl gap-4">
                    <RefreshCw size={32} className="animate-spin text-blue-600 stroke-[2px]" />
                    <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Sincronizando registros...</p>
                </div>
            ) : viewMode === "grouped" ? (
                /* GROUPED ACCORDION VIEW */
                <div className="space-y-4">
                    {Object.entries(grouped).length === 0 ? (
                        <div className="text-center py-24 border border-slate-200/60 bg-slate-50/50 rounded-2xl">
                            <Package size={48} className="mx-auto mb-3 opacity-20 stroke-[1.5px] text-slate-400" />
                            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">No se encontraron artículos</p>
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
                                className="border border-slate-200/60 bg-white overflow-hidden relative rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300"
                            >
                                {/* Signature indicator bar */}
                                <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: styles.primary }} />

                                {/* Supplier Header */}
                                <div
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 cursor-pointer hover:bg-slate-50/30 transition-all gap-4"
                                    onClick={() => toggleSupplier(supplierName)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: styles.primary }} />
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{supplierName}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                                                <span className="text-xs text-slate-400 font-medium">{prods.length} artículos</span>
                                                <span className="text-slate-200 text-xs">•</span>
                                                {avgM !== null && (
                                                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: styles.primary }}>
                                                        <TrendingUp size={12} />
                                                        Margen prom: {avgM.toFixed(1)}%
                                                    </span>
                                                )}
                                                {stat?.avgPrice && (
                                                    <>
                                                        <span className="text-slate-200 text-xs">•</span>
                                                        <span className="text-xs text-slate-500 font-medium">
                                                            PVP promedio: ${stat.avgPrice.toFixed(2)}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t border-slate-100 sm:border-none pt-3 sm:pt-0">
                                        {isAdmin && (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    setMarginEditSupplier(marginEditSupplier === supplierName ? null : supplierName)
                                                    setMarginValue("")
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-white bg-white border border-slate-200 hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 rounded-lg group/btn shadow-sm"
                                            >
                                                <Percent size={12} className="text-blue-500 group-hover/btn:text-white" />
                                                <span>Aplicar Margen</span>
                                            </button>
                                        )}
                                        <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                            <ChevronDown
                                                size={15}
                                                className={`text-slate-400 transition-transform duration-500 stroke-[2.5px] ${isExpanded ? "rotate-180 text-slate-700" : ""}`}
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
                                            className="overflow-hidden border-t border-slate-100 bg-blue-50/10"
                                        >
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 px-6 py-4 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 text-blue-600 border border-blue-200 rounded-lg">
                                                        <Info size={15} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800">Consola de Margen Inteligente</p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">Recalcula dinámicamente PVP de todos los productos partiendo del costo.</p>
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
                                                            className="w-28 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all rounded-lg"
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                                                    </div>

                                                    <button
                                                        onClick={() => handleApplyMargin(supplierName)}
                                                        disabled={applyingMargin || !marginValue}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all duration-300 disabled:opacity-40 shadow rounded-lg"
                                                    >
                                                        <span className="flex items-center gap-1.5">
                                                            <Check size={14} />
                                                            {applyingMargin ? "Aplicando..." : "Aplicar"}
                                                        </span>
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => setMarginEditSupplier(null)}
                                                        className="p-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-500 transition-all rounded-lg"
                                                    >
                                                        <X size={14} />
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
                                            className="overflow-hidden border-t border-slate-200 bg-slate-50/10"
                                        >
                                            <div className="overflow-x-auto custom-scrollbar p-3">
                                                <table className="w-full text-left border-collapse border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-white">
                                                    <thead>
                                                        <tr className="text-sm font-extrabold text-slate-700 border-b border-slate-300 bg-slate-100 uppercase">
                                                            <th className="px-4 py-4 w-12 text-center">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); toggleAllProducts(prods) }}
                                                                    className="text-slate-500 hover:text-slate-900 transition-colors"
                                                                >
                                                                    {prods.every(p => selectedProducts.includes(p.id)) ? (
                                                                        <CheckSquare size={20} className="text-slate-900" />
                                                                    ) : (
                                                                        <Square size={20} />
                                                                    )}
                                                                </button>
                                                            </th>
                                                            <th className="px-4 py-4">Producto</th>
                                                            <th className="px-4 py-4 w-32">Cód. / SKU</th>
                                                            <th className="px-4 py-4 w-36">Categoría</th>
                                                            <th className="px-4 py-4 w-28">Stock</th>
                                                            {isAdmin && <th className="px-4 py-4 w-40">Costo Base</th>}
                                                            <th className="px-4 py-4 w-40">P.V.P</th>
                                                            <th className="px-4 py-4 w-32">Margen (ROI)</th>
                                                            <th className="px-4 py-4 w-20 text-center">Visible</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 bg-white">
                                                        {prods.map((p) => {
                                                            const margin = calcMargin(p.compareAtPrice, p.price)
                                                            const isSaving = savingIds.has(p.id)
                                                            const isSaved = savedIds.has(p.id)
                                                            const img = safeParseImages(p.images)
                                                            const isSelected = selectedProducts.includes(p.id)
 
                                                            return (
                                                                <tr
                                                                    key={p.id}
                                                                    className={`hover:bg-slate-50/30 transition-colors duration-300 group/row ${
                                                                        isSaving ? "opacity-50" : ""
                                                                    } ${isSaved ? "bg-emerald-500/5" : ""} ${isSelected ? "bg-slate-50/80" : ""}`}
                                                                >
                                                                    <td className="px-4 py-3.5 text-center w-12">
                                                                        <button
                                                                            onClick={() => toggleProductSelection(p.id)}
                                                                            className="text-slate-350 hover:text-slate-900 transition-colors"
                                                                        >
                                                                            {isSelected ? (
                                                                                <CheckSquare size={16} className="text-slate-900" />
                                                                            ) : (
                                                                                <Square size={16} />
                                                                            )}
                                                                        </button>
                                                                    </td>
                                                                    <td className="px-4 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div 
                                                                                onClick={() => {
                                                                                    if (img) {
                                                                                        const urls = p.images ? safeParseImagesArray(p.images) : [img];
                                                                                        setPreviewImages({ urls: urls.length > 0 ? urls : [img], title: p.name });
                                                                                    }
                                                                                }}
                                                                                className={`w-12 h-12 bg-slate-50 border border-slate-300 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-sm ${img ? 'cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 transition-all' : ''}`}>
                                                                                {img ? (
                                                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <Package size={20} className="text-slate-400" />
                                                                                )}
                                                                            </div>
                                                                            <span 
                                                                                onClick={() => setPreviewDescription({ title: p.name, description: p.description || 'Sin descripción detallada.', sku: p.sku || 'N/A' })}
                                                                                className="text-slate-800 font-bold text-base line-clamp-2 cursor-pointer hover:text-blue-600 hover:underline decoration-blue-500/30 underline-offset-4 transition-all">
                                                                                {p.name}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-4">
                                                                        <span className="text-slate-600 font-mono text-sm font-bold bg-slate-100 px-3 py-1.5 border border-slate-300 rounded-lg">{p.sku || "N/A"}</span>
                                                                    </td>
                                                                    <td className="px-4 py-4">
                                                                        <span className="text-slate-500 text-sm font-semibold">{p.category?.name || "Sin Categoría"}</span>
                                                                    </td>
                                                                    <td className="px-4 py-4">
                                                                        <InlineEdit
                                                                            value={p.stock}
                                                                            decimals={0}
                                                                            step="1"
                                                                            prefix={null}
                                                                            onSave={val => handlePriceUpdate(p.id, "stock", val)}
                                                                        />
                                                                    </td>
                                                                    {isAdmin && (
                                                                        <td className="px-4 py-3.5">
                                                                            <InlineEdit
                                                                                value={p.compareAtPrice || 0}
                                                                                onSave={val => handlePriceUpdate(p.id, "compareAtPrice", val)}
                                                                            />
                                                                        </td>
                                                                    )}
                                                                    <td className="px-4 py-3.5">
                                                                        <InlineEdit
                                                                            value={p.price}
                                                                            onSave={val => handlePriceUpdate(p.id, "price", val)}
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-3.5">
                                                                        <MarginBadge margin={margin} />
                                                                    </td>
                                                                    <td className="px-4 py-3.5 text-center">
                                                                        <div className="flex items-center justify-center">
                                                                            <div 
                                                                                className={`w-2.5 h-2.5 rounded-full ${
                                                                                    p.isActive 
                                                                                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
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
                <div className="border border-slate-200/60 bg-white overflow-hidden relative shadow-[0_4px_25px_rgba(0,0,0,0.015)] rounded-2xl">
                    <div className="overflow-x-auto custom-scrollbar p-3">
                        <table className="w-full text-left border-collapse border border-slate-200/60 rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                            <thead>
                                <tr className="text-sm font-extrabold text-slate-700 border-b border-slate-300 bg-slate-100 uppercase">
                                    <th className="px-4 py-4 w-12 text-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleAllProducts(products) }}
                                            className="text-slate-500 hover:text-slate-900 transition-colors"
                                        >
                                            {products.every(p => selectedProducts.includes(p.id)) ? (
                                                <CheckSquare size={20} className="text-slate-900" />
                                            ) : (
                                                <Square size={20} />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-4 py-4">Artículo</th>
                                    <th className="px-4 py-4 w-40">Proveedor</th>
                                    <th className="px-4 py-4 w-32">SKU</th>
                                    <th className="px-4 py-4 w-36">Categoría</th>
                                    <th className="px-4 py-4 w-28">Stock</th>
                                    {isAdmin && <th className="px-4 py-4 w-36">Costo Base</th>}
                                    <th className="px-4 py-4 w-36">PVP (P. Venta)</th>
                                    <th className="px-4 py-4 w-32">Margen (ROI)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {products.map((p) => {
                                    const margin = calcMargin(p.compareAtPrice, p.price)
                                    const isSaving = savingIds.has(p.id)
                                    const isSaved = savedIds.has(p.id)
                                    const img = safeParseImages(p.images)
                                    const styles = getSupplierStyles(p.provider || "Sin Proveedor")
                                    const isSelected = selectedProducts.includes(p.id)
 
                                    return (
                                        <tr
                                            key={p.id}
                                            className={`hover:bg-slate-50/30 transition-colors duration-300 group/flatrow ${isSaving ? "opacity-50" : ""} ${isSaved ? "bg-emerald-500/5" : ""} ${isSelected ? "bg-slate-50/80" : ""}`}
                                        >
                                            <td className="px-4 py-4 text-center w-12">
                                                <button
                                                    onClick={() => toggleProductSelection(p.id)}
                                                    className="text-slate-400 hover:text-slate-900 transition-colors"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare size={20} className="text-slate-900" />
                                                    ) : (
                                                        <Square size={20} />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        onClick={() => {
                                                            if (img) {
                                                                const urls = p.images ? safeParseImagesArray(p.images) : [img];
                                                                setPreviewImages({ urls: urls.length > 0 ? urls : [img], title: p.name });
                                                            }
                                                        }}
                                                        className={`w-12 h-12 bg-slate-50 border border-slate-300 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-sm ${img ? 'cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 transition-all' : ''}`}>
                                                        {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <Package size={20} className="text-slate-400" />}
                                                    </div>
                                                    <span 
                                                        onClick={() => setPreviewDescription({ title: p.name, description: p.description || 'Sin descripción detallada.', sku: p.sku || 'N/A' })}
                                                        className="text-slate-800 font-bold text-base line-clamp-1 cursor-pointer hover:text-blue-600 hover:underline decoration-blue-500/30 underline-offset-4 transition-all">
                                                        {p.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span 
                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-full border uppercase"
                                                    style={{ 
                                                        color: styles.primary, 
                                                        borderColor: `${styles.primary}20`, 
                                                        backgroundColor: `${styles.primary}05` 
                                                    }}
                                                >
                                                    {p.provider || "Sin Proveedor"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-slate-600 font-mono text-sm font-bold bg-slate-100 px-3 py-1.5 border border-slate-300 rounded-lg">{p.sku || "N/A"}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-slate-500 text-sm font-semibold">{p.category?.name || "Sin Categoría"}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <InlineEdit
                                                    value={p.stock}
                                                    decimals={0}
                                                    step="1"
                                                    prefix={null}
                                                    onSave={val => handlePriceUpdate(p.id, "stock", val)}
                                                />
                                            </td>
                                            {isAdmin && (
                                                <td className="px-4 py-3.5">
                                                    <InlineEdit
                                                        value={p.compareAtPrice || 0}
                                                        onSave={val => handlePriceUpdate(p.id, "compareAtPrice", val)}
                                                    />
                                                </td>
                                            )}
                                            <td className="px-4 py-3.5">
                                                <InlineEdit
                                                    value={p.price}
                                                    onSave={val => handlePriceUpdate(p.id, "price", val)}
                                                />
                                            </td>
                                            <td className="px-4 py-3.5">
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 bg-slate-50/30 p-5 rounded-2xl shadow-sm">
                    <span className="text-[11px] font-semibold text-slate-500">
                        Página {page} de {totalPages} · {total} artículos totales en catálogo
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-sm"
                        >
                            <span>Anterior</span>
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-sm"
                        >
                            <span>Siguiente</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Elevated Bulk Actions Bar */}
            {selectedProducts.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200/80 text-slate-800 px-6 py-4 flex flex-wrap items-center justify-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[500] animate-in slide-in-from-bottom-6 duration-500 rounded-2xl backdrop-blur-md">
                    <div className="flex items-center space-x-4 border-r border-slate-100 pr-5">
                        <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">{selectedProducts.length}</div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Elegidos</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Bulk Stock Input */}
                        <div className="flex items-center gap-2 border-r border-slate-100 pr-4">
                            <span className="text-xs font-bold text-slate-500">Stock:</span>
                            <input
                                type="number"
                                step="1"
                                min="0"
                                value={bulkStockValue}
                                onChange={e => setBulkStockValue(e.target.value)}
                                placeholder="Ej: 50"
                                className="w-16 bg-slate-50 border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-850 outline-none focus:border-slate-400 focus:bg-white transition-all rounded-lg"
                            />
                            <button
                                onClick={() => handleBulkPriceUpdate({ stock: parseInt(bulkStockValue) })}
                                disabled={updatingBulk || !bulkStockValue}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40"
                            >
                                Aplicar
                            </button>
                        </div>

                        {/* Bulk Margin Input */}
                        <div className="flex items-center gap-2 border-r border-slate-100 pr-4">
                            <span className="text-xs font-bold text-slate-500">Margen:</span>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={bulkMarginValue}
                                    onChange={e => setBulkMarginValue(e.target.value)}
                                    placeholder="Ej: 20"
                                    className="w-16 bg-slate-50 border border-slate-200 pl-2 pr-5 py-1 text-xs font-semibold text-slate-855 outline-none focus:border-slate-400 focus:bg-white transition-all rounded-lg"
                                />
                                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-450 text-[10px] font-bold">%</span>
                            </div>
                            <button
                                onClick={handleBulkMarginApply}
                                disabled={updatingBulk || !bulkMarginValue}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40"
                            >
                                Marginar
                            </button>
                        </div>

                        {/* Visibility Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkPriceUpdate({ isActive: true })}
                                disabled={updatingBulk}
                                className="flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 text-xs font-bold transition-all rounded-lg border border-emerald-100/50 shadow-sm"
                            >
                                <Eye size={12} />
                                <span>Mostrar</span>
                            </button>
                            <button
                                onClick={() => handleBulkPriceUpdate({ isActive: false })}
                                disabled={updatingBulk}
                                className="flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold transition-all rounded-lg border border-slate-200 shadow-sm"
                            >
                                <EyeOff size={12} />
                                <span>Ocultar</span>
                            </button>
                        </div>

                        <button 
                            onClick={() => setSelectedProducts([])}
                            className="p-1.5 hover:bg-slate-150 text-slate-450 hover:text-slate-800 rounded-lg transition-colors active:scale-95 ml-2"
                            title="Limpiar Selección"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImages && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                        onClick={() => setPreviewImages(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800 line-clamp-1 flex-1">{previewImages.title}</h3>
                                <button
                                    onClick={() => setPreviewImages(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors ml-4"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex gap-4 overflow-x-auto snap-x custom-scrollbar">
                                {previewImages.urls.map((url, i) => (
                                    <div key={i} className="min-w-full sm:min-w-[80%] flex-shrink-0 snap-center relative flex items-center justify-center bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                                        <img src={url} alt={`${previewImages.title} ${i + 1}`} className="max-h-[60vh] object-contain" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a 
                                                href={url} 
                                                download 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                                            >
                                                <Download size={20} />
                                                <span className="font-bold text-sm">Descargar Foto</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-slate-50 border-t text-center text-xs font-semibold text-slate-500">
                                {previewImages.urls.length} foto(s) disponibles
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Description Preview Modal */}
            <AnimatePresence>
                {previewDescription && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setPreviewDescription(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b flex justify-between items-start bg-slate-50/50 rounded-t-2xl">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{previewDescription.title}</h3>
                                    <p className="text-xs font-mono text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded inline-block border border-slate-200">SKU: {previewDescription.sku}</p>
                                </div>
                                <button
                                    onClick={() => setPreviewDescription(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors ml-4 bg-white shadow-sm border border-slate-200"
                                >
                                    <X size={18} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                <div className="prose prose-sm prose-slate max-w-none">
                                    <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{previewDescription.description}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 border-t flex justify-end rounded-b-2xl">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${previewDescription.title}\nSKU: ${previewDescription.sku}\n\n${previewDescription.description}`)
                                        alert("Información copiada al portapapeles")
                                    }}
                                    className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-blue-200"
                                >
                                    <Edit3 size={16} /> {/* Copiar icono reutilizado para no añadir import */}
                                    Copiar Descripción
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
