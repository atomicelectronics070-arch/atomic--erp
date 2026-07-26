"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    FileText, FileSignature, Receipt, Download, MapPin, 
    CreditCard, User, CheckCircle2,
    Upload, Sparkles
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function DocumentGenerator() {
    const { data: session } = useSession()
    const [docType, setDocType] = useState<"warranty" | "receipt" | "purchase_order">("receipt")
    const [clientName, setClientName] = useState("")
    const [concept, setConcept] = useState("")
    const [amount, setAmount] = useState("")
    const [warrantyMonths, setWarrantyMonths] = useState("12")
    const [warrantyComments, setWarrantyComments] = useState("")
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("TRANSFERENCIA")
    const [reference, setReference] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [clientCedula, setClientCedula] = useState("")
    const [city, setCity] = useState("")
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
    const [estimatedArrival, setEstimatedArrival] = useState("")
    const [advisorName, setAdvisorName] = useState("ASIGNADO")
    const [productImage, setProductImage] = useState<string | null>(null)
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

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

    useEffect(() => {
        if (session?.user?.name) {
            setAdvisorName(session.user.name)
        }
    }, [session])

    const handleGeneratePDF = () => {
        if (!clientName.trim() || !concept.trim()) {
            alert("⚠️ Por favor completa los campos de Cliente y Concepto")
            return
        }

        const doc = new jsPDF()
        const title = docType === 'receipt' ? 'RECIBO DE CAJA / VENTA' : docType === 'warranty' ? 'DOCUMENTO DE GARANTÍA' : 'SOLICITUD DE COMPRA'

        // Header
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 50, 'F');
        doc.setFontSize(20);
        doc.setTextColor(30, 58, 138);
        doc.setFont("helvetica", "bold");
        doc.text("ATOMIC INDUSTRIES", 14, 25);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(title, 14, 35);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);
        doc.text(`Nro. Referencia: ${Math.floor(100000 + Math.random() * 900000)}`, 14, 44);

        doc.setDrawColor(226, 232, 240);
        doc.line(14, 50, 196, 50);

        // Body
        doc.setFontSize(10)
        doc.setTextColor(15, 23, 42)
        doc.setFont("helvetica", "bold")
        doc.text("INFORMACIÓN DEL CLIENTE:", 14, 60)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.text(clientName, 14, 66)

        const tableBody = [
            ["Concepto", concept],
            ["Fecha de Registro", new Date().toLocaleDateString()]
        ]

        if (docType === 'receipt') {
            tableBody.push(["Monto Total", `$${parseFloat(amount || '0').toLocaleString('es-EC', { minimumFractionDigits: 2 })}`])
            tableBody.push(["Método de Pago", paymentMethod])
            tableBody.push(["Referencia", reference || "N/A"])
        } else if (docType === 'warranty') {
            tableBody.push(["Periodo de Cobertura", `${warrantyMonths} MESES`])
            if (warrantyComments) {
                tableBody.push(["Detalles Técnicos", warrantyComments])
            }
        } else if (docType === 'purchase_order') {
            tableBody.push(["Cédula / RUC", clientCedula || "N/A"])
            tableBody.push(["Ciudad", city || "N/A"])
            tableBody.push(["Teléfono", clientPhone || "N/A"])
            tableBody.push(["Dirección", deliveryAddress || "POR DEFINIR"])
            tableBody.push(["Valor", `$${parseFloat(amount || '0').toLocaleString('es-EC', { minimumFractionDigits: 2 })}`])
            tableBody.push(["Forma de Pago", paymentMethod])
            tableBody.push(["Fecha Pedido", orderDate])
            tableBody.push(["Estimado Llegada", estimatedArrival || "POR CONFIRMAR"])
        }

        autoTable(doc, {
            startY: 75,
            head: [["Campo", "Detalle"]],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 5, textColor: [51, 65, 85] },
            columnStyles: {
                0: { cellWidth: 50, fontStyle: 'bold' },
                1: { cellWidth: 130 }
            }
        })

        // Footer
        // @ts-ignore
        let finalY = doc.lastAutoTable.finalY + 20

        if (docType === 'warranty') {
            doc.setFontSize(8)
            doc.setTextColor(100)
            const terms = "Esta garantía cubre defectos de fabricación bajo condiciones normales de operación. No aplica para daños por factores externos o manipulación por personal no autorizado por ATOMIC INDUSTRIES."
            const splitTerms = doc.splitTextToSize(terms, 180)
            doc.text(splitTerms, 14, finalY)
            finalY += 15
        }

        if (docType === "purchase_order" && productImage && imageDimensions.width > 0) {
            finalY += 10
            doc.setFontSize(9)
            doc.setFont("helvetica", "bold")
            doc.text("IMAGEN REFERENCIAL", 14, finalY)
            finalY += 5
            
            const targetWidth = 80
            const ratio = imageDimensions.height / imageDimensions.width
            const targetHeight = targetWidth * ratio
            
            doc.addImage(productImage, "JPEG", 14, finalY, targetWidth, targetHeight)
            finalY += targetHeight + 15
        }

        doc.setFontSize(9)
        doc.setTextColor(0)
        doc.setFont("helvetica", "bold")
        doc.line(14, finalY + 30, 80, finalY + 30)
        doc.text("Firma Autorizada", 14, finalY + 35)
        doc.setFont("helvetica", "normal")
        doc.text(advisorName, 14, finalY + 40)

        doc.save(`${title.replace(/\s+/g, '_')}_${clientName.replace(/\s+/g, '_')}.pdf`)
    }

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans text-white bg-[#050505] p-6 lg:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Sparkles size={12} />
                        <span>Generación PDF Alta Definición</span>
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <FileSignature className="text-cyan-400" /> Generador de Documentos Oficiales
                    </h1>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                        Emisión oficial de recibos de caja, certificados de garantía y solicitudes de compra.
                    </p>
                </div>
            </div>

            {/* Document Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => setDocType("receipt")}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center shadow-xl ${docType === "receipt" ? "bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/30" : "bg-slate-900/90 border-slate-800 hover:border-cyan-500/50"}`}
                >
                    <div className={`p-4 rounded-2xl mb-4 transition-colors ${docType === "receipt" ? "bg-cyan-400/20 text-cyan-300" : "bg-slate-950 text-slate-400"}`}>
                        <Receipt size={28} />
                    </div>
                    <h3 className="font-bold text-white text-base">Recibo de Venta</h3>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Liquidación y Comprobantes</p>
                </button>

                <button
                    onClick={() => setDocType("warranty")}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center shadow-xl ${docType === "warranty" ? "bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/30" : "bg-slate-900/90 border-slate-800 hover:border-emerald-500/50"}`}
                >
                    <div className={`p-4 rounded-2xl mb-4 transition-colors ${docType === "warranty" ? "bg-emerald-400/20 text-emerald-300" : "bg-slate-950 text-slate-400"}`}>
                        <CheckCircle2 size={28} />
                    </div>
                    <h3 className="font-bold text-white text-base">Doc. de Garantía</h3>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Certificados de Cobertura</p>
                </button>

                <button
                    onClick={() => setDocType("purchase_order")}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center shadow-xl ${docType === "purchase_order" ? "bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/30" : "bg-slate-900/90 border-slate-800 hover:border-indigo-500/50"}`}
                >
                    <div className={`p-4 rounded-2xl mb-4 transition-colors ${docType === "purchase_order" ? "bg-indigo-400/20 text-indigo-300" : "bg-slate-950 text-slate-400"}`}>
                        <FileText size={28} />
                    </div>
                    <h3 className="font-bold text-white text-base">Solicitud de Compra</h3>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Órdenes Logísticas</p>
                </button>
            </div>

            {/* Document Form */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-xl">
                <header className="mb-8 border-b border-slate-800 pb-6">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        Detalles del {docType === 'receipt' ? 'Recibo de Venta' : docType === 'warranty' ? 'Certificado de Garantía' : 'Pedido de Compra'}
                    </h2>
                    <p className="text-xs text-slate-300 font-mono uppercase font-bold tracking-wider mt-1">Ingresa los datos requeridos para la emisión</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Cliente / Beneficiario</label>
                        <input
                            type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ej: Juan Pérez"
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Concepto</label>
                        <input
                            type="text" value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Ej: Instalación de Sistema IP"
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1 flex items-center gap-1"><User size={14} className="text-cyan-400"/> Asesor Responsable</label>
                        <input
                            type="text" value={advisorName} onChange={(e) => setAdvisorName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-bold text-cyan-300 outline-none focus:border-cyan-400"
                        />
                    </div>

                    {docType === 'warranty' && (
                        <>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Meses de Cobertura</label>
                                <input
                                    type="number" value={warrantyMonths} onChange={(e) => setWarrantyMonths(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-cyan-400"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Detalles Técnicos</label>
                                <textarea
                                    value={warrantyComments} onChange={(e) => setWarrantyComments(e.target.value)} rows={3}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white outline-none focus:border-cyan-400 resize-none"
                                />
                            </div>
                        </>
                    )}

                    {docType === 'receipt' && (
                        <>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Monto ($)</label>
                                <input
                                    type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-black text-white outline-none focus:border-cyan-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Método de Pago</label>
                                <select
                                    value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white outline-none focus:border-cyan-400"
                                >
                                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                                    <option value="EFECTIVO">EFECTIVO</option>
                                    <option value="TARJETA">TARJETA</option>
                                    <option value="CHEQUE">CHEQUE</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 border-t border-slate-800 pt-6">
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1 flex items-center gap-1"><CreditCard size={14}/> Referencia / Comprobante</label>
                                <input
                                    type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Nro. Transacción"
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white outline-none focus:border-cyan-400"
                                />
                            </div>
                        </>
                    )}

                    {docType === 'purchase_order' && (
                        <>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Cédula / RUC</label>
                                <input type="text" value={clientCedula} onChange={(e) => setClientCedula(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white outline-none focus:border-cyan-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Ciudad</label>
                                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white outline-none focus:border-cyan-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Valor del Pedido ($)</label>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-black text-white outline-none focus:border-cyan-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1 ml-1">Forma de Pago</label>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-bold text-white outline-none">
                                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                                    <option value="DEPOSITO">DEPÓSITO</option>
                                    <option value="EFECTIVO">EFECTIVO</option>
                                </select>
                            </div>
                        </>
                    )}

                    {(docType === 'warranty' || docType === 'purchase_order') && (
                        <div className="md:col-span-2 mt-4">
                            <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2 ml-1">Imagen Referencial (Opcional)</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer border-2 border-dashed border-slate-800 hover:border-cyan-400 hover:bg-slate-950 transition-colors p-6 rounded-2xl flex flex-col items-center justify-center flex-1">
                                    <Upload className="text-slate-400 mb-2" size={24} />
                                    <span className="text-xs font-bold text-slate-300">Subir Imagen</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                                {productImage && (
                                    <div className="w-24 h-24 rounded-2xl border border-slate-800 overflow-hidden shrink-0 shadow-lg">
                                        <img src={productImage} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                    <button
                        onClick={handleGeneratePDF}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-105 transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
                    >
                        <Download size={16} />
                        Descargar PDF Oficial
                    </button>
                </div>
            </div>
        </div>
    )
}
