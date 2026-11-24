const { PrismaClient } = require('@prisma/client');
process.env.DATABASE_URL = "postgresql://postgres.kkvujjyohspdynxltwqo:Jp2024013gg002@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
const prisma = new PrismaClient();

async function run() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { products: true } }
    }
  });
  console.log('Categories:');
  for (const c of categories) {
    console.log(`[${c.id}] ${c.name} (${c._count.products} products)`);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
