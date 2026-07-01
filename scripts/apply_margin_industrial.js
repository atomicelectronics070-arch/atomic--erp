const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function applyMargin() {
  const industrialCategory = await prisma.category.findUnique({
    where: { slug: 'industrial' }
  });

  if (!industrialCategory) {
    console.log("No Industrial category found.");
    return;
  }

  const products = await prisma.product.findMany({
    where: { categoryId: industrialCategory.id, price: { gt: 0 } }
  });

  console.log(`Found ${products.length} industrial products with price > 0.`);

  let updatedCount = 0;
  for (const p of products) {
    const newPrice = Number((p.price * 1.4).toFixed(2));
    await prisma.product.update({
      where: { id: p.id },
      data: { price: newPrice }
    });
    updatedCount++;
    console.log(`Updated ${p.name}: ${p.price} -> ${newPrice}`);
  }

  console.log(`Successfully applied 40% margin to ${updatedCount} products.`);
}

applyMargin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
