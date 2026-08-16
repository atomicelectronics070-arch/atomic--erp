const fs = require('fs');
const path = require('path');

function searchAllFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchAllFiles(full);
    } else {
      try {
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('TODOS LOS ARTÍCULOS') || content.includes('OFERTAS 🔥') || content.includes('LANDING PAGES')) {
          console.log('MATCH FOUND IN FILE:', full);
        }
      } catch (e) {}
    }
  }
}

console.log('=== SEARCHING ENTIRE REPOSITORY FOR UGLY THEME SOURCE ===');
searchAllFiles(process.cwd());
