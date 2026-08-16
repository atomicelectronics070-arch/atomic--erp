import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const psConsoles = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: 'PlayStation 4', mode: 'insensitive' } },
        { name: { contains: 'PlayStation 5', mode: 'insensitive' } },
        { name: { contains: 'PS4', mode: 'insensitive' } },
        { name: { contains: 'PS5', mode: 'insensitive' } },
      ]
    },
    select: { id: true, name: true, price: true }
  });

  console.log('CONSOLAS PLAYSTATION EN ENCONTRADAS:');
  console.log(JSON.stringify(psConsoles, null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
