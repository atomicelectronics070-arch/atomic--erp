"use client"

import { Target, Award, Download } from "lucide-react"
import FinanceManager from "./FinanceManager"
import PaymentTickets from "@/components/PaymentTickets"

export default function FinanceTrackerPage() {
    return (
        <div className="space-y-12 pb-20">
            {/* Professional Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Gestión de <span className="text-orange-600">Finanzas & Liquidación</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">Control operativo de nivel industrial para ventas, costos y comisiones netas.</p>
                </div>
                <button className="bg-white border border-neutral-200 text-neutral-900 font-bold py-4 px-8 rounded-none flex items-center shadow-premium transition-all hover:bg-neutral-50 active:scale-95 text-xs uppercase tracking-widest space-x-2">
                    <Download size={16} className="text-orange-600" />
                    <span>Exportar Reporte Maestro</span>
                </button>
            </div>

            {/* Finance Management Mini-Platform */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <FinanceManager />
            </div>

            {/* Payment Tickets Section */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <PaymentTickets />
            </div>
        </div>
    )
}





