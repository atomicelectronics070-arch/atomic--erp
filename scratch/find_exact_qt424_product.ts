import { prisma } from '../src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: '4-24', mode: 'insensitive' } },
        { name: { contains: '4 24', mode: 'insensitive' } },
        { name: { contains: 'QT4', mode: 'insensitive' } },
        { name: { contains: 'QT', mode: 'insensitive' } },
        { name: { contains: 'bloquera', mode: 'insensitive' } },
        { description: { contains: '4-24', mode: 'insensitive' } },
        { description: { contains: 'QT4-24', mode: 'insensitive' } },
      ]
    },
    select: { id: true, name: true, price: true, description: true, category: { select: { name: true } } }
  });

  console.log("=== EXACT PRODUCT MATCHES FOR QT4-24 ===");
  console.log(JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
