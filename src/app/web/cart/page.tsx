"use client"

import { useState, useEffect, useRef } from "react"
import { useCart } from "@/context/CartContext"
import { useSession } from "next-auth/react"
import { 
    ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
    Smartphone, Building2, CreditCard, ChevronLeft, 
    Bot, Sparkles, Mail, FileText, CheckCircle2, 
    Info, Download, X, Wallet, Search
} from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/pricing"
import { motion, AnimatePresence } from "framer-motion"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
    const { data: session } = useSession()
    
    // UI State
    const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'deposit' | 'cod' | 'debit' | 'oc'>('transfer')
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [showOCForm, setShowOCForm] = useState(false)
    const [agreedToDeposit, setAgreedToDeposit] = useState(false)
    const [suggestedProducts, setSuggestedProducts] = useState<any[]>([])

    // OC Form State
    const [ocData, setOcData] = useState({
        clientName: "",
        ruc: "",
        phone: "",
        city: "GUAYAQUIL",
        address: "",
        notes: ""
    })

    // Fetch products for Smart Bar
    useEffect(() => {
        const fetchSuggested = async () => {
            try {
                const res = await fetch("/api/products?limit=8")
                if (res.ok) {
                    const data = await res.json()
                    setSuggestedProducts(data.filter((p: any) => !items.some(it => it.id === p.id)))
                }
            } catch (e) {
                console.error(e)
            }
        }
        fetchSuggested()
    }, [items])

    // Logic: Discounts
    const isFirstPurchase = true 
    const subtotal = totalPrice
    const hasTenPercentDiscount = subtotal > 100 || !isFirstPurchase
    const discount = hasTenPercentDiscount ? subtotal * 0.10 : 0
    const finalTotal = subtotal - discount

    const handleExportOC = () => {
        if (!ocData.clientName || !ocData.ruc) {
            alert("Por favor completa el Nombre y RUC/Cédula para generar la OC.");
            return;
        }

        const doc = new jsPDF()
        const orderId = `OC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        
        // Header
        doc.setFontSize(22); doc.setTextColor(30, 58, 138); doc.text("ATOMIC SOLUTIONS", 14, 20);
        doc.setFontSize(10); doc.setTextColor(100); doc.text(`ORDEN DE COMPRA: ${orderId}`, 140, 20);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 140, 25);

        // Client Info
        doc.setFontSize(12); doc.setTextColor(0); doc.text("DATOS DEL CLIENTE", 14, 40);
        doc.setFontSize(10);
        doc.text(`Cliente: ${ocData.clientName.toUpperCase()}`, 14, 48);
        doc.text(`RUC/CI: ${ocData.ruc}`, 14, 53);
        doc.text(`Teléfono: ${ocData.phone}`, 14, 58);
        doc.text(`Dirección: ${ocData.address.toUpperCase()}`, 14, 63);

        // Items Table
        autoTable(doc, {
            startY: 75,
            head: [["Descripción", "Cant.", "Unitario", "Total"]],
            body: items.map(i => [i.name.toUpperCase(), i.quantity, `$${i.price.toFixed(2)}`, `$${(i.quantity * i.price).toFixed(2)}`]),
            theme: 'grid',
            headStyles: { fillColor: [30, 58, 138] },
            styles: { fontSize: 8 }
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Subtotal: ${formatCurrency(subtotal)}`, 140, finalY);
        if (discount > 0) doc.text(`Descuento (10%): -${formatCurrency(discount)}`, 140, finalY + 5);
        doc.setFontSize(12); doc.setFont("helvetica", "bold");
        doc.text(`TOTAL FINAL: ${formatCurrency(finalTotal)}`, 140, finalY + 15);

        doc.save(`${orderId}_${ocData.clientName.replace(/\s+/g, "_")}.pdf`)
    }

    const handleCheckout = () => {
        if (!email) {
            alert("Por favor, ingresa tu correo para recibir el comprobante.");
            return;
        }

        if (paymentMethod === 'cod' && subtotal > 100 && !agreedToDeposit) {
            alert("Para pedidos mayores a $100 mediante Contra Entrega, se requiere un anticipo del 50%.");
            return;
        }

        setLoading(true)
        const orderId = Math.random().toString(36).substring(2, 9).toUpperCase()
        const methodLabels = {
            transfer: 'Transferencia Bancaria',
            deposit: 'Depósito Bancario',
            cod: 'Contra Entrega',
            debit: 'Tarjeta de Débito',
            oc: 'Orden de Compra'
        }
        
        let message = `🚀 *NUEVO PEDIDO ATOMIC SOLUTIONS*\n\n`
        message += `*Orden #ID-${orderId}*\n`
        message += `*Cliente:* ${ocData.clientName || session?.user?.name || 'Cliente Web'}\n`
        message += `*Email:* ${email}\n`
        message += `*Método:* ${methodLabels[paymentMethod]}\n`
        
        if (paymentMethod === 'oc') {
            message += `*RUC/CI:* ${ocData.ruc}\n`
            message += `*Dirección:* ${ocData.address}\n`
            message += `*Nota:* He generado una Orden de Compra PDF.\n`
        }

        message += `\n*📦 PRODUCTOS:*\n`
        items.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`
        })
        
        message += `\n*💰 RESUMEN:*`
        message += `\nSubtotal: ${formatCurrency(subtotal)}`
        if (discount > 0) message += `\nDescuento (10%): -${formatCurrency(discount)}`
        message += `\n*TOTAL FINAL: ${formatCurrency(finalTotal)}*\n\n`
        
        if (paymentMethod === 'cod' && subtotal > 100) {
            message += `⚠️ *Acepto anticipo del 50%* para procesar este Contra Entrega.\n\n`
        }

        message += `Por favor, confírmenme la disponibilidad y los pasos a seguir. ¡Gracias!`

        const whatsappUrl = `https://wa.me/593969043453?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        setLoading(false)
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
                <div className="w-24 h-24 bg-blue-50 flex items-center justify-center mb-8 border border-blue-100 rounded-2xl">
                    <ShoppingBag className="text-blue-200" size={40} />
                </div>
                <h1 className="text-4xl font-black uppercase text-slate-900 tracking-tighter mb-4 italic">Tu carrito está vacío</h1>
                <p className="text-slate-400 text-sm uppercase tracking-widest mb-10 text-center max-w-xs font-semibold">Parece que aún no has añadido elementos tecnológicos a tu selección.</p>
                <Link href="/web" className="bg-[#1E3A8A] text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-800 transition-all shadow-2xl rounded-xl">
                    Explorar Catálogo
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-20 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Bot Recommendation Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-blue-100 p-6 mb-12 rounded-3xl flex items-center gap-6 shadow-sm"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
                        <Bot className="text-[#1E3A8A]" size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 italic">¿Te ayudo a hacer tu pedido? 👋</p>
                        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mt-1">
                            ¡Paga ahora y obtén <span className="text-blue-600">ENVÍO GRATIS</span> por ser tu primera compra!
                        </p>
                    </div>
                </motion.div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-slate-200 pb-12">
                    <div className="space-y-4">
                        <Link href="/web" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1E3A8A] transition-colors">
                            <ChevronLeft size={14} /> Continuar Comprando
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black text-[#1E3A8A] uppercase tracking-tighter leading-none italic">
                            MI <span className="text-blue-600">CARRITO</span>
                        </h1>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{items.length} ELEMENTOS EN SELECCIÓN</p>
                        <div className="flex items-center gap-2 text-emerald-500">
                             <CheckCircle2 size={12} />
                             <span className="text-[9px] font-black uppercase tracking-widest italic">Garantía de Satisfacción</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Items List & Smart Bar */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-blue-300 transition-all rounded-3xl shadow-sm">
                                    <div className="w-32 h-32 bg-slate-50 shrink-0 border border-slate-100 p-4 flex items-center justify-center rounded-2xl overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <ShoppingBag size={24} className="text-slate-200" />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-[#1E3A8A] group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Hardware de Precisión</p>
                                        <div className="flex items-center gap-6 mt-4">
                                            <p className="font-bold text-lg text-slate-900">{formatCurrency(item.price)}</p>
                                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 border-r border-slate-200"><Minus size={12} /></button>
                                                <span className="w-12 text-center text-xs font-black text-[#1E3A8A]">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 border-l border-slate-200"><Plus size={12} /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-6">
                                        <p className="font-black text-xl text-[#1E3A8A]">{formatCurrency(item.price * item.quantity)}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="p-3 bg-slate-50 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl border border-slate-100"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Smart Recommendations Bar - REAL DATA */}
                        {suggestedProducts.length > 0 && (
                            <div className="p-10 bg-white border border-blue-50 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 text-blue-500/5"><Sparkles size={120} /></div>
                                <h3 className="text-sm font-black text-[#1E3A8A] uppercase tracking-widest mb-8 flex items-center gap-3 italic">
                                    <Sparkles size={18} className="text-blue-600" /> PRODUCTOS QUE COMBINAN CON TU ESTILO
                                </h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                    {suggestedProducts.map((p) => (
                                        <div key={p.id} className="shrink-0 w-48 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all">
                                            <div className="aspect-square bg-white rounded-xl mb-4 border border-slate-100 flex items-center justify-center overflow-hidden">
                                                {p.images && <img src={JSON.parse(p.images)[0]} className="w-full h-full object-contain p-2" />}
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sugerido</p>
                                            <p className="text-[11px] font-black text-[#1E3A8A] mb-3 uppercase tracking-tight line-clamp-1">{p.name}</p>
                                            <p className="text-xs font-black text-blue-600 mb-4">{formatCurrency(p.price)}</p>
                                            <Link href={`/web/product/${p.id}`} className="block w-full py-2 bg-white border border-slate-200 text-center text-[9px] font-black uppercase tracking-widest hover:bg-[#1E3A8A] hover:text-white transition-all rounded-lg">Ver Detalle</Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary & Checkout */}
                    <div className="space-y-8">
                        {/* Permanent Explanatory Box (Contra Entrega) */}
                        <div className="p-8 bg-white border-l-4 border-l-amber-500 rounded-2xl shadow-md space-y-4">
                            <div className="flex items-center gap-3 text-amber-600 font-black uppercase tracking-widest text-[10px] italic">
                                <Info size={16} /> Política de Entregas Nacionales
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                                • Compras <span className="text-amber-700">$0 - $100</span>: Contra Entrega total. <br/>
                                • Compras <span className="text-amber-700">+$100</span>: Solicitamos un anticipo del <span className="font-black text-amber-700 italic">50%</span> para activar el proceso logístico Contra Entrega.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 mb-10 italic">Resumen de Inversión</h2>
                            
                            <div className="space-y-6 border-b border-slate-100 pb-10 mb-10">
                                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <AnimatePresence>
                                    {discount > 0 && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-emerald-500">
                                            <span>Descuento Aplicado (10%)</span>
                                            <span>-{formatCurrency(discount)}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#1E3A8A]">Total Final</span>
                                    <span className="text-4xl font-black text-[#1E3A8A] italic leading-none">{formatCurrency(finalTotal)}</span>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="mb-10 space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 ml-2 italic flex items-center gap-2"><Mail size={12} /> Email para Comprobante</label>
                                <input type="email" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-[12px] font-bold text-[#1E3A8A] outline-none focus:border-blue-500 shadow-inner" placeholder="ejemplo@atomic.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>

                            <div className="space-y-4 mb-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6 italic">Arquitectura de Pago</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'transfer', icon: <Building2 />, title: 'Transferencia', sub: 'Banca Electrónica' },
                                        { id: 'cod', icon: <Wallet />, title: 'Contra Entrega', sub: 'Nacional' },
                                        { id: 'debit', icon: <CreditCard />, title: 'Débito', sub: 'Pago Seguro' },
                                        { id: 'oc', icon: <FileText />, title: 'Orden de Compra', sub: 'Corporativo' }
                                    ].map((m) => (
                                        <button key={m.id} onClick={() => { setPaymentMethod(m.id as any); if (m.id === 'oc') setShowOCForm(true); }} className={`flex items-center gap-4 p-4 border rounded-2xl transition-all ${paymentMethod === m.id ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}>
                                            <div className={`${paymentMethod === m.id ? 'text-blue-600' : 'text-slate-300'}`}>{m.icon}</div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#1E3A8A]">{m.title}</p>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase">{m.sub}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {paymentMethod === 'cod' && subtotal > 100 && (
                                <div className="mb-10 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <p className="text-[9px] text-amber-800 font-black italic mb-4 uppercase">Requiere Anticipo del 50%</p>
                                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={agreedToDeposit} onChange={e => setAgreedToDeposit(e.target.checked)} className="accent-amber-600" /> <span className="text-[9px] font-black uppercase text-amber-900">Acepto Condiciones</span></label>
                                </div>
                            )}

                            <button onClick={handleCheckout} disabled={loading || (paymentMethod === 'cod' && subtotal > 100 && !agreedToDeposit)} className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white py-7 text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 rounded-2xl shadow-xl italic">
                                {loading ? 'Sincronizando...' : <>FINALIZAR EN WHATSAPP <ArrowRight size={18} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* OC Form Modal */}
            <AnimatePresence>
                {showOCForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-[3rem] p-12 custom-scrollbar">
                            <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-8">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-[#1E3A8A] text-white rounded-2xl"><FileText size={24} /></div>
                                    <div><h2 className="text-3xl font-black text-[#1E3A8A] uppercase tracking-tighter italic">Orden de Compra</h2><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Instrumento Corporativo de Adquisición</p></div>
                                </div>
                                <button onClick={() => setShowOCForm(false)} className="p-3 text-slate-400 hover:text-red-500"><X size={32} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Razón Social / Cliente</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs font-bold uppercase outline-none focus:border-blue-500" value={ocData.clientName} onChange={e => setOcData({...ocData, clientName: e.target.value.toUpperCase()})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">RUC / Cédula</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs font-bold outline-none focus:border-blue-500" value={ocData.ruc} onChange={e => setOcData({...ocData, ruc: e.target.value})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Teléfono Corporativo</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs font-bold outline-none focus:border-blue-500" value={ocData.phone} onChange={e => setOcData({...ocData, phone: e.target.value})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Ubicación de Entrega</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs font-bold uppercase outline-none focus:border-blue-500" value={ocData.address} onChange={e => setOcData({...ocData, address: e.target.value.toUpperCase()})} />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={handleExportOC} className="flex-1 bg-slate-100 text-slate-600 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3"><Download size={18} /> EXPORTAR PDF</button>
                                <button onClick={() => setShowOCForm(false)} className="flex-[2] bg-[#1E3A8A] text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl flex items-center justify-center gap-3 italic">CONSOLIDAR Y CONTINUAR <CheckCircle2 size={18} /></button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
