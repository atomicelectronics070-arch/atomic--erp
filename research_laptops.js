const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const laptops = await prisma.product.findMany({
    where: {
      category: {
        contains: 'Laptop',
        mode: 'insensitive'
      }
    }
  });
  console.log(JSON.stringify(laptops.map(l => ({ id: l.id, name: l.name, price: l.price })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
