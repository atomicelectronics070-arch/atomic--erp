const fs = require('fs');
const path = require('path');

const dir = 'scripts';
const files = fs.readdirSync(dir);

console.log("Searching for chromium.launch args in scripts:");
files.forEach(f => {
    if (f.endsWith('.js')) {
        const content = fs.readFileSync(path.join(dir, f), 'utf8');
        if (content.includes('chromium.launch')) {
            // Print surrounding lines
            const lines = content.split('\n');
            lines.forEach((line, i) => {
                if (line.includes('chromium.launch')) {
                    console.log(`- File: ${f} | Line ${i+1}: ${line.trim()}`);
                    if (lines[i+1]) console.log(`  Line ${i+2}: ${lines[i+1].trim()}`);
                    if (lines[i+2]) console.log(`  Line ${i+3}: ${lines[i+2].trim()}`);
                }
            });
        }
    }
});
