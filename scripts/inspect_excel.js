const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const downloadsDir = 'C:/Users/SANTIAGO/Downloads';
const files = fs.readdirSync(downloadsDir);
const targetFile = files.find(f => f.startsWith('PROP') && f.endsWith('.xlsx'));

if (!targetFile) {
  console.error('No se encontró archivo PROP*.xlsx en Downloads. Archivos:', files.filter(f => f.endsWith('.xlsx')));
  process.exit(1);
}

const fullPath = path.join(downloadsDir, targetFile);
console.log('Archivo encontrado:', fullPath);
console.log('Tamaño:', fs.statSync(fullPath).size, 'bytes');

// 1. Leer con XLSX
const workbook = XLSX.readFile(fullPath, { cellStyles: true, cellFormula: true, cellHTML: true, cellDates: true });
console.log('\nHojas en el libro:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  console.log(`\n================ HOJA: ${sheetName} ================`);
  const sheet = workbook.Sheets[sheetName];
  const ref = sheet['!ref'];
  console.log('Rango (!ref):', ref);
  console.log('Columnas con ancho (!cols):', sheet['!cols']);
  console.log('Filas con altura (!rows):', sheet['!rows']);
  console.log('Celdas combinadas (!merges):', sheet['!merges']?.length || 0);
  if (sheet['!merges']) {
    console.log('Muestra de merges (primeros 15):', sheet['!merges'].slice(0, 15));
  }

  // Convertir a matriz / json para ver filas
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
  console.log(`\nTotal filas detectadas: ${data.length}`);
  
  for (let r = 0; r < Math.min(data.length, 60); r++) {
    const row = data[r];
    if (row && row.some(cell => cell !== undefined && cell !== '')) {
      const rowDisplay = row.map((c, i) => c !== undefined && c !== '' ? `[Col ${i} (${XLSX.utils.encode_col(i)}): ${c}]` : null).filter(Boolean).join(' | ');
      console.log(`Fila ${(r + 1).toString().padStart(2, '0')}: ${rowDisplay}`);
    } else {
      console.log(`Fila ${(r + 1).toString().padStart(2, '0')}: <VACÍA>`);
    }
  }
}
