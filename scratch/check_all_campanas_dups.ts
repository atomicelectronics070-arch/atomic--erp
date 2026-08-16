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
      category: { select: { name: true } },
      provider: true
    },
    orderBy: { name: 'asc' }
  });

  console.log('ALL CAMPANAS IN DB (CHECKING DUPLICATES & PRICES):');
  campanas.forEach(c => {
    console.log(`- [${c.id}] "${c.name}" | Cat: "${c.category?.name}" | Price: $${c.price} | CompareAt: $${c.compareAtPrice} | Provider: "${c.provider}"`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
