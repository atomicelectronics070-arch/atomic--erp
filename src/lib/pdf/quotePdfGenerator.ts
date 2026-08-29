import jsPDF from "jspdf";

export interface UnifiedQuoteItem {
  id?: string;
  sku?: string;
  productId?: string;
  name?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  discountAmount?: number;
  total?: number;
  customImage?: string;
}

export interface UnifiedQuoteData {
  quoteNumber: string; // e.g. PROP-2026-9787 or PROP-00-030
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientCity?: string;
  deliveryAddress?: string;
  quoteSubject?: string;
  advisorName?: string;
  items: UnifiedQuoteItem[];
  specs?: string;
  warrantyComments?: string;
  subtotal: number;
  taxAmount?: number;
  taxPercent?: number;
  discountAmount?: number;
  shippingAmount?: number;
  total: number;
  emissionDate?: string;
  validityDays?: number;
  paymentTerms?: string;
}

export async function generateAtomicUnifiedProposalPDF(data: UnifiedQuoteData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const today = data.emissionDate || new Date().toLocaleDateString("es-EC");
  const normalizedNumber = data.quoteNumber.startsWith("PROP")
    ? data.quoteNumber
    : `PROP-${data.quoteNumber.replace(/^[A-Z]+-/, "")}`;

  let currentY = 0;

  // ═══════════════════════════════════════════════════
  // 1. BANNER SUPERIOR DE ENCABEZADO (NAVY & ELECTRIC BLUE)
  // ═══════════════════════════════════════════════════
  doc.setFillColor(15, 23, 42); // #0F172A Slate 900
  doc.rect(0, 0, pageWidth, 38, "F");

  // Accent Line Blue
  doc.setFillColor(37, 99, 235); // #2563EB Blue 600
  doc.rect(0, 38, pageWidth, 2.5, "F");

  // Header Title & Meta
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("ATOMIC SOLUTIONS", 14, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // #CBD5E1
  doc.text("TECNOLOGÍA, ELECTRÓNICA & EQUIPAMIENTO EMPRESARIAL", 14, 23.5);
  doc.text("RUC / Registro Oficial · Envíos a Nivel Nacional · WhatsApp: 0969043453", 14, 29);

  // Badge Derecha: PROPUESTA OFICIAL
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(pageWidth - 68, 9.5, 54, 19, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PROPUESTA OFICIAL", pageWidth - 41, 16.5, { align: "center" });
  doc.setFontSize(10.5);
  doc.text(normalizedNumber, pageWidth - 41, 24, { align: "center" });

  // ═══════════════════════════════════════════════════
  // 2. TARJETAS DE CLIENTE & EMISIÓN (DUAL CARDS)
  // ═══════════════════════════════════════════════════
  currentY = 48;
  const cardWidth = (pageWidth - 34) / 2;

  // Left Card: DATOS DEL CLIENTE
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, cardWidth, 34, 2, 2, "FD");

  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DATOS DEL CLIENTE", 18, currentY + 7);

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text((data.clientName || "Cliente General").substring(0, 38), 18, currentY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Tel / WhatsApp: ${data.clientPhone?.trim() || "No especificado"}`, 18, currentY + 20);
  doc.text(
    `Ubicación: ${(data.clientCity || data.deliveryAddress || "Quito / Entrega a Domicilio").substring(0, 36)}`,
    18,
    currentY + 26
  );

  // Right Card: INFORMACIÓN DE EMISIÓN
  const rightBoxX = 14 + cardWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightBoxX, currentY, cardWidth, 34, 2, 2, "FD");

  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("INFORMACIÓN DE EMISIÓN", rightBoxX + 4, currentY + 7);

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Fecha de Emisión: ${today}`, rightBoxX + 4, currentY + 14);
  doc.text(`Validez de Oferta: ${data.validityDays || 15} días calendario`, rightBoxX + 4, currentY + 20);
  doc.text(
    `Asesor: ${(data.advisorName || "COORDINACIÓN / VENTAS").substring(0, 26)}`,
    rightBoxX + 4,
    currentY + 26
  );

  currentY += 41;

  // ═══════════════════════════════════════════════════
  // 3. TABLA DE ÍTEMS / PRODUCTOS
  // ═══════════════════════════════════════════════════
  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(14, currentY, pageWidth - 28, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("SKU", 18, currentY + 5.5);
  doc.text("DESCRIPCIÓN DEL EQUIPAMIENTO / PRODUCTO", 42, currentY + 5.5);
  doc.text("CANT.", pageWidth - 70, currentY + 5.5, { align: "center" });
  doc.text("P. UNIT.", pageWidth - 46, currentY + 5.5, { align: "center" });
  doc.text("TOTAL", pageWidth - 18, currentY + 5.5, { align: "right" });

  currentY += 8;

  // Table Body Rows
  const itemsList = data.items && data.items.length > 0
    ? data.items
    : [
        {
          sku: "GEN-01",
          description: "Producto General de Catálogo",
          quantity: 1,
          unitPrice: data.subtotal || data.total || 0,
          total: data.subtotal || data.total || 0,
        },
      ];

  itemsList.forEach((item, index) => {
    const itemSku = item.sku || item.productId || `ITM-${index + 1}`;
    const itemDesc = item.name || item.description || "Producto / Servicio";
    const itemQty = Number(item.quantity) || 1;
    const itemUnitPrice = Number(item.unitPrice) || 0;
    const itemDiscount = Number(item.discountAmount) || 0;
    const itemTotal = item.total !== undefined ? Number(item.total) : (itemQty * itemUnitPrice - itemDiscount);

    const isEven = index % 2 === 0;
    const rowHeight = 14;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, currentY, pageWidth - 28, rowHeight, "FD");

    // SKU
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235);
    doc.text(itemSku.substring(0, 12), 18, currentY + 6.5);

    // Description
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(itemDesc.substring(0, 52), 42, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Garantía oficial 1 año · Soporte directo ATOMIC", 42, currentY + 10.5);

    // Qty
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`${itemQty}`, pageWidth - 70, currentY + 8.5, { align: "center" });

    // Unit Price
    doc.text(`$${itemUnitPrice.toFixed(2)}`, pageWidth - 46, currentY + 8.5, { align: "center" });

    // Total
    doc.setTextColor(15, 23, 42);
    doc.text(`$${itemTotal.toFixed(2)}`, pageWidth - 18, currentY + 8.5, { align: "right" });

    currentY += rowHeight;
  });

  currentY += 4;

  // ═══════════════════════════════════════════════════
  // 4. ESPECIFICACIONES TÉCNICAS & ALCANCE
  // ═══════════════════════════════════════════════════
  const specsText = data.specs || data.warrantyComments || data.quoteSubject;
  if (specsText && specsText.trim()) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, "FD");

    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("ESPECIFICACIONES TÉCNICAS & ALCANCE DEL SUMINISTRO:", 18, currentY + 5.5);

    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    const splitSpecs = doc.splitTextToSize(specsText.trim(), pageWidth - 36);
    doc.text(splitSpecs.slice(0, 4), 18, currentY + 11);

    currentY += 28;
  } else {
    currentY += 4;
  }

  // ═══════════════════════════════════════════════════
  // 5. TÉRMINOS Y LIQUIDACIÓN FINANCIERA
  // ═══════════════════════════════════════════════════
  const summaryWidth = 84;
  const summaryX = pageWidth - 14 - summaryWidth;
  const termsWidth = summaryX - 14 - 6;

  // Left Box: TÉRMINOS Y CONDICIONES
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, termsWidth, 42, 2, 2, "FD");

  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("TÉRMINOS Y CONDICIONES:", 18, currentY + 6.5);

  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("• Garantía de 1 año en defectos de fábrica con repuestos originales.", 18, currentY + 13);
  doc.text("• Precios expresados en Dólares Americanos (USD).", 18, currentY + 19);
  doc.text("• Despachos seguros a nivel nacional mediante Servientrega / Transporte.", 18, currentY + 25);
  doc.text("• Soporte y asesoría técnica personalizada posventa.", 18, currentY + 31);
  doc.text("• Forma de Pago: Transferencia / Tarjeta de Crédito / Efectivo.", 18, currentY + 37);

  // Right Box: RESUMEN FINANCIERO
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, currentY, summaryWidth, 42, 2, 2, "FD");

  let subY = currentY + 6.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", summaryX + 6, subY);
  doc.setTextColor(30, 41, 59);
  doc.text(`$${Number(data.subtotal || data.total).toFixed(2)}`, summaryX + summaryWidth - 6, subY, { align: "right" });

  if (data.taxAmount && data.taxAmount > 0) {
    subY += 6;
    doc.setTextColor(100, 116, 139);
    doc.text(`IVA (${data.taxPercent || 15}%):`, summaryX + 6, subY);
    doc.setTextColor(30, 41, 59);
    doc.text(`$${Number(data.taxAmount).toFixed(2)}`, summaryX + summaryWidth - 6, subY, { align: "right" });
  }

  if (data.discountAmount && data.discountAmount > 0) {
    subY += 6;
    doc.setTextColor(220, 38, 38);
    doc.text("Descuento:", summaryX + 6, subY);
    doc.text(`-$${Number(data.discountAmount).toFixed(2)}`, summaryX + summaryWidth - 6, subY, { align: "right" });
  }

  if (data.shippingAmount && data.shippingAmount > 0) {
    subY += 6;
    doc.setTextColor(13, 148, 136);
    doc.text("Envío / Instalación:", summaryX + 6, subY);
    doc.text(`+$${Number(data.shippingAmount).toFixed(2)}`, summaryX + summaryWidth - 6, subY, { align: "right" });
  }

  // TOTAL ROW IN ACCENT DARK & EMERALD
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(summaryX + 3, currentY + 29, summaryWidth - 6, 10.5, 1.5, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("TOTAL USD:", summaryX + 7, currentY + 36);

  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153); // Emerald glowing green
  doc.text(`$${Number(data.total).toFixed(2)}`, summaryX + summaryWidth - 7, currentY + 36, { align: "right" });

  const fileName = `Proforma_${normalizedNumber}_${(data.clientName || "Cliente").replace(/\s+/g, "_")}.pdf`;

  return {
    doc,
    fileName,
    blob: doc.output("blob"),
    dataUri: doc.output("datauristring"),
  };
}
