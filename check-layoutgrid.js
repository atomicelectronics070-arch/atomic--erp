const fs = require('fs');
const content = fs.readFileSync('C:/Users/SANTIAGO/.gemini/antigravity/scratch/atomic--erp/src/app/dashboard/shop/page.tsx', 'utf8');

console.log("Is LayoutGrid used?", content.includes("LayoutGrid"));
console.log("Is grid view toggling present?", content.includes("grid") || content.includes("card"));
