const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
});

async function main() {
  try {
    const count = await prisma.product.count();
    console.log('Total products in dev.db:', count);
    const latest = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { name: true, createdAt: true }
    });
    console.log('Latest 5 products:', JSON.stringify(latest, null, 2));
  } catch (error) {
    console.error('Error reading dev.db:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
