const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src/app/dashboard'),
  path.join(__dirname, 'src/components/dashboard')
];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replacements
  content = content.replace(/\bbg-white\b/g, 'bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,255,255,0.1)]');
  
  content = content.replace(/\btext-gray-900\b/g, 'text-slate-100');
  content = content.replace(/\btext-black\b/g, 'text-slate-100');
  content = content.replace(/\btext-gray-800\b/g, 'text-slate-200');
  content = content.replace(/\btext-gray-700\b/g, 'text-slate-300');
  content = content.replace(/\btext-gray-600\b/g, 'text-slate-400');
  content = content.replace(/\btext-gray-500\b/g, 'text-slate-400');
  
  content = content.replace(/\bbg-gray-50\b/g, 'bg-slate-950/50');
  content = content.replace(/\bbg-gray-100\b/g, 'bg-slate-900/40');
  content = content.replace(/\bbg-gray-200\b/g, 'bg-slate-800/50');
  
  content = content.replace(/\bborder-gray-200\b/g, 'border-white/10');
  content = content.replace(/\bborder-gray-300\b/g, 'border-white/20');
  
  // Remove standard shadows, we added a neon shadow to bg-white
  content = content.replace(/\bshadow-sm\b/g, '');
  content = content.replace(/\bshadow-md\b/g, '');
  content = content.replace(/\bshadow-lg\b/g, '');
  content = content.replace(/\bshadow-xl\b/g, '');
  // To avoid removing the specific shadow-[0_...] we just added, we only match word boundaries for standard shadows.
  // shadow without suffix might be matched by \bshadow\b
  content = content.replace(/\bshadow\b(?!-\[)/g, '');

  // Add interactive hover states to cards/buttons (rough heuristic: if it has hover:bg or rounded and padding, it might be a card/button)
  // We can just add transition to anything that had bg-white
  // But wait, the replacement for bg-white is long. We can just add the transition-all to where we replaced bg-white.
  content = content.replace(/bg-slate-900\/50 backdrop-blur-xl/g, 'bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,255,255,0.3)] hover:border-cyan-500/30');

  // Any extra padding spacing fixes can be ignored
  
  // Clean up extra spaces caused by empty replacements
  content = content.replace(/\s{2,}/g, ' ');
  content = content.replace(/className=" /g, 'className="');
  content = content.replace(/className=' /g, "className='");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

targetDirs.forEach(dir => processDirectory(dir));
console.log('Done replacing classes for Glassmorphism iOS 2026!');
