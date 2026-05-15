"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Package, Search, Plus, Filter, LayoutGrid, List, 
    MoreVertical, Trash2, Edit, Save, X, Image as ImageIcon,
    Box, Layout, ArrowRight, Tag
} from "lucide-react"

export default function ShopConfigPage() {
    const [view, setView] = useState<'grid'|'list'>('grid')
    const [activeTab, setActiveTab] = useState<'products'|'categories'|'collections'>('products')
    
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [collections, setCollections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // Editor States
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [editingCategory, setEditingCategory] = useState<any>(null)
    const [editingCollection, setEditingCollection] = useState<any>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [pRes, cRes, colRes] = await Promise.all([
                fetch('/api/public/shop/products'),
                fetch('/api/public/shop/categories'),
                fetch('/api/public/shop/collections')
            ])
            const pData = await pRes.json()
            const cData = await cRes.json()
            const colData = await colRes.json()
            
            setProducts(pData.products || [])
            setCategories(cData.categories || [])
            setCollections(colData.collections || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const deleteItem = async (type: string, id: string) => {
        if (!confirm(`¿Eliminar este ${type}? Esta acción es irreversible.`)) return
        try {
            await fetch(`/api/admin/shop/${type}s/${id}`, { method: 'DELETE' })
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    const saveProduct = async (data: any) => {
        try {
            const method = data.id ? 'PUT' : 'POST'
            const url = data.id ? `/api/admin/shop/products/${data.id}` : '/api/admin/shop/products'
            await fetch(url, {
                method,
                body: JSON.stringify(data)
            })
            setEditingProduct(null)
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    const saveTaxonomy = async (type: 'category' | 'collection', data: any) => {
        try {
            const method = data.id ? 'PUT' : 'POST'
            const url = data.id ? `/api/admin/shop/${type}s/${data.id}` : `/api/admin/shop/${type}s`
            await fetch(url, {
                method,
                body: JSON.stringify(data)
            })
            if (type === 'category') setEditingCategory(null)
            else setEditingCollection(null)
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    const filteredCollections = collections.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-6 bg-white px-8 pt-8 shadow-sm rounded-2xl relative z-10">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                        <Package className="text-indigo-600" size={32} /> Catálogo Shop
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">
                        Gestión centralizada de productos, categorías y colecciones.
                    </p>
                </div>
                <div className="flex gap-3">
                    {activeTab === 'products' && (
                        <button onClick={() => setEditingProduct({})} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm">
                            <Plus size={18} /> Nuevo Producto
                        </button>
                    )}
                    {activeTab === 'categories' && (
                        <button onClick={() => setEditingCategory({})} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm">
                            <Plus size={18} /> Nueva Categoría
                        </button>
                    )}
                    {activeTab === 'collections' && (
                        <button onClick={() => setEditingCollection({})} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm">
                            <Plus size={18} /> Nueva Colección
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation & Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mx-4 lg:mx-0">
                <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-full lg:w-auto">
                    {[
                        { id: 'products', label: 'Productos', icon: Box, count: products.length },
                        { id: 'categories', label: 'Categorías', icon: Layout, count: categories.length },
                        { id: 'collections', label: 'Colecciones', icon: Tag, count: collections.length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 lg:flex-none flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-[#0F172A]'
                            }`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'} />
                            <span>{tab.label}</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex w-full lg:w-auto items-center gap-4">
                    <div className="relative flex-1 lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-[#0F172A] outline-none rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-[#0F172A]'}`}>
                            <LayoutGrid size={16} />
                        </button>
                        <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-[#0F172A]'}`}>
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="mx-4 lg:mx-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cargando Catálogo...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {/* PRODUCTS VIEW */}
                        {activeTab === 'products' && (
                            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                                {filteredProducts.map(p => (
                                    <div key={p.id} className={`bg-white border border-slate-200 hover:border-indigo-300 transition-all group overflow-hidden shadow-sm hover:shadow-md rounded-2xl ${view === 'list' ? 'flex items-center p-4' : 'flex flex-col'}`}>
                                        <div className={`relative bg-slate-50 ${view === 'list' ? 'w-24 h-24 rounded-xl shrink-0' : 'w-full h-48 border-b border-slate-100'} overflow-hidden flex items-center justify-center`}>
                                            {p.images?.[0] ? (
                                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <ImageIcon size={32} className="text-slate-300" />
                                            )}
                                            {!p.isVisible && (
                                                <div className="absolute top-2 left-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                                    Oculto
                                                </div>
                                            )}
                                        </div>
                                        <div className={`p-5 flex-1 flex flex-col justify-between ${view === 'list' ? 'pl-6' : ''}`}>
                                            <div>
                                                <h3 className="text-lg font-black text-[#0F172A] leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                                                <p className="text-xs font-bold text-slate-500 mb-3">{p.sku}</p>
                                                
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-xl font-black text-indigo-600">${p.price?.toFixed(2)}</span>
                                                    {p.compareAtPrice && <span className="text-sm font-bold text-slate-400 line-through">${p.compareAtPrice?.toFixed(2)}</span>}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                <div className="text-xs font-bold text-slate-500">
                                                    Stock: <span className={p.stock > 0 ? "text-emerald-600" : "text-rose-500"}>{p.stock}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingProduct(p)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"><Edit size={16} /></button>
                                                    <button onClick={() => deleteItem('product', p.id)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* CATEGORIES VIEW */}
                        {activeTab === 'categories' && (
                            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCategories.map(c => (
                                    <div key={c.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0 text-indigo-600">
                                                {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <Layout size={24} />}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-[#0F172A] group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                                                <p className="text-xs font-bold text-slate-500 mt-1">{c._count?.products || 0} Productos</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingCategory(c)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit size={16} /></button>
                                            <button onClick={() => deleteItem('category', c.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* COLLECTIONS VIEW */}
                        {activeTab === 'collections' && (
                            <motion.div key="collections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCollections.map(c => (
                                    <div key={c.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0 text-emerald-600">
                                                {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <Tag size={24} />}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-[#0F172A] group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                                                <p className="text-xs font-bold text-slate-500 mt-1">{c._count?.products || 0} Productos</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingCollection(c)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit size={16} /></button>
                                            <button onClick={() => deleteItem('collection', c.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {editingProduct && (
                    <ProductModal 
                        initialData={editingProduct} 
                        categories={categories}
                        collections={collections}
                        onClose={() => setEditingProduct(null)} 
                        onSaved={(data) => saveProduct(data)} 
                    />
                )}
                {editingCategory && (
                    <TaxonomyModal 
                        type="category"
                        initialData={editingCategory}
                        allProducts={products}
                        onClose={() => setEditingCategory(null)}
                        onSaved={(data) => saveTaxonomy('category', data)}
                    />
                )}
                {editingCollection && (
                    <TaxonomyModal 
                        type="collection"
                        initialData={editingCollection}
                        allProducts={products}
                        onClose={() => setEditingCollection(null)}
                        onSaved={(data) => saveTaxonomy('collection', data)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function ProductModal({ initialData, categories, collections, onClose, onSaved }: { initialData: any, categories: any[], collections: any[], onClose: () => void, onSaved: (d:any)=>void }) {
    const [data, setData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || '',
        sku: initialData?.sku || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        compareAtPrice: initialData?.compareAtPrice || 0,
        stock: initialData?.stock || 0,
        images: initialData?.images || [],
        pdfUrl: initialData?.pdfUrl || '',
        categoryId: initialData?.categoryId || '',
        collectionId: initialData?.collectionId || '',
        isVisible: initialData?.isVisible ?? true,
        technicalSpecs: initialData?.technicalSpecs || '{}',
        features: initialData?.features || '[]'
    })

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative">
                <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 border-b border-slate-100 flex justify-between items-center z-10">
                    <h2 className="text-xl font-black text-[#0F172A]">{data.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><X size={20} /></button>
                </div>
                
                <div className="p-8 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre</label>
                            <input
                                type="text" value={data.name} onChange={(e) => setData({...data, name: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">SKU</label>
                            <input
                                type="text" value={data.sku} onChange={(e) => setData({...data, sku: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Descripción</label>
                        <textarea
                            value={data.description} onChange={(e) => setData({...data, description: e.target.value})} rows={3}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Precio ($)</label>
                            <input
                                type="number" step="0.01" value={data.price} onChange={(e) => setData({...data, price: parseFloat(e.target.value)})}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-black text-indigo-600 outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Precio Comp. ($)</label>
                            <input
                                type="number" step="0.01" value={data.compareAtPrice} onChange={(e) => setData({...data, compareAtPrice: parseFloat(e.target.value)})}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Stock</label>
                            <input
                                type="number" value={data.stock} onChange={(e) => setData({...data, stock: parseInt(e.target.value)})}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Categoría</label>
                            <select
                                value={data.categoryId || ''} onChange={(e) => setData({...data, categoryId: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all appearance-none"
                            >
                                <option value="">Sin Categoría</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Colección</label>
                            <select
                                value={data.collectionId || ''} onChange={(e) => setData({...data, collectionId: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all appearance-none"
                            >
                                <option value="">Sin Colección</option>
                                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Imágenes (URLs separadas por coma)</label>
                        <textarea
                            value={data.images.join(',')} onChange={(e) => setData({...data, images: e.target.value.split(',').filter(i=>i.trim()!=='')})} rows={2}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm text-[#0F172A] outline-none focus:border-indigo-500 transition-all resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <input
                            type="checkbox" checked={data.isVisible} onChange={(e) => setData({...data, isVisible: e.target.checked})}
                            className="w-5 h-5 accent-indigo-600 rounded" id="isVisible"
                        />
                        <label htmlFor="isVisible" className="text-sm font-bold text-[#0F172A] select-none cursor-pointer">Producto Visible en Tienda</label>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">Cancelar</button>
                    <button onClick={() => onSaved(data)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm">
                        Guardar Producto
                    </button>
                </div>
            </div>
        </div>
    )
}

function TaxonomyModal({ type, initialData, allProducts, onClose, onSaved }: { type: 'category' | 'collection', initialData: any, allProducts: any[], onClose: () => void, onSaved: (d:any)=>void }) {
    const [data, setData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || '',
        description: initialData?.description || '',
        image: initialData?.image || '',
        pdfUrl: initialData?.pdfUrl || '',
        isVisible: initialData?.isVisible ?? true
    })

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden relative">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
                    <h2 className="text-xl font-black text-[#0F172A]">Editar {type === 'category' ? 'Categoría' : 'Colección'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><X size={20} /></button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre</label>
                        <input
                            type="text" value={data.name} onChange={(e) => setData({...data, name: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Descripción</label>
                        <textarea
                            value={data.description} onChange={(e) => setData({...data, description: e.target.value})} rows={3}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 transition-all resize-none"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Imagen (URL)</label>
                        <input
                            type="text" value={data.image} onChange={(e) => setData({...data, image: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm text-[#0F172A] outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl mt-4">
                        <input
                            type="checkbox" checked={data.isVisible} onChange={(e) => setData({...data, isVisible: e.target.checked})}
                            className="w-5 h-5 accent-indigo-600 rounded" id="taxIsVisible"
                        />
                        <label htmlFor="taxIsVisible" className="text-sm font-bold text-[#0F172A] select-none cursor-pointer">Elemento Visible</label>
                    </div>
                </div>
                
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">Cancelar</button>
                    <button onClick={() => onSaved(data)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    )
}
