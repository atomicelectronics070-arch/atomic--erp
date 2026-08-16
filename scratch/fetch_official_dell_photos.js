const https = require('https');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dellPhotos = [
  'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/inspiron-desktops/27-7720-aio/pdp/desktop-inspiron-27-7720-aio-pdp-hero-500-ng.psd?fmt=jpg&wid=1000',
  'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/inspiron-desktops/27-7720-aio/pdp/desktop-inspiron-27-7720-aio-pdp-gallery-1.psd?fmt=jpg&wid=1000',
  'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/inspiron-desktops/27-7720-aio/pdp/desktop-inspiron-27-7720-aio-pdp-gallery-2.psd?fmt=jpg&wid=1000',
  'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/inspiron-desktops/27-7720-aio/pdp/desktop-inspiron-27-7720-aio-pdp-gallery-3.psd?fmt=jpg&wid=1000'
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

  // Keep the embedded flyer photo as primary, then add official Dell provider photos
  const base64Flyer = imagesList[0];
  const combined = [base64Flyer, ...dellPhotos];

  const updated = await prisma.product.update({
    where: { id: 'cmolsmu0l007h4w81sh2lemjp' },
    data: {
      images: JSON.stringify(combined)
    }
  });

  console.log('✅ GALERÍA COMPLETA DEL PROVEEDOR DELL ACTUALIZADA CON ÉXITO:');
  console.log('Total imágenes en galería:', combined.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
