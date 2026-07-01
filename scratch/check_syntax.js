const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'dashboard', 'shop', 'page.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const stack = [];
let inString = null; // can be ", ', `, or null
let isEscaped = false;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    // Simple line and column tracking
    const linesBefore = content.slice(0, i).split('\n');
    const line = linesBefore.length;
    const col = linesBefore[linesBefore.length - 1].length + 1;

    if (isEscaped) {
        isEscaped = false;
        continue;
    }

    if (char === '\\') {
        isEscaped = true;
        continue;
    }

    // Handle strings (ignoring brackets inside strings)
    if (inString) {
        if (char === inString) {
            inString = null;
        }
        continue;
    }

    if (char === '"' || char === "'" || char === '`') {
        inString = char;
        continue;
    }

    // Handle comments (ignoring single line comments on their line)
    // For simplicity, we just look at brackets, but comments can have brackets.
    // Let's check for comment starts
    if (char === '/' && content[i + 1] === '/') {
        // Skip till end of line
        while (i < content.length && content[i] !== '\n') {
            i++;
        }
        continue;
    }
    if (char === '/' && content[i + 1] === '*') {
        // Skip till block comment end
        i += 2;
        while (i < content.length && !(content[i] === '*' && content[i + 1] === '/')) {
            i++;
        }
        i++;
        continue;
    }

    if (char === '(' || char === '{' || char === '[') {
        stack.push({ char, line, col, index: i });
    } else if (char === ')' || char === '}' || char === ']') {
        if (stack.length === 0) {
            console.log(`Unmatched closing character '${char}' at line ${line}, col ${col}`);
            continue;
        }
        const top = stack.pop();
        const matches = (top.char === '(' && char === ')') ||
                        (top.char === '{' && char === '}') ||
                        (top.char === '[' && char === ']');
        if (!matches) {
            console.log(`Mismatch: opened '${top.char}' at line ${top.line}, col ${top.col} but closed with '${char}' at line ${line}, col ${col}`);
            // Put it back to continue finding other errors if any
            stack.push(top);
        }
    }
}

if (stack.length > 0) {
    console.log(`Unclosed brackets at end of file:`);
    stack.forEach(item => {
        console.log(`  '${item.char}' at line ${item.line}, col ${item.col}`);
    });
} else {
    console.log("All brackets are balanced!");
}
