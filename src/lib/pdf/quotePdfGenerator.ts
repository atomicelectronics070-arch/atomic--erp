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
  isAvailable?: boolean | string;
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

  // 1. Direct official brand icon
  try {
    const iconRes = await fetch("/icon-192.png");
    if (iconRes.ok) {
      const blob = await iconRes.blob();
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

  // 2. Fallback to API endpoint
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

  // Try to load the official company logo
  const logoBase64 = await fetchQuoteLogo();

  // ═══════════════════════════════════════════════════
  // 1. CABECERA: LOGO & MARCA ATOMIC + CÓDIGO PROFORMA
  // ═══════════════════════════════════════════════════
  const topY = 10;

  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", marginLeft, topY, 17, 17);
    } catch (e) {
      renderVectorAtomIcon(doc, marginLeft, topY);
    }
  } else {
    renderVectorAtomIcon(doc, marginLeft, topY);
  }

  // Official corporate typography next to the atom icon
  const brandTextX = marginLeft + 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // Dark Navy #0F172A
  doc.text("ATOMIC", brandTextX, topY + 5.5);

  const atomicW = doc.getTextWidth("ATOMIC");
  doc.setFontSize(11.5);
  doc.setTextColor(2, 108, 223); // Ticketmaster Blue #026CDF
  doc.text("SOLUTIONS", brandTextX + atomicW + 2, topY + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.setTextColor(51, 65, 85);
  doc.text("INGENIERÍA & SOLUCIONES TECNOLÓGICAS · ECUADOR", brandTextX, topY + 9.8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text("RUC: 1709540478001 · Matriz: Quito, Ecuador · Sector El Labrador (Av. Amazonas) · Cobertura Nacional", brandTextX, topY + 13.2);
  doc.text("Telf: 0999047979 / 0969043453 · info@atomiccotizador.shop · www.atomiccotizador.shop", brandTextX, topY + 16.3);

  // Badge Derecha: CÓDIGO DE COTIZACIÓN (Celda E1 de Excel)
  const badgeWidth = 52;
  const badgeHeight = 16;
  const badgeX = pageWidth - marginRight - badgeWidth;
  const badgeY = topY + 0.5;

  doc.setDrawColor(220, 38, 38); // #DC2626 Red
  doc.setLineWidth(0.6);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(220, 38, 38);
  doc.text("PROFORMA / COTIZACIÓN", badgeX + badgeWidth / 2, badgeY + 5, { align: "center" });

  doc.setFontSize(11.5);
  doc.setTextColor(220, 38, 38);
  doc.text(normalizedNumber, badgeX + badgeWidth / 2, badgeY + 12.2, { align: "center" });

  // ═══════════════════════════════════════════════════
  // 2. FECHA DE EMISIÓN
  // ═══════════════════════════════════════════════════
  const city = (data.clientCity || "Quito").trim().replace(/,.*/, "");
  const formattedDateStr = `${city} ${formatEcuadorDate(data.emissionDate)}`;

  let currentY = 32;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59); // Dark Slate #1E293B
  doc.text(formattedDateStr, marginLeft, currentY);

  // ═══════════════════════════════════════════════════
  // 3. DATOS DEL CLIENTE
  // ═══════════════════════════════════════════════════
  currentY += 3.5;
  const clientBoxH = 17;

  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(203, 213, 225); // #CBD5E1
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, currentY, contentWidth, clientBoxH, 1.5, 1.5, "FD");

  const clientNameUpper = (data.clientName || "CONSUMIDOR FINAL").trim().toUpperCase();
  const cedulaRuc = (data.clientCedula || data.clientRuc || "").trim();
  const phone = (data.clientPhone || "").trim();
  const addressCity = (data.deliveryAddress || data.clientCity || "Quito, Ecuador").trim();

  // Row 1 inside box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("NOMBRE:", marginLeft + 3.5, currentY + 5.8);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(clientNameUpper.substring(0, 48), marginLeft + 21, currentY + 5.8);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("•CI / •RUC:", marginLeft + 120, currentY + 5.8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(cedulaRuc || "Consumidor Final", marginLeft + 138, currentY + 5.8);

  // Row 2 inside box
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("NÚMERO DE CONTACTO:", marginLeft + 3.5, currentY + 12.8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(phone || "No especificado", marginLeft + 42, currentY + 12.8);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("CIUDAD / DIR:", marginLeft + 120, currentY + 12.8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(addressCity.substring(0, 26), marginLeft + 142, currentY + 12.8);

  currentY += clientBoxH + 3.5;

  // ═══════════════════════════════════════════════════
  // 4. RECUADRO CORPORATIVO: INTRODUCCIÓN A NUESTROS PRODUCTOS Y SERVICIOS
  // ═══════════════════════════════════════════════════
  const corporateBoxH = 17.5;
  doc.setFillColor(241, 245, 249); // Soft slate background #F1F5F9
  doc.setDrawColor(186, 230, 253); // Light sky border
  doc.setLineWidth(0.35);
  doc.roundedRect(marginLeft, currentY, contentWidth, corporateBoxH, 1.5, 1.5, "FD");

  // Accent vertical pill
  doc.setFillColor(2, 108, 223); // Brand blue accent
  doc.roundedRect(marginLeft, currentY, 2, corporateBoxH, 1, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(2, 108, 223);
  doc.text("ATOMIC SOLUTIONS · IMPORTACIÓN, DISTRIBUCIÓN & SOLUCIONES TECNOLÓGICAS INTEGRALES", marginLeft + 4.5, currentY + 4.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.4);
  doc.setTextColor(51, 65, 85);
  doc.text("• SEGURIDAD & CCTV IA: Cámaras IP/WiFi con analítica inteligente, reconocimiento facial y analítica perimetral (Dahua, Hikvision, EZVIZ, Uniview).", marginLeft + 4.5, currentY + 7.5);
  doc.text("• CONTROL DE ACCESOS & TRÁFICO: Barreras vehiculares automáticas Dítec, tótems de control, torniquetes peatonales y biometría ZKTeco.", marginLeft + 4.5, currentY + 10.5);
  doc.text("• SMART HOME & DOMÓTICA: Cerraduras biométricas 3D con apertura por app móvil, videoporteros multi-apartamento y hogares inteligentes.", marginLeft + 4.5, currentY + 13.5);
  doc.text("• ENERGÍA LIMPIA & REDES: Generadores eléctricos portátiles silenciosos LiFePO4 (Anker SOLIX), cableado estructurado, fibra óptica y servidores.", marginLeft + 4.5, currentY + 16.2);

  currentY += corporateBoxH + 3.5;

  // ═══════════════════════════════════════════════════
  // 5. ASUNTO DEL PROYECTO
  // ═══════════════════════════════════════════════════
  const subjectText = (data.quoteSubject || data.specs || "SUMINISTRO E INSTALACIÓN DE EQUIPOS").trim().toUpperCase();
  const subjectBoxH = 6.8;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(marginLeft, currentY, contentWidth, subjectBoxH, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("ASUNTO:", marginLeft + 3.5, currentY + 4.6);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(subjectText.substring(0, 96), marginLeft + 19, currentY + 4.6);

  currentY += subjectBoxH + 4;

  // ═══════════════════════════════════════════════════
  // 6. TABLA DE PRODUCTOS / ÍTEMS CON COLUMNA "DISPONIBLE"
  // Columnas: Item | Cant. | Descripción | Disponible | Sub-Total | Sub-Total 1
  // Anchos:   10   |  12   |    86       |     16     |    29     |     29    = 182mm
  // ═══════════════════════════════════════════════════
  const colWItem = 10;
  const colWQty = 12;
  const colWDesc = 86;
  const colWDisp = 16;
  const colWUnitPrice = 29;
  const colWTotal = 29;

  const colXItem = marginLeft;
  const colXQty = colXItem + colWItem;
  const colXDesc = colXQty + colWQty;
  const colXDisp = colXDesc + colWDesc;
  const colXUnitPrice = colXDisp + colWDisp;
  const colXTotal = colXUnitPrice + colWUnitPrice;

  const headerH = 7;

  // Header Background & Borders
  doc.setFillColor(226, 232, 240); // #E2E8F0 Excel Column Header Gray
  doc.setDrawColor(148, 163, 184); // #94A3B8 Border
  doc.setLineWidth(0.3);
  doc.rect(marginLeft, currentY, contentWidth, headerH, "FD");

  // Header vertical cell borders
  doc.line(colXQty, currentY, colXQty, currentY + headerH);
  doc.line(colXDesc, currentY, colXDesc, currentY + headerH);
  doc.line(colXDisp, currentY, colXDisp, currentY + headerH);
  doc.line(colXUnitPrice, currentY, colXUnitPrice, currentY + headerH);
  doc.line(colXTotal, currentY, colXTotal, currentY + headerH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Item", colXItem + colWItem / 2, currentY + 4.8, { align: "center" });
  doc.text("Cant.", colXQty + colWQty / 2, currentY + 4.8, { align: "center" });
  doc.text("Descripción", colXDesc + 3.5, currentY + 4.8);
  doc.text("Disponible", colXDisp + colWDisp / 2, currentY + 4.8, { align: "center" });
  doc.text("Sub-Total", colXUnitPrice + colWUnitPrice - 3.5, currentY + 4.8, { align: "right" });
  doc.text("Sub-Total 1", colXTotal + colWTotal - 3.5, currentY + 4.8, { align: "right" });

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

    // Format description lines
    const mainTitle = (item.name || item.description || "Producto / Servicio").trim();
    const splitLines = doc.splitTextToSize(mainTitle, colWDesc - 7);
    const rowHeight = Math.max(7.5, 4 + splitLines.length * 3.6);

    // Background fill (alternating clean white / soft slate)
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.25);
    doc.rect(marginLeft, currentY, contentWidth, rowHeight, "FD");

    // Vertical borders between cells
    doc.line(colXQty, currentY, colXQty, currentY + rowHeight);
    doc.line(colXDesc, currentY, colXDesc, currentY + rowHeight);
    doc.line(colXDisp, currentY, colXDisp, currentY + rowHeight);
    doc.line(colXUnitPrice, currentY, colXUnitPrice, currentY + rowHeight);
    doc.line(colXTotal, currentY, colXTotal, currentY + rowHeight);

    // 1. Col Item (Center)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${itemNum}`, colXItem + colWItem / 2, currentY + 5, { align: "center" });

    // 2. Col Cant (Center)
    doc.setFont("helvetica", "normal");
    doc.text(`${qty}`, colXQty + colWQty / 2, currentY + 5, { align: "center" });

    // 3. Col Descripción (Left multiline)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.4);
    doc.setTextColor(15, 23, 42);
    doc.text(splitLines[0] || "", colXDesc + 3.5, currentY + 4.8);

    if (splitLines.length > 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(51, 65, 85);
      for (let l = 1; l < splitLines.length; l++) {
        doc.text(splitLines[l], colXDesc + 3.5, currentY + 4.8 + (l * 3.4));
      }
    }

    // 4. Col Disponible (Center - "SÍ" con insignia verde corporativa)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(16, 185, 129); // Vibrant emerald green #10B981
    doc.text("SÍ", colXDisp + colWDisp / 2, currentY + 5, { align: "center" });

    // 5. Col Sub-Total (Unit price, Right)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`$ ${unitP.toFixed(2)}`, colXUnitPrice + colWUnitPrice - 3.5, currentY + 5, { align: "right" });

    // 6. Col Sub-Total 1 (Total, Right)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`$ ${lineTotal.toFixed(2)}`, colXTotal + colWTotal - 3.5, currentY + 5, { align: "right" });

    currentY += rowHeight;
  });

  currentY += 3.5;

  // ═══════════════════════════════════════════════════
  // 7. TOTALES (Celdas E32:E35) & CONDICIONES (A39:A43) CON ANTICIPO 70% & ENVÍOS
  // ═══════════════════════════════════════════════════
  const totalsBoxW = 66;
  const totalsBoxX = pageWidth - marginRight - totalsBoxW;
  const totalsY = currentY;
  const rowTotH = 6;

  // Calculos exactos matching Excel formulas
  const subtotalVal = Number(data.subtotal || data.total || 0);
  const discountVal = Number(data.discountAmount || 0);
  const taxableVal = Math.max(0, subtotalVal - discountVal);
  const taxVal = Number(data.taxAmount || (taxableVal * 0.15));
  const finalTotalVal = Number(data.total || (taxableVal + taxVal));

  // Totals Grid Container
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);

  // Row 1: DESCUENTO
  doc.setFillColor(255, 255, 255);
  doc.rect(totalsBoxX, totalsY, totalsBoxW, rowTotH, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("DESCUENTO:", totalsBoxX + 3.5, totalsY + 4.2);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(discountVal > 0 ? 220 : 71, discountVal > 0 ? 38 : 85, discountVal > 0 ? 38 : 105);
  doc.text(`$ ${discountVal.toFixed(2)}`, totalsBoxX + totalsBoxW - 3.5, totalsY + 4.2, { align: "right" });

  // Row 2: SUBTOTAL SIN IVA
  doc.setFillColor(248, 250, 252);
  doc.rect(totalsBoxX, totalsY + rowTotH, totalsBoxW, rowTotH, "FD");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("SUBTOTAL SIN IVA:", totalsBoxX + 3.5, totalsY + rowTotH + 4.2);
  doc.setFont("helvetica", "normal");
  doc.text(`$ ${subtotalVal.toFixed(2)}`, totalsBoxX + totalsBoxW - 3.5, totalsY + rowTotH + 4.2, { align: "right" });

  // Row 3: IVA 15%
  doc.setFillColor(255, 255, 255);
  doc.rect(totalsBoxX, totalsY + rowTotH * 2, totalsBoxW, rowTotH, "FD");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`IVA (${data.taxPercent || 15}%):`, totalsBoxX + 3.5, totalsY + rowTotH * 2 + 4.2);
  doc.setFont("helvetica", "normal");
  doc.text(`$ ${taxVal.toFixed(2)}`, totalsBoxX + totalsBoxW - 3.5, totalsY + rowTotH * 2 + 4.2, { align: "right" });

  // Row 4: TOTAL INC IVA - Highlighted row
  doc.setFillColor(241, 245, 249);
  doc.rect(totalsBoxX, totalsY + rowTotH * 3, totalsBoxW, rowTotH + 1.5, "FD");
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.rect(totalsBoxX, totalsY + rowTotH * 3, totalsBoxW, rowTotH + 1.5, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL INC IVA:", totalsBoxX + 3.5, totalsY + rowTotH * 3 + 5);

  doc.setFontSize(10.5);
  doc.setTextColor(220, 38, 38); // Highlighted Red total
  doc.text(`$ ${finalTotalVal.toFixed(2)}`, totalsBoxX + totalsBoxW - 3.5, totalsY + rowTotH * 3 + 5, { align: "right" });

  // ═══════════════════════════════════════════════════
  // CONDICIONES COMERCIALES (Izquierda) & QR (Centro)
  // ═══════════════════════════════════════════════════
  const conditionsBoxH = 29.5;
  const leftBlockW = totalsBoxX - marginLeft - 4; // 108mm
  const qrW = 27;
  const termsW = leftBlockW - qrW - 3; // 78mm
  const qrX = marginLeft + termsW + 3;

  // Commercial Terms (Left side)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, totalsY, termsW, conditionsBoxH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text("CONDICIONES COMERCIALES & PAGOS:", marginLeft + 3.5, totalsY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(71, 85, 105);
  doc.text("• Precios expresados en Dólares de los Estados Unidos (USD).", marginLeft + 3.5, totalsY + 8.5);

  // Anticipo del 70% solicitado
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text("• Forma de pago: Anticipo del 70%", marginLeft + 3.5, totalsY + 12.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(" para confirmación y despacho;", marginLeft + 44, totalsY + 12.5);
  doc.text("  saldo restante a acordar con el cliente contra entrega / instalación.", marginLeft + 3.5, totalsY + 16);

  // Envíos disponibles para Quito y ciudades
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("• Envíos & Cobertura:", marginLeft + 3.5, totalsY + 20);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(" Entregas directas en Quito y despachos diarios", marginLeft + 28, totalsY + 20);
  doc.text("  asegurados a todas las ciudades y provincias del país (Servientrega).", marginLeft + 3.5, totalsY + 23.5);

  doc.text(`• Validez de la oferta: ${data.validityDays || 15} días calendario · Stock sujeto a rotación.`, marginLeft + 3.5, totalsY + 27);

  // Scannable QR Code Box (Center side)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(qrX, totalsY, qrW, conditionsBoxH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(15, 23, 42);
  doc.text("VERIFICACIÓN QR", qrX + qrW / 2, totalsY + 4.2, { align: "center" });

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
      doc.addImage(effectiveQrUri, "PNG", qrX + 3.5, totalsY + 5.2, 20, 20);
    } catch (_) {}
  } else {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(qrX + 3.5, totalsY + 5.2, 20, 20, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(37, 99, 235);
    doc.text("ATOMIC QR", qrX + qrW / 2, totalsY + 15, { align: "center" });
  }

  try {
    doc.link(qrX, totalsY, qrW, conditionsBoxH, { url: onlineQuoteUrl });
  } catch (_) {}

  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.8);
  doc.setTextColor(37, 99, 235);
  doc.text("atomiccotizador.shop", qrX + qrW / 2, totalsY + 27.5, { align: "center" });

  currentY = totalsY + conditionsBoxH + 3.5;

  // ═══════════════════════════════════════════════════
  // 8. CLÁUSULA DE GARANTÍA, RESPALDO DE MARCA & RESOLUCIÓN TÉCNICA
  // ═══════════════════════════════════════════════════
  const warrantyBoxH = 14;
  doc.setFillColor(240, 253, 244); // Very soft emerald tint #F0FDF4
  doc.setDrawColor(187, 247, 208); // Light emerald border #BBF7D0
  doc.setLineWidth(0.35);
  doc.roundedRect(marginLeft, currentY, contentWidth, warrantyBoxH, 1.5, 1.5, "FD");

  // Accent vertical pill
  doc.setFillColor(16, 185, 129); // Emerald green
  doc.roundedRect(marginLeft, currentY, 2, warrantyBoxH, 1, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(4, 120, 87); // #047857 Dark Emerald
  doc.text("CLÁUSULA DE GARANTÍA OFICIAL DE FABRICANTE, MANO DE OBRA & SOPORTE TÉCNICO:", marginLeft + 4, currentY + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.4);
  doc.setTextColor(30, 41, 59);
  doc.text("• Como distribuidores autorizados, todos los equipos cuentan con garantía directa de fábrica y respaldo de cada marca en el Ecuador.", marginLeft + 4, currentY + 7.2);
  doc.text("• Brindamos garantía técnica integral sobre mano de obra, instalación y calibración profesional, asegurando inducción y capacitación completa al cliente.", marginLeft + 4, currentY + 10.1);
  doc.text("• Cobertura permanente de asistencia técnica, resolución ágil de incidencias y repuestos originales disponibles.", marginLeft + 4, currentY + 12.8);

  currentY += warrantyBoxH + 4;

  // ═══════════════════════════════════════════════════
  // 9. FIRMAS / RESPONSIVAS DOBLES:
  //    SANTIAGO GUZMÁN (GERENTE) & JUAN PABLO GUZMÁN (ASESOR COMERCIAL)
  // ═══════════════════════════════════════════════════
  const sigBoxW = (contentWidth - 14) / 2; // ~84mm each
  const sigXLeft = marginLeft;
  const sigXRight = marginLeft + sigBoxW + 14;
  const sigLineY = currentY + 8;

  // Firma 1: SANTIAGO GUZMÁN (Gerente General)
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.35);
  doc.line(sigXLeft + 8, sigLineY, sigXLeft + sigBoxW - 8, sigLineY);

  const sigCenterLeft = sigXLeft + sigBoxW / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text("SANTIAGO GUZMÁN", sigCenterLeft, sigLineY + 4.2, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(2, 108, 223); // Blue badge text
  doc.text("GERENTE GENERAL / DIRECCIÓN EJECUTIVA", sigCenterLeft, sigLineY + 7.8, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text("ATOMIC SOLUTIONS · RUC: 1709540478001", sigCenterLeft, sigLineY + 11.2, { align: "center" });
  doc.text("Quito, Ecuador · Sector El Labrador (Av. Amazonas)", sigCenterLeft, sigLineY + 14.5, { align: "center" });

  // Firma 2: JUAN PABLO GUZMÁN (Asesor Técnico Comercial)
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.35);
  doc.line(sigXRight + 8, sigLineY, sigXRight + sigBoxW - 8, sigLineY);

  const sigCenterRight = sigXRight + sigBoxW / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text("JUAN PABLO GUZMÁN", sigCenterRight, sigLineY + 4.2, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(220, 38, 38); // Red badge text
  doc.text("ASESOR TÉCNICO COMERCIAL / PROYECTOS", sigCenterRight, sigLineY + 7.8, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text("ATOMIC SOLUTIONS · DEPARTAMENTO COMERCIAL", sigCenterRight, sigLineY + 11.2, { align: "center" });
  doc.text("Telf: 0999047979 / 0969043453 · info@atomiccotizador.shop", sigCenterRight, sigLineY + 14.5, { align: "center" });

  // ═══════════════════════════════════════════════════
  // 10. PIE DE PÁGINA INSTITUCIONAL
  // ═══════════════════════════════════════════════════
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Documento emitido electrónicamente · ATOMIC SOLUTIONS (RUC: 1709540478001) · Sector El Labrador, Quito, Ecuador · Validez verificable mediante código QR`,
    pageWidth / 2,
    pageHeight - 5,
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

function renderVectorAtomIcon(doc: jsPDF, x: number, y: number) {
  const cx = x + 8.5;
  const cy = y + 8.5;

  // Outer orbital rings (Navy slate)
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);

  // Vertical ellipse
  doc.ellipse(cx, cy, 3.6, 7.8, "S");
  // Diagonal ellipse 1 (approximated with balanced radius)
  doc.ellipse(cx, cy, 7.4, 4.0, "S");

  // Center nucleus (Orange #EA580C)
  doc.setFillColor(234, 88, 12);
  doc.circle(cx, cy, 2.2, "F");
}

function renderVectorLogo(doc: jsPDF, x: number, y: number) {
  renderVectorAtomIcon(doc, x, y);
}
