const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const providers = await prisma.product.groupBy({
    by: ['provider'],
    _count: { id: true }
  });
  console.log('=== PRODUCTOS POR PROVEEDOR EN DB ===');
  providers.sort((a,b) => b._count.id - a._count.id).forEach(p => {
    console.log(`- ${p.provider || 'Sin Proveedor (DB Local)'}: ${p._count.id} productos`);
  });

  const total = await prisma.product.count();
  console.log(`\nTotal productos en DB: ${total}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
