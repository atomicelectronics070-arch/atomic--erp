import { prisma } from '../src/lib/prisma';

async function main() {
  const campanas = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { name: { contains: 'modena', mode: 'insensitive' } },
        { name: { contains: 'bari', mode: 'insensitive' } },
        { name: { contains: 'treviso', mode: 'insensitive' } },
      ],
      isDeleted: false
    },
    select: {
      id: true,
      name: true,
      price: true,
      compareAtPrice: true,
    },
    take: 10
  });

  console.log('SAMPLE CAMPANAS PRICES IN DB:');
  campanas.forEach(c => {
    console.log(`- ${c.name} => price: $${c.price} | compareAtPrice: $${c.compareAtPrice}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
