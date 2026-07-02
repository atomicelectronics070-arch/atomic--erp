"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Save, X, Edit, Trash2, Search, Plus, Filter, LayoutGrid, List,
    ChevronRight, Trash, Database, Package, Activity,
    Shield, Globe, Zap, Image as ImageIcon, Box, Layout, ArrowRight, 
    Tag as TagIcon, Settings, ShoppingBag, Layers, RefreshCw, MoreVertical, 
    CheckCircle, CheckCircle2, Star, CheckSquare, Square, Monitor, Cpu, ShieldAlert, 
    Upload, PlusCircle, FileText, ChevronDown, Store, Gamepad2, Download, Copy
} from "lucide-react"
import { CyberCard, NeonButton, CyberInput, GlassPanel } from "@/components/ui/CyberUI"
import { SupplierManager } from "@/components/shop/SupplierManager"
import { PriceListManager } from "@/components/shop/PriceListManager"
import { 
    createCategory, 
    createCollection, 
    deleteCollection, 
    deleteCategory, 
    deleteManyCollections,
    getStoreSettings,
    updateStoreSettings,
    searchProductsForTaxonomy,
    cleanupDuplicateProducts,
    bulkUpdateProducts,
    deleteManyProducts,
    restoreManyProducts,
    permanentDeleteManyProducts,
    deleteProduct,
    restoreProduct,
    permanentDeleteProduct,
    toggleProductFeatured,
    saveProduct,
    saveCategory,
    saveCollection
} from "@/lib/actions/shop"

export default function ShopConfigPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list')
    const [activeTab, setActiveTab] = useState<'products' | 'catalogs' | 'settings' | 'suppliers' | 'prices_list'>('products')
    const [products, setProducts] = useState<any[]>([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [dashboardSearch, setDashboardSearch] = useState("")
    const [metadata, setMetadata] = useState<{ categories: any[], collections: any[], providersList: string[] }>({ categories: [], collections: [], providersList: [] })
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [editingTaxonomy, setEditingTaxonomy] = useState<{ type: 'category' | 'collection', data: any } | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [selectedCollections, setSelectedCollections] = useState<string[]>([])
    const [showBulkEdit, setShowBulkEdit] = useState(false)
    const [isTrashView, setIsTrashView] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<string>('')
    const [providerStats, setProviderStats] = useState<any[]>([])
    const [totalInStock, setTotalInStock] = useState(0)
    const [isCleaning, setIsCleaning] = useState(false)
    const [storeSettings, setStoreSettings] = useState<any>({
        currency: 'USD',
        shippingCost: 0,
        freeShippingThreshold: 0,
        bannerText: '',
        bannerActive: false,
        banners: { software: {}, automation: {}, gaming: {} }
    })
    
    // Preview modals state
    const [previewImages, setPreviewImages] = useState<{ urls: string[]; title: string } | null>(null)
    const [previewDescription, setPreviewDescription] = useState<{ title: string; description: string; sku: string } | null>(null)

    const refreshData = async () => {
        setLoading(true)
        try {
            const [pRes, mRes, sRes] = await Promise.all([
                fetch(`/api/admin/products?page=${currentPage}&limit=${pageSize}&search=${dashboardSearch}&isTrash=${isTrashView}&provider=${selectedProvider}`),
                fetch('/api/web/metadata'),
                fetch('/api/shop/settings')
            ])
            const pData = await pRes.json()
            const mData = await mRes.json()
            const sData = await sRes.json()
            
            setProducts(pData.products || [])
            setTotalProducts(pData.total || 0)
            setMetadata({
                categories: mData.categories || [],
                collections: mData.collections || [],
                providersList: mData.providersList || []
            })
            if (sData) setStoreSettings(sData)
            
            // Use global stats from API (across ALL products, not just current page)
            if (pData.providerStats) {
                setProviderStats(pData.providerStats)
            }
            if (typeof pData.totalInStock === 'number') {
                setTotalInStock(pData.totalInStock)
            }
            
        } catch (error) {
            console.error("Error refreshing shop data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (status === "loading") return
        if (!session || !["ADMIN", "MANAGEMENT", "SALESPERSON", "AFILIADO", "COORDINATOR", "COORD_ASSISTANT"].includes(session.user?.role as string)) {
            router.push("/dashboard")
            return
        }
        if (session.user?.role !== "ADMIN") {
            setActiveTab('prices_list')
        }
        refreshData()
    }, [currentPage, pageSize, dashboardSearch, isTrashView, selectedProvider, session, status, router, activeTab])

    if (status === "loading" || !["ADMIN", "MANAGEMENT", "SALESPERSON", "AFILIADO", "COORDINATOR", "COORD_ASSISTANT"].includes(session?.user?.role as string)) {
        return <div className="p-10 text-center text-white text-[10px] font-black uppercase tracking-[0.5em] mt-20 italic">AUTENTICANDO CREDENCIALES...</div>
    }

    const saveSettings = async () => {
        setLoading(true)
        try {
            const res = await updateStoreSettings(storeSettings)
            if (res.success) alert("Protocolo comprometido.")
        } finally {
            setLoading(false)
        }
    }

    const handleBulkDeleteCollections = async () => {
        if (!confirm(`¿Confirmar poda masiva de ${selectedCollections.length} colecciones?`)) return
        try {
            await deleteManyCollections(selectedCollections)
            setSelectedCollections([])
            refreshData()
        } catch (e) {
            alert("Error en la poda masiva.")
        }
    }

    const handleDeleteCollection = async (id: string) => {
        if (!confirm("¿Eliminar este segmento de colección?")) return
        try {
            await deleteCollection(id)
            refreshData()
        } catch (e) {
            alert("Error al eliminar.")
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("¿Eliminar esta categoría? Se desvincularán los productos asociados.")) return
        try {
            await deleteCategory(id)
            refreshData()
        } catch (e) {
            alert("Error al eliminar categoría.")
        }
    }

    const toggleProductSelection = (id: string) => {
        setSelectedProducts(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const handleCleanupDuplicates = async () => {
        if (!confirm("¿Ejecutar saneamiento de catálogo?")) return
        setIsCleaning(true)
        try {
            await cleanupDuplicateProducts()
            await refreshData()
            alert("Catálogo saneado.")
        } finally {
            setIsCleaning(false)
        }
    }

    const toggleAllProducts = () => {
        if (selectedProducts.length === products.length && products.length > 0) {
            setSelectedProducts([])
        } else {
            setSelectedProducts(products.map(p => p.id))
        }
    }

    const handleBulkEdit = async (data: any) => {
        setLoading(true)
        try {
            await bulkUpdateProducts(selectedProducts, data)
            setShowBulkEdit(false)
            setSelectedProducts([])
            refreshData()
        } finally {
            setLoading(false)
        }
    }

    const handleBulkDeleteProducts = async () => {
        if (!confirm(`¿Mover ${selectedProducts.length} productos a la papelera?`)) return
        try {
            await deleteManyProducts(selectedProducts)
            setSelectedProducts([])
            refreshData()
        } catch (e) { alert("Error en el borrado masivo.") }
    }

    const handleBulkRestore = async () => {
        try {
            await restoreManyProducts(selectedProducts)
            setSelectedProducts([])
            refreshData()
        } catch (e) { alert("Error en la restauración.") }
    }

    const handleBulkPermanentDelete = async () => {
        if (!confirm("¡ADVERTENCIA! Estos productos se eliminarán de forma PERMANENTE. ¿Continuar?")) return
        try {
            await permanentDeleteManyProducts(selectedProducts)
            setSelectedProducts([])
            refreshData()
        } catch (e) { alert("Error en la eliminación permanente.") }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Mover producto a la papelera?")) return
        await deleteProduct(id)
        refreshData()
    }

    const handleRestore = async (id: string) => {
        await restoreProduct(id)
        refreshData()
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm("¿ELIMINAR PERMANENTEMENTE?")) return
        await permanentDeleteProduct(id)
        refreshData()
    }

    return (
        <div className="space-y-12 pb-32 relative z-10">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 border-b border-slate-200/85 pb-8 relative z-10">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center space-x-2 mb-2 text-blue-600 font-semibold">
                        <ShoppingBag size={18} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">MÓDULO DE CATÁLOGO</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                        Catálogo General
                    </h1>
                </motion.div>
                <div className="flex gap-4">
                    {session?.user?.role === "ADMIN" && (
                        <button 
                            onClick={() => { setEditingProduct(null); setView(view === 'list' ? 'add' : 'list') }}
                            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all duration-300 shadow-sm hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)] flex items-center gap-2"
                        >
                            <Plus size={16} />
                            <span>{view === 'list' ? "Subir Producto" : "Volver al Listado"}</span>
                        </button>
                    )}
                </div>
            </header>

            {view === 'list' ? (
                <div className="space-y-10 animate-in fade-in duration-700">
                    <div className="flex gap-2 p-1.5 bg-slate-100/80 border border-slate-200/60 rounded-2xl w-fit backdrop-blur-md overflow-x-auto custom-scrollbar shadow-inner">
                        {['products', 'suppliers', 'prices_list', 'catalogs', 'settings']
                            .filter(tab => session?.user?.role === "ADMIN" || tab === 'prices_list')
                            .map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                                    activeTab === tab 
                                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                                }`}
                            >
                                {tab === 'products' ? 'Inventario' : 
                                 tab === 'suppliers' ? 'Proveedores' : 
                                 tab === 'prices_list' ? 'Lista Precios' : 
                                 tab === 'catalogs' ? 'Categorías' : 'Ajustes'}
                            </button>
                        ))}
                    </div>

                    
                {activeTab === 'suppliers' && (
                    <SupplierManager 
                        providers={metadata.providersList || []}
                        providerStats={providerStats}
                        settings={storeSettings}
                        onUpdateSettings={setStoreSettings}
                        onFilterProvider={(provider) => {
                            setDashboardSearch(provider)
                            setActiveTab('products')
                        }}
                    />
                )}
                
                {activeTab === 'prices_list' && (
                    <div className="w-full animate-in fade-in duration-500">
                        <PriceListManager isAdmin={session?.user?.role === 'ADMIN'} />
                    </div>
                )}

                {activeTab === 'products' && (
                        <div className="space-y-8 animate-in fade-in duration-700">
                            {/* Modern Stats Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 relative z-10">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200/80 p-6 flex items-center gap-5 rounded-2xl relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-[4px] h-full bg-blue-500"></div>
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-all duration-500"><ShoppingBag size={24} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Artículos</p>
                                        <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{totalProducts}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200/80 p-6 flex items-center gap-5 rounded-2xl relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-[4px] h-full bg-indigo-500"></div>
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-all duration-500"><TagIcon size={24} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Categorías</p>
                                        <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{metadata.categories.length}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200/80 p-6 flex items-center gap-5 rounded-2xl relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-[4px] h-full bg-violet-500"></div>
                                    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:scale-105 transition-all duration-500"><Globe size={24} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proveedores</p>
                                        <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{providerStats.length}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border border-slate-200/80 p-6 flex items-center gap-5 rounded-2xl relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-[4px] h-full bg-emerald-500"></div>
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-all duration-500"><CheckCircle size={24} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">En Stock</p>
                                        <h4 className="text-2xl font-extrabold text-emerald-600 tracking-tight">{totalInStock.toLocaleString()}</h4>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                                {/* Sidebar: Insights & Maintenance */}
                                <div className="lg:col-span-1 space-y-6 sticky top-32">
                                    <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                                        <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5 mb-5">
                                            <Store size={18} className="text-blue-500" />
                                            <h3 className="text-xs font-bold text-slate-800">Distribución por Proveedor</h3>
                                        </div>
                                        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                            {providerStats.length > 0 ? providerStats.map((s, i) => (
                                                <div key={i} className="flex justify-between items-center group cursor-default p-2.5 hover:bg-slate-50 transition-all rounded-xl border border-transparent hover:border-slate-100">
                                                    <span className="text-xs font-semibold text-slate-600 truncate pr-3 group-hover:text-blue-600 transition-colors">{s.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-800 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-full shadow-sm">{s.count} <span className="opacity-55 ml-0.5 font-normal text-[9px]">uds</span></span>
                                                </div>
                                            )) : (
                                                <div className="text-xs text-slate-400 font-semibold text-center py-16 flex flex-col items-center gap-3">
                                                    <RefreshCw size={24} className="animate-spin opacity-45" />
                                                    Sincronizando proveedores...
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-5 border-t border-slate-100 mt-5">
                                            <button 
                                                onClick={() => setActiveTab('settings')}
                                                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <span>Configuración general</span> <ChevronRight size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                                        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-100">
                                            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Trash2 size={18} /></div>
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-800">Limpieza de Catálogo</h3>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Herramientas de mantenimiento</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                                                <p className="text-xs font-semibold text-rose-800 mb-1">Eliminar Duplicados</p>
                                                <p className="text-[10px] text-rose-600 leading-relaxed mb-2">Detecta y elimina artículos con el mismo SKU o nombre exacto.</p>
                                                <button
                                                    onClick={async () => {
                                                        if(confirm("¿Eliminar todos los artículos duplicados del catálogo? Esta acción no se puede deshacer.")) {
                                                            setIsCleaning(true);
                                                            try {
                                                                await cleanupDuplicateProducts();
                                                                await refreshData();
                                                                alert("Catálogo limpiado correctamente.");
                                                            } finally {
                                                                setIsCleaning(false);
                                                            }
                                                        }
                                                    }}
                                                    disabled={isCleaning}
                                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 text-xs font-bold transition-all rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 size={12}/>
                                                    {isCleaning ? 'Limpiando...' : 'Limpiar Ahora'}
                                                </button>
                                            </div>
                                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                                <p className="text-xs font-semibold text-amber-800 mb-1">Papelera</p>
                                                <p className="text-[10px] text-amber-600 leading-relaxed mb-2">Ver artículos eliminados pendientes de revisión o borrado permanente.</p>
                                                <button
                                                    onClick={() => setIsTrashView(!isTrashView)}
                                                    className={`w-full py-2 text-xs font-bold transition-all rounded-lg flex items-center justify-center gap-2 ${
                                                        isTrashView 
                                                            ? 'bg-amber-600 text-white hover:bg-amber-700' 
                                                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                    }`}
                                                >
                                                    <Trash size={12}/>
                                                    {isTrashView ? 'Ver Catálogo Normal' : 'Ver Papelera'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content: Search & Table */}
                                <div className="lg:col-span-3 space-y-8 relative z-10">
                                    <div className="flex flex-col md:flex-row gap-4 items-center bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-[4px] h-full bg-blue-500 transition-all"></div>
                                        <div className="flex-1 relative group w-full">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                            <input 
                                                type="text"
                                                placeholder="Buscar por SKU, nombre o proveedor..."
                                                value={dashboardSearch}
                                                onChange={(e) => { setDashboardSearch(e.target.value); setCurrentPage(1); }}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="flex-shrink-0 w-full md:w-auto">
                                            <select 
                                                value={selectedProvider} 
                                                onChange={(e) => { setSelectedProvider(e.target.value); setCurrentPage(1); }}
                                                className="w-full md:w-auto bg-slate-50 border border-slate-200 px-4 py-3.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all rounded-xl appearance-none cursor-pointer pr-10"
                                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\' stroke-width=\'2.5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.8em' }}
                                            >
                                                <option value="">TODOS LOS PROVEEDORES</option>
                                                {providerStats.map(s => <option key={s.name} value={s.name}>{s.name.toUpperCase()} ({s.count})</option>)}
                                            </select>
                                        </div>
                                        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl w-full md:w-fit whitespace-nowrap shadow-inner">
                                            <button 
                                                onClick={() => { setIsTrashView(false); setCurrentPage(1); }}
                                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${!isTrashView ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                Activo
                                            </button>
                                            <button 
                                                onClick={() => { setIsTrashView(true); setCurrentPage(1); }}
                                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${isTrashView ? 'bg-red-550 text-red-600 shadow-sm border border-red-200/50' : 'text-slate-500 hover:text-red-600'}`}
                                            >
                                                <Trash2 size={13} /> Papelera
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden relative">
                                        <div className="overflow-x-auto custom-scrollbar">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50/60 text-[11px] font-bold text-slate-500 border-b border-slate-200/60">
                                                        <th className="px-6 py-4 w-16">
                                                            <button onClick={toggleAllProducts} className="text-slate-400 hover:text-blue-500 transition-colors">
                                                                {selectedProducts.length === products.length && products.length > 0 ? <CheckSquare size={18} className="text-blue-600 shadow-sm" /> : <Square size={18} />}
                                                            </button>
                                                        </th>
                                                        <th className="px-6 py-4">Artículo</th>
                                                        <th className="px-6 py-4 w-32">Proveedor</th>
                                                        <th className="px-6 py-4 w-28">Stock</th>
                                                        <th className="px-6 py-4 w-52">Precios (Costo/ROI/PVP)</th>
                                                        <th className="px-6 py-4 text-right pr-8">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white">
                                                    {products.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="py-24 text-center">
                                                                <div className="flex flex-col items-center space-y-4 opacity-30 group">
                                                                    <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl group-hover:scale-105 transition-transform duration-500">
                                                                        <ShoppingBag size={48} className="text-slate-400" />
                                                                    </div>
                                                                    <p className="text-xs font-semibold text-slate-400">Cámara de Inventario Vacía</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        products.map((p) => (
                                                            <tr key={p.id} className={`hover:bg-slate-50/30 border-b border-slate-100 transition-colors group ${selectedProducts.includes(p.id) ? 'bg-blue-50/5' : ''}`}>
                                                                <td className="px-6 py-4">
                                                                    <button 
                                                                        onClick={() => toggleProductSelection(p.id)} 
                                                                        className={`transition-all duration-300 ${selectedProducts.includes(p.id) ? 'text-blue-600 scale-105 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]' : 'text-slate-350 hover:text-slate-500'}`}
                                                                    >
                                                                        {selectedProducts.includes(p.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                                                    </button>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div 
                                                                            onClick={() => {
                                                                                if (p.images && p.images !== 'null' && safeParseArray(p.images).length > 0) {
                                                                                    setPreviewImages({ urls: safeParseArray(p.images), title: p.name });
                                                                                }
                                                                            }}
                                                                            className={`w-12 h-12 bg-slate-55 border border-slate-200/60 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative group-hover:border-blue-500/30 transition-all shadow-sm ${p.images && p.images !== 'null' && safeParseArray(p.images).length > 0 ? 'cursor-pointer' : ''}`}
                                                                        >
                                                                            {p.images && p.images !== 'null' && safeParseArray(p.images).length > 0 ? (
                                                                                <img src={safeParseArray(p.images)[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550" />
                                                                            ) : (
                                                                                <ImageIcon size={18} className="text-slate-400" />
                                                                            )}
                                                                        </div>
                                                                        <div className="max-w-md">
                                                                            <p 
                                                                                onClick={() => setPreviewDescription({ title: p.name, description: p.description || 'Sin descripción detallada.', sku: p.sku || 'N/A' })}
                                                                                className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors mb-1 cursor-pointer hover:underline"
                                                                            >
                                                                                {p.name}
                                                                            </p>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-[10px] text-slate-450 font-mono font-medium">{p.sku || 'N/A'}</span>
                                                                                {p.featured && <span className="bg-yellow-50 text-yellow-600 text-[9px] font-bold px-1.5 py-0.5 border border-yellow-200/60 rounded">DESTACADO</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-bold rounded-full border border-slate-200/60 bg-slate-50 text-slate-650">
                                                                        {p.provider || 'Sin Proveedor'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]' : (p.stock < 50 ? 'bg-yellow-500' : 'bg-emerald-500')}`}></div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-slate-800">{p.stock} <span className="text-[10px] text-slate-400 font-normal">uds</span></p>
                                                                            <p className="text-[9px] text-slate-400">Disp. Inmediata</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-col gap-0.5 w-44 font-medium text-[11px]">
                                                                        {p.isConsultOnly ? (
                                                                            <div className="flex flex-col items-center justify-center p-3 mt-1 bg-slate-100 rounded-xl text-slate-500 font-bold border border-slate-200 w-full shadow-inner">
                                                                                <span className="text-[10px] uppercase tracking-wider mb-0.5">Precio</span>
                                                                                <span className="text-sm text-slate-700">Consultar</span>
                                                                            </div>
                                                                        ) : (() => {
                                                                            const price = parseFloat(p.price) || 0;
                                                                            const cost = p.compareAtPrice || (price / 1.20);
                                                                            const margin = price - cost;
                                                                            const marginPercent = cost > 0 ? (margin / cost) * 100 : 0;
                                                                            return (
                                                                                <>
                                                                                    <div className="flex items-center justify-between text-slate-400">
                                                                                        <span>Costo:</span> <span className="text-slate-600 font-semibold">${cost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center justify-between text-emerald-600">
                                                                                        <span>ROI ({marginPercent.toFixed(0)}%):</span> <span className="font-semibold">+${margin.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center justify-between font-bold text-blue-600 border-t border-slate-100 pt-0.5 mt-0.5">
                                                                                        <span>PVP:</span> <span>${price.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        })()}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-right pr-8">
                                                                    <div className="flex items-center justify-end gap-2.5">
                                                                        {isTrashView ? (
                                                                            <button 
                                                                                onClick={() => handleRestore(p.id)}
                                                                                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 transition-all text-xs font-semibold rounded-lg shadow-sm"
                                                                            >
                                                                                Restaurar
                                                                            </button>
                                                                        ) : (
                                                                            <>
                                                                                <button 
                                                                                    onClick={() => { setEditingProduct(p); setView('edit'); }}
                                                                                    className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all rounded-lg border border-slate-200/60 shadow-sm active:scale-95 group/btn"
                                                                                >
                                                                                    <Edit size={15} className="group-hover/btn:rotate-12 transition-transform" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={async () => {
                                                                                        await toggleProductFeatured(p.id, !p.featured)
                                                                                        refreshData()
                                                                                    }}
                                                                                    className={`p-2.5 transition-all rounded-lg border shadow-sm active:scale-95 ${
                                                                                        p.featured 
                                                                                            ? 'bg-yellow-50 border-yellow-250 text-yellow-600 hover:bg-yellow-100'
                                                                                            : 'bg-slate-50 border-slate-200/60 text-slate-400 hover:bg-yellow-50 hover:text-yellow-500'
                                                                                    }`}
                                                                                    title={p.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                                                                                >
                                                                                    <Star size={15} />
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => handleDelete(p.id)}
                                                                                    className="p-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all rounded-lg border border-rose-200/60 shadow-sm active:scale-95 group/del"
                                                                                >
                                                                                    <Trash2 size={15} className="group-hover/del:scale-105 transition-transform" />
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
 
                                        {/* Futuristic Pagination */}
                                        <div className="px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-4">
                                            <p className="text-xs font-semibold text-slate-500">Página {currentPage} / {Math.ceil(totalProducts / pageSize) || 1} <span className="text-slate-350 mx-2">|</span> Total {totalProducts} artículos</p>
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    disabled={currentPage <= 1}
                                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 disabled:opacity-30 transition-all font-semibold text-xs rounded-xl active:scale-95 shadow-sm"
                                                >
                                                    <span>Anterior</span>
                                                </button>
                                                <button 
                                                    disabled={currentPage >= Math.ceil(totalProducts / pageSize)}
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-650 hover:text-slate-800 disabled:opacity-30 transition-all font-semibold text-xs rounded-xl active:scale-95 shadow-sm"
                                                >
                                                    <span>Siguiente</span>
                                                </button>
                                            </div>
                                        </div>                         </div>
                                    </div>

                                    {/* Elevated Bulk Actions Bar */}
                                    {selectedProducts.length > 0 && (
                                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200/80 text-slate-800 px-6 py-4 flex items-center justify-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[500] animate-in slide-in-from-bottom-6 duration-500 rounded-2xl backdrop-blur-md">
                                            <div className="flex items-center space-x-4 border-r border-slate-100 pr-5">
                                                <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">{selectedProducts.length}</div>
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seleccionados</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {!isTrashView ? (
                                                    <>
                                                        <button 
                                                            onClick={() => setShowBulkEdit(true)}
                                                            className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 py-2.5 text-xs font-bold transition-all rounded-xl border border-blue-100/50 shadow-sm active:scale-95"
                                                        >
                                                            <Edit size={14} className="text-blue-500" />
                                                            <span>Edición Táctica</span>
                                                        </button>
                                                        <button 
                                                            onClick={handleBulkDeleteProducts}
                                                            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2.5 text-xs font-bold transition-all rounded-xl border border-red-100/50 shadow-sm active:scale-95"
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Eliminar</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={handleBulkRestore}
                                                            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 px-4 py-2.5 text-xs font-bold transition-all rounded-xl border border-emerald-100/50 shadow-sm active:scale-95"
                                                        >
                                                            <Layers size={14} />
                                                            <span>Restaurar</span>
                                                        </button>
                                                        <button 
                                                            onClick={handleBulkPermanentDelete}
                                                            className="flex items-center gap-2 bg-red-550/10 text-red-650 hover:bg-red-650 hover:text-white px-4 py-2.5 text-xs font-bold transition-all rounded-xl border border-red-500/20 shadow-sm active:scale-95"
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Eliminar Permanente</span>
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => setSelectedProducts([])}
                                                    className="p-2 hover:bg-slate-100 hover:text-slate-800 text-slate-400 rounded-xl transition-colors active:scale-95"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {showBulkEdit && (
                                        <BulkEditModal 
                                            selectedCount={selectedProducts.length}
                                            categories={metadata.categories}
                                            collections={metadata.collections}
                                            onClose={() => setShowBulkEdit(false)}
                                            onSave={handleBulkEdit}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'catalogs' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {/* Quick Category/Collection Creation */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                                <QuickCreate
                                    label="Arquitectura de Categoría"
                                    icon={<TagIcon size={18} className="text-blue-500" />}
                                    onSave={async (name) => { await createCategory(name); refreshData(); }}
                                />
                                <QuickCreate
                                    label="Definición de Colección"
                                    icon={<Layers size={18} className="text-violet-500" />}
                                    onSave={async (name) => { await createCollection(name); refreshData(); }}
                                />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                                    <h3 className="text-xs font-bold text-slate-800 mb-6 border-b border-slate-100 pb-5 flex items-center gap-2">
                                        <TagIcon size={16} className="text-blue-500" />
                                        <span>Jerarquía de Categorías</span>
                                    </h3>
                                    <ul className="space-y-3">
                                        {metadata.categories.map(c => (
                                            <li key={c.id} className="flex justify-between items-center p-4 bg-slate-50/50 hover:bg-slate-50 transition-all group rounded-xl border border-slate-200/60 hover:border-blue-500/20">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{c.name}</span>
                                                    <span className="text-xs text-slate-400 font-medium">/ {c.slug}</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                    <button onClick={() => setEditingTaxonomy({ type: 'category', data: c })} className="p-2 text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                                                        <Edit size={14} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-5">
                                        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                            <Layers size={16} className="text-violet-500" />
                                            <span>Colecciones Estratégicas</span>
                                        </h3>
                                        {selectedCollections.length > 0 && (
                                            <button 
                                                onClick={handleBulkDeleteCollections}
                                                className="flex items-center space-x-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold transition-all shadow-sm"
                                            >
                                                <Trash2 size={13} />
                                                <span>Eliminar ({selectedCollections.length})</span>
                                            </button>
                                        )}
                                    </div>
                                    <ul className="space-y-3">
                                        {metadata.collections.length === 0 ? (
                                            <div className="py-16 text-center opacity-30 flex flex-col items-center gap-3">
                                                <Layers size={36} className="text-slate-400" />
                                                <p className="text-xs font-semibold text-slate-400">Sin Colecciones Definidas</p>
                                            </div>
                                        ) : (
                                            metadata.collections.map(c => {
                                                const productCount = products.filter(p => p.collectionId === c.id).length;
                                                const isSelected = selectedCollections.includes(c.id);
                                                return (
                                                    <li key={c.id} className={`flex justify-between items-center p-4 transition-all group rounded-xl border ${isSelected ? 'bg-blue-50/30 border-blue-200' : 'bg-slate-50/50 border-slate-200/60 hover:border-blue-500/20 hover:bg-slate-50'}`}>
                                                        <div className="flex items-center space-x-3">
                                                            <button 
                                                                onClick={() => setSelectedCollections(prev => isSelected ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                                                                className={`${isSelected ? 'text-blue-600 scale-105' : 'text-slate-350 hover:text-slate-500'} transition-all`}
                                                            >
                                                                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                                            </button>
                                                            <div>
                                                                <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{c.name}</span>
                                                                <div className="flex items-center space-x-2 mt-1">
                                                                    <span className="text-xs text-slate-400 font-medium">/ {c.slug}</span>
                                                                    <span className="text-slate-200 text-xs">•</span>
                                                                    <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                                                                        {productCount} artículos
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                            <button 
                                                                onClick={() => setEditingTaxonomy({ type: 'collection', data: c })}
                                                                className="p-2 text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteCollection(c.id)}
                                                                className="p-2 text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-200 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {editingTaxonomy && (
                        <TaxonomyModal
                            type={editingTaxonomy.type}
                            initialData={editingTaxonomy.data}
                            allProducts={products}
                            onClose={() => setEditingTaxonomy(null)}
                            onSaved={() => { setEditingTaxonomy(null); refreshData(); }}
                        />
                    )}

                    {/* IMAGE GALLERY MODAL */}
                    <AnimatePresence>
                        {previewImages && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                                onClick={() => setPreviewImages(null)}
                            >
                                <motion.div 
                                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                                    onClick={e => e.stopPropagation()}
                                    className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col relative"
                                >
                                    <div className="flex justify-between items-center p-4 border-b border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-800 line-clamp-1 pr-8">{previewImages.title}</h3>
                                        <button onClick={() => setPreviewImages(null)} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-all">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="p-4 flex-1 overflow-y-auto bg-slate-50/50 flex flex-wrap gap-4 justify-center items-start custom-scrollbar">
                                        {previewImages.urls.map((url, i) => (
                                            <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200/60 shadow-sm bg-white max-w-sm w-full">
                                                <img src={url} alt={`Imagen ${i+1}`} className="w-full h-auto object-contain max-h-[500px]" />
                                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-300 flex items-start justify-end p-3 opacity-0 group-hover:opacity-100">
                                                    <a 
                                                        href={url} 
                                                        download={`imagen-${i+1}.jpg`} 
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 bg-white text-slate-800 hover:text-blue-600 rounded-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DESCRIPTION MODAL */}
                    <AnimatePresence>
                        {previewDescription && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                                onClick={() => setPreviewDescription(null)}
                            >
                                <motion.div 
                                    initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
                                    onClick={e => e.stopPropagation()}
                                    className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl flex flex-col relative"
                                >
                                    <div className="flex justify-between items-start p-5 border-b border-slate-100 bg-slate-50/50">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-800 pr-8 leading-tight">{previewDescription.title}</h3>
                                            <p className="text-[10px] text-slate-500 font-mono mt-1">SKU: {previewDescription.sku}</p>
                                        </div>
                                        <button onClick={() => setPreviewDescription(null)} className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all shadow-sm">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                                        <div className="prose prose-sm prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: previewDescription.description }} />
                                    </div>
                                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${previewDescription.title}\n\n${previewDescription.description.replace(/<[^>]*>?/gm, '')}`);
                                                alert("¡Descripción copiada!");
                                            }}
                                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2"
                                        >
                                            <Copy size={14} />
                                            <span>Copiar al portapapeles</span>
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <ProductForm
                    initialData={editingProduct}
                    metadata={metadata}
                    onCancel={() => { setView('list'); setEditingProduct(null); }}
                    onSaved={() => { setView('list'); setEditingProduct(null); refreshData(); }}
                />
            )}
        </div>
    )
}

function QuickCreate({ label, icon, onSave }: { label: string, icon: any, onSave: (name: string) => void }) {
    const [name, setName] = useState('')
    return (
        <div className="space-y-4">
            <label className="text-xs font-semibold text-slate-500 flex items-center space-x-2 ml-1">
                {icon} <span>{label}</span>
            </label>
            <div className="flex gap-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Escriba el nombre..."
                    className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all rounded-xl placeholder:text-slate-400"
                />
                <button
                    onClick={() => { if (name) { onSave(name); setName(''); } }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 text-xs font-semibold rounded-xl shadow-sm active:scale-95 transition-all"
                >
                    Agregar
                </button>
            </div>
        </div>
    )
}

// ==============================================
// BannerConfigPanel Component
// ==============================================
function BannerConfigPanel({ bannerKey, label, icon, accentColor, data, allProducts, onChange }: { 
    bannerKey: string, 
    label: string, 
    icon: any, 
    accentColor: 'secondary' | 'primary' | 'purple', 
    data: any, 
    allProducts: any[], 
    onChange: (d: any) => void 
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [showProductPicker, setShowProductPicker] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [searching, setSearching] = useState(false)

    const selectedProductIds: string[] = data.productIds || []

    const accentMap: Record<string, string> = {
        secondary: 'border-secondary/30 text-secondary shadow-secondary/5',
        primary: 'border-primary/30 text-primary shadow-primary/5',
        purple: 'border-purple-500/30 text-purple-500 shadow-purple-500/5'
    }

    const dotMap: Record<string, string> = {
        secondary: 'bg-secondary',
        primary: 'bg-primary',
        purple: 'bg-purple-500',
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('bannerKey', bannerKey)
            const res = await fetch('/api/shop/upload', { method: 'POST', body: fd })
            const json = await res.json()
            if (json.url) onChange({ ...data, imageUrl: json.url })
            else alert('Error al subir imagen')
        } catch {
            alert('Error al subir imagen')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    useEffect(() => {
        if (searchTerm.length < 2) { setSearchResults([]); return }
        const t = setTimeout(async () => {
            setSearching(true)
            try {
                const r = await searchProductsForTaxonomy(searchTerm)
                setSearchResults(r)
            } finally { setSearching(false) }
        }, 400)
        return () => clearTimeout(t)
    }, [searchTerm])

    const toggleProduct = (p: any) => {
        const ids: string[] = data.productIds || []
        const has = ids.includes(p.id)
        onChange({ ...data, productIds: has ? ids.filter((id: string) => id !== p.id) : [...ids, p.id] })
    }

    const displayList = searchTerm.length >= 2 ? searchResults : allProducts.slice(0, 40)

    return (
        <div className={`bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm transition-all duration-300 relative overflow-hidden group ${accentMap[accentColor] || accentMap.secondary}`}>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${dotMap[accentColor] || dotMap.secondary} shadow-[0_0_8px_currentColor]`}></div>
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-105 transition-transform duration-500 text-slate-500">
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-800">{label}</h4>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Gestión Hero Unit</p>
                    </div>
                </div>
                <Toggle
                    label=""
                    icon=""
                    checked={data.active ?? true}
                    onChange={(v) => onChange({ ...data, active: v })}
                />
            </div>

            <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Etiqueta de Origen Visual</label>
                    {data.imageUrl ? (
                        <div className="relative group/img overflow-hidden rounded-xl border border-slate-200 aspect-video shadow-sm">
                            <img src={data.imageUrl} alt="Banner" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-550" />
                            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95"
                                >
                                    {uploading ? 'Subiendo...' : 'Reemplazar'}
                                </button>
                                <button
                                    onClick={() => onChange({ ...data, imageUrl: '' })}
                                    className="text-red-450 hover:text-red-500 text-[11px] font-semibold transition-colors"
                                >
                                    Liberar Anclaje
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full border-2 border-dashed border-slate-200 py-10 flex flex-col items-center gap-3 hover:border-blue-500/30 hover:bg-blue-50/10 transition-all group/upload rounded-2xl"
                        >
                            <div className="p-3 bg-slate-50 text-slate-405 group-hover/upload:text-blue-500 rounded-xl group-hover/upload:scale-105 transition-all">
                                <Upload size={24} />
                            </div>
                            <span className="text-xs font-semibold text-slate-500 group-hover/upload:text-blue-600 transition-colors">
                                {uploading ? 'Sincronizando...' : 'Subir Recurso Visual'}
                            </span>
                        </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <div className="space-y-1">
                        <input
                            type="text"
                            value={data.imageUrl || ''}
                            onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
                            placeholder="Vincular dirección remota (URL)..."
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-mono text-slate-650 outline-none focus:border-blue-500 focus:bg-white transition-all rounded-xl placeholder:text-slate-450"
                        />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Narrativa de Impacto</label>
                    <input
                        type="text"
                        value={data.title || ''}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="Encabezado comercial..."
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all rounded-xl placeholder:text-slate-400"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Argumento de Venta</label>
                    <textarea
                        rows={2}
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        placeholder="Breve descripción..."
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-700 outline-none resize-none focus:border-blue-500 focus:bg-white transition-all rounded-xl leading-relaxed placeholder:text-slate-400"
                    />
                </div>

                {/* Products for gallery */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-semibold text-slate-500">
                            Ecosistema de Productos
                        </label>
                        <span className="bg-blue-50 text-blue-600 border border-blue-150 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {selectedProductIds.length} Núcleos
                        </span>
                    </div>
                    <button
                        onClick={() => setShowProductPicker(v => !v)}
                        className="w-full border border-slate-200 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2 group/picker bg-slate-50/50 hover:bg-slate-50"
                    >
                        <Box size={14} className="group-hover/picker:text-blue-500 transition-colors" /> 
                        <span>{showProductPicker ? 'Aceptar Selección' : 'Desplegar Selector'}</span>
                    </button>

                    {showProductPicker && (
                        <div className="animate-in slide-in-from-top-4 duration-500 bg-white shadow-lg rounded-xl border border-slate-200 overflow-hidden">
                            <div className="relative group/search p-3 border-b border-slate-100">
                                <Search size={12} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all rounded-lg placeholder:text-slate-400"
                                />
                                {searching && <RefreshCw size={12} className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />}
                            </div>
                            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                                {displayList.map((p: any) => {
                                    const sel = selectedProductIds.includes(p.id)
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => toggleProduct(p)}
                                            className={`w-full flex items-center justify-between p-3 transition-all hover:bg-slate-50 group/item ${sel ? 'bg-blue-50/20' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden border border-slate-200/60 flex items-center justify-center">
                                                    {safeParseArray(p.images).length > 0 ? (
                                                        <img src={safeParseArray(p.images)[0]} className="w-full h-full object-cover scale-105 group-hover/item:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <ImageIcon size={14} className="text-slate-450" />
                                                    )}
                                                </div>
                                                <div className="text-left max-w-[150px]">
                                                    <span className="text-xs font-semibold text-slate-800 line-clamp-1 block group-hover/item:text-blue-600 transition-colors">{p.name}</span>
                                                    <span className="text-[10px] font-mono text-slate-450 block">{p.sku || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className={`transition-all duration-300 ${sel ? 'text-blue-600 scale-105' : 'text-slate-350 hover:text-slate-450'}`}>
                                                {sel ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </div>
                                        </button>
                                    )
                                })}
                                {displayList.length === 0 && (
                                    <p className="text-center py-8 text-xs font-semibold text-slate-400">Sin Coincidencias</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Selected pills */}
                    {selectedProductIds.length > 0 && !showProductPicker && (
                        <div className="flex flex-wrap gap-1.5 pt-3">
                            {selectedProductIds.slice(0, 5).map((id: string) => {
                                const p = allProducts.find((pr: any) => pr.id === id)
                                return p ? (
                                    <span key={id} className="bg-slate-50 border border-slate-200 text-slate-650 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-2 hover:bg-blue-50 hover:border-blue-150 hover:text-blue-600 transition-all">
                                        <span className="truncate max-w-[80px]">{p.name}</span>
                                        <button onClick={() => toggleProduct(p)} className="text-slate-450 hover:text-red-500 transition-colors"><X size={10} /></button>
                                    </span>
                                ) : null
                            })}
                            {selectedProductIds.length > 5 && (
                                <span className="text-[10px] font-bold text-slate-450 flex items-center px-1">+{selectedProductIds.length - 5} Adicionales</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
// ==============================================
// End BannerConfigPanel Component
// ==============================================

function StatCard({ label, value, icon }: { label: string, value: any, icon: any }) {
    return (
        <div className="glass-panel p-6 rounded-none-[2rem] border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-all duration-700"></div>
            <div className="flex items-center space-x-3 text-slate-500 mb-4">
                <div className="p-2 bg-white/5 rounded-none group-hover:text-primary transition-colors">
                    {icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">{label}</span>
            </div>
            <p className="text-3xl font-black text-white tracking-tighter italic">{value}</p>
        </div>
    )
}

function ProductForm({ initialData, metadata, onCancel, onSaved }: { initialData?: any, metadata: any, onCancel: () => void, onSaved: () => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        compareAtPrice: initialData?.compareAtPrice || '',
        sku: initialData?.sku || '',
        categoryId: initialData?.categoryId || '',
        collectionId: initialData?.collectionId || '',
        stock: initialData?.stock || '0',
        isActive: initialData?.isActive ?? true,
        isConsultOnly: initialData?.isConsultOnly ?? false,
        featured: initialData?.featured ?? false,
        specSheetUrl: initialData?.specSheetUrl || '',
        keywords: initialData?.keywords || '',
        images: initialData?.images || '[]',
        specs: initialData?.specs || '[]',
        provider: initialData?.provider || '',
    })

    const [techSpecs, setTechSpecs] = useState<{ label: string, value: string }[]>(
        initialData?.specs ? safeParseArray(initialData.specs, [
            { label: 'Marca', value: 'ATOMIC' },
            { label: 'Modelo', value: '' }
        ]) : [
            { label: 'Marca', value: 'ATOMIC' },
            { label: 'Modelo', value: '' }
        ]
    )

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await saveProduct({
                ...formData,
                specs: JSON.stringify(techSpecs)
            })
            onSaved()
        } catch (error) {
            alert("Error al guardar el producto")
        } finally {
            setLoading(false)
        }
    }

    const addSpec = () => setTechSpecs([...techSpecs, { label: '', value: '' }])
    const removeSpec = (index: number) => setTechSpecs(techSpecs.filter((_, i) => i !== index))

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center bg-slate-950/40 p-8 rounded-none-[2.5rem] border border-white/5 backdrop-blur-3xl">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-none border border-secondary/20">
                        <Box size={24} className="text-secondary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white italic">
                            {formData.id ? 'Refactorización de Activo' : 'Creación de Nueva Entidad'}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Configuración técnica de especificaciones comerciales</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={onCancel} className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-none border border-white/5">Descartar</button>
                    <button onClick={handleSubmit} disabled={loading} className="bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all rounded-none shadow-2xl shadow-white/5 flex items-center gap-3">
                        <Save size={16} />
                        <span>{loading ? 'Sincronizando...' : 'Consolidar Cambios'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

                {/* Main Info Column */}
                <div className="xl:col-span-2 space-y-12">
                    <section className="glass-panel p-10 rounded-none-[3rem] border-white/5 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                        <div className="flex items-center space-x-4 border-b border-white/5 pb-8">
                            <LayoutGrid size={20} className="text-secondary" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Manifiesto Técnico Principal</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Denominación del Activo</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="IDENTIFICADOR COMERCIAL..."
                                className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-sm font-black uppercase tracking-widest text-white outline-none focus:border-secondary transition-all rounded-none placeholder:text-slate-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">ID Operativo (SKU)</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    placeholder="SERIAL-CODE..."
                                    className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-sm font-black text-white outline-none focus:border-secondary transition-all rounded-none placeholder:text-slate-800"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Proveedor / Origen</label>
                                <input
                                    type="text"
                                    value={formData.provider}
                                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                    placeholder="EJ: STEREN..."
                                    className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-sm font-black text-white outline-none focus:border-secondary transition-all rounded-none placeholder:text-slate-800"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Valor Actual (USD)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary font-black bg-slate-900 pr-2">$</div>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full bg-slate-900 border border-white/5 pl-12 pr-8 py-6 text-sm font-black text-secondary outline-none focus:border-secondary transition-all rounded-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 text-wrap">Referencial Anterior</label>
                                <input
                                    type="number"
                                    value={formData.compareAtPrice}
                                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-sm font-black text-slate-600 outline-none focus:border-white/20 transition-all line-through rounded-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-900 border border-white/5 p-6 mt-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isConsultOnly: !formData.isConsultOnly })}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isConsultOnly ? 'bg-secondary' : 'bg-slate-700'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isConsultOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <div>
                                <h4 className="text-sm font-black text-white">Modo Consultar Precio</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Oculta el PVP y muestra "Consultar" en la tienda.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Narrativa del Producto</label>
                            <textarea
                                rows={8}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="ESPECIFICACIONES NARRATIVAS Y ARGUMENTO DE VENTA..."
                                className="w-full bg-slate-900 border border-white/5 px-8 py-8 text-xs font-bold text-slate-300 outline-none resize-none focus:border-secondary transition-all rounded-none-[2.5rem] leading-relaxed placeholder:text-slate-800 italic"
                            />
                        </div>
                    </section>

                    <section className="glass-panel p-10 rounded-none-[3rem] border-white/5 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                        <div className="flex items-center space-x-4 border-b border-white/5 pb-8">
                                    <FileText size={20} className="text-primary" />
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Gestión de Ficha Técnica</h2>
                                </div>

                        <div className="space-y-6">
                            {techSpecs.map((spec, index) => (
                                <div key={index} className="flex gap-6 animate-in slide-in-from-left-4 duration-300 items-center">
                                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-none border border-white/5 hover:border-primary/30 transition-all">
                                        <input
                                            type="text"
                                            value={spec.label}
                                            placeholder="Elemento TÉCNICO (Ej: POTENCIA)"
                                            className="bg-transparent border-none px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary outline-none placeholder:text-slate-700"
                                            onChange={(e) => {
                                                const newSpecs = [...techSpecs]
                                                newSpecs[index].label = e.target.value
                                                setTechSpecs(newSpecs)
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={spec.value}
                                            placeholder="VALOR DE SEGMENTO (Ej: 2.5KW)"
                                            className="bg-transparent border-none px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white outline-none placeholder:text-slate-700"
                                            onChange={(e) => {
                                                const newSpecs = [...techSpecs]
                                                newSpecs[index].value = e.target.value
                                                setTechSpecs(newSpecs)
                                            }}
                                        />
                                    </div>
                                    <button onClick={() => removeSpec(index)} className="p-4 text-slate-500 hover:text-red-500 transition-colors bg-white/5 rounded-none border border-white/5">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addSpec}
                                className="w-full border-2 border-dashed border-white/5 py-8 rounded-none-[2rem] text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center space-x-4 bg-white/2 hover:bg-primary/5"
                            >
                                <PlusCircle size={20} /> <span>Añadir Especificación de Segmento</span>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Side Column */}
                <div className="space-y-12">
                    <section className="glass-panel p-10 rounded-none-[3rem] border-white/5 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                        <div className="flex items-center space-x-4 border-b border-white/5 pb-8">
                            <ImageIcon size={20} className="text-secondary" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Galería de Despliegue</h2>
                        </div>

                        <div className="border-4 border-dashed border-white/5 p-16 text-center space-y-6 hover:border-secondary/20 transition-all cursor-pointer group bg-slate-900/30 rounded-none-[3rem]">
                            <div className="bg-secondary/10 w-24 h-24 rounded-none-[2rem] flex items-center justify-center mx-auto group-hover:bg-secondary/20 transition-all border border-secondary/10 group-hover:scale-110 duration-500">
                                <Plus size={40} className="text-secondary" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.3em]">Carga de Activos Visuales</p>
                                <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase tracking-widest leading-relaxed">Arrastra recursos optimizados<br/>para renderizado web</p>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Ficha Técnica PDF</label>
                                <button className="w-full flex items-center justify-between bg-slate-900 border border-white/5 text-white px-8 py-6 rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:border-secondary transition-all shadow-2xl active:scale-95 group">
                                    <span className="group-hover:text-white">Anclaje de Documentación</span>
                                    <FileText size={18} className="text-secondary group-hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="glass-panel p-10 rounded-none-[3rem] border-white/5 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                        <div className="flex items-center space-x-4 border-b border-white/5 pb-8">
                            <Globe size={20} className="text-primary" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Visibilidad & SEO</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Categoría Maestra</label>
                            <div className="relative">
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white outline-none appearance-none cursor-pointer rounded-none focus:border-primary transition-all pr-12"
                                >
                                    <option value="">SIN CATEGORÍA DEFINIDA</option>
                                    {metadata.categories.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Colección Estratégica</label>
                            <div className="relative">
                                <select
                                    value={formData.collectionId}
                                    onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                                    className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white outline-none appearance-none cursor-pointer rounded-none focus:border-primary transition-all pr-12"
                                >
                                    <option value="">SIN COLECCIÓN ASIGNADA</option>
                                    {metadata.collections.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Etiquetas SEO (Etiquetaes)</label>
                            <input
                                type="text"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                placeholder="EJ: INDUSTRIA, AUTOMATIZACIÓN, PRO..."
                                className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 outline-none rounded-none focus:border-primary transition-all placeholder:text-slate-800"
                            />
                        </div>

                        <div className="space-y-10 pt-10 border-t border-white/5">
                            <Toggle
                                label="Disponibilidad Web"
                                icon={<Globe size={18} className="text-secondary" />}
                                checked={formData.isActive}
                                onChange={(v) => setFormData({ ...formData, isActive: v })}
                            />
                            <Toggle
                                label="Activo Destacado"
                                icon={<Star size={18} className="text-yellow-500" />}
                                checked={formData.featured}
                                onChange={(v) => setFormData({ ...formData, featured: v })}
                            />
                        </div>
                    </section>

                    <div className="pt-6">
                        <button 
                            disabled={loading}
                            onClick={handleSubmit} 
                            className="w-full bg-secondary text-white py-8 rounded-none-[2.5rem] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white hover:text-black transition-all shadow-2xl shadow-secondary/20 active:scale-95 duration-500 flex items-center justify-center gap-4 group"
                        >
                            <Save size={24} className="group-hover:scale-110 transition-transform" />
                            <span>{loading ? 'SINCRONIZANDO...' : 'ALINEAR ARCHIVO'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Toggle({ label, checked, onChange, icon }: { label: string, checked: boolean, onChange: (v: boolean) => void, icon: any }) {
    return (
        <div className="flex items-center justify-between gap-6">
            <div className="flex items-center space-x-3 text-slate-400">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-14 h-7 flex items-center px-1.5 transition-all rounded-none border ${checked ? 'bg-secondary border-secondary shadow-lg shadow-secondary/20' : 'bg-slate-900 border-white/10'}`}
            >
                <div className={`w-4 h-4 bg-white shadow-2xl transition-transform duration-300 rounded-none ${checked ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
        </div>
    )
}

function BulkEditModal({ selectedCount, categories, collections, onClose, onSave }: { selectedCount: number, categories: any[], collections: any[], onClose: () => void, onSave: (data: any) => void }) {
    const [data, setData] = useState<any>({
        name: undefined,
        price: undefined,
        stock: undefined,
        isActive: undefined,
        featured: undefined,
        categoryId: undefined,
        collectionId: undefined
    })

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="glass-panel max-w-2xl w-full p-12 rounded-none-[4rem] border-white/5 space-y-12 animate-in zoom-in-95 duration-700 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[120px] -mr-32 -mt-32 rounded-none"></div>
                
                <div className="flex justify-between items-start border-b border-white/5 pb-10">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Gestión de Edición Masiva</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 italic leading-relaxed">Afectando a <span className="text-secondary">{selectedCount}</span> núcleos de activos comerciales en paralelo.</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-none border border-white/5 transition-all active:scale-90 duration-300">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Denominación Unificada</label>
                        <input 
                            type="text"
                            placeholder="MANTENER IDENTIFICADORES ORIGINALES..."
                            className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-secondary transition-all rounded-none placeholder:text-slate-800"
                            onChange={(e) => setData({ ...data, name: e.target.value || undefined })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Nuevo Valor Operativo (USD)</label>
                            <input 
                                type="number"
                                placeholder="SIN CAMBIOS"
                                className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-sm font-black text-secondary outline-none focus:border-secondary transition-all rounded-none placeholder:text-slate-800"
                                onChange={(e) => setData({ ...data, price: e.target.value || undefined })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Capacidad de Stock</label>
                            <input 
                                type="number"
                                placeholder="SIN CAMBIOS"
                                className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-sm font-black text-primary outline-none focus:border-primary transition-all rounded-none placeholder:text-slate-800"
                                onChange={(e) => setData({ ...data, stock: e.target.value || undefined })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Reasignar Categoría</label>
                            <select 
                                className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-white/20 transition-all rounded-none appearance-none"
                                onChange={(e) => setData({ ...data, categoryId: e.target.value || undefined })}
                            >
                                <option value="">SIN CAMBIOS</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Flujo de Colección</label>
                            <select 
                                className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-white/20 transition-all rounded-none appearance-none"
                                onChange={(e) => setData({ ...data, collectionId: e.target.value || undefined })}
                            >
                                <option value="">SIN CAMBIOS</option>
                                <option value="none">LIBERAR DE TODAS</option>
                                {collections.map(c => (
                                    <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="glass-panel p-8 rounded-none-[2.5rem] border-white/10 flex flex-col justify-center gap-4 bg-slate-950/40">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Visibilidad Estratégica</span>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setData({ ...data, isActive: true })}
                                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${data.isActive === true ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}
                                > Activar </button>
                                <button 
                                    onClick={() => setData({ ...data, isActive: false })}
                                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${data.isActive === false ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}
                                > Inactivar </button>
                                <button 
                                    onClick={() => setData({ ...data, isActive: undefined })}
                                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${data.isActive === undefined ? 'bg-slate-700 text-white shadow-lg' : 'bg-white/5 text-slate-500 border border-white/5'}`}
                                > OMITIR </button>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-none-[2.5rem] border-white/10 flex flex-col justify-center gap-4 bg-slate-950/40">
                            <span className="text-[10px] font-black uppercase text-yellow-500/50 tracking-[0.4em]">Producto Destacado</span>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setData({ ...data, featured: true })}
                                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${data.featured === true ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}
                                > Destacar </button>
                                <button 
                                    onClick={() => setData({ ...data, featured: false })}
                                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${data.featured === false ? 'bg-slate-800 text-white' : 'bg-white/5 text-slate-500 border border-white/5'}`}
                                > Normal </button>
                                <button 
                                    onClick={() => setData({ ...data, featured: undefined })}
                                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all rounded-none ${data.featured === undefined ? 'bg-slate-700 text-white shadow-lg' : 'bg-white/5 text-slate-500 border border-white/5'}`}
                                > OMITIR </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 pt-10 border-t border-white/5">
                    <button 
                        onClick={() => onSave(data)}
                        className="w-full bg-white text-black py-10 rounded-none-[2.5rem] font-black uppercase tracking-[0.5em] text-[11px] hover:bg-secondary hover:text-white transition-all shadow-2xl active:scale-95 duration-500"
                    >
                        Ejecutar Transmutación Masiva
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full text-[9px] font-black uppercase text-slate-500 hover:text-white transition-all tracking-[0.4em] italic"
                    >
                        Desestimar Operación
                    </button>
                </div>
            </div>
        </div>
    )
}

function TaxonomyModal({ type, initialData, allProducts, onClose, onSaved }: { type: 'category' | 'collection', initialData: any, allProducts: any[], onClose: () => void, onSaved: () => void }) {
    const [loading, setLoading] = useState(false)
    const [searching, setSearching] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [activeSection, setActiveSection] = useState<'assigned' | 'search'>('assigned')
    
    const [data, setData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || '',
        description: initialData?.description || '',
        image: initialData?.image || '',
        pdfUrl: initialData?.pdfUrl || '',
        isVisible: initialData?.isVisible ?? true
    })
    
    const assignedProducts = allProducts.filter(p => type === 'category' ? p.categoryId === data.id : p.collectionId === data.id)
    const [selectedProducts, setSelectedProducts] = useState<any[]>(assignedProducts)
    
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                setSearching(true)
                try {
                    const results = await searchProductsForTaxonomy(searchTerm)
                    setSearchResults(results)
                    setActiveSection('search')
                } catch (error) {
                    console.error("Error searching:", error)
                } finally {
                    setSearching(false)
                }
            } else {
                setSearchResults([])
            }
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const productIds = selectedProducts.map(p => p.id)
            if (type === 'category') {
                await saveCategory(data.id, data, productIds)
            } else {
                await saveCollection(data.id, data, productIds)
            }
            onSaved()
        } catch (error) {
            alert("Error al guardar")
        } finally {
            setLoading(false)
        }
    }

    const toggleProduct = (product: any) => {
        setSelectedProducts(prev => {
            const isSelected = prev.find(p => p.id === product.id)
            if (isSelected) {
                return prev.filter(p => p.id !== product.id)
            } else {
                return [...prev, product]
            }
        })
    }

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-none-[4rem] border-white/5 animate-in zoom-in-95 duration-700 shadow-[0_0_150px_rgba(0,0,0,0.6)] relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[120px] -ml-32 -mt-32 rounded-none"></div>
                
                {/* Header */}
                <div className="bg-white/2 border-b border-white/5 p-10 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Reconfiguración de {type === 'category' ? 'Categoría' : 'Colección'}</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 italic">Anclaje de activos a Elementos taxonómicos</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-none border border-white/5 transition-all active:scale-90 duration-300">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Denominación del Elemento</label>
                                <input 
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-sm font-black uppercase tracking-widest text-white outline-none focus:border-secondary transition-all rounded-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Referencia Visual (URL)</label>
                                <input 
                                    type="text"
                                    value={data.image}
                                    onChange={(e) => setData({ ...data, image: e.target.value })}
                                    placeholder="https://cloud.atomic.shop/resources/..."
                                    className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-[10px] font-mono text-slate-400 outline-none focus:border-primary transition-all rounded-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Documento PDF (URL / Base64)</label>
                                <input 
                                    type="text"
                                    value={data.pdfUrl}
                                    onChange={(e) => setData({ ...data, pdfUrl: e.target.value })}
                                    placeholder="https://... o data:application/pdf;base64,..."
                                    className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-[10px] font-mono text-slate-400 outline-none focus:border-secondary transition-all rounded-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Descripción Conceptual</label>
                                <textarea 
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-xs font-bold text-slate-300 outline-none resize-none focus:border-secondary transition-all rounded-none leading-relaxed italic"
                                />
                            </div>

                            <div className="flex items-center justify-between bg-white/2 p-6 rounded-none border border-white/5">
                                <Toggle 
                                    label="Estado Público" 
                                    icon={<Globe size={18} className="text-primary" />} 
                                    checked={data.isVisible} 
                                    onChange={(v) => setData({ ...data, isVisible: v })} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT SELECTOR AREA */}
                    <div className="pt-12 border-t border-white/5 border-dashed space-y-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-4">
                                <Box size={20} className="text-secondary" /> 
                                Vínculo de Activos Relacionados
                            </h3>
                            <span className="text-[9px] font-black bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-none uppercase tracking-widest italic">
                                {selectedProducts.length} NÚCLEOS SINCRONIZADOS
                            </span>
                        </div>

                        <div className="relative group/search">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within/search:text-primary" size={20} />
                            <input 
                                type="text"
                                placeholder="ESCANEAR CATÁLOGO (NOMBRE / SKU / MODELO)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-white/5 pl-20 pr-8 py-8 text-xs font-black uppercase tracking-[0.2em] text-white outline-none focus:border-primary transition-all rounded-none-[2rem] placeholder:text-slate-800"
                            />
                            {searching && (
                                <RefreshCw className="absolute right-8 top-1/2 -translate-y-1/2 text-primary animate-spin" size={20} />
                            )}
                        </div>

                        <div className="flex border-b border-white/5">
                            <button 
                                onClick={() => setActiveSection('assigned')}
                                className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeSection === 'assigned' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                                Asignados ({selectedProducts.length})
                                {activeSection === 'assigned' && <div className="absolute bottom-0 left-10 right-10 h-1 bg-secondary rounded-none shadow-[0_0_15px_rgba(255,99,71,0.5)]"></div>}
                            </button>
                            <button 
                                onClick={() => setActiveSection('search')}
                                className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeSection === 'search' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                                {searchTerm ? 'Resultados' : 'Catálogo Maestro'}
                                {activeSection === 'search' && <div className="absolute bottom-0 left-10 right-10 h-1 bg-primary rounded-none shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>}
                            </button>
                        </div>

                        <div className="bg-slate-950/60 border border-white/5 rounded-none-[3rem] min-h-[400px] max-h-[400px] overflow-y-auto custom-scrollbar overflow-x-hidden">
                            {activeSection === 'assigned' ? (
                                selectedProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-32 opacity-10">
                                        <Box size={48} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-8">Sin unidades vinculadas</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {selectedProducts.map(p => (
                                            <ProductItem 
                                                key={p.id} 
                                                product={p} 
                                                isSelected={true} 
                                                onClick={() => toggleProduct(p)} 
                                            />
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {(searchTerm.length >= 2 ? searchResults : allProducts.slice(0, 50)).map(p => {
                                        const isSelected = !!selectedProducts.find(sp => sp.id === p.id)
                                        return (
                                            <ProductItem 
                                                key={p.id} 
                                                product={p} 
                                                isSelected={isSelected} 
                                                onClick={() => toggleProduct(p)} 
                                            />
                                        )
                                    })}
                                    {searchTerm.length < 2 && searchTerm.length > 0 && (
                                        <div className="py-24 text-center opacity-20">
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Escriba Gestión de búsqueda...</p>
                                        </div>
                                    )}
                                    {searchTerm.length >= 2 && searchResults.length === 0 && !searching && (
                                        <div className="py-24 text-center opacity-20">
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Sin coincidencias en el registro</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 bg-white/2 border-t border-white/5 p-10 flex gap-8">
                    <button 
                        disabled={loading}
                        onClick={onClose}
                        className="flex-1 px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-none border border-white/5 shadow-2xl"
                    >
                        Abortar
                    </button>
                    <button 
                        disabled={loading}
                        onClick={handleSubmit}
                        className="flex-1 bg-white text-black py-6 rounded-none font-black uppercase tracking-[0.5em] text-[11px] hover:bg-secondary hover:text-white transition-all shadow-2xl active:scale-95 duration-500"
                    >
                        {loading ? 'SINCRONIZANDO...' : 'Comprometer Elemento'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function ProductItem({ product, isSelected, onClick }: { product: any, isSelected: boolean, onClick: () => void }) {
    return (
        <div 
            className={`flex items-center justify-between px-8 py-6 cursor-pointer transition-all duration-300 group border-b border-white/5 ${isSelected ? 'bg-secondary/10' : 'hover:bg-white/5 bg-transparent'}`} 
            onClick={onClick}
        >
            <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-slate-900 rounded-none overflow-hidden flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    {product.images && safeParseArray(product.images).length > 0 ? (
                        <img src={safeParseArray(product.images)[0]} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={18} className="text-slate-600" />
                    )}
                </div>
                <div>
                    <p className="text-xs font-black text-white uppercase tracking-tighter line-clamp-1 italic">{product.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">{product.sku || 'N/A PROTOCOL'}</p>
                </div>
            </div>
            <div className={`transition-all duration-500 ${isSelected ? 'text-secondary scale-110' : 'text-slate-800'}`}>
                {isSelected ? <CheckSquare size={22} className="shadow-[0_0_15px_rgba(255,99,71,0.3)]" /> : <Square size={22} />}
            </div>
        </div>
    )
}

function safeParseArray(data: any, fallback: any[] = []): any[] {
    if (!data) return fallback
    if (Array.isArray(data)) return data
    try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data
        return Array.isArray(parsed) ? parsed : fallback
    } catch (e) {
        return fallback
    }
}


