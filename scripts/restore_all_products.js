const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deletedProds = await prisma.product.findMany({
    where: { isDeleted: true },
    select: { id: true, name: true, price: true, category: { select: { name: true } } }
  });
  console.log(`Productos marcados como isDeleted=true (${deletedProds.length}):`);
  for (const p of deletedProds) {
    console.log(`- [${p.category ? p.category.name : 'S/C'}] ${p.name} ($${p.price})`);
  }
  
  // Reactivar todos para que el catálogo esté 100% íntegro
  await prisma.product.updateMany({
    where: { isDeleted: true },
    data: { isDeleted: false, isActive: true }
  });
  console.log('✅ Todos los productos han sido restaurados y activados.');
  
  const total = await prisma.product.count();
  const active = await prisma.product.count({ where: { isActive: true, isDeleted: false } });
  console.log(`\n🎉 TOTAL CATÁLOGO ATOMIC: ${active} de ${total} productos 100% PÚBLICOS Y DISPONIBLES EN TIENDA.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
