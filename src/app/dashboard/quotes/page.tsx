"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Trash2, FileOutput, Calculator, Image as ImageIcon, User, ShieldCheck, Mail, Phone, Search, MapPin, MessageSquare } from "lucide-react"
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
    const [clientName, setClientName] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [quoteNumber, setQuoteNumber] = useState("Cargando...")
    const [advisorName, setAdvisorName] = useState("JUAN PABLO GUZMAN")
    const [warrantyNote, setWarrantyNote] = useState("Garantía de 12 meses contra defectos de fábrica. No cubre daños por mal uso or variaciones de voltaje.")
    const [warrantyComments, setWarrantyComments] = useState("")
    const [items, setItems] = useState<QuoteItem[]>([
        { id: "1", productId: "", description: "", quantity: 1, unitPrice: 0 }
    ])
    const [discountPercent, setDiscountPercent] = useState(0)
    const [productImage, setProductImage] = useState<string | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [showProductList, setShowProductList] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const taxRate = 0.15 // 15% IVA

    useEffect(() => {
        fetchNextNumber()
        fetchProducts()
    }, [])

    const fetchNextNumber = async () => {
        const res = await fetch("/api/quotes/next-number")
        const data = await res.json()
        setQuoteNumber(data.quoteNumber)
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
                setProductImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleGeneratePDF = () => {
        if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
            alert("⚠️ Error: El Nombre, Email y Teléfono del cliente son OBLIGATORIOS.")
            return
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
        doc.text("ASESOR COMERCIAL:", rightColumnX, 65)
        doc.setFontSize(10)
        doc.text(advisorName || "ASIGNADO", rightColumnX, 72)
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

        // --- Image Section (Separated/Spaced) ---
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
            doc.addImage(productImage, 'JPEG', 14, finalY + 5, 80, 55)
            finalY += 65
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

    return (
        <div className="space-y-12 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Cotizador <span className="text-orange-600">Enterprise</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">Generación automática de propuestas PROP-MM-NNN con integración de inventario.</p>
                </div>
                <button
                    onClick={handleGeneratePDF}
                    className="bg-neutral-900 text-white px-10 py-5 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center space-x-3 hover:bg-orange-600 transition-all shadow-2xl shadow-neutral-200"
                >
                    <FileOutput size={18} />
                    <span>Emitir Propuesta Final</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Panel: Configuration */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Client Data Card */}
                    <div className="bg-white border border-neutral-200 p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>
                        <div className="flex items-center space-x-3 mb-10 border-b border-neutral-50 pb-6">
                            <User size={22} className="text-neutral-900" />
                            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-tight">Identificación de Cliente</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Nombre Completo o Razón Social</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="EJ: CORPORACIÓN INDUSTRIAL SUR"
                                    className="w-full px-5 py-4 border border-neutral-100 bg-neutral-50 text-sm font-bold uppercase focus:border-orange-600 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Canal de Contacto (Email)</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                                    <input
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="CORREO@CORPORATIVO.COM"
                                        className="w-full pl-14 pr-5 py-4 border border-neutral-100 bg-neutral-50 text-sm font-bold uppercase focus:border-orange-600 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Terminal Telefónica / WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                                    <input
                                        type="text"
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="09XXXXXXXX"
                                        className="w-full pl-14 pr-5 py-4 border border-neutral-100 bg-neutral-50 text-sm font-bold uppercase focus:border-orange-600 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Dirección de Entrega / Logística</label>
                                <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="CALLE PRIMARIA, SECUNDARIA Y NRO..."
                                        className="w-full pl-14 pr-5 py-4 border border-neutral-100 bg-neutral-50 text-sm font-bold uppercase focus:border-orange-600 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table Card */}
                    <div className="bg-white border border-neutral-200 p-10 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center mb-10 border-b border-neutral-50 pb-6">
                            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-tight">Partidas Presupuestarias</h2>
                            <button
                                onClick={handleAddItem}
                                className="text-[10px] font-bold text-orange-600 bg-orange-50 px-5 py-3 hover:bg-orange-600 hover:text-white transition-all uppercase tracking-widest border border-orange-100"
                            >
                                <Plus size={16} className="mr-1 inline" /> Añadir Partida
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="hidden md:grid grid-cols-12 gap-5 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
                                <div className="col-span-2">SKU / COD</div>
                                <div className="col-span-4">Descripción del Item</div>
                                <div className="col-span-1 text-center">Cant.</div>
                                <div className="col-span-2 text-right">P. Unitario</div>
                                <div className="col-span-2 text-right">Monto Total</div>
                                <div className="col-span-1"></div>
                            </div>

                            {items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-neutral-50/50 p-6 border border-neutral-100 hover:bg-white hover:border-orange-200 transition-all group relative">
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(item.id, "productId", e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-neutral-100 text-[11px] font-bold focus:border-orange-600 outline-none uppercase"
                                        />
                                    </div>
                                    <div className="col-span-4 relative">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onFocus={() => setShowProductList(item.id)}
                                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                                            placeholder="BUSCAR PRODUCTO..."
                                            className="w-full px-4 py-3 bg-white border border-neutral-100 text-xs font-bold focus:border-orange-600 outline-none uppercase"
                                        />
                                        {/* Autocomplete Dropdown */}
                                        {showProductList === item.id && (
                                            <div className="absolute top-full left-0 w-full bg-white border border-neutral-200 shadow-2xl z-50 mt-1 max-h-60 overflow-y-auto anima-in fade-in duration-300">
                                                {products
                                                    .filter(p => p.name.toLowerCase().includes(item.description.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(item.description.toLowerCase())))
                                                    .map(p => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => selectProduct(item.id, p)}
                                                            className="w-full text-left px-5 py-4 border-b border-neutral-50 hover:bg-orange-50 transition-colors"
                                                        >
                                                            <p className="text-xs font-bold text-neutral-900 uppercase">{p.name}</p>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">{p.sku}</span>
                                                                <span className="text-[10px] font-bold text-neutral-400">${p.price.toFixed(2)}</span>
                                                            </div>
                                                        </button>
                                                    ))
                                                }
                                                <button
                                                    onClick={() => setShowProductList(null)}
                                                    className="w-full py-3 bg-neutral-900 text-white text-[9px] font-bold uppercase tracking-widest"
                                                >
                                                    Cerrar Lista
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)}
                                            className="w-full py-3 bg-white border border-neutral-100 text-xs text-center font-bold focus:border-orange-600 outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                            className="w-full py-3 px-4 bg-white border border-neutral-100 text-xs text-right font-bold focus:border-orange-600 outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-sm font-bold text-neutral-900 tracking-tight">
                                            ${(item.quantity * item.unitPrice).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="invisible group-hover:visible text-neutral-300 hover:text-red-600 transition-all p-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white border border-neutral-200 p-10 shadow-sm relative">
                            <h2 className="text-lg font-bold text-neutral-900 mb-6 uppercase tracking-tight flex items-center">
                                <ShieldCheck size={20} className="mr-3 text-neutral-900" /> Documento de Garantía
                            </h2>
                            <textarea
                                value={warrantyNote}
                                onChange={(e) => setWarrantyNote(e.target.value)}
                                rows={4}
                                className="w-full p-5 bg-neutral-50 border border-neutral-100 text-xs font-bold uppercase focus:border-orange-600 outline-none resize-none leading-relaxed text-neutral-500"
                            />
                        </div>
                        <div className="bg-white border border-neutral-200 p-10 shadow-sm">
                            <h2 className="text-lg font-bold text-neutral-900 mb-6 uppercase tracking-tight flex items-center">
                                <MessageSquare size={20} className="mr-3 text-neutral-900" /> Comentarios Garantía
                            </h2>
                            <textarea
                                value={warrantyComments}
                                onChange={(e) => setWarrantyComments(e.target.value)}
                                placeholder="NOTAS ADICIONALES SOBRE LA GARANTÍA..."
                                rows={4}
                                className="w-full p-5 bg-neutral-50 border border-neutral-100 text-xs font-bold uppercase focus:border-orange-600 outline-none resize-none leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel: Totalization */}
                <div className="lg:col-span-1">
                    <div className="bg-neutral-950 text-white p-12 shadow-2xl sticky top-10 flex flex-col items-center text-center">
                        <div className="w-20 h-2 bg-orange-600 mb-10"></div>
                        <h2 className="text-2xl font-bold mb-10 flex flex-col items-center uppercase tracking-[0.3em] text-orange-500">
                            <Calculator size={32} className="mb-4" /> Resumen Fiscal
                        </h2>

                        <div className="w-full space-y-8 text-sm font-bold">
                            <div className="flex justify-between items-center text-neutral-500 border-b border-neutral-900 pb-4">
                                <span className="uppercase tracking-widest text-[10px]">Subtotal Bruto</span>
                                <span className="text-white text-xl">${subtotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex items-center justify-between py-6">
                                <span className="text-neutral-500 uppercase text-[10px] tracking-widest text-left">Ajuste de Margen /<br />Descuento (%)</span>
                                <input
                                    type="number"
                                    value={discountPercent}
                                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                    className="w-24 px-4 py-4 bg-neutral-900 border border-neutral-800 text-right focus:border-orange-600 outline-none text-orange-500 font-bold"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-neutral-900">
                                {discountPercent > 0 && (
                                    <div className="flex justify-between items-center text-orange-600">
                                        <span className="text-[10px] tracking-widest uppercase">Bonificación</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-neutral-400">
                                    <span className="text-[10px] tracking-widest uppercase">Base Imponible</span>
                                    <span>${taxableAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-neutral-500">
                                    <span className="text-[10px] tracking-widest uppercase">IVA Transferido (15%)</span>
                                    <span>${taxAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="pt-12">
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] font-bold text-orange-600 uppercase tracking-[0.4em] mb-4">Total Liquidación</span>
                                    <span className="text-5xl font-bold text-white tracking-tighter">${total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="mt-12 text-left bg-neutral-900/50 p-6 border border-neutral-800">
                                <p className="text-[9px] text-neutral-600 uppercase tracking-widest leading-loose font-bold">
                                    * Numero de Documento: {quoteNumber}<br />
                                    * Vigencia Industrial Standard: 8 Días<br />
                                    * Sujeto a disponibilidad de inventario
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white border border-neutral-200 p-10 shadow-sm">
                        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                            <ImageIcon size={16} className="mr-2" /> Portafolio de Producto
                        </h3>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 border-2 border-dashed border-neutral-100 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/10 transition-all overflow-hidden"
                        >
                            {productImage ? (
                                <img src={productImage} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <Plus size={32} className="text-neutral-200 mb-3" />
                                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.3em]">Cargar Documentación Visual</span>
                                </>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        {productImage && (
                            <button onClick={() => setProductImage(null)} className="mt-4 w-full text-center text-red-600 text-[9px] font-bold uppercase tracking-widest hover:underline">Eliminar Imagen de Propuesta</button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}






