"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Store, ArrowRight, Activity, Percent } from "lucide-react"
import { CyberCard, NeonButton, CyberInput } from "@/components/ui/CyberUI"
import { updateStoreSettings } from "@/lib/actions/shop"

interface SupplierManagerProps {
    providers: string[]
    settings: any
    onUpdateSettings: (newSettings: any) => void
    onFilterProvider: (provider: string) => void
}

export function SupplierManager({ providers, settings, onUpdateSettings, onFilterProvider }: SupplierManagerProps) {
    const [margins, setMargins] = useState<Record<string, number>>(settings?.providerMargins || {})
    const [isSaving, setIsSaving] = useState(false)

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
        try {
            const newSettings = { ...settings, providerMargins: margins }
            await updateStoreSettings(newSettings)
            onUpdateSettings(newSettings)
        } catch (e) {
            console.error(e)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Store className="w-5 h-5 text-purple-400" /> 
                        Proveedores y Márgenes de Ganancia
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Gestiona el % de rentabilidad por cada marca/proveedor</p>
                </div>
                <NeonButton 
                    onClick={saveMargins} 
                    disabled={isSaving}
                    variant="primary"
                >
                    <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {isSaving ? "Guardando..." : "Guardar Márgenes"}
                    </div>
                </NeonButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.map((provider) => (
                    <CyberCard key={provider} className="p-4 flex flex-col gap-3 group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all"></div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                {provider}
                            </h3>
                            <button 
                                onClick={() => onFilterProvider(provider)}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded"
                                title="Ver todos los productos de este proveedor"
                            >
                                Ver Artículos <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                        
                        <div className="mt-2">
                            <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                                <Percent className="w-3 h-3" /> Margen de Ganancia (%)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={margins[provider] ?? 0}
                                    onChange={(e) => handleMarginChange(provider, e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="Ej: 20"
                                />
                            </div>
                        </div>
                    </CyberCard>
                ))}
                
                {providers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        <Store className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No se encontraron proveedores en los productos.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
