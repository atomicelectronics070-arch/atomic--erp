const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("=== SEARCHING ALL TORNIQUETES & ACCESS CONTROL GATES ===");

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'torniquete', mode: 'insensitive' } },
        { name: { contains: 'torniquetes', mode: 'insensitive' } },
        { name: { contains: 'molinete', mode: 'insensitive' } },
        { name: { contains: 'turnstile', mode: 'insensitive' } },
        { name: { contains: 'tripode', mode: 'insensitive' } },
        { name: { contains: 'trípode', mode: 'insensitive' } },
        { name: { contains: 'pass', mode: 'insensitive' } },
        { name: { contains: 'antipanico', mode: 'insensitive' } },
        { name: { contains: 'antipánico', mode: 'insensitive' } },
        { description: { contains: 'torniquete', mode: 'insensitive' } },
        { description: { contains: 'molinete', mode: 'insensitive' } }
      ]
    },
    include: { category: true }
  });

  console.log(`Found ${products.length} potential torniquete / access control products.`);

  products.forEach(p => {
    console.log(`- [${p.id}] SKU: ${p.sku || 'N/A'} | Name: "${p.name}" | Price: $${p.price} | Stock: ${p.stock} | Active: ${p.isActive} | Cat: ${p.category ? p.category.name : 'N/A'}`);
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
