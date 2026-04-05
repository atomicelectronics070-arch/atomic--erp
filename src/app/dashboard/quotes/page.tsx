"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Trash2, FileOutput, Calculator, Image as ImageIcon, User, ShieldCheck, Mail, Phone, Search, MapPin, MessageSquare, History, Copy, X, Clock } from "lucide-react"
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
    const [quoteNumber, setQuoteNumber] = useState("Cargando...")
    const [globalQuoteNumber, setGlobalQuoteNumber] = useState("")
    const [advisorName, setAdvisorName] = useState("NOMBRE DEL ASESOR")

    useEffect(() => {
        if (session?.user?.name && (advisorName === "NOMBRE DEL ASESOR" || advisorName === "")) {
            setAdvisorName(session.user.name.toUpperCase())
        }
    }, [session, advisorName])
    const [warrantyNote, setWarrantyNote] = useState("Garantía de 12 meses contra defectos de fábrica. No cubre daños por mal uso or variaciones de voltaje.")
    const [warrantyComments, setWarrantyComments] = useState("")
    const [items, setItems] = useState<QuoteItem[]>([
        { id: "1", productId: "", description: "", quantity: 1, unitPrice: 0 }
    ])
    const [discountPercent, setDiscountPercent] = useState(0)
    const [productImage, setProductImage] = useState<string | null>(null)
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
    const [products, setProducts] = useState<Product[]>([])
    const [showProductList, setShowProductList] = useState<string | null>(null)
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
        const data = await res.json()
        setProducts(data)
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

                // Get original dimensions to prevent PDF distortion
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
            alert("⚠️ Error: El Nombre, Email y Teléfono del cliente son OBLIGATORIOS.")
            return
        }

        // --- BACKGROUND SAVE TO DATABASE ---
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
                items: items.filter(i => i.description.trim() !== "")
            };

            await fetch("/api/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quoteData)
            });

            // Refresh history and get next number for the future
            fetchHistory()
            fetchNextNumber()

        } catch (e) {
            console.error("⚠️ Background Save Error:", e)
        }

        const doc = new jsPDF()

        // --- Header Section ---
        doc.setFillColor(255, 255, 255)
        doc.rect(0, 0, 210, 50, 'F')

        try {
            doc.addImage('/logo_atomic.jpg', 'JPEG', 14, 10, 45, 25)
        } catch (e) {
            doc.setFontSize(24)
            doc.setTextColor(234, 88, 12)
            doc.text("ATOMIC INDUSTRIES", 14, 25)
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
        doc.text("Nivel Industrial | División ERP", rightColumnX, 77)

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
            doc.setTextColor(234, 88, 12)
            doc.text(`TOTAL NETO:`, calcX, finalY + 42)
            doc.text(`$${total.toFixed(2)}`, 195, finalY + 42, { align: 'right' })
            finalY += 45
        } else {
            doc.text(`I.V.A. (15%):`, calcX, finalY + 20)
            doc.text(`$${taxAmount.toFixed(2)}`, 195, finalY + 20, { align: 'right' })

            doc.setFontSize(14)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(234, 88, 12)
            doc.text(`TOTAL NETO:`, calcX, finalY + 31)
            doc.text(`$${total.toFixed(2)}`, 195, finalY + 31, { align: 'right' })
            finalY += 35
        }

        // --- Image Section (Separated/Spaced/Proportional) ---
        if (productImage) {
            if (finalY + 90 > 280) {
                doc.addPage()
                finalY = 20
            } else {
                finalY += 20 // Space between totals and image
            }

            doc.setFontSize(9)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(0)
            doc.text("DOCUMENTACIÓN VISUAL / FOTO REFERENCIAL:", 14, finalY)

            // Calculate proportional dimensions to avoid distortion
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

            // Optional: indent image slightly for aesthetics
            const xPos = 14;

            // Format fallback to prevent crashes if not JPEG (jsPDF usually handles base64 directly)
            doc.addImage(productImage, 'JPEG', xPos, finalY + 5, printW, printH)
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
        doc.setTextColor(234, 88, 12)
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
        doc.text("ATOMIC INDUSTRIES ECUADOR", 20, signatureY + 8)

        doc.line(130, signatureY, 190, signatureY)
        doc.text(advisorName.toUpperCase(), 130, signatureY + 4)
        doc.text("ASESOR TÉCNICO RESPONSABLE", 130, signatureY + 8)

        doc.save(`${quoteNumber}_${clientName.replace(/\s+/g, "_")}.pdf`)
    }

    const handleDuplicateQuote = (quote: any) => {
        setClientName(quote.clientName || "")
        // Attempt to extract email via the API later, for now leave blank if not saved in UI fields
        setClientEmail("")
        setClientPhone("")
        setDeliveryAddress(quote.deliveryAddress || "")
        setWarrantyComments(quote.warrantyComments || "")
        setDiscountPercent(quote.discountPercent || 0)
        setAdvisorName(quote.advisorName || "")

        try {
            if (quote.itemsData) {
                const parsedItems = JSON.parse(quote.itemsData)
                if (Array.isArray(parsedItems) && parsedItems.length > 0) {
                    // Generate new IDs for the cloned items so React keys don't clash
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
        alert("✅ Cotización base cargada exitosamente.")
    }

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-white italic uppercase flex items-center gap-4">
                        Cotizador <span className="text-secondary">Enterprise</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-3">Generación Táctica de Propuestas PROP-MM-NNN con Integración de Inventario.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="glass-panel text-slate-400 px-8 py-5 font-black uppercase tracking-widest text-[10px] flex items-center space-x-3 hover:text-white hover:bg-white/5 transition-all shadow-xl rounded-2xl border-white/5"
                    >
                        <History size={18} />
                        <span>Archivo Histórico ({quoteHistory.length})</span>
                    </button>
                    <button
                        onClick={handleGeneratePDF}
                        className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center space-x-4 hover:bg-white hover:text-secondary transition-all shadow-[0_20px_50px_-5px_rgba(255,99,71,0.5)] rounded-2xl active:scale-[0.98]"
                    >
                        <FileOutput size={20} />
                        <span>Emitir Propuesta Final</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Panel: Configuration */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Client Data Card */}
                    <div className="glass-panel p-12 shadow-2xl relative overflow-hidden rounded-[3rem] border-white/5">
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
                        <div className="flex items-center space-x-4 mb-12 border-b border-white/5 pb-8">
                            <User size={28} className="text-secondary" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Identificación de Cliente Corporativo</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="md:col-span-2 space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Nombre Completo / Razón Social</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="EJ: CORPORACIÓN INDUSTRIAL SUR"
                                    className="w-full px-6 py-5 bg-slate-900 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all placeholder:text-slate-800"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Canal de Contacto (Email)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="CORREO@CORPORATIVO.COM"
                                        className="w-full pl-16 pr-6 py-5 bg-slate-900 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all placeholder:text-slate-800"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Terminal Telefónica / WhatsApp</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="09XXXXXXXX"
                                        className="w-full pl-16 pr-6 py-5 bg-slate-900 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all placeholder:text-slate-800"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Dirección de Logística / Entrega</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="CALLE PRIMARIA, SECUNDARIA Y NRO..."
                                        className="w-full pl-16 pr-6 py-5 bg-slate-900 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all placeholder:text-slate-800"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Vendedor Responsable (Se refleja en PDF)</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={advisorName}
                                        onChange={(e) => setAdvisorName(e.target.value)}
                                        placeholder="EJ: JUAN PÉREZ / DEPARTAMENTO DE VENTAS"
                                        className="w-full pl-16 pr-6 py-5 bg-slate-900 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all placeholder:text-slate-800 italic"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table Card */}
                    <div className="glass-panel p-12 shadow-2xl rounded-[3rem] border-white/5 overflow-hidden">
                        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Partidas Presupuestarias</h2>
                            <button
                                onClick={handleAddItem}
                                className="text-[10px] font-black text-secondary bg-secondary/10 px-8 py-4 hover:bg-secondary hover:text-white transition-all uppercase tracking-[0.3em] border border-secondary/20 rounded-2xl shadow-2xl"
                            >
                                <Plus size={18} className="mr-2 inline" /> Añadir Partida
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="hidden md:grid grid-cols-12 gap-6 px-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
                                <div className="col-span-2">SKU / COD</div>
                                <div className="col-span-4">Descripción del Item</div>
                                <div className="col-span-1 text-center">Cant.</div>
                                <div className="col-span-2 text-right">P. Unitario</div>
                                <div className="col-span-2 text-right">Monto Total</div>
                                <div className="col-span-1"></div>
                            </div>

                            {items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white/[0.02] p-8 border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-secondary/30 transition-all group relative">
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(item.id, "productId", e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-900 border border-white/5 rounded-xl text-[11px] font-black text-white focus:ring-2 focus:ring-secondary/50 outline-none uppercase tracking-widest"
                                        />
                                    </div>
                                    <div className="col-span-4 relative">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onFocus={() => setShowProductList(item.id)}
                                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                                            placeholder="BUSCAR PRODUCTO..."
                                            className="w-full px-5 py-4 bg-slate-900 border border-white/5 rounded-xl text-[11px] font-black text-white focus:ring-2 focus:ring-secondary/50 outline-none uppercase tracking-tight italic"
                                        />
                                        {/* Autocomplete Dropdown */}
                                        {showProductList === item.id && (
                                            <div className="absolute top-full left-0 w-full glass-panel !bg-slate-950/90 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] z-50 mt-4 max-h-80 overflow-y-auto anima-in fade-in zoom-in-95 duration-300 rounded-[2rem] border border-white/10 scrollbar-hide">
                                                {products
                                                    .filter(p => p.name.toLowerCase().includes(item.description.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(item.description.toLowerCase())))
                                                    .map(p => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => selectProduct(item.id, p)}
                                                            className="w-full text-left px-8 py-6 border-b border-white/5 hover:bg-white/[0.05] transition-all group/opt"
                                                        >
                                                            <p className="text-xs font-black text-white uppercase tracking-tight group-hover/opt:text-secondary transition-colors italic">{p.name}</p>
                                                            <div className="flex justify-between items-center mt-3">
                                                                <span className="text-[9px] font-black text-secondary uppercase tracking-[0.3em]">{p.sku}</span>
                                                                <span className="text-[10px] font-black text-emerald-400 tracking-tighter">${p.price.toFixed(2)}</span>
                                                            </div>
                                                        </button>
                                                    ))
                                                }
                                                <button
                                                    onClick={() => setShowProductList(null)}
                                                    className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] sticky bottom-0"
                                                >
                                                    Cerrar Nodo de Búsqueda
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)}
                                            className="w-full py-4 bg-slate-900 border border-white/5 rounded-xl text-xs text-center font-black text-white focus:ring-2 focus:ring-secondary/50 outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                            className="w-full py-4 px-5 bg-slate-900 border border-white/5 rounded-xl text-xs text-right font-black text-white focus:ring-2 focus:ring-secondary/50 outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-sm font-black text-white tracking-tighter group-hover:text-secondary transition-colors">
                                            ${(item.quantity * item.unitPrice).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-500 transition-all p-3 glass-panel !bg-slate-950 rounded-xl border-white/5"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="glass-panel p-12 shadow-2xl relative rounded-[3rem] border-white/5">
                            <h2 className="text-xl font-black text-white mb-8 uppercase tracking-tighter flex items-center italic">
                                <ShieldCheck size={24} className="mr-4 text-emerald-400" /> Documento de Garantía
                            </h2>
                            <textarea
                                value={warrantyNote}
                                onChange={(e) => setWarrantyNote(e.target.value)}
                                rows={5}
                                className="w-full p-8 bg-slate-900 border border-white/5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-secondary/50 outline-none resize-none leading-relaxed text-slate-500"
                            />
                        </div>
                        <div className="glass-panel p-12 shadow-2xl rounded-[3rem] border-white/5 relative overflow-hidden">
                            <h2 className="text-xl font-black text-white mb-8 uppercase tracking-tighter flex items-center italic">
                                <MessageSquare size={24} className="mr-4 text-secondary" /> Comentarios Garantía
                            </h2>
                            <textarea
                                value={warrantyComments}
                                onChange={(e) => setWarrantyComments(e.target.value)}
                                placeholder="NOTAS ADICIONALES SOBRE LA GARANTÍA..."
                                rows={5}
                                className="w-full p-8 bg-slate-900 border border-white/5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-secondary/50 outline-none resize-none leading-relaxed text-white placeholder:text-slate-800"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel: Totalization */}
                <div className="lg:col-span-1 space-y-12">
                    <div className="glass-panel text-white p-16 shadow-[0_50px_100px_rgba(0,0,0,0.6)] sticky top-28 flex flex-col items-center text-center rounded-[4rem] border-white/5">
                        <div className="w-24 h-3 bg-secondary mb-12 rounded-full shadow-[0_0_30px_rgba(255,99,71,0.5)]"></div>
                        <h2 className="text-3xl font-black mb-12 flex flex-col items-center uppercase tracking-[0.4em] text-secondary italic">
                            <Calculator size={40} className="mb-6 drop-shadow-[0_0_15px_rgba(255,99,71,0.5)]" /> Resumen Fiscal
                        </h2>

                        <div className="w-full space-y-10 text-sm font-black">
                            <div className="flex justify-between items-center text-slate-600 border-b border-white/5 pb-6">
                                <span className="uppercase tracking-[0.3em] text-[10px]">Subtotal Bruto</span>
                                <span className="text-white text-2xl tracking-tighter">${subtotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex items-center justify-between py-4">
                                <div className="text-left">
                                    <span className="text-slate-600 uppercase text-[10px] tracking-[0.3em]">Ajuste / Descuento</span>
                                    <p className="text-[9px] text-secondary/60 mt-1 uppercase font-light">Margen Estratégico</p>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                        className="w-28 px-6 py-5 bg-slate-900 border border-white/10 rounded-2xl text-right focus:border-secondary outline-none text-secondary font-black text-xl shadow-inner"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 text-xs font-black">%</span>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-white/5">
                                {discountPercent > 0 && (
                                    <div className="flex justify-between items-center text-secondary">
                                        <span className="text-[10px] tracking-[0.3em] uppercase">Bonificación</span>
                                        <span className="text-xl tracking-tighter">-${discountAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="text-[10px] tracking-[0.3em] uppercase">Base Imponible</span>
                                    <span className="text-xl tracking-tighter text-slate-300">${taxableAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span className="text-[10px] tracking-[0.3em] uppercase">IVA Transferido (15%)</span>
                                    <span className="text-xl tracking-tighter text-slate-400">${taxAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="pt-16 pb-6 relative">
                                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2"></div>
                                <div className="relative bg-transparent inline-block px-8 py-4 glass-panel !rounded-full border-secondary/20 shadow-2xl">
                                    <span className="text-[12px] font-black text-secondary uppercase tracking-[0.5em] block mb-2">Total Liquidación</span>
                                    <span className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">${total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="mt-12 text-left glass-panel !bg-slate-950/60 p-8 border-white/5 rounded-[2rem]">
                                <p className="text-[9px] text-slate-700 uppercase tracking-[0.2em] leading-loose font-black">
                                    <span className="text-secondary mr-2">/</span> Numero de Documento: {quoteNumber}<br />
                                    <span className="text-secondary mr-2">/</span> Vigencia Industrial Standard: 8 Días<br />
                                    <span className="text-secondary mr-2">/</span> Sujeto a disponibilidad de inventario
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-12 shadow-2xl rounded-[3rem] border-white/5 group overflow-hidden transition-all">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center italic">
                            <ImageIcon size={20} className="mr-3 text-secondary" /> Portafolio de Producto
                        </h3>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-80 border-2 border-dashed border-white/10 bg-slate-900/60 flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all overflow-hidden p-4 rounded-[2rem] relative"
                        >
                            {productImage ? (
                                <img src={productImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
                            ) : (
                                <>
                                    <div className="p-8 glass-panel !bg-slate-950 rounded-full mb-6 group-hover:scale-110 transition-transform border-white/5 shadow-2xl">
                                        <Plus size={48} className="text-slate-800" />
                                    </div>
                                    <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] text-center px-8">Inyectar Captura Visual / Documentación</span>
                                </>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        {productImage && (
                            <button onClick={() => setProductImage(null)} className="mt-6 w-full text-center text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all">Eliminar Imagen de Propuesta</button>
                        )}
                    </div>
                </div>

            </div>

            {/* SIDE PANEL: HISTORIAL DE COTIZACIONES */}
            {isHistoryOpen && (
                <>
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl z-[300] animate-in fade-in duration-500" onClick={() => setIsHistoryOpen(false)} />

                    <div className={`fixed inset-y-0 right-0 w-full md:w-[700px] glass-panel !bg-slate-950 shadow-[-50px_0_100px_rgba(0,0,0,0.8)] z-[310] transform transition-transform duration-700 ease-in-out flex flex-col border-l border-white/10 rounded-l-[4rem] overflow-hidden ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="flex items-center justify-between p-12 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-6">
                                <div className="bg-secondary/10 p-5 text-secondary rounded-2xl shadow-2xl border border-secondary/20"><History size={28} /></div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Archivo Maestro</h2>
                                    <p className="text-[10px] text-secondary font-black uppercase tracking-[0.4em] mt-3">Historial Táctico de Liquidación</p>
                                </div>
                            </div>
                            <button onClick={() => setIsHistoryOpen(false)} className="p-4 glass-panel !bg-slate-900 rounded-2xl text-slate-500 hover:text-white hover:rotate-90 transition-all duration-300 border-white/5">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
                            {quoteHistory.length === 0 ? (
                                <div className="text-center py-40 text-slate-800 flex flex-col items-center">
                                    <Clock size={80} className="mb-8 opacity-20" />
                                    <p className="text-xs font-black uppercase tracking-[0.5em]">No se detectan registros históricos.</p>
                                </div>
                            ) : (
                                quoteHistory.map((quote) => (
                                    <div key={quote.id} className="glass-panel !bg-white/[0.02] p-8 border border-white/5 shadow-2xl hover:border-secondary/30 transition-all group flex flex-col rounded-[2.5rem] relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 group-hover:bg-secondary transition-colors"></div>
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-black text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20">{quote.quoteNumber}</span>
                                                    {quote.globalQuoteNumber && (
                                                        <span className="text-[10px] font-black text-slate-500 border border-white/5 uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg" title="Numeración Global de la Empresa">
                                                            {quote.globalQuoteNumber}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-black text-white mt-6 uppercase italic tracking-tight">{quote.clientName || 'CLIENTE NO ESPECIFICADO'}</h3>
                                                <div className="space-y-2 mt-4">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] block">
                                                        Responsable: <span className="text-slate-400 italic">{quote.advisorName || quote.salesperson?.name || "SISTEMA CENTRAL"}</span>
                                                    </span>
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] block">
                                                        Fecha: <span className="text-slate-500">{new Date(quote.createdAt).toLocaleDateString()} — {new Date(quote.createdAt).toLocaleTimeString()}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors">${quote.total ? quote.total.toLocaleString('es-EC', { minimumFractionDigits: 2 }) : "0.00"}</p>
                                                <div className="flex flex-col gap-3 mt-6 items-end">
                                                    <button
                                                        onClick={() => handleDuplicateQuote(quote)}
                                                        className="px-6 py-2.5 glass-panel !bg-slate-900 text-slate-400 hover:text-secondary hover:bg-white transition-all text-center uppercase text-[10px] font-black tracking-widest rounded-xl border-white/5 flex items-center justify-center gap-3 w-full"
                                                    >
                                                        <Copy size={14} />
                                                        <span>Clonar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}






