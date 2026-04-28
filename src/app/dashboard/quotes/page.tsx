"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Trash2, FileOutput, Calculator, Image as ImageIcon, 
    User, ShieldCheck, Mail, Phone, Search, MapPin, 
    MessageSquare, History, Copy, X, Clock, ChevronRight,
    TrendingUp, FileText, Target, Briefcase, Save
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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
}

export default function QuotationGenerator() {
    const { data: session } = useSession()
    const [clientName, setClientName] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [quoteNumber, setQuoteNumber] = useState("Sincronizando...")
    const [globalQuoteNumber, setGlobalQuoteNumber] = useState("")
    const [advisorName, setAdvisorName] = useState("NOMBRE DEL ASESOR")

    useEffect(() => {
        if (session?.user?.name && (advisorName === "NOMBRE DEL ASESOR" || advisorName === "")) {
            setAdvisorName(session.user.name.toUpperCase())
        }
    }, [session, advisorName])

    const [warrantyNote, setWarrantyNote] = useState("Garantía de 12 meses contra defectos de fábrica. No cubre daños por mal uso o variaciones de voltaje.")
    const [warrantyComments, setWarrantyComments] = useState("")
    const [items, setItems] = useState<QuoteItem[]>([
        { id: "1", productId: "", description: "", quantity: 1, unitPrice: 0 }
    ])
    const [discountPercent, setDiscountPercent] = useState(0)
    const [productImage, setProductImage] = useState<string | null>(null)
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
    const [products, setProducts] = useState<Product[]>([])
    const [showProductList, setShowProductList] = useState<string | null>(null)
    const [status, setStatus] = useState<"PENDIENTE" | "CERRADO" | "ABANDONADO">("PENDIENTE")
    const fileInputRef = useRef<HTMLInputElement>(null)

    // History State
    const [quoteHistory, setQuoteHistory] = useState<any[]>([])
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)

    const taxRate = 0.15 // 15% IVA

    useEffect(() => {
        fetchNextNumber()
        fetchProducts()
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/quotes")
            if (res.ok) {
                const data = await res.json()
                setQuoteHistory(data)
            }
        } catch (e) {
            console.error("Failed to load history")
        }
    }

    const fetchNextNumber = async () => {
        const res = await fetch("/api/quotes/next-number")
        if (res.ok) {
            const data = await res.json()
            setQuoteNumber(data.quoteNumber)
            setGlobalQuoteNumber(data.globalQuoteNumber)
        }
    }

    const fetchProducts = async () => {
        const res = await fetch("/api/products")
        if (res.ok) {
            const data = await res.json()
            setProducts(data)
        }
    }

    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
    }

    const subtotal = calculateSubtotal()
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
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value }
            }
            return item
        }))
    }

    const selectProduct = (itemId: string, product: Product) => {
        setItems(items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    productId: product.sku || product.id.substring(0, 6),
                    description: product.name,
                    unitPrice: product.price
                }
            }
            return item
        }))
        setShowProductList(null)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const imgData = reader.result as string
                setProductImage(imgData)

                const img = new Image()
                img.onload = () => {
                    setImageDimensions({ width: img.width, height: img.height })
                }
                img.src = imgData
            }
            reader.readAsDataURL(file)
        }
    }

    const handleGeneratePDF = async () => {
        if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
            alert("⚠️ Gesti�n Fallido: Identificadores de Cliente Obligatorios (Nombre, Email, Teléfono). El teléfono es estrictamente necesario.")
            return
        }

        try {
            const quoteData = {
                quoteNumber,
                globalQuoteNumber,
                clientName,
                clientEmail,
                clientPhone,
                deliveryAddress,
                warrantyComments,
                discountPercent,
                subtotal,
                tax: taxAmount,
                total,
                advisorName: advisorName,
                items: items.filter(i => i.description.trim() !== ""),
                status: status
            };

            const res = await fetch("/api/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quoteData)
            });

            if (res.ok) {
                fetchHistory()
                fetchNextNumber()
            }
        } catch (e) {
            console.error("⚠️ Database Error:", e)
        }

        const doc = new jsPDF()

        // --- Header Section ---
        doc.setFillColor(255, 255, 255)
        doc.rect(0, 0, 210, 50, 'F')

        try {
            doc.addImage("/logo_atomic.jpg", "JPEG", 14, 10, 75, 25)
        } catch (e) {
            doc.setFontSize(24)
            doc.setTextColor(255, 99, 71) // Tomato
            doc.setFont("helvetica", "bold")
            doc.text("ATOMIC Solutions", 14, 25)
        }

        doc.setFontSize(9)
        doc.setTextColor(120)
        doc.text("RUC: 1792345678001 | Tel: (02) 2345-678", 14, 40)
        doc.text("Quito, Ecuador | www.atomicelectronica.com", 14, 45)

        doc.setFontSize(16)
        doc.setTextColor(0)
        doc.setFont("helvetica", "bold")
        doc.text(`PROPUESTA: ${quoteNumber}`, 130, 20)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 130, 28)
        doc.text(`Válido por: 8 días calendario`, 130, 34)

        // --- Client & Advisor Section ---
        doc.setDrawColor(240)
        doc.line(14, 55, 196, 55)

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text("DATOS DEL CLIENTE / CORPORATIVO:", 14, 65)

        doc.setFontSize(10)
        doc.setTextColor(0)
        doc.text(clientName.toUpperCase(), 14, 72)

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100)
        doc.text(`Email: ${clientEmail}`, 14, 78)
        doc.text(`Teléfono: ${clientPhone}`, 14, 83)
        if (deliveryAddress) {
            doc.text(`Dirección de Entrega: ${deliveryAddress.toUpperCase()}`, 14, 88)
        }

        const rightColumnX = 130
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(0)
        doc.text("VENDEDOR RESPONSABLE:", rightColumnX, 65)
        doc.setFontSize(10)
        doc.text(advisorName || "EMPRESA - ATOMIC", rightColumnX, 72)
        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.text("Nivel Corporativo | División ERP", rightColumnX, 77)

        // --- Table Section ---
        const tableColumn = ["Cod.", "Descripción del Producto / Servicio", "Cantidad", "P. Unitario", "Subtotal"]
        const tableRows = items.filter(i => i.description.trim() !== "").map((item) => [
            item.productId,
            item.description.toUpperCase(),
            item.quantity.toString(),
            `$${item.unitPrice.toFixed(2)}`,
            `$${(item.quantity * item.unitPrice).toFixed(2)}`
        ])

        autoTable(doc, {
            startY: 100,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [15, 15, 15], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 4 },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 90 },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 25, halign: 'right' },
            }
        })

        // @ts-ignore
        let finalY = doc.lastAutoTable.finalY || 100

        // --- Totals Area ---
        const calcX = 140
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100)

        doc.text(`Subtotal:`, calcX, finalY + 15)
        doc.text(`$${subtotal.toFixed(2)}`, 195, finalY + 15, { align: 'right' })

        if (discountPercent > 0) {
            doc.text(`Descuento (${discountPercent}%):`, calcX, finalY + 20)
            doc.text(`-$${discountAmount.toFixed(2)}`, 195, finalY + 20, { align: 'right' })

            doc.setFont("helvetica", "bold")
            doc.setTextColor(0)
            doc.text(`Base Imponible:`, calcX, finalY + 26)
            doc.text(`$${taxableAmount.toFixed(2)}`, 195, finalY + 26, { align: 'right' })

            doc.setFont("helvetica", "normal")
            doc.setTextColor(100)
            doc.text(`I.V.A. (15%):`, calcX, finalY + 31)
            doc.text(`$${taxAmount.toFixed(2)}`, 195, finalY + 31, { align: 'right' })

            doc.setFontSize(14)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(255, 99, 71) // Tomato
            doc.text(`TOTAL NETO:`, calcX, finalY + 42)
            doc.text(`$${total.toFixed(2)}`, 195, finalY + 42, { align: 'right' })
            finalY += 45
        } else {
            doc.text(`I.V.A. (15%):`, calcX, finalY + 20)
            doc.text(`$${taxAmount.toFixed(2)}`, 195, finalY + 20, { align: 'right' })

            doc.setFontSize(14)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(255, 99, 71) // Tomato
            doc.text(`TOTAL NETO:`, calcX, finalY + 31)
            doc.text(`$${total.toFixed(2)}`, 195, finalY + 31, { align: 'right' })
            finalY += 35
        }

        // --- Image Section ---
        if (productImage) {
            if (finalY + 90 > 280) {
                doc.addPage()
                finalY = 20
            } else {
                finalY += 20
            }

            doc.setFontSize(9)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(0)
            doc.text("DOCUMENTACIÓN VISUAL / FOTO REFERENCIAL:", 14, finalY)

            const maxWidth = 100
            const maxHeight = 70
            let printW = maxWidth
            let printH = maxHeight

            if (imageDimensions.width > 0 && imageDimensions.height > 0) {
                const ratio = imageDimensions.width / imageDimensions.height
                if (maxWidth / ratio <= maxHeight) {
                    printW = maxWidth
                    printH = maxWidth / ratio
                } else {
                    printH = maxHeight
                    printW = maxHeight * ratio
                }
            }
            doc.addImage(productImage, 'JPEG', 14, finalY + 5, printW, printH)
            finalY += (printH + 15)
        }

        // --- Warranty & Comments ---
        if (finalY + 40 > 280) {
            doc.addPage()
            finalY = 20
        } else {
            finalY += 10
        }

        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(255, 99, 71) // Tomato
        doc.text("DOCUMENTO DE GARANTÍA:", 14, finalY)

        doc.setFont("helvetica", "normal")
        doc.setTextColor(80)
        const splitWarranty = doc.splitTextToSize(warrantyNote, 180)
        doc.text(splitWarranty, 14, finalY + 6)

        if (warrantyComments) {
            doc.setFont("helvetica", "bold")
            doc.text("COMENTARIOS ADICIONALES:", 14, finalY + 15)
            doc.setFont("helvetica", "normal")
            const splitComments = doc.splitTextToSize(warrantyComments, 180)
            doc.text(splitComments, 14, finalY + 21)
        }

        // --- Signatures ---
        const signatureY = 275
        doc.setTextColor(0)
        doc.setFontSize(8)
        doc.line(20, signatureY, 80, signatureY)
        doc.text("AUTORIZADO POR GERENCIA", 20, signatureY + 4)
        doc.text("ATOMIC Solutions ECUADOR", 20, signatureY + 8)

        doc.line(130, signatureY, 190, signatureY)
        doc.text(advisorName.toUpperCase(), 130, signatureY + 4)
        doc.text("ASESOR TÉCNICO RESPONSABLE", 130, signatureY + 8)

        doc.save(`${quoteNumber}_${clientName.replace(/\s+/g, "_")}.pdf`)
    }

    const handleDuplicateQuote = (quote: any) => {
        setClientName(quote.clientName || "")
        setClientEmail(quote.clientEmail || "")
        setClientPhone(quote.clientPhone || "")
        setDeliveryAddress(quote.deliveryAddress || "")
        setWarrantyComments(quote.warrantyComments || "")
        setDiscountPercent(quote.discountPercent || 0)
        setAdvisorName(quote.advisorName || "")

        try {
            if (quote.itemsData) {
                const parsedItems = JSON.parse(quote.itemsData)
                if (Array.isArray(parsedItems) && parsedItems.length > 0) {
                    const clonedItems = parsedItems.map((item: any, i: number) => ({
                        ...item,
                        id: Date.now().toString() + i
                    }))
                    setItems(clonedItems)
                }
            }
        } catch (e) {
            console.error("Failed to parse quote items", e)
        }

        setIsHistoryOpen(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[35%] h-[35%] rounded-none bg-azure-500/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] rounded-none bg-tomato-500/5 blur-[100px]" />
            </div>

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <Briefcase size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em]">ECOSISTEMA DE VENTAS</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Cotizador</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-4 max-w-2xl leading-relaxed italic">Generación táctica de propuestas comerciales PROP-MM-NNN con integración de inventario en tiempo real.</p>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="p-6 glass-panel text-slate-500 hover:text-white transition-all rounded-none border-white/5 group flex items-center gap-4"
                    >
                        <History size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Archivo Histórico ({quoteHistory.length})</span>
                    </button>
                    <button
                        onClick={handleGeneratePDF}
                        className="flex items-center space-x-6 bg-secondary text-white px-12 py-6 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-secondary transition-all shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] rounded-none active:scale-[0.98] group italic skew-x-[-12deg]"
                    >
                        <div className="skew-x-[12deg] flex items-center gap-6">
                            <FileOutput size={24} className="group-hover:translate-x-1 transition-transform" />
                            <span>Emitir Propuesta Final</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Left Panel: Configuration */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Client Data Card */}
                    <div className="glass-panel p-12 shadow-2xl relative overflow-hidden rounded-none-[3.5rem] border backdrop-blur-3xl border-white/5">
                        <div className="flex items-center space-x-6 mb-12 border-b border-white/5 pb-10">
                            <div className="p-4 bg-slate-900 rounded-none border border-white/10 shadow-2xl">
                                <User size={28} className="text-secondary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">DATOS DEL CLIENTE</h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Identificación Corporativa</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="md:col-span-2 space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Razón Social / Identidad Maestro</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="EJ: CORPORACIÓN Corporativo SUR S.A."
                                    className="w-full px-8 py-6 bg-slate-950/40 border border-white/5 rounded-none text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all placeholder:text-slate-800 shadow-inner"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Enlace de Comunicación (Email)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="CORREO@CORPORATIVO.COM"
                                        className="w-full pl-16 pr-8 py-6 bg-slate-950/40 border border-white/5 rounded-none text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all placeholder:text-slate-800 shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Terminal Telefónica</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="+593 9XXXXXXXX (OBLIGATORIO)"
                                        className={`w-full pl-16 pr-8 py-6 bg-slate-950/40 border ${!clientPhone ? 'border-red-500/50 animate-pulse' : 'border-white/5'} rounded-none text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all placeholder:text-slate-800 shadow-inner`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Estado de Negociación</label>
                                <div className="flex gap-2">
                                    {(["PENDIENTE", "CERRADO", "ABANDONADO"] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStatus(s)}
                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-none border ${
                                                status === s 
                                                    ? s === 'CERRADO' ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                                                      : s === 'ABANDONADO' ? 'bg-red-500 text-white border-red-600'
                                                      : 'bg-secondary text-white border-secondary'
                                                    : 'bg-slate-950/40 text-slate-400 border-white/5 hover:bg-white/5'
                                            } italic`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Dirección de Logística Corporativo</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="CALLE PRIMARIA, SECUNDARIA Y REFERENCIAS..."
                                        className="w-full pl-16 pr-8 py-6 bg-slate-950/40 border border-white/5 rounded-none text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all placeholder:text-slate-800 shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Vendedor Responsable</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={advisorName}
                                        onChange={(e) => setAdvisorName(e.target.value.toUpperCase())}
                                        placeholder="EJ: JUAN PÉREZ / DEPARTAMENTO DE VENTAS"
                                        className="w-full pl-16 pr-8 py-6 bg-slate-950/40 border border-white/5 rounded-none text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all placeholder:text-slate-800 italic shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table Card */}
                    <div className="glass-panel p-12 shadow-2xl rounded-none-[3.5rem] border border-white/5 overflow-hidden backdrop-blur-3xl">
                        <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-10">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Detalle de Productos</h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Lista de �tems</p>
                            </div>
                            <button
                                onClick={handleAddItem}
                                className="text-[10px] font-black text-secondary bg-secondary/10 px-10 py-5 hover:bg-secondary hover:text-white transition-all uppercase tracking-[0.3em] border border-secondary/20 rounded-none shadow-2xl active:scale-95 italic"
                            >
                                <Plus size={20} className="mr-3 inline" /> Agregar �tem
                            </button>
                        </div>

                        <div className="space-y-10">
                            <div className="hidden md:grid grid-cols-12 gap-8 px-8 text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] italic">
                                <div className="col-span-2">CÓDIGO</div>
                                <div className="col-span-4">REQUERIMIENTO / ÍTEM</div>
                                <div className="col-span-1 text-center">CANT.</div>
                                <div className="col-span-2 text-right">P. UNIT</div>
                                <div className="col-span-2 text-right underline decoration-secondary">TOTAL</div>
                                <div className="col-span-1"></div>
                            </div>

                            {items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-900/40 p-8 border border-white/5 rounded-none-[2.5rem] hover:bg-white/[0.04] hover:border-secondary/30 transition-all group relative shadow-inner">
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(item.id, "productId", e.target.value)}
                                            className="w-full px-6 py-5 bg-slate-950/60 border border-white/5 rounded-none text-[11px] font-black text-white focus:border-secondary outline-none uppercase tracking-widest shadow-inner text-center"
                                            placeholder="SKU"
                                        />
                                    </div>
                                    <div className="col-span-4 relative">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onFocus={() => setShowProductList(item.id)}
                                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                                            placeholder="IDENTIFICAR ITEM..."
                                            className="w-full px-6 py-5 bg-slate-950/60 border border-white/5 rounded-none text-[12px] font-black text-white focus:border-secondary outline-none uppercase tracking-tight italic shadow-inner"
                                        />
                                        <AnimatePresence>
                                            {showProductList === item.id && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full left-0 w-full glass-panel !bg-slate-900/95 shadow-[0_40px_80px_rgba(0,0,0,1)] z-[100] mt-6 max-h-96 overflow-y-auto rounded-none-[2.5rem] border border-white/10 custom-scrollbar"
                                                >
                                                    {products
                                                        .filter(p => p.name.toLowerCase().includes(item.description.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(item.description.toLowerCase())))
                                                        .map(p => (
                                                            <button
                                                                key={p.id}
                                                                onClick={() => selectProduct(item.id, p)}
                                                                className="w-full text-left px-10 py-8 border-b border-white/5 hover:bg-white/[0.05] transition-all group/opt relative overflow-hidden"
                                                            >
                                                                <div className="absolute left-0 top-0 w-1 h-full bg-secondary/0 group-hover/opt:bg-secondary transition-all" />
                                                                <p className="text-sm font-black text-white uppercase tracking-tighter group-hover/opt:text-secondary transition-colors italic">{p.name}</p>
                                                                <div className="flex justify-between items-center mt-4">
                                                                    <span className="text-[9px] font-black text-secondary bg-secondary/5 px-3 py-1 rounded-none border border-secondary/10 uppercase tracking-[0.3em]">{p.sku}</span>
                                                                    <span className="text-lg font-black text-white tracking-tighter underline underline-offset-4 decoration-emerald-500/30">${p.price.toFixed(2)}</span>
                                                                </div>
                                                            </button>
                                                        ))
                                                    }
                                                    {products.length === 0 && (
                                                        <div className="p-12 text-center text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] italic">No se detectan Elementos de inventario compatibles</div>
                                                    )}
                                                    <button
                                                        onClick={() => setShowProductList(null)}
                                                        className="w-full py-6 bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] hover:text-white transition-all sticky bottom-0 border-t border-white/5"
                                                    >
                                                        Abortar Selección
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)}
                                            className="w-full py-5 bg-slate-950/60 border border-white/5 rounded-none text-base text-center font-black text-white focus:border-secondary outline-none shadow-inner"
                                            min="1"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                            className="w-full py-5 px-6 bg-slate-950/60 border border-white/5 rounded-none text-base text-right font-black text-white focus:border-secondary outline-none shadow-inner italic"
                                        />
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-xl font-black text-white tracking-tighter group-hover:text-secondary transition-colors italic">
                                            ${(item.quantity * item.unitPrice).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-500 transition-all p-4 bg-slate-950 rounded-none border border-white/5 shadow-2xl"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="glass-panel p-12 shadow-2xl rounded-none-[3rem] border border-white/5 relative overflow-hidden group">
                            <h2 className="text-xl font-black text-white mb-10 uppercase tracking-tighter flex items-center italic">
                                <ShieldCheck size={28} className="mr-5 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" /> Cláusula de Garantía Corporativo
                            </h2>
                            <textarea
                                value={warrantyNote}
                                onChange={(e) => setWarrantyNote(e.target.value)}
                                rows={6}
                                className="w-full p-8 bg-slate-950/40 border border-white/5 rounded-none-[2.5rem] text-[12px] font-black uppercase tracking-widest focus:border-emerald-500/50 outline-none resize-none leading-relaxed text-slate-500 italic shadow-inner"
                            />
                        </div>
                        <div className="glass-panel p-12 shadow-2xl rounded-none-[3rem] border border-white/5 relative overflow-hidden group">
                            <h2 className="text-xl font-black text-white mb-10 uppercase tracking-tighter flex items-center italic">
                                <MessageSquare size={28} className="mr-5 text-secondary drop-shadow-[0_0_10px_rgba(255,99,71,0.3)]" /> Notas de Implementación
                            </h2>
                            <textarea
                                value={warrantyComments}
                                onChange={(e) => setWarrantyComments(e.target.value)}
                                placeholder="NOTAS ADICIONALES PARA EL DESPLIEGUE FINAL..."
                                rows={6}
                                className="w-full p-8 bg-slate-950/40 border border-white/5 rounded-none-[2.5rem] text-[12px] font-black uppercase tracking-widest focus:border-secondary/50 outline-none resize-none leading-relaxed text-white placeholder:text-slate-800 italic shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel: Totalization */}
                <div className="lg:col-span-1 space-y-12">
                    <div className="glass-panel text-white p-16 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] sticky top-32 flex flex-col items-center text-center rounded-none-[4rem] border border-white/5 backdrop-blur-3xl">
                        <div className="w-28 h-2.5 bg-secondary mb-14 rounded-none shadow-[0_0_30px_rgba(255,99,71,0.6)] animate-pulse"></div>
                        <h2 className="text-4xl font-black mb-14 flex flex-col items-center uppercase tracking-[0.5em] text-secondary italic">
                            <Calculator size={48} className="mb-8 drop-shadow-[0_0_15px_rgba(255,99,71,0.6)] group-hover:scale-110 transition-transform" /> Resumen de Totales
                        </h2>

                        <div className="w-full space-y-12 text-sm font-black">
                            <div className="flex justify-between items-center text-slate-600 border-b border-white/5 pb-8 relative group">
                                <span className="uppercase tracking-[0.4em] text-[10px] italic">Subtotal Bruto</span>
                                <span className="text-white text-3xl tracking-tighter italic group-hover:text-secondary transition-colors">${subtotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex items-center justify-between py-6">
                                <div className="text-left">
                                    <span className="text-slate-600 uppercase text-[10px] tracking-[0.4em] italic leading-none">Ajuste Estratégico</span>
                                    <p className="text-[9px] text-secondary/40 mt-3 uppercase font-black tracking-widest italic animate-pulse">Porcentaje de Descuento</p>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                        className="w-32 px-6 py-6 bg-slate-900 border border-white/10 rounded-none text-right focus:border-secondary outline-none text-secondary font-black text-2xl shadow-inner skew-x-[-8deg] group-hover:skew-x-0 transition-all duration-500"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 text-xs font-black">%</span>
                                </div>
                            </div>

                            <div className="space-y-8 pt-8 border-t border-white/5 relative">
                                {discountPercent > 0 && (
                                    <div className="flex justify-between items-center text-secondary relative z-10">
                                        <span className="text-[10px] tracking-[0.4em] uppercase italic">Impacto Bonificación</span>
                                        <span className="text-2xl tracking-tighter italic shadow-[0_0_20px_rgba(255,99,71,0.2)]">-${discountAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-slate-500 relative z-10">
                                    <span className="text-[10px] tracking-[0.4em] uppercase italic">Base Imponible</span>
                                    <span className="text-2xl tracking-tighter text-slate-300 italic">${taxableAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 relative z-10">
                                    <span className="text-[10px] tracking-[0.4em] uppercase italic">IVA Liquidado (15%)</span>
                                    <span className="text-2xl tracking-tighter text-slate-500 italic">${taxAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="pt-20 pb-8 relative group">
                                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2"></div>
                                <div className="relative bg-slate-950 inline-block px-12 py-8 rounded-none-[3rem] border border-secondary/30 shadow-[0_0_60px_rgba(255,99,71,0.25)] group-hover:shadow-[0_0_100px_rgba(255,99,71,0.4)] transition-all duration-700">
                                    <span className="text-[14px] font-black text-secondary uppercase tracking-[0.6em] block mb-4 italic">Total Liquidación</span>
                                    <span className="text-7xl font-black text-white tracking-tighter italic drop-shadow-[0_0_35px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform block">${total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="mt-16 text-left glass-panel !bg-slate-950/60 p-10 border-white/5 rounded-none-[2.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <ShieldCheck size={100} />
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] leading-loose font-black italic relative z-10">
                                    <span className="text-secondary mr-3 text-lg leading-none inline-block pb-1">•</span> <span className="text-slate-400">ID Detallesoría:</span> {quoteNumber}<br />
                                    <span className="text-secondary mr-3 text-lg leading-none inline-block pb-1">•</span> <span className="text-slate-400">Numeración Global:</span> {globalQuoteNumber}<br />
                                    <span className="text-secondary mr-3 text-lg leading-none inline-block pb-1">•</span> <span className="text-slate-400">Ventana de Emisión:</span> 8 Días<br />
                                    <span className="text-secondary mr-3 text-lg leading-none inline-block pb-1">•</span> <span className="text-slate-400">Stock:</span> Sujeto a Validación IA
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-12 shadow-2xl rounded-none-[3rem] border border-white/5 group overflow-hidden transition-all relative">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10 flex items-center italic">
                            <ImageIcon size={24} className="mr-5 text-secondary group-hover:scale-110 transition-transform" /> Portafolio Visión
                        </h3>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-96 border-4 border-dashed border-white/5 bg-slate-950/40 flex flex-col items-center justify-center cursor-pointer hover:border-secondary/50 hover:bg-secondary/5 transition-all overflow-hidden p-6 rounded-none-[3rem] relative shadow-inner group"
                        >
                            {productImage ? (
                                <img src={productImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-none shadow-2xl transform group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <>
                                    <div className="p-10 bg-slate-900/60 rounded-none mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all border border-white/5 shadow-2xl">
                                        <Plus size={56} className="text-secondary" />
                                    </div>
                                    <span className="text-[11px] text-slate-600 font-black uppercase tracking-[0.5em] text-center px-12 italic">Subir Captura Visual / Documentación Elemento</span>
                                </>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        {productImage && (
                            <button onClick={() => setProductImage(null)} className="mt-8 w-full text-center text-red-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-all italic hover:bg-red-500/10 py-4 rounded-none border border-red-500/10">Abortar Archivo Visual</button>
                        )}
                    </div>
                </div>
            </div>

            {/* SIDE PANEL: HISTORIAL DE COTIZACIONES */}
            <AnimatePresence>
                {isHistoryOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-end p-0 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" 
                            onClick={() => setIsHistoryOpen(false)} 
                        />

                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="w-full md:w-[750px] h-full glass-panel !bg-slate-950/60 shadow-[0_0_150px_rgba(0,0,0,1)] relative flex flex-col border-l border-white/10 md:rounded-none-[4.5rem] overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-14 border-b border-white/5 bg-white/[0.01] shrink-0">
                                <div className="flex items-center gap-8">
                                    <div className="bg-secondary p-5 text-white rounded-none shadow-2xl shadow-secondary/30 group hover:rotate-12 transition-transform">
                                        <History size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">Archivo <span className="text-secondary">Maestro</span></h2>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] mt-3 italic">Gesti�n Táctico de Liquidación</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsHistoryOpen(false)} 
                                    className="p-5 bg-slate-900 border border-white/10 rounded-none text-slate-500 hover:text-white hover:rotate-90 transition-all duration-500 shadow-2xl"
                                >
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar relative">
                                {quoteHistory.length === 0 ? (
                                    <div className="text-center py-52 text-slate-800 flex flex-col items-center">
                                        <Clock size={100} className="mb-10 opacity-10 animate-pulse" />
                                        <p className="text-xs font-black uppercase tracking-[0.6em] italic">No se detectan registros históricos autorizados.</p>
                                        <p className="text-[9px] text-slate-900 font-black uppercase tracking-[0.4em] mt-4">Gesti�n Cero: Estado Activo</p>
                                    </div>
                                ) : (
                                    quoteHistory.map((quote) => (
                                        <div key={quote.id} className="glass-panel !bg-slate-900/40 p-10 border border-white/5 shadow-2xl hover:border-secondary/40 hover:bg-white/[0.02] transition-all group flex flex-col rounded-none-[3rem] relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-slate-950 group-hover:bg-secondary transition-colors" />
                                            <div className="flex justify-between items-start mb-10 overflow-hidden">
                                                <div className="max-w-[70%]">
                                                    <div className="flex items-center gap-5 flex-wrap">
                                                        <span className="text-[11px] font-black text-secondary bg-secondary/10 px-5 py-2.5 rounded-none border border-secondary/20 shadow-2xl shadow-secondary/5 italic">{quote.quoteNumber}</span>
                                                        {quote.globalQuoteNumber && (
                                                            <span className="text-[9px] font-black text-slate-600 bg-slate-950 px-4 py-2 rounded-none border border-white/5 uppercase tracking-[0.2em] shadow-inner">
                                                                GLOB-ID: {quote.globalQuoteNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white mt-8 uppercase italic tracking-tighter group-hover:text-secondary transition-colors truncate">{quote.clientName || 'CLIENTE_ID: INDEFINIDO'}</h3>
                                                    <div className="space-y-3 mt-6">
                                                        <div className="flex items-center gap-3">
                                                            <Target size={14} className="text-slate-700" />
                                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] inline-block pt-0.5">Responsable: <span className="text-slate-400 italic">{quote.advisorName || quote.salesperson?.name || "ESTACIÓN CENTRAL"}</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Clock size={14} className="text-slate-700" />
                                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] inline-block pt-0.5">Emitido: <span className="text-slate-500 italic">{new Date(quote.createdAt).toLocaleDateString()} — {new Date(quote.createdAt).toLocaleTimeString()}</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="text-4xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform italic">${quote.total ? quote.total.toLocaleString('es-EC', { minimumFractionDigits: 2 }) : "0.00"}</p>
                                                    <div className="flex flex-col gap-4 mt-10 items-end w-full">
                                                        <button
                                                            onClick={() => handleDuplicateQuote(quote)}
                                                            className="px-8 py-4 bg-slate-950 text-slate-500 hover:text-white hover:bg-secondary transition-all text-center uppercase text-[10px] font-black tracking-[0.4em] rounded-none border-2 border-white/5 group/btn flex items-center justify-center gap-4 w-full md:w-auto min-w-[200px] shadow-2xl"
                                                        >
                                                            <Copy size={16} className="group-hover/btn:rotate-12 transition-transform" />
                                                            <span>Clonar Elemento</span>
                                                        </button>
                                                        <button className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em] hover:text-secondary transition-colors italic group-hover:translate-x-[-10px] flex items-center gap-2">
                                                            <span>Detallesar Registro Completo</span>
                                                            <ChevronRight size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-12 border-t border-white/5 bg-white/[0.01] shrink-0">
                                <button 
                                    onClick={() => setIsHistoryOpen(false)}
                                    className="w-full py-8 bg-white/5 text-slate-500 hover:text-white hover:bg-red-500 text-[11px] font-black uppercase tracking-[0.6em] italic rounded-none transition-all duration-700 border border-white/5 flex items-center justify-center gap-6 group shadow-2xl active:scale-95"
                                >
                                    <X size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                    <span>Suspender Detallesoría Histórica</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}


