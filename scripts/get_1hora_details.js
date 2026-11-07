const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const prods = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'GAR159', mode: 'insensitive' } },
        { sku: { contains: 'GAR159', mode: 'insensitive' } },
        { description: { contains: 'GAR159', mode: 'insensitive' } },
        { name: { contains: 'GAR276', mode: 'insensitive' } },
        { sku: { contains: 'GAR276', mode: 'insensitive' } }
      ]
    }
  });
  console.log('Matched products:', prods.length);
  prods.forEach(p => {
    console.log(JSON.stringify({
      id: p.id,
      sku: p.sku,
      name: p.name,
      price: p.price,
      description: p.description?.slice(0, 150),
      images: p.images
    }, null, 2));
  });
}

check().finally(async () => {
  await prisma.$disconnect();
});
