const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    where: { category: { slug: 'industrial' } },
    select: { name: true, price: true }
  });
  
  let withPrice = 0;
  for (let p of prods) {
    if (p.price > 0) withPrice++;
    console.log(`- $${p.price} | ${p.name}`);
  }
  
  console.log(`\nTotal con precio: ${withPrice} / ${prods.length}`);
}

main().finally(() => prisma.$disconnect());
