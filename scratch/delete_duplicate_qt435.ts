import { prisma } from '../src/lib/prisma';

async function main() {
  // Mark duplicate QT4-35 (cmqx9x71z0001vmyex7r2dewu) as deleted & inactive
  const duplicate = await prisma.product.update({
    where: { id: "cmqx9x71z0001vmyex7r2dewu" },
    data: {
      isDeleted: true,
      isActive: false
    }
  });

  console.log("=== ELIMINADO PRODUCTO DUPLICADO QT4-35 ===");
  console.log(duplicate.id, duplicate.name);
}

main().catch(console.error).finally(() => prisma.$disconnect());
