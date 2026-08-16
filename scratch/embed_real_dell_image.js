const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const imagePath = 'C:\\Users\\SANTIAGO\\Downloads\\WhatsApp Image 2026-08-15 at 3.48.28 PM.jpeg';

  if (!fs.existsSync(imagePath)) {
    console.error('No se encontró el archivo de la imagen en descargas:', imagePath);
    process.exit(1);
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  const updated = await prisma.product.update({
    where: { id: 'cmolsmu0l007h4w81sh2lemjp' },
    data: {
      images: JSON.stringify([
        base64Image,
        '/images/products/dell-aio-27.jpg'
      ])
    }
  });

  console.log('✅ ¡IMAGEN REAL DE DESCARGAS EMBEBIDA CON ÉXITO EN LA BASE DE DATOS!');
  console.log('ID:', updated.id);
  console.log('Tamaño de imagen Base64:', base64Image.length, 'caracteres.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
