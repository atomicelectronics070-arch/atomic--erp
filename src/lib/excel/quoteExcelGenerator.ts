import fs from "fs";
import path from "path";
import * as fflate from "fflate";

export interface QuoteExcelItem {
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
}

export interface QuoteExcelData {
  quoteNumber: string;
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
  items: QuoteExcelItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount?: number;
  total: number;
  emissionDate?: string;
}

function escapeXml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getTemplateBuffer(): Buffer {
  const localPath = path.join(process.cwd(), "public", "templates", "quote_template_atomic.xlsx");
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath);
  }

  const downloadPath = "C:\\Users\\SANTIAGO\\Downloads\\PROP-09-71_Anthony_Ávila_..xlsx";
  if (fs.existsSync(downloadPath)) {
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(downloadPath, localPath);
    return fs.readFileSync(localPath);
  }

  throw new Error(`Template Excel no encontrado en ${localPath} ni en ${downloadPath}`);
}

function getCellStyle(sheet: string, cellRef: string): string | null {
  const regex = new RegExp(`<c r="${cellRef}"([^>]*)>`, "i");
  const m = sheet.match(regex);
  if (m && m[1]) {
    const sMatch = m[1].match(/s="(\d+)"/i);
    if (sMatch) return sMatch[1];
  }
  return null;
}

function setInlineStringCell(sheet: string, cellRef: string, text: string, fallbackStyle?: string): string {
  const escaped = escapeXml(text);
  const regex = new RegExp(`<c r="${cellRef}"([^>]*)>(.*?)</c>|<c r="${cellRef}"([^>]*)/>`, "is");
  const existing = sheet.match(regex);
  let styleAttr = "";

  if (existing) {
    const attr = existing[1] || existing[3] || "";
    const sMatch = attr.match(/s="(\d+)"/i);
    const styleId = sMatch ? sMatch[1] : fallbackStyle;
    if (styleId) styleAttr = ` s="${styleId}"`;
    const newCell = `<c r="${cellRef}"${styleAttr} t="inlineStr"><is><t xml:space="preserve">${escaped}</t></is></c>`;
    return sheet.replace(regex, newCell);
  } else {
    const rowNum = cellRef.replace(/[A-Z]/gi, "");
    const rowRegex = new RegExp(`(<row r="${rowNum}"[^>]*>)(.*?)(</row>)`, "is");
    if (fallbackStyle) styleAttr = ` s="${fallbackStyle}"`;
    const newCell = `<c r="${cellRef}"${styleAttr} t="inlineStr"><is><t xml:space="preserve">${escaped}</t></is></c>`;
    if (rowRegex.test(sheet)) {
      return sheet.replace(rowRegex, `$1$2${newCell}$3`);
    }
  }
  return sheet;
}

function setNumericCell(sheet: string, cellRef: string, num: number, fallbackStyle?: string, decimals = 2): string {
  const regex = new RegExp(`<c r="${cellRef}"([^>]*)>(.*?)</c>|<c r="${cellRef}"([^>]*)/>`, "is");
  const existing = sheet.match(regex);
  let styleAttr = "";
  const valStr = decimals === 0 ? Math.round(num).toString() : num.toFixed(decimals);

  if (existing) {
    const attr = existing[1] || existing[3] || "";
    const sMatch = attr.match(/s="(\d+)"/i);
    const styleId = sMatch ? sMatch[1] : fallbackStyle;
    if (styleId) styleAttr = ` s="${styleId}"`;
    const newCell = `<c r="${cellRef}"${styleAttr}><v>${valStr}</v></c>`;
    return sheet.replace(regex, newCell);
  } else {
    const rowNum = cellRef.replace(/[A-Z]/gi, "");
    const rowRegex = new RegExp(`(<row r="${rowNum}"[^>]*>)(.*?)(</row>)`, "is");
    if (fallbackStyle) styleAttr = ` s="${fallbackStyle}"`;
    const newCell = `<c r="${cellRef}"${styleAttr}><v>${valStr}</v></c>`;
    if (rowRegex.test(sheet)) {
      return sheet.replace(rowRegex, `$1$2${newCell}$3`);
    }
  }
  return sheet;
}

function setFormulaCell(sheet: string, cellRef: string, formula: string, cachedValue: number, fallbackStyle?: string): string {
  const regex = new RegExp(`<c r="${cellRef}"([^>]*)>(.*?)</c>|<c r="${cellRef}"([^>]*)/>`, "is");
  const existing = sheet.match(regex);
  let styleAttr = "";
  const valStr = cachedValue.toFixed(2);

  if (existing) {
    const attr = existing[1] || existing[3] || "";
    const sMatch = attr.match(/s="(\d+)"/i);
    const styleId = sMatch ? sMatch[1] : fallbackStyle;
    if (styleId) styleAttr = ` s="${styleId}"`;
    const newCell = `<c r="${cellRef}"${styleAttr}><f>${formula}</f><v>${valStr}</v></c>`;
    return sheet.replace(regex, newCell);
  } else {
    const rowNum = cellRef.replace(/[A-Z]/gi, "");
    const rowRegex = new RegExp(`(<row r="${rowNum}"[^>]*>)(.*?)(</row>)`, "is");
    if (fallbackStyle) styleAttr = ` s="${fallbackStyle}"`;
    const newCell = `<c r="${cellRef}"${styleAttr}><f>${formula}</f><v>${valStr}</v></c>`;
    if (rowRegex.test(sheet)) {
      return sheet.replace(rowRegex, `$1$2${newCell}$3`);
    }
  }
  return sheet;
}

function clearCell(sheet: string, cellRef: string, fallbackStyle?: string): string {
  const regex = new RegExp(`<c r="${cellRef}"([^>]*)>(.*?)</c>|<c r="${cellRef}"([^>]*)/>`, "is");
  const existing = sheet.match(regex);
  if (existing) {
    const attr = existing[1] || existing[3] || "";
    const sMatch = attr.match(/s="(\d+)"/i);
    const styleId = sMatch ? sMatch[1] : fallbackStyle;
    const styleAttr = styleId ? ` s="${styleId}"` : "";
    return sheet.replace(regex, `<c r="${cellRef}"${styleAttr}/>`);
  }
  return sheet;
}

export function generateQuoteExcelBuffer(data: QuoteExcelData): Buffer {
  const templateBuf = getTemplateBuffer();
  const unzipped = fflate.unzipSync(new Uint8Array(templateBuf));

  const sheet1Key = "xl/worksheets/sheet1.xml";
  if (!unzipped[sheet1Key]) {
    throw new Error("Plantilla inválida: no contiene xl/worksheets/sheet1.xml");
  }

  let sheetXml = Buffer.from(unzipped[sheet1Key]).toString("utf-8");

  // Capturar estilos originales de la fila 15 (tabla de productos)
  const styleA = getCellStyle(sheetXml, "A15");
  const styleB = getCellStyle(sheetXml, "B15");
  const styleC = getCellStyle(sheetXml, "C15");
  const styleD = getCellStyle(sheetXml, "D15");
  const styleE = getCellStyle(sheetXml, "E15");

  // Capturar estilos de los totales
  const styleE32 = getCellStyle(sheetXml, "E32");
  const styleE33 = getCellStyle(sheetXml, "E33");
  const styleE34 = getCellStyle(sheetXml, "E34");
  const styleE35 = getCellStyle(sheetXml, "E35");

  // 1. Código de cotización en E1 (ej. PROP-09-71)
  const normQuoteNumber = data.quoteNumber.startsWith("PROP") 
    ? data.quoteNumber 
    : `PROP-${data.quoteNumber.replace(/^[A-Z]+-/, "")}`;
  sheetXml = setInlineStringCell(sheetXml, "E1", normQuoteNumber);

  // 2. Fecha en A5 (ej. "Quito Juv, 10 de Octubre .")
  const now = new Date();
  const days = ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"];
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const city = (data.clientCity || "Quito").trim();
  const dateStr = `${city} ${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} .`;
  sheetXml = setInlineStringCell(sheetXml, "A5", dateStr);

  // 3. Cliente en A7 (A7:C7 combinadas: "NOMBRE: ...")
  const clientNameUpper = (data.clientName || "CLIENTE").trim().toUpperCase();
  sheetXml = setInlineStringCell(sheetXml, "A7", `NOMBRE: ${clientNameUpper}`);

  // 4. CI / RUC en E7
  const cedulaRuc = (data.clientCedula || data.clientRuc || "").trim();
  if (cedulaRuc) {
    sheetXml = setInlineStringCell(sheetXml, "E7", cedulaRuc);
  }

  // 5. Contacto en A8
  const phone = (data.clientPhone || "099...").trim();
  sheetXml = setInlineStringCell(sheetXml, "A8", `NÚMERO DE CONTACTO: ${phone}`);

  // 6. Asunto en C12
  const subject = (data.quoteSubject || "SUMINISTRO E INSTALACIÓN DE EQUIPOS").trim().toUpperCase();
  sheetXml = setInlineStringCell(sheetXml, "C12", subject);

  // 7. Detalle de Ítems (Filas 15 a 30)
  const maxRows = 30;
  const startRow = 15;
  const items = data.items || [];

  items.forEach((item, idx) => {
    const row = startRow + idx;
    if (row <= maxRows) {
      // Col A: Ítem index (1, 2, 3...)
      sheetXml = setNumericCell(sheetXml, `A${row}`, idx + 1, styleA || undefined, 0);

      // Col B: Cantidad
      sheetXml = setNumericCell(sheetXml, `B${row}`, item.quantity, styleB || undefined, 0);

      // Col C: Descripción con saltos de línea / viñetas
      const desc = (item.description || item.name || "").trim();
      sheetXml = setInlineStringCell(sheetXml, `C${row}`, desc, styleC || undefined);

      // Col D: Precio unitario
      sheetXml = setNumericCell(sheetXml, `D${row}`, item.unitPrice, styleD || undefined, 2);

      // Col E: Total línea (=B*D)
      const lineTotal = item.total !== undefined ? item.total : (item.quantity * item.unitPrice);
      sheetXml = setFormulaCell(sheetXml, `E${row}`, `B${row}*D${row}`, lineTotal, styleE || undefined);
    }
  });

  // Limpiar filas no utilizadas de la plantilla (de 15 + items.length a 30)
  for (let r = startRow + items.length; r <= maxRows; r++) {
    sheetXml = clearCell(sheetXml, `A${r}`, styleA || undefined);
    sheetXml = clearCell(sheetXml, `B${r}`, styleB || undefined);
    sheetXml = clearCell(sheetXml, `C${r}`, styleC || undefined);
    sheetXml = clearCell(sheetXml, `D${r}`, styleD || undefined);
    sheetXml = clearCell(sheetXml, `E${r}`, styleE || undefined);
  }

  // 8. Totales (E32: Descuento, E33: Subtotal Sin IVA, E34: IVA 15%, E35: TOTAL INC IVA)
  const discountVal = Number(data.discountAmount || 0);
  const subtotalVal = Number(data.subtotal || 0);
  const taxVal = Number(data.taxAmount || (subtotalVal - discountVal) * 0.15);
  const totalVal = Number(data.total || (subtotalVal - discountVal + taxVal));

  sheetXml = setNumericCell(sheetXml, "E32", discountVal, styleE32 || undefined, 2);
  sheetXml = setFormulaCell(sheetXml, "E33", "SUM(E15:E30)", subtotalVal, styleE33 || undefined);
  sheetXml = setFormulaCell(sheetXml, "E34", "E33*0.15", taxVal, styleE34 || undefined);
  sheetXml = setFormulaCell(sheetXml, "E35", "E33+E34-E32", totalVal, styleE35 || undefined);

  // 9. Firma del Asesor en B47
  const advisor = (data.advisorName || "ASESOR ATOMIC").trim().toUpperCase();
  sheetXml = setInlineStringCell(sheetXml, "B47", advisor);

  // Guardar XML de hoja actualizado
  unzipped[sheet1Key] = new Uint8Array(Buffer.from(sheetXml, "utf-8"));

  // 10. Actualizar ocurrencias en sharedStrings.xml si existe
  const sstKey = "xl/sharedStrings.xml";
  if (unzipped[sstKey]) {
    let sstXml = Buffer.from(unzipped[sstKey]).toString("utf-8");
    sstXml = sstXml.replace(/PROP-09-71/g, normQuoteNumber);
    sstXml = sstXml.replace(/Anthony Ávila/g, advisor);
    sstXml = sstXml.replace(/ANTHONY ÁVILA/g, advisor);
    unzipped[sstKey] = new Uint8Array(Buffer.from(sstXml, "utf-8"));
  }

  // Re-empaquetar zip completo manteniendo la capa de dibujo, imágenes y logo en A1:D4 intactos
  const zipped = fflate.zipSync(unzipped, { level: 6 });
  return Buffer.from(zipped);
}
