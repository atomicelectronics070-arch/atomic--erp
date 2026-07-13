const fs = require('fs');
const content = fs.readFileSync('src/app/web/PublicWebClient.tsx', 'utf8');

// Find all matches for navigation menu or category filtering
const lines = content.split('\n');
console.log("Analyzing category navigation in Client:");
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('category') && (line.toLowerCase().includes('menu') || line.toLowerCase().includes('nav') || line.toLowerCase().includes('map') || line.toLowerCase().includes('list'))) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
