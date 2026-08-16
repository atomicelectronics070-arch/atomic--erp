const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, stock: true }
  });

  const emptyProducts = products.filter(p => p.stock === null || p.stock === undefined || p.stock <= 0);
  console.log(`Encontrados ${emptyProducts.length} productos sin stock de un total de ${products.length}.`);

  let updatedCount = 0;
  for (const p of emptyProducts) {
    const randomStock = Math.floor(Math.random() * 5) + 3; // 3, 4, 5, 6 o 7 unidades
    await prisma.product.update({
      where: { id: p.id },
      data: { stock: randomStock }
    });
    updatedCount++;
  }

  console.log(`✅ ¡ÉXITO TOTAL! Se inyectó stock genérico (entre 3 y 7 unidades) a ${updatedCount} productos en la Base de Datos.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
