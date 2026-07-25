const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const p = await prisma.product.findFirst({
    where: {
      OR: [
        { name: { contains: 'Acer Nitro V', mode: 'insensitive' } },
        { name: { contains: 'ANV16S', mode: 'insensitive' } }
      ]
    }
  });
  if (p) console.log('Found:', p.name, 'ID:', p.id, 'Price:', p.price);
  else console.log('Not found');
}
run().finally(() => prisma.$disconnect());
