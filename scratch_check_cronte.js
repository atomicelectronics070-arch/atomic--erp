const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cronte = await prisma.product.findMany({
    where: { 
      provider: 'Cronte Technology',
      isDeleted: false 
    },
    select: { id: true, sku: true, name: true, price: true, compareAtPrice: true, provider: true, images: true },
    orderBy: { price: 'desc' }
  });

  console.log('Total Cronte Technology products in DB:', cronte.length);
  cronte.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.sku}] ${p.name} => $${p.price} USD (Reg: $${p.compareAtPrice})`);
  });
}

main().catch(console.error).finally(() => process.exit(0));
