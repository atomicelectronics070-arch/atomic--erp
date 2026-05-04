"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

/**
 * REDIRECCIÓN TÁCTICA: Lista de Precios -> Inventario Maestro
 * Unificaci\u00f3n de activos en el Centro de Operaciones (Shop)
 */
export default function PricesPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirecci\u00f3n inmediata al nuevo centro de mando unificado
        router.push('/dashboard/shop')
    }, [router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-6">
            <div className="relative">
                <RefreshCw size={48} className="text-secondary animate-spin" />
                <div className="absolute inset-0 blur-xl bg-secondary/20 animate-pulse"></div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-xl font-black uppercase tracking-[0.5em] italic">Redirecci\u00f3n T\u00e1ctica</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Sincronizando con el Inventario Maestro...</p>
            </div>
        </div>
    )
}
