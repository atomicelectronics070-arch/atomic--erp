import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'laptop', mode: 'insensitive' } },
        { name: { contains: 'ryzen', mode: 'insensitive' } },
        { name: { contains: 'intel', mode: 'insensitive' } },
        { name: { contains: 'asus', mode: 'insensitive' } },
        { name: { contains: 'msi', mode: 'insensitive' } },
        { name: { contains: 'lenovo', mode: 'insensitive' } }
      ]
    },
    take: 10
  });

  for (const p of products) {
    console.log(`Name: ${p.name}`);
    console.log(`Images: ${p.images}\n---`);
  }
}

main().finally(() => prisma.$disconnect());
