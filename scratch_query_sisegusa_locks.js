const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const locks = await prisma.product.findMany({
    where: { 
      provider: 'Sisegusa',
      OR: [
        { name: { contains: 'Cerradura', mode: 'insensitive' } },
        { name: { contains: 'Chapa', mode: 'insensitive' } },
        { name: { contains: 'Electroiman', mode: 'insensitive' } },
        { name: { contains: 'Perno', mode: 'insensitive' } },
        { name: { contains: 'Hotelera', mode: 'insensitive' } },
        { sku: { contains: 'ZK-C', mode: 'insensitive' } },
        { sku: { contains: 'TL400', mode: 'insensitive' } },
        { sku: { contains: 'TL800', mode: 'insensitive' } },
        { sku: { contains: 'LH6000', mode: 'insensitive' } },
        { sku: { contains: 'LL-01', mode: 'insensitive' } }
      ],
      isDeleted: false 
    },
    select: { id: true, sku: true, name: true, price: true, compareAtPrice: true, provider: true, category: { select: { name: true } }, images: true },
    orderBy: { price: 'desc' }
  });

  console.log('Total Sisegusa lock products in DB:', locks.length);
  locks.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.sku}] ${p.name} => $${p.price} USD (Reg: $${p.compareAtPrice})`);
  });
}

main().catch(console.error).finally(() => process.exit(0));
