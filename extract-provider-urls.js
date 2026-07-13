const fs = require('fs');
const path = require('path');

const dir = 'scripts';
const files = fs.readdirSync(dir);

console.log("Analyzing scripts for URLs and provider names:");
files.forEach(f => {
    if (f.endsWith('.js') && f.startsWith('sync_')) {
        const content = fs.readFileSync(path.join(dir, f), 'utf8');
        
        // Find URLs in content
        const urls = content.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}[^\s'"`]*/g) || [];
        const providerMatches = content.match(/PROVIDER\s*=\s*['"`](.*?)['"`]/) || content.match(/provider\s*:\s*['"`](.*?)['"`]/);
        
        console.log(`- File: ${f}`);
        if (providerMatches) console.log(`  Provider: "${providerMatches[1]}"`);
        if (urls.length > 0) {
            console.log(`  Main URLs:`);
            urls.slice(0, 3).forEach(u => console.log(`    - ${u}`));
        }
    }
});
