"use client"

import { useState, useEffect } from "react"
import { Trophy, Phone, Plus, History, DollarSign, Target, Award, Loader2, Zap } from "lucide-react"
import { CyberCard } from "@/components/ui/CyberUI"
import { motion, AnimatePresence } from "framer-motion"

interface RankingEntry {
    id: string
    userId: string
    currentWeekCount: number
    historicalCount: number
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

export default function PhoneRankingPanel({ isAdmin }: { isAdmin: boolean }) {
    const [ranking, setRanking] = useState<RankingEntry[]>([])
    const [goal, setGoal] = useState<WeeklyGoal | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    
    // Admin state
    const [newGoal, setNewGoal] = useState({ amount: "", description: "" })
    const [addCounts, setAddCounts] = useState<Record<string, string>>({})

    const fetchData = async () => {
        try {
            const [rankRes, goalRes] = await Promise.all([
                fetch("/api/phone-ranking"),
                fetch("/api/weekly-goal")
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
        const interval = setInterval(fetchData, 60000) // Refresh every minute
        return () => clearInterval(interval)
    }, [])

    const handleAddNumbers = async (userId: string) => {
        const countStr = addCounts[userId] || "0"
        const count = parseInt(countStr)
        if (isNaN(count) || count === 0) return

        setUpdating(userId)
        try {
            const res = await fetch("/api/phone-ranking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, count, mode: 'add' })
            })
            if (res.ok) {
                setAddCounts({ ...addCounts, [userId]: "" })
                await fetchData()
            }
        } finally {
            setUpdating(null)
        }
    }

    const handleSetGoal = async () => {
        if (!newGoal.amount) return
        try {
            const res = await fetch("/api/weekly-goal", {
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
            <Loader2 className="animate-spin text-[#1E3A8A]" size={32} />
        </div>
    )

    const topAdvisor = ranking.length > 0 ? ranking[0] : null

    return (
        <div className="space-y-8 w-full">
            {/* WEEKLY GOAL HEADER */}
            <div className="w-full bg-[#0F172A] border-b-4 border-[#1E3A8A] p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Target size={120} className="text-white" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-1 bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 rounded-full">
                            <Zap size={12} className="text-[#3B82F6] animate-pulse" />
                            <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.3em] italic">OBJETIVO ESTRATÉGICO SEMANAL</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                            {goal && goal.amount > 0 ? (
                                <>META: <span className="text-emerald-400 font-black">${goal.amount}</span> <span className="text-white/20 ml-2">EFECTIVO</span></>
                            ) : (
                                "SISTEMA DE METAS ATÓMICAS"
                            )}
                        </h2>
                        <p className="text-sm font-medium text-slate-400 uppercase italic tracking-widest max-w-xl">
                            {goal?.description || "INCREMENTA TU PRODUCTIVIDAD Y LIDERA EL RANKING PARA ACCEDER A BONIFICACIONES EXCLUSIVAS."}
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white/5 backdrop-blur-md px-8 py-6 border border-white/10 text-center">
                            <p className="text-[9px] font-black text-slate-500 uppercase italic mb-2 tracking-[0.2em]">REINICIO DE SISTEMA</p>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-white italic leading-none">LUNES</span>
                                    <span className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-widest">07:00 AM</span>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-white italic leading-none">VIERNES</span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">07:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADMIN GOAL SETTER */}
            {isAdmin && (
                <CyberCard className="!p-8 border-emerald-500/20 bg-emerald-50/5">
                    <div className="flex items-center gap-4 mb-6">
                        <Target className="text-emerald-500" size={24} />
                        <h3 className="text-sm font-black text-navy uppercase italic tracking-widest">CONFIGURAR META SEMANAL</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <input 
                                type="number" 
                                placeholder="MONTO $"
                                value={newGoal.amount}
                                onChange={(e) => setNewGoal({...newGoal, amount: e.target.value})}
                                className="w-full bg-white border border-slate-200 p-4 text-sm font-black text-navy outline-none focus:border-emerald-500 italic"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <input 
                                type="text" 
                                placeholder="DESCRIPCIÓN (OPCIONAL)"
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
                            <h2 className="text-xl font-black text-navy uppercase italic tracking-tighter">RANKING DE TELÉFONOS OBTENIDOS</h2>
                        </div>
                        <p className="text-[9px] font-black text-navy/20 uppercase italic">REINICIA LUNES 7AM</p>
                    </div>

                    {/* TOP SPOTLIGHT */}
                    {topAdvisor && (
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-br from-amber-500/10 to-transparent border-2 border-amber-500/20 p-8 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <Trophy size={60} className="text-amber-500 opacity-10 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-20 h-20 rounded-full border-4 border-amber-500/30 p-1">
                                    <div className="w-full h-full rounded-full bg-amber-500/10 flex items-center justify-center font-black text-2xl text-amber-600 overflow-hidden">
                                        {topAdvisor.user.profilePicture ? (
                                            <img src={topAdvisor.user.profilePicture} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            topAdvisor.user.name?.[0]
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Award size={14} className="text-amber-500" />
                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest italic">LÍDER DE LA SEMANA</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-navy uppercase italic tracking-tighter leading-tight">
                                        {topAdvisor.user.name} {topAdvisor.user.lastName}
                                    </h3>
                                    <p className="text-xs font-bold text-navy/40 uppercase italic">
                                        DOMINANDO CON <span className="text-[#1E3A8A]">{topAdvisor.currentWeekCount} CONTACTOS</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

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
                                                <p className="text-xs font-black text-[#1E3A8A] italic">{entry.currentWeekCount} <span className="text-[8px] opacity-40 uppercase tracking-tighter">NÚMEROS</span></p>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (entry.currentWeekCount / (topAdvisor?.currentWeekCount || 1)) * 100)}%` }}
                                                    className={`h-full ${index === 0 ? 'bg-amber-500' : 'bg-[#1E3A8A]'} relative`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* ADMIN ADD NUMBERS */}
                                    {isAdmin && (
                                        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1 border border-slate-100 z-20">
                                            <input 
                                                type="number"
                                                placeholder="+"
                                                value={addCounts[entry.userId] || ""}
                                                onChange={(e) => setAddCounts({...addCounts, [entry.userId]: e.target.value})}
                                                className="w-12 bg-white border border-slate-200 p-1 text-[10px] font-black text-navy outline-none"
                                            />
                                            <button 
                                                onClick={() => handleAddNumbers(entry.userId)}
                                                disabled={updating === entry.userId}
                                                className="bg-[#1E3A8A] text-white p-1 hover:bg-navy transition-all"
                                            >
                                                {updating === entry.userId ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-12 text-[10px] font-black text-navy/20 uppercase italic tracking-widest border border-dashed border-slate-200">
                                NO HAY DATOS DE RANKING PARA ESTA SEMANA
                            </p>
                        )}
                    </div>
                </div>

                {/* HISTORICAL RECORDS */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <History className="text-navy/30" size={20} />
                        <h2 className="text-xl font-black text-navy uppercase italic tracking-tighter">HISTORIAL TOTAL</h2>
                    </div>

                    <CyberCard className="!p-6 space-y-4 bg-slate-50/50">
                        {ranking.map((entry: any) => (
                            <div key={`hist-${entry.id}`} className="flex justify-between items-center border-b border-slate-200/50 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-navy/40 uppercase italic">{entry.user.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-navy italic">{entry.historicalCount + entry.currentWeekCount} TOTAL</span>
                            </div>
                        ))}
                        {ranking.length === 0 && <p className="text-[9px] font-black text-navy/20 uppercase text-center italic">SIN REGISTROS</p>}
                    </CyberCard>

                    <div className="p-6 border border-dashed border-[#1E3A8A]/20 bg-[#1E3A8A]/3 text-center rounded-sm">
                        <Phone size={24} className="mx-auto mb-3 text-[#1E3A8A] opacity-30" />
                        <p className="text-[9px] font-black text-[#1E3A8A] uppercase tracking-[0.2em] italic mb-1">PROSPECTOS CAPTURADOS</p>
                        <p className="text-xl font-black text-navy italic">
                            {ranking.reduce((acc: number, curr: any) => acc + curr.currentWeekCount, 0)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
