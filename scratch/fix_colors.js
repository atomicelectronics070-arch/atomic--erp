const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'src/app/dashboard');
const tomato = /#E8341A/g;
const blue = '#2563EB';

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('#E8341A')) {
                console.log(`Replacing in ${fullPath}`);
                content = content.replace(tomato, blue);
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

walk(targetDir);
console.log('Finished mass replacement of tomato color.');
