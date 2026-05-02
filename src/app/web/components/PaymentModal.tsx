"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Building2, CreditCard, MessageCircle, ChevronRight, CheckCircle2, Copy } from "lucide-react"
import { formatCurrency } from "@/lib/utils/pricing"

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    product: {
        id: string
        name: string
        price: number
        sku?: string
    }
}

export default function PaymentModal({ isOpen, onClose, product }: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'stripe'>('transfer')
    const [copied, setCopied] = useState<string | null>(null)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(text)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleWhatsAppConfirm = () => {
        const message = `Hola ATOMIC, acabo de realizar la transferencia por la compra del producto:\n\n`
            + `*Producto:* ${product.name}\n`
            + `${product.sku ? `*REF:* ${product.sku}\n` : ''}`
            + `*Total Transferido:* ${formatCurrency(product.price)}\n\n`
            + `Adjunto el comprobante de pago. Quedo atento/a para la entrega.`

        const whatsappUrl = `https://wa.me/593969043453?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    const handleStripeConfirm = () => {
        // Here we'll redirect to Stripe Checkout in the future
        alert("Redirigiendo a pasarela segura de Stripe...")
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-sans">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950">
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                                    Finalizar <span className="text-[#E8341A]">Compra</span>
                                </h2>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Selecciona tu método de pago</p>
                            </div>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-slate-800 p-2 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 hide-scrollbar">
                            
                            {/* Product Info Summary */}
                            <div className="bg-slate-800/50 p-6 border border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-left w-full">
                                    <p className="text-[9px] font-black text-[#E8341A] uppercase tracking-[0.3em] mb-1">Producto a Adquirir</p>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">{product.name}</p>
                                </div>
                                <div className="text-right w-full md:w-auto">
                                    <p className="text-3xl font-black font-mono text-white">{formatCurrency(product.price)}</p>
                                </div>
                            </div>

                            {/* Payment Options Toggle */}
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setPaymentMethod('transfer')}
                                    className={`p-4 border transition-all flex flex-col items-center justify-center gap-3 ${paymentMethod === 'transfer' ? 'border-[#E8341A] bg-[#E8341A]/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'}`}
                                >
                                    <Building2 size={24} className={paymentMethod === 'transfer' ? 'text-[#E8341A]' : 'text-slate-400'} />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Transferencia</p>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Directo bancario</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('stripe')}
                                    className={`p-4 border transition-all flex flex-col items-center justify-center gap-3 ${paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'}`}
                                >
                                    <CreditCard size={24} className={paymentMethod === 'stripe' ? 'text-blue-500' : 'text-slate-400'} />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Tarjeta</p>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Crédito / Débito</p>
                                    </div>
                                </button>
                            </div>

                            {/* Details based on selection */}
                            <div className="bg-slate-950 p-6 border border-slate-800">
                                {paymentMethod === 'transfer' ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-[#E8341A] border-b border-slate-800 pb-4">
                                            <Building2 size={18} />
                                            <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Cuentas Bancarias</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {[
                                                { bank: 'Banco Pichincha', type: 'Corriente', account: '2100456789', id: '1723456789' },
                                                { bank: 'Banco Guayaquil', type: 'Ahorros', account: '104567890', id: '1723456789' },
                                                { bank: 'Produbanco', type: 'Corriente', account: '02345678912', id: '1723456789' }
                                            ].map((b) => (
                                                <div key={b.bank} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors gap-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-white uppercase">{b.bank}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{b.type}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-3 justify-end group">
                                                            <span className="font-mono text-sm text-white">{b.account}</span>
                                                            <button onClick={() => handleCopy(b.account)} className="text-slate-500 hover:text-white transition-colors">
                                                                {copied === b.account ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                                            </button>
                                                        </div>
                                                        <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">RUC/CI: {b.id}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6">
                                            <button 
                                                onClick={handleWhatsAppConfirm}
                                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                                            >
                                                <MessageCircle size={18} />
                                                <span>Confirmar y Enviar Comprobante</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 text-center py-8">
                                        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CreditCard size={28} className="text-blue-500" />
                                        </div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Pago Seguro con Stripe</h3>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                                            Aceptamos todas las tarjetas de crédito y débito. La transacción está encriptada.
                                        </p>
                                        <div className="pt-4">
                                            <button 
                                                onClick={handleStripeConfirm}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                                            >
                                                <span>Ir a la Pasarela de Pago</span>
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
