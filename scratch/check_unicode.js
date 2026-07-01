const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, '..', 'src', 'app', 'dashboard', 'shop', 'page.tsx'),
    path.join(__dirname, '..', 'src', 'components', 'shop', 'PriceListManager.tsx')
];

const unicodeRegex = /\\u[0-9a-fA-F]{4}/g;

files.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log(`File not found: ${file}`);
        return;
    }
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(unicodeRegex);
    if (matches) {
        console.log(`Found ${matches.length} unicode sequences in ${path.basename(file)}:`);
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            const lineMatches = line.match(unicodeRegex);
            if (lineMatches) {
                console.log(`  Line ${index + 1}: ${line.trim()}`);
            }
        });
    } else {
        console.log(`No unicode escape sequences found in ${path.basename(file)}.`);
    }
});
