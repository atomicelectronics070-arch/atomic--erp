const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const unknowns = await prisma.product.findMany({
    where: { 
        OR: [
            { provider: null },
            { provider: 'Unknown' }
        ]
    },
    take: 20,
    select: { name: true, sku: true, provider: true }
  });
  
  console.log(JSON.stringify(unknowns, null, 2));
  await prisma.$disconnect();
}

main();
