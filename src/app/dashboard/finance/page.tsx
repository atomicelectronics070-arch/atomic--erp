"use client"

import { Target, Award, Download, TrendingUp, DollarSign, PieChart } from "lucide-react"
import FinanceManager from "./FinanceManager"
import PaymentTickets from "@/components/PaymentTickets"

export default function FinanceTrackerPage() {
    return (
        <div className="space-y-16 pb-32 animate-in fade-in duration-1000 relative">
             {/* Background Orbs */}
             <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[5%] right-[-5%] w-[40%] h-[40%] rounded-none bg-azure-500/5 blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] rounded-none bg-tomato-500/3 blur-[100px]" />
            </div>

            {/* Professional Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <PieChart size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em]">INTELIGENCIA FINANCIERA</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                        GESTIÓN DE <span className="text-secondary">FINANZAS</span>
                    </h1>
                    <div className="flex items-center gap-6 mt-6">
                       <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] italic opacity-60 leading-relaxed max-w-xl">Plataforma táctica para el control de utilidades, márgenes brutos y liquidación de incentivos comerciales en tiempo real.</p>
                    </div>
                </div>
                <button className="bg-secondary text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-none active:scale-95 group italic skew-x-[-12deg]">
                    <div className="skew-x-[12deg] flex items-center gap-6">
                        <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                        <span>Exportar Reporte</span>
                    </div>
                </button>
            </div>

            {/* Finance Management Mini-Platform */}
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 relative z-10">
                <FinanceManager />
            </div>

            {/* Payment Tickets Section */}
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 relative z-10 border-t border-white/5 pt-20">
                <PaymentTickets />
            </div>
        </div>
    )
}


