"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Store, ArrowRight, Percent, Package, TrendingUp, AlertCircle } from "lucide-react"
import { updateStoreSettings } from "@/lib/actions/shop"

interface SupplierManagerProps {
    providers: string[]
    providerStats?: { name: string; count: number }[]
    settings: any
    onUpdateSettings: (newSettings: any) => void
    onFilterProvider: (provider: string) => void
}

export function SupplierManager({ providers, providerStats = [], settings, onUpdateSettings, onFilterProvider }: SupplierManagerProps) {
    const [margins, setMargins] = useState<Record<string, number>>(settings?.providerMargins || {})
    const [isSaving, setIsSaving] = useState(false)
    const [saveOk, setSaveOk] = useState(false)

    useEffect(() => {
        if (settings?.providerMargins) {
            setMargins(settings.providerMargins)
        }
    }, [settings])

    const handleMarginChange = (provider: string, value: string) => {
        const numValue = parseFloat(value)
        if (!isNaN(numValue) || value === '') {
            setMargins(prev => ({
                ...prev,
                [provider]: value === '' ? 0 : numValue
            }))
        }
    }

    const saveMargins = async () => {
        setIsSaving(true)
        setSaveOk(false)
        try {
            const newSettings = { ...settings, providerMargins: margins }
            await updateStoreSettings(newSettings)
            onUpdateSettings(newSettings)
            setSaveOk(true)
            setTimeout(() => setSaveOk(false), 3000)
        } catch (e) {
            console.error(e)
        } finally {
            setIsSaving(false)
        }
    }

    // Build a map from providerStats for quick lookup
    const statsMap: Record<string, number> = {}
    providerStats.forEach(s => { statsMap[s.name] = s.count })

    // Total products across all providers
    const totalProducts = providerStats.reduce((sum, s) => sum + s.count, 0)

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Store className="w-5 h-5 text-purple-400" /> 
                        Proveedores y Márgenes de Ganancia
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        {providers.length} proveedores · {totalProducts.toLocaleString()} artículos en total
                    </p>
                </div>
                <button
                    onClick={saveMargins}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
                        saveOk 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-slate-900 hover:bg-slate-100'
                    }`}
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Guardando..." : saveOk ? "¡Guardado!" : "Guardar Márgenes"}
                </button>
            </div>

            {providers.length === 0 ? (
                <div className="col-span-full py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                        <AlertCircle className="w-12 h-12 opacity-20" />
                        <p className="font-semibold">No se encontraron proveedores.</p>
                        <p className="text-xs max-w-sm">Asegúrate de que los productos tengan el campo &quot;Proveedor&quot; lleno en el catálogo.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {providers.map((provider, i) => {
                        const count = statsMap[provider] || 0
                        const margin = margins[provider] ?? 0
                        const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0

                        return (
                            <motion.div
                                key={provider}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col gap-4 group relative overflow-hidden hover:border-purple-500/40 transition-all"
                            >
                                {/* Decorative glow */}
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

                                {/* Header row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-white font-bold text-sm leading-tight">{provider}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Package className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs text-slate-400 font-medium">
                                                {count.toLocaleString()} artículos <span className="text-slate-500">({pct}%)</span>
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onFilterProvider(provider)}
                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1.5 rounded-lg transition-all"
                                        title="Ver todos los productos de este proveedor"
                                    >
                                        Ver <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.max(pct, 1)}%` }}
                                    />
                                </div>
                                
                                {/* Margin input */}
                                <div>
                                    <label className="text-[10px] text-slate-400 mb-1.5 flex items-center gap-1 font-semibold uppercase tracking-wider">
                                        <TrendingUp className="w-3 h-3" /> Margen de Ganancia
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="200"
                                            step="0.5"
                                            value={margin}
                                            onChange={(e) => handleMarginChange(provider, e.target.value)}
                                            className="w-full bg-slate-900/70 border border-slate-600 rounded-xl px-3 py-2.5 pr-8 text-white text-sm font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            placeholder="Ej: 20"
                                        />
                                    </div>
                                    {margin > 0 && (
                                        <p className="text-[10px] text-emerald-400 mt-1 font-medium">
                                            + {margin}% sobre costo de compra
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
