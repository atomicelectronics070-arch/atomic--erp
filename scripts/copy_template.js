const fs = require('fs');
const path = require('path');
const fflate = require('fflate');

const src = 'C:/Users/SANTIAGO/Downloads/PROP-09-71_Anthony_Ávila_..xlsx';
const dstDir = path.join(__dirname, '..', 'public', 'templates');
const dst = path.join(dstDir, 'quote_template_atomic.xlsx');
const dstLogo = path.join(dstDir, 'atomic_quote_logo.png');

if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir, { recursive: true });
}

let templateBuffer = null;

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dst);
  templateBuffer = fs.readFileSync(src);
  console.log('✅ [OK] Plantilla Excel copiada a ' + dst);
} else if (fs.existsSync(dst)) {
  templateBuffer = fs.readFileSync(dst);
  console.log('✅ [OK] Plantilla Excel ya existe en ' + dst);
} else {
  console.error('❌ [ERROR] Archivo fuente en Downloads no encontrado: ' + src);
  process.exit(1);
}

// Use official ATOMIC brand mark for dstLogo
const realIcon = path.join(__dirname, '..', 'public', 'icon-192.png');
if (fs.existsSync(realIcon)) {
  fs.copyFileSync(realIcon, dstLogo);
  console.log('✅ [OK] Logo oficial ATOMIC icon-192 vinculado a ' + dstLogo);
}
