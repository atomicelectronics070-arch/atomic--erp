const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTorniquetes() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'torniquete', mode: 'insensitive' } },
        { name: { contains: 'molinete', mode: 'insensitive' } },
        { name: { contains: 'turnstile', mode: 'insensitive' } },
        { description: { contains: 'torniquete', mode: 'insensitive' } }
      ]
    },
    include: { category: true }
  });

  console.log(`Found ${products.length} products specifically matching torniquete/molinete/turnstile:`);
  products.forEach(p => {
    console.log(JSON.stringify({
      id: p.id,
      sku: p.sku,
      name: p.name,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      costPrice: p.costPrice,
      stock: p.stock,
      isActive: p.isActive,
      isDeleted: p.isDeleted,
      category: p.category ? p.category.name : null,
      images: p.images
    }, null, 2));
  });
}

checkTorniquetes().catch(console.error).finally(() => prisma.$disconnect());
