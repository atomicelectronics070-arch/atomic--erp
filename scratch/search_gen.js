const fs = require('fs');
const path = require('path');

function searchFiles(dir, keyword, results = []) {
    const list = fs.readdirSync(dir);
    for (let file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!['node_modules', '.next', '.git'].includes(file)) {
                searchFiles(filePath, keyword, results);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes(keyword)) {
                results.push(filePath);
            }
        }
    }
    return results;
}

const matches = searchFiles('./src', 'generateStaticParams');
fs.writeFileSync('./scratch/search_results.txt', matches.join('\n'));
console.log('Done');
