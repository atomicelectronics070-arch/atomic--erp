
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'SenseFace', mode: 'insensitive' } },
        { name: { contains: 'H6c', mode: 'insensitive' } },
        { name: { contains: 'ZKTeco', mode: 'insensitive' } },
        { name: { contains: 'EZVIZ', mode: 'insensitive' } },
        { name: { contains: 'Control', mode: 'insensitive' } },
        { name: { contains: 'Camara', mode: 'insensitive' } }
      ]
    },
    take: 50
  });
  console.log("Database Query Matches Count:", products.length);
  products.forEach(p => {
    console.log(`- ID: ${p.id} | Name: ${p.name} | Price: $${p.price} | Category: ${p.category}`);
  });
}

main().catch(e => {
  console.error(e);
}).finally(() => {
  prisma.$disconnect();
});
