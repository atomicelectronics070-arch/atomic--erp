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
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        GESTIÓN DE <span className="text-secondary underline decoration-secondary/30 underline-offset-8">FINANZAS</span>
                    </h1>
                    <div className="flex items-center gap-6 mt-6">
                       <div className="glass-panel !bg-secondary/10 px-6 py-2 rounded-none border border-secondary/20 shadow-[0_0_20px_rgba(255,99,71,0.15)]">
                            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] italic">Tesorería Central</span>
                       </div>
                       <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] italic">Nodos de Liquidación & Comisiones Operativas</p>
                    </div>
                </div>
                <button className="bg-secondary text-white px-12 py-6 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-none active:scale-95 group italic skew-x-[-12deg]">
                    <div className="skew-x-[12deg] flex items-center gap-6">
                        <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                        <span>Exportar Reporte Maestro</span>
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
