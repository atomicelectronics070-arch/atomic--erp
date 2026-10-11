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
  quoteNumber: string; // e.g. PROP-09-71 or PROP-00-030
  clientName: string;
  clientCedula?: string;
  clientRuc?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientCity?: string;
  deliveryAddress?: string;
  quoteSubject?: string;
  advisorName?: string;
  advisorPhone?: string;
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
  qrCodeUrl?: string;
  qrDataUri?: string;
}

let cachedLogoBase64: string | null = null;

async function fetchQuoteLogo(): Promise<string | null> {
  if (cachedLogoBase64) return cachedLogoBase64;
  if (typeof window === "undefined") return null;

  try {
    const res = await fetch("/api/quotes/logo");
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.base64) {
        cachedLogoBase64 = json.base64;
        return json.base64;
      }
    }
  } catch (err) {
    console.warn("Could not retrieve logo from /api/quotes/logo:", err);
  }

  try {
    const imgRes = await fetch("/templates/atomic_quote_logo.png");
    if (imgRes.ok) {
      const blob = await imgRes.blob();
      const reader = new FileReader();
      const b64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      if (b64) {
        cachedLogoBase64 = b64;
        return b64;
      }
    }
  } catch (_) {}

  return null;
}

function formatEcuadorDate(rawDate?: string): string {
  const d = rawDate ? new Date(rawDate) : new Date();
  const safeDate = isNaN(d.getTime()) ? new Date() : d;

  const days = ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"];
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayName = days[safeDate.getDay()];
  const dayNum = safeDate.getDate();
  const monthName = months[safeDate.getMonth()];
  const year = safeDate.getFullYear();

  return `${dayName}, ${dayNum} de ${monthName} ${year} .`;
}

export async function generateAtomicUnifiedProposalPDF(data: UnifiedQuoteData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight; // 182mm

  const normalizedNumber = data.quoteNumber.startsWith("PROP")
    ? data.quoteNumber
    : `PROP-${data.quoteNumber.replace(/^[A-Z]+-/, "")}`;

  // Try to load the official company logo from the Excel master template
  const logoBase64 = await fetchQuoteLogo();

  // ═══════════════════════════════════════════════════
  // 1. CABECERA: LOGO (A1:D4) & CÓDIGO PROFORMA (E1)
  // ═══════════════════════════════════════════════════
  const topY = 12;

  if (logoBase64) {
    try {
      // Dimensions matching Excel rows A1:D4 (approx 56mm x 22mm)
      doc.addImage(logoBase64, "PNG", marginLeft, topY, 56, 21);
    } catch (e) {
      console.warn("Failed drawing base64 logo in jsPDF, rendering fallback:", e);
      renderVectorLogo(doc, marginLeft, topY);
    }
  } else {
    renderVectorLogo(doc, marginLeft, topY);
  }

  // Badge Derecha: CÓDIGO DE COTIZACIÓN (Celda E1 de Excel)
  const badgeWidth = 54;
  const badgeHeight = 17;
  const badgeX = pageWidth - marginRight - badgeWidth;
  const badgeY = topY + 1;

  // Red outline box matching the Excel template
  doc.setDrawColor(220, 38, 38); // #DC2626 Red
  doc.setLineWidth(0.6);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(220, 38, 38);
  doc.text("PROFORMA / COTIZACIÓN", badgeX + badgeWidth / 2, badgeY + 5.5, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38);
  doc.text(normalizedNumber, badgeX + badgeWidth / 2, badgeY + 13, { align: "center" });

  // ═══════════════════════════════════════════════════
  // 2. FECHA DE EMISIÓN (Celda A5 de Excel)
  // ═══════════════════════════════════════════════════
  const city = (data.clientCity || "Quito").trim().replace(/,.*/, "");
  const formattedDateStr = `${city} ${formatEcuadorDate(data.emissionDate)}`;

  let currentY = 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59); // Dark Slate #1E293B
  doc.text(formattedDateStr, marginLeft, currentY);

  // ═══════════════════════════════════════════════════
  // 3. DATOS DEL CLIENTE (Celdas A7:E8 de Excel)
  // ═══════════════════════════════════════════════════
  currentY += 4;
  const clientBoxH = 19;

  // Subtle clean border & background matching Excel form
  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(203, 213, 225); // #CBD5E1
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, currentY, contentWidth, clientBoxH, 1.5, 1.5, "FD");

  const clientNameUpper = (data.clientName || "CONSUMIDOR FINAL").trim().toUpperCase();
  const cedulaRuc = (data.clientCedula || data.clientRuc || "").trim();
  const phone = (data.clientPhone || "").trim();
  const addressCity = (data.deliveryAddress || data.clientCity || "Quito, Ecuador").trim();

  // Row 1 inside box (Celda A7: NOMBRE & E7: CI/RUC)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("NOMBRE:", marginLeft + 4, currentY + 6.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(clientNameUpper.substring(0, 46), marginLeft + 23, currentY + 6.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("•CI / •RUC:", marginLeft + 120, currentY + 6.5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(cedulaRuc || "Consumidor Final", marginLeft + 140, currentY + 6.5);

  // Row 2 inside box (Celda A8: NÚMERO DE CONTACTO & CIUDAD)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("NÚMERO DE CONTACTO:", marginLeft + 4, currentY + 14);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(phone || "No especificado", marginLeft + 45, currentY + 14);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("CIUDAD / DIR:", marginLeft + 120, currentY + 14);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(addressCity.substring(0, 26), marginLeft + 144, currentY + 14);

  currentY += clientBoxH + 4;

  // ═══════════════════════════════════════════════════
  // 4. ASUNTO DEL PROYECTO (Celda C12 de Excel)
  // ═══════════════════════════════════════════════════
  const subjectText = (data.quoteSubject || data.specs || "SUMINISTRO E INSTALACIÓN DE EQUIPOS").trim().toUpperCase();
  const subjectBoxH = 7.5;

  doc.setFillColor(241, 245, 249); // #F1F5F9
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(marginLeft, currentY, contentWidth, subjectBoxH, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("ASUNTO:", marginLeft + 4, currentY + 5.2);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(subjectText.substring(0, 92), marginLeft + 21, currentY + 5.2);

  currentY += subjectBoxH + 5;

  // ═══════════════════════════════════════════════════
  // 5. TABLA DE PRODUCTOS / ÍTEMS (Celdas A14:E30 de Excel)
  // Columnas: Item | Cant. | Descripción | Sub-Total | Sub-Total 1
  // Anchos:   12   |  14   |    100      |    28     |     28    = 182mm
  // ═══════════════════════════════════════════════════
  const colWItem = 12;
  const colWQty = 14;
  const colWDesc = 100;
  const colWUnitPrice = 28;
  const colWTotal = 28;

  const colXItem = marginLeft;
  const colXQty = colXItem + colWItem;
  const colXDesc = colXQty + colWQty;
  const colXUnitPrice = colXDesc + colWDesc;
  const colXTotal = colXUnitPrice + colWUnitPrice;

  const headerH = 7.5;

  // Header Background & Borders
  doc.setFillColor(226, 232, 240); // #E2E8F0 Excel Column Header Gray
  doc.setDrawColor(148, 163, 184); // #94A3B8 Border
  doc.setLineWidth(0.3);
  doc.rect(marginLeft, currentY, contentWidth, headerH, "FD");

  // Header vertical cell borders
  doc.line(colXQty, currentY, colXQty, currentY + headerH);
  doc.line(colXDesc, currentY, colXDesc, currentY + headerH);
  doc.line(colXUnitPrice, currentY, colXUnitPrice, currentY + headerH);
  doc.line(colXTotal, currentY, colXTotal, currentY + headerH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Item", colXItem + colWItem / 2, currentY + 5.2, { align: "center" });
  doc.text("Cant.", colXQty + colWQty / 2, currentY + 5.2, { align: "center" });
  doc.text("Descripción", colXDesc + 4, currentY + 5.2);
  doc.text("Sub-Total", colXUnitPrice + colWUnitPrice - 4, currentY + 5.2, { align: "right" });
  doc.text("Sub-Total 1", colXTotal + colWTotal - 4, currentY + 5.2, { align: "right" });

  currentY += headerH;

  // Rows from quote data
  const rawItems = data.items && data.items.length > 0
    ? data.items
    : [
        {
          description: "Suministro e Implementación General",
          quantity: 1,
          unitPrice: data.subtotal || data.total || 0,
          total: data.subtotal || data.total || 0,
        },
      ];

  rawItems.forEach((item, index) => {
    const itemNum = index + 1;
    const qty = Number(item.quantity) || 1;
    const unitP = Number(item.unitPrice) || 0;
    const itemDisc = Number(item.discountAmount) || 0;
    const lineTotal = item.total !== undefined ? Number(item.total) : (qty * unitP - itemDisc);

    // Format description & specifications lines
    const mainTitle = (item.name || item.description || "Producto / Servicio").trim();
    const splitLines = doc.splitTextToSize(mainTitle, colWDesc - 8);
    const rowHeight = Math.max(8.5, 4.5 + splitLines.length * 4);

    // Background fill (alternating clean white / soft slate)
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.25);
    doc.rect(marginLeft, currentY, contentWidth, rowHeight, "FD");

    // Vertical borders between cells
    doc.line(colXQty, currentY, colXQty, currentY + rowHeight);
    doc.line(colXDesc, currentY, colXDesc, currentY + rowHeight);
    doc.line(colXUnitPrice, currentY, colXUnitPrice, currentY + rowHeight);
    doc.line(colXTotal, currentY, colXTotal, currentY + rowHeight);

    // 1. Col Item (Center)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`${itemNum}`, colXItem + colWItem / 2, currentY + 5.5, { align: "center" });

    // 2. Col Cant (Center)
    doc.setFont("helvetica", "normal");
    doc.text(`${qty}`, colXQty + colWQty / 2, currentY + 5.5, { align: "center" });

    // 3. Col Descripción (Left multiline)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.setTextColor(15, 23, 42);
    doc.text(splitLines[0] || "", colXDesc + 4, currentY + 5.2);

    if (splitLines.length > 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.2);
      doc.setTextColor(51, 65, 85);
      for (let l = 1; l < splitLines.length; l++) {
        doc.text(splitLines[l], colXDesc + 4, currentY + 5.2 + (l * 3.8));
      }
    }

    // 4. Col Sub-Total (Unit price, Right)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`$ ${unitP.toFixed(2)}`, colXUnitPrice + colWUnitPrice - 4, currentY + 5.5, { align: "right" });

    // 5. Col Sub-Total 1 (Total, Right)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`$ ${lineTotal.toFixed(2)}`, colXTotal + colWTotal - 4, currentY + 5.5, { align: "right" });

    currentY += rowHeight;
  });

  currentY += 4;

  // ═══════════════════════════════════════════════════
  // 6. TOTALES (Celdas E32:E35 de Excel) & CONDICIONES (A39:A43)
  // ═══════════════════════════════════════════════════
  const totalsBoxW = 68;
  const totalsBoxX = pageWidth - marginRight - totalsBoxW;
  const totalsY = currentY;
  const rowTotH = 6.2;

  // Calculos exactos matching Excel formulas
  const subtotalVal = Number(data.subtotal || data.total || 0);
  const discountVal = Number(data.discountAmount || 0);
  const taxableVal = Math.max(0, subtotalVal - discountVal);
  const taxVal = Number(data.taxAmount || (taxableVal * 0.15));
  const finalTotalVal = Number(data.total || (taxableVal + taxVal));

  // Totals Grid Container
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);

  // Row 1: DESCUENTO (Celda E32)
  doc.setFillColor(255, 255, 255);
  doc.rect(totalsBoxX, totalsY, totalsBoxW, rowTotH, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text("DESCUENTO:", totalsBoxX + 4, totalsY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(discountVal > 0 ? 220 : 71, discountVal > 0 ? 38 : 85, discountVal > 0 ? 38 : 105);
  doc.text(`$ ${discountVal.toFixed(2)}`, totalsBoxX + totalsBoxW - 4, totalsY + 4.5, { align: "right" });

  // Row 2: SUBTOTAL SIN IVA (Celda E33)
  doc.setFillColor(248, 250, 252);
  doc.rect(totalsBoxX, totalsY + rowTotH, totalsBoxW, rowTotH, "FD");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("SUBTOTAL SIN IVA:", totalsBoxX + 4, totalsY + rowTotH + 4.5);
  doc.setFont("helvetica", "normal");
  doc.text(`$ ${subtotalVal.toFixed(2)}`, totalsBoxX + totalsBoxW - 4, totalsY + rowTotH + 4.5, { align: "right" });

  // Row 3: IVA 15% (Celda E34)
  doc.setFillColor(255, 255, 255);
  doc.rect(totalsBoxX, totalsY + rowTotH * 2, totalsBoxW, rowTotH, "FD");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`IVA (${data.taxPercent || 15}%):`, totalsBoxX + 4, totalsY + rowTotH * 2 + 4.5);
  doc.setFont("helvetica", "normal");
  doc.text(`$ ${taxVal.toFixed(2)}`, totalsBoxX + totalsBoxW - 4, totalsY + rowTotH * 2 + 4.5, { align: "right" });

  // Row 4: TOTAL INC IVA (Celda E35) - Highlighted row
  doc.setFillColor(241, 245, 249);
  doc.rect(totalsBoxX, totalsY + rowTotH * 3, totalsBoxW, rowTotH + 1.5, "FD");
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.rect(totalsBoxX, totalsY + rowTotH * 3, totalsBoxW, rowTotH + 1.5, "D"); // Bold outer border

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL INC IVA:", totalsBoxX + 4, totalsY + rowTotH * 3 + 5.2);
  doc.setFontSize(10.5);
  doc.setTextColor(220, 38, 38); // Highlighted Red total
  doc.text(`$ ${finalTotalVal.toFixed(2)}`, totalsBoxX + totalsBoxW - 4, totalsY + rowTotH * 3 + 5.2, { align: "right" });

  // ═══════════════════════════════════════════════════
  // 7. CONDICIONES COMERCIALES (A39:A43) & QR DE VERIFICACIÓN
  // ═══════════════════════════════════════════════════
  const leftBlockW = totalsBoxX - marginLeft - 4; // 106mm
  const termsW = leftBlockW - 30; // 76mm
  const qrW = 28;
  const qrX = marginLeft + termsW + 2;

  // Commercial Terms (Left side)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, totalsY, termsW, 28, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("CONDICIONES COMERCIALES:", marginLeft + 3.5, totalsY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text("• Precios expresados en Dólares de los Estados Unidos (USD).", marginLeft + 3.5, totalsY + 9.5);
  doc.text("• Tiempo de entrega: Inmediata / Según stock disponible.", marginLeft + 3.5, totalsY + 14);
  doc.text(`• Validez de la oferta: ${data.validityDays || 15} días calendario.`, marginLeft + 3.5, totalsY + 18.5);
  doc.text("• Forma de pago: Transferencia bancaria, tarjeta o efectivo.", marginLeft + 3.5, totalsY + 23);

  // Scannable QR Code Box (Center side)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(qrX, totalsY, qrW, 28, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(15, 23, 42);
  doc.text("VERIFICACIÓN QR", qrX + qrW / 2, totalsY + 4.5, { align: "center" });

  const onlineQuoteUrl = data.qrCodeUrl || `https://atomiccotizador.shop/c/${normalizedNumber}`;

  let effectiveQrUri = data.qrDataUri;
  if (!effectiveQrUri && typeof document !== "undefined") {
    const canvas = (document.getElementById(`atomic-quote-qr-${normalizedNumber}`) ||
                    document.getElementById(`atomic-quote-qr-${data.quoteNumber}`) ||
                    document.getElementById("atomic-quote-qr-canvas") ||
                    document.getElementById("atomic-quote-public-qr-canvas")) as HTMLCanvasElement;
    if (canvas) {
      try {
        effectiveQrUri = canvas.toDataURL("image/png");
      } catch (_) {}
    }
  }

  if (effectiveQrUri) {
    try {
      doc.addImage(effectiveQrUri, "PNG", qrX + 4.5, totalsY + 5.5, 19, 19);
    } catch (_) {}
  } else {
    // Subtle fallback box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(qrX + 4.5, totalsY + 5.5, 19, 19, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(37, 99, 235);
    doc.text("ATOMIC QR", qrX + qrW / 2, totalsY + 15, { align: "center" });
  }

  // Active clickable link over the QR
  try {
    doc.link(qrX, totalsY, qrW, 28, { url: onlineQuoteUrl });
  } catch (_) {}

  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.8);
  doc.setTextColor(37, 99, 235);
  doc.text("atomiccotizador.shop", qrX + qrW / 2, totalsY + 26.2, { align: "center" });

  currentY = totalsY + 31;

  // ═══════════════════════════════════════════════════
  // 8. FIRMA DEL ASESOR COMERCIAL (Celda B47 de Excel)
  // ═══════════════════════════════════════════════════
  const advisorUpper = (data.advisorName || "ANTHONY ÁVILA").trim().toUpperCase();
  const advisorPhone = (data.advisorPhone || "0999047979 / 0969043453").trim();

  // Signature line centered
  const sigLineY = currentY + 10;
  const sigCenterX = pageWidth / 2;

  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(sigCenterX - 35, sigLineY, sigCenterX + 35, sigLineY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(advisorUpper, sigCenterX, sigLineY + 4.5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("ASESOR TÉCNICO COMERCIAL", sigCenterX, sigLineY + 8.5, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("ATOMIC SOLUTIONS", sigCenterX, sigLineY + 12.5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Telf: ${advisorPhone} · Quito - Ecuador`, sigCenterX, sigLineY + 16.5, { align: "center" });

  // ═══════════════════════════════════════════════════
  // 9. PIE DE PÁGINA INSTITUCIONAL
  // ═══════════════════════════════════════════════════
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Documento emitido electrónicamente · ATOMIC SOLUTIONS · Validez y autenticidad verificable mediante código QR`,
    pageWidth / 2,
    pageHeight - 6,
    { align: "center" }
  );

  const safeClientName = (data.clientName || "Cliente").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
  const fileName = `${normalizedNumber}_${safeClientName}.pdf`;

  return {
    doc,
    fileName,
    blob: doc.output("blob"),
    dataUri: doc.output("datauristring"),
  };
}

function renderVectorLogo(doc: jsPDF, x: number, y: number) {
  // Red badge accent
  doc.setFillColor(220, 38, 38);
  doc.rect(x, y + 2, 3.5, 14, "F");

  // ATOMIC Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("ATOMIC", x + 6, y + 9);

  // SOLUTIONS Text
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text("SOLUTIONS", x + 38, y + 9);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("TECNOLOGÍA, ELECTRÓNICA & EQUIPAMIENTO EMPRESARIAL", x + 6, y + 14);
}
