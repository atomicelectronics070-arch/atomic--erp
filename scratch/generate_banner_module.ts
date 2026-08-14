import fs from 'fs';
import path from 'path';

function buildBannerDataModule() {
  const dir = path.join(__dirname, '../public/web-banners');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  const bannerMap: Record<string, string> = {};

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    const mime = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
    bannerMap[file] = `data:${mime};base64,${base64}`;
  });

  const content = `// Auto-generated banner data module for 100% fail-proof image rendering
export const BANNER_IMAGES: Record<string, string> = ${JSON.stringify(bannerMap, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, '../src/lib/banner-data.ts'), content);
  console.log(`Successfully generated src/lib/banner-data.ts with ${Object.keys(bannerMap).length} inline base64 banners.`);
}

buildBannerDataModule();
