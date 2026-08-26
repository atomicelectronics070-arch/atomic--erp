
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- UPDATING ALL ZKTECO & EZVIZ PRODUCT IMAGES IN DB ---");

  // Update ZKTeco products
  const zkProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'ZKTeco', mode: 'insensitive' } },
        { name: { contains: 'SenseFace', mode: 'insensitive' } },
        { name: { contains: 'Biometrico', mode: 'insensitive' } },
        { name: { contains: 'Portero', mode: 'insensitive' } }
      ]
    }
  });

  for (const p of zkProducts) {
    await prisma.product.update({
      where: { id: p.id },
      data: { images: '/assets/portero/portero2.jpeg' }
    });
    console.log("Updated ZK Image for:", p.name);
  }

  // Update EZVIZ and H6c products
  const ezProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'EZVIZ', mode: 'insensitive' } },
        { name: { contains: 'H6c', mode: 'insensitive' } },
        { name: { contains: 'Camara IP', mode: 'insensitive' } }
      ]
    }
  });

  for (const p of ezProducts) {
    await prisma.product.update({
      where: { id: p.id },
      data: { images: '/images/hero-3d/slide-2.jpg' }
    });
    console.log("Updated EZVIZ Image for:", p.name);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
