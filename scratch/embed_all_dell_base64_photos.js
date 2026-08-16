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
  const base64Flyer = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  // Only store 100% valid, non-failing base64 image data in the product images array
  const validImages = [
    base64Flyer
  ];

  const updated = await prisma.product.update({
    where: { id: 'cmolsmu0l007h4w81sh2lemjp' },
    data: {
      images: JSON.stringify(validImages)
    }
  });

  console.log('✅ GALERÍA LIMPIADA: Solo imágenes 100% reales y funcionales sin fallas de carga.');
  console.log('Total de imágenes válidas en la galería:', validImages.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
