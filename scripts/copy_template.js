const fs = require('fs');
const path = require('path');

const src = 'C:/Users/SANTIAGO/Downloads/PROP-09-71_Anthony_Ávila_..xlsx';
const dstDir = path.join(__dirname, '..', 'public', 'templates');
const dst = path.join(dstDir, 'quote_template_atomic.xlsx');

if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir, { recursive: true });
}

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dst);
  console.log('✅ [OK] Plantilla Excel copiada a ' + dst);
} else if (fs.existsSync(dst)) {
  console.log('✅ [OK] Plantilla Excel ya existe en ' + dst);
} else {
  console.error('❌ [ERROR] Archivo fuente en Downloads no encontrado: ' + src);
  process.exit(1);
}
