import { prisma } from '../src/lib/prisma';

async function main() {
  const count = await prisma.product.count({
    where: { isDeleted: false, isActive: true }
  });
  console.log(`TOTAL ACTIVE PRODUCTS IN DB: ${count}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
