"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Plus, DollarSign, Calendar, Users, X, Send, CreditCard, Tag, CheckCircle2, AlertCircle } from "lucide-react"

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
                el.classList.add('ring-4', 'ring-orange-500', 'ring-offset-4')
                setTimeout(() => {
                    el.classList.remove('ring-4', 'ring-orange-500', 'ring-offset-4')
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

    if (loading) return <div className="animate-pulse bg-neutral-100 h-64 w-full"></div>

    return (
        <div className="space-y-10 mt-16 pt-16 border-t border-white/5 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                        <CreditCard className="text-secondary" size={32} />
                        Tickets de Pago <span className="text-slate-600 font-light">&</span> Liquidaciones
                    </h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-3">
                        {isAdmin ? "Emisión y Control Táctico de Nómina para el Equipo de Élite." : "Historial de Liquidaciones Recibidas y Nodos por Cobrar."}
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-secondary text-white px-8 py-4 font-black uppercase tracking-[0.2em] text-[10px] flex items-center space-x-3 hover:bg-white hover:text-secondary transition-all shadow-[0_10px_30px_-5px_rgba(255,99,71,0.4)] rounded-2xl active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        <span>Emitir Nuevo Ticket Digital</span>
                    </button>
                )}
            </div>

            {/* Tickets Grid */}
            {tickets.length === 0 ? (
                <div className="text-center py-32 glass-panel border-white/5 rounded-[3rem] shadow-2xl">
                    <CreditCard size={64} className="mx-auto text-slate-900 mb-6" />
                    <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">Sin registros de liquidación en el ecosistema actual.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {tickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            ref={el => { ticketRefs.current[ticket.id] = el }}
                            className={`glass-panel border-white/5 p-8 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all relative overflow-hidden group rounded-[2.5rem] border-t-2 ${
                                ticket.status === 'PAGADO' ? 'border-emerald-500/30' : 
                                ticket.status === 'RECIBIDO' ? 'border-azure-500/30' :
                                'border-secondary/30'
                            }`}
                        >
                            <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.07] group-hover:rotate-12 transition-all">
                                <DollarSign size={150} className="text-white" />
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex flex-col gap-3">
                                    <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] border rounded-full shadow-2xl w-fit ${
                                        ticket.status === 'PAGADO' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                                        ticket.status === 'RECIBIDO' ? 'text-azure-400 bg-azure-500/10 border-azure-500/20' :
                                        'text-secondary bg-secondary/10 border-secondary/20'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                    {isAdmin && (
                                        <select 
                                            value={ticket.status}
                                            onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                                            className="text-[9px] font-black uppercase tracking-[0.2em] bg-slate-900/60 text-white border border-white/5 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-white hover:text-black transition-all"
                                        >
                                            <option value="PENDIENTE">PENDIENTE</option>
                                            <option value="RECIBIDO">MARCAR RECIBIDO</option>
                                            <option value="PAGADO">MARCAR PAGADO</option>
                                            <option value="CANCELADO">CANCELAR TICKET</option>
                                        </select>
                                    )}
                                </div>
                                <span className="text-[10px] font-black text-slate-600 tracking-widest uppercase">
                                    {(new Date(ticket.issueDate)).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2 ml-1">Concepto Operativo</p>
                            <h3 className="text-xl font-black text-white mb-6 h-16 overflow-hidden leading-tight italic uppercase tracking-tighter group-hover:text-secondary transition-colors line-clamp-2">{ticket.concept}</h3>

                            <div className="space-y-4 mb-8 relative z-10">
                                {isAdmin && (
                                    <div className="flex items-center text-xs text-slate-400 font-black tracking-wide">
                                        <Users size={18} className="text-slate-700 mr-3" />
                                        <span className="truncate uppercase italic">{ticket.advisor.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-xs text-slate-400 font-black tracking-wide">
                                    <Calendar size={18} className="text-secondary/60 mr-3" />
                                    <span>Vence: <span className="text-white italic">{(new Date(ticket.dueDate)).toLocaleDateString()}</span></span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-col gap-6 relative z-10">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2 ml-1">Monto de Liquidación</p>
                                        <p className="text-3xl font-black text-emerald-400 tracking-tighter shadow-emerald-400/10">${ticket.amount.toLocaleString()}</p>
                                    </div>
                                    {!isAdmin && (
                                        <div className="text-[8px] font-black text-slate-700 uppercase leading-relaxed text-right tracking-[0.1em]">
                                            Autorizado por:<br /><span className="text-slate-500">{ticket.admin.name}</span>
                                        </div>
                                    )}
                                </div>
                                
                                {!isAdmin && ticket.status === 'PENDIENTE' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(ticket.id, 'RECIBIDO')}
                                        className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-secondary hover:text-white transition-all rounded-2xl shadow-[0_15px_30px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                                    >
                                        <CheckCircle2 size={18} />
                                        Confirmar Recepción
                                    </button>
                                )}
                                
                                {!isAdmin && ticket.status === 'RECIBIDO' && (
                                    <div className="w-full bg-azure-500/10 text-azure-400 py-4 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 border border-azure-500/20 rounded-2xl italic">
                                        <ClockIcon size={18} />
                                        Esperando Confirmación de Admin
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Emit Modal remains same for Admin */}
            {isModalOpen && isAdmin && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
                    <div className="glass-panel !bg-slate-950/80 w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border-white/10 overflow-hidden animate-in zoom-in-95 duration-500 rounded-[3rem] relative z-10">
                        <div className="p-12 bg-white/5 border-b border-white/5 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Emitir Liquidación</h3>
                                <p className="text-[10px] text-secondary uppercase tracking-[0.4em] mt-3 font-black">Control Central de Tesorería</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 glass-panel !bg-slate-900 rounded-2xl text-slate-500 hover:text-white hover:rotate-90 transition-all duration-300 border-white/5">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Asesor Destinatario</label>
                                    <select
                                        required
                                        value={formData.advisorId}
                                        onChange={e => setFormData({ ...formData, advisorId: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/5 p-4.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all cursor-pointer h-[57px]"
                                    >
                                            <option value="">SELECCIONAR NODO DE ASESOR</option>
                                        {advisors.map(adv => (
                                            <option key={adv.id} value={adv.id} className="bg-slate-900">{adv.name} ({adv.role})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Emisión</label>
                                        <input
                                            type="date" required
                                            value={formData.issueDate}
                                            onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/5 p-4.5 rounded-2xl text-xs font-black text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-3 ml-1">Fecha Límite</label>
                                        <input
                                            type="date" required
                                            value={formData.dueDate}
                                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full bg-secondary/10 text-secondary border border-secondary/20 p-4.5 rounded-2xl text-xs font-black focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Monto de Liquidación ($)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <input
                                            type="number" required min="1" step="0.01"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/5 p-4.5 pl-14 text-2xl font-black text-emerald-400 focus:ring-2 focus:ring-secondary/50 outline-none transition-all rounded-2xl placeholder:text-slate-800"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Concepto Maestro / Descripción</label>
                                    <div className="relative group">
                                        <Tag className="absolute left-5 top-5 text-slate-700 group-focus-within:text-secondary transition-colors" size={20} />
                                        <textarea
                                            required rows={3}
                                            value={formData.concept}
                                            onChange={e => setFormData({ ...formData, concept: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/5 p-4.5 pl-14 text-xs font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none resize-none transition-all rounded-2xl placeholder:text-slate-800"
                                            placeholder="ESPECIFICACIONES DEL PAGO EMITIDO..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-secondary hover:bg-white hover:text-secondary text-white font-black py-6 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center space-x-4 transition-all shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] rounded-2xl active:scale-[0.98]">
                                <Send size={20} />
                                <span>Finalizar y Notificar Nodo</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function ClockIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
    )
}
