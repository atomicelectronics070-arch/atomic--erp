"use client"

import { useState, useEffect, useRef } from "react"
import { ShoppingBag, Plus, Save, Image as ImageIcon, FileText, Trash2, X, PlusCircle, Globe, LayoutGrid, List, Layers, Tag as TagIcon, Edit, Power, Star, Settings, CreditCard, Box, CheckSquare, Square, ChevronRight, Search, Store, Upload, RefreshCw, Monitor, Cpu, Gamepad2, Layout } from "lucide-react"
import { saveProduct, getProducts, deleteProduct, getShopMetadata, createCategory, saveCategory, createCollection, saveCollection, deleteCollection, deleteManyCollections, updateCollection, deleteManyProducts, updateProductsCollection, restoreProduct, restoreManyProducts, permanentDeleteManyProducts, bulkUpdateProducts, cleanupDuplicateProducts, getProviderStats, searchProductsForTaxonomy } from "@/lib/actions/shop"

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str || str === 'null') return fallback;
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

export default function ShopConfigPage() {
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list')
    const [activeTab, setActiveTab] = useState<'products' | 'catalogs' | 'settings'>('products')
    const [products, setProducts] = useState<any[]>([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [dashboardSearch, setDashboardSearch] = useState("")
    const [metadata, setMetadata] = useState<{ categories: any[], collections: any[] }>({ categories: [], collections: [] })
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [editingTaxonomy, setEditingTaxonomy] = useState<{ type: 'category' | 'collection', data: any } | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [selectedCollections, setSelectedCollections] = useState<string[]>([])
    const [showBulkEdit, setShowBulkEdit] = useState(false)
    const [isTrashView, setIsTrashView] = useState(false)
    const [providerStats, setProviderStats] = useState<any[]>([])
    const [isCleaning, setIsCleaning] = useState(false)

    // Store Settings State
    const [storeSettings, setStoreSettings] = useState<any>({
        bannerActive: false,
        bannerText: "",
        shippingCost: 0,
        freeShippingThreshold: 0,
        currency: "USD",
        paymentMethods: {
            bankTransfer: true,
            cashOnDelivery: false,
            creditCard: false
        },
        banners: {
            software: {
                active: true,
                imageUrl: "",
                title: "Software & Desarrollo",
                description: "Licencias, herramientas y soluciones para llevar tu negocio al siguiente nivel.",
                productIds: [] as string[]
            },
            automation: {
                active: true,
                imageUrl: "",
                title: "Automatización Inteligente",
                description: "Sistemas de control, PLCs y soluciones industriales de última generación.",
                productIds: [] as string[]
            },
            gaming: {
                active: true,
                imageUrl: "",
                title: "Gaming & Consolas",
                description: "El mejor equipamiento gamer, consolas y accesorios para la experiencia definitiva.",
                productIds: [] as string[]
            }
        }
    })

    useEffect(() => {
        refreshData()
    }, [currentPage, dashboardSearch])

    const refreshData = async () => {
        setLoading(true)
        try {
            const [productRes, m, s] = await Promise.all([
                getProducts({ page: currentPage, pageSize, search: dashboardSearch, showDeleted: isTrashView }),
                getShopMetadata(),
                fetch("/api/shop/settings").then(res => res.json()).catch(() => ({}))
            ])
            setProducts(productRes.products)
            setTotalProducts(productRes.total)
            setMetadata(m)
            
            // Fetch Provider Stats
            const stats = await getProviderStats()
            setProviderStats(stats)
            
            if (s && s.settings) {
                setStoreSettings(s.settings)
            }
            setSelectedProducts([])
            setSelectedCollections([])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const saveSettings = async () => {
        setLoading(true)
        try {
            await fetch("/api/shop/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(storeSettings)
            })
            alert("Ajustes guardados correctamente.")
        } catch (error) {
            alert("Error al guardar ajustes.")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (product: any) => {
        setEditingProduct(product)
        setView('edit')
    }

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            await deleteProduct(id)
            refreshData()
        }
    }

    const handleBulkDeleteProducts = async () => {
        if (confirm(`¿Estás seguro de eliminar ${selectedProducts.length} productos?`)) {
            await deleteManyProducts(selectedProducts)
            refreshData()
        }
    }

    const handleBulkUpdateCollection = async (collectionId: string | null) => {
        await updateProductsCollection(selectedProducts, collectionId)
        alert("Colección actualizada en masa")
        refreshData()
    }

    const handleBulkEdit = async (data: any) => {
        await bulkUpdateProducts(selectedProducts, data)
        setShowBulkEdit(false)
        refreshData()
    }

    const handleRestore = async (id: string) => {
        await restoreProduct(id)
        refreshData()
    }

    const handleBulkRestore = async () => {
        await restoreManyProducts(selectedProducts)
        refreshData()
    }

    const handleBulkPermanentDelete = async () => {
        if (confirm(`¿Estás seguro de eliminar PERMANENTEMENTE ${selectedProducts.length} productos? Esta acción no se puede deshacer.`)) {
            await permanentDeleteManyProducts(selectedProducts)
            refreshData()
        }
    }

    const toggleProductSelection = (id: string) => {
        setSelectedProducts(prev => 
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        )
    }

    const toggleAllProducts = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([])
        } else {
            setSelectedProducts(products.map(p => p.id))
        }
    }

    const handleDeleteCollection = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta colección? Los productos no serán eliminados.")) {
            await deleteCollection(id)
            refreshData()
        }
    }

    const handleBulkDeleteCollections = async () => {
        if (confirm(`¿Estás seguro de eliminar ${selectedCollections.length} colecciones?`)) {
            await deleteManyCollections(selectedCollections)
            refreshData()
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-100 pb-8 gap-6">
                <div>
                    <div className="flex items-center space-x-2 text-orange-600 mb-2">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">E-Commerce Management</span>
                    </div>
                    <h1 className="text-4xl font-light text-neutral-800 tracking-tight">Centro de Catálogo</h1>
                    <p className="text-neutral-500 text-sm mt-2">Gestiona el inventario, categorías y colecciones de tu web pública.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => { setEditingProduct(null); setView(view === 'list' ? 'add' : 'list') }}
                        className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
                    >
                        {view === 'list' ? (
                            <><Plus size={16} /> <span>Añadir Producto</span></>
                        ) : (
                            <><List size={16} /> <span>Volver al Listado</span></>
                        )}
                    </button>
                    <button className="p-3 border border-neutral-100 hover:bg-neutral-50 transition-colors text-neutral-400">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {view === 'list' ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Horizontal Tabs */}
                    <div className="flex border-b border-neutral-100 mb-6">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'products' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-neutral-400 hover:text-neutral-800'}`}
                        >
                            Productos
                        </button>
                        <button
                            onClick={() => setActiveTab('catalogs')}
                            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'catalogs' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-neutral-400 hover:text-neutral-800'}`}
                        >
                            Catálogos & Colecciones
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'settings' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-neutral-400 hover:text-neutral-800'}`}
                        >
                            Ajustes Generales
                        </button>
                    </div>

                    {activeTab === 'products' && (
                        <div className="space-y-6">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard label="Catalogados" value={totalProducts} icon={<ShoppingBag size={14} />} />
                                <StatCard label="Categorías" value={metadata.categories.length} icon={<TagIcon size={14} />} />
                                <StatCard label="Orígenes" value={providerStats.length} icon={<Globe size={14} />} />
                                <StatCard label="Visitas Web" value={50} icon={<Power size={14} />} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* Sidebar: Insights & Maintenance */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-white border border-neutral-100 p-6 space-y-4">
                                        <div className="flex items-center space-x-2 text-indigo-600 border-b border-neutral-50 pb-3 mb-4">
                                            <Store size={16} />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-800">Orígenes Detectados</h3>
                                        </div>
                                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                            {providerStats.length > 0 ? providerStats.map((s, i) => (
                                                <div key={i} className="flex justify-between items-center group cursor-default">
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase truncate pr-4 group-hover:text-indigo-600 transition-colors">{s.name}</span>
                                                    <span className="text-[9px] font-black text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-none">{s.count}</span>
                                                </div>
                                            )) : (
                                                <div className="text-[10px] text-neutral-300 italic font-bold uppercase text-center py-4">Sincronizando proveedores...</div>
                                            )}
                                        </div>
                                        <div className="pt-4 border-t border-neutral-50">
                                            <button 
                                                onClick={() => setActiveTab('settings')}
                                                className="w-full text-center text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-600 transition-all"
                                            >
                                                Ver Mantenimiento Avanzado →
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-900 p-6 text-white space-y-4 shadow-xl border-l-4 border-orange-600">
                                        <div className="flex items-center space-x-2">
                                            <Trash2 size={16} className="text-orange-600" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest">Optimización del Catálogo</h3>
                                        </div>
                                        <p className="text-[10px] font-bold uppercase italic opacity-60 leading-relaxed">
                                            Elimina duplicados exactos para mejorar la velocidad de carga de la web.
                                        </p>
                                        <button 
                                            onClick={async () => {
                                                if(confirm("¿Ejecutar limpieza de duplicados exactos ahora?")) {
                                                    setIsCleaning(true);
                                                    try {
                                                        await cleanupDuplicateProducts();
                                                        await refreshData();
                                                        alert("Catálogo saneado correctamente.");
                                                    } finally {
                                                        setIsCleaning(false);
                                                    }
                                                }
                                            }}
                                            disabled={isCleaning}
                                            className="w-full bg-orange-600 text-white py-3 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-orange-600 transition-all shadow-lg disabled:opacity-50"
                                        >
                                            {isCleaning ? 'Saneando...' : 'Poda de Duplicados'}
                                        </button>
                                    </div>
                                </div>

                                {/* Main Content: Search & Table */}
                                <div className="lg:col-span-3 space-y-6">
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <div className="flex-1 relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-600 transition-colors" size={16} />
                                            <input 
                                                type="text"
                                                placeholder="Buscar por nombre, SKU o categoría..."
                                                value={dashboardSearch}
                                                onChange={(e) => { setDashboardSearch(e.target.value); setCurrentPage(1); }}
                                                className="w-full bg-white border border-neutral-100 pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-600 transition-colors shadow-sm"
                                            />
                                        </div>
                                        <div className="flex bg-neutral-50 p-1 rounded-none border border-neutral-100">
                                            <button 
                                                onClick={() => { setIsTrashView(false); setCurrentPage(1); }}
                                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${!isTrashView ? 'bg-white text-orange-600 shadow-sm border border-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
                                            >
                                                Catálogo Activo
                                            </button>
                                            <button 
                                                onClick={() => { setIsTrashView(true); setCurrentPage(1); }}
                                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isTrashView ? 'bg-white text-red-600 shadow-sm border border-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
                                            >
                                                <Trash2 size={12} /> Papelera
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-neutral-100 overflow-hidden shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
                                                    <th className="px-6 py-4 w-10">
                                                        <button onClick={toggleAllProducts} className="text-neutral-400 hover:text-orange-600 transition-colors">
                                                            {selectedProducts.length === products.length && products.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                                                        </button>
                                                    </th>
                                                    <th className="px-6 py-4">Producto / SKU</th>
                                                    <th className="px-6 py-4">Categoría</th>
                                                    <th className="px-6 py-4">Stock</th>
                                                    <th className="px-6 py-4">Precio</th>
                                                    <th className="px-6 py-4 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-50">
                                                {products.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-24 text-center text-neutral-300">
                                                            <div className="flex flex-col items-center space-y-4">
                                                                <ShoppingBag size={48} className="opacity-10" />
                                                                <p className="uppercase text-[10px] font-black tracking-[0.2em] opacity-40">Sin registros encontrados</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    products.map((p) => (
                                                        <tr key={p.id} className={`hover:bg-neutral-50/30 transition-colors group ${selectedProducts.includes(p.id) ? 'bg-orange-50/20' : ''}`}>
                                                            <td className="px-6 py-5">
                                                                <button onClick={() => toggleProductSelection(p.id)} className={`${selectedProducts.includes(p.id) ? 'text-orange-600' : 'text-neutral-200 group-hover:text-neutral-400'} transition-colors`}>
                                                                    {selectedProducts.includes(p.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                                                                </button>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="w-12 h-12 bg-neutral-100 border border-neutral-100 overflow-hidden flex items-center justify-center relative group-hover:border-orange-200 transition-colors">
                                                                        {p.images && p.images !== 'null' && safeParseArray(p.images).length > 0 ? (
                                                                            <img src={safeParseArray(p.images)[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                        ) : (
                                                                            <ImageIcon size={16} className="text-neutral-300" />
                                                                        )}
                                                                    </div>
                                                                    <div className="max-w-xs">
                                                                        <p className="text-sm font-bold text-neutral-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{p.name}</p>
                                                                        <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest mt-0.5">{p.sku || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 bg-neutral-50 px-2 py-1 border border-neutral-100">
                                                                    {p.category?.name || 'Varios'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <span className={`text-xs font-black ${p.stock < 5 ? 'text-red-500' : 'text-neutral-700'}`}>
                                                                    {p.stock} <span className="text-[10px] opacity-40 uppercase font-black">uds.</span>
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <p className="text-sm font-black text-neutral-900 font-mono italic">${p.price.toFixed(2)}</p>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center justify-end space-x-1">
                                                                    {isTrashView ? (
                                                                        <button onClick={() => handleRestore(p.id)} className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest border border-green-100">
                                                                            Restaurar
                                                                        </button>
                                                                    ) : (
                                                                        <>
                                                                            <button onClick={() => handleEdit(p)} className="p-2 text-neutral-300 hover:text-orange-600 transition-colors">
                                                                                <Edit size={16} />
                                                                            </button>
                                                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-neutral-300 hover:text-red-600 transition-colors">
                                                                                <Trash2 size={16} />
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
                                        {/* Pagination */}
                                        <div className="px-6 py-6 border-t border-neutral-50 flex items-center justify-between bg-white">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">Pág {currentPage} de {Math.ceil(totalProducts / pageSize) || 1} — {totalProducts} ítems</p>
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    disabled={currentPage <= 1}
                                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                                    className="px-6 py-2 border border-neutral-100 text-neutral-400 hover:text-orange-600 hover:border-orange-600 disabled:opacity-20 transition-all font-black uppercase tracking-widest text-[9px]"
                                                >
                                                    Anterior
                                                </button>
                                                <button 
                                                    disabled={currentPage >= Math.ceil(totalProducts / pageSize)}
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    className="px-6 py-2 border border-neutral-100 text-neutral-400 hover:text-orange-600 hover:border-orange-600 disabled:opacity-20 transition-all font-black uppercase tracking-widest text-[9px]"
                                                >
                                                    Siguiente
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bulk Actions Bar */}
                                    {selectedProducts.length > 0 && (
                                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-8 py-4 flex items-center space-x-8 shadow-2xl z-50 animate-in slide-in-from-bottom-4 duration-300">
                                            <div className="flex items-center space-x-2 border-r border-neutral-700 pr-8">
                                                <span className="text-orange-500 font-bold">{selectedProducts.length}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Seleccionados</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                {!isTrashView ? (
                                                    <>
                                                        <button 
                                                            onClick={() => setShowBulkEdit(true)}
                                                            className="flex items-center space-x-2 bg-neutral-800 text-white hover:bg-neutral-700 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                        >
                                                            <Edit size={14} />
                                                            <span>Edición en Masa</span>
                                                        </button>
                                                        <button 
                                                            onClick={handleBulkDeleteProducts}
                                                            className="flex items-center space-x-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Mover a Papelera</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={handleBulkRestore}
                                                            className="flex items-center space-x-2 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                        >
                                                            <Layers size={14} />
                                                            <span>Restaurar Selección</span>
                                                        </button>
                                                        <button 
                                                            onClick={handleBulkPermanentDelete}
                                                            className="flex items-center space-x-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Eliminar Definitivamente</span>
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => setSelectedProducts([])}
                                                    className="text-neutral-400 hover:text-white transition-colors"
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
                        </div>
                    )}

                    {activeTab === 'catalogs' && (
                        <div className="space-y-8">
                            {/* Quick Category/Collection Creation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-50 p-8 border border-neutral-100">
                                <QuickCreate
                                    label="Nueva Categoría"
                                    icon={<TagIcon size={16} />}
                                    onSave={async (name) => { await createCategory(name); refreshData(); }}
                                />
                                <QuickCreate
                                    label="Nueva Colección"
                                    icon={<Layers size={16} />}
                                    onSave={async (name) => { await createCollection(name); refreshData(); }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white border text-sm border-neutral-100 p-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4 border-b pb-4">Categorías Actuales</h3>
                                    <ul className="space-y-2">
                                        {metadata.categories.map(c => (
                                            <li key={c.id} className="flex justify-between items-center py-2 px-3 bg-neutral-50 hover:bg-neutral-100 transition-colors group">
                                                <div>
                                                    <span className="font-medium text-neutral-700">{c.name}</span>
                                                    <span className="text-[10px] text-neutral-400 font-bold uppercase ml-2">/{c.slug}</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingTaxonomy({ type: 'category', data: c })} className="p-1.5 text-neutral-400 hover:text-orange-600 transition-colors">
                                                        <Edit size={14} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white border text-sm border-neutral-100 p-6">
                                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800">Colecciones Especiales</h3>
                                        {selectedCollections.length > 0 && (
                                            <button 
                                                onClick={handleBulkDeleteCollections}
                                                className="flex items-center space-x-2 text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-widest transition-colors"
                                            >
                                                <Trash2 size={12} />
                                                <span>Eliminar ({selectedCollections.length})</span>
                                            </button>
                                        )}
                                    </div>
                                    <ul className="space-y-2">
                                        {metadata.collections.length === 0 ? (
                                            <p className="text-center py-8 text-neutral-300 text-[10px] font-bold uppercase tracking-widest">No hay colecciones creadas</p>
                                        ) : (
                                            metadata.collections.map(c => {
                                                const productCount = products.filter(p => p.collectionId === c.id).length;
                                                const isSelected = selectedCollections.includes(c.id);
                                                return (
                                                    <li key={c.id} className={`flex justify-between items-center py-3 px-4 transition-colors group ${isSelected ? 'bg-orange-50 border border-orange-100' : 'bg-neutral-50 hover:bg-neutral-100'}`}>
                                                        <div className="flex items-center space-x-3">
                                                            <button 
                                                                onClick={() => setSelectedCollections(prev => isSelected ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                                                                className={`${isSelected ? 'text-orange-600' : 'text-neutral-200 group-hover:text-neutral-400'}`}
                                                            >
                                                                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                                            </button>
                                                            <div>
                                                                <span className="font-bold text-neutral-800">{c.name}</span>
                                                                <div className="flex items-center space-x-2 mt-0.5">
                                                                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">/{c.slug}</span>
                                                                    <span className="text-[9px] text-orange-600 font-black uppercase tracking-widest">• {productCount} productos</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => setEditingTaxonomy({ type: 'collection', data: c })}
                                                                className="p-1.5 text-neutral-400 hover:text-orange-600 transition-colors"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteCollection(c.id)}
                                                                className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
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

                    {activeTab === 'settings' && (
                        <div className="space-y-10">

                            {/* ═══════════════════════════════════════════════════
                                SECCIÓN: BANNERS DE PÁGINA PRINCIPAL
                            ═══════════════════════════════════════════════════ */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 pb-4 border-b-2 border-neutral-900">
                                    <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center">
                                        <Layout size={20} className="text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Banners de Página Principal</h3>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Configura los 3 banners hero de tu web pública</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    <BannerConfigPanel
                                        bannerKey="software"
                                        label="Software & Desarrollo"
                                        icon={<Monitor size={18} className="text-blue-500" />}
                                        accentColor="blue"
                                        data={storeSettings.banners?.software || {}}
                                        allProducts={products}
                                        onChange={(d: any) => setStoreSettings((prev: any) => ({ ...prev, banners: { ...prev.banners, software: d } }))}
                                    />
                                    <BannerConfigPanel
                                        bannerKey="automation"
                                        label="Automatización"
                                        icon={<Cpu size={18} className="text-emerald-500" />}
                                        accentColor="emerald"
                                        data={storeSettings.banners?.automation || {}}
                                        allProducts={products}
                                        onChange={(d: any) => setStoreSettings((prev: any) => ({ ...prev, banners: { ...prev.banners, automation: d } }))}
                                    />
                                    <BannerConfigPanel
                                        bannerKey="gaming"
                                        label="Gaming & Consolas"
                                        icon={<Gamepad2 size={18} className="text-purple-500" />}
                                        accentColor="purple"
                                        data={storeSettings.banners?.gaming || {}}
                                        allProducts={products}
                                        onChange={(d: any) => setStoreSettings((prev: any) => ({ ...prev, banners: { ...prev.banners, gaming: d } }))}
                                    />
                                </div>
                            </div>

                            {/* ═══════════════════════════════════════════════════
                                SECCIÓN: LOGÍSTICA Y NOTIFICACIÓN
                            ═══════════════════════════════════════════════════ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white border border-neutral-100 p-8 space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-6 flex items-center gap-2"><Box size={16} className="text-orange-600" /> Logística y Globales</h3>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Moneda Principal</label>
                                        <select
                                            value={storeSettings.currency}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm font-bold uppercase outline-none"
                                        >
                                            <option value="USD">Dólares (USD)</option>
                                            <option value="COP">Pesos Colombianos (COP)</option>
                                            <option value="MXN">Pesos Mexicanos (MXN)</option>
                                            <option value="EUR">Euros (EUR)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Costo de Envío Estándar</label>
                                        <input type="number" value={storeSettings.shippingCost} onChange={(e) => setStoreSettings({ ...storeSettings, shippingCost: Number(e.target.value) })} className="w-full bg-neutral-50 border-none px-6 py-4 text-sm font-bold outline-none text-orange-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Envío Gratis Desde (Monto)</label>
                                        <input type="number" value={storeSettings.freeShippingThreshold} onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })} className="w-full bg-neutral-50 border-none px-6 py-4 text-sm outline-none" />
                                    </div>
                                </div>

                                <div className="bg-white border border-neutral-100 p-8 space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 flex items-center gap-2"><Star size={16} className="text-yellow-500" /> Notificación Superior</h3>
                                        <Toggle label="Activar" icon="" checked={storeSettings.bannerActive} onChange={(v) => setStoreSettings({ ...storeSettings, bannerActive: v })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Texto del Banner</label>
                                        <textarea rows={3} disabled={!storeSettings.bannerActive} value={storeSettings.bannerText} onChange={(e) => setStoreSettings({ ...storeSettings, bannerText: e.target.value })} className="w-full bg-neutral-50 border-none px-6 py-4 text-sm outline-none resize-none disabled:opacity-50" placeholder="Ej: ¡Envío Gratis por compras superiores a $100!" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white border border-neutral-100 p-8 space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-6 flex items-center gap-2"><CreditCard size={16} className="text-orange-600" /> Pasarelas de Pago</h3>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className={`flex-1 border p-6 flex items-center justify-between transition-colors ${storeSettings.paymentMethods?.bankTransfer ? 'border-orange-600 bg-orange-50/10' : 'border-neutral-100'}`}>
                                        <div><p className="font-bold text-neutral-800">Transferencia Bancaria</p><p className="text-xs text-neutral-500 mt-1">Manual offline</p></div>
                                        <Toggle label="" icon="" checked={storeSettings.paymentMethods?.bankTransfer ?? true} onChange={(v) => setStoreSettings({ ...storeSettings, paymentMethods: { ...storeSettings.paymentMethods, bankTransfer: v } })} />
                                    </div>
                                    <div className={`flex-1 border p-6 flex items-center justify-between transition-colors ${storeSettings.paymentMethods?.cashOnDelivery ? 'border-orange-600 bg-orange-50/10' : 'border-neutral-100'}`}>
                                        <div><p className="font-bold text-neutral-800">Pago Contra Entrega</p><p className="text-xs text-neutral-500 mt-1">Efectivo al recibir</p></div>
                                        <Toggle label="" icon="" checked={storeSettings.paymentMethods?.cashOnDelivery ?? false} onChange={(v) => setStoreSettings({ ...storeSettings, paymentMethods: { ...storeSettings.paymentMethods, cashOnDelivery: v } })} />
                                    </div>
                                    <div className={`flex-1 border p-6 flex items-center justify-between transition-colors ${storeSettings.paymentMethods?.creditCard ? 'border-orange-600 bg-orange-50/10' : 'border-neutral-100'}`}>
                                        <div><p className="font-bold text-neutral-800">Tarjetas y Pasarela</p><p className="text-xs text-neutral-500 mt-1">Stripe / Webpay</p></div>
                                        <Toggle label="" icon="" checked={storeSettings.paymentMethods?.creditCard ?? false} onChange={(v) => setStoreSettings({ ...storeSettings, paymentMethods: { ...storeSettings.paymentMethods, creditCard: v } })} />
                                    </div>
                                </div>
                            </div>

                            {/* Mantenimiento */}
                            <div className="bg-white border border-neutral-100 p-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-800 mb-8 flex items-center gap-3"><Settings size={18} className="text-red-600" /> Mantenimiento Automático del Catálogo</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2 text-rose-600"><Trash2 size={16} /><span className="text-[10px] uppercase font-black tracking-widest">Poda de Duplicados Pro</span></div>
                                        <p className="text-[11px] text-neutral-500 leading-relaxed font-bold uppercase tracking-tighter italic opacity-70">Elimina productos 100% idénticos (Nombre, Precio, Imágenes). El sistema mantendrá solo la entrada más reciente.</p>
                                        <button onClick={async () => { if(confirm("¿Seguro que quieres eliminar duplicados exactos?")) { setIsCleaning(true); try { await cleanupDuplicateProducts(); await refreshData(); alert("Catálogo saneado con éxito."); } finally { setIsCleaning(false); } } }} disabled={isCleaning} className="w-full bg-rose-50 text-rose-600 border border-rose-100 px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 shadow-sm">{isCleaning ? 'Limpiando...' : 'Borrar Productos Duplicados'}</button>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2 text-indigo-600"><ShoppingBag size={16} /><span className="text-[10px] uppercase font-black tracking-widest">Proveedores en Catálogo</span></div>
                                        <div className="bg-white border border-neutral-100 divide-y divide-neutral-100 max-h-48 overflow-y-auto">
                                            {providerStats.length > 0 ? providerStats.map((s, i) => (<div key={i} className="p-4 flex justify-between items-center hover:bg-neutral-50 transition-colors"><span className="text-[11px] font-black text-neutral-800 uppercase tracking-tight truncate">{s.name}</span><span className="bg-indigo-600 text-white px-2 py-0.5 text-[9px] font-black">{s.count} uds.</span></div>)) : (<div className="p-8 text-center text-[10px] text-neutral-400 font-bold uppercase italic">Detectando orígenes...</div>)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button onClick={saveSettings} disabled={loading} className="bg-neutral-900 text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-colors shadow-lg">
                                    Guardar Todos los Ajustes
                                </button>
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
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center space-x-2">
                {icon} <span>{label}</span>
            </label>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Escribe nombre..."
                    className="flex-1 bg-white border border-neutral-100 px-4 py-2.5 text-xs outline-none focus:border-orange-200"
                />
                <button
                    onClick={() => { if (name) { onSave(name); setName(''); } }}
                    className="bg-neutral-800 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                >
                    Crear
                </button>
            </div>
        </div>
    )
}

// ─── BannerConfigPanel ────────────────────────────────────────────────────────
function BannerConfigPanel({ bannerKey, label, icon, accentColor, data, allProducts, onChange }: {
    bannerKey: string
    label: string
    icon: any
    accentColor: string
    data: any
    allProducts: any[]
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
        blue: 'border-blue-500 bg-blue-50',
        emerald: 'border-emerald-500 bg-emerald-50',
        purple: 'border-purple-500 bg-purple-50',
    }
    const dotMap: Record<string, string> = {
        blue: 'bg-blue-500',
        emerald: 'bg-emerald-500',
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
        <div className={`border-l-4 ${accentMap[accentColor] || 'border-orange-500 bg-orange-50'} bg-white border border-neutral-100`}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${dotMap[accentColor] || 'bg-orange-500'}`}></div>
                    {icon}
                    <span className="text-[11px] font-black uppercase tracking-widest text-neutral-800">{label}</span>
                </div>
                <Toggle
                    label=""
                    icon=""
                    checked={data.active ?? true}
                    onChange={(v) => onChange({ ...data, active: v })}
                />
            </div>

            <div className="p-5 space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Imagen de Fondo</label>
                    {data.imageUrl ? (
                        <div className="relative group">
                            <img src={data.imageUrl} alt="Banner" className="w-full h-28 object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-neutral-900 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all"
                                >
                                    {uploading ? 'Subiendo...' : 'Cambiar'}
                                </button>
                                <button
                                    onClick={() => onChange({ ...data, imageUrl: '' })}
                                    className="bg-red-600 text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest"
                                >
                                    Quitar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full border-2 border-dashed border-neutral-200 py-6 flex flex-col items-center gap-2 hover:border-orange-400 hover:bg-orange-50/30 transition-all group"
                        >
                            <Upload size={20} className="text-neutral-300 group-hover:text-orange-500 transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-orange-500">
                                {uploading ? 'Subiendo...' : 'Subir imagen (JPG/PNG/WebP)'}
                            </span>
                        </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">O URL externa</label>
                        <input
                            type="text"
                            value={data.imageUrl || ''}
                            onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-neutral-50 border-none px-3 py-2 text-xs outline-none font-mono"
                        />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Título Central</label>
                    <input
                        type="text"
                        value={data.title || ''}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        className="w-full bg-neutral-50 border-none px-3 py-2.5 text-sm font-black outline-none border-b-2 border-transparent focus:border-orange-500 transition-all"
                    />
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Descripción</label>
                    <textarea
                        rows={2}
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        className="w-full bg-neutral-50 border-none px-3 py-2.5 text-xs outline-none resize-none border-b-2 border-transparent focus:border-orange-500 transition-all"
                    />
                </div>

                {/* Products for gallery */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">
                            Productos del Banner
                        </label>
                        <span className="text-[9px] font-black bg-neutral-900 text-white px-2 py-0.5">
                            {selectedProductIds.length} sel.
                        </span>
                    </div>
                    <button
                        onClick={() => setShowProductPicker(v => !v)}
                        className="w-full border border-dashed border-neutral-200 py-2 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-600 hover:border-orange-300 transition-all flex items-center justify-center gap-2"
                    >
                        <Box size={12} /> {showProductPicker ? 'Cerrar selector' : 'Seleccionar productos galería'}
                    </button>

                    {showProductPicker && (
                        <div className="border border-neutral-100 bg-neutral-50 space-y-2 p-3">
                            <div className="relative">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-neutral-900 text-white pl-8 pr-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none"
                                />
                                {searching && <RefreshCw size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 animate-spin" />}
                            </div>
                            <div className="max-h-36 overflow-y-auto divide-y divide-neutral-100">
                                {displayList.map((p: any) => {
                                    const sel = selectedProductIds.includes(p.id)
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => toggleProduct(p)}
                                            className={`w-full flex items-center gap-3 p-2 text-left transition-colors ${sel ? 'bg-orange-50' : 'bg-white hover:bg-neutral-50'}`}
                                        >
                                            <div className="w-8 h-8 bg-neutral-100 overflow-hidden shrink-0">
                                                {safeParseArray(p.images).length > 0 ? (
                                                    <img src={safeParseArray(p.images)[0]} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={12} className="m-auto mt-2 text-neutral-300" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-700 line-clamp-1 flex-1">{p.name}</span>
                                            <div className={sel ? 'text-orange-500' : 'text-neutral-200'}>
                                                {sel ? <CheckSquare size={14} /> : <Square size={14} />}
                                            </div>
                                        </button>
                                    )
                                })}
                                {displayList.length === 0 && (
                                    <p className="text-center py-4 text-[9px] text-neutral-400 font-bold uppercase">Sin resultados</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Selected pills */}
                    {selectedProductIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {selectedProductIds.slice(0, 5).map((id: string) => {
                                const p = allProducts.find((pr: any) => pr.id === id)
                                return p ? (
                                    <span key={id} className="bg-neutral-900 text-white text-[8px] font-black uppercase px-2 py-0.5 flex items-center gap-1">
                                        {p.name.substring(0, 15)}…
                                        <button onClick={() => toggleProduct(p)} className="hover:text-red-400"><X size={8} /></button>
                                    </span>
                                ) : null
                            })}
                            {selectedProductIds.length > 5 && (
                                <span className="text-[8px] font-black text-neutral-400 uppercase px-2 py-0.5">+{selectedProductIds.length - 5} más</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
// ─── End BannerConfigPanel ────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string, value: any, icon: any }) {
    return (
        <div className="bg-white border border-neutral-100 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-neutral-400">
                {icon}
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-2xl font-black text-neutral-800 tracking-tighter">{value}</p>
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
        featured: initialData?.featured ?? false,
        specSheetUrl: initialData?.specSheetUrl || '',
        keywords: initialData?.keywords || '',
        images: initialData?.images || '[]',
        specs: initialData?.specs || '[]',
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Info Column */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white border border-neutral-100 p-8 space-y-6">
                        <div className="flex items-center space-x-3 border-b border-neutral-50 pb-4 mb-6">
                            <LayoutGrid size={18} className="text-orange-600" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-800">Cuerpo del Producto</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Nombre Comercial</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Minibar Industrial Pro X"
                                className="w-full bg-neutral-50 border-none px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">SKU / Modelo</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    placeholder="ATS-100-PRO"
                                    className="w-full bg-neutral-50 border-none px-6 py-5 text-sm outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Precio Actual (USD)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full bg-neutral-50 border-none px-6 py-5 text-sm outline-none font-black text-orange-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Precio Antes</label>
                                <input
                                    type="number"
                                    value={formData.compareAtPrice}
                                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full bg-neutral-50 border-none px-6 py-5 text-sm outline-none line-through"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Descripción del Producto</label>
                            <textarea
                                rows={8}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe el producto para el cliente..."
                                className="w-full bg-neutral-50 border-none px-6 py-5 text-sm outline-none resize-none font-medium text-neutral-600 leading-relaxed"
                            />
                        </div>
                    </section>

                    <section className="bg-white border border-neutral-100 p-8 space-y-6">
                        <div className="flex items-center space-x-3 border-b border-neutral-50 pb-4 mb-6">
                            <FileText size={18} className="text-orange-600" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-800">Ficha de Especificaciones</h2>
                        </div>

                        <div className="space-y-4">
                            {techSpecs.map((spec, index) => (
                                <div key={index} className="flex space-x-4 animate-in slide-in-from-left-2 duration-300">
                                    <input
                                        type="text"
                                        value={spec.label}
                                        placeholder="Característica (Ej: Capacidad)"
                                        className="flex-1 bg-neutral-50 border-none px-6 py-4 text-[11px] font-bold uppercase outline-none"
                                        onChange={(e) => {
                                            const newSpecs = [...techSpecs]
                                            newSpecs[index].label = e.target.value
                                            setTechSpecs(newSpecs)
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={spec.value}
                                        placeholder="Valor (Ej: 50 Litros)"
                                        className="flex-1 bg-neutral-50 border-none px-6 py-4 text-[11px] outline-none"
                                        onChange={(e) => {
                                            const newSpecs = [...techSpecs]
                                            newSpecs[index].value = e.target.value
                                            setTechSpecs(newSpecs)
                                        }}
                                    />
                                    <button onClick={() => removeSpec(index)} className="p-3 text-neutral-200 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addSpec}
                                className="w-full border-2 border-dashed border-neutral-100 py-4 text-[10px] font-black uppercase text-neutral-400 hover:text-orange-600 hover:border-orange-100 transition-all flex items-center justify-center space-x-2"
                            >
                                <PlusCircle size={14} /> <span>Añadir Especificación Técnica</span>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Side Column */}
                <div className="space-y-8">
                    <section className="bg-white border border-neutral-100 p-8 space-y-6">
                        <div className="flex items-center space-x-3 border-b border-neutral-50 pb-4 mb-6">
                            <ImageIcon size={18} className="text-orange-600" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-800">Galería de Imágenes</h2>
                        </div>

                        <div className="border-2 border-dashed border-neutral-100 p-12 text-center space-y-4 hover:border-orange-200 transition-all cursor-pointer group bg-neutral-50/20">
                            <div className="bg-orange-50 w-16 h-16 rounded-none flex items-center justify-center mx-auto group-hover:bg-orange-100 transition-all">
                                <Plus size={32} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-neutral-800 tracking-wider">Soltar imágenes aquí</p>
                                <p className="text-[9px] font-bold text-neutral-400 mt-1 uppercase">Máximo 5MB por archivo</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Ficha Técnica PDF</label>
                                <button className="w-full flex items-center justify-between bg-neutral-800 text-white px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                                    <span>Vincular Documento</span>
                                    <FileText size={16} />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border border-neutral-100 p-8 space-y-6">
                        <div className="flex items-center space-x-3 border-b border-neutral-50 pb-4 mb-6">
                            <Globe size={18} className="text-orange-600" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-800">Visibilidad & SEO</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Categoría Principal</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-neutral-50 border-none px-6 py-4 text-[10px] font-bold uppercase outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Sin Categoría</option>
                                {metadata.categories.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Colección / TAG</label>
                            <select
                                value={formData.collectionId}
                                onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                                className="w-full bg-neutral-50 border-none px-6 py-4 text-[10px] font-bold uppercase outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Sin Colección</option>
                                {metadata.collections.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Etiquetas SEO</label>
                            <input
                                type="text"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                placeholder="Ej: refrigeracion, industrial, ahorro..."
                                className="w-full bg-neutral-50 border-none px-6 py-4 text-[10px] font-bold uppercase outline-none"
                            />
                        </div>

                        <div className="space-y-6 pt-6 border-t border-neutral-50">
                            <Toggle
                                label="Visibilidad en Web"
                                icon={< Globe size={14} />}
                                checked={formData.isActive}
                                onChange={(v) => setFormData({ ...formData, isActive: v })}
                            />
                            <Toggle
                                label="Marcar como Destacado"
                                icon={<Star size={14} />}
                                checked={formData.featured}
                                onChange={(v) => setFormData({ ...formData, featured: v })}
                            />
                        </div>
                    </section>
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-12 border-t border-neutral-100">
                <button
                    disabled={loading}
                    onClick={onCancel}
                    className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-all"
                >
                    Descartar
                </button>
                <button
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex items-center space-x-3 bg-neutral-900 text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl shadow-neutral-200"
                >
                    {loading ? (
                        <span>Guardando...</span>
                    ) : (
                        <><Save size={18} /> <span>Guardar Cambios</span></>
                    )}
                </button>
            </div>
        </div>
    )
}

function Toggle({ label, checked, onChange, icon }: { label: string, checked: boolean, onChange: (v: boolean) => void, icon: any }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-neutral-600">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-12 h-6 flex items-center px-1 transition-all ${checked ? 'bg-orange-600' : 'bg-neutral-200'}`}
            >
                <div className={`w-4 h-4 bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
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
        categoryId: undefined,
        collectionId: undefined
    })

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full p-8 space-y-8 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter italic">Edición en Masa</h2>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Modificando <span className="text-orange-600">{selectedCount}</span> productos seleccionados</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 transition-colors">
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Nuevo Nombre Común</label>
                        <input 
                            type="text"
                            placeholder="Dejar vacío para no cambiar"
                            className="w-full bg-neutral-50 border-none px-4 py-3 text-sm font-bold outline-none border-b-2 border-transparent focus:border-orange-500 transition-all"
                            onChange={(e) => setData({ ...data, name: e.target.value || undefined })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Nuevo Precio (USD)</label>
                            <input 
                                type="number"
                                placeholder="Sin cambios"
                                className="w-full bg-neutral-50 border-none px-4 py-3 text-sm font-bold outline-none border-b-2 border-transparent focus:border-orange-500 transition-all"
                                onChange={(e) => setData({ ...data, price: e.target.value || undefined })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Nuevo Stock</label>
                            <input 
                                type="number"
                                placeholder="Sin cambios"
                                className="w-full bg-neutral-50 border-none px-4 py-3 text-sm font-bold outline-none border-b-2 border-transparent focus:border-orange-500 transition-all"
                                onChange={(e) => setData({ ...data, stock: e.target.value || undefined })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Cambiar Categoría</label>
                        <select 
                            className="w-full bg-neutral-50 border-none px-4 py-3 text-xs font-bold uppercase outline-none"
                            onChange={(e) => setData({ ...data, categoryId: e.target.value || undefined })}
                        >
                            <option value="">Mantener actuales</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Cambiar Colección</label>
                        <select 
                            className="w-full bg-neutral-50 border-none px-4 py-3 text-xs font-bold uppercase outline-none"
                            onChange={(e) => setData({ ...data, collectionId: e.target.value || undefined })}
                        >
                            <option value="">Mantener actuales</option>
                            <option value="none">Quitar de todas</option>
                            {collections.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-orange-50/50 border border-orange-100">
                        <span className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Visibilidad en Web</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setData({ ...data, isActive: true })}
                                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${data.isActive === true ? 'bg-orange-600 text-white' : 'bg-white text-neutral-400'}`}
                            > Activar </button>
                            <button 
                                onClick={() => setData({ ...data, isActive: false })}
                                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${data.isActive === false ? 'bg-red-600 text-white' : 'bg-white text-neutral-400'}`}
                            > Desactivar </button>
                            <button 
                                onClick={() => setData({ ...data, isActive: undefined })}
                                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${data.isActive === undefined ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-400'}`}
                            > S/C </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => onSave(data)}
                        className="w-full bg-neutral-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-neutral-200"
                    >
                        Aplicar Cambios en Masa
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full text-[9px] font-black uppercase text-neutral-400 hover:text-neutral-800 transition-all tracking-widest"
                    >
                        Cancelar Proceso
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
        isVisible: initialData?.isVisible ?? true
    })
    
    // Find products currently assigned to this category/collection from the initial list
    const assignedProducts = allProducts.filter(p => type === 'category' ? p.categoryId === data.id : p.collectionId === data.id)
    const [selectedProducts, setSelectedProducts] = useState<any[]>(assignedProducts)
    
    // Debounced Search
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-white border-b border-neutral-100 p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tighter">Editar {type === 'category' ? 'Categoría' : 'Colección'}</h2>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Gestión de Productos Avanzada</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 transition-colors">
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Nombre</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                className="w-full bg-neutral-50 border-none px-6 py-4 text-sm font-bold outline-none border-b-2 border-transparent focus:border-orange-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Breve Descripción</label>
                            <textarea 
                                rows={2}
                                value={data.description}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                placeholder="Descripción opcional..."
                                className="w-full bg-neutral-50 border-none px-6 py-4 text-sm font-medium outline-none border-b-2 border-transparent focus:border-orange-500 transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">URL de Imagen</label>
                                <input 
                                    type="text"
                                    value={data.image}
                                    onChange={(e) => setData({ ...data, image: e.target.value })}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="w-full bg-neutral-50 border-none px-6 py-4 text-sm outline-none border-b-2 border-transparent focus:border-orange-500 transition-all font-mono"
                                />
                            </div>
                            <div className="pb-2">
                                <Toggle 
                                    label="Visible en Web" 
                                    icon={<Globe size={14} />} 
                                    checked={data.isVisible} 
                                    onChange={(v) => setData({ ...data, isVisible: v })} 
                                />
                            </div>
                        </div>

                        {data.image && (
                            <div className="border border-neutral-100 w-24 h-24 overflow-hidden flex items-center justify-center bg-neutral-50">
                                <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* PRODUCT SELECTOR AREA */}
                    <div className="pt-8 border-t border-neutral-100 border-dashed space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase text-neutral-800 tracking-[0.2em] flex items-center gap-2">
                                <Box size={14} className="text-orange-600" /> 
                                Asignación de Productos
                            </label>
                            <span className="text-[9px] font-black bg-orange-600 text-white px-2 py-0.5 uppercase tracking-widest">
                                {selectedProducts.length} Seleccionados
                            </span>
                        </div>

                        {/* Search Input */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-600" size={16} />
                            <input 
                                type="text"
                                placeholder="Buscar productos por nombre o SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-neutral-900 text-white pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-600/20"
                            />
                            {searching && (
                                <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 animate-spin" size={16} />
                            )}
                        </div>

                        {/* Selector Tabs */}
                        <div className="flex border-b border-neutral-100">
                            <button 
                                onClick={() => setActiveSection('assigned')}
                                className={`px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${activeSection === 'assigned' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-neutral-400'}`}
                            >
                                Asignados ({selectedProducts.length})
                            </button>
                            <button 
                                onClick={() => setActiveSection('search')}
                                className={`px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${activeSection === 'search' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-neutral-400'}`}
                            >
                                {searchTerm ? 'Resultados de Búsqueda' : 'Catálogo Reciente'}
                            </button>
                        </div>

                        <div className="bg-neutral-50 border border-neutral-100 min-h-[300px] max-h-[300px] overflow-y-auto custom-scrollbar">
                            {activeSection === 'assigned' ? (
                                selectedProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                        <Box size={32} />
                                        <p className="text-[9px] font-black uppercase tracking-widest mt-4">Sin productos asignados</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-neutral-100">
                                        {selectedProducts.map(p => (
                                            <ProductItem 
                                                key={p.id} 
                                                product={p} 
                                                isSelected={true} 
                                                onClick={() => toggleProduct(p)} 
                                            />
                                        ))}
                                    </ul>
                                )
                            ) : (
                                <>
                                    <ul className="divide-y divide-neutral-100">
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
                                            <div className="p-12 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                Escribe al menos 2 caracteres...
                                            </div>
                                        )}
                                        {searchTerm.length >= 2 && searchResults.length === 0 && !searching && (
                                            <div className="p-12 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                No se encontraron coincidencias
                                            </div>
                                        )}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 bg-white border-t border-neutral-100 p-6 flex gap-3">
                    <button 
                        disabled={loading}
                        onClick={onClose}
                        className="flex-1 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-all bg-neutral-100 hover:bg-neutral-200"
                    >
                        Cancelar
                    </button>
                    <button 
                        disabled={loading}
                        onClick={handleSubmit}
                        className="flex-1 bg-neutral-900 text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-neutral-200"
                    >
                        {loading ? 'Guardando...' : 'Aplicar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function ProductItem({ product, isSelected, onClick }: { product: any, isSelected: boolean, onClick: () => void }) {
    return (
        <li 
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isSelected ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-white bg-white'}`} 
            onClick={onClick}
        >
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-neutral-100 overflow-hidden flex items-center justify-center shrink-0">
                    {product.images && safeParseArray(product.images).length > 0 ? (
                        <img src={safeParseArray(product.images)[0]} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={14} className="text-neutral-300" />
                    )}
                </div>
                <div>
                    <p className="text-xs font-bold text-neutral-800 line-clamp-1">{product.name}</p>
                    <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">{product.sku || 'S/N'}</p>
                </div>
            </div>
            <div className={`${isSelected ? 'text-orange-600' : 'text-neutral-200'}`}>
                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
            </div>
        </li>
    )
}
