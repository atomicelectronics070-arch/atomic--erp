const fs = require('fs');
const path = require('path');

function searchRepository(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === '.next') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchRepository(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('TABLETS NIÑOS') || content.includes('Edición Kids') || content.includes('Cables & Micro')) {
        console.log('MATCH FOUND IN FILE:', full);
      }
    }
  }
}

console.log('=== SEARCHING ENTIRE REPOSITORY FOR EXACT MATCHING UI ===');
searchRepository(process.cwd());
