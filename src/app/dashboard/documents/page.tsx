"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    FileText, FileSignature, Receipt, Download, MapPin, 
    MessageSquare, CreditCard, User, Sparkles, Target, 
    Zap, ShieldCheck, ArrowRight, LayoutGrid, CheckCircle2 
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
    const [advisorName, setAdvisorName] = useState("ASIGNADO")

    useEffect(() => {
        if (session?.user?.name) {
            setAdvisorName(session.user.name.toUpperCase())
        }
    }, [session])

    const handleGeneratePDF = () => {
        if (!clientName.trim() || !concept.trim()) {
            alert("⚠️ Vector de Datos Incompleto: Por favor completa los campos de Cliente y Concepto")
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
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
             {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-16 relative z-10 gap-10">
                <div>
                     <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <FileSignature size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Legal_Document Engine v2.4</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                        EMISIÓN DE <span className="text-secondary underline decoration-secondary/30 underline-offset-8">DOCUMENTOS</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Generación instantánea de instrumentos legales, certificados de garantía y órdenes logísticas bajo estándares corporativos.
                    </p>
                </div>
            </header>

            {/* Document Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <button
                    onClick={() => setDocType("receipt")}
                    className={`glass-panel p-10 rounded-[2.5rem] border transition-all flex flex-col items-center text-center group relative overflow-hidden backdrop-blur-3xl shadow-2xl ${docType === "receipt" ? "border-secondary/40 !bg-secondary/5 scale-105" : "border-white/5 !bg-slate-950/40 opacity-40 hover:opacity-100"}`}
                >
                    <div className={`p-6 rounded-2xl mb-8 transition-all ${docType === "receipt" ? "bg-secondary text-white shadow-[0_0_30px_rgba(255,99,71,0.5)]" : "bg-slate-900 text-slate-600 group-hover:text-white"}`}>
                        <Receipt size={32} />
                    </div>
                    <h3 className="font-black text-white uppercase tracking-widest text-xs italic">Recibo de Venta</h3>
                    <p className="text-[9px] text-slate-500 mt-3 font-black uppercase tracking-[0.3em] italic">Liquidación y Cobro</p>
                    {docType === "receipt" && <div className="absolute top-4 right-6 text-secondary animate-pulse"><Sparkles size={16} /></div>}
                </button>

                <button
                    onClick={() => setDocType("warranty")}
                    className={`glass-panel p-10 rounded-[2.5rem] border transition-all flex flex-col items-center text-center group relative overflow-hidden backdrop-blur-3xl shadow-2xl ${docType === "warranty" ? "border-azure-500/40 !bg-azure-500/5 scale-105" : "border-white/5 !bg-slate-950/40 opacity-40 hover:opacity-100"}`}
                >
                    <div className={`p-6 rounded-2xl mb-8 transition-all ${docType === "warranty" ? "bg-azure-500 text-slate-950 shadow-[0_0_30px_rgba(45,212,191,0.5)]" : "bg-slate-900 text-slate-600 group-hover:text-white"}`}>
                        <FileSignature size={32} />
                    </div>
                    <h3 className="font-black text-white uppercase tracking-widest text-xs italic">Doc. de Garantía</h3>
                    <p className="text-[9px] text-slate-500 mt-3 font-black uppercase tracking-[0.3em] italic">Cobertura Técnica</p>
                    {docType === "warranty" && <div className="absolute top-4 right-6 text-azure-400 animate-pulse"><CheckCircle2 size={16} /></div>}
                </button>

                <button
                    onClick={() => setDocType("purchase_order")}
                    className={`glass-panel p-10 rounded-[2.5rem] border transition-all flex flex-col items-center text-center group relative overflow-hidden backdrop-blur-3xl shadow-2xl ${docType === "purchase_order" ? "border-primary/40 !bg-primary/5 scale-105" : "border-white/5 !bg-slate-950/40 opacity-40 hover:opacity-100"}`}
                >
                    <div className={`p-6 rounded-2xl mb-8 transition-all ${docType === "purchase_order" ? "bg-primary text-white shadow-[0_0_30px_rgba(255,99,71,0.5)]" : "bg-slate-900 text-slate-600 group-hover:text-white"}`}>
                        <FileText size={32} />
                    </div>
                    <h3 className="font-black text-white uppercase tracking-widest text-xs italic">Solicitud de Compra</h3>
                    <p className="text-[9px] text-slate-500 mt-3 font-black uppercase tracking-[0.3em] italic">Orden Logística</p>
                    {docType === "purchase_order" && <div className="absolute top-4 right-6 text-secondary animate-pulse"><Zap size={16} /></div>}
                </button>
            </div>

            {/* Document Form */}
            <div className="glass-panel border-white/5 p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-3xl z-10 transition-all">
                <div className="absolute top-0 left-0 w-2 h-full bg-secondary shadow-[0_0_20px_rgba(255,99,71,0.5)]"></div>
                
                <header className="mb-16 flex items-center justify-between border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                            PARÁMETROS DEL <span className="text-secondary">{docType === 'receipt' ? 'RECIBO' : docType === 'warranty' ? 'CERTIFICADO' : 'PEDIDO'}</span>
                        </h2>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Inyección de metadata para procesamiento legal</p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-slate-800 shadow-inner"><LayoutGrid size={24} /></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Identificación del Cliente</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value.toUpperCase())}
                            placeholder="EJ: CORPORACIÓN ATOMIC_PRO"
                            className="w-full px-8 py-6 bg-slate-950 border border-white/5 text-base font-black uppercase tracking-widest text-white outline-none rounded-[2rem] focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                        />
                    </div>

                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Concepto / Referencia Técnica</label>
                        <input
                            type="text"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value.toUpperCase())}
                            placeholder="EJ: SOPORTE ESPECIALIZADO NIVEL 4"
                            className="w-full px-8 py-6 bg-slate-950 border border-white/5 text-base font-black uppercase tracking-widest text-white outline-none rounded-[2rem] focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                        />
                    </div>

                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic flex items-center gap-2">
                             <User size={14} className="text-secondary" /> Asesor Responsable (Firma_Vect)
                        </label>
                        <input
                            type="text"
                            value={advisorName}
                            onChange={(e) => setAdvisorName(e.target.value.toUpperCase())}
                            placeholder="NOMBRE DEL ASESOR"
                            className="w-full px-8 py-6 bg-secondary/5 border border-secondary/20 text-base font-black uppercase tracking-widest text-secondary outline-none rounded-[2rem] focus:border-secondary transition-all shadow-2xl placeholder:text-secondary/20 italic"
                        />
                    </div>

                    {docType === 'warranty' && (
                        <>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Meses de Cobertura Industrial</label>
                                <input
                                    type="number"
                                    value={warrantyMonths}
                                    onChange={(e) => setWarrantyMonths(e.target.value)}
                                    className="w-full px-8 py-6 bg-slate-950 border border-white/5 text-base font-black text-azure-400 outline-none rounded-[2rem] focus:border-azure-500 transition-all shadow-inner italic"
                                />
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Metadata de Garantía / Restricciones</label>
                                <textarea
                                    value={warrantyComments}
                                    onChange={(e) => setWarrantyComments(e.target.value.toUpperCase())}
                                    placeholder="ESPECIFICACIONES TÉCNICAS O RESTRICCIONES DE HARDWARE..."
                                    className="w-full px-10 py-8 bg-slate-950 border border-white/5 text-[12px] font-black uppercase tracking-[0.1em] text-slate-400 outline-none rounded-[3rem] focus:border-azure-500 transition-all shadow-inner h-40 resize-none italic custom-scrollbar placeholder:text-slate-900 leading-relaxed"
                                />
                            </div>
                        </>
                    )}

                    {docType === 'receipt' && (
                        <>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Monto de Liquidación ($)</label>
                                <div className="relative">
                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-secondary font-black italic">$</div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-14 pr-8 py-6 bg-slate-950 border border-white/5 text-xl font-black text-white outline-none rounded-[2rem] focus:border-secondary transition-all shadow-inner italic"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Método de Transferencia_Vect</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-8 py-6 bg-slate-950 border border-white/5 text-xs font-black uppercase tracking-widest text-azure-400 outline-none rounded-[2rem] focus:border-azure-500 transition-all shadow-inner italic appearance-none"
                                >
                                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                                    <option value="EFECTIVO">EFECTIVO</option>
                                    <option value="TARJETA">TARJETA_CC</option>
                                    <option value="CHEQUE">CHEQUE_BANC</option>
                                </select>
                            </div>
                            <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-10 mt-6">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic flex items-center gap-3">
                                    <CreditCard size={14} className="text-secondary" /> Número de Referencia / ID Comprobante
                                </label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value.toUpperCase())}
                                    placeholder="NRO. LOTE / NRO. TRANSFERENCIA_HASH"
                                    className="w-full px-8 py-6 bg-slate-950 border border-white/5 text-base font-black uppercase tracking-widest text-white outline-none rounded-[2rem] focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                                />
                            </div>
                        </>
                    )}

                    {docType === 'purchase_order' && (
                        <div className="space-y-4 col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic flex items-center gap-3">
                                <MapPin size={14} className="text-secondary" /> Coordenadas de Entrega Logística
                            </label>
                            <input
                                type="text"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value.toUpperCase())}
                                placeholder="PROVINCIA, CIUDAD, CALLE Y NODO DE ENTREGA..."
                                className="w-full px-8 py-6 bg-slate-950 border border-white/5 text-base font-black uppercase tracking-widest text-white outline-none rounded-[2rem] focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-start mt-20 pt-10 border-t border-white/5">
                    <button
                        onClick={handleGeneratePDF}
                        className="bg-secondary text-white font-black py-8 px-20 uppercase tracking-[0.5em] text-[11px] flex items-center justify-center gap-6 shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] transition-all hover:bg-white hover:text-secondary rounded-[3rem] active:scale-95 italic skew-x-[-12deg] group"
                    >
                         <div className="skew-x-[12deg] flex items-center gap-5">
                            <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                            <span>Certificar y Descargar PDF</span>
                        </div>
                    </button>
                    
                    <div className="ml-auto flex items-center gap-8 opacity-20">
                         <div className="flex flex-col text-right">
                             <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">SECURITY_LEVEL</span>
                             <span className="text-[10px] font-black text-secondary italic uppercase tracking-widest leading-none">AES-256_SYNC</span>
                         </div>
                         <ShieldCheck size={32} className="text-secondary" />
                    </div>
                </div>
            </div>
        </div>
    )
}
