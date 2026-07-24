const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src/app/web',
  'src/components/web',
  'src/app/shop',
  'src/components/shop'
];

const replacements = [
  { regex: /\bbg-white\b/g, replacement: 'bg-slate-900/50 backdrop-blur-xl border border-white/10' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-slate-950' },
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-slate-900/40 backdrop-blur-lg' },
  { regex: /\bbg-gray-200\b/g, replacement: 'bg-slate-800/50' },
  { regex: /\btext-black\b/g, replacement: 'text-slate-100' },
  { regex: /\btext-gray-900\b/g, replacement: 'text-slate-100' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-slate-200' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-slate-300' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-slate-400' },
  { regex: /\bshadow-md\b/g, replacement: 'shadow-[0_8px_32px_rgba(0,0,0,0.5)]' },
  { regex: /\bshadow-lg\b/g, replacement: 'shadow-[0_8px_32px_rgba(0,255,255,0.1)]' },
  { regex: /\bshadow-sm\b/g, replacement: 'shadow-[0_4px_16px_rgba(0,0,0,0.4)]' },
  { regex: /\bhover:shadow-lg\b/g, replacement: 'hover:shadow-[0_8px_32px_rgba(0,255,255,0.2)] hover:scale-105 transition-all duration-300' },
  { regex: /\bborder-gray-200\b/g, replacement: 'border-white/10' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-cyan-500/20' },
  { regex: /\bbg-blue-600\b/g, replacement: 'bg-blue-500 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all duration-300' },
  { regex: /\bbg-blue-500\b/g, replacement: 'bg-cyan-500 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all duration-300' },
  { regex: /\btext-blue-600\b/g, replacement: 'text-cyan-400' },
  { regex: /\btext-blue-500\b/g, replacement: 'text-cyan-300' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

const baseDir = __dirname;
for (const targetDir of targetDirs) {
  processDirectory(path.join(baseDir, targetDir));
}

console.log('Done!');
