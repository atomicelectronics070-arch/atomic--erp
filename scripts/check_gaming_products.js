const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkGaming() {
  const prods = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'PlayStation', mode: 'insensitive' } },
        { name: { contains: 'PS4', mode: 'insensitive' } },
        { name: { contains: 'PS5', mode: 'insensitive' } },
        { name: { contains: 'Nintendo', mode: 'insensitive' } },
        { name: { contains: 'Xbox', mode: 'insensitive' } },
        { name: { contains: 'Consola', mode: 'insensitive' } }
      ]
    },
    take: 20
  });

  console.log(`Found ${prods.length} gaming/console products:`);
  prods.forEach(p => console.log(p.id, '|', p.sku, '|', p.name, '|', p.price, '|', p.isDeleted));
}

checkGaming().finally(async () => {
  await prisma.$disconnect();
});
