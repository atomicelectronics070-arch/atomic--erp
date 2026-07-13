const fs = require('fs');
const path = require('path');

function searchInFiles(dir, regex) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        if (file === 'node_modules' || file === '.next' || file === '.git') return;
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            searchInFiles(filePath, regex);
        } else {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const matches = content.match(regex);
                if (matches) {
                    console.log(`Found in ${filePath}:`, matches);
                }
            } catch(e) {}
        }
    });
}

console.log('Searching for domains or URLs in atomic--erp...');
searchInFiles('C:\\Users\\SANTIAGO\\.gemini\\antigravity\\scratch\\atomic--erp', /https?:\/\/[a-zA-Z0-9.-]+\.(vercel\.app|com|ec|net)/gi);
