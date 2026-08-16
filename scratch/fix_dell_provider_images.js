const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const openCdnDellPhotos = [
  'https://m.media-amazon.com/images/I/71r35Z3sCLL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71oD4B9qYKL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71wLpW4BfRL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/61b-9U-0zYL._AC_SL1500_.jpg'
];

async function main() {
  const current = await prisma.product.findUnique({
    where: { id: 'cmolsmu0l007h4w81sh2lemjp' },
    select: { images: true }
  });

  let imagesList = [];
  try {
    imagesList = JSON.parse(current.images || '[]');
  } catch(e) {}

  // Keep the embedded flyer photo as primary, then use open CDN Dell AIO photos
  const base64Flyer = imagesList[0];
  const combined = [base64Flyer, ...openCdnDellPhotos];

  const updated = await prisma.product.update({
    where: { id: 'cmolsmu0l007h4w81sh2lemjp' },
    data: {
      images: JSON.stringify(combined)
    }
  });

  console.log('✅ GALERÍA CON IMÁGENES LIBRES DE BLOQUEO HOTLINK ACTUALIZADA:');
  console.log('Total imágenes en galería:', combined.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
