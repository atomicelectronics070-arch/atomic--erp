const fs = require('fs');
const content = fs.readFileSync('src/app/web/PublicWebClient.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('/api/web/products')) {
        console.log(`Line ${i + 1}: ${line}`);
    }
});
