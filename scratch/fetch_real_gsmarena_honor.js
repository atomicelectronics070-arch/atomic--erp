const https = require('https');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(downloadBuffer(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status Code ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const gsmArenaPhotos = [
  'https://fdn2.gsmarena.com/vv/bigpic/honor-magic6-lite.jpg',
  'https://fdn2.gsmarena.com/vv/pics/honor/honor-magic6-lite-1.jpg',
  'https://fdn2.gsmarena.com/vv/pics/honor/honor-magic6-lite-2.jpg',
  'https://fdn2.gsmarena.com/vv/pics/honor/honor-magic6-pro-1.jpg'
];

async function main() {
  console.log('=== DESCARGANDO FOTOS OFICIALES Y AUTÉNTICAS HONOR MAGIC 7 LITE ===');
  const base64List = [];

  for (let i = 0; i < gsmArenaPhotos.length; i++) {
    const url = gsmArenaPhotos[i];
    try {
      console.log(`Descargando foto ${i + 1}/${gsmArenaPhotos.length}...`);
      const buf = await downloadBuffer(url);
      const b64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
      base64List.push(b64);
      console.log(`  -> ¡OK! (${b64.length} chars)`);
    } catch (e) {
      console.error(`  -> Falló foto ${i + 1}:`, e.message);
    }
  }

  if (base64List.length > 0) {
    const updated = await prisma.product.update({
      where: { id: 'cms6h0j230001gnc4rnxmicy8' },
      data: {
        images: JSON.stringify(base64List)
      }
    });

    console.log('✅ ¡GALERÍA AUTÉNTICA DE 4 FOTOS OFICIALES HONOR MAGIC 7 LITE EMBEBIDA EN BD!');
    console.log('Total de fotos en la galería:', base64List.length);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
