
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    take: 25,
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

  console.log('PRODUCTS_JSON_START');
  console.log(JSON.stringify(products, null, 2));
  console.log('PRODUCTS_JSON_END');

  await prisma.();
}
main();
