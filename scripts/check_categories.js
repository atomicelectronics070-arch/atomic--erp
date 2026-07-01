const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });
  cats.forEach(c => console.log(c.name, c._count.products));
  
  const allProds = await prisma.product.findMany({
    take: 5,
    where: { categoryId: { not: null } },
    include: { category: true }
  });
  
  console.log('Sample products:');
  allProds.forEach(p => console.log(p.name, p.price, p.category?.name));
}

main().finally(() => prisma.$disconnect());
