const path = require('path');
const { PrismaClient } = require(path.join(__dirname, 'node_modules', '@prisma/client'));
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: 'encimera', mode: 'insensitive' } },
        { slug: { contains: 'encimera', mode: 'insensitive' } },
        { name: { contains: 'cocina', mode: 'insensitive' } }
      ]
    }
  });
  console.log('ENCIMERAS_CATS:', JSON.stringify(cats, null, 2));

  const prods = await prisma.product.findMany({
    where: {
      name: { contains: 'encimera', mode: 'insensitive' },
      isDeleted: false
    },
    take: 5,
    select: { id: true, name: true, price: true, category: true }
  });
  console.log('ENCIMERA_PRODS:', JSON.stringify(prods, null, 2));

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
