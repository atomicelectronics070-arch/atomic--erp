const fs = require('fs');
const path = require('path');

function searchInDir(dir, pattern) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'dist' || file === 'build') {
            continue;
        }
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            searchInDir(filePath, pattern);
        } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.json')) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.toLowerCase().includes(pattern.toLowerCase())) {
                console.log(`Found pattern in: ${filePath}`);
            }
        }
    }
}

console.log("Searching for 'tecnit'...");
searchInDir(__dirname, 'tecnit');

console.log("Searching for 'multitecnologia'...");
searchInDir(__dirname, 'multitecnologia');
