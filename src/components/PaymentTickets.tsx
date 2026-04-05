"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, DollarSign, Calendar, Users, X, Send, 
    CreditCard, Tag, CheckCircle2, AlertCircle, Clock,
    Target, ShieldCheck, ChevronRight, ArrowUpRight
} from "lucide-react"

interface Ticket {
    id: string
    issueDate: string
    dueDate: string
    amount: number
    concept: string
    status: string
    advisor: { name: string; email: string }
    admin: { name: string }
    createdAt: string
}

export default function PaymentTickets() {
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const targetTicketId = searchParams.get("ticketId")
    
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [advisors, setAdvisors] = useState<{ id: string, name: string, role?: string }[]>([])
    
    const ticketRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const role = session?.user?.role
    const isAdmin = role === "ADMIN" || role === "MANAGEMENT"

    const [formData, setFormData] = useState({
        advisorId: "",
        amount: "",
        dueDate: "",
        issueDate: new Date().toISOString().split('T')[0],
        concept: ""
    })

    useEffect(() => {
        fetchTickets()
        if (isAdmin) {
            fetchAdvisors()
        }
    }, [isAdmin, session])

    useEffect(() => {
        if (targetTicketId && tickets.length > 0) {
            const el = ticketRefs.current[targetTicketId]
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.classList.add('ring-4', 'ring-secondary', 'ring-offset-8', 'ring-offset-slate-950')
                setTimeout(() => {
                    el.classList.remove('ring-4', 'ring-secondary', 'ring-offset-8', 'ring-offset-slate-950')
                }, 5000)
            }
        }
    }, [targetTicketId, tickets])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/finance/tickets")
            if (res.ok) {
                const data = await res.json()
                setTickets(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAdvisors = async () => {
        try {
            const res = await fetch("/api/crm/users", { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                setAdvisors(data)
            }
        } catch (error) {
            console.error("[PaymentTickets] Error fetching advisors:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/finance/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    advisorId: formData.advisorId,
                    amount: formData.amount,
                    dueDate: formData.dueDate,
                    issueDate: formData.issueDate,
                    concept: formData.concept
                })
            })
            if (res.ok) {
                setIsModalOpen(false)
                setFormData({
                    advisorId: "", amount: "", dueDate: "", issueDate: new Date().toISOString().split('T')[0], concept: ""
                })
                fetchTickets()
            }
        } catch (error) {
            console.error("Failed to create ticket", error)
        }
    }

    const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/finance/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                fetchTickets()
            }
        } catch (error) {
            console.error("Failed to update status", error)
        }
    }

    if (loading && tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-pulse text-slate-800">
                <div className="w-16 h-16 border-4 border-white/5 border-t-secondary rounded-full animate-spin shadow-2xl" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Sincronizando Archivos de Liquidación...</p>
            </div>
        )
    }

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-emerald-400">
                        <DollarSign size={20} className="drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em]">NODO DE RECEPCIÓN</span>
                    </div>
                    <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">
                        Tickets de <span className="text-secondary underline decoration-secondary/30 underline-offset-8 decoration-4">Pago</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-3 italic max-w-xl leading-relaxed">
                        {isAdmin ? "Emisión y control táctico de incentivos para el equipo operativo de élite." : "Historial de liquidaciones autorizadas y ciclos de pago pendientes."}
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.4em] text-[10px] flex items-center space-x-4 hover:bg-white hover:text-secondary transition-all shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] rounded-2xl active:scale-95 group italic skew-x-[-12deg]"
                    >
                        <div className="flex items-center gap-4 skew-x-[12deg]">
                            <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                            <span>Emitir Liquidación</span>
                        </div>
                    </button>
                )}
            </div>

            {/* Tickets Grid */}
            {tickets.length === 0 ? (
                <div className="text-center py-48 glass-panel border-white/5 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] backdrop-blur-3xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                    <div className="w-24 h-24 bg-slate-900/60 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-inner">
                        <CreditCard size={48} className="text-slate-800" />
                    </div>
                    <p className="text-slate-700 font-black uppercase tracking-[0.6em] text-[11px] italic">Sin registros de liquidación autorizados.</p>
                    <p className="text-[9px] text-slate-800 font-black uppercase tracking-[0.4em] mt-4">Protocolo de Búsqueda: 100%</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {tickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            ref={el => { ticketRefs.current[ticket.id] = el }}
                            className={`glass-panel border-t-4 p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,1)] transition-all relative overflow-hidden group rounded-[3.5rem] backdrop-blur-3xl border-white/5 ${
                                ticket.status === 'PAGADO' ? 'border-t-emerald-500/50' : 
                                ticket.status === 'RECIBIDO' ? 'border-t-azure-500/50' :
                                'border-t-secondary/50'
                            }`}
                        >
                            <div className="absolute -top-10 -right-10 p-4 opacity-[0.02] group-hover:opacity-[0.08] group-hover:scale-125 group-hover:rotate-12 transition-all text-white blur-sm">
                                <DollarSign size={200} />
                            </div>

                            <div className="flex justify-between items-start mb-12 relative z-10">
                                <div className="flex flex-col gap-4">
                                    <span className={`px-5 py-2 text-[9px] font-black uppercase tracking-[0.4em] border rounded-xl shadow-2xl skew-x-[-10deg] italic ${
                                        ticket.status === 'PAGADO' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10' : 
                                        ticket.status === 'RECIBIDO' ? 'text-azure-400 bg-azure-500/10 border-azure-500/20 shadow-azure-500/10' :
                                        'text-secondary bg-secondary/10 border-secondary/20 shadow-secondary/10'
                                    }`}>
                                        <div className="skew-x-[10deg]">{ticket.status}</div>
                                    </span>
                                    {isAdmin && (
                                        <select 
                                            value={ticket.status}
                                            onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                                            className="text-[9px] font-black uppercase tracking-[0.3em] bg-slate-950/60 text-slate-500 border border-white/5 rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:bg-white hover:text-black transition-all shadow-inner italic"
                                        >
                                            <option value="PENDIENTE">PENDIENTE</option>
                                            <option value="RECIBIDO">CONF. RECIBIDO</option>
                                            <option value="PAGADO">CONF. PAGADO</option>
                                            <option value="CANCELADO">CANCELAR NODO</option>
                                        </select>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase italic">
                                        {(new Date(ticket.issueDate)).toLocaleDateString()}
                                    </span>
                                    <div className="h-1 w-12 bg-white/5 ms-auto mt-2 rounded-full" />
                                </div>
                            </div>

                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-4 ml-2 italic leading-relaxed">Concepto Maestro</p>
                            <h3 className="text-2xl font-black text-white mb-8 h-20 overflow-hidden leading-tight italic uppercase tracking-tighter group-hover:text-secondary transition-colors line-clamp-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{ticket.concept}</h3>

                            <div className="space-y-6 mb-12 relative z-10 bg-slate-950/40 p-6 rounded-3xl border border-white/5 shadow-inner">
                                {isAdmin && (
                                    <div className="flex items-center text-xs text-slate-400 font-black tracking-wide group-hover:translate-x-2 transition-transform">
                                        <div className="p-2 bg-slate-900 rounded-lg mr-4 border border-white/5"><Users size={18} className="text-slate-600" /></div>
                                        <span className="truncate uppercase italic text-[11px] tracking-tighter">{ticket.advisor.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-xs text-slate-400 font-black tracking-wide group-hover:translate-x-2 transition-transform delay-75">
                                    <div className="p-2 bg-slate-900 rounded-lg mr-4 border border-white/5"><Calendar size={18} className="text-secondary/50" /></div>
                                    <span className="uppercase text-[11px]">Vence: <span className="text-white italic tracking-tighter">{(new Date(ticket.dueDate)).toLocaleDateString()}</span></span>
                                </div>
                                <div className="flex items-center text-xs text-slate-400 font-black tracking-wide group-hover:translate-x-2 transition-transform delay-150">
                                    <div className="p-2 bg-slate-900 rounded-lg mr-4 border border-white/5"><Target size={18} className="text-azure-500/50" /></div>
                                    <span className="uppercase text-[11px]">ID: <span className="text-slate-600 italic tracking-tighter font-black">{ticket.id.slice(0,12).toUpperCase()}</span></span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex flex-col gap-8 relative z-10">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-3 ml-2 italic">Liquidación Neta</p>
                                        <p className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform duration-700 italic">${ticket.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] italic mb-2">Autorizado_R:</p>
                                        <span className="text-[10px] text-slate-500 font-black uppercase italic tracking-tighter border-b border-white/5 pb-1">{ticket.admin.name}</span>
                                    </div>
                                </div>
                                
                                <AnimatePresence>
                                    {!isAdmin && ticket.status === 'PENDIENTE' && (
                                        <motion.button 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            onClick={() => handleStatusUpdate(ticket.id, 'RECIBIDO')}
                                            className="w-full bg-white text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-secondary hover:text-white transition-all rounded-2xl shadow-[0_20px_50px_rgba(255,255,255,0.15)] active:scale-95 italic skew-x-[-8deg] group/btn"
                                        >
                                            <div className="flex items-center gap-4 skew-x-[8deg]">
                                                <CheckCircle2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                                                Confirmar Nodo Recepción
                                            </div>
                                        </motion.button>
                                    )}
                                    
                                    {!isAdmin && ticket.status === 'RECIBIDO' && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full bg-azure-500/5 text-azure-400 py-5 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 border border-azure-500/20 rounded-2xl italic shadow-2xl shadow-azure-500/5"
                                        >
                                            <Clock size={20} className="animate-pulse" />
                                            Auditoría en Progreso
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Emit Modal for Admin */}
            <AnimatePresence>
                {isModalOpen && isAdmin && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" 
                            onClick={() => setIsModalOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-panel !bg-slate-950/60 w-full max-w-2xl shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 overflow-hidden rounded-[4rem] relative z-10 backdrop-blur-3xl"
                        >
                            <div className="p-14 bg-white/[0.01] border-b border-white/5 flex justify-between items-center text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <CreditCard size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter">Emitir <span className="text-secondary">Liquidación</span></h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.6em] mt-3 font-black italic">Ecosistema de Tesorería Central</p>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="p-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-600 hover:text-white hover:rotate-90 transition-all duration-500 shadow-2xl relative z-10"
                                >
                                    <X size={32} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-14 space-y-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2 ml-2 italic">Asesor Destinatario / Nodo Receptor</label>
                                        <div className="relative group">
                                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={20} />
                                            <select
                                                required
                                                value={formData.advisorId}
                                                onChange={e => setFormData({ ...formData, advisorId: e.target.value })}
                                                className="w-full bg-slate-950/60 border border-white/5 pl-16 pr-8 py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all cursor-pointer h-[75px] shadow-inner italic"
                                            >
                                                <option value="">IDENTIFICAR NODO...</option>
                                                {advisors.map(adv => (
                                                    <option key={adv.id} value={adv.id} className="bg-slate-950 text-white">{adv.name} ({adv.role})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2 ml-2 italic">Fecha Emisión</label>
                                            <input
                                                type="date" required
                                                value={formData.issueDate}
                                                onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                                className="w-full bg-slate-950/60 border border-white/5 py-6 px-10 rounded-[2rem] text-[12px] font-black text-white focus:border-secondary outline-none transition-all shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black text-secondary uppercase tracking-[0.5em] mb-2 ml-2 italic">Límite Auditoría</label>
                                            <input
                                                type="date" required
                                                value={formData.dueDate}
                                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                                className="w-full bg-secondary/10 text-secondary border border-secondary/20 py-6 px-10 rounded-[2rem] text-[12px] font-black focus:border-secondary transition-all shadow-2xl shadow-secondary/5 italic"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2 ml-2 italic">Incentivo Neto de Liquidación ($)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800" size={28} />
                                            <input
                                                type="number" required min="1" step="0.01"
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full bg-slate-950/60 border border-white/5 pl-18 pr-8 py-8 text-4xl font-black text-emerald-400 focus:border-secondary outline-none transition-all rounded-[2.5rem] placeholder:text-slate-900 shadow-inner italic"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2 ml-2 italic">Concepto Maestro / Especificaciones</label>
                                        <div className="relative group">
                                            <Tag className="absolute left-6 top-8 text-slate-800" size={24} />
                                            <textarea
                                                required rows={3}
                                                value={formData.concept}
                                                onChange={e => setFormData({ ...formData, concept: e.target.value.toUpperCase() })}
                                                className="w-full bg-slate-950/60 border border-white/5 pl-18 pr-10 py-8 text-[11px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none resize-none transition-all rounded-[2.5rem] placeholder:text-slate-900 shadow-inner italic leading-relaxed"
                                                placeholder="DESCRIPCIÓN DEL CICLO OPERATIVO..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-secondary hover:bg-white hover:text-secondary text-white font-black py-8 uppercase tracking-[0.6em] text-[11px] flex items-center justify-center space-x-6 transition-all shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] rounded-[2.5rem] active:scale-95 italic skew-x-[-12deg] group/btn">
                                    <div className="flex items-center gap-6 skew-x-[12deg]">
                                        <Send size={24} className="group-hover/btn:translate-x-2 group-hover/btn:rotate-12 transition-all" />
                                        <span>AUTORIZAR Y NOTIFICAR</span>
                                    </div>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
