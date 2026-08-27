const fs = require('fs');
const path = require('path');

const downloadsDir = 'C:/Users/SANTIAGO/Downloads';
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');

const dirs = [
  'promociones', 'cercos', 'cargadores', 'repuestos', 'scooters',
  'bicicletas', 'consolas', 'luminarias', 'generadores', 'servidores',
  'software', 'videoporteros', 'camaras-espia', 'inversiones', 'contrataciones'
];

dirs.forEach(d => {
  const p = path.join(publicImagesDir, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

console.log('🔄 Sincronizando todas las imágenes y recursos de campañas...');

// Copy all WhatsApp images from 6:37 and 6:47 to public/images/lotes_nuevos
const targetLotes = path.join(publicImagesDir, 'lotes_nuevos');
if (!fs.existsSync(targetLotes)) fs.mkdirSync(targetLotes, { recursive: true });

const files = fs.readdirSync(downloadsDir);
const files637 = files.filter(f => f.includes('2026-08-27') && f.includes('6.37.')).sort();
const files647 = files.filter(f => f.includes('2026-08-27') && f.includes('6.47.')).sort();

files637.forEach((f, i) => {
  const num = String(i + 1).padStart(2, '0');
  fs.copyFileSync(path.join(downloadsDir, f), path.join(targetLotes, `foto_${num}.jpg`));
});

files647.forEach((f, i) => {
  const num = String(i + 1).padStart(2, '0');
  fs.copyFileSync(path.join(downloadsDir, f), path.join(targetLotes, `instruccion_${num}.jpg`));
});

console.log(`✅ ${files637.length + files647.length} archivos sincronizados en /public/images/lotes_nuevos.`);
