import { prisma } from '../src/lib/prisma';

async function main() {
  // Check categories
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { slug: { contains: 'campana', mode: 'insensitive' } },
        { name: { contains: 'extractor', mode: 'insensitive' } }
      ]
    }
  });

  // Check collections
  const collections = await prisma.collection.findMany({
    where: {
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { slug: { contains: 'campana', mode: 'insensitive' } }
      ]
    }
  });

  // Check products
  const productsCount = await prisma.product.count({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { description: { contains: 'campana', mode: 'insensitive' } }
      ]
    }
  });

  console.log("=== CATEGORÍAS CAMPANAS ===");
  console.log(JSON.stringify(categories, null, 2));

  console.log("=== COLECCIONES CAMPANAS ===");
  console.log(JSON.stringify(collections, null, 2));

  console.log("=== CANTIDAD PRODUCTOS CAMPANAS ===", productsCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());
