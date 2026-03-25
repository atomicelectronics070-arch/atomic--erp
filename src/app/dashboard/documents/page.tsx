"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { FileText, FileSignature, Receipt, Download, MapPin, MessageSquare, CreditCard, User } from "lucide-react"
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
    const [advisorName, setAdvisorName] = useState("ASIGNADO")

    useEffect(() => {
        if (session?.user?.name) {
            setAdvisorName(session.user.name.toUpperCase())
        }
    }, [session])

    const handleGeneratePDF = () => {
        if (!clientName.trim() || !concept.trim()) {
            alert("Por favor completa los campos de Cliente y Concepto")
            return
        }

        const doc = new jsPDF()
        const title = docType === 'receipt' ? 'RECIBO DE CAJA / VENTA' : docType === 'warranty' ? 'DOCUMENTO DE GARANTÍA' : 'SOLICITUD DE COMPRA'

        // Header Branding - Industrial White
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 50, 'F');

        try {
            doc.addImage('/logo_atomic.jpg', 'JPEG', 14, 10, 40, 20);
        } catch (e) {
            doc.setFontSize(20);
            doc.setTextColor(234, 88, 12);
            doc.text("ATOMIC INDUSTRIES", 14, 25);
        }

        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.setFont("helvetica", "bold");
        doc.text(title.toUpperCase(), 14, 35);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 40);
        doc.text(`Nro. Control: ${Math.floor(100000 + Math.random() * 900000)}`, 14, 44);

        doc.setDrawColor(240);
        doc.line(14, 50, 196, 50);

        // Body
        doc.setFontSize(11)
        doc.setTextColor(0)
        doc.setFont("helvetica", "bold")
        doc.text("INFORMACIÓN DEL BENEFICIARIO / CLIENTE:", 14, 60)
        doc.setFontSize(10)
        doc.text(clientName.toUpperCase(), 14, 67)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(100)
        doc.text("ATOMIC INDUSTRIES - DIVISIÓN CORPORATIVA", 14, 73)

        const tableBody = [
            ["DESCRIPCIÓN / CONCEPTO", concept.toUpperCase()],
            ["FECHA DE REGISTRO", new Date().toLocaleDateString()]
        ]

        if (docType === 'receipt') {
            tableBody.push(["MONTO TOTAL RECAUDADO", `$${parseFloat(amount || '0').toLocaleString('es-EC', { minimumFractionDigits: 2 })}`])
            tableBody.push(["MÉTODO DE PAGO", paymentMethod])
            tableBody.push(["REFERENCIA DE TRANSACCIÓN", reference || "N/A"])
        } else if (docType === 'warranty') {
            tableBody.push(["PERIODO DE COBERTURA", `${warrantyMonths} MESES`])
            if (warrantyComments) {
                tableBody.push(["COMENTARIOS TÉCNICOS", warrantyComments.toUpperCase()])
            }
        } else if (docType === 'purchase_order') {
            tableBody.push(["DIRECCIÓN DE ENTREGA", deliveryAddress.toUpperCase() || "POR DEFINIR"])
        }

        autoTable(doc, {
            startY: 85,
            head: [["PARÁMETRO", "DETALLE TÉCNICO"]],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [15, 15, 15], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 5 },
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
            doc.setTextColor(150)
            const terms = "Esta garantía cubre defectos de fabricación en hardware y componentes electrónicos bajo condiciones normales de operación industrial. No aplica para daños por picos de voltaje, humedad extrema o manipulación por personal no autorizado por ATOMIC INDUSTRIES."
            const splitTerms = doc.splitTextToSize(terms, 180)
            doc.text(splitTerms, 14, finalY)
            finalY += 15
        }

        doc.setFontSize(9)
        doc.setTextColor(0)
        doc.setFont("helvetica", "bold")
        doc.line(14, finalY + 30, 80, finalY + 30)
        doc.text("FIRMA AUTORIZADA", 14, finalY + 35)
        doc.setFont("helvetica", "normal")
        doc.text(advisorName.toUpperCase(), 14, finalY + 39)

        doc.save(`${title.replace(/\s+/g, '_')}_${clientName.replace(/\s+/g, '_')}.pdf`)
    }

    return (
        <div className="space-y-12 pb-24">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                    Emisión de <span className="text-orange-600">Documentos</span>
                </h1>
                <p className="text-neutral-400 font-medium text-sm mt-1">Generación de instrumentos legales y comerciales con validez corporativa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button
                    onClick={() => setDocType("receipt")}
                    className={`p-10 rounded-none border-2 ${docType === "receipt" ? "border-orange-600 bg-white shadow-xl scale-[1.02]" : "border-neutral-100 bg-neutral-50 shadow-sm opacity-60"} transition-all flex flex-col items-center text-center group`}
                >
                    <div className={`p-5 rounded-none mb-6 transition-all ${docType === "receipt" ? "bg-orange-600 text-white" : "bg-neutral-200 text-neutral-400"}`}>
                        <Receipt size={32} />
                    </div>
                    <h3 className="font-bold text-neutral-900 uppercase tracking-widest text-xs">Recibo de Venta</h3>
                    <p className="text-[10px] text-neutral-400 mt-2 font-bold uppercase tracking-widest">Liquidación y Cobro</p>
                </button>

                <button
                    onClick={() => setDocType("warranty")}
                    className={`p-10 rounded-none border-2 ${docType === "warranty" ? "border-orange-600 bg-white shadow-xl scale-[1.02]" : "border-neutral-100 bg-neutral-50 shadow-sm opacity-60"} transition-all flex flex-col items-center text-center group`}
                >
                    <div className={`p-5 rounded-none mb-6 transition-all ${docType === "warranty" ? "bg-orange-600 text-white" : "bg-neutral-200 text-neutral-400"}`}>
                        <FileSignature size={32} />
                    </div>
                    <h3 className="font-bold text-neutral-900 uppercase tracking-widest text-xs">Doc. de Garantía</h3>
                    <p className="text-[10px] text-neutral-400 mt-2 font-bold uppercase tracking-widest">Cobertura Técnica</p>
                </button>

                <button
                    onClick={() => setDocType("purchase_order")}
                    className={`p-10 rounded-none border-2 ${docType === "purchase_order" ? "border-orange-600 bg-white shadow-xl scale-[1.02]" : "border-neutral-100 bg-neutral-50 shadow-sm opacity-60"} transition-all flex flex-col items-center text-center group`}
                >
                    <div className={`p-5 rounded-none mb-6 transition-all ${docType === "purchase_order" ? "bg-orange-600 text-white" : "bg-neutral-200 text-neutral-400"}`}>
                        <FileText size={32} />
                    </div>
                    <h3 className="font-bold text-neutral-900 uppercase tracking-widest text-xs">Solicitud de Compra</h3>
                    <p className="text-[10px] text-neutral-400 mt-2 font-bold uppercase tracking-widest">Orden Logística</p>
                </button>
            </div>

            <div className="bg-white border border-neutral-200 p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>

                <h2 className="text-xl font-bold mb-10 flex items-center text-neutral-900 uppercase tracking-tight border-b border-neutral-50 pb-6">
                    Detalles del {docType === 'receipt' ? 'Recibo' : docType === 'warranty' ? 'Certificado' : 'Pedido'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Identificación del Cliente</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="EJ: CORPORACIÓN ATOMIC"
                            className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 text-sm font-bold uppercase focus:border-orange-600 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Concepto / Referencia Técnica</label>
                        <input
                            type="text"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            placeholder="EJ: SOPORTE NIVEL 3 / HARDWARE"
                            className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 text-sm font-bold uppercase focus:border-orange-600 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Asesor Responsable (Firma)</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                            <input
                                type="text"
                                value={advisorName}
                                onChange={(e) => setAdvisorName(e.target.value)}
                                placeholder="NOMBRE DEL ASESOR"
                                className="w-full pl-14 pr-5 py-4 bg-orange-50/30 border border-neutral-100 text-sm font-bold uppercase focus:border-orange-600 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {docType === 'warranty' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Meses de Cobertura</label>
                                <input
                                    type="number"
                                    value={warrantyMonths}
                                    onChange={(e) => setWarrantyMonths(e.target.value)}
                                    className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Comentarios de Garantía</label>
                                <textarea
                                    value={warrantyComments}
                                    onChange={(e) => setWarrantyComments(e.target.value)}
                                    placeholder="ESPECIFICACIONES TÉCNICAS O RESTRICCIONES..."
                                    className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 text-sm font-bold uppercase focus:border-orange-600 outline-none transition-all h-32 resize-none"
                                />
                            </div>
                        </>
                    )}

                    {docType === 'receipt' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Monto de Liquidación ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Método de Pago</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 text-sm font-bold uppercase focus:border-orange-600 outline-none transition-all"
                                >
                                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                                    <option value="EFECTIVO">EFECTIVO</option>
                                    <option value="TARJETA">TARJETA</option>
                                    <option value="CHEQUE">CHEQUE</option>
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2 border-t border-neutral-50 pt-6 mt-4">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Número de Referencia / Comprobante</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                    <input
                                        type="text"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder="NRO. LOTE / NRO. TRANSFERENCIA"
                                        className="w-full pl-14 pr-5 py-4 bg-neutral-50 border border-neutral-100 text-sm font-bold uppercase focus:border-orange-600 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {docType === 'purchase_order' && (
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center">
                                <MapPin size={14} className="mr-2" /> Dirección de Entrega Final
                            </label>
                            <input
                                type="text"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="PROVINCIA, CIUDAD, CALLE Y NRO..."
                                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 text-sm font-bold uppercase focus:border-orange-600 outline-none transition-all"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-start mt-12 pt-8 border-t border-neutral-100">
                    <button
                        onClick={handleGeneratePDF}
                        className="bg-neutral-900 hover:bg-orange-600 text-white font-bold py-6 px-12 rounded-none flex items-center transition-all shadow-xl shadow-neutral-200 uppercase tracking-[0.3em] text-[10px]"
                    >
                        <Download size={20} className="mr-3" /> Certificar y Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    )
}




