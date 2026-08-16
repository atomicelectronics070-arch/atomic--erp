const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findUnique({
    where: { id: 'cms6h0j230001gnc4rnxmicy8' },
    include: { category: true }
  });

  console.log('=== HONOR MAGIC 7 LITE RECORD ===');
  console.log('ID:', p.id);
  console.log('Name:', p.name);
  console.log('Price:', p.price);
  console.log('Stock:', p.stock);
  console.log('Category:', p.category ? p.category.name : 'N/A');
  console.log('Images:', p.images);
  console.log('Specs:', p.specs);
  console.log('Description:', p.description);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
