"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Store, Package, TrendingUp, DollarSign, Edit3,
    Check, X, ChevronRight, ChevronDown, RefreshCw, Percent,
    Filter, BarChart2, Tag, Save, AlertCircle, Eye, EyeOff,
    ArrowUpDown, Grid, List as ListIcon, Plus, Download
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

const SUPPLIER_COLORS: Record<string, string> = {
    "Banco del Perno": "#3b82f6",
    "MultiTecnologia V&V": "#10b981",
    "Cronte Technology": "#8b5cf6",
    "GEMA": "#f59e0b",
    "Logicenter": "#ef4444",
    "Unknown": "#64748b",
    "Sin Proveedor": "#64748b",
}

function getSupplierColor(name: string): string {
    return SUPPLIER_COLORS[name] || `hsl(${name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 65%, 55%)`
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
    if (!cost || cost <= 0) return null
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
            className="flex items-center gap-1.5 text-white font-bold hover:text-blue-400 transition-colors group"
        >
            <span className="text-slate-500 text-xs">{prefix}</span>
            <span>{value.toFixed(2)}</span>
            <Edit3 size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
        </button>
    )

    return (
        <div className="flex items-center gap-1">
            <span className="text-slate-500 text-xs">{prefix}</span>
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
                className="w-24 bg-slate-800 border border-blue-500/60 rounded px-2 py-0.5 text-white text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20"
                autoFocus
            />
            <button onClick={commit} className="text-emerald-400 hover:text-emerald-300"><Check size={14} /></button>
            <button onClick={() => { setDraft(value.toFixed(2)); setEditing(false) }} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
    )
}

function MarginBadge({ margin }: { margin: number | null }) {
    if (margin === null) return <span className="text-slate-600 text-xs italic">Sin costo</span>
    const color = margin >= 20 ? "text-emerald-400" : margin >= 10 ? "text-yellow-400" : margin >= 0 ? "text-orange-400" : "text-red-400"
    const bg = margin >= 20 ? "bg-emerald-500/10" : margin >= 10 ? "bg-yellow-500/10" : margin >= 0 ? "bg-orange-500/10" : "bg-red-500/10"
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${color} ${bg}`}>
            <TrendingUp size={10} />
            {margin.toFixed(1)}%
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
            // Auto-expand all suppliers on initial load
            if (expandedSuppliers.size === 0 && data.providerStats?.length > 0) {
                setExpandedSuppliers(new Set(data.providerStats.slice(0, 3).map((s: SupplierStat) => s.name)))
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
            alert(`✅ Margen aplicado a ${data.updated} productos de ${supplier}`)
            setMarginEditSupplier(null)
            setMarginValue("")
            loadData()
        } catch (e) {
            alert("Error al aplicar margen")
        } finally {
            setApplyingMargin(false)
        }
    }

    // Group products by supplier
    const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
        const key = p.provider || "Sin Proveedor"
        if (!acc[key]) acc[key] = []
        acc[key].push(p)
        return acc
    }, {})

    const toggleSupplier = (name: string) => {
        setExpandedSuppliers(prev => {
            const n = new Set(prev)
            if (n.has(name)) n.delete(name)
            else n.add(name)
            return n
        })
    }

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
                        <DollarSign className="text-blue-400" size={28} />
                        GESTIÓN DE LISTA DE PRECIOS
                    </h2>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mt-1 italic">
                        {total} artículos · {suppliers.length} proveedores activos
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => setViewMode(v => v === "grouped" ? "table" : "grouped")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40 transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        {viewMode === "grouped" ? <ListIcon size={14} /> : <Grid size={14} />}
                        {viewMode === "grouped" ? "Vista Tabla" : "Vista Proveedores"}
                    </button>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Supplier Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {suppliers.slice(0, 5).map((s, i) => {
                    const color = getSupplierColor(s.name)
                    return (
                        <motion.button
                            key={s.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => {
                                setSelectedSupplier(selectedSupplier === s.name ? "" : s.name)
                                setPage(1)
                            }}
                            className={`relative overflow-hidden p-4 border transition-all text-left group ${
                                selectedSupplier === s.name
                                    ? "border-blue-500/60 bg-blue-500/10"
                                    : "border-white/5 bg-slate-900/60 hover:border-white/20"
                            }`}
                        >
                            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: color }} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic truncate pl-2">{s.name}</p>
                            <p className="text-2xl font-black text-white mt-1 pl-2">{s.count}</p>
                            <p className="text-[10px] text-slate-600 pl-2">artículos</p>
                            {s.avgPrice && (
                                <p className="text-[10px] text-slate-500 pl-2 mt-1">
                                    Avg: <span className="text-slate-300">${s.avgPrice.toFixed(2)}</span>
                                </p>
                            )}
                        </motion.button>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-950/60 border border-white/5 p-4">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                        type="text"
                        placeholder="Buscar artículo por nombre o SKU..."
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
                        className="w-full bg-slate-900 border border-white/5 pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-blue-500/60 placeholder:text-slate-700 transition-all"
                    />
                </div>
                {/* Supplier filter */}
                <select
                    value={selectedSupplier}
                    onChange={e => { setSelectedSupplier(e.target.value); setPage(1) }}
                    className="bg-slate-900 border border-white/5 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/60 transition-all cursor-pointer min-w-[200px]"
                >
                    <option value="">Todos los proveedores</option>
                    {suppliers.map(s => (
                        <option key={s.name} value={s.name}>{s.name} ({s.count})</option>
                    ))}
                </select>
                {/* Category filter */}
                <select
                    value={selectedCategory}
                    onChange={e => { setSelectedCategory(e.target.value); setPage(1) }}
                    className="bg-slate-900 border border-white/5 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/60 transition-all cursor-pointer min-w-[180px]"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-600">
                    <RefreshCw size={40} className="animate-spin opacity-40" />
                    <p className="text-xs uppercase tracking-widest font-black italic">Cargando lista de precios...</p>
                </div>
            ) : viewMode === "grouped" ? (
                /* GROUPED VIEW */
                <div className="space-y-6">
                    {Object.entries(grouped).length === 0 ? (
                        <div className="text-center py-32 text-slate-600">
                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-xs uppercase tracking-widest font-black italic">No se encontraron artículos</p>
                        </div>
                    ) : Object.entries(grouped).map(([supplierName, prods]) => {
                        const color = getSupplierColor(supplierName)
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
                                className="border border-white/5 bg-slate-950/40 overflow-hidden"
                            >
                                {/* Supplier Header */}
                                <div
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-all group"
                                    onClick={() => toggleSupplier(supplierName)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: color }} />
                                        <div>
                                            <h3 className="text-base font-black text-white uppercase tracking-wide">{supplierName}</h3>
                                            <div className="flex items-center gap-4 mt-0.5">
                                                <span className="text-xs text-slate-500 italic">{prods.length} artículos</span>
                                                {avgM !== null && (
                                                    <span className="text-xs font-bold" style={{ color }}>
                                                        Margen prom: {avgM.toFixed(1)}%
                                                    </span>
                                                )}
                                                {stat?.avgPrice && (
                                                    <span className="text-xs text-slate-500">
                                                        PVP prom: ${stat.avgPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Margin apply button (admin only) */}
                                        {isAdmin && (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    setMarginEditSupplier(marginEditSupplier === supplierName ? null : supplierName)
                                                    setMarginValue("")
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-white/10 hover:border-blue-500/40 transition-all uppercase tracking-wider"
                                            >
                                                <Percent size={12} />
                                                Aplicar Margen
                                            </button>
                                        )}
                                        <ChevronDown
                                            size={18}
                                            className={`text-slate-600 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </div>

                                {/* Margin Apply Panel */}
                                <AnimatePresence>
                                    {isAdmin && marginEditSupplier === supplierName && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-white/5"
                                        >
                                            <div className="flex items-center gap-4 px-6 py-4 bg-blue-500/5">
                                                <AlertCircle size={16} className="text-blue-400 flex-shrink-0" />
                                                <p className="text-xs text-slate-400">
                                                    Aplica un margen de ganancia sobre el <strong className="text-white">precio de costo</strong> a todos los artículos de este proveedor que tengan costo registrado.
                                                </p>
                                                <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={marginValue}
                                                            onChange={e => setMarginValue(e.target.value)}
                                                            placeholder="% Margen"
                                                            className="w-28 bg-slate-900 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 rounded-none"
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">%</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleApplyMargin(supplierName)}
                                                        disabled={applyingMargin || !marginValue}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                                                    >
                                                        {applyingMargin ? "Aplicando..." : "Aplicar"}
                                                    </button>
                                                    <button
                                                        onClick={() => setMarginEditSupplier(null)}
                                                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-all"
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
                                            className="overflow-hidden border-t border-white/5"
                                        >
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5 bg-slate-950/60 italic">
                                                            <th className="px-5 py-3 text-left">Artículo</th>
                                                            <th className="px-5 py-3 text-left w-28">SKU</th>
                                                            <th className="px-5 py-3 text-left w-28">Categoría</th>
                                                            <th className="px-5 py-3 text-left w-36">Stock</th>
                                                            {isAdmin && <th className="px-5 py-3 text-left w-40">Costo (Prov.)</th>}
                                                            <th className="px-5 py-3 text-left w-40">PVP (Venta)</th>
                                                            <th className="px-5 py-3 text-left w-28">Margen</th>
                                                            <th className="px-5 py-3 text-left w-20">Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/[0.03]">
                                                        {prods.map((p) => {
                                                            const margin = calcMargin(p.compareAtPrice, p.price)
                                                            const isSaving = savingIds.has(p.id)
                                                            const isSaved = savedIds.has(p.id)
                                                            const img = safeParseImages(p.images)

                                                            return (
                                                                <tr
                                                                    key={p.id}
                                                                    className={`hover:bg-white/[0.02] transition-colors group ${
                                                                        isSaving ? "opacity-60" : ""
                                                                    } ${isSaved ? "bg-emerald-500/5" : ""}`}
                                                                >
                                                                    <td className="px-5 py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 bg-slate-900 border border-white/5 flex-shrink-0 overflow-hidden">
                                                                                {img ? (
                                                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <Package size={16} className="m-1 text-slate-700" />
                                                                                )}
                                                                            </div>
                                                                            <span className="text-slate-200 font-medium text-xs line-clamp-2 max-w-[300px]">{p.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-5 py-3">
                                                                        <span className="text-slate-500 text-xs font-mono">{p.sku || "—"}</span>
                                                                    </td>
                                                                    <td className="px-5 py-3">
                                                                        <span className="text-slate-500 text-xs">{p.category?.name || "—"}</span>
                                                                    </td>
                                                                    <td className="px-5 py-3">
                                                                        <span className={`text-xs font-bold ${
                                                                            p.stock > 10 ? "text-emerald-400" :
                                                                            p.stock > 0 ? "text-yellow-400" :
                                                                            "text-red-400"
                                                                        }`}>
                                                                            {p.stock > 0 ? `${p.stock} uds` : "Sin stock"}
                                                                        </span>
                                                                    </td>
                                                                    {isAdmin && (
                                                                        <td className="px-5 py-3">
                                                                            {isAdmin ? (
                                                                                <InlineEdit
                                                                                    value={p.compareAtPrice || 0}
                                                                                    onSave={val => handlePriceUpdate(p.id, "compareAtPrice", val)}
                                                                                />
                                                                            ) : (
                                                                                <span className="text-slate-500 text-xs">
                                                                                    {p.compareAtPrice ? `$${p.compareAtPrice.toFixed(2)}` : "—"}
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    )}
                                                                    <td className="px-5 py-3">
                                                                        {isAdmin ? (
                                                                            <InlineEdit
                                                                                value={p.price}
                                                                                onSave={val => handlePriceUpdate(p.id, "price", val)}
                                                                            />
                                                                        ) : (
                                                                            <span className="text-white font-bold">${p.price.toFixed(2)}</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-5 py-3">
                                                                        <MarginBadge margin={margin} />
                                                                    </td>
                                                                    <td className="px-5 py-3">
                                                                        <div className={`w-2 h-2 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-slate-600"}`} title={p.isActive ? "Activo" : "Inactivo"} />
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
                /* TABLE VIEW - flat list */
                <div className="border border-white/5 bg-slate-950/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5 bg-slate-950/60 italic">
                                    <th className="px-5 py-4 text-left">Artículo</th>
                                    <th className="px-5 py-4 text-left w-40">Proveedor</th>
                                    <th className="px-5 py-4 text-left w-32">SKU</th>
                                    <th className="px-5 py-4 text-left w-32">Categoría</th>
                                    <th className="px-5 py-4 text-left w-24">Stock</th>
                                    {isAdmin && <th className="px-5 py-4 text-left w-36">Costo</th>}
                                    <th className="px-5 py-4 text-left w-36">PVP</th>
                                    <th className="px-5 py-4 text-left w-28">Margen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {products.map(p => {
                                    const margin = calcMargin(p.compareAtPrice, p.price)
                                    const isSaving = savingIds.has(p.id)
                                    const isSaved = savedIds.has(p.id)
                                    const img = safeParseImages(p.images)
                                    const color = getSupplierColor(p.provider || "Sin Proveedor")

                                    return (
                                        <tr
                                            key={p.id}
                                            className={`hover:bg-white/[0.02] transition-colors ${isSaving ? "opacity-60" : ""} ${isSaved ? "bg-emerald-500/5" : ""}`}
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-900 border border-white/5 flex-shrink-0 overflow-hidden">
                                                        {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <Package size={14} className="m-1 text-slate-700" />}
                                                    </div>
                                                    <span className="text-slate-200 text-xs line-clamp-1 max-w-[280px]">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color, background: `${color}18` }}>
                                                    {p.provider || "Sin Proveedor"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-slate-500 text-xs font-mono">{p.sku || "—"}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-slate-500 text-xs">{p.category?.name || "—"}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs font-bold ${p.stock > 10 ? "text-emerald-400" : p.stock > 0 ? "text-yellow-400" : "text-red-400"}`}>
                                                    {p.stock > 0 ? `${p.stock}` : "0"}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-5 py-3">
                                                    <InlineEdit
                                                        value={p.compareAtPrice || 0}
                                                        onSave={val => handlePriceUpdate(p.id, "compareAtPrice", val)}
                                                    />
                                                </td>
                                            )}
                                            <td className="px-5 py-3">
                                                <InlineEdit
                                                    value={p.price}
                                                    onSave={val => handlePriceUpdate(p.id, "price", val)}
                                                />
                                            </td>
                                            <td className="px-5 py-3">
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
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-slate-500 italic">
                        Página {page} de {totalPages} · {total} artículos totales
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-slate-900 border border-white/10 text-slate-400 text-xs font-bold uppercase disabled:opacity-40 hover:text-white hover:border-white/20 transition-all"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-slate-900 border border-white/10 text-slate-400 text-xs font-bold uppercase disabled:opacity-40 hover:text-white hover:border-white/20 transition-all"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
