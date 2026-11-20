"use client"

import { PieChart, ShieldCheck, TrendingUp, Sparkles, Building2 } from "lucide-react"
import FinanceManager from "./FinanceManager"

export default function FinanceTrackerPage() {
    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] pb-32">
            
            {/* Executive SaaS Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 sm:px-8 py-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-40 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                        <PieChart size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Gestor de Finanzas & Tesorería</h1>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                                Ejercicio Fiscal 2026
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                            <span className="text-indigo-600 font-bold">Control de Flujo de Caja</span> • Asignación de Pagos a Proveedores • Multi-Adjuntos • Desglose SRI 15%
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span>Conciliación Bancaria Activa</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
                <FinanceManager />
            </div>
        </div>
    )
}
