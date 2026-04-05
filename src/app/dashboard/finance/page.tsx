"use client"

import { Target, Award, Download } from "lucide-react"
import FinanceManager from "./FinanceManager"
import PaymentTickets from "@/components/PaymentTickets"

export default function FinanceTrackerPage() {
    return (
        <div className="space-y-16 pb-20 animate-in fade-in duration-1000">
            {/* Professional Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-white/5 pb-14">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Gestión de <span className="text-secondary">Finanzas</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-5">
                       <div className="glass-panel !bg-secondary/10 px-4 py-1.5 rounded-full border-secondary/20">
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Tesorería Central</span>
                       </div>
                       <p className="text-slate-500 font-bold text-xs uppercase tracking-tight">Control Operativo de Liquidaciones & Comisiones Netas</p>
                    </div>
                </div>
                <button className="glass-panel !bg-slate-900 border-white/10 text-white font-black py-5 px-10 rounded-2xl flex items-center shadow-2xl transition-all hover:bg-secondary hover:text-white hover:border-secondary active:scale-95 text-[10px] uppercase tracking-[0.25em] space-x-3 group">
                    <Download size={18} className="text-secondary group-hover:text-white transition-colors" />
                    <span>Exportar Reporte Maestro</span>
                </button>
            </div>

            {/* Finance Management Mini-Platform */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
                <FinanceManager />
            </div>

            {/* Payment Tickets Section */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <PaymentTickets />
            </div>
        </div>
    )
}





