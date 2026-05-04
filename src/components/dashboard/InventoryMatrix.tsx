"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ShoppingBag, Tag, Search, Filter, ArrowRight, Save, X, 
    RefreshCw, Layers, Edit, DollarSign, PieChart, 
    TrendingUp, TrendingDown, AlertCircle, CheckSquare, Square,
    ChevronDown, Zap, ShieldCheck, Briefcase, Calculator, BarChart3
} from "lucide-react"
import { CyberCard, NeonButton, CyberInput, GlassPanel } from "@/components/ui/CyberUI"
import { bulkUpdateProducts } from "@/lib/actions/shop"

interface Product {
    id: string
    name: string
    sku: string | null
    buyPrice: number | null
    price: number
    stock: number
    provider: string | null
    category?: { name: string }
    images: string | null
}

interface MarginRule {
    id: string
    minCost: number
    maxCost: number
    margin: number // percentage
}

interface InventoryMatrixProps {
    initialProducts: Product[]
    providers: string[]
    onRefresh: () => void
}

export default function InventoryMatrix({ initialProducts, providers, onRefresh }: InventoryMatrixProps) {
    const [search, setSearch] = useState("")
    const [providerFilter, setProviderFilter] = useState("all")
    const [costRange, setCostRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 })
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [showRules, setShowRules] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [rules, setRules] = useState<MarginRule[]>([
        { id: '1', minCost: 0, maxCost: 100, margin: 65 },
        { id: '2', minCost: 100, maxCost: 500, margin: 30 },
        { id: '3', minCost: 500, maxCost: 5000, margin: 12 }
    ])
    const [isUpdating, setIsUpdating] = useState(false)

    // Provider Intelligence Logic
    const providerAnalytics = useMemo(() => {
        const stats: Record<string, {
            count: number,
            totalProfit: number,
            avgMargin: number,
            over10: number,
            over1000: number,
            totalCost: number
        }> = {}

        initialProducts.forEach(p => {
            const provider = p.provider || "SISTEMA"
            if (!stats[provider]) {
                stats[provider] = { count: 0, totalProfit: 0, avgMargin: 0, over10: 0, over1000: 0, totalCost: 0 }
            }
            const s = stats[provider]
            const cost = p.buyPrice || 0
            const profit = p.price - cost
            
            s.count++
            s.totalProfit += profit
            s.totalCost += cost
            if (p.price > 10) s.over10++
            if (p.price > 1000) s.over1000++
        })

        // Calculate averages
        return Object.entries(stats).map(([name, s]: [string, any]) => ({
            name,
            ...s,
            avgMargin: s.count > 0 ? (s.totalProfit / (s.totalProfit + s.totalCost)) * 100 : 0
        })).sort((a: any, b: any) => b.totalProfit - a.totalProfit)
    }, [initialProducts])

    // Filtration Logic
    const filteredProducts = useMemo(() => {
        return initialProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku?.toLowerCase().includes(search.toLowerCase()))
            const matchesProvider = providerFilter === "all" || p.provider === providerFilter
            const cost = p.buyPrice || 0
            const matchesCost = cost >= costRange.min && cost <= costRange.max
            return matchesSearch && matchesProvider && matchesCost
        })
    }, [initialProducts, search, providerFilter, costRange])

    const stats = useMemo(() => {
        const totalCost = filteredProducts.reduce((acc: number, p: any) => acc + (p.buyPrice || 0), 0)
        const totalPVP = filteredProducts.reduce((acc: number, p: any) => acc + p.price, 0)
        const avgMargin = filteredProducts.length > 0 
            ? filteredProducts.reduce((acc: number, p: any) => {
                const cost = p.buyPrice || 0
                if (cost === 0) return acc + 100
                return acc + ((p.price - cost) / p.price) * 100
              }, 0) / filteredProducts.length
            : 0
        return { totalCost, totalPVP, avgMargin }
    }, [filteredProducts])

    const handleApplyRules = async (toSelected = false) => {
        const targets = toSelected ? initialProducts.filter((p: any) => selectedIds.includes(p.id)) : filteredProducts
        if (!confirm(`\u00bfSeguro que quieres actualizar el precio de ${targets.length} productos basado en las reglas de margen?`)) return
        
        setIsUpdating(true)
        try {
            const updates = targets.map((p: any) => {
                const cost = p.buyPrice || 0
                const rule = rules.find((r: any) => cost >= r.minCost && cost < r.maxCost)
                const margin = rule ? rule.margin : 15 // Default margin if no rule
                // Price = Cost / (1 - margin/100) -> Standard retail margin formula
                // Or Price = Cost * (1 + margin/100) -> Markup formula. 
                // User mentioned 65%-12% which usually implies markup for these values in ERPs.
                const newPrice = cost * (1 + (margin / 100))
                return { id: p.id, data: { price: Number(newPrice.toFixed(2)) } }
            })

            // Run bulk updates in chunks if needed, but here we assume bulkUpdateProducts handles it
            for (const update of updates) {
                await bulkUpdateProducts([update.id], update.data)
            }
            
            alert("Sincronizaci\u00f3n de precios completada.")
            onRefresh()
            setSelectedIds([])
        } catch (e) {
            console.error(e)
            alert("Error durante la actualizaci\u00f3n masiva.")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleProviderMargin = async (providerName: string) => {
        const marginStr = prompt(`Definir nuevo margen (%) para el proveedor ${providerName}:`, "30")
        if (!marginStr) return
        const margin = parseFloat(marginStr)
        if (isNaN(margin)) return

        const targets = initialProducts.filter(p => p.provider === providerName)
        if (!confirm(`¿Actualizar precios de ${targets.length} productos de ${providerName} con un margen del ${margin}%?`)) return

        setIsUpdating(true)
        try {
            for (const p of targets) {
                const cost = p.buyPrice || 0
                const newPrice = cost * (1 + (margin / 100))
                await bulkUpdateProducts([p.id], { price: Number(newPrice.toFixed(2)) })
            }
            alert(`Sincronización de ${providerName} completada exitosamente.`)
            onRefresh()
        } catch (e) {
            console.error(e)
            alert("Error en la sincronización masiva.")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="space-y-10">
            {/* Upper Matrix Control */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <GlassPanel className="col-span-1 lg:col-span-3 p-8 rounded-none border-white/5 !bg-slate-950/40 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary shadow-[0_0_15px_rgba(255,99,71,0.5)]"></div>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                            <input 
                                type="text"
                                placeholder="BÚSQUEDA BRUTAL: SKU, NOMBRE, PROVEEDOR..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 pl-16 pr-6 py-5 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-secondary transition-all italic"
                            />
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <select 
                                value={providerFilter}
                                onChange={(e) => setProviderFilter(e.target.value)}
                                className="bg-slate-900 border border-white/10 px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 outline-none focus:border-secondary italic"
                            >
                                <option value="all">TODOS LOS PROVEEDORES</option>
                                {providers.map((p: any) => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <button 
                                onClick={() => setShowRules(!showRules)}
                                className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${showRules ? 'bg-secondary text-white' : 'bg-slate-900 text-slate-500 border border-white/10 hover:border-secondary/50'}`}
                            >
                                <Calculator size={16} /> REGLAS IA
                            </button>
                            <button 
                                onClick={() => setShowStats(!showStats)}
                                className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${showStats ? 'bg-azure-500 text-white' : 'bg-slate-900 text-slate-500 border border-white/10 hover:border-azure-500/50'}`}
                            >
                                <PieChart size={16} /> PROVIDER INTEL
                            </button>
                        </div>
                    </div>
                </GlassPanel>

                <div className="glass-panel p-8 rounded-none border-white/5 !bg-secondary/5 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={60} className="text-secondary" />
                    </div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 italic">Margen Promedio</p>
                    <div className="flex items-end gap-3">
                        <h4 className="text-4xl font-black text-white italic tracking-tighter">{stats.avgMargin.toFixed(1)}%</h4>
                        <span className="text-[10px] font-bold text-emerald-400 mb-2 flex items-center gap-1"><TrendingUp size={12}/> +2.4%</span>
                    </div>
                </div>
            </div>

            {/* Provider Intelligence Analytics */}
            <AnimatePresence>
                {showStats && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass-panel p-10 border-white/5 !bg-slate-950/60 rounded-none mb-10">
                            <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                                <BarChart3 size={24} className="text-azure-400" />
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic">Análisis de Rentabilidad por Proveedor</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {providerAnalytics.map((stat: any, i: number) => (
                                    <div key={i} className="bg-slate-900/50 border border-white/5 p-8 relative group hover:border-azure-500/30 transition-all">
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">#{i+1} RENDIMIENTO</span>
                                        </div>
                                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic mb-8 border-b border-white/5 pb-4">{stat.name}</h4>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Beneficio Total</p>
                                                <p className="text-lg font-black text-emerald-400 italic">${stat.totalProfit.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Margen Promedio</p>
                                                <p className="text-lg font-black text-azure-400 italic">{stat.avgMargin.toFixed(1)}%</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Items &gt; $10</p>
                                                <p className="text-base font-black text-white italic">{stat.over10} <span className="text-[8px] opacity-30 italic font-bold uppercase">Uds</span></p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Items &gt; $1000</p>
                                                <p className="text-base font-black text-secondary italic">{stat.over1000} <span className="text-[8px] opacity-30 italic font-bold uppercase">Uds</span></p>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{stat.count} Productos Totales</span>
                                                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-azure-500" style={{ width: `${Math.min(100, (stat.totalProfit / 10000) * 100)}%` }}></div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleProviderMargin(stat.name)}
                                                disabled={isUpdating}
                                                className="w-full bg-azure-600/10 border border-azure-500/20 text-azure-400 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-azure-600 hover:text-white transition-all italic"
                                            >
                                                {isUpdating ? 'PROCESANDO...' : 'RE-MARGEN GLOBAL'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rules Editor */}
            <AnimatePresence>
                {showRules && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass-panel p-10 border-white/5 !bg-slate-950/60 rounded-none mb-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 italic">
                                    <ShieldCheck size={20} className="text-secondary" /> 
                                    Configuraci\u00f3n de Márgenes Escalonados
                                </h3>
                                <button onClick={() => setRules([...rules, { id: Date.now().toString(), minCost: 0, maxCost: 0, margin: 0 }])} className="text-[10px] font-black text-secondary hover:underline uppercase tracking-widest">A\u00f1adir Rango_CMD</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {rules.map((rule: any, idx: number) => (
                                    <div key={rule.id} className="bg-slate-900/50 p-6 border border-white/5 relative group">
                                        <button onClick={() => setRules(rules.filter((r: any) => r.id !== rule.id))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Rango {idx + 1}</span>
                                                <span className="text-[10px] font-black text-secondary">{rule.margin}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="number" value={rule.minCost} onChange={e => {
                                                    const newRules = [...rules];
                                                    newRules[idx].minCost = Number(e.target.value);
                                                    setRules(newRules);
                                                }} className="w-full bg-black/40 border border-white/5 p-2 text-[10px] text-white outline-none focus:border-secondary" placeholder="Min $"/>
                                                <span className="text-slate-800">-</span>
                                                <input type="number" value={rule.maxCost} onChange={e => {
                                                    const newRules = [...rules];
                                                    newRules[idx].maxCost = Number(e.target.value);
                                                    setRules(newRules);
                                                }} className="w-full bg-black/40 border border-white/5 p-2 text-[10px] text-white outline-none focus:border-secondary" placeholder="Max $"/>
                                            </div>
                                            <div className="relative">
                                                <input type="range" min="1" max="100" value={rule.margin} onChange={e => {
                                                    const newRules = [...rules];
                                                    newRules[idx].margin = Number(e.target.value);
                                                    setRules(newRules);
                                                }} className="w-full h-1 bg-slate-800 appearance-none cursor-pointer accent-secondary"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center border-2 border-dashed border-white/5 hover:border-secondary/20 transition-all group">
                                    <button onClick={() => handleApplyRules()} className="w-full h-full p-8 text-[10px] font-black text-slate-700 group-hover:text-secondary uppercase tracking-[0.3em] flex flex-col items-center gap-4 italic transition-all">
                                        <RefreshCw size={24} className={isUpdating ? 'animate-spin text-secondary' : ''} />
                                        {isUpdating ? 'Sincronizando...' : 'Ejecutar Sincronización Global'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Matrix Table */}
            <div className="glass-panel rounded-none border-white/5 !bg-slate-950/40 backdrop-blur-3xl overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
                                <th className="px-8 py-8 w-16">
                                    <button onClick={() => setSelectedIds(selectedIds.length === filteredProducts.length ? [] : filteredProducts.map((p: any) => p.id))} className="text-slate-800 hover:text-secondary transition-colors">
                                        {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 ? <CheckSquare size={18} className="text-secondary" /> : <Square size={18} />}
                                    </button>
                                </th>
                                <th className="px-8 py-8">Producto / Referencia</th>
                                <th className="px-8 py-8">Proveedor</th>
                                <th className="px-8 py-8">Costo Base</th>
                                <th className="px-8 py-8">Margen %</th>
                                <th className="px-8 py-8">Precio PVP</th>
                                <th className="px-8 py-8">Stock</th>
                                <th className="px-8 py-8 text-right pr-12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-40 text-center opacity-20 flex flex-col items-center gap-6">
                                        <Layers size={60} className="text-slate-500" />
                                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic">C\u00e1mara de Matrix Vac\u00eda</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p: any) => {
                                    const cost = p.buyPrice || 0
                                    const profit = p.price - cost
                                    const marginPercent = p.price > 0 ? (profit / p.price) * 100 : 0
                                    const isLowMargin = marginPercent < 15
                                    
                                    return (
                                        <tr key={p.id} className={`hover:bg-white/[0.04] transition-all group ${selectedIds.includes(p.id) ? 'bg-secondary/5' : ''}`}>
                                            <td className="px-8 py-6">
                                                <button onClick={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} className={`transition-all ${selectedIds.includes(p.id) ? 'text-secondary scale-110' : 'text-slate-800 hover:text-slate-600'}`}>
                                                    {selectedIds.includes(p.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                                </button>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-900 border border-white/5 flex items-center justify-center shrink-0">
                                                        {p.images && p.images !== 'null' ? (
                                                            <img src={JSON.parse(p.images)[0]} className="w-full h-full object-contain" />
                                                        ) : <ShoppingBag size={14} className="text-slate-800" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-white italic uppercase tracking-tighter line-clamp-1">{p.name}</p>
                                                        <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{p.sku || 'N/A PROTOCOL'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-900 px-3 py-1 border border-white/5 italic">{p.provider || 'SISTEMA'}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[11px] font-black text-slate-500 italic">${cost.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`flex items-center gap-2 text-[11px] font-black italic ${isLowMargin ? 'text-red-500' : 'text-emerald-400'}`}>
                                                    {marginPercent.toFixed(1)}%
                                                    {isLowMargin && <AlertCircle size={12} className="animate-pulse" />}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[12px] font-black text-white italic tracking-tighter">${p.price.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`text-[11px] font-black italic ${p.stock < 5 ? 'text-red-500' : 'text-white'}`}>
                                                    {p.stock} <span className="text-[8px] text-slate-600 opacity-50 uppercase ml-1">Uds</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right pr-12">
                                                <button className="p-3 bg-white/5 hover:bg-secondary text-slate-500 hover:text-white transition-all rounded-none">
                                                    <Edit size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bulk Actions Footer */}
                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-secondary p-8 flex items-center justify-between relative z-50"
                        >
                            <div className="flex items-center gap-8">
                                <div className="text-3xl font-black text-white italic tracking-tighter">{selectedIds.length}</div>
                                <div className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Elementos en Foco Táctico</div>
                            </div>
                            <div className="flex gap-6">
                                <button 
                                    onClick={() => handleApplyRules(true)}
                                    className="bg-white text-secondary px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-2xl skew-x-[-12deg]"
                                >
                                    <span className="skew-x-[12deg] block">Aplicar Reglas a Selección</span>
                                </button>
                                <button 
                                    onClick={() => setSelectedIds([])}
                                    className="bg-slate-950/20 text-white p-4 hover:bg-slate-900 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
