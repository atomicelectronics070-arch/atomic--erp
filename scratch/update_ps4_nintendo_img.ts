import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Update Dualshock 4 (PS4) image to clean Amazon/Sony image
  await prisma.product.update({
    where: { id: 'cmsqwfekh0001arov88v0m6u5' },
    data: {
      images: JSON.stringify([
        'https://m.media-amazon.com/images/I/61IG46p-yLL._SL1500_.jpg'
      ])
    }
  });
  console.log('✅ Imagen Dualshock 4 PS4 actualizada');

  // Update Nintendo Switch Pro image to clean Nintendo image
  await prisma.product.update({
    where: { id: 'cmsqwfjjs000barovomntba6l' },
    data: {
      images: JSON.stringify([
        'https://m.media-amazon.com/images/I/61dYw46aBVL._SL1500_.jpg'
      ])
    }
  });
  console.log('✅ Imagen Nintendo Switch Pro actualizada');

  await prisma.$disconnect();
}

main().catch(console.error);
