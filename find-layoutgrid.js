const fs = require('fs');
const lines = fs.readFileSync('C:/Users/SANTIAGO/.gemini/antigravity/scratch/atomic--erp/src/app/dashboard/shop/page.tsx', 'utf8').split('\n');

lines.forEach((line, i) => {
  if (line.includes("LayoutGrid")) {
    console.log(`Line ${i+1}: ${line}`);
  }
});
