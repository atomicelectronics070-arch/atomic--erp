import jsPDF from "jspdf";

export interface ContractData {
  advisorName: string;
  advisorEmail?: string;
  advisorPhone?: string;
  advisorCedula?: string;
  advisorCity?: string;
  modality: "FIJO_30_DIAS" | "FREELANCE";
  categoryName?: string;
  roleTitle?: string;
  baseSalary?: number;
  commissionRate?: string;
  billingCycle?: "Semanal" | "Quincenal" | "Mensual";
  bonuses?: string[];
  startDate?: string;
}

export async function generateAtomicContractPDF(data: ContractData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const dateStr = data.startDate || new Date().toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── 1. ENCABEZADO CORPORATIVO ATOMIC ───────────────────────────────────
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 40, "F");

  // Cyan Neon Accent Line
  doc.setFillColor(6, 182, 212); // Cyan 500
  doc.rect(0, 40, pageWidth, 2.5, "F");

  // ATOMIC Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("ATOMIC", 16, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("ECOSISTEMA DE INNOVACIÓN & COMERCIO TECNOLÓGICO", 16, 26);
  doc.text("RUC: 1792458921001 • Quito, Ecuador • www.atomic.shop", 16, 32);

  // Contract Badge (Top Right)
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - 85, 12, 70, 18, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248); // Cyan 400
  const contractBadgeText = data.modality === "FIJO_30_DIAS" 
    ? "CONTRATO PLAN 30 DÍAS" 
    : "CONTRATO FREELANCE";
  doc.text(contractBadgeText, pageWidth - 80, 20);
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Emisión: ${dateStr}`, pageWidth - 80, 26);

  let currentY = 52;

  // ── 2. TÍTULO DEL CONTRATO ─────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  const titleText = data.modality === "FIJO_30_DIAS"
    ? "ACUERDO LABORAL Y COMPROMISO DE RENDIMIENTO (PLAN 30 DÍAS)"
    : "CONTRATO MERCANTIL DE COMISIÓN MERCANTIL Y ASESORÍA FREELANCE";
  doc.text(titleText, 16, currentY);
  currentY += 8;

  // ── 3. DATOS DE LAS PARTES ─────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, currentY, pageWidth - 32, 28, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, currentY, pageWidth - 32, 28, 3, 3, "D");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("DATOS DEL ASESOR CONTRATADO:", 20, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.text(`Colaborador: ${data.advisorName}`, 20, currentY + 13);
  doc.text(`Cédula / ID: ${data.advisorCedula || "Registrado en expediente"}`, 20, currentY + 19);
  doc.text(`Ciudad: ${data.advisorCity || "Ecuador"}`, 20, currentY + 25);

  doc.text(`Cargo / Rol: ${data.roleTitle || "Asesor Comercial de Ventas"}`, 110, currentY + 13);
  doc.text(`Categoría: ${data.categoryName || "General Ecosistema"}`, 110, currentY + 19);
  doc.text(`Teléfono: ${data.advisorPhone || "Registrado en CRM"}`, 110, currentY + 25);

  currentY += 36;

  // ── 4. CLÁUSULAS ESPECÍFICAS SEGÚN MODALIDAD ───────────────────────────
  if (data.modality === "FIJO_30_DIAS") {
    // PLAN 30 DÍAS
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("CLÁUSULA PRIMERA: OBJETO DEL PLAN 30 DÍAS Y REMUNERACIÓN", 16, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const p1 = "El presente acuerdo vincula al Colaborador a un periodo formal de evaluación continua de treinta (30) días calendario. La remuneración convenida para este primer mes es de CIEN DÓLARES AMERICANOS ($100.00 USD), con una dedicación máxima requerida de dos (2) horas diarias. Al culminar satisfactoriamente el ciclo, el Colaborador escalará a $200.00 USD en el segundo mes, $450.00 USD en el tercer mes, y mantendrá contrato indefinido con sueldo base de $450.00 USD más comisiones y bonos desde el cuarto mes.";
    const splitP1 = doc.splitTextToSize(p1, pageWidth - 32);
    doc.text(splitP1, 16, currentY);
    currentY += splitP1.length * 4.5 + 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("CLÁUSULA SEGUNDA: LAS SIETE (7) ACTIVIDADES ORDINARIAS DIARIAS", 16, currentY);
    currentY += 6;

    const activities = [
      "1. Publicaciones Marketplace: Realizar mínimo cinco (5) publicaciones diarias con imágenes y material provisto por ATOMIC.",
      "2. Grupos de Compra/Venta: Compartir y publicar en al menos tres (3) grupos comerciales de WhatsApp / Facebook.",
      "3. Prospección Telefónica: Conseguir y registrar en la plataforma diez (10) números de clientes potenciales interesados.",
      "4. Videollamadas Zoom: Coordinar y grabar siete (7) llamadas demostrativas de asesoría al cliente durante el mes.",
      "5. Seguimiento a Cotizaciones: Recontactar diariamente a prospectos que tengan proformas generadas pendientes de cierre.",
      "6. Campañas Semanales: Difusión de promociones especiales los días lunes y miércoles según catálogo vigente.",
      "7. Estados de WhatsApp: Publicar estados comerciales de alta conversión al menos dos (2) veces por semana."
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    activities.forEach(act => {
      const splitAct = doc.splitTextToSize(act, pageWidth - 34);
      doc.text(splitAct, 18, currentY);
      currentY += splitAct.length * 4 + 1.5;
    });

    currentY += 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("CLÁUSULA TERCERA: SISTEMA DE DOBLE EVIDENCIA", 16, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const p3 = "Para la validación del cumplimiento diario y acreditación de la remuneración, el Colaborador se compromete a presentar doble respaldo: 1) Capturas de pantalla enviadas al grupo oficial de WhatsApp antes de las 20h00, y 2) Carga de bitácora en la plataforma digital ATOMIC ERP.";
    const splitP3 = doc.splitTextToSize(p3, pageWidth - 32);
    doc.text(splitP3, 16, currentY);
    currentY += splitP3.length * 4.5 + 4;

  } else {
    // FREELANCE / BAJO COMISIÓN
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("CLÁUSULA PRIMERA: MODALIDAD MERCANTIL BAJO COMISIÓN", 16, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const pf1 = "El Asesor Comercial desempeñará su gestión en calidad de comisionista independiente mercantil. Percibirá comisiones directas que oscilan entre el 5% y el 20% sobre el margen o valor facturado de cada producto comercializado (cámaras de seguridad, scooters, luminarias, cercos eléctricos, software ERP, etc.).";
    const splitPf1 = doc.splitTextToSize(pf1, pageWidth - 32);
    doc.text(splitPf1, 16, currentY);
    currentY += splitPf1.length * 4.5 + 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("CLÁUSULA SEGUNDA: REGLAS DE ORO DE VIGENCIA", 16, currentY);
    currentY += 6;

    const rules = [
      "1. Asistencia Activa: Participar e interactuar en el grupo comercial de WhatsApp de ATOMIC más de cuatro (4) veces por semana.",
      "2. Evidencias de Difusión: Subir semanalmente al menos una captura de pantalla de post publicitario realizado.",
      "3. Mantenimiento de Membresía: Concretar un mínimo de una (1) venta cerrada cada tres (3) meses para mantener activo su catálogo con precios de distribuidor."
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    rules.forEach(r => {
      const splitR = doc.splitTextToSize(r, pageWidth - 34);
      doc.text(splitR, 18, currentY);
      currentY += splitR.length * 4 + 2;
    });

    currentY += 4;
  }

  // ── 5. BONIFICACIONES HABILITADAS ───────────────────────────────────────
  if (data.bonuses && data.bonuses.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("BENEFICIOS Y BONOS APLICABLES:", 16, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129); // Emerald 600
    data.bonuses.forEach(b => {
      doc.text(`✔ ${b}`, 20, currentY);
      currentY += 4.5;
    });
    currentY += 3;
  }

  // ── 6. SECCIÓN DE FIRMAS ───────────────────────────────────────────────
  const signY = pageHeight - 42;
  doc.setDrawColor(203, 213, 225);
  doc.line(20, signY, 85, signY);
  doc.line(pageWidth - 85, signY, pageWidth - 20, signY);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("POR: ATOMIC ECUADOR", 20, signY + 5);
  doc.text("EL COLABORADOR / ASESOR", pageWidth - 85, signY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Dirección General & Coordinación", 20, signY + 9);
  doc.text(data.advisorName, pageWidth - 85, signY + 9);
  doc.text("RUC: 1792458921001", 20, signY + 13);
  doc.text(`C.I. ${data.advisorCedula || "Documento Verificado"}`, pageWidth - 85, signY + 13);

  // Footer text
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Documento Oficial de Vinculación Comercial • ATOMIC ERP Plataforma Jurídica Digital", pageWidth / 2, pageHeight - 8, { align: "center" });

  return doc;
}

export function downloadAtomicContractPDF(data: ContractData) {
  generateAtomicContractPDF(data).then(doc => {
    const filename = `CONTRATO_ATOMIC_${data.advisorName.replace(/\s+/g, '_')}_${data.modality}.pdf`;
    doc.save(filename);
  });
}

export function getWhatsAppContractLink(data: ContractData): string {
  const phoneDigits = (data.advisorPhone || "").replace(/\D/g, "");
  const modalityLabel = data.modality === "FIJO_30_DIAS" 
    ? "Plan 30 Días (Remuneración $100 -> $450 con 7 actividades diarias)" 
    : "Bajo Comisión Freelance";
  const message = `Hola ${data.advisorName}, de parte de la Coordinación de ATOMIC te hacemos entrega oficial de tu Contrato Laboral (${modalityLabel}). Por favor descárgalo, revísalo y confirma su recepción. ¡Bienvenido a nuestro equipo comercial!`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}
