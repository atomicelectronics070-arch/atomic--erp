const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function search() {
  const honorProds = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'honor', mode: 'insensitive' } },
        { name: { contains: 'magic', mode: 'insensitive' } },
        { name: { contains: 'celular', mode: 'insensitive' } },
        { name: { contains: 'phone', mode: 'insensitive' } },
        { name: { contains: 'redmi', mode: 'insensitive' } },
        { name: { contains: 'samsung', mode: 'insensitive' } },
      ],
      isDeleted: false,
    },
    take: 50,
  });

  console.log(`=== ENCONTRADOS (${honorProds.length}) ===`);
  honorProds.forEach(p => {
    console.log(`- ${p.name} | SKU: ${p.sku || 'N/A'} | $${p.price}`);
  });

  const categories = await prisma.category.findMany({
    where: { name: { contains: 'telef', mode: 'insensitive' } }
  });
  console.log('Categorías telefonía:', categories);

  await prisma.$disconnect();
}

search();
