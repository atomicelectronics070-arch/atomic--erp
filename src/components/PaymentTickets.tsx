"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, DollarSign, Calendar, Users, X, Send, 
    CreditCard, Tag, CheckCircle2, Clock, Target,
    ShieldCheck
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
                el.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2')
                setTimeout(() => {
                    el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2')
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
                const ticket = await res.json()
                // Auto-create egreso entry in the financial bitácora
                await fetch("/api/finance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        client: advisors.find(a => a.id === formData.advisorId)?.name || "ASESOR",
                        quoteNumber: `TICKET-${ticket.id?.slice(0,8).toUpperCase()} | ${formData.concept}`,
                        amount: parseFloat(formData.amount as string),
                        pvp: 0,
                        cost: parseFloat(formData.amount as string),
                        profit: 0,
                        commission: 0,
                        bonus: 0,
                        status: "PAGADO",
                        commissionStatus: "PAGADO",
                        type: "Egreso Comision",
                        date: formData.issueDate,
                        salespersonId: formData.advisorId
                    })
                })
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
            <div className="flex flex-col items-center justify-center py-40 space-y-4 text-slate-500">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-sm font-bold uppercase tracking-wider">Cargando Liquidaciones...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <CreditCard className="text-indigo-600" size={24} /> Tickets de Pago
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        {isAdmin ? "Emisión y control de incentivos para el equipo comercial." : "Historial de liquidaciones autorizadas y pagos pendientes."}
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Plus size={18} /> Emitir Liquidación
                    </button>
                )}
            </div>

            {/* Tickets Grid */}
            {tickets.length === 0 ? (
                <div className="text-center py-24 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <CreditCard size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Sin registros de liquidación</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            ref={el => { ticketRefs.current[ticket.id] = el }}
                            className={`bg-white border p-6 shadow-sm hover:shadow-md transition-all rounded-xl relative ${
                                ticket.status === 'PAGADO' ? 'border-emerald-200' : 
                                ticket.status === 'RECIBIDO' ? 'border-blue-200' :
                                'border-amber-200'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex flex-col gap-3">
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md w-fit ${
                                        ticket.status === 'PAGADO' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 
                                        ticket.status === 'RECIBIDO' ? 'text-blue-700 bg-blue-50 border border-blue-100' :
                                        'text-amber-700 bg-amber-50 border border-amber-100'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                    {isAdmin && (
                                        <select 
                                            value={ticket.status}
                                            onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                                            className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200 rounded-md px-2 py-1.5 outline-none cursor-pointer focus:border-indigo-500"
                                        >
                                            <option value="PENDIENTE">PENDIENTE</option>
                                            <option value="RECIBIDO">RECIBIDO</option>
                                            <option value="PAGADO">PAGADO</option>
                                            <option value="CANCELADO">CANCELAR</option>
                                        </select>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        {(new Date(ticket.issueDate)).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Concepto de Pago</p>
                            <h3 className="text-lg font-black text-[#0F172A] mb-6 line-clamp-2 leading-snug">{ticket.concept}</h3>

                            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                {isAdmin && (
                                    <div className="flex items-center text-xs font-bold text-slate-600">
                                        <Users size={14} className="mr-3 text-slate-400" />
                                        <span className="truncate">{ticket.advisor.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-xs font-bold text-slate-600">
                                    <Calendar size={14} className="mr-3 text-amber-500" />
                                    <span>Vence: {(new Date(ticket.dueDate)).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-xs font-bold text-slate-500">
                                    <Target size={14} className="mr-3 text-slate-300" />
                                    <span className="truncate">ID: {ticket.id.slice(0,8).toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex flex-col gap-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monto a Liquidar</p>
                                        <p className="text-3xl font-black text-[#0F172A]">${ticket.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Autorizado por:</p>
                                        <span className="text-[10px] font-bold text-slate-600">{ticket.admin.name}</span>
                                    </div>
                                </div>
                                
                                <AnimatePresence>
                                    {!isAdmin && ticket.status === 'PENDIENTE' && (
                                        <motion.button 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            onClick={() => handleStatusUpdate(ticket.id, 'RECIBIDO')}
                                            className="w-full bg-slate-900 text-white py-3 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors rounded-lg shadow-sm"
                                        >
                                            <CheckCircle2 size={16} /> Confirmar Recepción
                                        </motion.button>
                                    )}
                                    
                                    {!isAdmin && ticket.status === 'RECIBIDO' && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full bg-blue-50 text-blue-600 py-3 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-blue-200 rounded-lg"
                                        >
                                            <Clock size={16} /> Pago en Progreso
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                            onClick={() => setIsModalOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden rounded-2xl relative z-10 flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#0F172A] tracking-tight">Emitir Liquidación</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Nuevo Ticket de Pago</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Asesor / Beneficiario</label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <select
                                            required
                                            value={formData.advisorId}
                                            onChange={e => setFormData({ ...formData, advisorId: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer h-[46px]"
                                        >
                                            <option value="">Seleccionar Asesor...</option>
                                            {advisors.map(adv => (
                                                <option key={adv.id} value={adv.id}>{adv.name} ({adv.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha de Emisión</label>
                                        <input
                                            type="date" required
                                            value={formData.issueDate}
                                            onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-lg text-sm font-bold text-[#0F172A] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-amber-600 uppercase tracking-wider ml-1">Fecha Límite</label>
                                        <input
                                            type="date" required
                                            value={formData.dueDate}
                                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full bg-amber-50 text-amber-700 border border-amber-200 py-3 px-4 rounded-lg text-sm font-bold focus:border-amber-400 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider ml-1">Monto a Liquidar ($)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="number" required min="1" step="0.01"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 text-2xl font-black text-[#0F172A] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all rounded-lg"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Concepto / Especificaciones</label>
                                    <div className="relative group">
                                        <Tag className="absolute left-4 top-4 text-slate-400" size={18} />
                                        <textarea
                                            required rows={3}
                                            value={formData.concept}
                                            onChange={e => setFormData({ ...formData, concept: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 text-sm font-bold text-[#0F172A] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all rounded-lg"
                                            placeholder="Descripción del pago..."
                                        ></textarea>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 text-sm flex items-center justify-center gap-2 transition-all rounded-lg shadow-md mt-4">
                                    <Send size={18} />
                                    <span>Autorizar y Emitir Ticket</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
