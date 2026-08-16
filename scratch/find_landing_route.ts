import fs from 'fs';
import path from 'path';

function searchDir(dir: string, term: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath, term);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(term)) {
        console.log(`Found in: ${fullPath}`);
      }
    }
  }
}

searchDir('./src', 'BlockMachineLanding');
