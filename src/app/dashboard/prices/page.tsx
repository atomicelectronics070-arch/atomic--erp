"use client"

import { useState, useEffect } from "react"
import { Tag, Plus, Search, Edit2, Trash2, Save, X, Package } from "lucide-react"

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
        if (!confirm("¿Eliminar producto de la lista oficial?")) return
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
        <div className="space-y-12 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Lista de <span className="text-orange-600">Precios</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">Control maestro de productos, SKU y tarifas industriales.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null)
                        setFormData({ name: "", description: "", price: 0, sku: "" })
                        setIsModalOpen(true)
                    }}
                    className="bg-neutral-900 text-white px-8 py-4 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-3 hover:bg-orange-600 transition-all shadow-xl shadow-neutral-200"
                >
                    <Plus size={18} />
                    <span>Añadir Producto</span>
                </button>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-neutral-200 shadow-sm relative overflow-hidden">
                <div className="p-8 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-neutral-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                        <input
                            type="text"
                            placeholder="BUSCAR POR NOMBRE O SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-neutral-100 bg-white text-xs font-bold uppercase focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        <Package size={14} />
                        <span>Total: {products.length} Items</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] text-neutral-400 uppercase font-bold tracking-[0.2em] bg-white">
                            <tr>
                                <th className="px-8 py-6">Producto / Referencia</th>
                                <th className="px-6 py-6">Descripción</th>
                                <th className="px-6 py-6 text-right">Precio Unitario</th>
                                <th className="px-8 py-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-8 py-20 text-center font-bold text-neutral-300 uppercase animate-pulse">Cargando base de datos...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={4} className="px-8 py-20 text-center font-bold text-neutral-300 uppercase">Sin resultados encontrados</td></tr>
                            ) : (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-neutral-50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                                    <Tag size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-neutral-900 text-sm tracking-tight">{p.name}</p>
                                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{p.sku || "SIN SKU"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-xs text-neutral-500 font-medium max-w-xs truncate">
                                            {p.description || "Sin descripción"}
                                        </td>
                                        <td className="px-6 py-6 text-right font-bold text-neutral-900 text-lg">
                                            ${p.price.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(p.id)
                                                        setFormData(p)
                                                        setIsModalOpen(true)
                                                    }}
                                                    className="p-3 bg-neutral-50 text-neutral-400 hover:text-orange-600 hover:bg-white border border-transparent hover:border-neutral-100 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-3 bg-neutral-50 text-neutral-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-neutral-100 transition-all"
                                                >
                                                    <Trash2 size={16} />
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md p-6">
                    <div className="bg-white w-full max-w-xl border border-neutral-200 shadow-2xl p-12">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-neutral-100">
                            <div>
                                <h3 className="text-xl font-bold uppercase tracking-tight">Configuración de Producto</h3>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1 italic">Industrial Standards v1.0</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-50 rounded-none transition-all">
                                <X size={24} className="text-neutral-300 hover:text-neutral-900" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Nombre del Producto</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-5 text-sm font-bold uppercase focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                                        placeholder="EJ: MONITOR INDUSTRIAL 4K"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">SKU / Referencia</label>
                                    <input
                                        type="text"
                                        value={formData.sku || ""}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-5 text-sm font-bold uppercase focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                                        placeholder="AT-500-BK"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Precio (USD)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-5 text-sm font-bold focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Descripción Técnica</label>
                                    <textarea
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-5 text-sm font-medium h-32 outline-none focus:ring-2 focus:ring-orange-600 transition-all resize-none"
                                        placeholder="Detalles adicionales del producto..."
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-neutral-900 text-white font-bold py-6 uppercase tracking-[0.3em] text-[10px] flex items-center justify-center space-x-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-600/10"
                            >
                                <Save size={20} />
                                <span>Guardar en Base de Datos</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
