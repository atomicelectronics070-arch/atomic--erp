import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'enrichedLaptops.json');
const laptops = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

console.log(`Total laptops: ${laptops.length}`);
for (const laptop of laptops) {
  console.log(`Slug: ${laptop.slug} | Name: ${laptop.cleanName}`);
}
