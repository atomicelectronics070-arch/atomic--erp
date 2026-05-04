"use client"

import { useState, useEffect } from "react"
import { Trophy, DollarSign, Plus, History, Target, Award, Loader2, Zap } from "lucide-react"
import { CyberCard } from "@/components/ui/CyberUI"
import { motion, AnimatePresence } from "framer-motion"

interface RankingEntry {
    id: string
    userId: string
    currentWeekAmount: number
    historicalAmount: number
    user: {
        id: string
        name: string
        lastName: string
        profilePicture: string | null
    }
}

interface WeeklyGoal {
    amount: number
    description: string
}

export default function SalesRankingPanel({ isAdmin }: { isAdmin: boolean }) {
    const [ranking, setRanking] = useState<RankingEntry[]>([])
    const [goal, setGoal] = useState<WeeklyGoal | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    
    // Admin state
    const [newGoal, setNewGoal] = useState({ amount: "", description: "" })
    const [addAmounts, setAddAmounts] = useState<Record<string, string>>({})

    const fetchData = async () => {
        try {
            const [rankRes, goalRes] = await Promise.all([
                fetch("/api/sales-ranking"),
                fetch("/api/sales-goal")
            ])
            if (rankRes.ok) setRanking(await rankRes.json())
            if (goalRes.ok) setGoal(await goalRes.json())
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60000)
        return () => clearInterval(interval)
    }, [])

    const handleAddSales = async (userId: string) => {
        const amountStr = addAmounts[userId] || "0"
        const amount = parseFloat(amountStr)
        if (isNaN(amount) || amount === 0) return

        setUpdating(userId)
        try {
            const res = await fetch("/api/sales-ranking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, amount, mode: 'add' })
            })
            if (res.ok) {
                setAddAmounts({ ...addAmounts, [userId]: "" })
                await fetchData()
            }
        } finally {
            setUpdating(null)
        }
    }

    const handleSetGoal = async () => {
        if (!newGoal.amount) return
        try {
            const res = await fetch("/api/sales-goal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newGoal)
            })
            if (res.ok) {
                setNewGoal({ amount: "", description: "" })
                await fetchData()
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
    )

    const topSeller = ranking.length > 0 ? ranking[0] : null

    return (
        <div className="space-y-8 w-full">
            {/* WEEKLY GOAL HEADER */}
            <div className="w-full bg-[#061e1a] border-b-4 border-emerald-500 p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <DollarSign size={120} className="text-white" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                            <Zap size={12} className="text-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] italic">META COMERCIAL SEMANAL</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                            {goal && goal.amount > 0 ? (
                                <>OBJETIVO: <span className="text-emerald-400 font-black">${goal.amount.toLocaleString()}</span> <span className="text-white/20 ml-2">USD</span></>
                            ) : (
                                "SISTEMA DE METAS DE VENTA"
                            )}
                        </h2>
                        <p className="text-sm font-medium text-slate-400 uppercase italic tracking-widest max-w-xl">
                            {goal?.description || "SUPERA LA META DE VENTAS Y ASEGURA TU BONIFICACIÓN POR DESEMPEÑO."}
                        </p>
                    </div>
                </div>
            </div>

            {/* ADMIN GOAL SETTER */}
            {isAdmin && (
                <CyberCard className="!p-8 border-emerald-500/20 bg-emerald-50/5">
                    <div className="flex items-center gap-4 mb-6">
                        <Target className="text-emerald-500" size={24} />
                        <h3 className="text-sm font-black text-navy uppercase italic tracking-widest">CONFIGURAR META DE VENTAS</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <input 
                                type="number" 
                                placeholder="MONTO META $"
                                value={newGoal.amount}
                                onChange={(e) => setNewGoal({...newGoal, amount: e.target.value})}
                                className="w-full bg-white border border-slate-200 p-4 text-sm font-black text-navy outline-none focus:border-emerald-500 italic"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <input 
                                type="text" 
                                placeholder="DESCRIPCIÓN"
                                value={newGoal.description}
                                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                                className="w-full bg-white border border-slate-200 p-4 text-sm font-black text-navy outline-none focus:border-emerald-500 italic"
                            />
                        </div>
                        <button 
                            onClick={handleSetGoal}
                            className="bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest py-4 hover:bg-emerald-600 transition-all italic"
                        >
                            ESTABLECER META
                        </button>
                    </div>
                </CyberCard>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RANKING CHART */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Trophy className="text-amber-500" size={20} />
                            <h2 className="text-xl font-black text-navy uppercase italic tracking-tighter">RANKING DE VENTAS (USD)</h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {ranking.length > 0 ? (
                            ranking.map((entry: any, index: number) => (
                                <div key={entry.id} className="relative group">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-navy border border-slate-200 overflow-hidden shrink-0">
                                            {entry.user.profilePicture ? (
                                                <img src={entry.user.profilePicture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                entry.user.name?.[0] || "U"
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-end mb-1">
                                                <p className="text-[11px] font-black text-navy uppercase italic">
                                                    {index === 0 && <Award size={12} className="inline mr-1 text-amber-500 mb-0.5" />}
                                                    {entry.user.name} {entry.user.lastName}
                                                </p>
                                                <p className="text-xs font-black text-emerald-600 italic">${entry.currentWeekAmount.toLocaleString()} <span className="text-[8px] opacity-40 uppercase tracking-tighter">USD</span></p>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (entry.currentWeekAmount / (goal?.amount || 1)) * 100)}%` }}
                                                    className={`h-full ${index === 0 ? 'bg-emerald-500' : 'bg-emerald-400'} relative`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* ADMIN ADD SALES */}
                                    {isAdmin && (
                                        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1 border border-slate-100 z-20">
                                            <input 
                                                type="number"
                                                placeholder="+$"
                                                value={addAmounts[entry.userId] || ""}
                                                onChange={(e) => setAddAmounts({...addAmounts, [entry.userId]: e.target.value})}
                                                className="w-16 bg-white border border-slate-200 p-1 text-[10px] font-black text-navy outline-none"
                                            />
                                            <button 
                                                onClick={() => handleAddSales(entry.userId)}
                                                disabled={updating === entry.userId}
                                                className="bg-emerald-600 text-white p-1 hover:bg-emerald-700 transition-all"
                                            >
                                                {updating === entry.userId ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-12 text-[10px] font-black text-navy/20 uppercase italic tracking-widest border border-dashed border-slate-200">
                                SIN DATOS DE VENTAS ESTA SEMANA
                            </p>
                        )}
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <History className="text-navy/30" size={20} />
                        <h2 className="text-xl font-black text-navy uppercase italic tracking-tighter">TOTAL ACUMULADO</h2>
                    </div>

                    <CyberCard className="!p-6 space-y-4 bg-slate-50/50">
                        {ranking.map((entry: any) => (
                            <div key={`hist-${entry.id}`} className="flex justify-between items-center border-b border-slate-200/50 pb-3 last:border-0 last:pb-0">
                                <span className="text-[9px] font-black text-navy/40 uppercase italic">{entry.user.name}</span>
                                <span className="text-[10px] font-black text-navy italic">${(entry.historicalAmount + entry.currentWeekAmount).toLocaleString()}</span>
                            </div>
                        ))}
                    </CyberCard>
                </div>
            </div>
        </div>
    )
}
