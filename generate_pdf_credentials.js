import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const desktopPath = 'C:\\Users\\SANTIAGO\\Desktop\\CREDENCIALES ATOMIC.pdf';

const doc = new PDFDocument({ margin: 40, size: 'A4' });
const writeStream = fs.createWriteStream(desktopPath);

doc.pipe(writeStream);

// Background
doc.rect(0, 0, doc.page.width, doc.page.height).fill('#050914');

// Border accent
doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
   .lineWidth(2)
   .stroke('#06B6D4');

// Header Title
doc.fillColor('#FFFFFF')
   .fontSize(22)
   .font('Helvetica-Bold')
   .text('ATOMIC INDUSTRIES - MATRIZ DE CREDENCIALES', 40, 50, { align: 'center' });

doc.fillColor('#06B6D4')
   .fontSize(11)
   .font('Helvetica-Bold')
   .text('SISTEMA MAESTRO DE ACCESO Y CUENTAS CORPORATIVAS FIJAS', 40, 80, { align: 'center' });

// Table Box
const startY = 120;
const tableWidth = doc.page.width - 80;

doc.rect(40, startY, tableWidth, 540)
   .fillAndStroke('#0F172A', '#1E293B');

// Table Headers
doc.rect(40, startY, tableWidth, 40)
   .fill('#0284C7');

doc.fillColor('#FFFFFF')
   .fontSize(10)
   .font('Helvetica-Bold');

doc.text('DEPARTAMENTO / ROL', 55, startY + 14);
doc.text('CORREO ELECTRÓNICO', 200, startY + 14);
doc.text('CONTRASEÑA FIJA', 370, startY + 14);
doc.text('ETIQUETA MATRIZ', 485, startY + 14);

// Data Rows
const accounts = [
  { role: 'ADMINISTRACIÓN CENTRAL', email: 'atomic@administrador.com', pass: 'Admin123@', tag: 'ADMIN_ROOT', color: '#EF4444' },
  { role: 'JEFE DE TECNOLOGÍA', email: 'atomic@techman.com', pass: 'Patynico2019', tag: 'TECH_LEAD', color: '#A855F7' },
  { role: 'JEFE DE SISTEMAS & IA', email: 'atomic@softman.com', pass: 'Blanca2026', tag: 'SYS_LEAD', color: '#06B6D4' },
  { role: 'COORDINACIÓN GENERAL', email: 'atomic@cordinacion.com', pass: 'Admin123@', tag: 'COORD_LEAD', color: '#F59E0B' },
  { role: 'DEPARTAMENTO MEDIA', email: 'atomic@media.com', pass: 'Admin123@', tag: 'MEDIA_LEAD', color: '#10B981' }
];

let rowY = startY + 40;

accounts.forEach((acc, i) => {
  if (i % 2 === 1) {
    doc.rect(40, rowY, tableWidth, 90).fill('#1E293B');
  }

  // Divider line
  doc.moveTo(40, rowY + 90).lineTo(40 + tableWidth, rowY + 90).strokeColor('#334155').stroke();

  // Content
  doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold');
  doc.text(acc.role, 55, rowY + 25);

  doc.fillColor('#94A3B8').fontSize(9).font('Helvetica');
  doc.text(acc.email, 200, rowY + 25);

  doc.fillColor('#10B981').fontSize(11).font('Helvetica-Bold');
  doc.text(acc.pass, 370, rowY + 25);

  doc.fillColor(acc.color).fontSize(9).font('Helvetica-Bold');
  doc.text(acc.tag, 485, rowY + 25);

  // Description / Subtitle
  doc.fillColor('#64748B').fontSize(8).font('Helvetica-Oblique');
  doc.text(`CUENTA CORPORATIVA CON INTELIGENCIA ARTIFICIAL INDIVIDUAL ASIGNADA`, 55, rowY + 50);

  rowY += 90;
});

// Footer Notice
doc.fillColor('#64748B')
   .fontSize(8)
   .font('Helvetica-Bold')
   .text('DOCUMENTO CONFIDENCIAL MAESTRO - GENERADO AUTOMÁTICAMENTE PARA LA ADMINISTRACIÓN DE ATOMIC INDUSTRIES', 40, 720, { align: 'center' });

doc.end();

writeStream.on('finish', () => {
  console.log('PDF CREDENCIALES ATOMIC.pdf generado exitosamente en el Escritorio.');
});
