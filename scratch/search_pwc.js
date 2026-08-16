const fs = require('fs');
const content = fs.readFileSync('src/app/web/PublicWebClient.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('CATEGORIAS') || line.includes('LANDING PAGES') || line.includes('OFERTAS') || line.includes('categoryGridItems')) {
    console.log(`L${idx + 1}: ${line}`);
  }
});
