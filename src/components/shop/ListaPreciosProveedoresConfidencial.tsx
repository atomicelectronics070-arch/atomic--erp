"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShieldAlert, ExternalLink, Download, Copy, Check, Search, Filter,
    Truck, Building2, Tag, DollarSign, Image as ImageIcon, FileText,
    Share2, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Phone,
    Eye, Laptop, Gamepad2, Shield, Zap, Home, ChevronRight, Layers, Lock,
    ChevronLeft, RefreshCw, X, Maximize2, AlertOctagon, HelpCircle, Globe
} from "lucide-react"

// Clean raw HTML tags from product descriptions
const cleanHtmlDescription = (text: string | null | undefined): string => {
    if (!text) return ""
    return text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<\/li>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}

export interface CatalogProduct {
    id: string
    name: string
    sku: string
    price: number
    wholesaleCost: number | null
    margin: number | null
    stock: number
    isActive: boolean
    categoryName: string
    description: string
    hasProvider: boolean
    providerName: string
    noProviderMessage: string | null
    supplierDomain: string | null
    supplierUrl: string | null
    images: string[]
    updatedAt: string
}

export interface CategoryItem {
    id: string
    name: string
    slug: string
    count: number
}

// Icon helper for categories
const getCategoryIcon = (name: string): string => {
    const n = (name || "").toLowerCase()
    if (n.includes("monitor") || n.includes("pantalla")) return "🖥"
    if (n.includes("cerradura")) return "🚪"
    if (n.includes("generador") || n.includes("energ") || n.includes("ups") || n.includes("bater")) return "⚡"
    if (n.includes("gaming") || n.includes("consola") || n.includes("juego") || n.includes("mando")) return "🎮"
    if (n.includes("acabado") || n.includes("marmol") || n.includes("mármol") || n.includes("panel") || n.includes("hogar") || n.includes("remodela")) return "🔍"
    if (n.includes("audio") || n.includes("sonido") || n.includes("parlante") || n.includes("audifono")) return "🔊"
    if (n.includes("camara") || n.includes("cámara") || n.includes("vigilancia") || n.includes("cctv")) return "📹"
    if (n.includes("laptop") || n.includes("computador") || n.includes("pc")) return "💻"
    if (n.includes("celular") || n.includes("tablet") || n.includes("phone")) return "📱"
    if (n.includes("cocina") || n.includes("extracc") || n.includes("campana") || n.includes("horno")) return "🍳"
    if (n.includes("red") || n.includes("telecom") || n.includes("cable") || n.includes("router")) return "🌐"
    if (n.includes("domotica") || n.includes("domótica") || n.includes("smart") || n.includes("automat")) return "🤖"
    if (n.includes("videoportero") || n.includes("portero") || n.includes("citofono") || n.includes("citófono") || n.includes("alarma")) return "🛡"
    if (n.includes("impresora")) return "🖨"
    if (n.includes("disco") || n.includes("almacen")) return "💾"
    if (n.includes("herramienta") || n.includes("soldadur")) return "🔧"
    if (n.includes("calefactor")) return "🔥"
    if (n.includes("torniquete")) return "🚶"
    if (n.includes("balanza")) return "⚖️"
    if (n.includes("sensor")) return "📡"
    if (n.includes("software") || n.includes("bot")) return "⚙️"
    return "📦"
}

interface SupplierStat {
    name: string
    count: number
    isInternal: boolean
}

export default function ListaPreciosProveedoresConfidencial() {
    // Data states
    const [products, setProducts] = useState<CatalogProduct[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [debouncedSearch, setDebouncedSearch] = useState<string>("")
    const [selectedProvider, setSelectedProvider] = useState<string>("ALL")
    const [statusFilter, setStatusFilter] = useState<"ALL" | "WITH_PROVIDER" | "NO_PROVIDER">("ALL")
    const [topSuppliers, setTopSuppliers] = useState<SupplierStat[]>([])
    const [catalogSummary, setCatalogSummary] = useState({
        totalCatalog: 0,
        totalWithoutProvider: 0,
        totalWithProvider: 0,
    })

    // Categories state
    const [categories, setCategories] = useState<CategoryItem[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL")
    const [showAllCategoryPills, setShowAllCategoryPills] = useState<boolean>(false)
    const categoryScrollRef = React.useRef<HTMLDivElement>(null)

    // Horizontal category split
    const horizontalCategories = useMemo(() => {
        return categories.slice(0, 14)
    }, [categories])

    const remainingCategories = useMemo(() => {
        return categories.slice(14)
    }, [categories])

    const selectedCategory = useMemo(() => {
        return categories.find((c) => c.id === selectedCategoryId)
    }, [categories, selectedCategoryId])

    const scrollCategories = (direction: "left" | "right") => {
        if (categoryScrollRef.current) {
            const offset = direction === "left" ? -280 : 280
            categoryScrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
        }
    }

    const handleCategorySelect = (catId: string) => {
        setSelectedCategoryId(catId)
        setCurrentPage(1)
    }

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalProducts, setTotalProducts] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(30)

    // Modal states for HD photo extraction
    const [selectedProductForModal, setSelectedProductForModal] = useState<CatalogProduct | null>(null)
    const [activeImageIdx, setActiveImageIdx] = useState<number>(0)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setCurrentPage(1)
        }, 350)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Reset page when filters change
    const handleFilterChange = (filter: "ALL" | "WITH_PROVIDER" | "NO_PROVIDER") => {
        setStatusFilter(filter)
        if (filter === "NO_PROVIDER") {
            setSelectedProvider("SIN_PROVEEDOR")
        } else if (selectedProvider === "SIN_PROVEEDOR") {
            setSelectedProvider("ALL")
        }
        setCurrentPage(1)
    }

    const handleProviderChange = (provider: string) => {
        setSelectedProvider(provider)
        if (provider === "SIN_PROVEEDOR") {
            setStatusFilter("NO_PROVIDER")
        } else if (statusFilter === "NO_PROVIDER" && provider !== "ALL") {
            setStatusFilter("WITH_PROVIDER")
        }
        setCurrentPage(1)
    }

    // Fetch products from dedicated API
    const fetchProducts = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            params.set("page", currentPage.toString())
            params.set("limit", pageSize.toString())
            if (debouncedSearch) params.set("search", debouncedSearch)
            if (selectedProvider && selectedProvider !== "ALL") params.set("provider", selectedProvider)
            if (statusFilter && statusFilter !== "ALL") params.set("filter", statusFilter)
            if (selectedCategoryId && selectedCategoryId !== "ALL") params.set("category", selectedCategoryId)

            const res = await fetch(`/api/admin/confidential-supplier-products?${params.toString()}`)
            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`)
            }
            const data = await res.json()

            if (data.success) {
                setProducts(data.products || [])
                setTotalPages(data.pagination?.totalPages || 1)
                setTotalProducts(data.pagination?.total || 0)
                if (data.summary) {
                    setCatalogSummary(data.summary)
                }
                if (data.topSuppliers && data.topSuppliers.length > 0) {
                    setTopSuppliers(data.topSuppliers)
                }
                if (data.categories && data.categories.length > 0) {
                    setCategories(data.categories)
                }
            } else {
                throw new Error(data.error || "No se pudo cargar el catálogo")
            }
        } catch (err: any) {
            console.error("Error loading products:", err)
            setError(err.message || "Error al conectar con la base de datos")
        } finally {
            setLoading(false)
        }
    }, [currentPage, pageSize, debouncedSearch, selectedProvider, statusFilter, selectedCategoryId])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // Toast helper
    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    // Copy handlers
    const copyToClipboard = (text: string, id: string, label: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        showToast(`¡${label} copiado al portapapeles!`)
        setTimeout(() => setCopiedId(null), 2500)
    }

    const copyAdCopy = (product: CatalogProduct) => {
        const copyText = `⚡ ${product.name.toUpperCase()} ⚡
📦 Código / Ref: ${product.sku}
💰 Precio de Promoción: $${product.price.toFixed(2)} USD
${product.stock > 0 ? `✅ Stock Inmediato (${product.stock} unidades disponibles)` : "✅ Entrega Rápida / Bajo Pedido"}
${product.description ? `\n📝 Características:\n${product.description.slice(0, 300)}...` : ""}

📲 Escríbenos al WhatsApp directo para apartar o consultar envíos a todo el país.`
        copyToClipboard(copyText, `ad-${product.id}`, "Copy publicitario")
    }

    return (
        <div className="space-y-6">
            {/* TOAST ALERT */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 shadow-2xl backdrop-blur-md font-sans text-xs font-semibold"
                    >
                        <CheckCircle2 size={18} className="text-emerald-400 animate-bounce" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONFIDENTIALITY HERO BANNER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border border-red-500/30 p-6 md:p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-3 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
                                <ShieldAlert size={13} className="text-red-400" />
                                Estricta Confidencialidad Operativa
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                <Lock size={12} />
                                Stefy & Cristina • Acceso VIP
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            Lista de Precios por Artículo & Acceso a Proveedor Real
                        </h1>

                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                            Aquí puedes consultar cada uno de los <strong className="text-cyan-400">{catalogSummary.totalCatalog.toLocaleString()} artículos</strong> de
                            nuestro inventario central. En cada artículo tienes el botón directo para ir a la <strong className="text-emerald-400">web del proveedor real</strong> del
                            cual fue extraído/scrapeado, sus costos mayoristas y herramientas para extraer fotos en alta resolución y descripciones.
                            Si un producto fue ingresado manualmente sin scraping, el sistema lo marca automáticamente con la alerta:{" "}
                            <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                ⚠️ Producto ingresado sin proveedor
                            </span>.
                        </p>
                    </div>

                    {/* METRIC COUNTERS */}
                    <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
                        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-center">
                            <span className="block text-[10px] font-mono text-slate-400 uppercase">Total Catálogo</span>
                            <span className="text-lg md:text-xl font-bold font-mono text-white">
                                {catalogSummary.totalCatalog.toLocaleString()}
                            </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                            <span className="block text-[10px] font-mono text-emerald-400 uppercase">Con Proveedor</span>
                            <span className="text-lg md:text-xl font-bold font-mono text-emerald-300">
                                {catalogSummary.totalWithProvider.toLocaleString()}
                            </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
                            <span className="block text-[10px] font-mono text-amber-400 uppercase">Sin Proveedor</span>
                            <span className="text-lg md:text-xl font-bold font-mono text-amber-300">
                                {catalogSummary.totalWithoutProvider.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTROLS & FILTERS BAR */}
            <div className="p-4 md:p-6 rounded-2xl bg-slate-900/70 border border-white/10 space-y-4 backdrop-blur-md">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* SEARCH INPUT */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nombre de producto, SKU, modelo o proveedor (ej. Teclado HP, Sisegusa, Steren)..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {/* SUPPLIER SELECTOR */}
                    <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-slate-400 shrink-0" />
                        <select
                            value={selectedProvider}
                            onChange={(e) => handleProviderChange(e.target.value)}
                            className="bg-slate-950 border border-white/10 text-slate-200 text-xs md:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-400 font-sans"
                        >
                            <option value="ALL">🏢 Todos los Proveedores</option>
                            <option value="SIN_PROVEEDOR">⚠️ Sin Proveedor (Manuales)</option>
                            {topSuppliers.map((sup) => (
                                <option key={sup.name} value={sup.name}>
                                    {sup.name} ({sup.count})
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={fetchProducts}
                            title="Recargar catálogo"
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* STATUS FILTER PILLS */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Filtrar:</span>

                    <button
                        onClick={() => handleFilterChange("ALL")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                            statusFilter === "ALL" && selectedProvider === "ALL"
                                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                    >
                        Todos ({totalProducts.toLocaleString()})
                    </button>

                    <button
                        onClick={() => handleFilterChange("WITH_PROVIDER")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                            statusFilter === "WITH_PROVIDER"
                                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                    >
                        <Building2 size={13} />
                        Con Proveedor Scrapeado
                    </button>

                    <button
                        onClick={() => handleFilterChange("NO_PROVIDER")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                            statusFilter === "NO_PROVIDER" || selectedProvider === "SIN_PROVEEDOR"
                                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                                : "bg-slate-800 text-amber-300 hover:bg-slate-700"
                        }`}
                    >
                        <AlertTriangle size={13} />
                        ⚠️ Sin Proveedor (Manuales)
                    </button>

                    {/* FAST SHORTCUT PILLS FOR TOP SCRAPED PROVIDERS */}
                    <div className="hidden lg:flex items-center gap-1.5 ml-auto overflow-x-auto text-xs">
                        <span className="text-[10px] font-mono text-slate-500">Top Fuentes:</span>
                        {topSuppliers.slice(0, 4).map((sup) => (
                            <button
                                key={sup.name}
                                onClick={() => handleProviderChange(sup.name)}
                                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                                    selectedProvider === sup.name
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                        : "bg-slate-950 text-slate-400 hover:text-white border border-white/5"
                                }`}
                            >
                                {sup.name.split(" ")[0]} ({sup.count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CATÁLOGO GENERAL DE PRODUCTOS - SECCIÓN CON SCROLL HORIZONTAL DE CATEGORÍAS */}
            <div className="p-4 md:p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 backdrop-blur-md">
                {/* ENCABEZADO ESTILO SCREENSHOT */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                            Catálogo General de Productos
                        </h2>
                        <p className="text-xs md:text-sm text-slate-400 font-sans mt-0.5">
                            <strong className="text-cyan-400 font-mono">{totalProducts.toLocaleString()}</strong> productos disponibles en esta sección
                            {selectedCategory && (
                                <span className="ml-2 text-emerald-400 font-semibold font-mono">
                                    • Filtrado por: {selectedCategory.name}
                                </span>
                            )}
                        </p>
                    </div>

                    {/* BOTÓN PARA EXPANDIR / MINIMIZAR VIÑETAS */}
                    <div className="flex items-center gap-2">
                        {selectedCategoryId !== "ALL" && (
                            <button
                                onClick={() => handleCategorySelect("ALL")}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-mono font-bold transition-all border border-rose-500/30 flex items-center gap-1"
                            >
                                <X size={13} />
                                <span>Quitar Filtro Categoría</span>
                            </button>
                        )}

                        <button
                            onClick={() => setShowAllCategoryPills(!showAllCategoryPills)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-2 shadow-md ${
                                showAllCategoryPills
                                    ? "bg-cyan-500 text-black border-cyan-300 shadow-cyan-500/20"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10"
                            }`}
                        >
                            <Layers size={13} className={showAllCategoryPills ? "text-black" : "text-cyan-400"} />
                            <span>{showAllCategoryPills ? "▲ Minimizar Viñetas" : "▼ Viñetas & Todas las Categorías"}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${showAllCategoryPills ? "bg-black/30 text-black" : "bg-black/50 text-cyan-300"}`}>
                                {categories.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* BARRA HORIZONTAL SCROLLEABLE DE CATEGORÍAS */}
                <div className="relative group">
                    {/* SCROLL BUTTON LEFT */}
                    <button
                        onClick={() => scrollCategories("left")}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900 border border-white/20 text-white hover:bg-cyan-500 hover:text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                        title="Desplazar a la izquierda"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* SCROLLABLE PILLS CONTAINER */}
                    <div
                        ref={categoryScrollRef}
                        className="flex items-center gap-2.5 overflow-x-auto pb-2 scroll-smooth select-none px-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {/* BOTÓN TODOS LOS PRODUCTOS */}
                        <button
                            onClick={() => handleCategorySelect("ALL")}
                            className={`px-4 py-2 rounded-full text-xs font-bold font-sans transition-all shrink-0 flex items-center gap-2 border shadow-sm ${
                                selectedCategoryId === "ALL"
                                    ? "bg-slate-950 text-white border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-950/40"
                                    : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border-white/10"
                            }`}
                        >
                            <Globe size={14} className={selectedCategoryId === "ALL" ? "text-cyan-400" : "text-slate-400"} />
                            <span>Todos los Productos</span>
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-black/40 text-slate-300">
                                {catalogSummary.totalCatalog.toLocaleString()}
                            </span>
                        </button>

                        {/* PILLS DE CATEGORÍAS PRINCIPALES */}
                        {horizontalCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold font-sans transition-all shrink-0 flex items-center gap-2 border shadow-sm ${
                                    selectedCategoryId === cat.id
                                        ? "bg-slate-950 text-white border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-950/40"
                                        : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-white/10"
                                }`}
                            >
                                <span className="text-sm">{getCategoryIcon(cat.name)}</span>
                                <span className="whitespace-nowrap">{cat.name}</span>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-black/40 text-slate-300">
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* SCROLL BUTTON RIGHT */}
                    <button
                        onClick={() => scrollCategories("right")}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900 border border-white/20 text-white hover:bg-cyan-500 hover:text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                        title="Desplazar a la derecha"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* PANEL EXPANDIBLE / MINIMIZABLE DE VIÑETAS (CATEGORÍAS RESTANTES Y SUB-CATEGORÍAS) */}
                <AnimatePresence>
                    {showAllCategoryPills && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-4 space-y-3 shadow-2xl backdrop-blur-md"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                        Viñetas Minimizables de Categorías ({categories.length} disponibles en total)
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowAllCategoryPills(false)}
                                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                                >
                                    <span>Minimizar Viñetas</span>
                                    <ChevronRight size={13} className="-rotate-90" />
                                </button>
                            </div>

                            <p className="text-[11px] text-slate-400 font-sans">
                                Haz clic en cualquiera de las siguientes viñetas para filtrar inmediatamente el catálogo por esa categoría:
                            </p>

                            {/* GRID DE TODAS LAS VIÑETAS */}
                            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategorySelect(cat.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all flex items-center gap-1.5 border ${
                                            selectedCategoryId === cat.id
                                                ? "bg-cyan-500 text-black border-cyan-300 font-bold shadow-lg shadow-cyan-500/20"
                                                : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-white/5"
                                        }`}
                                    >
                                        <span>{getCategoryIcon(cat.name)}</span>
                                        <span>{cat.name}</span>
                                        <span
                                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                                                selectedCategoryId === cat.id ? "bg-black/20 text-black" : "bg-black/50 text-slate-400"
                                            }`}
                                        >
                                            {cat.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* MAIN PRODUCTS GRID */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <RefreshCw size={36} className="text-cyan-400 animate-spin" />
                    <p className="text-sm font-mono text-slate-400">Consultando base de datos de artículos y proveedores...</p>
                </div>
            ) : error ? (
                <div className="p-8 rounded-2xl bg-red-950/30 border border-red-500/40 text-center space-y-3">
                    <AlertOctagon size={36} className="text-red-400 mx-auto" />
                    <h3 className="text-base font-bold text-white">No se pudo cargar el catálogo</h3>
                    <p className="text-xs text-red-300">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            ) : products.length === 0 ? (
                <div className="p-12 rounded-2xl bg-slate-900/50 border border-white/10 text-center space-y-3">
                    <AlertTriangle size={36} className="text-amber-400 mx-auto" />
                    <h3 className="text-base font-bold text-white">No se encontraron artículos</h3>
                    <p className="text-xs text-slate-400">
                        No hay productos que coincidan con la búsqueda "{debouncedSearch}" o el filtro seleccionado.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery("")
                            setSelectedProvider("ALL")
                            setStatusFilter("ALL")
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                        <span>
                            Mostrando {products.length} de {totalProducts.toLocaleString()} artículos encontrados
                        </span>
                        <span>
                            Página {currentPage} de {totalPages}
                        </span>
                    </div>

                    {/* PRODUCT CARDS LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden backdrop-blur-sm ${
                                    product.hasProvider
                                        ? "bg-slate-900/80 border-white/10 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20"
                                        : "bg-slate-900/90 border-amber-500/30 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-950/20"
                                }`}
                            >
                                <div className="space-y-3">
                                    {/* TOP ROW: CATEGORY + PROVIDER BADGE OR WARNING */}
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                                            {product.categoryName}
                                        </span>

                                        {/* PROVIDER BADGE OR WARNING REQUIREMENT */}
                                        {product.hasProvider ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 max-w-[200px] truncate">
                                                <Building2 size={11} className="shrink-0 text-emerald-400" />
                                                <span className="truncate">{product.providerName}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/70 text-amber-300 border border-amber-500/40 animate-pulse">
                                                <AlertTriangle size={11} className="shrink-0 text-amber-400" />
                                                <span>Sin proveedor</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* ALERT BOX IF NO PROVIDER */}
                                    {!product.hasProvider && (
                                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                                            <AlertTriangle size={15} className="text-amber-400 shrink-0" />
                                            <div className="text-[11px] leading-tight text-amber-200 font-sans font-semibold">
                                                Producto ingresado sin proveedor
                                                <span className="block text-[9px] font-mono text-amber-400/80 font-normal">
                                                    (Ingresado manualmente en el sistema sin enlace de scraping)
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* IMAGE AND DETAILS */}
                                    <div className="flex gap-3">
                                        {/* IMAGE THUMBNAIL */}
                                        <div
                                            onClick={() => {
                                                setSelectedProductForModal(product)
                                                setActiveImageIdx(0)
                                            }}
                                            className="w-24 h-24 rounded-xl bg-slate-950 border border-white/10 overflow-hidden shrink-0 relative group cursor-pointer flex items-center justify-center"
                                        >
                                            {product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        // Fallback icon on broken image
                                                        (e.target as HTMLElement).style.display = "none"
                                                    }}
                                                />
                                            ) : (
                                                <ImageIcon size={28} className="text-slate-600" />
                                            )}

                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-[10px] font-mono text-white font-bold">
                                                <Maximize2 size={12} />
                                                <span>Ver HD</span>
                                            </div>

                                            {product.images.length > 1 && (
                                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white font-bold">
                                                    +{product.images.length}
                                                </span>
                                            )}
                                        </div>

                                        {/* PRODUCT TITLE & SKU */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h3 className="text-xs md:text-sm font-bold text-white leading-snug line-clamp-2 hover:text-cyan-300 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                                <Tag size={10} />
                                                <span>{product.sku}</span>
                                            </div>
                                            <div className="text-[10px] font-mono">
                                                {product.stock > 0 ? (
                                                    <span className="text-emerald-400 font-semibold">
                                                        ● {product.stock} disp.
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500">● Stock a consultar</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* PRICING BREAKDOWN */}
                                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                                        <div>
                                            <span className="block text-[9px] font-mono text-slate-400 uppercase">PVP Público</span>
                                            <span className="text-base font-extrabold text-cyan-400 font-mono">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-[9px] font-mono text-slate-400 uppercase">Costo Mayorista</span>
                                            {product.wholesaleCost ? (
                                                <span className="text-base font-extrabold text-amber-300 font-mono">
                                                    ${product.wholesaleCost.toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-mono text-slate-500 italic">No registrado</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* DESCRIPTION SNIPPET (IF ANY) */}
                                    {product.description && (
                                        <p className="text-[11px] text-slate-400 line-clamp-2 font-sans leading-relaxed">
                                            {cleanHtmlDescription(product.description)}
                                        </p>
                                    )}
                                </div>

                                {/* BOTTOM ACTION TOOLBAR */}
                                <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
                                    {/* LINK PÚBLICO EN WEB ATOMIC */}
                                    <div className="p-2 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-1">
                                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                                            <span className="text-cyan-400 font-bold flex items-center gap-1">
                                                <Globe size={11} className="text-cyan-400" />
                                                <span>Link en Web Atomic:</span>
                                            </span>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        `https://atomiccotizador.shop/web/product/${product.id}`,
                                                        `link-${product.id}`,
                                                        "Link de Web Atomic"
                                                    )
                                                }
                                                className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold transition-colors flex items-center gap-1"
                                                title="Copiar link directo para enviar por WhatsApp o clientes"
                                            >
                                                {copiedId === `link-${product.id}` ? (
                                                    <Check size={10} className="text-emerald-400" />
                                                ) : (
                                                    <Copy size={10} />
                                                )}
                                                <span>{copiedId === `link-${product.id}` ? "¡Copiado!" : "Copiar Link"}</span>
                                            </button>
                                        </div>
                                        <div className="text-[10px] font-mono text-cyan-200/90 truncate bg-black/60 px-2 py-1 rounded border border-white/5 select-all flex items-center justify-between gap-1">
                                            <span className="truncate">https://atomiccotizador.shop/web/product/{product.id}</span>
                                            <a
                                                href={`/web/product/${product.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1 rounded bg-cyan-600/80 hover:bg-cyan-500 text-white shrink-0 transition-colors"
                                                title="Abrir publicación en pestaña nueva"
                                            >
                                                <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>

                                    {/* BOTÓN IR A PUBLICACIÓN EN WEB ATOMIC */}
                                    <a
                                        href={`/web/product/${product.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-950/40 transition-all group"
                                    >
                                        <Globe size={13} className="text-cyan-200" />
                                        <span>Ir a Publicación en Web Atomic</span>
                                        <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                    </a>

                                    {/* PRIMARY ACCESS: GO TO REAL SCRAPED SUPPLIER */}
                                    {product.hasProvider && product.supplierUrl ? (
                                        <a
                                            href={product.supplierUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-950/30 transition-all group"
                                        >
                                            <Building2 size={13} className="text-emerald-200" />
                                            <span>Ir a Proveedor Real ({product.supplierDomain || product.providerName})</span>
                                            <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    ) : (
                                        <div className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 text-slate-500 font-mono text-[11px] border border-white/5 cursor-not-allowed">
                                            <AlertTriangle size={12} className="text-amber-500/60" />
                                            <span>Sin enlace de proveedor externo</span>
                                        </div>
                                    )}

                                    {/* SECONDARY ACTION BUTTONS: EXTRACT PHOTOS, COPIAR TITULO & COPIAR DESCRIPCION */}
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {/* EXTRACT PHOTOS */}
                                        <button
                                            onClick={() => {
                                                setSelectedProductForModal(product)
                                                setActiveImageIdx(0)
                                            }}
                                            className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-semibold transition-colors border border-white/5"
                                            title="Extraer y descargar fotos en alta resolución"
                                        >
                                            <ImageIcon size={11} className="text-cyan-400" />
                                            <span>Fotos ({product.images.length})</span>
                                        </button>

                                        {/* COPIAR TITULO */}
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    product.name,
                                                    `title-${product.id}`,
                                                    "Título de publicación"
                                                )
                                            }
                                            className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-semibold transition-colors border border-white/5"
                                            title="Copiar el título de la publicación"
                                        >
                                            {copiedId === `title-${product.id}` ? (
                                                <Check size={11} className="text-emerald-400" />
                                            ) : (
                                                <Copy size={11} className="text-amber-400" />
                                            )}
                                            <span>{copiedId === `title-${product.id}` ? "¡Copiado!" : "Copiar Título"}</span>
                                        </button>

                                        {/* COPIAR DESCRIPCION */}
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    cleanHtmlDescription(product.description || product.name),
                                                    `desc-${product.id}`,
                                                    "Descripción limpia"
                                                )
                                            }
                                            className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-semibold transition-colors border border-white/5"
                                            title="Copiar la descripción del producto"
                                        >
                                            {copiedId === `desc-${product.id}` ? (
                                                <Check size={11} className="text-emerald-400" />
                                            ) : (
                                                <FileText size={11} className="text-pink-400" />
                                            )}
                                            <span>{copiedId === `desc-${product.id}` ? "¡Copiada!" : "Copiar Descripción"}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* PAGINATION CONTROLS */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 font-mono text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                            <span>Artículos por página:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(parseInt(e.target.value))
                                    setCurrentPage(1)
                                }}
                                className="bg-slate-950 border border-white/10 text-white rounded-lg px-2 py-1"
                            >
                                <option value={24}>24</option>
                                <option value={30}>30</option>
                                <option value={48}>48</option>
                                <option value={96}>96</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage <= 1 || loading}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1 transition-colors"
                            >
                                <ChevronLeft size={14} />
                                <span>Anterior</span>
                            </button>

                            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-cyan-400 font-bold">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                disabled={currentPage >= totalPages || loading}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1 transition-colors"
                            >
                                <span>Siguiente</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: PHOTO EXTRACTOR & DOWNLOADER */}
            <AnimatePresence>
                {selectedProductForModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-white/20 p-6 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col font-sans"
                        >
                            {/* MODAL HEADER */}
                            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                            Extractor de Fotos HD
                                        </span>
                                        <span className="text-xs font-mono text-slate-400">
                                            {selectedProductForModal.sku}
                                        </span>
                                    </div>
                                    <h2 className="text-sm md:text-base font-bold text-white mt-1">
                                        {selectedProductForModal.name}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedProductForModal(null)}
                                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* MAIN IMAGE DISPLAY */}
                            <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
                                {selectedProductForModal.images.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="relative aspect-video max-h-[380px] w-full rounded-xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center">
                                            <img
                                                src={selectedProductForModal.images[activeImageIdx]}
                                                alt={selectedProductForModal.name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 text-white font-mono text-[11px] font-bold">
                                                Foto {activeImageIdx + 1} de {selectedProductForModal.images.length}
                                            </div>
                                        </div>

                                        {/* THUMBNAILS CAROUSEL */}
                                        {selectedProductForModal.images.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {selectedProductForModal.images.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveImageIdx(idx)}
                                                        className={`w-16 h-16 rounded-lg overflow-hidden border shrink-0 transition-all ${
                                                            activeImageIdx === idx
                                                                ? "border-cyan-400 ring-2 ring-cyan-400/30 scale-105"
                                                                : "border-white/10 opacity-60 hover:opacity-100"
                                                        }`}
                                                    >
                                                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* ENLACE DIRECTO A WEB ATOMIC DENTRO DEL MODAL */}
                                        <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
                                            <div className="flex items-center gap-1.5 text-cyan-300 truncate">
                                                <Globe size={13} className="text-cyan-400 shrink-0" />
                                                <span className="truncate">https://atomiccotizador.shop/web/product/{selectedProductForModal.id}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => {
                                                        copyToClipboard(
                                                            `https://atomiccotizador.shop/web/product/${selectedProductForModal.id}`,
                                                            `modal-link-${selectedProductForModal.id}`,
                                                            "Link de Web Atomic"
                                                        )
                                                    }}
                                                    className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold transition-colors flex items-center gap-1"
                                                >
                                                    {copiedId === `modal-link-${selectedProductForModal.id}` ? (
                                                        <Check size={11} className="text-emerald-400" />
                                                    ) : (
                                                        <Copy size={11} />
                                                    )}
                                                    <span>{copiedId === `modal-link-${selectedProductForModal.id}` ? "¡Copiado!" : "Copiar Link"}</span>
                                                </button>
                                                <a
                                                    href={`/web/product/${selectedProductForModal.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-mono font-bold transition-colors flex items-center gap-1"
                                                >
                                                    <ExternalLink size={11} />
                                                    <span>Abrir Web</span>
                                                </a>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS FOR ACTIVE IMAGE & PRODUCT TEXTS */}
                                        <div className="flex flex-wrap items-center gap-2 pt-2">
                                            <a
                                                href={selectedProductForModal.images[activeImageIdx]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-colors"
                                            >
                                                <ExternalLink size={13} />
                                                <span>Abrir Foto HD</span>
                                            </a>

                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        selectedProductForModal.images[activeImageIdx]
                                                    )
                                                    showToast("¡Enlace de imagen copiado al portapapeles!")
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors border border-white/10"
                                            >
                                                <Copy size={13} />
                                                <span>Copiar URL Imagen</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    copyToClipboard(
                                                        selectedProductForModal.name,
                                                        `modal-title-${selectedProductForModal.id}`,
                                                        "Título de publicación"
                                                    )
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors border border-white/10"
                                            >
                                                {copiedId === `modal-title-${selectedProductForModal.id}` ? (
                                                    <Check size={12} className="text-emerald-400" />
                                                ) : (
                                                    <Copy size={12} className="text-amber-400" />
                                                )}
                                                <span>{copiedId === `modal-title-${selectedProductForModal.id}` ? "¡Título Copiado!" : "Copiar Título"}</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    copyToClipboard(
                                                        cleanHtmlDescription(selectedProductForModal.description || selectedProductForModal.name),
                                                        `modal-desc-${selectedProductForModal.id}`,
                                                        "Descripción limpia"
                                                    )
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors border border-white/10"
                                            >
                                                {copiedId === `modal-desc-${selectedProductForModal.id}` ? (
                                                    <Check size={12} className="text-emerald-400" />
                                                ) : (
                                                    <FileText size={12} className="text-pink-400" />
                                                )}
                                                <span>{copiedId === `modal-desc-${selectedProductForModal.id}` ? "¡Desc. Copiada!" : "Copiar Descripción"}</span>
                                            </button>

                                            {selectedProductForModal.hasProvider && selectedProductForModal.supplierUrl && (
                                                <a
                                                    href={selectedProductForModal.supplierUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-colors ml-auto"
                                                >
                                                    <Building2 size={13} />
                                                    <span>Ver en Proveedor</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center space-y-2 rounded-xl bg-slate-950 border border-white/5">
                                        <ImageIcon size={32} className="text-slate-600 mx-auto" />
                                        <p className="text-xs text-slate-400 font-mono">
                                            Este artículo no tiene fotos registradas en su ficha.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
