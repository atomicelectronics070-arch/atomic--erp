"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useSession } from "next-auth/react"
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Smartphone, Building2, CreditCard, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/pricing"

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
    const { data: session } = useSession()
    const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'deposit'>('transfer')
    const [loading, setLoading] = useState(false)

    const handleCheckout = () => {
        setLoading(true)
        
        const orderId = Math.random().toString(36).substring(2, 9).toUpperCase()
        const methodText = paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 'Depósito Bancario'
        
        let message = `Hola ATOMIC, acabo de realizar un pedido desde la web.\n\n`
        message += `*Pedido #ID-${orderId}*\n`
        message += `*Cliente:* ${session?.user?.name || 'Cliente Web'}\n`
        message += `*Método:* ${methodText}\n\n`
        message += `*Productos:*\n`
        
        items.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`
        })
        
        message += `\n*TOTAL:* ${formatCurrency(totalPrice)}\n\n`
        message += `Por favor, confírmenme los datos para realizar el pago. ¡Gracias!`

        const whatsappUrl = `https://wa.me/593969043453?text=${encodeURIComponent(message)}`
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank')
        
        // Optionally clear cart after some time or immediate
        // clearCart()
        setLoading(false)
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
                <div className="w-24 h-24 bg-neutral-50 flex items-center justify-center mb-8 border border-neutral-100">
                    <ShoppingBag className="text-neutral-200" size={40} />
                </div>
                <h1 className="text-4xl font-black uppercase text-neutral-900 tracking-tighter mb-4">Tu carrito está vacío</h1>
                <p className="text-neutral-400 text-sm uppercase tracking-widest mb-10 text-center max-w-xs">Parece que aún no has añadido elementos tecnológicos a tu selección.</p>
                <Link href="/web" className="bg-orange-600 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-900 transition-all shadow-2xl shadow-orange-100">
                    Explorar Catálogo
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent/60 backdrop-blur-[2px] py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-neutral-200 pb-12">
                    <div className="space-y-4">
                        <Link href="/web" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-600 transition-colors">
                            <ChevronLeft size={14} /> Continuar Comprando
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black text-neutral-900 uppercase tracking-tighter leading-none italic">
                            Mi <span className="text-orange-600">Carrito</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">{items.length} ELEMENTOS EN SELECCIÓN</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white border border-neutral-100 p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-orange-600/30 transition-all">
                                <div className="w-32 h-32 bg-neutral-50 shrink-0 border border-neutral-100 p-4 flex items-center justify-center">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    ) : (
                                        <ShoppingBag size={24} className="text-neutral-200" />
                                    )}
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Tecnología Certificada</p>
                                    <div className="flex items-center gap-6 mt-4">
                                        <p className="font-mono font-black text-lg text-neutral-900">{formatCurrency(item.price)}</p>
                                        <div className="flex items-center border border-neutral-200">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-4">
                                    <p className="font-mono font-black text-xl text-neutral-900">{formatCurrency(item.price * item.quantity)}</p>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-neutral-300 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary & Checkout */}
                    <div className="space-y-10">
                        <div className="bg-neutral-900 p-10 text-white relative overflow-hidden">
                            <div className="absolute right-0 top-0 h-full w-24 bg-white/5 skew-x-[30deg] translate-x-12"></div>
                            
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-10">Resumen de Orden</h2>
                            
                            <div className="space-y-6 border-b border-white/10 pb-10 mb-10">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/50">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/50">
                                    <span>Envío</span>
                                    <span className="text-green-500">Gratis</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Total Final</span>
                                    <span className="text-3xl font-black font-mono">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>

                            <div className="space-y-6 mb-10">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Método de Pago</p>
                                <div className="grid grid-cols-1 gap-4">
                                    <button 
                                        onClick={() => setPaymentMethod('transfer')}
                                        className={`flex items-center gap-4 p-4 border transition-all ${paymentMethod === 'transfer' ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-white/25'}`}
                                    >
                                        <Building2 size={18} className={paymentMethod === 'transfer' ? 'text-orange-500' : 'text-white/20'} />
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest">Transferencia</p>
                                            <p className="text-[8px] text-white/40 font-bold uppercase">Banca Electrónica</p>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('deposit')}
                                        className={`flex items-center gap-4 p-4 border transition-all ${paymentMethod === 'deposit' ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-white/25'}`}
                                    >
                                        <Smartphone size={18} className={paymentMethod === 'deposit' ? 'text-orange-500' : 'text-white/20'} />
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest">Depósito</p>
                                            <p className="text-[8px] text-white/40 font-bold uppercase">Cajero / Ventanilla</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-orange-600 hover:bg-white hover:text-orange-600 text-white py-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                            >
                                {loading ? 'Procesando...' : (
                                    <>
                                        Finalizar en WhatsApp <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                            
                            <p className="mt-8 text-[8px] text-white/20 font-bold uppercase text-center leading-relaxed">
                                Al presionar el botón serás redirigido a WhatsApp para coordinar la entrega y el pago.
                            </p>
                        </div>
                        
                        <div className="p-8 border-2 border-dashed border-neutral-200">
                            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                                <CreditCard size={14} /> Información de Pago
                            </p>
                            <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                                Deberá enviar el comprobante de su compra al número <span className="text-orange-600 font-black">0969043453</span> una vez realizada la transacción para procesar su despacho de inmediato.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

