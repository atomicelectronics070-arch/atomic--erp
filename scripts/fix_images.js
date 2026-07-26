import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dir = path.join(process.cwd(), 'public', 'products', 'machines');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const updates = [
  {
    id: 'cmqx9xanz0003vmyeq1kttip6',
    images: [
      "https://image.made-in-china.com/202f0j00gUtWHKlcZDoA/Automatic-Concrete-Hollow-Solid-Interlocking-Paving-Block-Making-Brick-Machine-Qt10-15.webp",
      "https://image.made-in-china.com/202f0j00cUmWwHPEVDqR/Automatic-Concrete-Hollow-Solid-Interlocking-Paving-Block-Making-Brick-Machine-Qt10-15.webp",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2070"
    ]
  },
  {
    id: 'cmqx9xd990005vmyek4esv7ae',
    images: [
      "https://image.made-in-china.com/202f0j00EUtWKqvcJBoN/Eps-Sandwich-Wall-Panel-Machine-Fast-Installation-Solid-Wall-Panel.webp",
      "https://image.made-in-china.com/202f0j00UUtWMzvcRBoN/Eps-Sandwich-Wall-Panel-Machine-Fast-Installation-Solid-Wall-Panel.webp",
      "https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?auto=format&fit=crop&q=80&w=2070"
    ]
  },
  {
    id: 'cmqx9xf2d0007vmyeslp3y2sk',
    images: [
      "https://image.made-in-china.com/202f0j00SUtWKtvchNoR/Automatic-Concrete-Paving-Block-Machine-Qt4-15-.webp",
      "https://image.made-in-china.com/202f0j00OUsWGzvcVNoR/Automatic-Concrete-Paving-Block-Machine-Qt4-15-.webp"
    ]
  },
  {
    id: 'cmqx9xh4d0009vmyergrsu28p',
    images: [
      "https://image.made-in-china.com/202f0j00yEgUuKtcbiok/Qtj4-35-Small-Manual-Cement-Hollow-Solid-Brick-Making-Machine-for-Sale.webp",
      "https://image.made-in-china.com/202f0j00lUqWbQzMCnkf/Qtj4-35-Small-Manual-Cement-Hollow-Solid-Brick-Making-Machine-for-Sale.webp",
      "https://image.made-in-china.com/202f0j00aUwWvRbMaNkl/Qtj4-35-Small-Manual-Cement-Hollow-Solid-Brick-Making-Machine-for-Sale.webp"
    ]
  },
  {
    id: 'cmqx9xiux000bvmyeoz3zzcd0',
    images: [
      "https://image.made-in-china.com/202f0j00fUsWGqvcHNoR/Fully-Automatic-Concrete-Interlocking-Paver-Hollow-Cement-Block-Making-Machine.webp",
      "https://image.made-in-china.com/202f0j00zUtWMtvcfNoR/Fully-Automatic-Concrete-Interlocking-Paver-Hollow-Cement-Block-Making-Machine.webp"
    ]
  }
];

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return true;
  } catch (e) {
    console.error(`Error downloading ${url}:`, e);
    return false;
  }
}

async function main() {
  for (const update of updates) {
    const localPaths = [];
    let counter = 1;
    for (const url of update.images) {
      const ext = url.includes('.webp') ? '.webp' : '.jpg';
      const filename = `${update.id}_${counter}${ext}`;
      const filepath = path.join(dir, filename);
      
      console.log(`Downloading ${url} to ${filepath}`);
      const success = await downloadImage(url, filepath);
      
      if (success) {
        localPaths.push(`/products/machines/${filename}`);
      }
      counter++;
    }
    
    if (localPaths.length > 0) {
      await prisma.product.update({
        where: { id: update.id },
        data: {
          images: JSON.stringify(localPaths)
        }
      });
      console.log(`Updated ${update.id} with local paths.`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
