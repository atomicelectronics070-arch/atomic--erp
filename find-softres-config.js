const fs = require('fs');
const path = require('path');

function findFiles(dir, matchPattern) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            // Recurse into subdirectory
            results = results.concat(findFiles(filePath, matchPattern));
        } else {
            if (matchPattern.test(file)) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const dirPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\9f2fa25d-d389-41e8-b7aa-aaf567691c42';
console.log('Searching in:', dirPath);
try {
    const configFiles = findFiles(dirPath, /capacitor|config/i);
    console.log('Found config files:', configFiles);
    
    // If any config files found, print their content
    configFiles.forEach(file => {
        console.log(`\n--- CONTENT OF ${file} ---`);
        try {
            console.log(fs.readFileSync(file, 'utf8'));
        } catch(e) {
            console.error('Error reading file:', e.message);
        }
    });
} catch(e) {
    console.error('Error:', e.message);
}
