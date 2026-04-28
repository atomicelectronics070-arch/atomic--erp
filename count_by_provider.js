const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.product.count();
  const byProvider = await prisma.product.groupBy({
    by: ['provider'],
    _count: {
      id: true
    }
  });
  
  console.log('Total Products:', total);
  console.log('By Provider:');
  byProvider.forEach(p => {
    console.log(`- ${p.provider || 'Unknown'}: ${p._count.id}`);
  });
  
  await prisma.$disconnect();
}

main();
