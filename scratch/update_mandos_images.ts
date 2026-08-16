import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  {
    id: 'cmsqwfhrf0007arov1nmplnio', // Xbox One Negro
    name: 'Xbox One Negro',
    images: JSON.stringify([
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuIewvtibzNp3g65Nz_63y-JNmj4x89p2WVSvPM7xRJLTJlJfTCoNGJe4&s=10'
    ])
  },
  {
    id: 'cmsqwfimr0009arov991zmlr3', // Xbox Series X|S Carbon Black
    name: 'Xbox Series X|S Carbon Black',
    images: JSON.stringify([
      'https://digitalserver.com.ec/wp-content/uploads/2025/05/jhhj.webp'
    ])
  },
  {
    id: 'cmsqwffib0003arovrdv50udx', // PS Portal Blanca
    name: 'PlayStation Portal Blanco',
    images: JSON.stringify([
      'https://i5.walmartimages.com/seo/PlayStation-Portal-Remote-Player-for-PS5-Console_a0af7ae4-2bf7-4e49-a5c7-26939b3e91d0.a94bca8df04fdc68fe213ba37d9245ca.jpeg'
    ])
  },
  {
    id: 'cmsqwfggs0005arov7qa5kp6m', // PS Portal Midnight Black
    name: 'PlayStation Portal Midnight Black',
    images: JSON.stringify([
      'https://images1.kabum.com.br/produtos/fotos/697721/playstation-portal-reprodutor-remoto-para-console-ps5-midnight-black-1000044181_1736940117_gg.jpg'
    ])
  }
];

async function main() {
  for (const u of updates) {
    await prisma.product.update({
      where: { id: u.id },
      data: { images: u.images }
    });
    console.log('Imagen actualizada:', u.name);
  }
  console.log('\nListo! 4 imagenes actualizadas.');
  console.log('NOTA: La imagen del mando PS4 tenia un blob URL (no compatible). Subela directamente al chat para actualizarla.');
  await prisma.$disconnect();
}
main().catch(console.error);
