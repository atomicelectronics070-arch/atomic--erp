const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    take: 30,
    select: {
      sku: true,
      name: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      category: { select: { name: true } }
    },
    orderBy: { price: 'desc' }
  });

  console.log('JSON_START');
  console.log(JSON.stringify(products));
  console.log('JSON_END');
  await prisma.();
}
main();