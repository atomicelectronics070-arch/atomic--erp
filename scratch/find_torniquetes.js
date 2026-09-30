const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const turnstiles = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'torniquete', mode: 'insensitive' } },
        { name: { contains: 'torniquetes', mode: 'insensitive' } },
        { name: { contains: 'barrera', mode: 'insensitive' } },
        { name: { contains: 'molinete', mode: 'insensitive' } },
        { name: { contains: 'antipanico', mode: 'insensitive' } },
        { description: { contains: 'torniquete', mode: 'insensitive' } }
      ]
    },
    include: { category: true }
  });

  console.log('FOUND TORNIQUETES TOTAL:', turnstiles.length);
  console.log(JSON.stringify(turnstiles.map(t => ({
    id: t.id,
    sku: t.sku,
    name: t.name,
    price: t.price,
    costPrice: t.costPrice,
    stock: t.stock,
    isActive: t.isActive,
    isDeleted: t.isDeleted,
    category: t.category ? t.category.name : null
  })), null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
