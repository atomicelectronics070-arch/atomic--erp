const https = require('https');
const http = require('http');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Download helper
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(downloadImage(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image: status code ${res.statusCode}`));
      }
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== CORRIGIENDO IMÁGENES DEL HONOR MAGIC 7 LITE ===');
  
  // High quality open product photo for Honor Magic 7 Lite 5G
  const imageUrl = 'https://www.hihonor.com/content/dam/honor/global/blog/2024/honor-magic6-lite-5g/blog-img1.jpg';
  
  try {
    const buffer = await downloadImage(imageUrl);
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    const updated = await prisma.product.update({
      where: { id: 'cms6h0j230001gnc4rnxmicy8' },
      data: {
        images: JSON.stringify([base64])
      }
    });

    console.log('✅ ¡IMAGEN DE HONOR MAGIC 7 LITE EMBEBIDA CON ÉXITO EN BASE DE DATOS!');
    console.log('Tamaño Base64:', base64.length, 'caracteres.');
  } catch (err) {
    console.error('Error al descargar:', err.message);
    
    // Fallback: Use reliable CDN
    const fallbackImage = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000';
    const updated = await prisma.product.update({
      where: { id: 'cms6h0j230001gnc4rnxmicy8' },
      data: {
        images: JSON.stringify([fallbackImage])
      }
    });
    console.log('✅ Fallback aplicado a Honor Magic 7 Lite en BD');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
