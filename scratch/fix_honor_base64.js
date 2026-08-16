const https = require('https');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(downloadImage(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function main() {
  const url = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000';
  const buffer = await downloadImage(url);
  const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;

  const updated = await prisma.product.update({
    where: { id: 'cms6h0j230001gnc4rnxmicy8' },
    data: {
      images: JSON.stringify([base64])
    }
  });

  console.log('✅ IMAGEN HD DE HONOR MAGIC 7 LITE EMBEBIDA EN BASE DE DATOS');
  console.log('ID:', updated.id);
  console.log('Tamaño Base64:', base64.length, 'caracteres.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
