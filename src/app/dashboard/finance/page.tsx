"use client"

import { PieChart, Download } from "lucide-react"
import FinanceManager from "./FinanceManager"
import PaymentTickets from "@/components/PaymentTickets"

export default function FinanceTrackerPage() {
    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] pb-32">
            
            {/* SaaS Header */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border-b border-slate-200 px-8 py-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_4px_15px_rgba(0,0,0,0.3)] sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                        <PieChart size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Inteligencia Financiera</h1>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            <span className="text-indigo-600 font-bold">Gestión de Finanzas</span> • Control de utilidades e incentivos
                        </p>
                    </div>
                </div>
                
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-slate-800 transition-all flex items-center gap-2">
                    <Download size={16} /> Exportar Reporte
                </button>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 space-y-12">
                {/* Finance Management Mini-Platform */}
                <div>
                    <FinanceManager />
                </div>

                {/* Payment Tickets Section */}
                <div className="border-t border-slate-200 pt-12">
                    <PaymentTickets />
                </div>
            </div>
        </div>
    )
}
