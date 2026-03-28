"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Plus, Save, Image as ImageIcon, FileText, Trash2, X, PlusCircle, Globe, LayoutGrid, List, Layers, Tag as TagIcon, Edit, Power, Star, Settings, CreditCard, Box, CheckSquare, Square, ChevronRight, Search, Store } from "lucide-react"
import { saveProduct, getProducts, deleteProduct, getShopMetadata, createCategory, saveCategory, createCollection, saveCollection, deleteCollection, deleteManyCollections, updateCollection, deleteManyProducts, updateProductsCollection, restoreProduct, restoreManyProducts, permanentDeleteManyProducts, bulkUpdateProducts, cleanupDuplicateProducts, getProviderStats } from "@/lib/actions/shop"

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
    const [storeSettings, setStoreSettings] = useState({
        bannerActive: false,
        bannerText: "",
        shippingCost: 0,
        freeShippingThreshold: 0,
        currency: "USD",
        paymentMethods: {
            bankTransfer: true,
            cashOnDelivery: false,
            creditCard: false
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
                            {/* Stats & Tools */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard label="Total Productos" value={totalProducts} icon={<ShoppingBag size={14} />} />
                                <StatCard label="Categorías" value={metadata.categories.length} icon={<TagIcon size={14} />} />
                                <StatCard label="Colecciones" value={metadata.collections.length} icon={<Layers size={14} />} />
                                <StatCard label="Visibles en Web" value={products.filter(p => p.isActive).length} icon={<Globe size={14} />} />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                                    <input 
                                        type="text"
                                        placeholder="Buscar por nombre, SKU o descripción..."
                                        value={dashboardSearch}
                                        onChange={(e) => { setDashboardSearch(e.target.value); setCurrentPage(1); }}
                                        className="w-full bg-white border border-neutral-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-orange-600 transition-colors"
                                    />
                                </div>
                                <div className="flex bg-neutral-100 p-1 rounded-none border border-neutral-200">
                                    <button 
                                        onClick={() => { setIsTrashView(false); setCurrentPage(1); }}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${!isTrashView ? 'bg-white text-orange-600 shadow-sm border border-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
                                    >
                                        Activos
                                    </button>
                                    <button 
                                        onClick={() => { setIsTrashView(true); setCurrentPage(1); }}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isTrashView ? 'bg-white text-red-600 shadow-sm border border-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
                                    >
                                        <Trash2 size={12} /> Papelera
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white border border-neutral-100 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
                                            <th className="px-6 py-4 w-10">
                                                <button onClick={toggleAllProducts} className="text-neutral-400 hover:text-orange-600 transition-colors">
                                                    {selectedProducts.length === products.length && products.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 font-black">Producto</th>
                                            <th className="px-6 py-4 font-black">Categoría</th>
                                            <th className="px-6 py-4 font-black">Stock</th>
                                            <th className="px-6 py-4 font-black">Precio</th>
                                            <th className="px-6 py-4 font-black text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {products.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-20 text-center text-neutral-300">
                                                    <p className="uppercase text-[10px] font-bold tracking-[0.2em]">No hay productos registrados</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            products.map((p) => (
                                                <tr key={p.id} className={`hover:bg-neutral-50/50 transition-colors group ${selectedProducts.includes(p.id) ? 'bg-orange-50/30' : ''}`}>
                                                    <td className="px-6 py-5">
                                                        <button onClick={() => toggleProductSelection(p.id)} className={`${selectedProducts.includes(p.id) ? 'text-orange-600' : 'text-neutral-200 group-hover:text-neutral-400'} transition-colors`}>
                                                            {selectedProducts.includes(p.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-neutral-100 rounded-none overflow-hidden flex items-center justify-center">
                                                                {p.images && p.images !== 'null' && safeParseArray(p.images).length > 0 ? (
                                                                    <img src={safeParseArray(p.images)[0]} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <ImageIcon size={16} className="text-neutral-300" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-neutral-800">{p.name}</p>
                                                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{p.sku || 'SIN SKU'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-2 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                                            {p.category?.name || 'Varios'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`text-xs font-bold ${p.stock < 5 ? 'text-red-500' : 'text-neutral-600'}`}>
                                                            {p.stock} uds.
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-black text-neutral-900">${p.price.toFixed(2)}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            {isTrashView ? (
                                                                <button onClick={() => handleRestore(p.id)} className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                                    <span>Restaurar</span>
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
                                {/* Pagination Controls */}
                                <div className="p-6 border-t border-neutral-100 flex items-center justify-between bg-white text-xs">
                                    <p className="text-neutral-500 font-medium">Mostrando <span className="text-neutral-900 font-bold">{products.length}</span> de <span className="text-neutral-900 font-bold">{totalProducts}</span> productos</p>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            disabled={currentPage <= 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            className="px-4 py-2 border border-neutral-200 text-neutral-400 hover:text-orange-600 hover:border-orange-600 disabled:opacity-30 disabled:hover:text-neutral-400 disabled:hover:border-neutral-200 transition-all font-bold uppercase tracking-widest text-[9px]"
                                        >
                                            Anterior
                                        </button>
                                        <div className="flex items-center justify-center px-4 font-black text-neutral-800">
                                            {currentPage} / {Math.ceil(totalProducts / pageSize) || 1}
                                        </div>
                                        <button 
                                            disabled={currentPage >= Math.ceil(totalProducts / pageSize)}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            className="px-4 py-2 border border-neutral-200 text-neutral-400 hover:text-orange-600 hover:border-orange-600 disabled:opacity-30 disabled:hover:text-neutral-400 disabled:hover:border-neutral-200 transition-all font-bold uppercase tracking-widest text-[9px]"
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
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Colección:</span>
                                                    <select 
                                                        onChange={(e) => handleBulkUpdateCollection(e.target.value || null)}
                                                        className="bg-neutral-800 border-none text-[10px] font-bold uppercase tracking-widest px-4 py-2 outline-none cursor-pointer hover:bg-neutral-700 transition-colors"
                                                    >
                                                        <option value="">Cambiar a...</option>
                                                        <option value="none">Sin Colección</option>
                                                        {metadata.collections.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
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
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Envío y Moneda */}
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
                                        <input
                                            type="number"
                                            value={storeSettings.shippingCost}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, shippingCost: Number(e.target.value) })}
                                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm font-bold outline-none text-orange-600"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Envío Gratis Desde (Monto)</label>
                                        <input
                                            type="number"
                                            value={storeSettings.freeShippingThreshold}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Banner Promocional */}
                                <div className="bg-white border border-neutral-100 p-8 space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 flex items-center gap-2"><Star size={16} className="text-yellow-500" /> Notificación Superior</h3>
                                        <Toggle
                                            label="Activar"
                                            icon=""
                                            checked={storeSettings.bannerActive}
                                            onChange={(v) => setStoreSettings({ ...storeSettings, bannerActive: v })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Texto del Banner</label>
                                        <textarea
                                            rows={3}
                                            disabled={!storeSettings.bannerActive}
                                            value={storeSettings.bannerText}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, bannerText: e.target.value })}
                                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm outline-none resize-none disabled:opacity-50"
                                            placeholder="Ej: ¡Envío Gratis por compras superiores a $100!"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white border border-neutral-100 p-8 space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-6 flex items-center gap-2"><CreditCard size={16} className="text-orange-600" /> Pasarelas de Pago</h3>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className={`flex-1 border p-6 flex items-center justify-between transition-colors ${storeSettings.paymentMethods.bankTransfer ? 'border-orange-600 bg-orange-50/10' : 'border-neutral-100'}`}>
                                        <div>
                                            <p className="font-bold text-neutral-800">Transferencia Bancaria</p>
                                            <p className="text-xs text-neutral-500 mt-1">Manual offline</p>
                                        </div>
                                        <Toggle label="" icon="" checked={storeSettings.paymentMethods.bankTransfer} onChange={(v) => setStoreSettings({
                                            ...storeSettings, paymentMethods: { ...storeSettings.paymentMethods, bankTransfer: v }
                                        })} />
                                    </div>

                                    <div className={`flex-1 border p-6 flex items-center justify-between transition-colors ${storeSettings.paymentMethods.cashOnDelivery ? 'border-orange-600 bg-orange-50/10' : 'border-neutral-100'}`}>
                                        <div>
                                            <p className="font-bold text-neutral-800">Pago Contra Entrega</p>
                                            <p className="text-xs text-neutral-500 mt-1">Efectivo al recibir</p>
                                        </div>
                                        <Toggle label="" icon="" checked={storeSettings.paymentMethods.cashOnDelivery} onChange={(v) => setStoreSettings({
                                            ...storeSettings, paymentMethods: { ...storeSettings.paymentMethods, cashOnDelivery: v }
                                        })} />
                                    </div>

                                    <div className={`flex-1 border p-6 flex items-center justify-between transition-colors ${storeSettings.paymentMethods.creditCard ? 'border-orange-600 bg-orange-50/10' : 'border-neutral-100'}`}>
                                        <div>
                                            <p className="font-bold text-neutral-800">Tarjetas y Pasarela</p>
                                            <p className="text-xs text-neutral-500 mt-1">Stripe / Webpay</p>
                                        </div>
                                        <Toggle label="" icon="" checked={storeSettings.paymentMethods.creditCard} onChange={(v) => setStoreSettings({
                                            ...storeSettings, paymentMethods: { ...storeSettings.paymentMethods, creditCard: v }
                                        })} />
                                    </div>
                                </div>
                            </div>

                            {/* AJUSTES DE MANTENIMIENTO */}
                            <div className="bg-white border border-neutral-100 p-8 mt-12 bg-neutral-50/10">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-800 mb-8 flex items-center gap-3">
                                    <Settings size={18} className="text-red-600" /> 
                                    Mantenimiento Automático del Catálogo
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2 text-rose-600">
                                            <Trash2 size={16} />
                                            <span className="text-[10px] uppercase font-black tracking-widest">Poda de Duplicados Pro</span>
                                        </div>
                                        <p className="text-[11px] text-neutral-500 leading-relaxed font-bold uppercase tracking-tighter italic opacity-70">
                                            Elimina productos 100% idénticos (Nombre, Precio, Imágenes). El sistema mantendrá solo la entrada más reciente.
                                        </p>
                                        <button 
                                            onClick={async () => {
                                                if(confirm("¿Seguro que quieres eliminar duplicados exactos?")) {
                                                    setIsCleaning(true);
                                                    try {
                                                        await cleanupDuplicateProducts();
                                                        await refreshData();
                                                        alert("Catálogo saneado con éxito.");
                                                    } finally {
                                                        setIsCleaning(false);
                                                    }
                                                }
                                            }}
                                            disabled={isCleaning}
                                            className="w-full bg-rose-50 text-rose-600 border border-rose-100 px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {isCleaning ? 'Limpiando...' : 'Borrar Productos Duplicados'}
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2 text-indigo-600">
                                            <ShoppingBag size={16} />
                                            <span className="text-[10px] uppercase font-black tracking-widest">Proveedores en Catálogo</span>
                                        </div>
                                        <div className="bg-white border border-neutral-100 divide-y divide-neutral-100 max-h-48 overflow-y-auto">
                                            {providerStats.length > 0 ? providerStats.map((s, i) => (
                                                <div key={i} className="p-4 flex justify-between items-center hover:bg-neutral-50 transition-colors">
                                                    <span className="text-[11px] font-black text-neutral-800 uppercase tracking-tight truncate">{s.name}</span>
                                                    <span className="bg-indigo-600 text-white px-2 py-0.5 text-[9px] font-black">{s.count} uds.</span>
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center text-[10px] text-neutral-400 font-bold uppercase italic">Detectando orígenes...</div>
                                            )}
                                        </div>
                                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest text-center">Datos basados en el origen de las imágenes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-8">
                                <button
                                    onClick={saveSettings}
                                    disabled={loading}
                                    className="bg-neutral-900 text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-colors shadow-lg"
                                >
                                    Guardar Ajustes de Tienda
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
    const [data, setData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || '',
        description: initialData?.description || '',
        image: initialData?.image || '',
        isVisible: initialData?.isVisible ?? true
    })
    
    // Find products currently assigned to this category/collection
    const assignedProducts = allProducts.filter(p => type === 'category' ? p.categoryId === data.id : p.collectionId === data.id).map(p => p.id)
    const [selectedProducts, setSelectedProducts] = useState<string[]>(assignedProducts)
    
    const handleSubmit = async () => {
        setLoading(true)
        try {
            if (type === 'category') {
                await saveCategory(data.id, data, selectedProducts)
            } else {
                await saveCollection(data.id, data, selectedProducts)
            }
            onSaved()
        } catch (error) {
            alert("Error al guardar")
        } finally {
            setLoading(false)
        }
    }

    const toggleProduct = (id: string) => {
        setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-white border-b border-neutral-100 p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tighter">Editar {type === 'category' ? 'Categoría' : 'Colección'}</h2>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Configuración Avanzada</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 transition-colors">
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
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
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            placeholder="Descripción opcional..."
                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm font-medium outline-none border-b-2 border-transparent focus:border-orange-500 transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">URL de Imagen</label>
                        <input 
                            type="text"
                            value={data.image}
                            onChange={(e) => setData({ ...data, image: e.target.value })}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm outline-none border-b-2 border-transparent focus:border-orange-500 transition-all font-mono"
                        />
                        {data.image && (
                            <div className="mt-4 border border-neutral-100 w-32 h-32 overflow-hidden flex items-center justify-center bg-neutral-50">
                                <img src={data.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-neutral-100">
                        <Toggle 
                            label="Visible en la Tienda Web" 
                            icon={<Globe size={14} />} 
                            checked={data.isVisible} 
                            onChange={(v) => setData({ ...data, isVisible: v })} 
                        />
                    </div>

                    <div className="pt-6 border-t border-neutral-100 border-dashed">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider flex items-center gap-2">
                                <Box size={14} /> Productos Asignados ({selectedProducts.length})
                            </label>
                        </div>
                        <div className="bg-neutral-50 border border-neutral-100 max-h-64 overflow-y-auto">
                            {allProducts.length === 0 ? (
                                <p className="text-center py-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">No hay productos en tu catálogo</p>
                            ) : (
                                <ul className="divide-y divide-neutral-100">
                                    {allProducts.map(p => {
                                        const isSelected = selectedProducts.includes(p.id)
                                        return (
                                            <li key={p.id} className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${isSelected ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-white'}`} onClick={() => toggleProduct(p.id)}>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`${isSelected ? 'text-orange-600' : 'text-neutral-300'}`}>
                                                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-neutral-800">{p.name}</p>
                                                        <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">{p.sku || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-6 flex gap-3 z-10">
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
