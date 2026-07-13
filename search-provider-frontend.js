const fs = require('fs');
const content = fs.readFileSync('src/app/web/PublicWebClient.tsx', 'utf8');

console.log("Searching for provider in PublicWebClient.tsx:");
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('provider')) {
        console.log(`${i+1}: ${line.trim()}`);
    }
});
