const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.count({ where: { isDeleted: false } });
  const outOfStock = await prisma.product.count({ where: { isDeleted: false, stock: 0 } });
  const activeStock = await prisma.product.count({ where: { isDeleted: false, stock: { gt: 0 } } });

  console.log('=== ESTADO ACTUAL DEL INVENTARIO DB ===');
  console.log('Total Productos:', prods);
  console.log('Productos con Stock Activo (>0):', activeStock);
  console.log('Productos Marcados Agotados (=0):', outOfStock);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
