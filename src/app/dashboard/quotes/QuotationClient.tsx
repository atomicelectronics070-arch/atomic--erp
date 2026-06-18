"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Trash2, FileOutput, Calculator, Image as ImageIcon, 
    User, ShieldCheck, Mail, Phone, MapPin, 
    MessageSquare, History, X, ChevronRight,
    Briefcase, Save, Clock, Search, CheckCircle2,
    FileText, Zap, Building2, Tag, Percent, ShoppingCart, Wand2, Upload, AlertTriangle, Download
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
    discountPercent?: number
    customImage?: string
}

interface Product {
    id: string
    name: string
    description: string | null
    price: number
    sku: string | null
    images?: string | null
    stock?: number
}

interface QuotationClientProps {
    initialProducts: Product[]
    initialHistory: any[]
    initialClients: any[]
    nextNumber: string
    session: any
}

export default function QuotationClient({ initialProducts, initialHistory, initialClients, nextNumber, session }: QuotationClientProps) {
    const [clientName, setClientName] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [emailNotSpecified, setEmailNotSpecified] = useState(false)
    const [clientPhone, setClientPhone] = useState("")
    const [clientCity, setClientCity] = useState("")
    const [showClientList, setShowClientList] = useState(false)
    const [isSavingClient, setIsSavingClient] = useState(false)
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

    // Quick Generator States
    const [quickText, setQuickText] = useState("")
    const [quickImage, setQuickImage] = useState<string | null>(null)
    const [quickWarning, setQuickWarning] = useState<string | null>(null)
    const [isExtracting, setIsExtracting] = useState(false)
    const [quickSuccess, setQuickSuccess] = useState(false)
    const quickInputRef = useRef<HTMLInputElement>(null)

    const taxRate = 0.15 
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
    const itemDiscountAmount = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * ((item.discountPercent || 0) / 100)), 0)
    const globalDiscountAmount = (subtotal - itemDiscountAmount) * (discountPercent / 100)
    const totalDiscountAmount = itemDiscountAmount + globalDiscountAmount
    const taxableAmount = subtotal - totalDiscountAmount
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
            unitPrice: product.price,
            customImage: product.images ? safeParseArray(product.images)[0] : undefined
        } : item))
        setShowProductList(null)
    }

    const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setItems(items.map(item => item.id === id ? { ...item, customImage: reader.result as string } : item))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleFillTest = () => {
        setClientName("Empresa de Prueba S.A.")
        setClientCity("Quito, Ecuador")
        setClientPhone("0991234567")
        setEmailNotSpecified(true)
        setQuoteSubject("Suministro de Equipos de Prueba para Proyecto Alpha")
        setDiscountPercent(0)
        setItems([
            { id: "1", productId: "SKU-001", description: "Cámara Domo IP 4MP Avanzada", quantity: 5, unitPrice: 120.50, discountPercent: 5 },
            { id: "2", productId: "SKU-002", description: "Grabador NVR 16 Canales 4K", quantity: 1, unitPrice: 350.00, discountPercent: 0 },
            { id: "3", productId: "SRV-001", description: "Instalación y Configuración del Sistema", quantity: 1, unitPrice: 150.00, discountPercent: 10 }
        ])
    }

    const handleSaveClient = async () => {
        if (!clientName.trim() || !clientPhone.trim() || !clientCity.trim()) {
            alert("⚠️ Por favor completa Nombre, Ciudad y Teléfono para guardar al cliente.");
            return;
        }
        setIsSavingClient(true);
        try {
            const res = await fetch("/api/crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: clientName,
                    city: clientCity,
                    phone: clientPhone,
                    email: emailNotSpecified ? "no@especifica.com" : clientEmail,
                    status: "PROSPECTO",
                    source: "MANUAL"
                })
            });
            if (res.ok) {
                alert("✅ Cliente guardado correctamente en la base de datos.");
            } else {
                alert("❌ Error al guardar el cliente.");
            }
        } catch (e) {
            alert("❌ Error de red al intentar guardar el cliente.");
        } finally {
            setIsSavingClient(false);
        }
    }

    const handleQuickImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setQuickImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleQuickGenerate = async () => {
        if (!quickText.trim()) return;
        setIsExtracting(true)
        setQuickWarning(null)
        setQuickSuccess(false)
        try {
            const res = await fetch("/api/quotes/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: quickText })
            })
            const json = await res.json()
            if (json.success && json.data) {
                const data = json.data
                if (data.clientName) setClientName(data.clientName)
                if (data.clientCity) setClientCity(data.clientCity)
                if (data.clientPhone) setClientPhone(data.clientPhone)
                if (data.quoteSubject) setQuoteSubject(data.quoteSubject)
                
                if (data.items && data.items.length > 0) {
                    const newItems = data.items.map((i: any, index: number) => ({
                        id: `quick-${Date.now()}-${index}`,
                        productId: `GEN-${Math.floor(Math.random() * 1000)}`,
                        description: i.description || "Producto Genérico",
                        quantity: i.quantity || 1,
                        unitPrice: i.unitPrice || 0,
                        customImage: index === 0 && quickImage ? quickImage : undefined
                    }))
                    setItems(newItems)
                }
                
                if (data.missingInfo) {
                    setQuickWarning(data.missingInfo)
                } else {
                    setQuickSuccess(true)
                }
            } else {
                setQuickWarning("Error extrayendo datos. Intenta de nuevo.")
            }
        } catch (e) {
            setQuickWarning("Error de red al conectar con Jarvis.")
        } finally {
            setIsExtracting(false)
        }
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
        const primaryColor = [15, 23, 42] // Slate-900
        const accentColor = [79, 70, 229] // Indigo-600
        
        // Logo / Company Name
        doc.setFont("helvetica", "bold")
        doc.setFontSize(26)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text("ATOMIC", 14, 25)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(14)
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
        doc.text("INDUSTRIES", 57, 25)
        
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        doc.text("Soluciones Tecnológicas e Industriales de Alto Rendimiento", 14, 32)
        doc.text("División Corporativa | Quito, Ecuador", 14, 37)
        
        // Quote Info Right Side
        doc.setFontSize(22)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text("COTIZACIÓN", 195, 25, { align: "right" })
        
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100, 100, 100)
        doc.text(`Doc No.: ${quoteNumber}`, 195, 32, { align: "right" })
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 195, 37, { align: "right" })
        
        doc.setDrawColor(220, 220, 220)
        doc.line(14, 42, 196, 42) // Separator line
        
        // Client Info
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text("PREPARADO PARA:", 14, 52)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(50, 50, 50)
        doc.text(clientName.toUpperCase(), 14, 58)
        doc.text(`Ciudad: ${clientCity}`, 14, 63)
        doc.text(`Tel: ${clientPhone}`, 14, 68)
        doc.text(`Email: ${emailNotSpecified ? "No especificado" : clientEmail}`, 14, 73)
        
        // Project Info
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text("DETALLES DEL PROYECTO:", 106, 52)
        
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(50, 50, 50)
        const splitSubject = doc.splitTextToSize(quoteSubject.toUpperCase(), 85)
        doc.text(splitSubject, 106, 58)
        doc.text(`Asesor Comercial: ${advisorName}`, 106, 68 + ((splitSubject.length - 1) * 4))
        
        // Table
        autoTable(doc, {
            startY: 85,
            head: [["IMG", "CÓDIGO", "DESCRIPCIÓN", "CANT", "PRECIO", "SUBTOT", "DESC", "TOTAL"]],
            body: items.map(i => {
                const sub = i.quantity * i.unitPrice;
                const desc = sub * ((i.discountPercent || 0) / 100);
                const tot = sub - desc;
                return [
                    '', // Placeholder for image
                    i.productId, 
                    i.description, 
                    i.quantity, 
                    `$${i.unitPrice.toFixed(2)}`, 
                    `$${sub.toFixed(2)}`,
                    `-$${desc.toFixed(2)}`,
                    `$${tot.toFixed(2)}`
                ]
            }),
            theme: 'plain',
            headStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: 'bold', fontSize: 8, lineWidth: 0.1, lineColor: [226, 232, 240] },
            bodyStyles: { fontSize: 8, textColor: 50, minCellHeight: 14, lineWidth: 0.1, lineColor: [226, 232, 240] },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center' },
                1: { cellWidth: 20 },
                2: { cellWidth: 60 },
                3: { cellWidth: 10, halign: 'center' },
                4: { cellWidth: 20, halign: 'right' },
                5: { cellWidth: 20, halign: 'right' },
                6: { cellWidth: 18, halign: 'right', textColor: [220, 38, 38] },
                7: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }
            },
            didDrawCell: function(data) {
                if (data.column.index === 0 && data.cell.section === 'body') {
                    const item = items[data.row.index];
                    let imgToDraw = item.customImage;
                    
                    if (!imgToDraw) {
                        const product = findProduct(item.productId, item.description);
                        if (product?.images && product.images !== 'null') {
                            const parsed = safeParseArray(product.images);
                            if (parsed.length > 0) imgToDraw = parsed[0];
                        }
                    }

                    if (imgToDraw) {
                        try {
                            doc.addImage(imgToDraw, data.cell.x + 1, data.cell.y + 2, 10, 10);
                        } catch(e) {}
                    }
                }
            }
        });
        
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        
        // Totals Block
        doc.setFillColor(248, 250, 252)
        doc.rect(130, finalY, 66, 35, 'F')
        doc.setDrawColor(226, 232, 240)
        doc.rect(130, finalY, 66, 35, 'S')
        
        doc.setFontSize(10)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.setFont("helvetica", "bold")
        doc.text("Subtotal:", 135, finalY + 8)
        doc.setFont("helvetica", "normal")
        doc.text(`$${subtotal.toFixed(2)}`, 190, finalY + 8, { align: "right" })
        
        doc.setFont("helvetica", "bold")
        doc.text("IVA (15%):", 135, finalY + 16)
        doc.setFont("helvetica", "normal")
        doc.text(`$${taxAmount.toFixed(2)}`, 190, finalY + 16, { align: "right" })
        
        if (totalDiscountAmount > 0) {
            doc.setFont("helvetica", "bold")
            doc.setTextColor(220, 38, 38)
            doc.text(`Descuento:`, 135, finalY + 24)
            doc.setFont("helvetica", "normal")
            doc.text(`-$${totalDiscountAmount.toFixed(2)}`, 190, finalY + 24, { align: "right" })
            
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
        doc.text("Forma de pago: Según acuerdo comercial vigente. Los productos están sujetos a disponibilidad de stock.", 14, 285)

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

    const handleGenerateTicket = async () => {
        if (!clientName.trim() || !quoteSubject.trim()) {
            alert("⚠️ CAMPOS OBLIGATORIOS: Nombre y Tema de la Cotización.");
            return
        }

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [80, 297]
        });

        const primaryColor = [15, 23, 42]; // Slate-900

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("ATOMIC INDUSTRIES", 40, 10, { align: "center" });

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Soluciones Tecnológicas e Industriales", 40, 14, { align: "center" });
        doc.text("Quito, Ecuador", 40, 18, { align: "center" });
        
        doc.setFont("helvetica", "bold");
        doc.text("------------------------------------------------------------------", 40, 22, { align: "center" });
        
        doc.text(`TICKET DE ENTREGA`, 40, 26, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.text(`Doc No.: ${quoteNumber}`, 40, 30, { align: "center" });
        doc.text(`Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 40, 34, { align: "center" });
        
        doc.setFont("helvetica", "bold");
        doc.text("------------------------------------------------------------------", 40, 38, { align: "center" });
        
        // Client Info
        doc.text("CLIENTE:", 5, 43);
        doc.setFont("helvetica", "normal");
        const clientNameLines = doc.splitTextToSize(clientName.toUpperCase(), 70);
        doc.text(clientNameLines, 5, 47);
        let currY = 47 + (clientNameLines.length * 4);
        doc.text(`Telf: ${clientPhone || 'N/A'}`, 5, currY);
        
        currY += 4;
        doc.setFont("helvetica", "bold");
        doc.text("------------------------------------------------------------------", 40, currY, { align: "center" });
        currY += 5;
        
        // Items Header
        doc.setFontSize(7);
        doc.text("CANT DESCRIPCION           P.UNIT   TOTAL", 5, currY);
        currY += 4;
        doc.text("---------------------------------------------------------------------------", 40, currY, { align: "center" });
        currY += 4;
        
        // Items
        doc.setFont("helvetica", "normal");
        items.forEach(item => {
            const itemSub = item.quantity * item.unitPrice;
            const itemDesc = itemSub * ((item.discountPercent || 0) / 100);
            const itemTotal = itemSub - itemDesc;

            doc.text(item.quantity.toString(), 5, currY);
            
            const descLines = doc.splitTextToSize(item.description, 35);
            doc.text(descLines, 15, currY);
            
            doc.text(`$${item.unitPrice.toFixed(2)}`, 55, currY);
            doc.text(`$${itemTotal.toFixed(2)}`, 75, currY, { align: "right" });
            
            currY += (descLines.length * 3) + 1;
            
            if (itemDesc > 0) {
                doc.text(`  Desc: -$${itemDesc.toFixed(2)}`, 15, currY);
                currY += 3;
            }
        });
        
        doc.setFont("helvetica", "bold");
        currY += 1;
        doc.text("------------------------------------------------------------------", 40, currY, { align: "center" });
        currY += 5;
        
        // Totals
        doc.setFontSize(8);
        doc.text("SUBTOTAL:", 35, currY);
        doc.setFont("helvetica", "normal");
        doc.text(`$${subtotal.toFixed(2)}`, 75, currY, { align: "right" });
        currY += 4;

        doc.setFont("helvetica", "bold");
        doc.text("IVA (15%):", 35, currY);
        doc.setFont("helvetica", "normal");
        doc.text(`$${taxAmount.toFixed(2)}`, 75, currY, { align: "right" });
        currY += 4;
        
        if (totalDiscountAmount > 0) {
            doc.setFont("helvetica", "bold");
            doc.text("DESCUENTO:", 35, currY);
            doc.setFont("helvetica", "normal");
            doc.text(`-$${totalDiscountAmount.toFixed(2)}`, 75, currY, { align: "right" });
            currY += 4;
        }

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL USD:", 35, currY);
        doc.text(`$${total.toFixed(2)}`, 75, currY, { align: "right" });
        currY += 8;
        
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("Gracias por su confianza.", 40, currY, { align: "center" });
        currY += 4;
        doc.text("Este documento es una representacion", 40, currY, { align: "center" });
        currY += 3;
        doc.text("impresa de un comprobante de entrega.", 40, currY, { align: "center" });

        doc.save(`TICKET_${quoteNumber}_${clientName.replace(/\s+/g, "_")}.pdf`)
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
                        onClick={handleFillTest}
                        className="px-4 py-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 font-bold text-sm rounded-lg transition-all flex items-center gap-2 shadow-sm"
                        title="Rellenar cotización genérica de prueba"
                    >
                        <Zap size={16}/> Prueba
                    </button>
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
                        <FileOutput size={16} /> PDF A4
                    </button>
                    <button 
                        onClick={handleGenerateTicket}
                        className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-sm rounded-lg transition-all flex items-center gap-2 shadow-[0_4px_14px_0_rgb(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)]"
                    >
                        <FileOutput size={16} /> TICKET
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
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                                <Building2 className="text-indigo-600" size={16} /> Datos del Cliente
                            </h2>
                            <button 
                                onClick={handleSaveClient} 
                                disabled={isSavingClient}
                                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                                title="Guardar como nuevo cliente en la base de datos"
                            >
                                {isSavingClient ? <span className="animate-pulse">Guardando...</span> : <><Plus size={14} /> Guardar Cliente</>}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Razón Social / Nombre</label>
                                <input 
                                    value={clientName} 
                                    onChange={e => {
                                        setClientName(e.target.value)
                                        setShowClientList(true)
                                    }} 
                                    onFocus={() => setShowClientList(true)}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-[#0F172A] uppercase rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                                    placeholder="Buscar cliente existente..."
                                />
                                {showClientList && clientName && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-lg z-50 max-h-48 overflow-y-auto mt-1">
                                        <div className="flex justify-between items-center p-2 border-b border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultados ({initialClients.filter((c: any) => c.name.toLowerCase().includes(clientName.toLowerCase())).length})</span>
                                            <button onClick={() => setShowClientList(false)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
                                        </div>
                                        {initialClients.filter((c: any) => c.name.toLowerCase().includes(clientName.toLowerCase())).map((c: any) => (
                                            <button 
                                                key={c.id} 
                                                onClick={() => {
                                                    setClientName(c.name)
                                                    setClientCity(c.city || "")
                                                    setClientPhone(c.phone || "")
                                                    if (c.email) {
                                                        setClientEmail(c.email)
                                                        setEmailNotSpecified(false)
                                                    } else {
                                                        setClientEmail("")
                                                        setEmailNotSpecified(true)
                                                    }
                                                    setShowClientList(false)
                                                }} 
                                                className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between group"
                                            >
                                                <div>
                                                    <p className="text-xs font-black text-[#0F172A] uppercase">{c.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{c.city || "Sin ciudad"} • {c.phone || "Sin tel"}</p>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
                                            </button>
                                        ))}
                                    </div>
                                )}
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
                        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-t-lg text-[9px] font-black text-slate-500 uppercase tracking-wider">
                            <div className="col-span-1 text-center">Img</div>
                            <div className="col-span-1">Código</div>
                            <div className="col-span-3">Descripción del Producto</div>
                            <div className="col-span-1 text-center">Stock</div>
                            <div className="col-span-1 text-center">Cant.</div>
                            <div className="col-span-1 text-right">Precio</div>
                            <div className="col-span-1 text-right">Subtotal</div>
                            <div className="col-span-1 text-center">Desc %</div>
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
                                        className="grid grid-cols-12 gap-2 items-center bg-white p-2 border border-slate-200 rounded-lg group hover:border-indigo-300 transition-all relative"
                                    >
                                        <div className="col-span-1">
                                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center relative overflow-hidden group-hover:border-indigo-200 transition-all mx-auto cursor-pointer">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                    title="Añadir/Cambiar imagen"
                                                    onChange={(e) => handleImageUpload(item.id, e)}
                                                />
                                                {(() => {
                                                    if (item.customImage) {
                                                        return <img src={item.customImage} className="w-full h-full object-contain" alt="preview" />;
                                                    }
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
                                        <div className="col-span-3 relative">
                                            <input 
                                                value={item.description} 
                                                onFocus={() => setShowProductList(item.id)}
                                                onChange={e => handleItemChange(item.id, "description", e.target.value)} 
                                                className="w-full bg-slate-50 border border-slate-200 p-2 text-[#0F172A] text-[10px] font-bold rounded-md outline-none focus:border-indigo-500 transition-all" 
                                                placeholder="Buscar producto..."
                                            />
                                            {showProductList === item.id && (
                                                <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-lg z-50 max-h-48 overflow-y-auto min-w-[250px]">
                                                    {initialProducts.filter((p: Product) => p.name.toLowerCase().includes(item.description.toLowerCase())).map((p: Product) => (
                                                        <button key={p.id} onClick={() => selectProduct(item.id, p)} className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-slate-100 rounded flex-shrink-0 overflow-hidden">
                                                                {p.images && safeParseArray(p.images).length > 0 && <img src={safeParseArray(p.images)[0]} className="w-full h-full object-contain" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-[#0F172A] uppercase">{p.name}</p>
                                                                <p className="text-[10px] text-indigo-600 font-bold mt-0.5">${p.price} • Stock: {p.stock || 0}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                {findProduct(item.productId, item.description)?.stock || 0}
                                            </span>
                                        </div>
                                        <div className="col-span-1">
                                            <input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 p-2 text-center text-[#0F172A] rounded-md font-bold text-[10px] outline-none focus:border-indigo-500" />
                                        </div>
                                        <div className="col-span-1 relative">
                                            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">$</span>
                                            <input type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 p-2 pl-4 text-right text-[#0F172A] rounded-md font-bold text-[10px] outline-none focus:border-indigo-500" />
                                        </div>
                                        <div className="col-span-1 text-right pr-1">
                                            <span className="text-[10px] font-black text-slate-500">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                                        </div>
                                        <div className="col-span-1">
                                            <input type="number" value={item.discountPercent || 0} onChange={e => handleItemChange(item.id, "discountPercent", parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 p-2 text-center text-[#0F172A] rounded-md font-bold text-[10px] outline-none focus:border-indigo-500" title="Descuento (%)" />
                                        </div>
                                        <div className="col-span-1 text-right pr-2">
                                            <span className="text-[10px] font-black text-indigo-600">${((item.quantity * item.unitPrice) * (1 - ((item.discountPercent || 0)/100))).toFixed(2)}</span>
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
                    
                    {/* Generador Rápido */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-indigo-700">
                            <Wand2 size={18} />
                            <h2 className="text-sm font-black uppercase tracking-wider">Generador Rápido (IA)</h2>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 mb-4 leading-relaxed">
                            Pega el texto desordenado de WhatsApp o notas. La IA extraerá cliente, productos y valores automáticamente.
                        </p>
                        <textarea 
                            value={quickText}
                            onChange={(e) => setQuickText(e.target.value)}
                            placeholder="Ej: cotizame a juan perez 2 camaras a 15 y un dvr a 40 para quito su tel es 0999"
                            className="w-full bg-white border border-indigo-200 rounded-lg p-3 text-xs font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 min-h-[100px] resize-none mb-4"
                        />
                        
                        {quickWarning && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-700">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold leading-tight">{quickWarning}</p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button 
                                onClick={() => quickInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-1 bg-white border border-indigo-200 text-indigo-600 font-bold text-[10px] py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                <Upload size={12} /> {quickImage ? "Imagen Lista" : "Subir 1 Imagen"}
                            </button>
                            <input type="file" accept="image/*" hidden ref={quickInputRef} onChange={handleQuickImageUpload} />
                            
                            <button 
                                onClick={handleQuickGenerate}
                                disabled={isExtracting || !quickText.trim()}
                                className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 text-white font-bold text-[10px] py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
                            >
                                {isExtracting ? "Analizando..." : "Auto-Completar"}
                            </button>
                        </div>

                        {quickSuccess && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                                <button 
                                    onClick={handleGeneratePDF}
                                    className="w-full flex items-center justify-center gap-2 bg-[#0F172A] text-white font-bold text-[11px] py-3 rounded-lg hover:bg-slate-800 transition-all shadow-md"
                                >
                                    <Download size={14} /> DESCARGAR COTIZACIÓN
                                </button>
                            </motion.div>
                        )}
                    </div>

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
                            {totalDiscountAmount > 0 && (
                                <div className="flex justify-between items-center text-sm font-bold text-red-500">
                                    <span>Valor Descontado</span>
                                    <span>-${totalDiscountAmount.toFixed(2)}</span>
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
