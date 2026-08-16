const https = require('https');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(downloadBuffer(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status Code ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

// Authentic Honor Magic 7 Lite / Magic 6 Lite 5G product photo URLs
const honorPhotosUrls = [
  'https://fdn2.gsmarena.com/vv/bigpic/honor-magic6-lite.jpg',
  'https://m.media-amazon.com/images/I/61y8B84wHBL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/61N+V8dF-mL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71Y3iV3B7SL._AC_SL1500_.jpg'
];

async function main() {
  console.log('=== DESCARGANDO Y EMBEBIENDO GALERÍA AUTÉNTICA HONOR MAGIC 7 LITE 5G ===');
  const base64List = [];

  for (let i = 0; i < honorPhotosUrls.length; i++) {
    const url = honorPhotosUrls[i];
    try {
      console.log(`Descargando foto ${i + 1}/${honorPhotosUrls.length}: ${url}`);
      const buf = await downloadBuffer(url);
      const b64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
      base64List.push(b64);
      console.log(`  -> ¡Descargada y convertida! (Tamaño: ${b64.length} caracteres)`);
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

    console.log('✅ ¡GALERÍA AUTÉNTICA HONOR MAGIC 7 LITE 5G EMBEBIDA CON ÉXITO!');
    console.log('Total imágenes en la galería:', base64List.length);
  } else {
    console.error('No se pudo descargar ninguna foto.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
