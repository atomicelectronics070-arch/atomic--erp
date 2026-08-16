import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Update Dualshock 4 (PS4) image URL
  await prisma.product.update({
    where: { id: 'cmsqwfekh0001arov88v0m6u5' },
    data: {
      images: JSON.stringify([
        'https://m.media-amazon.com/images/I/71d9U+F5lbL._AC_UF1000,1000_QL80_.jpg'
      ])
    }
  });
  console.log('✅ Imagen PS4 Dualshock 4 actualizada');

  // Update Nintendo Switch Pro image URL
  await prisma.product.update({
    where: { id: 'cmsqwfjjs000barovomntba6l' },
    data: {
      images: JSON.stringify([
        'https://mobilestore.ec/wp-content/uploads/2024/02/Control-Pro-de-Nintendo-Switch-Mobile-Store-Ecuador2.jpg'
      ])
    }
  });
  console.log('✅ Imagen Nintendo Switch Pro actualizada');

  await prisma.$disconnect();
}

main().catch(console.error);
