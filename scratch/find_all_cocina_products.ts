import { prisma } from '../src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { category: { name: { contains: 'Cocina', mode: 'insensitive' } } },
        { name: { contains: 'Pared', mode: 'insensitive' } },
        { name: { contains: 'Isla', mode: 'insensitive' } },
        { name: { contains: 'Retractil', mode: 'insensitive' } },
        { name: { contains: 'Retráctil', mode: 'insensitive' } },
        { name: { contains: 'Campana', mode: 'insensitive' } },
        { name: { contains: 'Extractor', mode: 'insensitive' } },
        { name: { contains: 'Bari', mode: 'insensitive' } },
        { name: { contains: 'Modena', mode: 'insensitive' } },
        { name: { contains: 'Treviso', mode: 'insensitive' } },
        { specs: { contains: 'Isla', mode: 'insensitive' } },
        { specs: { contains: 'Pared', mode: 'insensitive' } },
        { specs: { contains: 'Retractil', mode: 'insensitive' } },
        { specs: { contains: 'campana', mode: 'insensitive' } },
      ]
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      category: { select: { name: true } },
      specs: true
    }
  });

  console.log(`FOUND ${products.length} KITCHEN/EXTRACTOR PRODUCTS:`);
  products.forEach(p => {
    console.log(`- ID: ${p.id} | Name: "${p.name}" | Category: "${p.category?.name}" | Price: $${p.price}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
