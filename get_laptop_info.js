const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const p = await prisma.product.findUnique({where: {id: 'cmolsnbis007u4w81jn4t5j6c'}});
  console.log(JSON.stringify(p, null, 2));
}
run().finally(() => prisma.$disconnect());
