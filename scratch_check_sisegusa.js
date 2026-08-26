const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sisegusa = await prisma.product.findMany({
    where: { 
      OR: [
        { provider: { contains: 'Sisegusa', mode: 'insensitive' } },
        { provider: { contains: 'ZKTeco', mode: 'insensitive' } },
        { name: { contains: 'ZKTeco', mode: 'insensitive' } },
        { sku: { contains: 'ZK', mode: 'insensitive' } }
      ],
      isDeleted: false 
    },
    select: { id: true, sku: true, name: true, price: true, compareAtPrice: true, provider: true, category: { select: { name: true } }, images: true },
    orderBy: { price: 'desc' }
  });

  console.log('Total Sisegusa / ZKTeco products in DB:', sisegusa.length);
  sisegusa.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.sku}] ${p.name} => $${p.price} USD (Reg: $${p.compareAtPrice}) [${p.provider}] Cat: ${p.category?.name}`);
  });
}

main().catch(console.error).finally(() => process.exit(0));
