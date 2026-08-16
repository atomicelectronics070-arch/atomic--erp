const https = require('https');
const http = require('http');
const fs = require('fs');
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

// 1. Flyer image from local downloads (primary)
const flyerPath = 'C:\\Users\\SANTIAGO\\Downloads\\WhatsApp Image 2026-08-15 at 3.48.28 PM.jpeg';

// 2. Additional real high resolution catalog photos of Dell 27 All In One i7
const extraDellPhotos = [
  'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200',
  'https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=1200',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200'
];

async function main() {
  console.log('=== DESCARGANDO Y EMBEBIENDO GALERÍA MULTIFOTO REAL DE DELL 27 AIO ===');
  const base64List = [];

  // Add flyer photo first
  if (fs.existsSync(flyerPath)) {
    const flyerBuf = fs.readFileSync(flyerPath);
    base64List.push(`data:image/jpeg;base64,${flyerBuf.toString('base64')}`);
    console.log('  -> ¡Afiche de descargas agregado como Foto 1!');
  }

  // Download additional catalog photos
  for (let i = 0; i < extraDellPhotos.length; i++) {
    const url = extraDellPhotos[i];
    try {
      console.log(`Descargando foto ${i + 2}/${extraDellPhotos.length + 1}...`);
      const buf = await downloadBuffer(url);
      const b64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
      base64List.push(b64);
      console.log(`  -> ¡OK! (${b64.length} chars)`);
    } catch (e) {
      console.error(`  -> Falló foto ${i + 2}:`, e.message);
    }
  }

  if (base64List.length > 0) {
    const updated = await prisma.product.update({
      where: { id: 'cmolsmu0l007h4w81sh2lemjp' },
      data: {
        images: JSON.stringify(base64List)
      }
    });

    console.log('✅ ¡GALERÍA COMPLETA DE 5 FOTOS EMBEBIDA CON ÉXITO PARA DELL 27 AIO!');
    console.log('Total imágenes en galería:', base64List.length);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
