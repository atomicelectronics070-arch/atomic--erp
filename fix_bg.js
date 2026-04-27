const fs = require('fs');

function fixBg(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/className=\"min-h-screen bg-white/g, 'className=\"min-h-screen bg-transparent');
        content = content.replace(/className=\"min-h-screen bg-\[\#FAFAF8\]/g, 'className=\"min-h-screen bg-transparent');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed background in', filePath);
    }
}

fixBg('src/app/web/page.tsx');
fixBg('src/app/web/academy/page.tsx');
fixBg('src/app/web/cart/page.tsx');
fixBg('src/app/web/software/page.tsx');
