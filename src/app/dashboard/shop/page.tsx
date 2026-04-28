"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Plus, Save, Image as ImageIcon, FileText, Trash2, X, PlusCircle, Globe, LayoutGrid, List, Layers, Tag as TagIcon, Edit, Power, Star, Settings, CreditCard, Box, CheckSquare, Square, ChevronRight, ChevronDown, Search, Store, Upload, RefreshCw, Monitor, Cpu, Gamepad2, Layout, CheckCircle, ShieldAlert } from "lucide-react"
import { saveProduct, getProducts, deleteProduct, getShopMetadata, createCategory, saveCategory, createCollection, saveCollection, deleteCollection, deleteManyCollections, updateCollection, deleteManyProducts, updateProductsCollection, restoreProduct, restoreManyProducts, permanentDeleteManyProducts, bulkUpdateProducts, cleanupDuplicateProducts, getProviderStats, searchProductsForTaxonomy, toggleProductFeatured } from "@/lib/actions/shop"

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str || str === 'null' || str === '[]' || str === '') return fallback;
    if (Array.isArray(str)) return str.length > 0 ? str : fallback;
    if (typeof str === 'string') {
        const trimmed = str.trim();
        if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) {
            return [trimmed];
        }
        try {
            let cleaned = trimmed;
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\"/g, '"');
            }
            let parsed = JSON.parse(cleaned);
            if (typeof parsed === 'string') {
                try { parsed = JSON.parse(parsed); } catch(e) {}
            }
            if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
            if (typeof parsed === 'string' && parsed.length > 0) return [parsed];
        } catch (e) {
            const urlRegex = /(https?:\/\/[^\s"\]]+)/g;
            const matches = trimmed.match(urlRegex);
            if (matches && matches.length > 0) return matches;
        }
    }
    return fallback;
};


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
                description: "Sistemas de control, PLCs y soluciones Corporativoes de última generación.",
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
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-none bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-none bg-azure-500/5 blur-[100px]" />
            </div>

            <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10 border-b border-white/5 pb-16 relative z-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <ShoppingBag size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">E-Commerce Protocol v6.2</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                        CENTRO DE <span className="text-secondary underline decoration-secondary/30 underline-offset-8">CATÁLOGO</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Administración táctica de inventario digital, arquitecturas de taxonomía y despliegue de colecciones estratégicas para la plataforma comercial global.
                    </p>
                </motion.div>
                <div className="flex items-center gap-6 relative z-10">
                    <button
                        onClick={() => { setEditingProduct(null); setView(view === 'list' ? 'add' : 'list') }}
                        className="bg-secondary/80 text-white px-12 py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-secondary transition-all shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] rounded-none active:scale-95 italic skew-x-[-12deg] group border border-white/10"
                    >
                        <div className="skew-x-[12deg] flex items-center gap-4">
                            {view === 'list' ? (
                                <><Plus size={20} className="group-hover:rotate-90 transition-transform" /> <span>Subir Producto_CMD</span></>
                            ) : (
                                <><List size={20} /> <span>Retorno al Listado_Vect</span></>
                            )}
                        </div>
                    </button>
                    <button className="p-5 glass-panel text-slate-600 hover:text-white transition-all rounded-none border-white/5 shadow-2xl skew-x-[-12deg]">
                         <div className="skew-x-[12deg]"><Settings size={22} /></div>
                    </button>
                </div>
            </header>

            {view === 'list' ? (
                <div className="space-y-12 animate-in fade-in duration-700">
                    {/* High-End Horizontal Tabs */}
                    <div className="flex gap-4 p-3 glass-panel !bg-slate-950/40 rounded-none-[2.5rem] border-white/5 w-fit relative z-10 backdrop-blur-3xl shadow-3xl skew-x-[-6deg]">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`skew-x-[6deg] px-10 py-5 text-[10px] font-black uppercase tracking-widest transition-all rounded-none-[1.8rem] flex items-center gap-3 ${activeTab === 'products' ? 'bg-secondary text-white shadow-[0_15px_30px_-5px_rgba(255,99,71,0.4)]' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <ShoppingBag size={18} />
                            Inventario Maestro
                        </button>
                        <button
                            onClick={() => setActiveTab('catalogs')}
                            className={`skew-x-[6deg] px-10 py-5 text-[10px] font-black uppercase tracking-widest transition-all rounded-none-[1.8rem] flex items-center gap-3 ${activeTab === 'catalogs' ? 'bg-primary text-white shadow-[0_15px_30px_-5px_rgba(45,212,191,0.4)]' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <Layers size={18} />
                            Arquitecturas
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`skew-x-[6deg] px-10 py-5 text-[10px] font-black uppercase tracking-widest transition-all rounded-none-[1.8rem] flex items-center gap-3 ${activeTab === 'settings' ? 'bg-white/10 text-white shadow-2xl' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <Settings size={18} />
                            Frontend_CMD
                        </button>
                    </div>

                    {activeTab === 'products' && (
                        <div className="space-y-12 animate-in fade-in duration-700">
                            {/* Modern Stats Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 relative z-10">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-10 flex items-center gap-8 rounded-none-[3rem] border-white/5 relative overflow-hidden group backdrop-blur-3xl shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-secondary shadow-[0_0_20px_rgba(255,99,71,0.5)]"></div>
                                    <div className="p-5 bg-secondary/10 text-secondary rounded-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"><ShoppingBag size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">Items Catalogados</p>
                                        <h4 className="text-4xl font-black text-white italic tracking-tighter">{totalProducts}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-10 flex items-center gap-8 rounded-none-[3rem] border-white/5 relative overflow-hidden group backdrop-blur-3xl shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-azure-500 shadow-[0_0_20px_rgba(45,212,191,0.5)]"></div>
                                    <div className="p-5 bg-azure-500/10 text-azure-500 rounded-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"><TagIcon size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">Elementos de Categoría</p>
                                        <h4 className="text-4xl font-black text-white italic tracking-tighter">{metadata.categories.length}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-10 flex items-center gap-8 rounded-none-[3rem] border-white/5 relative overflow-hidden group backdrop-blur-3xl shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-primary shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>
                                    <div className="p-5 bg-primary/10 text-primary rounded-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"><Globe size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">Fuentes de Suministro</p>
                                        <h4 className="text-4xl font-black text-white italic tracking-tighter">{providerStats.length}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-10 flex items-center gap-8 rounded-none-[3rem] border-white/5 relative overflow-hidden group backdrop-blur-3xl shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                                    <div className="p-5 bg-emerald-500/10 text-emerald-500 rounded-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"><CheckCircle size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">En Stock_Live</p>
                                        <h4 className="text-4xl font-black text-emerald-400 italic tracking-tighter">{products.filter(p => p.stock > 0).length}</h4>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                                {/* Sidebar: Insights & Maintenance */}
                                <div className="lg:col-span-1 space-y-8 sticky top-32">
                                    <div className="glass-panel p-10 rounded-none-[3rem] border-white/5 relative overflow-hidden backdrop-blur-3xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                                        <div className="flex items-center space-x-3 text-secondary border-b border-white/5 pb-8 mb-8">
                                            <Store size={22} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.3)]" />
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">Estructura de Origen</h3>
                                        </div>
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                            {providerStats.length > 0 ? providerStats.map((s, i) => (
                                                <div key={i} className="flex justify-between items-center group cursor-default p-4 hover:bg-white/5 transition-all rounded-none border border-transparent hover:border-white/5">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase truncate pr-4 group-hover:text-secondary transition-colors italic">{s.name}</span>
                                                    <span className="text-[10px] font-black text-white bg-slate-900 px-3 py-1 rounded-none border border-white/5 shadow-xl">{s.count} <span className="opacity-40 ml-1">UDS</span></span>
                                                </div>
                                            )) : (
                                                <div className="text-[10px] text-slate-700 italic font-black uppercase text-center py-20 flex flex-col items-center gap-4">
                                                    <RefreshCw size={32} className="animate-spin opacity-20" />
                                                    Sincronizando proveedores...
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-8 border-t border-white/5 mt-8">
                                            <button 
                                                onClick={() => setActiveTab('settings')}
                                                className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-secondary transition-all flex items-center justify-center gap-3 italic"
                                            >
                                                Gesti�n de Mantenimiento <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="glass-panel p-10 rounded-none-[3rem] border-white/5 relative overflow-hidden group backdrop-blur-3xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center space-x-4 mb-8">
                                            <div className="p-3 bg-secondary/10 text-secondary rounded-none"><Trash2 size={24} /></div>
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white italic">Saneamiento Maestro</h3>
                                        </div>
                                        <p className="text-[10px] font-bold uppercase italic text-slate-500 leading-relaxed mb-10">
                                            Ejecución intensiva de eliminación de colisiones de datos y duplicidad de Elementos para optimizar el rendimiento.
                                        </p>
                                        <button 
                                            onClick={async () => {
                                                if(confirm("\u00bfEjecutar limpieza de duplicados exactos ahora?")) {
                                                    setIsCleaning(true);
                                                    try {
                                                        await cleanupDuplicateProducts();
                                                        await refreshData();
                                                        alert("Cat\u00e1logo saneado correctamente.");
                                                    } finally {
                                                        setIsCleaning(false);
                                                    }
                                                }
                                            }}
                                            disabled={isCleaning}
                                            className="w-full bg-secondary/10 text-secondary border border-secondary/30 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-white transition-all shadow-2xl rounded-none disabled:opacity-50"
                                        >
                                            {isCleaning ? 'Saneando Arquitectura...' : 'Saneamiento de Cat\u00e1logo'}
                                        </button>
                                    </div>
                                </div>

                                {/* Main Content: Search & Table */}
                                <div className="lg:col-span-3 space-y-12 relative z-10">
                                    <div className="flex flex-col md:flex-row gap-8 items-center glass-panel !bg-slate-950/40 p-6 rounded-none-[3rem] border border-white/5 shadow-3xl backdrop-blur-3xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary shadow-[0_0_15px_rgba(255,99,71,0.4)] transition-all group-focus-within:h-full"></div>
                                        <div className="flex-1 relative group w-full">
                                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={20} />
                                            <input 
                                                type="text"
                                                placeholder="B\u00daSQUEDA T\u00c1CTICA POR SKU, NOMBRE O SEGMENTO_VECT..."
                                                value={dashboardSearch}
                                                onChange={(e) => { setDashboardSearch(e.target.value); setCurrentPage(1); }}
                                                className="w-full bg-slate-950 border border-white/5 pl-20 pr-10 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-white outline-none focus:border-secondary focus:ring-8 focus:ring-secondary/5 transition-all rounded-none-[2rem] placeholder:text-slate-800 italic"
                                            />
                                        </div>
                                        <div className="flex bg-slate-950 border border-white/5 p-2 rounded-none-[2rem] w-full md:w-fit whitespace-nowrap shadow-inner skew-x-[-12deg]">
                                            <button 
                                                onClick={() => { setIsTrashView(false); setCurrentPage(1); }}
                                                className={`skew-x-[12deg] px-10 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-none-[1.5rem] ${!isTrashView ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'text-slate-600 hover:text-slate-300'}`}
                                            >
                                                Activo_OPS
                                            </button>
                                            <button 
                                                onClick={() => { setIsTrashView(true); setCurrentPage(1); }}
                                                className={`skew-x-[12deg] px-10 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-none-[1.5rem] flex items-center gap-3 ${isTrashView ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'text-slate-600 hover:text-red-400'}`}
                                            >
                                                <Trash2 size={16} /> Papelera
                                            </button>
                                        </div>
                                    </div>

                                    <div className="glass-panel rounded-none-[3.5rem] border-white/5 shadow-3xl overflow-hidden backdrop-blur-3xl relative">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 border-b border-white/5 italic">
                                                        <th className="px-10 py-10 w-20">
                                                            <button onClick={toggleAllProducts} className="text-slate-800 hover:text-secondary transition-colors">
                                                                {selectedProducts.length === products.length && products.length > 0 ? <CheckSquare size={22} className="text-secondary shadow-[0_0_10px_rgba(255,99,71,0.5)]" /> : <Square size={22} />}
                                                            </button>
                                                        </th>
                                                        <th className="px-10 py-10">Entidad / Identificador</th>
                                                        <th className="px-10 py-10">Segmentaci\u00f3n_Vect</th>
                                                        <th className="px-10 py-10">Stock Disponible</th>
                                                        <th className="px-10 py-10">Valor de Mercado</th>
                                                        <th className="px-10 py-10 text-right pr-16">Acciones_CMD</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {products.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="py-48 text-center">
                                                                <div className="flex flex-col items-center space-y-8 opacity-20 group">
                                                                    <div className="p-8 bg-white/5 rounded-none group-hover:scale-110 transition-transform duration-700">
                                                                        <ShoppingBag size={80} className="text-slate-500" />
                                                                    </div>
                                                                    <p className="uppercase text-xs font-black tracking-[0.6em] text-slate-500 italic">C\u00e1mara de Inventario Vac\u00eda</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        products.map((p) => (
                                                            <tr key={p.id} className={`hover:bg-white/[0.04] transition-all group ${selectedProducts.includes(p.id) ? 'bg-secondary/5' : ''}`}>
                                                                <td className="px-10 py-8">
                                                                    <button 
                                                                        onClick={() => toggleProductSelection(p.id)} 
                                                                        className={`transition-all duration-300 ${selectedProducts.includes(p.id) ? 'text-secondary scale-110 drop-shadow-[0_0_8px_rgba(255,99,71,0.4)]' : 'text-slate-800 hover:text-slate-600'}`}
                                                                    >
                                                                        {selectedProducts.includes(p.id) ? <CheckSquare size={22} /> : <Square size={22} />}
                                                                    </button>
                                                                </td>
                                                                <td className="px-10 py-8">
                                                                    <div className="flex items-center space-x-6">
                                                                        <div className="w-20 h-20 bg-slate-950 border border-white/5 rounded-none overflow-hidden flex items-center justify-center relative group-hover:border-secondary/30 transition-all shadow-2xl">
                                                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-40"></div>
                                                                            {p.images && p.images !== 'null' && safeParseArray(p.images).length > 0 ? (
                                                                                <img src={safeParseArray(p.images)[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                                            ) : (
                                                                                <ImageIcon size={28} className="text-slate-800" />
                                                                            )}
                                                                        </div>
                                                                        <div className="max-w-md">
                                                                            <p className="text-[14px] font-black text-white line-clamp-1 group-hover:text-secondary transition-colors italic uppercase tracking-tighter mb-1">{p.name}</p>
                                                                            <div className="flex items-center gap-4">
                                                                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">{p.sku || 'N/A \u2014 PROTOCOL_ID'}</span>
                                                                                {p.featured && <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-[0.4em] px-3 py-1 rounded-none border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]">DESTACADO</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-10 py-8">
                                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white bg-slate-950 px-5 py-2.5 rounded-none-[1.2rem] border border-white/10 shadow-3xl italic group-hover:border-primary/30 transition-all">
                                                                        {p.category?.name || 'GEN\u00c9RICO_Vect'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-10 py-8">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`w-2.5 h-2.5 rounded-none ${p.stock < 10 ? 'bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]' : (p.stock < 50 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]')}`}></div>
                                                                        <div>
                                                                            <p className="text-sm font-black text-white italic tracking-tighter">{p.stock} <span className="text-[9px] text-slate-600 ml-1 uppercase">Uds</span></p>
                                                                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Disp. Inmediata</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-10 py-8">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-lg font-black text-secondary italic tracking-tighter">${parseFloat(p.price).toLocaleString()}</span>
                                                                        {p.compareAtPrice && parseFloat(p.compareAtPrice) > 0 && (
                                                                            <span className="text-[10px] text-slate-600 line-through font-bold opacity-50 tracking-widest">${parseFloat(p.compareAtPrice).toLocaleString()}</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-10 py-8 text-right pr-16">
                                                                    <div className="flex items-center justify-end gap-5">
                                                                        {isTrashView ? (
                                                                            <button 
                                                                                onClick={() => handleRestore(p.id)}
                                                                                className="px-8 py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] rounded-none shadow-2xl active:scale-95 italic skew-x-[-12deg]"
                                                                            >
                                                                                <span className="skew-x-[12deg] block">Restaurar_Vect</span>
                                                                            </button>
                                                                        ) : (
                                                                            <>
                                                                <button 
                                                                                    onClick={() => { setEditingProduct(p); setView('edit'); }}
                                                                                    className="p-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-none border border-white/5 shadow-2xl active:scale-90 group/btn"
                                                                                >
                                                                                    <Edit size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={async () => {
                                                                                        await toggleProductFeatured(p.id, !p.featured)
                                                                                        refreshData()
                                                                                    }}
                                                                                    className={`p-4 transition-all rounded-none border shadow-2xl active:scale-90 ${
                                                                                        p.featured 
                                                                                            ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-white'
                                                                                            : 'bg-white/5 border-white/5 text-slate-700 hover:bg-yellow-500/10 hover:text-yellow-500'
                                                                                    }`}
                                                                                    title={p.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                                                                                >
                                                                                    <Star size={18} />
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => handleDelete(p.id)}
                                                                                    className="p-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all rounded-none border border-red-500/20 shadow-2xl active:scale-90 group/del"
                                                                                >
                                                                                    <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
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
                                        <div className="px-12 py-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between bg-black/20 gap-8 backdrop-blur-2xl">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">SEGMENTO {currentPage} <span className="text-slate-800 mx-2">/</span> {Math.ceil(totalProducts / pageSize) || 1} <span className="text-secondary mx-4">|</span> TOTAL {totalProducts} DESPLIEGUES</p>
                                            <div className="flex items-center space-x-6">
                                                <button 
                                                    disabled={currentPage <= 1}
                                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                                    className="px-12 py-5 glass-panel border-white/5 text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-5 transition-all font-black uppercase tracking-[0.4em] text-[10px] rounded-none active:scale-95 shadow-2xl skew-x-[-12deg]"
                                                >
                                                    <span className="skew-x-[12deg] block">Retorno_Vect</span>
                                                </button>
                                                <button 
                                                    disabled={currentPage >= Math.ceil(totalProducts / pageSize)}
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    className="px-12 py-5 bg-white/5 border border-white/10 text-slate-300 hover:text-secondary hover:border-secondary/30 disabled:opacity-5 transition-all font-black uppercase tracking-[0.4em] text-[10px] rounded-none active:scale-95 shadow-2xl skew-x-[-12deg]"
                                                >
                                                    <span className="skew-x-[12deg] block">Avance_Vect</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Elevated Bulk Actions Bar */}
                                    {selectedProducts.length > 0 && (
                                        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 glass-panel !bg-slate-950/90 text-white px-12 py-8 flex flex-wrap items-center justify-center gap-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[500] animate-in slide-in-from-bottom-10 duration-700 rounded-none-[3.5rem] border border-white/10 backdrop-blur-3xl">
                                            <div className="flex items-center space-x-6 border-r border-white/10 pr-12">
                                                <div className="w-14 h-14 bg-secondary text-white rounded-none flex items-center justify-center font-black text-2xl italic shadow-[0_0_25px_rgba(255,99,71,0.5)]">{selectedProducts.length}</div>
                                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Seleccionados</span>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                {!isTrashView ? (
                                                    <>
                                                        <button 
                                                            onClick={() => setShowBulkEdit(true)}
                                                            className="flex items-center space-x-4 bg-white/5 text-white hover:bg-white/10 px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-none border border-white/5 skew-x-[-12deg]"
                                                        >
                                                            <div className="skew-x-[12deg] flex items-center gap-4"><Edit size={16} className="text-secondary" /> <span>Edici\u00f3n T\u00e1ctica</span></div>
                                                        </button>
                                                        <button 
                                                            onClick={handleBulkDeleteProducts}
                                                            className="flex items-center space-x-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-none border border-red-500/20 skew-x-[-12deg]"
                                                        >
                                                            <div className="skew-x-[12deg] flex items-center gap-4"><Trash2 size={16} /> <span>Poda Masiva</span></div>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={handleBulkRestore}
                                                            className="flex items-center space-x-4 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-none border border-emerald-500/20 skew-x-[-12deg]"
                                                        >
                                                            <div className="skew-x-[12deg] flex items-center gap-4"><Layers size={16} /> <span>Restaurar Segmento</span></div>
                                                        </button>
                                                        <button 
                                                            onClick={handleBulkPermanentDelete}
                                                            className="flex items-center space-x-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-none border border-red-500/20 skew-x-[-12deg]"
                                                        >
                                                            <div className="skew-x-[12deg] flex items-center gap-4"><Trash2 size={16} /> <span>Eliminaci\u00f3n Terminal</span></div>
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => setSelectedProducts([])}
                                                    className="w-14 h-14 flex items-center justify-center text-slate-600 hover:text-white transition-all hover:bg-white/5 rounded-none"
                                                >
                                                    <X size={28} />
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
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {/* Quick Category/Collection Creation */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 bg-slate-950/40 p-10 rounded-none-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
                                <QuickCreate
                                    label="Arquitectura de Categoría"
                                    icon={<TagIcon size={20} className="text-secondary" />}
                                    onSave={async (name) => { await createCategory(name); refreshData(); }}
                                />
                                <QuickCreate
                                    label="Definición de Colección"
                                    icon={<Layers size={20} className="text-primary" />}
                                    onSave={async (name) => { await createCollection(name); refreshData(); }}
                                />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                <div className="glass-panel p-10 rounded-none-[3rem] border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic mb-10 border-b border-white/5 pb-8 flex items-center gap-3">
                                        <TagIcon size={18} className="text-secondary" />
                                        Jerarquía de Categorías
                                    </h3>
                                    <ul className="space-y-4">
                                        {metadata.categories.map(c => (
                                            <li key={c.id} className="flex justify-between items-center p-5 bg-slate-900/50 hover:bg-white/5 transition-all group rounded-none border border-white/5 hover:border-secondary/20">
                                                <div>
                                                    <span className="font-black text-white italic text-sm uppercase tracking-tighter group-hover:text-secondary transition-colors">{c.name}</span>
                                                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] ml-4 opacity-50">/ {c.slug}</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                                    <button onClick={() => setEditingTaxonomy({ type: 'category', data: c })} className="p-3 text-slate-400 hover:text-secondary transition-colors bg-white/5 rounded-none">
                                                        <Edit size={16} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="glass-panel p-10 rounded-none-[3rem] border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                                    <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-3">
                                            <Layers size={18} className="text-primary" />
                                            Colecciones Estratégicas
                                        </h3>
                                        {selectedCollections.length > 0 && (
                                            <button 
                                                onClick={handleBulkDeleteCollections}
                                                className="flex items-center space-x-3 text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-red-500/20"
                                            >
                                                <Trash2 size={14} />
                                                <span>Poda ({selectedCollections.length})</span>
                                            </button>
                                        )}
                                    </div>
                                    <ul className="space-y-4">
                                        {metadata.collections.length === 0 ? (
                                            <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                                                <Layers size={48} className="text-slate-500" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sin Colecciones Definidas</p>
                                            </div>
                                        ) : (
                                            metadata.collections.map(c => {
                                                const productCount = products.filter(p => p.collectionId === c.id).length;
                                                const isSelected = selectedCollections.includes(c.id);
                                                return (
                                                    <li key={c.id} className={`flex justify-between items-center p-5 transition-all group rounded-none border ${isSelected ? 'bg-secondary/10 border-secondary/30 shadow-2xl shadow-secondary/10' : 'bg-slate-900/50 border-white/5 hover:border-primary/20 hover:bg-white/5'}`}>
                                                        <div className="flex items-center space-x-5">
                                                            <button 
                                                                onClick={() => setSelectedCollections(prev => isSelected ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                                                                className={`${isSelected ? 'text-secondary' : 'text-slate-800 group-hover:text-slate-600'} transition-all`}
                                                            >
                                                                {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                                            </button>
                                                            <div>
                                                                <span className="font-black text-white italic text-sm uppercase tracking-tighter group-hover:text-primary transition-colors">{c.name}</span>
                                                                <div className="flex items-center space-x-4 mt-2">
                                                                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] opacity-50">/ {c.slug}</span>
                                                                    <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                                                                        <div className="w-1 h-1 bg-primary rounded-none"></div>
                                                                        {productCount} Despliegues
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                                            <button 
                                                                onClick={() => setEditingTaxonomy({ type: 'collection', data: c })}
                                                                className="p-3 text-slate-400 hover:text-primary transition-colors bg-white/5 rounded-none"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteCollection(c.id)}
                                                                className="p-3 text-slate-400 hover:text-red-500 transition-colors bg-white/5 rounded-none"
                                                            >
                                                                <Trash2 size={16} />
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
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                            {/* Previous settings content was already added, but I need to make sure the Mantenimiento is inside or handled neatly */}
                            
                            {/* ═══════════════════════════════════════════════════
                                SECCIÓN: BANNERS DE PÁGINA PRINCIPAL
                            ═══════════════════════════════════════════════════ */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                                    <div className="w-14 h-14 bg-secondary flex items-center justify-center rounded-none shadow-2xl shadow-secondary/20">
                                        <Layout size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-[0.3em] text-white italic">Arquitectura Hero Visual</h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">Configuración técnica de narrativa visual en el frontend público</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    <BannerConfigPanel
                                        bannerKey="software"
                                        label="División Software"
                                        icon={<Monitor size={20} className="text-secondary" />}
                                        accentColor="secondary"
                                        data={storeSettings.banners?.software || {}}
                                        allProducts={products}
                                        onChange={(d: any) => setStoreSettings((prev: any) => ({ ...prev, banners: { ...prev.banners, software: d } }))}
                                    />
                                    <BannerConfigPanel
                                        bannerKey="automation"
                                        label="División Industria"
                                        icon={<Cpu size={20} className="text-primary" />}
                                        accentColor="primary"
                                        data={storeSettings.banners?.automation || {}}
                                        allProducts={products}
                                        onChange={(d: any) => setStoreSettings((prev: any) => ({ ...prev, banners: { ...prev.banners, automation: d } }))}
                                    />
                                    <BannerConfigPanel
                                        bannerKey="gaming"
                                        label="División Consumo"
                                        icon={<Gamepad2 size={20} className="text-purple-500" />}
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
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                <div className="glass-panel p-10 rounded-none-[3rem] border-white/5 space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-4">
                                        <Box size={20} className="text-secondary" /> 
                                        Parámetros de Transacción
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Divisa Operativa Global</label>
                                        <select
                                            value={storeSettings.currency}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/5 px-8 py-5 text-xs font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-secondary transition-all appearance-none"
                                        >
                                            <option value="USD">Dólares Americanos (USD)</option>
                                            <option value="COP">Pesos Colombianos (COP)</option>
                                            <option value="MXN">Pesos Mexicanos (MXN)</option>
                                            <option value="EUR">Euros (EUR)</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2 text-wrap">Costo de Envío Base</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary font-black">$</div>
                                                <input type="number" value={storeSettings.shippingCost} onChange={(e) => setStoreSettings({ ...storeSettings, shippingCost: Number(e.target.value) })} className="w-full bg-slate-900 border border-white/5 pl-12 pr-8 py-5 text-sm font-black text-white outline-none rounded-none focus:border-secondary transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2 text-wrap">Umbral Popular (Envío Gratis)</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">$</div>
                                                <input type="number" value={storeSettings.freeShippingThreshold} onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })} className="w-full bg-slate-900 border border-white/5 pl-12 pr-8 py-5 text-sm font-black text-white outline-none rounded-none focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-panel p-10 rounded-none-[3rem] border-white/5 space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-4">
                                            <Star size={20} className="text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" /> 
                                            Difusión de Alertas Hero
                                        </h3>
                                        <Toggle label="Activo" icon="" checked={storeSettings.bannerActive} onChange={(v) => setStoreSettings({ ...storeSettings, bannerActive: v })} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Gesti�n de Mensajería Superior</label>
                                        <textarea 
                                            rows={4} 
                                            disabled={!storeSettings.bannerActive} 
                                            value={storeSettings.bannerText} 
                                            onChange={(e) => setStoreSettings({ ...storeSettings, bannerText: e.target.value })} 
                                            className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-xs font-bold text-white outline-none resize-none rounded-none-[2rem] focus:border-yellow-500 transition-all disabled:opacity-20 placeholder:text-slate-800 italic" 
                                            placeholder="Ej: DISPONIBILIDAD TÁCTICA PARA ENVÍOS NACIONALES — ATOMIC DELIVERY PROTOCOL" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ═══════════════════════════════════════════════════
                                SECCIÓN: MANTENIMIENTO TÉCNICO
                            ═══════════════════════════════════════════════════ */}
                            <div className="glass-panel p-10 rounded-none-[4rem] border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/5 blur-[100px] -ml-32 -mt-32 rounded-none"></div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic flex items-center gap-4 border-b border-white/5 pb-8 mb-12">
                                    <ShieldAlert size={20} className="text-red-500" /> 
                                    Zona de Mantenimiento Crítico
                                </h3>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                                    <div className="space-y-8">
                                        <div className="flex items-center space-x-4 text-red-500">
                                            <Trash2 size={24} />
                                            <div>
                                                <span className="text-[11px] uppercase font-black tracking-[0.2em] block">Saneamiento de Duplicados</span>
                                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed mt-1 block">Gesti�n de eliminación masiva por redundancia de metadatos.</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={async () => { if(confirm("¿Seguro que quieres ejecutar la poda de duplicados?")) { setIsCleaning(true); try { await cleanupDuplicateProducts(); await refreshData(); alert("Catálogo saneado."); } finally { setIsCleaning(false); } } }} 
                                            disabled={isCleaning} 
                                            className="w-full bg-red-600/10 text-red-500 border border-red-500/30 px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl shadow-red-600/10 rounded-none active:scale-95 disabled:opacity-20"
                                        >
                                            {isCleaning ? 'Ejecutando Poda...' : 'Iniciar Poda de Redundancia'}
                                        </button>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="flex items-center space-x-4 text-primary">
                                            <ShoppingBag size={24} />
                                            <div>
                                                <span className="text-[11px] uppercase font-black tracking-[0.2em] block">Analítica de Origen</span>
                                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed mt-1 block">Distribución cuantitativa por Etiqueta de suministro.</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-950/60 rounded-none-[2rem] border border-white/5 overflow-hidden divide-y divide-white/5 max-h-56 overflow-y-auto custom-scrollbar">
                                            {providerStats.length > 0 ? providerStats.map((s, i) => (
                                                <div key={i} className="p-5 flex justify-between items-center hover:bg-white/5 transition-colors group">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-primary transition-colors">{s.name}</span>
                                                    <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-none text-[9px] font-black uppercase tracking-tighter italic">
                                                        {s.count} <span className="text-[7px] ml-1">UNIDADES</span>
                                                    </span>
                                                </div>
                                            )) : (
                                                <div className="py-12 text-center opacity-20">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.4em]">Escaneando Orígenes...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-10">
                                <button 
                                    onClick={saveSettings} 
                                    disabled={loading} 
                                    className="bg-slate-900/80 text-white px-20 py-8 font-black uppercase tracking-[0.5em] text-[11px] hover:bg-secondary hover:text-white transition-all shadow-[0_0_100px_rgba(255,255,255,0.05)] hover:shadow-secondary/20 rounded-none-[2rem] active:scale-95 flex items-center gap-4 border border-white/10"
                                >
                                    <Save size={20} />
                                    <span>Comprometer Protocolo</span>
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
        <div className="space-y-6">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] flex items-center space-x-3 ml-2">
                {icon} <span>{label}</span>
            </label>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="IDENTIFICADOR DE SEGMENTO..."
                    className="flex-1 bg-slate-900 border border-white/5 px-8 py-5 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-secondary transition-all rounded-none placeholder:text-slate-800"
                />
                <button
                    onClick={() => { if (name) { onSave(name); setName(''); } }}
                    className="bg-slate-900/80 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all rounded-none shadow-xl active:scale-95 border border-white/10"
                >
                    Subir
                </button>
            </div>
        </div>
    )
}

// ─── BannerConfigPanel ────────────────────────────────────────────────────────
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
        <div className={`glass-panel p-8 rounded-none-[3rem] border transition-all duration-700 relative overflow-hidden group ${accentMap[accentColor] || accentMap.secondary} bg-slate-950/20 backdrop-blur-3xl`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-1000 rounded-none"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-8 border-b border-white/5 mb-8">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-none animate-pulse ${dotMap[accentColor] || dotMap.secondary} shadow-[0_0_10px_currentColor]`}></div>
                    <div className="p-3 bg-white/5 rounded-none group-hover:scale-110 transition-transform duration-500">
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">{label}</h4>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Gesti�n Hero Unit</p>
                    </div>
                </div>
                <Toggle
                    label=""
                    icon=""
                    checked={data.active ?? true}
                    onChange={(v) => onChange({ ...data, active: v })}
                />
            </div>

            <div className="space-y-8">
                {/* Image Upload */}
                <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2 italic">Etiqueta de Origen Visual</label>
                    {data.imageUrl ? (
                        <div className="relative group/img overflow-hidden rounded-none-[2rem] border border-white/10 aspect-video shadow-2xl">
                            <img src={data.imageUrl} alt="Banner" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-slate-900/80 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all rounded-none active:scale-95 border border-white/10"
                                >
                                    {uploading ? 'DESPLEGANDO...' : 'REEMPLAZAR'}
                                </button>
                                <button
                                    onClick={() => onChange({ ...data, imageUrl: '' })}
                                    className="text-red-500 text-[9px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors italic"
                                >
                                    Liberar Anclaje
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full border-4 border-dashed border-white/5 py-12 flex flex-col items-center gap-4 hover:border-secondary/20 hover:bg-secondary/5 transition-all group/upload rounded-none-[2.5rem]"
                        >
                            <div className="p-4 bg-white/5 rounded-none group-hover/upload:rotate-12 transition-transform duration-500">
                                <Upload size={28} className="text-slate-600 group-hover/upload:text-secondary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 group-hover/upload:text-white transition-colors">
                                {uploading ? 'Sincronizando...' : 'Subir Recurso Visual'}
                            </span>
                        </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={data.imageUrl || ''}
                            onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
                            placeholder="VINCULAR DIRECCIÓN REMOTA (URL)..."
                            className="w-full bg-slate-950 border border-white/5 px-6 py-4 text-[9px] font-mono text-slate-400 outline-none focus:border-secondary transition-all rounded-none italic"
                        />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Narrativa de Impacto</label>
                    <input
                        type="text"
                        value={data.title || ''}
                        onChange={(e) => onChange({ ...data, title: e.target.value })}
                        placeholder="HEADER COMERCIAL..."
                        className="w-full bg-slate-950 border border-white/5 px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white outline-none focus:border-secondary transition-all rounded-none placeholder:text-slate-800"
                    />
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Argumento de Venta</label>
                    <textarea
                        rows={2}
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        placeholder="BREVE DESCRIPCIÓN DE LA SECCIÓN..."
                        className="w-full bg-slate-950 border border-white/5 px-8 py-5 text-[10px] font-bold text-slate-400 outline-none resize-none focus:border-secondary transition-all rounded-none leading-relaxed placeholder:text-slate-800 italic"
                    />
                </div>

                {/* Products for gallery */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic">
                            Ecosistema de Productos
                        </label>
                        <span className="text-[9px] font-black bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-none italic">
                            {selectedProductIds.length} NÚCLEOS
                        </span>
                    </div>
                    <button
                        onClick={() => setShowProductPicker(v => !v)}
                        className="w-full border-2 border-dashed border-white/5 py-6 rounded-none text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-4 group/picker"
                    >
                        <Box size={16} className="group-hover/picker:text-secondary transition-colors" /> 
                        <span>{showProductPicker ? 'ACEPTAR SELECCIÓN' : 'DESPLEGAR SELECTOR'}</span>
                    </button>

                    {showProductPicker && (
                        <div className="animate-in slide-in-from-top-4 duration-500 bg-slate-900 shadow-2xl rounded-none-[2rem] border border-white/5 overflow-hidden">
                            <div className="relative group/search p-4">
                                <Search size={14} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="ESCANEAR CATÁLOGO..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-primary transition-all"
                                />
                                {searching && <RefreshCw size={12} className="absolute right-8 top-1/2 -translate-y-1/2 text-primary animate-spin" />}
                            </div>
                            <div className="max-h-56 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                                {displayList.map((p: any) => {
                                    const sel = selectedProductIds.includes(p.id)
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => toggleProduct(p)}
                                            className={`w-full flex items-center justify-between p-4 transition-all hover:bg-white/5 group/item ${sel ? 'bg-secondary/5' : ''}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-950 rounded-none overflow-hidden border border-white/5">
                                                    {safeParseArray(p.images).length > 0 ? (
                                                        <img src={safeParseArray(p.images)[0]} className="w-full h-full object-cover scale-110 group-hover/item:scale-125 transition-transform duration-700" />
                                                    ) : (
                                                        <ImageIcon size={14} className="m-auto text-slate-700" />
                                                    )}
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase line-clamp-1 block group-hover/item:text-white transition-colors">{p.name}</span>
                                                    <span className="text-[8px] font-bold text-slate-600 block uppercase tracking-widest">{p.sku || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className={`transition-all duration-500 ${sel ? 'text-secondary scale-110' : 'text-slate-800'}`}>
                                                {sel ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </div>
                                        </button>
                                    )
                                })}
                                {displayList.length === 0 && (
                                    <p className="text-center py-12 text-[9px] text-slate-600 font-black uppercase tracking-[0.5em]">Sin Coincidencias</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Selected pills */}
                    {selectedProductIds.length > 0 && !showProductPicker && (
                        <div className="flex flex-wrap gap-2 pt-4">
                            {selectedProductIds.slice(0, 5).map((id: string) => {
                                const p = allProducts.find((pr: any) => pr.id === id)
                                return p ? (
                                    <span key={id} className="bg-slate-900 border border-white/5 text-slate-300 text-[8px] font-black uppercase px-3 py-1 rounded-none flex items-center gap-3 group/pill hover:bg-secondary/10 hover:border-secondary/30 transition-all">
                                        <span className="truncate max-w-[80px]">{p.name}</span>
                                        <button onClick={() => toggleProduct(p)} className="text-slate-600 hover:text-red-500 transition-colors"><X size={10} /></button>
                                    </span>
                                ) : null
                            })}
                            {selectedProductIds.length > 5 && (
                                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest flex items-center px-2">+{selectedProductIds.length - 5} ADICIONALES</span>
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Gesti�n de Ficha Técnica</h2>
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
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Gesti�n de Edición Masiva</h2>
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
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Escriba Gesti�n de búsqueda...</p>
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


