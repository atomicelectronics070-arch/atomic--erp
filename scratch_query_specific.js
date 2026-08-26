
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    where: {
      OR: [
        { id: { contains: 'zkteco' } },
        { id: { contains: 'ezviz' } },
        { name: { contains: 'zkteco', mode: 'insensitive' } },
        { name: { contains: 'ezviz', mode: 'insensitive' } }
      ]
    }
  });
  console.log("Specific ZK/EZVIZ Query Matches:", prods.length);
  prods.forEach(p => console.log(`- ${p.id} | ${p.name}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
