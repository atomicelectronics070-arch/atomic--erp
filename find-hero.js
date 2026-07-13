const fs = require('fs');
const content = fs.readFileSync('src/app/web/PublicWebClient.tsx', 'utf8');
const lines = content.split('\n');
console.log("Finding MinimalStoreHero in Client:");
lines.forEach((line, i) => {
    if (line.includes('function MinimalStoreHero') || line.includes('const MinimalStoreHero')) {
        console.log(`Line ${i + 1}: ${line}`);
    }
});
