const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- REVISANDO PRODUCTOS INACTIVOS Y CATEGORÍAS OCULTAS ---');
  
  // 1. Categorías ocultas
  const hiddenCats = await prisma.category.findMany({
    where: { isVisible: false }
  });
  console.log(`Categorías con isVisible=false: ${hiddenCats.length}`);
  if (hiddenCats.length > 0) {
    console.log('Activando visibilidad de todas las categorías...');
    await prisma.category.updateMany({
      where: { isVisible: false },
      data: { isVisible: true }
    });
    console.log('✅ Todas las categorías ahora tienen isVisible = true');
  }

  // 2. Productos inactivos
  const inactiveProds = await prisma.product.findMany({
    where: { isActive: false }
  });
  console.log(`Productos con isActive=false: ${inactiveProds.length}`);
  for (const p of inactiveProds) {
    console.log(`- Inactivo: ${p.name} (ID: ${p.id})`);
  }

  // 3. Activando todos los productos para que estén públicos en la tienda
  const updateRes = await prisma.product.updateMany({
    where: { isActive: false, isDeleted: false },
    data: { isActive: true }
  });
  console.log(`✅ Productos reactivados a isActive=true: ${updateRes.count}`);

  // 4. Verificando estado final
  const total = await prisma.product.count();
  const publicCount = await prisma.product.count({ where: { isActive: true, isDeleted: false } });
  console.log(`\nESTADO FINAL DE TIENDA: ${publicCount} de ${total} productos están 100% PÚBLICOS Y ACTIVOS.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
