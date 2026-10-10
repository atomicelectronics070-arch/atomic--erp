const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const downloadsDir = 'C:/Users/SANTIAGO/Downloads';
const files = fs.readdirSync(downloadsDir);
const targetFile = files.find(f => f.startsWith('PROP') && f.endsWith('.xlsx'));
const xlsxPath = path.join(downloadsDir, targetFile);

const scratchDir = 'C:/Users/SANTIAGO/.gemini/antigravity/scratch';
const tempZip = path.join(scratchDir, 'temp_excel.zip');
const extractDir = path.join(scratchDir, 'excel_extracted');

if (fs.existsSync(extractDir)) {
  fs.rmSync(extractDir, { recursive: true, force: true });
}
fs.mkdirSync(extractDir, { recursive: true });

// Copy as .zip
fs.copyFileSync(xlsxPath, tempZip);

// Expand archive
execSync(`powershell -Command "Expand-Archive -Path '${tempZip.replace(/\\/g, '/')}' -DestinationPath '${extractDir.replace(/\\/g, '/')}' -Force"`);

console.log('--- ESTRUCTURA INTERNA DEL EXCEL (XLSX) ---');
function walk(dir) {
  const entries = fs.readdirSync(dir);
  for (const f of entries) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else {
      console.log(path.relative(extractDir, full).replace(/\\/g, '/'), `(${fs.statSync(full).size} bytes)`);
    }
  }
}
walk(extractDir);

// 1. Check media files
const mediaDir = path.join(extractDir, 'xl', 'media');
if (fs.existsSync(mediaDir)) {
  console.log('\n--- IMÁGENES / MEDIA (LOGOS / FOTOS) ---');
  fs.readdirSync(mediaDir).forEach(m => {
    console.log(`Media: ${m} (${fs.statSync(path.join(mediaDir, m)).size} bytes)`);
  });
} else {
  console.log('\nNo se encontró carpeta xl/media');
}

// 2. Check drawings XML
const drawingsDir = path.join(extractDir, 'xl', 'drawings');
if (fs.existsSync(drawingsDir)) {
  console.log('\n--- DRAWINGS XML (POSICIÓN DE IMÁGENES Y LOGOS) ---');
  fs.readdirSync(drawingsDir).forEach(d => {
    console.log(`Drawing: ${d}`);
    const content = fs.readFileSync(path.join(drawingsDir, d), 'utf-8');
    console.log(content.slice(0, 2000));
  });
}

// 3. Check styles XML
const stylesPath = path.join(extractDir, 'xl', 'styles.xml');
if (fs.existsSync(stylesPath)) {
  console.log('\n--- ESTILOS / COLORES / FUENTES (STYLES.XML) ---');
  const stylesXml = fs.readFileSync(stylesPath, 'utf-8');
  console.log(stylesXml.slice(0, 3000));
}

// 4. Shared Strings
const stringsPath = path.join(extractDir, 'xl', 'sharedStrings.xml');
if (fs.existsSync(stringsPath)) {
  console.log('\n--- CADENAS DE TEXTO (SHARED STRINGS) ---');
  const strXml = fs.readFileSync(stringsPath, 'utf-8');
  console.log(strXml.slice(0, 2500));
}
