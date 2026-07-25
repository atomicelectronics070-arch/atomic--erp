const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function run() {
  const campanas = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { category: { name: { contains: 'campana', mode: 'insensitive' } } },
        { category: { name: { contains: 'extractor', mode: 'insensitive' } } }
      ],
      price: { gt: 200 },
      isDeleted: false
    },
    include: { category: true }
  });
  
  fs.writeFileSync('campanas_200.json', JSON.stringify(campanas, null, 2));
  console.log('Encontradas', campanas.length, 'campanas > $200');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
