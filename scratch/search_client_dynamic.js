const fs = require('fs');
const path = require('path');

function searchFiles(dir, results = []) {
    const list = fs.readdirSync(dir);
    for (let file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!['node_modules', '.next', '.git'].includes(file)) {
                searchFiles(filePath, results);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes('"use client"') && content.includes('export const dynamic')) {
                results.push(filePath);
            }
        }
    }
    return results;
}

const matches = searchFiles('./src');
fs.writeFileSync('./scratch/search_client_dynamic.txt', matches.join('\n'));
console.log('Done');
