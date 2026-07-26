import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'enrichedLaptops.json');
const laptops = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

for (const l of laptops) {
  if (!l.features?.hero?.title || !l.features?.cpu?.title || !l.features?.gpu?.title || !l.features?.display?.title || !l.features?.connectivity?.title) {
    console.log(`❌ Laptop missing features: ${l.slug}`);
  }
}
console.log("Check complete.");
