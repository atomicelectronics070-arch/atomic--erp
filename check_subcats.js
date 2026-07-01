const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const cats = await prisma.category.findMany({ where: { parentId: { not: null } }, select: { name: true, parentId: true } });
  console.log('Subcategories found:', cats.length);
  console.log(cats);
}
main().finally(() => prisma.$disconnect().catch(() => process.exit(0)));
