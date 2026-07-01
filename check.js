const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const c = await prisma.product.count({ where: { categoryId: { not: null } } });
  console.log('Products categorized:', c);
  await prisma.$disconnect();
}
run();
