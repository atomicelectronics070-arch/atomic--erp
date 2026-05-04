"use client"

import { useState, useEffect, useRef } from "react"
import { 
    ShoppingBag, Tag as TagIcon, Layers, Search, Plus, Trash2, Edit, Save, 
    RefreshCw, CheckSquare, Square, Box, ImageIcon, X, Layout, Monitor, 
    Cpu, Gamepad2, Globe, ShieldCheck, ChevronDown, PlusCircle, Upload, Star,
    ShieldAlert, FileText, LayoutGrid
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { NeonButton, CyberCard } from "@/components/ui/CyberUI"
import { 
    getShopMetadata, 
    saveProduct, 
    deleteProduct, 
    bulkUpdateProducts,
    searchProductsForTaxonomy,
    createCategory,
    createCollection,
    deleteCollection,
    deleteManyCollections,
    cleanupDuplicateProducts,
    getStoreSettings,
    updateStoreSettings
} from "@/lib/actions/shop"
import InventoryMatrix from "@/components/dashboard/InventoryMatrix"

// Aux function for safe array parsing
const safeParseArray = (val: any, fallback: any[] = []) => {
    if (!val) return fallback
    if (Array.isArray(val)) return val
    try { return JSON.parse(val) } catch { return fallback }
}

export default function ShopConfigPage() {
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list')
    const [activeTab, setActiveTab] = useState<'products' | 'catalogs' | 'settings'>('products')
    const [products, setProducts] = useState<any[]>([])
    const [metadata, setMetadata] = useState<any>({ categories: [], collections: [] })
    const [providerStats, setProviderStats] = useState<{name: string, count: number}[]>([])
    const [loading, setLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [showBulkEdit, setShowBulkEdit] = useState(false)
    const [editingTaxonomy, setEditingTaxonomy] = useState<{type: 'category' | 'collection', data: any} | null>(null)
    const [isCleaning, setIsCleaning] = useState(false)
    const [selectedCollections, setSelectedCollections] = useState<string[]>([])
    
    // Store Settings state
    const [storeSettings, setStoreSettings] = useState<any>({
        currency: 'USD',
        shippingCost: 0,
        freeShippingThreshold: 0,
        bannerText: '',
        bannerActive: false,
        banners: {
            software: {},
            automation: {},
            gaming: {}
        }
    })

    const refreshData = async () => {
        setLoading(true)
        try {
            const [meta, settings] = await Promise.all([
                getShopMetadata(),
                getStoreSettings()
            ])
            setProducts(meta.products)
            setMetadata({ categories: meta.categories, collections: meta.collections })
            setProviderStats(meta.providerStats)
            if (settings) setStoreSettings(settings)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshData()
    }, [])

    const saveSettings = async () => {
        setLoading(true)
        try {
            await updateStoreSettings(storeSettings)
            alert("Protocolos de configuración actualizados.")
        } catch (e) {
            alert("Error al sincronizar parámetros.")
        } finally {
            setLoading(false)
        }
    }

    const totalProducts = products.length

    return (
        <div className="space-y-16 pb-32 relative z-10">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] animate-pulse" />
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-5" />
            </div>

            <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10 border-b border-white/5 pb-16 relative z-10">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center space-x-4 mb-4 text-secondary neon-text">
                        <ShoppingBag size={20} />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">E-COMMERCE PROTOCOL V6.2 // MASTER</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">
                        CENTRO DE <span className="text-secondary">OPERACIONES</span>
                    </h1>
                </motion.div>
                <div className="flex gap-4">
                    <NeonButton variant="primary" onClick={() => { setEditingProduct(null); setView(view === 'list' ? 'add' : 'list') }}>
                        {view === 'list' ? "SUBIR PRODUCTO_CMD" : "RETORNO LISTADO"}
                    </NeonButton>
                </div>
            </header>

            {view === 'list' ? (
                <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="flex gap-4 p-2 bg-white/5 border border-white/10 w-fit backdrop-blur-3xl">
                        {['products', 'catalogs', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-10 py-4 text-[10px] font-black uppercase tracking-widest transition-all italic ${activeTab === tab ? 'bg-secondary text-white shadow-[0_0_20px_rgba(255,99,71,0.3)]' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                            >
                                {tab === 'products' ? 'Inventario Maestro' : tab === 'catalogs' ? 'Arquitecturas' : 'Frontend_CMD'}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'products' && (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 relative z-10">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-10 flex items-center gap-8 rounded-none border-white/5 relative overflow-hidden group backdrop-blur-3xl shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-secondary shadow-[0_0_20px_rgba(255,99,71,0.5)]"></div>
                                    <div className="p-5 bg-secondary/10 text-secondary rounded-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"><ShoppingBag size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">Items Catalogados</p>
                                        <h4 className="text-4xl font-black text-white italic tracking-tighter">{totalProducts}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-10 flex items-center gap-8 rounded-none border-white/5 relative overflow-hidden group backdrop-blur-3xl shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-azure-500 shadow-[0_0_20px_rgba(45,212,191,0.5)]"></div>
                                    <div className="p-5 bg-azure-500/10 text-azure-500 rounded-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"><TagIcon size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">Elementos de Categoría</p>
                                        <h4 className="text-4xl font-black text-white italic tracking-tighter">{metadata.categories.length}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-10 flex items-center gap-8 rounded-none border-white/5 relative overflow-hidden group backdrop-blur-3xl shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-primary shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>
                                    <div className="p-5 bg-primary/10 text-primary rounded-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"><Globe size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">Fuentes de Suministro</p>
                                        <h4 className="text-4xl font-black text-white italic tracking-tighter">{providerStats.length}</h4>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-10 flex items-center gap-8 rounded-none border-white/5 relative overflow-hidden group backdrop-blur-3xl shadow-2xl">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                                    <div className="p-5 bg-emerald-500/10 text-emerald-500 rounded-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"><ShieldCheck size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">Integridad Matrix</p>
                                        <h4 className="text-4xl font-black text-emerald-400 italic tracking-tighter">100%</h4>
                                    </div>
                                </motion.div>
                            </div>

                            <InventoryMatrix 
                                initialProducts={products}
                                providers={providerStats.map(s => s.name)}
                                onRefresh={refreshData}
                            />
                        </div>
                    )}

                    {activeTab === 'catalogs' && (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 bg-slate-950/40 p-10 rounded-none border border-white/5 backdrop-blur-3xl shadow-2xl">
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
                                <div className="glass-panel p-10 rounded-none border-white/5 relative overflow-hidden">
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
                                <div className="glass-panel p-10 rounded-none border-white/5 relative overflow-hidden">
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
                        <div className="space-y-16">
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

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                <div className="glass-panel p-10 rounded-none border-white/5 space-y-10 relative overflow-hidden">
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
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Costo de Envío Base</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary font-black">$</div>
                                                <input type="number" value={storeSettings.shippingCost} onChange={(e) => setStoreSettings({ ...storeSettings, shippingCost: Number(e.target.value) })} className="w-full bg-slate-900 border border-white/5 pl-12 pr-8 py-5 text-sm font-black text-white outline-none rounded-none focus:border-secondary transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Umbral Popular</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">$</div>
                                                <input type="number" value={storeSettings.freeShippingThreshold} onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })} className="w-full bg-slate-900 border border-white/5 pl-12 pr-8 py-5 text-sm font-black text-white outline-none rounded-none focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-panel p-10 rounded-none border-white/5 space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl -mr-16 -mt-16 rounded-none"></div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-4">
                                            <Star size={20} className="text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" /> 
                                            Difusión de Alertas Hero
                                        </h3>
                                        <Toggle label="Activo" icon="" checked={storeSettings.bannerActive} onChange={(v) => setStoreSettings({ ...storeSettings, bannerActive: v })} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Narrativa de Alerta</label>
                                        <textarea 
                                            rows={4} 
                                            disabled={!storeSettings.bannerActive} 
                                            value={storeSettings.bannerText} 
                                            onChange={(e) => setStoreSettings({ ...storeSettings, bannerText: e.target.value })} 
                                            className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-xs font-bold text-white outline-none resize-none rounded-none focus:border-yellow-500 transition-all disabled:opacity-20 placeholder:text-slate-800 italic" 
                                            placeholder="Mensaje de alerta..." 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-10">
                                <button 
                                    onClick={saveSettings} 
                                    disabled={loading} 
                                    className="bg-slate-900/80 text-white px-20 py-8 font-black uppercase tracking-[0.5em] text-[11px] hover:bg-secondary hover:text-white transition-all shadow-2xl rounded-none active:scale-95 flex items-center gap-4 border border-white/10"
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
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <ProductForm
                        initialData={editingProduct}
                        metadata={metadata}
                        onCancel={() => { setView('list'); setEditingProduct(null); }}
                        onSaved={() => { setView('list'); setEditingProduct(null); refreshData(); }}
                    />
                </div>
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
        <div className={`glass-panel p-8 border transition-all duration-700 relative overflow-hidden group ${accentMap[accentColor] || accentMap.secondary} bg-slate-950/20 backdrop-blur-3xl`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-1000 rounded-none"></div>
            
            <div className="flex items-center justify-between pb-8 border-b border-white/5 mb-8">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-none animate-pulse ${dotMap[accentColor] || dotMap.secondary} shadow-[0_0_10px_currentColor]`}></div>
                    <div className="p-3 bg-white/5 rounded-none group-hover:scale-110 transition-transform duration-500">
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">{label}</h4>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Gestión Hero Unit</p>
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
                <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2 italic">Etiqueta de Origen Visual</label>
                    {data.imageUrl ? (
                        <div className="relative group/img overflow-hidden border border-white/10 aspect-video shadow-2xl">
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
                            className="w-full border-4 border-dashed border-white/5 py-12 flex flex-col items-center gap-4 hover:border-secondary/20 hover:bg-secondary/5 transition-all group/upload"
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
                    <input
                        type="text"
                        value={data.imageUrl || ''}
                        onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
                        placeholder="URL..."
                        className="w-full bg-slate-950 border border-white/5 px-6 py-4 text-[9px] font-mono text-slate-400 outline-none focus:border-secondary transition-all rounded-none italic"
                    />
                </div>

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

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Argumento de Venta</label>
                    <textarea
                        rows={2}
                        value={data.description || ''}
                        onChange={(e) => onChange({ ...data, description: e.target.value })}
                        placeholder="DESCRIPCIÓN..."
                        className="w-full bg-slate-950 border border-white/5 px-8 py-5 text-[10px] font-bold text-slate-400 outline-none resize-none focus:border-secondary transition-all rounded-none leading-relaxed placeholder:text-slate-800 italic"
                    />
                </div>
            </div>
        </div>
    )
}

function ProductForm({ initialData, metadata, onCancel, onSaved }: { initialData?: any, metadata: any, onCancel: () => void, onSaved: () => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<any>({
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
            <div className="flex justify-between items-center bg-slate-950/40 p-8 border border-white/5 backdrop-blur-3xl">
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
                <div className="xl:col-span-2 space-y-12">
                    <section className="glass-panel p-10 border-white/5 space-y-10 relative overflow-hidden">
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
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">SKU</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    placeholder="SERIAL-CODE..."
                                    className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-sm font-black text-white outline-none focus:border-secondary transition-all rounded-none placeholder:text-slate-800"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2">Precio ($)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full bg-slate-900 border border-white/5 px-8 py-6 text-sm font-black text-secondary outline-none focus:border-secondary transition-all rounded-none"
                                />
                            </div>
                        </div>
                    </section>
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

function TaxonomyModal({ type, initialData, allProducts, onClose, onSaved }: { type: 'category' | 'collection', initialData: any, allProducts: any[], onClose: () => void, onSaved: () => void }) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        id: initialData?.id || null,
        name: initialData?.name || '',
        description: initialData?.description || '',
        image: initialData?.image || '',
        pdfUrl: initialData?.pdfUrl || '',
        isVisible: initialData?.isVisible ?? true
    })

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-3xl z-[200] flex items-center justify-center p-8">
            <div className="glass-panel max-w-xl w-full p-12 rounded-none border-white/5 space-y-8 relative overflow-hidden bg-slate-950">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-white uppercase italic">Editar {type === 'category' ? 'Categoría' : 'Colección'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Nombre</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className="w-full bg-slate-900 border border-white/5 px-6 py-4 text-sm font-black text-white outline-none focus:border-secondary transition-all rounded-none"
                        />
                    </div>
                </div>
                <div className="pt-8">
                    <button 
                        onClick={onSaved}
                        className="w-full bg-secondary text-white py-6 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    )
}
