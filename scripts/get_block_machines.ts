import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'bloque', mode: 'insensitive' } },
        { name: { contains: 'block', mode: 'insensitive' } },
        { name: { contains: 'ladrillo', mode: 'insensitive' } },
        { description: { contains: 'bloque', mode: 'insensitive' } }
      ]
    },
    select: { id: true, name: true, sku: true, price: true, description: true, images: true, category: { select: { name: true } } }
  });

  console.log(`Found ${products.length} products related to bloques/block.`);
  for (const p of products) {
    console.log(`\nID: ${p.id}\nName: ${p.name}\nSKU: ${p.sku}\nPrice: ${p.price}\nCategory: ${p.category?.name}\nDesc: ${p.description}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
