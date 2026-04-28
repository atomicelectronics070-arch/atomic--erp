"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Tag, Plus, Search, Edit2, Trash2, Save, X, 
    Package, Sparkles, Target, Zap, ShieldCheck, 
    ArrowRight, LayoutGrid, DollarSign, MoreVertical,
    FileUp
} from "lucide-react"

interface Product {
    id: string
    name: string
    description: string | null
    price: number
    sku: string | null
    stock: number
    provider: string | null
    categoryId: string | null
}

export default function PricesPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        description: "",
        price: 0,
        sku: "",
        stock: 0,
        provider: ""
    })
    const [filterProvider, setFilterProvider] = useState("all")
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products")
            const data = await res.json()
            setProducts(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = editingId ? "PUT" : "POST"
        const url = editingId ? `/api/products/${editingId}` : "/api/products"

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                fetchProducts()
                setIsModalOpen(false)
                setFormData({ name: "", description: "", price: 0, sku: "" })
                setEditingId(null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("⚠️ Alerta de Seguridad: ¿Eliminar este activo de la base de datos maestra?")) return
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
            if (res.ok) fetchProducts()
        } catch (error) {
            console.error(error)
        }
    }

    const providers = Array.from(new Set(products.map(p => p.provider).filter(Boolean)))

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesProvider = filterProvider === "all" || p.provider === filterProvider
        return matchesSearch && matchesProvider
    })

    const categoriesCount = Array.from(new Set(products.map(p => p.categoryId).filter(Boolean))).length
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0)

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
             {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[15%] right-[-5%] w-[40%] h-[40%] rounded-none bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-5%] w-[35%] h-[35%] rounded-none bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <Tag size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">CONTROL MAESTRO DE ACTIVOS</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                        INVENTARIO <span className="text-secondary underline decoration-secondary/30 underline-offset-8">MAESTRO</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Gestión táctica de existencias, fuentes de origen y valorización Corporativo de activos corporativos.
                    </p>
                </div>
                <div className="flex gap-6">
                    <button
                        onClick={() => {/* Mock Upload */}}
                        className="px-8 py-4 font-black uppercase tracking-[0.2em] text-[9px] flex items-center border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all rounded-none italic skew-x-[-12deg]"
                    >
                        <div className="skew-x-[12deg] flex items-center gap-4">
                            <FileUp size={18} />
                            <span>Subir Archivo</span>
                        </div>
                    </button>
                    <button
                        onClick={() => {
                            setEditingId(null)
                            setFormData({ name: "", description: "", price: 0, sku: "", stock: 0, provider: "" })
                            setIsModalOpen(true)
                        }}
                        className="bg-secondary text-white px-8 py-4 font-black uppercase tracking-[0.2em] text-[9px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-none active:scale-95 group italic skew-x-[-12deg]"
                    >
                        <div className="skew-x-[12deg] flex items-center gap-4">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                            <span>Subir Activo</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-none-[3.5rem] backdrop-blur-3xl relative z-10">
                
                {/* Dashboard Search & Stats */}
                <div className="p-8 border-b border-white/5 flex flex-col xl:flex-row justify-between items-center gap-8 bg-white/[0.01]">
                    <div className="flex flex-col lg:flex-row items-center gap-6 w-full xl:w-auto">
                        <div className="relative w-full lg:w-[350px] group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="BUSCAR SKU / ACTIVO..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-6 py-4 bg-slate-950 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                            />
                        </div>
                        <select
                            value={filterProvider}
                            onChange={(e) => setFilterProvider(e.target.value)}
                            className="w-full lg:w-56 px-6 py-4 bg-slate-950 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none rounded-none focus:border-secondary italic"
                        >
                            <option value="all">TODAS LAS FUENTES</option>
                            {providers.map(p => (
                                <option key={p} value={p!}>{p}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-8 text-[9px] font-black uppercase tracking-widest italic text-slate-500">
                        <div className="flex items-center gap-3">
                            <Package size={14} className="text-azure-400" />
                            <span>{products.length} ÍTEMS EXISTENTES</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <LayoutGrid size={14} className="text-secondary" />
                            <span>{categoriesCount} CATEGORÍAS ACTIVAS</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap size={14} className="text-emerald-400" />
                            <span>{totalStock} EN STOCK</span>
                        </div>
                    </div>
                </div>

                {/* Database Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[9px] text-slate-600 uppercase font-black tracking-[0.3em] bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="px-8 py-6 italic border-r border-white/5">ACTIVO / REFERENCIA</th>
                                <th className="px-8 py-6 italic border-r border-white/5">ORIGEN / PROVEEDOR</th>
                                <th className="px-8 py-6 italic border-r border-white/5 text-center">STOCK</th>
                                <th className="px-8 py-6 text-right italic border-r border-white/5">PVP UNITARIO</th>
                                <th className="px-8 py-6 text-right italic"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-12 py-32 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] animate-pulse italic">
                                        Sincronizando Base de Datos...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-12 py-32 text-center text-[10px] font-black text-slate-800 uppercase tracking-[0.8em] italic">
                                        Zero Elementos Encontrados
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-all group text-[10px] font-black italic border-b border-slate-100 last:border-0">
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 uppercase tracking-tighter group-hover:text-secondary transition-colors truncate max-w-[250px]">{p.name}</span>
                                                <span className="text-[7px] text-slate-400 uppercase tracking-widest">SKU: {p.sku || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <button 
                                                onClick={() => setFilterProvider(p.provider || "all")}
                                                className="text-azure-500 hover:underline uppercase tracking-widest text-[8px]"
                                            >
                                                {p.provider || "GENÉRICO"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={`${(p.stock || 0) < 5 ? 'text-red-500 bg-red-50' : 'text-slate-500 bg-slate-50'} px-2 py-0.5 border border-current/10`}>
                                                {p.stock || 0} UDS
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right text-slate-900 font-black">
                                            ${p.price.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <div className="relative group/menu">
                                                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-1 hidden group-hover/menu:block z-[100] bg-white border border-slate-200 shadow-2xl min-w-[120px] py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                        <button 
                                                            onClick={() => { setEditingId(p.id); setFormData(p); setIsModalOpen(true); }}
                                                            className="w-full text-left px-4 py-2 text-[9px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:text-azure-500 flex items-center gap-3 italic"
                                                        >
                                                            <Edit2 size={12} /> EDITAR
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(p.id)}
                                                            className="w-full text-left px-4 py-2 text-[9px] font-black uppercase text-slate-600 hover:bg-red-50 hover:text-red-500 flex items-center gap-3 italic border-t border-slate-50"
                                                        >
                                                            <Trash2 size={12} /> ELIMINAR
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Rebuilt with Glassmorphism */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-8">
                         <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" 
                            onClick={() => setIsModalOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="glass-panel !bg-slate-950/60 w-full max-w-2xl border border-white/10 shadow-[0_0_150px_rgba(0,0,0,1)] p-14 rounded-none-[4rem] relative z-10 backdrop-blur-3xl"
                        >
                            <div className="flex justify-between items-start mb-14 border-b border-white/5 pb-10">
                                <div className="space-y-4">
                                     <div className="flex items-center space-x-4 text-secondary">
                                        <ShieldCheck size={20} />
                                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Gesti�n de Inyección</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">CONFIGURACIÓN <span className="text-secondary">PRO_ACTIVO</span></h3>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Corporativo Standard Core v2.4.1 Stable</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-5 bg-slate-900 border border-white/10 rounded-none text-slate-600 hover:text-white transition-all shadow-2xl">
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Identificador del Producto</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                            className="w-full bg-slate-950 border border-white/5 p-6 text-[15px] font-black uppercase tracking-widest text-white outline-none rounded-none-[2rem] focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                                            placeholder="EJ: MONITOR Corporativo 4K_MAESTRO"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">SKU de Referencia</label>
                                        <input
                                            type="text"
                                            value={formData.sku || ""}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                                            className="w-full bg-slate-950 border border-white/5 p-6 text-sm font-black uppercase tracking-widest text-azure-400 outline-none rounded-none-[2rem] focus:border-azure-500 transition-all shadow-inner placeholder:text-slate-900 italic"
                                            placeholder="AT-G-500-BK"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Valoración Comercial (USD)</label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary font-black italic">$</div>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                className="w-full bg-slate-950 border border-white/5 pl-12 pr-6 py-6 text-xl font-black text-white outline-none rounded-none-[2rem] focus:border-secondary transition-all shadow-inner italic"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Stock Inicial</label>
                                        <input
                                            type="number"
                                            value={formData.stock || 0}
                                            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                            className="w-full bg-slate-950 border border-white/5 p-6 text-xl font-black text-emerald-400 outline-none rounded-none-[2rem] focus:border-emerald-500 transition-all shadow-inner italic"
                                        />
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Origen / Proveedor</label>
                                        <input
                                            type="text"
                                            value={formData.provider || ""}
                                            onChange={(e) => setFormData({ ...formData, provider: e.target.value.toUpperCase() })}
                                            className="w-full bg-slate-950 border border-white/5 p-6 text-sm font-black text-azure-400 uppercase tracking-widest outline-none rounded-none-[2rem] focus:border-azure-500 transition-all shadow-inner italic"
                                            placeholder="NOMBRE DEL PROVEEDOR"
                                        />
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Metadata Descriptiva</label>
                                        <textarea
                                            value={formData.description || ""}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value.toUpperCase() })}
                                            className="w-full bg-slate-950 border border-white/5 p-8 text-sm font-bold text-slate-400 h-40 outline-none rounded-none-[2.5rem] focus:border-secondary transition-all resize-none shadow-inner uppercase tracking-widest leading-relaxed placeholder:text-slate-900 italic custom-scrollbar"
                                            placeholder="ESPECIFICACIONES TÉCNICAS, GARANTÍAS O VARIABLES OPERATIVAS..."
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-6 items-center pt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-all italic"
                                    >
                                        Abortar_Config
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-secondary text-white font-black py-7 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-6 hover:bg-white hover:text-secondary transition-all shadow-[0_20px_60px_-10px_rgba(255,99,71,0.6)] rounded-none-[2.5rem] skew-x-[-12deg] group"
                                    >
                                        <div className="skew-x-[12deg] flex items-center gap-4">
                                            <Save size={24} className="group-hover:scale-110 transition-transform" />
                                            <span>Sincronizar Base de Datos</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}


