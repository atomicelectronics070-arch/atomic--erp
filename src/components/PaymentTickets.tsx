"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, DollarSign, Calendar, Users, X, Send, CreditCard, Tag } from "lucide-react"

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
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [advisors, setAdvisors] = useState<{ id: string, name: string }[]>([])

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
    }, [isAdmin])

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
            const res = await fetch("/api/crm/users") // Assuming this endpoint exists, or similar
            if (res.ok) {
                const data = await res.json()
                const filtered = data.filter((u: any) => u.role !== "ADMIN" && u.status === "ACTIVE")
                setAdvisors(filtered)
            }
        } catch (error) {
            console.error(error)
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

    if (loading) return <div className="animate-pulse bg-neutral-100 h-64 w-full"></div>

    return (
        <div className="space-y-6 mt-12 pt-12 border-t border-neutral-200">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
                        <CreditCard className="text-orange-600" />
                        Tickets de Pago
                    </h2>
                    <p className="text-neutral-500 text-sm mt-1">{isAdmin ? "Emite y administra tickets de pago para tu equipo." : "Tus tickets de pago recibidos."}</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-orange-600 text-white px-6 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-2 hover:bg-neutral-900 transition-colors shadow-md"
                    >
                        <Plus size={16} />
                        <span>Emitir Ticket</span>
                    </button>
                )}
            </div>

            {/* Tickets Grid */}
            {tickets.length === 0 ? (
                <div className="text-center py-16 bg-white border border-neutral-200 shadow-sm">
                    <CreditCard size={48} className="mx-auto text-neutral-200 mb-4" />
                    <p className="text-neutral-500 font-medium">No hay tickets de pago registrados.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="bg-white border text-left border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <DollarSign size={80} />
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border ${ticket.status === 'PAGADO' ? 'text-green-700 bg-green-50 border-green-200' : 'text-orange-700 bg-orange-50 border-orange-200'
                                    }`}>
                                    {ticket.status}
                                </span>
                                <span className="text-xs font-bold text-neutral-400">
                                    {(new Date(ticket.issueDate)).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Concepto</p>
                            <h3 className="text-lg font-bold text-neutral-900 mb-4 h-14 overflow-hidden leading-tight">{ticket.concept}</h3>

                            <div className="space-y-3 mb-6">
                                {isAdmin && (
                                    <div className="flex items-center text-sm text-neutral-600">
                                        <Users size={16} className="text-neutral-400 mr-2" />
                                        <span className="font-bold truncate">{ticket.advisor.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm text-neutral-600">
                                    <Calendar size={16} className="text-red-400 mr-2" />
                                    <span>Vence: <span className="font-bold text-neutral-900">{(new Date(ticket.dueDate)).toLocaleDateString()}</span></span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Monto a Pagar</p>
                                    <p className="text-2xl font-bold text-green-600">${ticket.amount.toLocaleString()}</p>
                                </div>
                                {!isAdmin && (
                                    <div className="text-[9px] font-bold text-neutral-400 uppercase text-right">
                                        Por:<br />{ticket.admin.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Emit Modal */}
            {isModalOpen && isAdmin && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-neutral-900/40">
                    <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-neutral-900 border-b border-neutral-800 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-xl font-bold">Emitir Ticket de Pago</h3>
                                <p className="text-[10px] text-orange-500 uppercase tracking-widest mt-1">Gestión Financiera</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Asesor Destinatario</label>
                                    <select
                                        required
                                        value={formData.advisorId}
                                        onChange={e => setFormData({ ...formData, advisorId: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-200 p-3 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="">Seleccione un asesor...</option>
                                        {advisors.map(adv => (
                                            <option key={adv.id} value={adv.id}>{adv.name}</option>
                                        ))}
                                        {/* Fallback option if API fails to load advisors */}
                                        {advisors.length === 0 && <option value="clt3z8v9o0000a6p4qwert123">Asesor Prueba (ID Demo)</option>}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Fecha de Emisión</label>
                                        <input
                                            type="date" required
                                            value={formData.issueDate}
                                            onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 text-red-500">Fecha de Pago Máxima</label>
                                        <input
                                            type="date" required
                                            value={formData.dueDate}
                                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full bg-red-50 text-red-900 border border-red-200 p-3 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Monto ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                        <input
                                            type="number" required min="1" step="0.01"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 pl-10 text-lg font-bold text-neutral-900 focus:ring-2 focus:ring-orange-500 outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Concepto / Descripción</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-3 text-neutral-400" size={18} />
                                        <textarea
                                            required rows={3}
                                            value={formData.concept}
                                            onChange={e => setFormData({ ...formData, concept: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 pl-10 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                            placeholder="Detalle del pago que se emite..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-2 transition-colors">
                                <Send size={16} />
                                <span>Emitir Ticket y Notificar</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
