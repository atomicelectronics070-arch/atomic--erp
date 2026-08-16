const fs = require('fs');
const path = require('path');

function checkLayouts(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      checkLayouts(full);
    } else if (f === 'layout.tsx' || f === 'layout.js') {
      console.log('LAYOUT FILE:', full);
      const content = fs.readFileSync(full, 'utf8');
      console.log(content.slice(0, 300));
      console.log('---');
    }
  }
}

checkLayouts(path.join(process.cwd(), 'src/app'));
