import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const collectionCount = await prisma.collection.count();
  
  console.log(`Products: ${productCount}`);
  console.log(`Categories: ${categoryCount}`);
  console.log(`Collections: ${collectionCount}`);

  // Fetch a sample product if any
  if (productCount > 0) {
    const sampleProduct = await prisma.product.findFirst();
    console.log('Sample product:', sampleProduct);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
