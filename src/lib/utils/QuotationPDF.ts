import jsPDF from "jspdf";
import "jspdf-autotable";

export interface QuotationData {
    topic: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    items: {
        code: string;
        description: string;
        price: number;
        quantity: number;
    }[];
}

export const generateQuotationPDF = (data: QuotationData, advisorName: string = "ADMINISTRADOR") => {
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFillColor(30, 58, 138); // Navy Blue
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("ATOMIC SOLUTIONS", 15, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("INFRAESTRUCTURA TECNOLÓGICA & SEGURIDAD ELECTRÓNICA", 15, 32);

    // --- Document Info ---
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("COTIZACIÓN COMERCIAL", 15, 55);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`FECHA DE EMISIÓN: ${dateStr.toUpperCase()}`, 15, 62);
    doc.text(`TEMA: ${data.topic.toUpperCase()}`, 15, 67);

    // --- Client & Advisor Info ---
    doc.setDrawColor(230, 230, 230);
    doc.line(15, 75, pageWidth - 15, 75);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("DATOS DEL CLIENTE:", 15, 85);
    doc.text("ASESOR RESPONSABLE:", pageWidth / 2 + 10, 85);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`NOMBRE: ${data.clientName.toUpperCase()}`, 15, 92);
    doc.text(`TELÉFONO: ${data.clientPhone || 'N/A'}`, 15, 97);
    doc.text(`CORREO: ${data.clientEmail || 'N/A'}`, 15, 102);

    doc.text(`NOMBRE: ${advisorName.toUpperCase()}`, pageWidth / 2 + 10, 92);
    doc.text("DEPARTAMENTO: VENTAS & PROYECTOS", pageWidth / 2 + 10, 97);
    doc.text("CONTACTO: soporte@atomic.com", pageWidth / 2 + 10, 102);

    // --- Items Table ---
    const tableRows = data.items.map(item => [
        item.code,
        item.description.toUpperCase(),
        item.quantity,
        `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        `$${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    ]);

    const total = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    doc.autoTable({
        startY: 115,
        head: [['CÓDIGO', 'DESCRIPCIÓN DEL PRODUCTO / SERVICIO', 'CANT', 'P. UNIT', 'SUBTOTAL']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138], fontSize: 9, halign: 'center' },
        columnStyles: {
            0: { cellWidth: 25, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' },
        },
        styles: { fontSize: 8, cellPadding: 4 }
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // --- Totals ---
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("TOTAL NETO A PAGAR:", pageWidth - 80, finalY + 15);
    doc.setFontSize(14);
    doc.text(`USD $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - 80, finalY + 23);

    // --- Footer Terms ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    const termsY = finalY + 50;
    doc.text("TÉRMINOS Y CONDICIONES:", 15, termsY);
    doc.text("- Validez de la oferta: 5 días calendario.", 15, termsY + 5);
    doc.text("- Forma de pago: Transferencia bancaria o efectivo.", 15, termsY + 10);
    doc.text("- Tiempo de entrega: Inmediato sujeto a stock.", 15, termsY + 15);

    // --- Signature ---
    doc.setDrawColor(30, 58, 138);
    doc.line(pageWidth / 2 - 30, termsY + 40, pageWidth / 2 + 30, termsY + 40);
    doc.setFont("helvetica", "bold");
    doc.text("FIRMA AUTORIZADA", pageWidth / 2, termsY + 45, { align: "center" });

    // Save/Download
    doc.save(`Cotizacion_${data.clientName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};
