const fs = require('fs');

const desktopPath = 'C:\\Users\\SANTIAGO\\Desktop\\CREDENCIALES ATOMIC.pdf';

const pdfHeader = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 1200 >>
stream
BT
/F1 18 Tf
50 780 Td
(ATOMIC INDUSTRIES - MATRIZ DE CREDENCIALES) Tj
/F1 10 Tf
0 -25 Td
(TABLA CONFIDENCIAL DE CUENTAS CORPOATIVAS FIJAS CON IA INTEGRADA) Tj
0 -40 Td
(---------------------------------------------------------------------------------------------------------) Tj
0 -30 Td
( ROL / DEPARTAMENTO        | CORREO ELECTRONICO           | CONTRASE\xD1A     | ETIQUETA) Tj
0 -15 Td
(---------------------------------------------------------------------------------------------------------) Tj
0 -25 Td
( 1. ADMINISTRACION CENTRAL | atomic@administrador.com     | Admin123@     | ADMIN_ROOT) Tj
0 -25 Td
( 2. JEFE DE TECNOLOGIA     | atomic@techman.com           | Patynico2019  | TECH_LEAD) Tj
0 -25 Td
( 3. JEFE DE SISTEMAS & IA  | atomic@softman.com           | Blanca2026    | SYS_LEAD) Tj
0 -25 Td
( 4. COORDINACION GENERAL   | atomic@cordinacion.com       | Admin123@     | COORD_LEAD) Tj
0 -25 Td
( 5. DEPARTAMENTO MEDIA     | atomic@media.com             | Admin123@     | MEDIA_LEAD) Tj
0 -30 Td
(---------------------------------------------------------------------------------------------------------) Tj
0 -40 Td
(* CADA CUENTA TIENE SU ASISTENTE IA PERSONALIZADO Y MEMORIA EN BASE DE DATOS) Tj
0 -20 Td
(* EL ADMINISTRADOR TIENE ACCESO MAESTRO A LA MATRIZ DE DIALOGOS EN EL DASHBOARD) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000223 00000 n 
0000000290 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1550
%%EOF`;

fs.writeFileSync(desktopPath, pdfHeader, 'binary');
console.log('PDF generado exitosamente en el Escritorio.');
