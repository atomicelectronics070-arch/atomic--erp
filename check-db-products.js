const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    take: 20,
    select: {
      id: true,
      name: true,
      images: true,
      provider: true
    }
  });
  console.log("PRODUCTS SAMPLES:");
  products.forEach(p => {
    console.log(`- ID: ${p.id} | Name: ${p.name} | Provider: ${p.provider}`);
    console.log(`  Images JSON: ${p.images}`);
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
