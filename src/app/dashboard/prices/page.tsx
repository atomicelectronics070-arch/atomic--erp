"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Tag, Plus, Search, Edit2, Trash2, Save, X, 
    Package, Sparkles, Target, Zap, ShieldCheck, 
    ArrowRight, LayoutGrid, DollarSign 
} from "lucide-react"

interface Product {
    id: string
    name: string
    description: string | null
    price: number
    sku: string | null
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
        sku: ""
    })
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

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
             {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-5%] w-[35%] h-[35%] rounded-full bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <Tag size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Catálogo de Activos Dinámicos</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                        LISTA DE <span className="text-secondary underline decoration-secondary/30 underline-offset-8">PRECIOS</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Control maestro de inventario, nomenclaturas SKU y valorización estratégica de activos industriales.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null)
                        setFormData({ name: "", description: "", price: 0, sku: "" })
                        setIsModalOpen(true)
                    }}
                    className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-2xl active:scale-95 group italic skew-x-[-12deg]"
                >
                    <div className="skew-x-[12deg] flex items-center gap-4">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        <span>Inyectar Activo</span>
                    </div>
                </button>
            </div>

            {/* Main Content Container */}
            <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-[3.5rem] backdrop-blur-3xl relative z-10">
                
                {/* Dashboard Search & Stats */}
                <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10 bg-white/[0.01]">
                    <div className="relative w-full lg:w-[450px] group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="ESCANEANDO SKU O IDENTIFICADOR..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-slate-950 border border-white/5 text-xs font-black uppercase tracking-widest text-white outline-none rounded-2xl focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                        />
                    </div>
                    <div className="flex items-center gap-8 glass-panel !bg-slate-900/40 px-10 py-5 rounded-2xl border-white/5 shadow-inner">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-azure-500/10 text-azure-400 rounded-lg"><Package size={18} /></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Inventory_Core: <span className="text-white ml-2">{products.length} ACTIVOS</span></span>
                        </div>
                    </div>
                </div>

                {/* Database Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em] bg-white/[0.02]">
                            <tr>
                                <th className="px-12 py-10 italic">Activo / Referencia_SKU</th>
                                <th className="px-10 py-10 italic">Especificaciones</th>
                                <th className="px-10 py-10 text-right italic">Valor_Unitario</th>
                                <th className="px-12 py-10 text-right italic">Comandos</th>
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
                                        Zero Nodos Encontrados
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/[0.03] transition-all group">
                                        <td className="px-12 py-8">
                                            <div className="flex items-center space-x-6">
                                                <div className="w-16 h-16 bg-slate-950 border border-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all rounded-2xl shadow-inner group-hover:scale-105 duration-500">
                                                    <Tag size={24} className="group-hover:rotate-12 transition-transform" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-base tracking-tighter uppercase italic group-hover:text-secondary transition-colors">{p.name}</p>
                                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1 group-hover:text-azure-400 transition-colors">SKU: {p.sku || "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-[11px] text-slate-500 font-bold max-w-sm italic uppercase tracking-tighter line-clamp-2">
                                            {p.description || "N/A — Sin metadata descriptiva"}
                                        </td>
                                        <td className="px-10 py-8 text-right font-black text-white text-2xl italic tracking-tighter">
                                            <span className="text-secondary text-sm mr-2 not-italic">$</span>
                                            {p.price.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-12 py-8 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(p.id)
                                                        setFormData(p)
                                                        setIsModalOpen(true)
                                                    }}
                                                    className="p-4 bg-slate-900 text-slate-600 hover:text-white hover:bg-azure-500 transition-all rounded-2xl border border-white/5 shadow-2xl hover:scale-110"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-4 bg-slate-900 text-slate-600 hover:text-white hover:bg-red-500 transition-all rounded-2xl border border-white/5 shadow-2xl hover:scale-110"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
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
                            className="glass-panel !bg-slate-950/60 w-full max-w-2xl border border-white/10 shadow-[0_0_150px_rgba(0,0,0,1)] p-14 rounded-[4rem] relative z-10 backdrop-blur-3xl"
                        >
                            <div className="flex justify-between items-start mb-14 border-b border-white/5 pb-10">
                                <div className="space-y-4">
                                     <div className="flex items-center space-x-4 text-secondary">
                                        <ShieldCheck size={20} />
                                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Protocolo de Inyección</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">CONFIGURACIÓN <span className="text-secondary">PRO_ACTIVO</span></h3>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Industrial Standard Core v2.4.1 Stable</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-2xl">
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
                                            className="w-full bg-slate-950 border border-white/5 p-6 text-[15px] font-black uppercase tracking-widest text-white outline-none rounded-[2rem] focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                                            placeholder="EJ: MONITOR INDUSTRIAL 4K_MAESTRO"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">SKU de Referencia</label>
                                        <input
                                            type="text"
                                            value={formData.sku || ""}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                                            className="w-full bg-slate-950 border border-white/5 p-6 text-sm font-black uppercase tracking-widest text-azure-400 outline-none rounded-[2rem] focus:border-azure-500 transition-all shadow-inner placeholder:text-slate-900 italic"
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
                                                className="w-full bg-slate-950 border border-white/5 pl-12 pr-6 py-6 text-xl font-black text-white outline-none rounded-[2rem] focus:border-secondary transition-all shadow-inner italic"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Metadata Descriptiva</label>
                                        <textarea
                                            value={formData.description || ""}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value.toUpperCase() })}
                                            className="w-full bg-slate-950 border border-white/5 p-8 text-sm font-bold text-slate-400 h-40 outline-none rounded-[2.5rem] focus:border-secondary transition-all resize-none shadow-inner uppercase tracking-widest leading-relaxed placeholder:text-slate-900 italic custom-scrollbar"
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
                                        className="flex-[2] bg-secondary text-white font-black py-7 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-6 hover:bg-white hover:text-secondary transition-all shadow-[0_20px_60px_-10px_rgba(255,99,71,0.6)] rounded-[2.5rem] skew-x-[-12deg] group"
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
