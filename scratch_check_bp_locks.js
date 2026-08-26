const fs = require('fs');
const content = fs.readFileSync('src/app/web/cerraduras-smart/CerradurasSmartClient.tsx', 'utf8');

const lines = content.split('\n');
console.log('=== SEARCHING BP LOCKS IN CerradurasSmartClient.tsx ===');
lines.forEach((l, idx) => {
  if (l.includes('BANCO DEL PERNO') || l.includes('BP03') || l.includes('Voltex') || l.includes('Plasma') || l.includes('Hyperbolt') || l.includes('Ionsecure') || l.includes('Quantum') || l.includes('Nova')) {
    console.log(`${idx + 1}: ${l.trim()}`);
  }
});
