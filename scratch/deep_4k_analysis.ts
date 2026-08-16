import fs from 'fs';
import path from 'path';

console.log('=== ATOMIC ERP 4K ARCHITECTURAL METRICS ANALYZER ===');

function countStats(dir: string, extensionList: string[]): { files: number, lines: number, bytes: number } {
  let files = 0;
  let lines = 0;
  let bytes = 0;

  if (!fs.existsSync(dir)) return { files, lines, bytes };

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = countStats(fullPath, extensionList);
      files += sub.files;
      lines += sub.lines;
      bytes += sub.bytes;
    } else if (extensionList.some(ext => entry.name.endsWith(ext))) {
      files++;
      const content = fs.readFileSync(fullPath, 'utf8');
      bytes += content.length;
      lines += content.split('\n').length;
    }
  }
  return { files, lines, bytes };
}

const srcStats = countStats(path.join(process.cwd(), 'src'), ['.ts', '.tsx']);
const apiStats = countStats(path.join(process.cwd(), 'src', 'app', 'api'), ['.ts']);
const componentsStats = countStats(path.join(process.cwd(), 'src', 'components'), ['.tsx']);
const libStats = countStats(path.join(process.cwd(), 'src', 'lib'), ['.ts']);

console.log('SRC Totals:', srcStats);
console.log('API Endpoints:', apiStats);
console.log('Components:', componentsStats);
console.log('Lib Modules:', libStats);
