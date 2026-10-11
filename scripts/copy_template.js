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

// Extract logo from Excel drawing layer
if (templateBuffer) {
  try {
    const unzipped = fflate.unzipSync(new Uint8Array(templateBuffer));
    const imgKey = Object.keys(unzipped).find(k => k.startsWith('xl/media/image1.') || k.startsWith('xl/media/'));
    if (imgKey && unzipped[imgKey]) {
      fs.writeFileSync(dstLogo, Buffer.from(unzipped[imgKey]));
      console.log('✅ [OK] Logo oficial extraído a ' + dstLogo);
    }
  } catch (err) {
    console.warn('⚠️ No se pudo extraer el logo automáticamente:', err.message);
  }
}
