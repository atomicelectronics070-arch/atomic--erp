const fs = require('fs');
const path = require('path');

function scanApp(dir, depth = 0) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      console.log(' '.repeat(depth * 2) + '[DIR]', f);
      scanApp(full, depth + 1);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js')) {
      console.log(' '.repeat(depth * 2) + '[FILE]', f);
    }
  }
}

console.log('=== ESTRUCTURA COMPLETA DE RUTAS EN SRC/APP ===');
scanApp(path.join(process.cwd(), 'src/app'));
