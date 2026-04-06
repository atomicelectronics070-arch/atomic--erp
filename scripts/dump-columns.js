const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    for (const table of ['Category', 'Collection', 'Product']) {
      const columns = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table}'`);
      console.log(`COLUMNS FOR ${table}:`, JSON.stringify(columns, null, 2));
    }
  } catch (err) {
    console.error('ERROR fetching columns:', err);
  }
}

main().finally(() => prisma.$disconnect());
