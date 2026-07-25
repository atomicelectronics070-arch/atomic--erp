import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log("Available Categories:", categories.map(c => c.name));

  const laptops = await prisma.product.findMany({
    where: {
      category: {
        slug: { equals: 'laptops' }
      }
    },
    select: { id: true, name: true, sku: true, price: true }
  });

  console.log(`Found ${laptops.length} actual laptops in category 'laptops'.`);
  if (laptops.length > 0) {
    console.log(JSON.stringify(laptops, null, 2));
  } else {
    // maybe there's no category laptops. Let's find products that start with 'Laptop'
    const laptopsByName = await prisma.product.findMany({
      where: {
        name: { startsWith: 'Laptop', mode: 'insensitive' }
      },
      select: { id: true, name: true, sku: true, price: true }
    });
    console.log(`Found ${laptopsByName.length} products starting with 'Laptop'.`);
    console.log(JSON.stringify(laptopsByName.slice(0, 10), null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
