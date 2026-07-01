const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'dashboard', 'shop', 'page.tsx');
const program = ts.createProgram([filePath], { 
    noEmit: true,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
    moduleResolution: ts.ModuleResolutionKind.Node10
});

const diagnostics = ts.getPreEmitDiagnostics(program);

console.log(`Found ${diagnostics.length} diagnostics:`);
diagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`Error ${diagnostic.code} at ${diagnostic.file.fileName} (${line + 1},${character + 1}):`);
        console.log(`  ${message}`);
        
        // Print context
        const lines = diagnostic.file.text.split('\n');
        const startLine = Math.max(0, line - 2);
        const endLine = Math.min(lines.length - 1, line + 2);
        for (let l = startLine; l <= endLine; l++) {
            const prefix = l === line ? '>> ' : '   ';
            console.log(`${prefix}${l + 1}: ${lines[l]}`);
        }
        console.log('------------------------------------');
    } else {
        console.log(`Error ${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
    }
});
