const fs = require('fs');
const path = require('path');
const fflate = require('fflate');

const downloadsDir = 'C:/Users/SANTIAGO/Downloads';
const files = fs.readdirSync(downloadsDir);
const targetFile = files.find(f => f.startsWith('PROP') && f.endsWith('.xlsx'));

if (!targetFile) {
  console.error('No se encontró archivo PROP*.xlsx en Downloads');
  process.exit(1);
}

const sourcePath = path.join(downloadsDir, targetFile);
const destDir = path.join(__dirname, '..', 'src', 'templates');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
const destPath = path.join(destDir, 'quote_template_atomic.xlsx');

// Copy file
fs.copyFileSync(sourcePath, destPath);
console.log('✅ Plantilla copiada a:', destPath);
console.log('Tamaño:', fs.statSync(destPath).size, 'bytes');

// Unzip with fflate to inspect XML files
const fileBuffer = fs.readFileSync(destPath);
const unzipped = fflate.unzipSync(new Uint8Array(fileBuffer));

console.log('\n--- ARCHIVOS INTERNOS (fflate) ---');
Object.keys(unzipped).forEach(k => {
  console.log(`${k} (${unzipped[k].length} bytes)`);
});

// Check if image exists
const mediaFiles = Object.keys(unzipped).filter(k => k.startsWith('xl/media/'));
console.log('\n--- ARCHIVOS MULTIMEDIA / LOGO ---');
console.log(mediaFiles);

// Print sheet1.xml
const sheet1 = fflate.strFromU8(unzipped['xl/worksheets/sheet1.xml']);
console.log('\n--- MUESTRA DE SHEET1.XML (primeros 2500 caracteres) ---');
console.log(sheet1.slice(0, 2500));

// Check drawing1.xml
if (unzipped['xl/drawings/drawing1.xml']) {
  const drawing1 = fflate.strFromU8(unzipped['xl/drawings/drawing1.xml']);
  console.log('\n--- DRAWING1.XML (ANCLAJE DE LOGO) ---');
  console.log(drawing1.slice(0, 2000));
}
