const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const cats = await prisma.category.findMany({ select: { name: true, slug: true, isVisible: true } });
    console.log('CATEGORIES:', JSON.stringify(cats, null, 2));
  } catch (err) {
    if (err.code === 'P2022') {
      console.log('COLUMN_MISSING: isVisible');
    } else {
      console.error(err);
    }
  }
}

main().finally(() => prisma.$disconnect());
