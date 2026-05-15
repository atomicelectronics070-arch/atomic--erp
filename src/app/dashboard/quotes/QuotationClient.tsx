"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Trash2, FileOutput, Calculator, Image as ImageIcon, 
    User, ShieldCheck, Mail, Phone, MapPin, 
    MessageSquare, History, X, ChevronRight,
    Briefcase, Save, Clock, Search, CheckCircle2,
    FileText, Zap, Building2, Tag, Percent
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str) return fallback;
    if (Array.isArray(str)) return str;
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
        return fallback;
    }
};

type QuoteItem = {
    id: string
    productId: string
    description: string
    quantity: number
    unitPrice: number
}

interface Product {
    id: string
    name: string
    description: string | null
    price: number
    sku: string | null
    images?: string | null
}

interface QuotationClientProps {
    initialProducts: Product[]
    initialHistory: any[]
    nextNumber: string
    session: any
}

export default function QuotationClient({ initialProducts, initialHistory, nextNumber, session }: QuotationClientProps) {
    const [clientName, setClientName] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [emailNotSpecified, setEmailNotSpecified] = useState(false)
    const [clientPhone, setClientPhone] = useState("")
    const [clientCity, setClientCity] = useState("")
    const [quoteSubject, setQuoteSubject] = useState("")
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [quoteNumber, setQuoteNumber] = useState(nextNumber)

    // Pre-fill from URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlClient = params.get('client');
        const urlSubject = params.get('subject');
        if (urlClient) setClientName(urlClient);
        if (urlSubject) setQuoteSubject(urlSubject);
    }, []);
    const [advisorName, setAdvisorName] = useState(session.user?.name?.toUpperCase() || "ASESOR ATOMIC")

    const [items, setItems] = useState<QuoteItem[]>([
        { id: "1", productId: "", description: "", quantity: 1, unitPrice: 0 }
    ])

    const findProduct = (productId?: string, description?: string) => {
        return initialProducts.find((p: Product) => 
            (productId && p.sku === productId) || 
            (description && p.name === description)
        );
    };
    const [discountPercent, setDiscountPercent] = useState(0)
    const [status, setStatus] = useState<"PENDIENTE" | "CERRADO" | "ABANDONADO">("PENDIENTE")
    const [quoteHistory, setQuoteHistory] = useState(initialHistory)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [showProductList, setShowProductList] = useState<string | null>(null)

    const taxRate = 0.15 
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
    const discountAmount = subtotal * (discountPercent / 100)
    const taxableAmount = subtotal - discountAmount
    const taxAmount = taxableAmount * taxRate
    const total = taxableAmount + taxAmount

    const handleAddItem = () => {
        setItems([...items, { id: Date.now().toString(), productId: "", description: "", quantity: 1, unitPrice: 0 }])
    }

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id))
        }
    }

    const handleItemChange = (id: string, field: keyof QuoteItem, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
    }

    const selectProduct = (itemId: string, product: Product) => {
        setItems(items.map(item => item.id === itemId ? {
            ...item,
            productId: product.sku || product.id.substring(0, 6),
            description: product.name,
            unitPrice: product.price
        } : item))
        setShowProductList(null)
    }

    const handleGeneratePDF = async () => {
        const finalEmail = emailNotSpecified ? "no@especifica.com" : clientEmail;
        
        if (!clientName.trim() || !clientPhone.trim() || !clientCity.trim() || !quoteSubject.trim()) {
            alert("⚠️ CAMPOS OBLIGATORIOS: Nombre, Ciudad, Teléfono y Tema de la Cotización.");
            return
        }
        if (!emailNotSpecified && !clientEmail.includes("@")) {
            alert("⚠️ Correo electrónico inválido.");
            return
        }

        const doc = new jsPDF()
        const primaryColor = [79, 70, 229] // Indigo-600
        const secondaryColor = [15, 23, 42] // Slate-900
        const lightGray = [241, 245, 249] // Slate-100
        
        // Header Banner
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
        doc.rect(0, 0, 210, 40, 'F')
        
        doc.setFontSize(24)
        doc.setTextColor(255, 255, 255)
        doc.text("ATOMIC ERP", 14, 25)
        
        doc.setFontSize(10)
        doc.setTextColor(200, 200, 200)
        doc.text("Soluciones Tecnológicas e Industriales", 14, 32)
        
        // Quote Info Right Side
        doc.setFontSize(20)
        doc.setTextColor(255, 255, 255)
        doc.text("COTIZACIÓN", 195, 20, { align: "right" })
        
        doc.setFontSize(12)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(quoteNumber, 195, 28, { align: "right" })
        
        doc.setFontSize(9)
        doc.setTextColor(200, 200, 200)
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 195, 34, { align: "right" })
        
        // Client Info Block
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
        doc.rect(14, 45, 90, 35, 'F')
        
        doc.setFontSize(10)
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
        doc.setFont("helvetica", "bold")
        doc.text("PREPARADO PARA:", 18, 52)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.text(clientName, 18, 58)
        doc.text(`Email: ${emailNotSpecified ? "No especificado" : clientEmail}`, 18, 64)
        doc.text(`Tel: ${clientPhone}`, 18, 70)
        doc.text(`Ciudad: ${clientCity}`, 18, 76)
        
        // Project Info Block
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
        doc.rect(106, 45, 90, 35, 'F')
        
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text("DETALLES DEL PROYECTO:", 110, 52)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.text(quoteSubject.substring(0, 45), 110, 58)
        doc.text(`Asesor: ${advisorName}`, 110, 64)
        doc.text(`Estado Inicial: ${status}`, 110, 70)
        
        // Table
        autoTable(doc, {
            startY: 90,
            head: [["ITEM", "DESCRIPCIÓN", "CANT", "UNITARIO", "TOTAL"]],
            body: items.map(i => [
                i.productId, 
                i.description, 
                i.quantity, 
                `$${i.unitPrice.toFixed(2)}`, 
                `$${(i.quantity * i.unitPrice).toFixed(2)}`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', fontSize: 9 },
            bodyStyles: { fontSize: 9, textColor: 50 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 80 },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 25, halign: 'right' }
            }
        });
        
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        
        // Totals Block
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
        doc.rect(130, finalY, 66, 35, 'F')
        
        doc.setFontSize(10)
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
        doc.setFont("helvetica", "bold")
        doc.text("Subtotal:", 135, finalY + 8)
        doc.setFont("helvetica", "normal")
        doc.text(`$${subtotal.toFixed(2)}`, 190, finalY + 8, { align: "right" })
        
        doc.setFont("helvetica", "bold")
        doc.text("IVA (15%):", 135, finalY + 16)
        doc.setFont("helvetica", "normal")
        doc.text(`$${taxAmount.toFixed(2)}`, 190, finalY + 16, { align: "right" })
        
        if (discountPercent > 0) {
            doc.setFont("helvetica", "bold")
            doc.setTextColor(220, 38, 38)
            doc.text(`Desc. (${discountPercent}%):`, 135, finalY + 24)
            doc.setFont("helvetica", "normal")
            doc.text(`-$${discountAmount.toFixed(2)}`, 190, finalY + 24, { align: "right" })
            
            // Adjust finalY to fit the total below discount
            doc.setFontSize(12)
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
            doc.setFont("helvetica", "bold")
            doc.text("TOTAL USD:", 135, finalY + 32)
            doc.text(`$${total.toFixed(2)}`, 190, finalY + 32, { align: "right" })
        } else {
            doc.setFontSize(12)
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
            doc.setFont("helvetica", "bold")
            doc.text("TOTAL USD:", 135, finalY + 26)
            doc.text(`$${total.toFixed(2)}`, 190, finalY + 26, { align: "right" })
        }
        
        // Footer Notes
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.setFont("helvetica", "normal")
        doc.text("Condiciones: Esta cotización tiene una validez de 15 días. Los valores incluyen IVA.", 14, 280)
        doc.text("Forma de pago: Según acuerdo comercial vigente.", 14, 285)

        doc.save(`${quoteNumber}_${clientName.replace(/\s+/g, "_")}.pdf`)

        // Save to DB & Sync CRM
        await fetch("/api/quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quoteNumber, 
                clientName, 
                clientEmail: finalEmail, 
                clientPhone, 
                city: clientCity,
                quoteSubject,
                items, 
                subtotal,
                discountPercent,
                tax: taxAmount,
                total, 
                status, 
                advisorName,
                deliveryAddress
            })
        })
        alert("Cotización generada y guardada en el CRM con éxito.");
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-32">
            
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Cotizador Empresarial</h1>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            <span className="text-indigo-600 font-bold">{quoteNumber}</span> • Modo SaaS Activo
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsHistoryOpen(true)} 
                        className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 font-bold text-sm rounded-lg transition-all flex items-center gap-2 shadow-sm"
                    >
                        <History size={16}/> Historial
                    </button>
                    <button 
                        onClick={handleGeneratePDF}
                        className="px-6 py-2.5 bg-[#0F172A] text-white hover:bg-[#1E293B] font-bold text-sm rounded-lg transition-all flex items-center gap-2 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
                    >
                        <FileOutput size={16} /> GENERAR PDF
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Form & Items */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Project Subject */}
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-600">
                        <label className="text-[10px] font-black uppercase text-indigo-600 tracking-wider mb-2 flex items-center gap-2">
                            <Briefcase size={14} /> Asunto de la Cotización
                        </label>
                        <input 
                            value={quoteSubject} 
                            onChange={e => setQuoteSubject(e.target.value)} 
                            placeholder="Ej: Implementación de Sistema de Seguridad Perimetral..."
                            className="w-full bg-transparent text-xl font-bold text-[#0F172A] outline-none placeholder:text-slate-300 placeholder:font-normal" 
                        />
                    </div>

                    {/* Client Info */}
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <Building2 className="text-indigo-600" size={16} /> Datos del Cliente
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Razón Social / Nombre</label>
                                <input value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] uppercase rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ciudad / Ubicación</label>
                                <input value={clientCity} onChange={e => setClientCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] uppercase rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
                                    <label className="flex items-center gap-1.5 cursor-pointer group">
                                        <input type="checkbox" checked={emailNotSpecified} onChange={e => setEmailNotSpecified(e.target.checked)} className="accent-indigo-600" />
                                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-600 uppercase">Sin correo</span>
                                    </label>
                                </div>
                                <input 
                                    disabled={emailNotSpecified}
                                    value={clientEmail} 
                                    onChange={e => setClientEmail(e.target.value)} 
                                    className={`w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all ${emailNotSpecified ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    placeholder={emailNotSpecified ? "NO ESPECIFICA" : "correo@empresa.com"}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teléfono / Celular</label>
                                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                            </div>
                        </div>
                    </div>
 
                    {/* Products Detail */}
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                                <ShoppingCart className="text-indigo-600" size={16} /> Detalle de Ítems
                            </h2>
                            <button onClick={handleAddItem} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                                <Plus size={14} /> Fila
                            </button>
                        </div>
                        
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 border border-slate-200 rounded-t-lg text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            <div className="col-span-1 text-center">Img</div>
                            <div className="col-span-1">Código</div>
                            <div className="col-span-5">Descripción del Producto</div>
                            <div className="col-span-1 text-center">Cant.</div>
                            <div className="col-span-2 text-right">Unitario</div>
                            <div className="col-span-1 text-right">Total</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="space-y-2 mt-2">
                            <AnimatePresence mode="popLayout">
                                {items.map((item, i) => (
                                    <motion.div 
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="grid grid-cols-12 gap-4 items-center bg-white p-2 border border-slate-200 rounded-lg group hover:border-indigo-300 transition-all relative"
                                    >
                                        <div className="col-span-1">
                                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center relative overflow-hidden group-hover:border-indigo-200 transition-all mx-auto">
                                                {(() => {
                                                    const product = findProduct(item.productId, item.description);
                                                    const images = product?.images;
                                                    if (images && images !== 'null') {
                                                        const parsedImages = safeParseArray(images);
                                                        if (parsedImages.length > 0) {
                                                            return <img src={parsedImages[0]} className="w-full h-full object-contain" alt="preview" />;
                                                        }
                                                    }
                                                    return <ImageIcon size={14} className="text-slate-300" />;
                                                })()}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <input value={item.productId} readOnly className="w-full bg-transparent border-none text-slate-500 text-[9px] font-bold uppercase text-center" placeholder="SKU" />
                                        </div>
                                        <div className="col-span-5 relative">
                                            <input 
                                                value={item.description} 
                                                onFocus={() => setShowProductList(item.id)}
                                                onChange={e => handleItemChange(item.id, "description", e.target.value)} 
                                                className="w-full bg-slate-50 border border-slate-200 p-2 text-[#0F172A] text-xs font-bold rounded-md outline-none focus:border-indigo-500 transition-all" 
                                                placeholder="Buscar producto..."
                                            />
                                            {showProductList === item.id && (
                                                <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-lg z-50 max-h-48 overflow-y-auto">
                                                    {initialProducts.filter((p: Product) => p.name.toLowerCase().includes(item.description.toLowerCase())).map((p: Product) => (
                                                        <button key={p.id} onClick={() => selectProduct(item.id, p)} className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-slate-100 rounded flex-shrink-0 overflow-hidden">
                                                                {p.images && safeParseArray(p.images).length > 0 && <img src={safeParseArray(p.images)[0]} className="w-full h-full object-contain" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-[#0F172A] uppercase">{p.name}</p>
                                                                <p className="text-[10px] text-indigo-600 font-bold mt-0.5">${p.price}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            <input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 p-2 text-center text-[#0F172A] rounded-md font-bold text-xs outline-none focus:border-indigo-500" />
                                        </div>
                                        <div className="col-span-2">
                                            <div className="relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                                                <input type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 p-2 pl-6 text-right text-[#0F172A] rounded-md font-bold text-xs outline-none focus:border-indigo-500" />
                                            </div>
                                        </div>
                                        <div className="col-span-1 text-right pr-2">
                                            <span className="text-xs font-black text-slate-500">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <button onClick={() => handleRemoveItem(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Column: Totals & State */}
                <div className="lg:col-span-1 space-y-8">
                    
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm sticky top-32">
                        <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <Calculator className="text-indigo-600" size={16} /> Totales
                        </h2>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            
                            {/* Descuento Dinámico */}
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                <span className="flex items-center gap-1">Descuento <Percent size={12}/></span>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        min="0" max="100" 
                                        value={discountPercent} 
                                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                        className="w-16 bg-slate-50 border border-slate-200 p-1 text-right rounded-md outline-none focus:border-indigo-500"
                                    /> %
                                </div>
                            </div>
                            {discountPercent > 0 && (
                                <div className="flex justify-between items-center text-sm font-bold text-red-500">
                                    <span>Valor Descontado</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                <span>IVA (15%)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Liquidación</p>
                            <p className="text-4xl font-black text-indigo-600 tracking-tight">${total.toFixed(2)}</p>
                        </div>
                        
                        <div className="mt-8 space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Inicial</label>
                            <div className="flex flex-col gap-2">
                                {["PENDIENTE", "CERRADO", "ABANDONADO"].map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => setStatus(s as any)} 
                                        className={`py-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all border ${
                                            status === s 
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar History (Slide-over) */}
            <AnimatePresence>
                {isHistoryOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50"
                            onClick={() => setIsHistoryOpen(false)}
                        />
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white border-l border-slate-200 z-[60] flex flex-col shadow-2xl"
                        >
                            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-200 bg-slate-50">
                                <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-tight flex items-center gap-2">
                                    <History size={18} className="text-indigo-600" /> Historial de Cotizaciones
                                </h3>
                                <button onClick={() => setIsHistoryOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-all"><X size={20}/></button>
                            </div>
                            <div className="p-6 overflow-y-auto h-full space-y-4 custom-scrollbar bg-[#F8FAFC]">
                                {quoteHistory.map((q: any) => (
                                    <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest">{q.quoteNumber}</span>
                                            <span className="text-[9px] text-slate-400 uppercase font-bold">{new Date(q.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm font-black text-[#0F172A] uppercase tracking-tight line-clamp-1 mb-2">{q.clientName}</p>
                                        <div className="flex justify-between items-end mt-4">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase">{q.status}</span>
                                            <p className="text-lg font-black text-emerald-600">${q.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
